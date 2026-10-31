// Chesster Complete Chess Rules Engine
// Self-contained, robust standard chess logic: legal move generation, castling, en-passant, promotion, checkmate, stalemate, FEN, SAN.

class ChessterGame {
  constructor(fen) {
    this.reset(fen);
  }

  reset(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.turn = 'w';
    this.castling = { w: { k: true, q: true }, b: { k: true, q: true } };
    this.enPassant = null; // { r, c }
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.history = [];
    this.capturedPieces = { w: [], b: [] }; // pieces captured by white, by black
    this.loadFen(fen);
  }

  loadFen(fen) {
    const parts = fen.trim().split(/\s+/);
    const rows = parts[0].split('/');
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 8; r++) {
      let c = 0;
      for (const ch of rows[r]) {
        if (ch >= '1' && ch <= '8') {
          c += parseInt(ch, 10);
        } else {
          const color = ch === ch.toUpperCase() ? 'w' : 'b';
          const type = ch.toLowerCase();
          this.board[r][c] = { type, color };
          c++;
        }
      }
    }

    this.turn = parts[1] || 'w';
    const cast = parts[2] || '-';
    this.castling = {
      w: { k: cast.includes('K'), q: cast.includes('Q') },
      b: { k: cast.includes('k'), q: cast.includes('q') }
    };

    if (parts[3] && parts[3] !== '-') {
      this.enPassant = this.squareToCoords(parts[3]);
    } else {
      this.enPassant = null;
    }

