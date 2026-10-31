// Chesster Main Application Controller
// Manages accounts, ELO progression, coach interactions, matchmaking, arena gameplay, and training mode.

class ChessterApp {
  constructor() {
    this.user = null;
    this.activeCoach = null;
    this.game = null;
    this.botAi = new ChessterBotAI();
    this.currentOpponent = null;

    // Game state
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.pendingPromotion = null;
    this.botThinking = false;
    this.playerColor = 'w';
    this.clocks = { player: 300, opponent: 300 }; // 5-minute blitz
    this.clockInterval = null;
    this.lastMoveQuality = null;

    // Training mode state
    this.trainingGame = null;
    this.currentPuzzle = null;
    this.trainingSelectedSquare = null;

    this.init();
  }

  init() {
    this.loadUser();
    this.setupEventListeners();
    this.renderNavigation();

    if (!this.user) {
      this.openRegisterModal();
    } else {
      this.activeCoach = getCoachById(this.user.coachId || 'magnus');
      this.renderHome();
    }
  }

  // --- USER & ELO STORAGE ---
  loadUser() {
    const raw = localStorage.getItem('chesster_user_profile');
    if (raw) {
      try {
        this.user = JSON.parse(raw);
        if (typeof this.user.elo !== 'number') {
          this.user.elo = 1000;
        }
      } catch (e) {
        this.user = null;
      }
    }
  }

  saveUser() {
    if (this.user) {
      localStorage.setItem('chesster_user_profile', JSON.stringify(this.user));
      this.renderNavigation();
    }
  }

  createNewAccount(username, avatar) {
    this.user = {
      username: username.trim() || 'Grandmaster_Baru',
      avatar: avatar || '♟️',
      elo: 1000, // Starts at 1000 ELO as requested
      coachId: 'magnus', // default, user will select right after
      stats: {
        wins: 0,
        losses: 0,
        draws: 0
      },
      history: []
    };
    this.saveUser();
  }

  getRankTitle(elo) {
    if (elo >= 2600) return 'Grandmaster (GM)';
    if (elo >= 2400) return 'International Master (IM)';
    if (elo >= 2200) return 'Master (FM)';
    if (elo >= 1800) return 'Candidate Master';
    if (elo >= 1500) return 'Club Contender';
    if (elo >= 1200) return 'Tactician';
    return 'Pemula (Apprentice)';
  }

