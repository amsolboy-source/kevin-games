// Chesster High-Definition SVG Chess Pieces
// Lightweight, responsive, crisp on all screen resolutions

const CHESS_PIECES_SVG = {
  // White Pieces
  wp: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#1c1917" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  wn: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" stroke="#1c1917" stroke-width="1.5"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.06 1.45-1 1-1.25-.6-.7-2-1-3-.7-3 2.5-4 4.5-4 1.5 0 2.5.5 3.5 1" fill="#fff" stroke="#1c1917" stroke-width="1.5"/><circle cx="15.5" cy="20.5" r="1.5" fill="#1c1917"/></svg>`,

  wb: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5"/></g></svg>`,

  wr: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="#fff" fill-rule="evenodd" stroke="#1c1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1-16.5h15l1 16.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"/></g></svg>`,

  wq: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="#fff" fill-rule="evenodd" stroke="#1c1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-7-14-7 14-7-11 2 12zm0 0c0 4 3 6.5 5 7.5 4.5 2 10.5 2 17 0 2-1 5-3.5 5-7.5M11 38.5h23"/></g></svg>`,

  wk: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="none" fill-rule="evenodd" stroke="#1c1917" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23 20c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,

  // Black Pieces
  bp: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#292524" stroke="#f5f5f4" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  bn: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#292524" stroke="#f5f5f4" stroke-width="1.5"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.06 1.45-1 1-1.25-.6-.7-2-1-3-.7-3 2.5-4 4.5-4 1.5 0 2.5.5 3.5 1" fill="#292524" stroke="#f5f5f4" stroke-width="1.5"/><circle cx="15.5" cy="20.5" r="1.5" fill="#f5f5f4"/></svg>`,

  bb: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="none" fill-rule="evenodd" stroke="#f5f5f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#292524"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5"/></g></svg>`,

  br: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="#292524" fill-rule="evenodd" stroke="#f5f5f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1-16.5h15l1 16.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"/></g></svg>`,

  bq: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="#292524" fill-rule="evenodd" stroke="#f5f5f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-7-14-7 14-7-11 2 12zm0 0c0 4 3 6.5 5 7.5 4.5 2 10.5 2 17 0 2-1 5-3.5 5-7.5M11 38.5h23"/></g></svg>`,

  bk: `<svg viewBox="0 0 45 45" class="chess-piece-svg"><g fill="none" fill-rule="evenodd" stroke="#f5f5f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#292524" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23 20c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#292524"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`
};

function getPieceSvg(color, type) {
  const key = `${color}${type}`;
  return CHESS_PIECES_SVG[key] || '';
}

function getMoveBadgeSvg(quality) {
  if (quality === 'brilliant') {
    return `<div class="move-quality-badge badge-brilliant" title="Langkah Brilian!!">
      <svg viewBox="0 0 100 100" class="badge-brilliant-svg">
        <!-- Teal Circular Badge with Transparent Background -->
        <circle cx="50" cy="50" r="48" fill="#1bba9b"/>
        <!-- Left Exclamation Shadow -->
        <rect x="41.5" y="38" width="7" height="17" rx="2" fill="#0c6b58"/>
        <rect x="41.5" y="58" width="7" height="7" rx="1.5" fill="#0c6b58"/>
        <!-- Left Exclamation White Body -->
        <rect x="40" y="36" width="7" height="17" rx="2" fill="#ffffff"/>
        <rect x="40" y="56" width="7" height="7" rx="1.5" fill="#ffffff"/>
        <!-- Right Exclamation Shadow -->
        <rect x="54.5" y="38" width="7" height="17" rx="2" fill="#0c6b58"/>
        <rect x="54.5" y="58" width="7" height="7" rx="1.5" fill="#0c6b58"/>
        <!-- Right Exclamation White Body -->
        <rect x="53" y="36" width="7" height="17" rx="2" fill="#ffffff"/>
        <rect x="53" y="56" width="7" height="7" rx="1.5" fill="#ffffff"/>
      </svg>
    </div>`;
  }
  if (quality === 'blunder') {
    return `<div class="move-quality-badge badge-blunder" title="Langkah Blunder??">
      <svg viewBox="0 0 100 100" class="badge-blunder-svg">
        <circle cx="50" cy="50" r="48" fill="#ef4444"/>
        <text x="50" y="66" font-size="46" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="system-ui, sans-serif">??</text>
      </svg>
    </div>`;
  }
  if (quality === 'best') {
    return `<div class="move-quality-badge badge-best" title="Langkah Terbaik!">
      <svg viewBox="0 0 100 100" class="badge-best-svg">
        <!-- Transparent background outside, White Outer Ring -->
        <circle cx="50" cy="50" r="48" fill="#ffffff"/>
        <!-- Green Olive Inner Circle -->
        <circle cx="50" cy="50" r="44" fill="#81b64c"/>
        <!-- Sharp White 5-pointed Star matching user image -->
        <polygon points="50.0,16.0 57.9,39.1 82.3,39.5 62.8,54.2 70.0,77.5 50.0,63.5 30.0,77.5 37.2,54.2 17.7,39.5 42.1,39.1" fill="#ffffff"/>
      </svg>
    </div>`;
  }
  return '';
}