    this.halfMoves = parts[4] ? parseInt(parts[4], 10) : 0;
    this.fullMoves = parts[5] ? parseInt(parts[5], 10) : 1;
  }

  getFen() {
    let fen = '';
    for (let r = 0; r < 8; r++) {
      let empty = 0;
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (!piece) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          const ch = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
          fen += ch;
        }
      }
      if (empty > 0) fen += empty;
      if (r < 7) fen += '/';
    }

    fen += ` ${this.turn} `;
    let cast = '';
    if (this.castling.w.k) cast += 'K';
    if (this.castling.w.q) cast += 'Q';
    if (this.castling.b.k) cast += 'k';
    if (this.castling.b.q) cast += 'q';
    fen += (cast || '-') + ' ';

    if (this.enPassant) {
      fen += this.coordsToSquare(this.enPassant.r, this.enPassant.c);
    } else {
      fen += '-';
    }

    fen += ` ${this.halfMoves} ${this.fullMoves}`;
    return fen;
  }

  coordsToSquare(r, c) {
    const file = String.fromCharCode('a'.charCodeAt(0) + c);
    const rank = 8 - r;
    return `${file}${rank}`;
  }

  squareToCoords(sq) {
    const c = sq.charCodeAt(0) - 'a'.charCodeAt(0);
    const r = 8 - parseInt(sq[1], 10);
    return { r, c };
  }

  cloneState() {
    return {
      board: this.board.map(row => row.map(cell => cell ? { ...cell } : null)),
      turn: this.turn,
      castling: {
        w: { ...this.castling.w },
        b: { ...this.castling.b }
      },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      halfMoves: this.halfMoves,
      fullMoves: this.fullMoves
    };
  }

  restoreState(state) {
    this.board = state.board.map(row => row.map(cell => cell ? { ...cell } : null));
    this.turn = state.turn;
    this.castling = {
      w: { ...state.castling.w },
      b: { ...state.castling.b }
    };
    this.enPassant = state.enPassant ? { ...state.enPassant } : null;
    this.halfMoves = state.halfMoves;
    this.fullMoves = state.fullMoves;
  }

  findKing(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.type === 'k' && p.color === color) {
          return { r, c };
        }
      }
    }
    return null;
  }

  isSquareAttacked(r, c, byColor) {
    // Pawn attacks
    const pawnDir = byColor === 'w' ? 1 : -1;
    const attackerPawnRow = r + pawnDir;
    if (attackerPawnRow >= 0 && attackerPawnRow < 8) {
      for (const dc of [-1, 1]) {
        const ac = c + dc;
        if (ac >= 0 && ac < 8) {
          const p = this.board[attackerPawnRow][ac];
          if (p && p.color === byColor && p.type === 'p') return true;
        }
      }
    }

    // Knight attacks
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p && p.color === byColor && p.type === 'n') return true;
      }
    }

    // King attacks
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const p = this.board[nr][nc];
          if (p && p.color === byColor && p.type === 'k') return true;
        }
      }
    }

    // Straight lines (Rook / Queen)
    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === byColor && (p.type === 'r' || p.type === 'q')) return true;
          break; // blocked
        }
        nr += dr;
        nc += dc;
      }
    }

    // Diagonal lines (Bishop / Queen)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === byColor && (p.type === 'b' || p.type === 'q')) return true;
          break; // blocked
        }
        nr += dr;
        nc += dc;
      }
    }

    return false;
  }

  isCheck(color = this.turn) {
    const king = this.findKing(color);
    if (!king) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(king.r, king.c, enemy);
  }

  // Generates pseudo-legal moves for a specific square
  getPseudoMoves(r, c) {
    const piece = this.board[r][c];
    if (!piece || piece.color !== this.turn) return [];
    const moves = [];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';

    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRank = color === 'w' ? 6 : 1;
      const promoRank = color === 'w' ? 0 : 7;

      // 1 square forward
      const f1r = r + dir;
      if (f1r >= 0 && f1r < 8 && !this.board[f1r][c]) {
        if (f1r === promoRank) {
          for (const promo of ['q', 'r', 'b', 'n']) {
            moves.push({ from: { r, c }, to: { r: f1r, c }, promotion: promo });
          }
        } else {
          moves.push({ from: { r, c }, to: { r: f1r, c } });
        }

        // 2 squares forward
        const f2r = r + 2 * dir;
        if (r === startRank && !this.board[f2r][c]) {
          moves.push({ from: { r, c }, to: { r: f2r, c }, isDoublePawn: true });
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const cr = r + dir;
        const cc = c + dc;
        if (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
          const target = this.board[cr][cc];
          if (target && target.color === enemy) {
            if (cr === promoRank) {
              for (const promo of ['q', 'r', 'b', 'n']) {
                moves.push({ from: { r, c }, to: { r: cr, c: cc }, promotion: promo, captured: target });
              }
            } else {
              moves.push({ from: { r, c }, to: { r: cr, c: cc }, captured: target });
            }
          } else if (this.enPassant && this.enPassant.r === cr && this.enPassant.c === cc) {
            // En-passant capture
            const capturedPawn = this.board[r][cc];
            moves.push({ from: { r, c }, to: { r: cr, c: cc }, isEnPassant: true, captured: capturedPawn });
          }
        }
      }
    } else if (piece.type === 'n') {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = this.board[nr][nc];
          if (!target) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc } });
          } else if (target.color === enemy) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target });
          }
        }
      }
    } else if (piece.type === 'b' || piece.type === 'r' || piece.type === 'q') {
      const dirs = [];
      if (piece.type === 'b' || piece.type === 'q') {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (piece.type === 'r' || piece.type === 'q') {
        dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      for (const [dr, dc] of dirs) {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = this.board[nr][nc];
          if (!target) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc } });
          } else {
            if (target.color === enemy) {
              moves.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    } else if (piece.type === 'k') {
      // 1 square all directions
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = this.board[nr][nc];
            if (!target) {
              moves.push({ from: { r, c }, to: { r: nr, c: nc } });
            } else if (target.color === enemy) {
              moves.push({ from: { r, c }, to: { r: nr, c: nc }, captured: target });
            }
          }
        }
      }

      // Castling
      const rank = color === 'w' ? 7 : 0;
      if (r === rank && c === 4 && !this.isCheck(color)) {
        // Kingside castling O-O
        if (this.castling[color].k) {
          if (!this.board[rank][5] && !this.board[rank][6]) {
            if (!this.isSquareAttacked(rank, 5, enemy) && !this.isSquareAttacked(rank, 6, enemy)) {
              moves.push({ from: { r, c }, to: { r: rank, c: 6 }, isCastlingKingside: true });
            }
          }
        }
        // Queenside castling O-O-O
        if (this.castling[color].q) {
          if (!this.board[rank][1] && !this.board[rank][2] && !this.board[rank][3]) {
            if (!this.isSquareAttacked(rank, 2, enemy) && !this.isSquareAttacked(rank, 3, enemy)) {
              moves.push({ from: { r, c }, to: { r: rank, c: 2 }, isCastlingQueenside: true });
            }
          }
        }
      }
    }

    return moves;
  }

  // Get all legal moves for current player
  getLegalMoves(fromSquare = null) {
    const legalMoves = [];
    let startRow = 0, endRow = 7, startCol = 0, endCol = 7;

    if (fromSquare) {
      const coords = typeof fromSquare === 'string' ? this.squareToCoords(fromSquare) : fromSquare;
      startRow = endRow = coords.r;
      startCol = endCol = coords.c;
    }

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const piece = this.board[r][c];
        if (piece && piece.color === this.turn) {
          const pseudoMoves = this.getPseudoMoves(r, c);
          for (const m of pseudoMoves) {
            if (this.testMoveLegality(m)) {
              legalMoves.push(m);
            }
          }
        }
      }
    }

    return legalMoves;
  }

  testMoveLegality(move) {
    const state = this.cloneState();
    this.executeMoveInternal(move, true);
    const inCheck = this.isCheck(state.turn);
    this.restoreState(state);
    return !inCheck;
  }

  executeMoveInternal(move, isSimulated = false) {
    const { from, to } = move;
    const piece = this.board[from.r][from.c];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';

    // Move piece
    this.board[to.r][to.c] = piece;
    this.board[from.r][from.c] = null;

    // Pawn promotion
    if (move.promotion) {
      this.board[to.r][to.c] = { type: move.promotion, color };
    }

    // En passant capture
    if (move.isEnPassant) {
      this.board[from.r][to.c] = null;
    }

    // Castling rook move
    if (move.isCastlingKingside) {
      const rook = this.board[from.r][7];
      this.board[from.r][5] = rook;
      this.board[from.r][7] = null;
    } else if (move.isCastlingQueenside) {
      const rook = this.board[from.r][0];
      this.board[from.r][3] = rook;
      this.board[from.r][0] = null;
    }

    // Castling rights update
    if (piece.type === 'k') {
      this.castling[color].k = false;
      this.castling[color].q = false;
    } else if (piece.type === 'r') {
      if (from.r === (color === 'w' ? 7 : 0) && from.c === 7) this.castling[color].k = false;
      if (from.r === (color === 'w' ? 7 : 0) && from.c === 0) this.castling[color].q = false;
    }

    // If enemy rook captured in corner
    if (to.r === (enemy === 'w' ? 7 : 0)) {
      if (to.c === 7) this.castling[enemy].k = false;
      if (to.c === 0) this.castling[enemy].q = false;
    }

    // En passant target square update
    if (move.isDoublePawn) {
      this.enPassant = { r: (from.r + to.r) / 2, c: from.c };
    } else {
      this.enPassant = null;
    }

    // Turn & move counters
    this.turn = enemy;
    if (color === 'b') {
      this.fullMoves++;
    }
    if (piece.type === 'p' || move.captured) {
      this.halfMoves = 0;
    } else {
      this.halfMoves++;
    }
  }

  // User-facing move function
  makeMove(moveOrSan) {
    let move = null;
    if (typeof moveOrSan === 'string') {
      // Format like "e2e4" or SAN like "Nf3"
      move = this.findMoveByString(moveOrSan);
    } else {
      // Find matching legal move
      const legalMoves = this.getLegalMoves(moveOrSan.from);
      move = legalMoves.find(m =>
        m.to.r === moveOrSan.to.r &&
        m.to.c === moveOrSan.to.c &&
        (!moveOrSan.promotion || m.promotion === moveOrSan.promotion)
      );
    }

    if (!move) return null;

    const fromSq = this.coordsToSquare(move.from.r, move.from.c);
    const toSq = this.coordsToSquare(move.to.r, move.to.c);
    const piece = this.board[move.from.r][move.from.c];
    const isCapture = !!move.captured || move.isEnPassant;

    // Track captured piece for scoreboard
    if (move.captured) {
      this.capturedPieces[this.turn].push(move.captured.type);
    }

    // Record SAN
    const san = this.formatSan(move, piece, isCapture);

    // Execute
    this.executeMoveInternal(move);

    const historyRecord = {
      from: fromSq,
      to: toSq,
      piece: piece.type,
      color: piece.color,
      captured: isCapture,
      san,
      fen: this.getFen()
    };
    this.history.push(historyRecord);

    return historyRecord;
  }

  formatSan(move, piece, isCapture) {
    if (move.isCastlingKingside) return 'O-O';
    if (move.isCastlingQueenside) return 'O-O-O';

    let san = '';
    const toSq = this.coordsToSquare(move.to.r, move.to.c);

    if (piece.type === 'p') {
      if (isCapture) {
        const fromFile = String.fromCharCode('a'.charCodeAt(0) + move.from.c);
        san += `${fromFile}x${toSq}`;
      } else {
        san += toSq;
      }
      if (move.promotion) {
        san += `=${move.promotion.toUpperCase()}`;
      }
    } else {
      san += piece.type.toUpperCase();
      if (isCapture) san += 'x';
      san += toSq;
    }

    return san;
  }

  findMoveByString(str) {
    // Check 4-character move e.g. "e2e4" or "e7e8q"
    if (/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(str)) {
      const from = this.squareToCoords(str.slice(0, 2));
      const to = this.squareToCoords(str.slice(2, 4));
      const promo = str[4] || null;
      const legals = this.getLegalMoves(from);
      return legals.find(m => m.to.r === to.r && m.to.c === to.c && (!promo || m.promotion === promo));
    }
    return null;
  }

  isGameOver() {
    const legals = this.getLegalMoves();
    if (legals.length === 0) {
      return {
        over: true,
        winner: this.isCheck() ? (this.turn === 'w' ? 'b' : 'w') : null,
        reason: this.isCheck() ? 'checkmate' : 'stalemate'
      };
    }
    if (this.halfMoves >= 100) {
      return { over: true, winner: null, reason: '50-move rule' };
    }
    return { over: false, winner: null, reason: null };
  }
}

window.ChessterGame = ChessterGame;