  // --- NAVIGATION & VIEWS ---
  switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`${viewName}-view`);
    if (target) {
      target.classList.add('active');
    }

    if (viewName === 'home') {
      this.stopClock();
      this.renderHome();
    } else if (viewName === 'training') {
      this.stopClock();
      this.renderTraining();
    }
  }

  renderNavigation() {
    if (!this.user) return;

    const eloEl = document.getElementById('nav-user-elo');
    const nameEl = document.getElementById('nav-user-name');
    const avatarEl = document.getElementById('nav-user-avatar');
    const coachEl = document.getElementById('nav-coach-name');
    const coachFlagEl = document.getElementById('nav-coach-flag');

    if (eloEl) eloEl.textContent = this.user.elo;
    if (nameEl) nameEl.textContent = this.user.username;
    if (avatarEl) avatarEl.textContent = this.user.avatar;

    const coach = getCoachById(this.user.coachId);
    if (coachEl) coachEl.textContent = coach.name;
    if (coachFlagEl) coachFlagEl.textContent = coach.flag;
  }

  renderHome() {
    if (!this.user) return;
    const coach = getCoachById(this.user.coachId);

    // Welcome titles
    const welcomeUser = document.getElementById('home-welcome-name');
    const welcomeTitle = document.getElementById('home-user-rank');
    if (welcomeUser) welcomeUser.textContent = this.user.username;
    if (welcomeTitle) welcomeTitle.textContent = this.getRankTitle(this.user.elo);

    // Coach widget
    const widgetName = document.getElementById('home-coach-name');
    const widgetTitle = document.getElementById('home-coach-title');
    const widgetQuote = document.getElementById('home-coach-quote');
    const widgetAvatar = document.getElementById('home-coach-avatar');

    if (widgetName) widgetName.textContent = coach.name;
    if (widgetTitle) widgetTitle.textContent = `${coach.flag} ${coach.title}`;
    if (widgetQuote) widgetQuote.textContent = `"${coach.quote}"`;
    if (widgetAvatar) widgetAvatar.innerHTML = coach.avatarSvg;

    // Stats bar
    const winsEl = document.getElementById('stat-wins');
    const lossesEl = document.getElementById('stat-losses');
    const drawsEl = document.getElementById('stat-draws');
    const totalEl = document.getElementById('stat-total');

    const totalGames = this.user.stats.wins + this.user.stats.losses + this.user.stats.draws;
    if (winsEl) winsEl.textContent = this.user.stats.wins;
    if (lossesEl) lossesEl.textContent = this.user.stats.losses;
    if (drawsEl) drawsEl.textContent = this.user.stats.draws;
    if (totalEl) totalEl.textContent = totalGames;

    // Render match history
    this.renderMatchHistory();
  }

  renderMatchHistory() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    if (!this.user.history || this.user.history.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 2rem;">Belum ada riwayat pertandingan. Klik <strong>Main Sekarang</strong> untuk bertanding catur!</td></tr>`;
      return;
    }

    tbody.innerHTML = this.user.history.slice(-10).reverse().map(item => {
      let badgeClass = 'badge-win';
      let deltaClass = 'elo-delta-pos';
      let deltaText = `+${item.delta}`;

      if (item.result === 'loss') {
        badgeClass = 'badge-loss';
        deltaClass = 'elo-delta-neg';
        deltaText = `-${item.delta}`;
      } else if (item.result === 'draw') {
        badgeClass = 'badge-draw';
        deltaClass = 'elo-delta-zero';
        deltaText = item.delta >= 0 ? `+${item.delta}` : `${item.delta}`;
      }

      const oppTitleBadge = item.title ? `<span class="title-badge-gm" style="margin-right: 4px;">${item.title}</span>` : '';

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span>${item.country || '🌐'}</span>
              ${oppTitleBadge}
              <strong>${item.opponent}</strong>
            </div>
          </td>
          <td><span style="color: var(--accent-gold);">${item.opponentElo}</span></td>
          <td><span class="badge-result ${badgeClass}">${item.result}</span></td>
          <td><span class="${deltaClass}">${deltaText} ELO</span> (${item.newElo})</td>
          <td style="color: var(--text-dim); font-size: 0.8rem;">${item.date}</td>
        </tr>
      `;
    }).join('');
  }

  // --- MATCHMAKING & ARENA (VS FAKE AI ONLINE) ---
  startMatchmaking(forceGM = false) {
    const overlay = document.getElementById('matchmaking-overlay');
    const statusText = document.getElementById('matchmaking-status-text');
    const detailsText = document.getElementById('matchmaking-details-text');

    overlay.classList.add('active');
    if (forceGM) {
      statusText.textContent = "Mencari Grandmaster Dunia...";
      detailsText.textContent = "Menghubungkan ke arena Grandmaster (Rating 2500+ ELO)...";
    } else {
      statusText.textContent = "Mencari Lawan Online Seimbang...";
      detailsText.textContent = `Mencari pemain setara di rating ~${this.user.elo} ELO...`;
    }

    window.chessterAudio.playMatchFound();

    setTimeout(() => {
      // Pick opponent
      this.currentOpponent = ChessterBotAI.generateOpponent(this.user.elo, forceGM);

      statusText.textContent = "Lawan Ditemukan!";
      const titlePrefix = this.currentOpponent.title ? `[${this.currentOpponent.title}] ` : '';
      detailsText.textContent = `${this.currentOpponent.country} ${titlePrefix}${this.currentOpponent.name} (${this.currentOpponent.elo} ELO - ${this.currentOpponent.style})`;

      setTimeout(() => {
        overlay.classList.remove('active');
        this.startMatchGame();
      }, 1200);
    }, 1500);
  }

  startMatchGame() {
    this.game = new ChessterGame();
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.pendingPromotion = null;
    this.lastMoveQuality = null;
    this.botThinking = false;
    this.clocks = { player: 300, opponent: 300 };

    this.switchView('arena');
    this.renderArenaInfo();
    this.renderBoard();
    this.renderMovesList();
    this.startClock();

    // Coach welcoming speech for the match
    const coach = getCoachById(this.user.coachId);
    this.updateCoachSpeech(coach.reactions.gameStart);
  }

  renderArenaInfo() {
    const opp = this.currentOpponent;
    const coach = getCoachById(this.user.coachId);

    // Opponent info
    const oppName = document.getElementById('arena-opp-name');
    const oppElo = document.getElementById('arena-opp-elo');
    const oppAvatar = document.getElementById('arena-opp-avatar');
    const oppTitle = document.getElementById('arena-opp-title');

    if (oppName) oppName.textContent = opp.name;
    if (oppElo) oppElo.textContent = `${opp.country} ★ ${opp.elo} ELO${opp.style ? ` • ${opp.style}` : ''}`;
    if (oppAvatar) oppAvatar.textContent = opp.avatar;
    if (oppTitle) {
      if (opp.title) {
        oppTitle.className = `title-badge-${opp.title.toLowerCase()}`;
        oppTitle.textContent = opp.title;
        oppTitle.style.display = 'inline-block';
      } else {
        oppTitle.style.display = 'none';
      }
    }

    // Player info
    const meName = document.getElementById('arena-player-name');
    const meElo = document.getElementById('arena-player-elo');
    const meAvatar = document.getElementById('arena-player-avatar');

    if (meName) meName.textContent = this.user.username;
    if (meElo) meElo.textContent = `★ ${this.user.elo} ELO (${this.getRankTitle(this.user.elo)})`;
    if (meAvatar) meAvatar.textContent = this.user.avatar;

    // Coach sidecar in arena
    const coachAvatar = document.getElementById('arena-coach-avatar');
    const coachName = document.getElementById('arena-coach-name');
    if (coachAvatar) coachAvatar.innerHTML = coach.avatarSvg;
    if (coachName) coachName.textContent = `Coach ${coach.name}`;
  }

  updateCoachSpeech(text, type = 'normal') {
    const speechEl = document.getElementById('arena-coach-speech');
    if (speechEl) {
      speechEl.style.opacity = '0';
      setTimeout(() => {
        speechEl.className = `coach-live-speech ${type ? `speech-${type}` : ''}`;
        speechEl.textContent = text;
        speechEl.style.opacity = '1';
      }, 150);
    }
  }

  renderBoard() {
    const boardEl = document.getElementById('arena-chessboard');
    if (!boardEl || !this.game) return;

    boardEl.innerHTML = '';
    const inCheck = this.game.isCheck();
    const kingCoords = inCheck ? this.game.findKing(this.game.turn) : null;
    const lastMove = this.game.history.length > 0 ? this.game.history[this.game.history.length - 1] : null;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isDark = (r + c) % 2 === 1;
        sq.className = `square ${isDark ? 'dark' : 'light'}`;
        sq.dataset.row = r;
        sq.dataset.col = c;

        // Check if selected
        if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
          sq.classList.add('selected');
        }

        // Check if last move square
        if (lastMove) {
          const fromCoords = this.game.squareToCoords(lastMove.from);
          const toCoords = this.game.squareToCoords(lastMove.to);
          if ((fromCoords.r === r && fromCoords.c === c) || (toCoords.r === r && toCoords.c === c)) {
            sq.classList.add('last-move');
          }
        }

        // Check if king in check
        if (kingCoords && kingCoords.r === r && kingCoords.c === c) {
          sq.classList.add('in-check');
        }

        // Coordinates annotations on edge squares
        if (c === 7) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'square-coord coord-rank';
          rankLabel.textContent = 8 - r;
          sq.appendChild(rankLabel);
        }
        if (r === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'square-coord coord-file';
          fileLabel.textContent = String.fromCharCode('a'.charCodeAt(0) + c);
          sq.appendChild(fileLabel);
        }

        // Piece rendering
        const piece = this.game.board[r][c];
        if (piece) {
          const pieceSvg = getPieceSvg(piece.color, piece.type);
          sq.innerHTML += pieceSvg;
        }

        // Move hint indicators
        const isLegalDest = this.legalMovesForSelected.some(m => m.to.r === r && m.to.c === c);
        if (isLegalDest) {
          const hint = document.createElement('div');
          hint.className = piece ? 'hint-capture' : 'hint-dot';
          sq.appendChild(hint);
        }

        // Move quality badge (Brilliant !! / Best ! / Blunder ??)
        if (this.lastMoveQuality && this.lastMoveQuality.r === r && this.lastMoveQuality.c === c) {
          sq.innerHTML += getMoveBadgeSvg(this.lastMoveQuality.quality);
        }

        sq.addEventListener('click', () => this.handleSquareClick(r, c));
        boardEl.appendChild(sq);
      }
    }
  }

  handleSquareClick(r, c) {
    if (this.botThinking) return;
    if (this.game.turn !== this.playerColor) return;

    const clickedPiece = this.game.board[r][c];

    // If already selected a piece, check if clicking on legal destination
    if (this.selectedSquare) {
      const matchMove = this.legalMovesForSelected.find(m => m.to.r === r && m.to.c === c);
      if (matchMove) {
        // Check for pawn promotion
        const piece = this.game.board[this.selectedSquare.r][this.selectedSquare.c];
        if (piece && piece.type === 'p' && (r === 0 || r === 7)) {
          this.pendingPromotion = matchMove;
          this.openPromotionModal();
          return;
        }

        this.executePlayerMove(matchMove);
        return;
      }
    }

    // Otherwise, select piece if it belongs to player
    if (clickedPiece && clickedPiece.color === this.playerColor) {
      this.selectedSquare = { r, c };
      this.legalMovesForSelected = this.game.getLegalMoves({ r, c });
      this.renderBoard();
    } else {
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      this.renderBoard();
    }
  }

  evaluatePlayerMoveQuality(move, evalBefore, evalAfter, bestMove) {
    const piece = this.game.board[move.to.r][move.to.c];
    if (!piece) return 'normal';
    const diff = evalAfter - evalBefore;

    const isBestMove = bestMove &&
      bestMove.from.r === move.from.r && bestMove.from.c === move.from.c &&
      bestMove.to.r === move.to.r && bestMove.to.c === move.to.c;

    const enemyColor = this.playerColor === 'w' ? 'b' : 'w';
    const isAttacked = this.game.isSquareAttacked(move.to.r, move.to.c, enemyColor);

    const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    const pieceVal = pieceValues[piece.type] || 100;
    const capturedVal = move.captured ? (pieceValues[move.captured.type] || 100) : 0;

    // 1. BRILLIANT:
    // KHUSUS PENGORBANAN JENIUS (Genius Sacrifice) sesuai permintaan user!
    // Syarat: Mengorbankan perwira berharga di petak terancam, dan hasil kalkulasinya tetap menang/unggul!
    const isGeniusSacrifice = isAttacked && pieceVal > capturedVal && pieceVal >= 300 && (isBestMove || diff >= -40 || evalAfter >= 40);

    if (isGeniusSacrifice) {
      return 'brilliant';
    }

    // 2. BLUNDER (Salah langkah):
    // - Large negative evaluation swing (diff <= -170)
    // - Or leaving a major piece hanging without compensation
    const isHangingPiece = isAttacked && pieceVal > (capturedVal + 100) && diff <= -100;
    if (diff <= -170 || isHangingPiece) {
      return 'blunder';
    }

    // 3. LANGKAH TERBAIK (Best Move dengan icon Bintang Hijau Olive):
    // - Engine's best move, or position is improved (diff >= 25)
    if (isBestMove || diff >= 25) {
      return 'best';
    }

    return 'normal';
  }

  executePlayerMove(move) {
    // 1. Evaluate position before move
    const evalBefore = this.botAi.evaluateBoard(this.game, this.playerColor);
    const bestMove = this.botAi.findMove(this.game, 2400);

    // 2. Execute move
    const res = this.game.makeMove(move);
    this.selectedSquare = null;
    this.legalMovesForSelected = [];

    // 3. Evaluate position after move & classify quality
    const evalAfter = this.botAi.evaluateBoard(this.game, this.playerColor);
    const quality = this.evaluatePlayerMoveQuality(move, evalBefore, evalAfter, bestMove);
    this.lastMoveQuality = { r: move.to.r, c: move.to.c, quality };
    res.quality = quality;

    const coach = getCoachById(this.user.coachId);

    if (quality === 'brilliant') {
      res.san += '!!';
      window.chessterAudio.playBrilliant();
      this.updateCoachSpeech(`🌟 PENGORBANAN JENIUS!! BRILIAN!! Wow, anda teliti sekali mengorbankan perwira demi serangan mematikan!`, 'brilliant');
    } else if (quality === 'best') {
      if (res.captured) {
        window.chessterAudio.playCapture();
      } else {
        window.chessterAudio.playMove();
      }
      this.updateCoachSpeech(`⭐ LANGKAH TERBAIK! Wow, anda teliti sekali! Langkah paling optimal dan akurat di posisi ini.`, 'best');
    } else if (quality === 'blunder') {
      res.san += '??';
      window.chessterAudio.playBlunder();
      this.updateCoachSpeech(`⚠️ Waduh, itu langkah blunder! Langkah tersebut salah dan membuat perwiramu dalam bahaya!`, 'blunder');
    } else {
      // Normal move
      if (res.captured) {
        window.chessterAudio.playCapture();
      } else {
        window.chessterAudio.playMove();
      }

      if (this.game.isCheck()) {
        window.chessterAudio.playCheck();
        this.updateCoachSpeech(coach.reactions.playerCheck, 'normal');
      } else if (Math.random() < 0.3) {
        this.updateCoachSpeech(coach.reactions.goodMove, 'normal');
      }
    }

    this.renderBoard();
    this.renderMovesList();

    // Check game over
    const status = this.game.isGameOver();
    if (status.over) {
      this.handleGameOver(status);
      return;
    }

    // Trigger Bot turn
    this.triggerBotTurn();
  }

  triggerBotTurn() {
    this.botThinking = true;
    const thinkingBadge = document.getElementById('bot-thinking-status');
    if (thinkingBadge) {
      thinkingBadge.textContent = `${this.currentOpponent.name} sedang berpikir...`;
      thinkingBadge.style.display = 'inline-flex';
    }

    // Realistic human-like delay (1.2 to 2.8 seconds)
    const delay = Math.floor(Math.random() * 1600) + 1200;

    setTimeout(() => {
      if (!this.game || this.game.turn === this.playerColor) {
        this.botThinking = false;
        if (thinkingBadge) thinkingBadge.style.display = 'none';
        return;
      }

      const botMove = this.botAi.findMove(this.game, this.currentOpponent.elo);
      this.botThinking = false;
      if (thinkingBadge) thinkingBadge.style.display = 'none';

      if (!botMove) {
        // No legal move
        const status = this.game.isGameOver();
        this.handleGameOver(status);
        return;
      }

      const res = this.game.makeMove(botMove);
      if (res.captured) {
        window.chessterAudio.playCapture();
      } else {
        window.chessterAudio.playMove();
      }

      if (botMove.isBotBlunder) {
        res.san += '??';
        res.quality = 'blunder';
        this.lastMoveQuality = { r: botMove.to.r, c: botMove.to.c, quality: 'blunder' };
        window.chessterAudio.playBlunder();
        this.updateCoachSpeech(`⚡ KESEMPATAN! Lawan baru saja melakukan langkah blunder fatal (${res.san})! Amati celah perwira mereka dan serang sekarang!`, 'blunder');
      } else if (this.game.isCheck()) {
        window.chessterAudio.playCheck();
        const coach = getCoachById(this.user.coachId);
        this.updateCoachSpeech(coach.reactions.opponentCheck, 'normal');
      }

      this.renderBoard();
      this.renderMovesList();

      const status = this.game.isGameOver();
      if (status.over) {
        this.handleGameOver(status);
      }
    }, delay);
  }

  renderMovesList() {
    const listEl = document.getElementById('arena-moves-list');
    if (!listEl || !this.game) return;

    listEl.innerHTML = '';
    const moves = this.game.history;
    for (let i = 0; i < moves.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'move-row';
      const moveNum = Math.floor(i / 2) + 1;

      let whiteClass = 'move-white';
      if (moves[i]) {
        if (moves[i].quality === 'brilliant') whiteClass += ' move-tag-brilliant';
        else if (moves[i].quality === 'blunder') whiteClass += ' move-tag-blunder';
        else if (moves[i].quality === 'best') whiteClass += ' move-tag-best';
      }

      let blackClass = 'move-black';
      if (moves[i + 1]) {
        if (moves[i + 1].quality === 'blunder') blackClass += ' move-tag-blunder';
        else if (moves[i + 1].quality === 'brilliant') blackClass += ' move-tag-brilliant';
      }

      const whiteMove = moves[i] ? moves[i].san : '';
      const blackMove = moves[i + 1] ? moves[i + 1].san : '';

      row.innerHTML = `
        <span class="move-num">${moveNum}.</span>
        <span class="${whiteClass}">${whiteMove}</span>
        <span class="${blackClass}">${blackMove}</span>
      `;
      listEl.appendChild(row);
    }
    listEl.scrollTop = listEl.scrollHeight;
  }

  // --- CLOCKS ---
  startClock() {
    this.stopClock();
    this.clockInterval = setInterval(() => {
      if (!this.game) return;
      if (this.game.turn === this.playerColor) {
        this.clocks.player--;
        if (this.clocks.player <= 0) {
          this.clocks.player = 0;
          this.handleGameOver({ over: true, winner: 'b', reason: 'Waktu Habis (Flagged)' });
        }
      } else {
        this.clocks.opponent--;
        if (this.clocks.opponent <= 0) {
          this.clocks.opponent = 0;
          this.handleGameOver({ over: true, winner: 'w', reason: 'Waktu Habis (Lawan Flagged)' });
        }
      }
      this.updateClockDisplays();
    }, 1000);
  }

  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  updateClockDisplays() {
    const fmt = s => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const playerBox = document.getElementById('arena-player-clock');
    const oppBox = document.getElementById('arena-opp-clock');

    if (playerBox) {
      playerBox.textContent = fmt(this.clocks.player);
      playerBox.className = `player-clock-box ${this.game && this.game.turn === this.playerColor ? 'active' : ''}`;
    }
    if (oppBox) {
      oppBox.textContent = fmt(this.clocks.opponent);
      oppBox.className = `player-clock-box ${this.game && this.game.turn !== this.playerColor ? 'active' : ''}`;
    }
  }

  // --- GAME OVER & ELO PROGRESSION ---
  handleGameOver(status) {
    this.stopClock();
    const oldElo = this.user.elo;
    let result = 'draw';
    let delta = 0;
    const coach = getCoachById(this.user.coachId);
    let coachMessage = '';

    if (status.winner === this.playerColor) {
      result = 'win';
      // User requirement: bertambah yang banyak (10, 11, 12, 13, 14, 15 ELO bukan cuma +1)
      const baseBigWin = [10, 11, 12, 12, 11, 10, 13, 14, 15];
      delta = baseBigWin[Math.floor(Math.random() * baseBigWin.length)];

      // Bonus jika mengalahkan Grandmaster
      if (this.currentOpponent && this.currentOpponent.elo >= 2400) {
        delta += Math.floor(Math.random() * 4) + 2; // +12 to +19 ELO
      }

      this.user.elo = oldElo + delta;
      this.user.stats.wins++;
      window.chessterAudio.playVictory();
      coachMessage = coach.reactions.win;
    } else if (status.winner && status.winner !== this.playerColor) {
      result = 'loss';
      // Kalah berkurang secara acak (bisa 1 - 12 berkurang)
      delta = Math.floor(Math.random() * 12) + 1;
      this.user.elo = Math.max(100, oldElo - delta);
      this.user.stats.losses++;
      window.chessterAudio.playDefeat();
      coachMessage = coach.reactions.loss;
    } else {
      result = 'draw';
      delta = 0;
      this.user.stats.draws++;
      coachMessage = coach.reactions.draw;
    }

    // Save to match history
    const historyItem = {
      opponent: this.currentOpponent.name,
      title: this.currentOpponent.title,
      country: this.currentOpponent.country,
      opponentElo: this.currentOpponent.elo,
      result,
      delta,
      oldElo,
      newElo: this.user.elo,
      date: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    this.user.history.push(historyItem);
    this.saveUser();

    // Show Game Over Modal
    this.openGameOverModal(result, delta, oldElo, this.user.elo, status.reason, coachMessage);
  }

  openGameOverModal(result, delta, oldElo, newElo, reason, coachMessage) {
    const modal = document.getElementById('gameover-modal');
    const iconEl = document.getElementById('gameover-icon');
    const titleEl = document.getElementById('gameover-title');
    const reasonEl = document.getElementById('gameover-reason');
    const oldEloEl = document.getElementById('gameover-old-elo');
    const newEloEl = document.getElementById('gameover-new-elo');
    const diffEl = document.getElementById('gameover-elo-diff');
    const coachMsgEl = document.getElementById('gameover-coach-msg');
    const coachAvatarEl = document.getElementById('gameover-coach-avatar');

    const coach = getCoachById(this.user.coachId);
    if (coachAvatarEl) coachAvatarEl.innerHTML = coach.avatarSvg;
    if (coachMsgEl) coachMsgEl.textContent = `"${coachMessage}"`;

    if (result === 'win') {
      iconEl.textContent = '🏆';
      titleEl.textContent = 'KEMENANGAN TELAK!';
      diffEl.textContent = `+${delta} ELO`;
      diffEl.className = 'elo-diff-pill badge-win';
    } else if (result === 'loss') {
      iconEl.textContent = '💔';
      titleEl.textContent = 'KEKALAHAN!';
      diffEl.textContent = `-${delta} ELO`;
      diffEl.className = 'elo-diff-pill badge-loss';
    } else {
      iconEl.textContent = '🤝';
      titleEl.textContent = 'PERMAINAN REMIS!';
      diffEl.textContent = `+0 ELO`;
      diffEl.className = 'elo-diff-pill badge-draw';
    }

    reasonEl.textContent = reason === 'checkmate' ? 'Skakmat di atas papan catur' : (reason || 'Pertandingan selesai');
    oldEloEl.textContent = `${oldElo} ELO`;
    newEloEl.textContent = `${newElo} ELO`;

    modal.classList.add('active');
  }

  resignGame() {
    if (!this.game) return;
    const confirmResign = confirm("Apakah kamu yakin ingin menyerah pada pertandingan ini?");
    if (confirmResign) {
      this.handleGameOver({ over: true, winner: 'b', reason: 'Pemain Menyerah (Resignation)' });
    }
  }

  offerDraw() {
    // Simulated opponent draw response based on balance
    const roll = Math.random();
    if (roll < 0.35) {
      alert(`${this.currentOpponent.name} menerima tawaran remis!`);
      this.handleGameOver({ over: true, winner: null, reason: 'Kesepakatan Bersama (Draw Agreed)' });
    } else {
      alert(`${this.currentOpponent.name}: "Saya menolak tawaran remis, mari kita selesaikan!"`);
    }
  }

  // --- COACH SELECTION MODAL ---
  openCoachSelector() {
    const modal = document.getElementById('coach-modal');
    const grid = document.getElementById('coaches-selection-grid');
    if (!grid) return;

    grid.innerHTML = COACHES_DATA.map(coach => {
      const isSelected = this.user && this.user.coachId === coach.id;
      return `
        <div class="coach-select-card ${isSelected ? 'selected' : ''}" data-coach-id="${coach.id}">
          <div class="coach-avatar-card">${coach.avatarSvg}</div>
          <div class="coach-name-card">${coach.name}</div>
          <div class="coach-title-card">${coach.flag} ${coach.title}</div>
          <div class="coach-tagline-card">${coach.tagline}</div>
          <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.75rem; line-height: 1.35;">${coach.bio}</p>
          <div class="coach-stats-row">
            <span>⚔️ Serang: ${coach.stats.attack}</span>
            <span>🛡️ Tahan: ${coach.stats.defense}</span>
            <span>⚡ Taktik: ${coach.stats.tactics}</span>
          </div>
          <button class="btn-primary" style="width: 100%; margin-top: 0.85rem; padding: 0.5rem; font-size: 0.85rem;">
            ${isSelected ? 'Coach Aktif' : 'Pilih Sebagai Coach'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.coach-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const coachId = card.dataset.coachId;
        this.selectCoach(coachId);
        modal.classList.remove('active');
      });
    });

    modal.classList.add('active');
  }

  selectCoach(coachId) {
    if (!this.user) return;
    this.user.coachId = coachId;
    this.activeCoach = getCoachById(coachId);
    this.saveUser();
    this.renderHome();
    alert(`Selamat! Kamu kini dilatih oleh ${this.activeCoach.name}. "${this.activeCoach.quote}"`);
  }

  // --- REGISTRATION MODAL ---
  openRegisterModal() {
    const modal = document.getElementById('register-modal');
    modal.classList.add('active');

    // Avatar selections
    const avatars = ['♟️', '♞', '♝', '♜', '♛', '♚', '👑', '⚡'];
    const avatarGrid = document.getElementById('avatar-options-grid');
    if (avatarGrid) {
      avatarGrid.innerHTML = avatars.map((av, idx) => `
        <div class="avatar-option ${idx === 0 ? 'selected' : ''}" data-avatar="${av}">${av}</div>
      `).join('');

      avatarGrid.querySelectorAll('.avatar-option').forEach(el => {
        el.addEventListener('click', () => {
          avatarGrid.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
          el.classList.add('selected');
        });
      });
    }
  }

  submitRegisterForm() {
    const nameInput = document.getElementById('reg-username-input');
    const username = nameInput ? nameInput.value.trim() : '';

    if (!username) {
      alert('Silakan masukkan nama pengguna atau username catur kamu!');
      return;
    }

    const selectedAvatarEl = document.querySelector('.avatar-option.selected');
    const avatar = selectedAvatarEl ? selectedAvatarEl.dataset.avatar : '♟️';

    this.createNewAccount(username, avatar);
    document.getElementById('register-modal').classList.remove('active');

    // Immediately prompt to pick coach as requested
    this.openCoachSelector();
  }

  // --- PROMOTION MODAL ---
  openPromotionModal() {
    const modal = document.getElementById('promotion-modal');
    modal.classList.add('active');
  }

  selectPromotionPiece(pieceType) {
    document.getElementById('promotion-modal').classList.remove('active');
    if (this.pendingPromotion) {
      this.pendingPromotion.promotion = pieceType;
      this.executePlayerMove(this.pendingPromotion);
      this.pendingPromotion = null;
    }
  }

  // --- BERLATIH DENGAN COACH (TRAINING MODE) ---
  renderTraining() {
    const coach = getCoachById(this.user.coachId);
    const coachNameEl = document.getElementById('training-coach-name');
    const coachAvatarEl = document.getElementById('training-coach-avatar');
    const coachBioEl = document.getElementById('training-coach-bio');
    const coachQuoteEl = document.getElementById('training-coach-quote');

    if (coachNameEl) coachNameEl.textContent = coach.name;
    if (coachAvatarEl) coachAvatarEl.innerHTML = coach.avatarSvg;
    if (coachBioEl) coachBioEl.textContent = coach.bio;
    if (coachQuoteEl) coachQuoteEl.textContent = `"${coach.quote}"`;

    // Load coach puzzle
    const puzzle = coach.trainingPuzzles && coach.trainingPuzzles[0]
      ? coach.trainingPuzzles[0]
      : {
          title: "Taktik Sentral: Serangan Raja",
          description: "Temukan langkah terbaik untuk menekan formasi lawan.",
          fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
          solution: ["e1g1"],
          hint: "Amankan raja dengan rokade (O-O) sebelum memulai serangan badai!"
        };

    this.currentPuzzle = puzzle;
    const puzzleTitleEl = document.getElementById('training-puzzle-title');
    const puzzleDescEl = document.getElementById('training-puzzle-desc');
    const puzzleHintEl = document.getElementById('training-puzzle-hint');

    if (puzzleTitleEl) puzzleTitleEl.textContent = puzzle.title;
    if (puzzleDescEl) puzzleDescEl.textContent = puzzle.description;
    if (puzzleHintEl) puzzleHintEl.textContent = `💡 Hint Coach ${coach.name}: ${puzzle.hint}`;

    this.trainingGame = new ChessterGame(puzzle.fen);
    this.trainingSelectedSquare = null;
    this.renderTrainingBoard();
  }

  renderTrainingBoard() {
    const boardEl = document.getElementById('training-chessboard');
    if (!boardEl || !this.trainingGame) return;

    boardEl.innerHTML = '';
    const legals = this.trainingSelectedSquare ? this.trainingGame.getLegalMoves(this.trainingSelectedSquare) : [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isDark = (r + c) % 2 === 1;
        sq.className = `square ${isDark ? 'dark' : 'light'}`;

        if (this.trainingSelectedSquare && this.trainingSelectedSquare.r === r && this.trainingSelectedSquare.c === c) {
          sq.classList.add('selected');
        }

        const piece = this.trainingGame.board[r][c];
        if (piece) {
          sq.innerHTML += getPieceSvg(piece.color, piece.type);
        }

        const isLegalDest = legals.some(m => m.to.r === r && m.to.c === c);
        if (isLegalDest) {
          const hint = document.createElement('div');
          hint.className = piece ? 'hint-capture' : 'hint-dot';
          sq.appendChild(hint);
        }

        sq.addEventListener('click', () => this.handleTrainingSquareClick(r, c));
        boardEl.appendChild(sq);
      }
    }
  }

  handleTrainingSquareClick(r, c) {
    if (!this.trainingGame) return;
    const clickedPiece = this.trainingGame.board[r][c];

    if (this.trainingSelectedSquare) {
      const legals = this.trainingGame.getLegalMoves(this.trainingSelectedSquare);
      const match = legals.find(m => m.to.r === r && m.to.c === c);

      if (match) {
        const moveStr = `${this.trainingGame.coordsToSquare(match.from.r, match.from.c)}${this.trainingGame.coordsToSquare(match.to.r, match.to.c)}`;
        this.trainingGame.makeMove(match);
        window.chessterAudio.playMove();
        this.trainingSelectedSquare = null;
        this.renderTrainingBoard();

        // Check against solution
        const coach = getCoachById(this.user.coachId);
        if (this.currentPuzzle.solution.includes(moveStr)) {
          window.chessterAudio.playVictory();
          alert(`🎉 BRILIAN! Coach ${coach.name}: "Langkah tepat! Analisismu tajam bagaikan grandmaster!"`);
        } else {
          alert(`Coach ${coach.name}: "Langkah itu menarik, tapi belum optimal. Coba perhatikan hint lagi!"`);
        }
        return;
      }
    }

    if (clickedPiece && clickedPiece.color === this.trainingGame.turn) {
      this.trainingSelectedSquare = { r, c };
      this.renderTrainingBoard();
    } else {
      this.trainingSelectedSquare = null;
      this.renderTrainingBoard();
    }
  }

  // --- EVENT LISTENERS ---
  setupEventListeners() {
    // Navigation
    document.getElementById('nav-brand').addEventListener('click', () => this.switchView('home'));
    document.getElementById('nav-btn-home').addEventListener('click', () => this.switchView('home'));
    document.getElementById('nav-coach-pill').addEventListener('click', () => this.openCoachSelector());
    document.getElementById('home-btn-change-coach').addEventListener('click', () => this.openCoachSelector());

    // Sound toggle
    const soundBtn = document.getElementById('nav-btn-audio');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        window.chessterAudio.muted = !window.chessterAudio.muted;
        soundBtn.textContent = window.chessterAudio.muted ? '🔇' : '🔊';
      });
    }

    // Home action buttons
    document.getElementById('btn-play-now').addEventListener('click', () => this.startMatchmaking(false));
    document.getElementById('btn-challenge-gm').addEventListener('click', () => this.startMatchmaking(true));
    document.getElementById('btn-train-coach').addEventListener('click', () => this.switchView('training'));

    // Arena controls
    document.getElementById('arena-btn-resign').addEventListener('click', () => this.resignGame());
    document.getElementById('arena-btn-draw').addEventListener('click', () => this.offerDraw());
    document.getElementById('arena-btn-home').addEventListener('click', () => {
      if (this.game && !this.game.isGameOver().over) {
        const exit = confirm("Keluar dari pertandingan akan dianggap menyerah. Lanjutkan?");
        if (!exit) return;
        this.handleGameOver({ over: true, winner: 'b', reason: 'Pemain Meninggalkan Laga' });
      }
      this.switchView('home');
    });

    // Game over modal buttons
    document.getElementById('gameover-btn-playagain').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.remove('active');
      this.startMatchmaking(false);
    });
    document.getElementById('gameover-btn-home').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.remove('active');
      this.switchView('home');
    });

    // Register button
    document.getElementById('btn-submit-register').addEventListener('click', () => this.submitRegisterForm());

    // Promotion piece selections
    document.querySelectorAll('.promotion-piece-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const piece = btn.dataset.piece;
        this.selectPromotionPiece(piece);
      });
    });

    // Training action buttons
    document.getElementById('training-btn-reset').addEventListener('click', () => this.renderTraining());
    document.getElementById('training-btn-change-coach').addEventListener('click', () => this.openCoachSelector());
    document.getElementById('training-btn-back-home').addEventListener('click', () => this.switchView('home'));
  }
}

// Instantiate App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.chessterApp = new ChessterApp();
});
