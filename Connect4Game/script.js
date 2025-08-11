// Connect 4 fixed script.js with correct Undo and Restart logic

const ROWS = 6, COLS = 7;

// UI elements
const boardEl = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const undoBtn = document.getElementById('undo-btn');
const modeSelect = document.getElementById('mode');
const difficultyRow = document.getElementById('difficulty-row');
const difficultySelect = document.getElementById('difficulty');

let board = [];
let currentPlayer = 'red';
let mode = 'pvp'; // 'pvp' | 'ai'
let difficulty = 'medium'; // easy | medium | hard
let gameOver = false;
let gameStarted = false;
let history = []; // store moves {r,c,player}

// init UI events
modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'ai') difficultyRow.style.display = 'flex';
    else difficultyRow.style.display = 'none';
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    if (gameStarted) resetGame();
});
undoBtn.addEventListener('click', undoMove);

// start on load as well? We'll wait for user to click start

function startGame() {
    mode = modeSelect.value;
    difficulty = difficultySelect.value;
    gameStarted = true;
    resetGame();

    // Enable controls
    restartBtn.disabled = false;
    undoBtn.disabled = false;
    startBtn.disabled = true;
    updateTurnIndicator();
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    history = [];
    renderBoard();
    updateTurnIndicator();

    if (gameStarted) {
        restartBtn.disabled = false;
        undoBtn.disabled = false;
    } else {
        restartBtn.disabled = true;
        undoBtn.disabled = true;
    }
}

function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => {
                if (gameOver) return;
                if (!gameStarted) return;
                if (mode === 'ai' && currentPlayer === 'yellow') return;
                playerMove(c);
            });
            const token = board[r][c];
            if (token) {
                const disc = document.createElement('div');
                disc.className = `disc ${token}`;
                cell.appendChild(disc);
            }
            boardEl.appendChild(cell);
        }
    }
}

function playerMove(col) {
    if (gameOver) return;
    const row = getAvailableRow(col);
    if (row === -1) return;
    placeDisc(row, col, currentPlayer);
    history.push({ r: row, c: col, player: currentPlayer });
    renderBoard();
    const winCoords = checkWinCoords(row, col, currentPlayer);
    if (winCoords.length) {
        gameOver = true;
        highlightWin(winCoords);
        turnIndicator.textContent = `🏆 ${capitalize(currentPlayer)} Wins!`;
        return;
    }
    if (isBoardFull()) {
        gameOver = true;
        turnIndicator.textContent = "Draw!";
        return;
    }
    currentPlayer = (currentPlayer === 'red') ? 'yellow' : 'red';
    updateTurnIndicator();

    if (mode === 'ai' && currentPlayer === 'yellow' && !gameOver) {
        setTimeout(() => aiTurn(), 350);
    }
}

function placeDisc(r, c, player) {
    board[r][c] = player;
}

function getAvailableRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][col]) return r;
    }
    return -1;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

function updateTurnIndicator() {
    if (gameOver) return;
    if (!gameStarted) {
        turnIndicator.textContent = "Start a game to play";
    } else {
        turnIndicator.textContent = `${capitalize(currentPlayer)}'s Turn (${currentPlayer === 'red' ? 'Red' : 'Yellow'})`;
    }
}

// ---------- WIN DETECTION (returns coords of winning discs) ----------
function checkWinCoords(row, col, player) {
    const dirs = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];
    for (const { dr, dc } of dirs) {
        const coords = [[row, col]];
        let r = row + dr, c = col + dc;
        while (inBounds(r, c) && board[r][c] === player) {
            coords.push([r, c]);
            r += dr; c += dc;
        }
        r = row - dr; c = col - dc;
        while (inBounds(r, c) && board[r][c] === player) {
            coords.push([r, c]);
            r -= dr; c -= dc;
        }
        if (coords.length >= 4) return coords;
    }
    return [];
}

function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function highlightWin(coords) {
    coords.forEach(([r, c]) => {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            const disc = cell.querySelector('.disc');
            if (disc) disc.classList.add('win');
            cell.classList.add('win');
        }
    });
}

// ---------- UNDO ----------
function undoMove() {
    if (!gameStarted || !history.length || gameOver) return;
    const last = history.pop();
    board[last.r][last.c] = null;
    if (mode === 'ai') {
        if (last.player === 'red' && history.length) {
            const prev = history[history.length - 1];
            if (prev.player === 'yellow') {
                history.pop();
                board[prev.r][prev.c] = null;
            }
        }
    }
    gameOver = false;
    currentPlayer = 'red';
    renderBoard();
    updateTurnIndicator();
}

// ---------- AI ----------
function aiTurn() {
    if (difficulty === 'easy') {
        const c = aiRandom();
        playerMove(c);
        return;
    }
    if (difficulty === 'medium') {
        const c = aiMedium();
        playerMove(c);
        return;
    }
    const c = aiHard();
    playerMove(c);
}

function aiRandom() {
    const valid = getValidColumns();
    return valid[Math.floor(Math.random() * valid.length)];
}

function aiMedium() {
    const win = findWinningColumn('yellow');
    if (win !== null) return win;
    const block = findWinningColumn('red');
    if (block !== null) return block;
    const pref = [3, 2, 4, 1, 5, 0, 6];
    for (const c of pref) if (getAvailableRow(c) !== -1) return c;
    return aiRandom();
}

function findWinningColumn(player) {
    for (let c = 0; c < COLS; c++) {
        const r = getAvailableRow(c);
        if (r === -1) continue;
        board[r][c] = player;
        const coords = checkWinCoords(r, c, player);
        board[r][c] = null;
        if (coords.length) return c;
    }
    return null;
}

function aiHard() {
    const depth = 5;
    const [score, col] = minimax(board, depth, -Infinity, Infinity, true);
    if (col === null || col === undefined) return aiRandom();
    return col;
}

function minimax(nodeBoard, depth, alpha, beta, maximizingPlayer) {
    const term = evaluateTerminal(nodeBoard);
    if (depth === 0 || term.terminal) {
        return [evaluateBoard(nodeBoard), null];
    }
    const validCols = getValidColumnsForBoard(nodeBoard);
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        let bestCol = validCols[0] ?? null;
        for (const col of validCols) {
            const row = getAvailableRowForBoard(nodeBoard, col);
            if (row === -1) continue;
            nodeBoard[row][col] = 'yellow';
            const [evalScore] = minimax(nodeBoard, depth - 1, alpha, beta, false);
            nodeBoard[row][col] = null;
            if (evalScore > maxEval) {
                maxEval = evalScore;
                bestCol = col;
            }
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return [maxEval, bestCol];
    } else {
        let minEval = Infinity;
        let bestCol = validCols[0] ?? null;
        for (const col of validCols) {
            const row = getAvailableRowForBoard(nodeBoard, col);
            if (row === -1) continue;
            nodeBoard[row][col] = 'red';
            const [evalScore] = minimax(nodeBoard, depth - 1, alpha, beta, true);
            nodeBoard[row][col] = null;
            if (evalScore < minEval) {
                minEval = evalScore;
                bestCol = col;
            }
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return [minEval, bestCol];
    }
}

function evaluateTerminal(b) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const p = b[r][c];
            if (!p) continue;
            if (checkWinCoordsForBoard(b, r, c, p).length) return { terminal: true, winner: p };
        }
    }
    const full = b.every(row => row.every(cell => cell !== null));
    if (full) return { terminal: true, winner: null };
    return { terminal: false, winner: null };
}

function evaluateBoard(b) {
    let score = 0;
    let centerCount = 0;
    for (let r = 0; r < ROWS; r++)
        if (b[r][Math.floor(COLS / 2)] === 'yellow') centerCount++;
    score += centerCount * 6;
    const SCORE = { 4: 100000, 3: 150, 2: 8 };
    // horizontal windows
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window = [b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3]];
            score += evaluateWindow(window, SCORE);
        }
    }
    // vertical
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 3; r++) {
            const window = [b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c]];
            score += evaluateWindow(window, SCORE);
        }
    }
    // diag down-right
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window = [b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3]];
            score += evaluateWindow(window, SCORE);
        }
    }
    // diag down-left
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 3; c < COLS; c++) {
            const window = [b[r][c], b[r + 1][c - 1], b[r + 2][c - 2], b[r + 3][c - 3]];
            score += evaluateWindow(window, SCORE);
        }
    }
    return score;
}

function evaluateWindow(window, SCORE) {
    const aiCount = window.filter(x => x === 'yellow').length;
    const huCount = window.filter(x => x === 'red').length;
    const empty = window.filter(x => x === null).length;
    let val = 0;
    if (aiCount === 4) val += SCORE[4];
    else if (aiCount === 3 && empty === 1) val += SCORE[3];
    else if (aiCount === 2 && empty === 2) val += SCORE[2];
    if (huCount === 3 && empty === 1) val -= 200;
    if (huCount === 4) val -= SCORE[4] * 1.2;
    return val;
}

function getValidColumnsForBoard(b) {
    const cols = [];
    for (let c = 0; c < COLS; c++)
        if (b[0][c] === null) cols.push(c);
    return cols.sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b));
}

function getAvailableRowForBoard(b, col) {
    for (let r = ROWS - 1; r >= 0; r--)
        if (b[r][col] === null) return r;
    return -1;
}

function checkWinCoordsForBoard(b, row, col, player) {
    const dirs = [{ dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1 }];
    for (const { dr, dc } of dirs) {
        const coords = [[row, col]];
        let r = row + dr, c = col + dc;
        while (inBounds(r, c) && b[r][c] === player) {
            coords.push([r, c]);
            r += dr; c += dc;
        }
        r = row - dr; c = col - dc;
        while (inBounds(r, c) && b[r][c] === player) {
            coords.push([r, c]);
            r -= dr; c -= dc;
        }
        if (coords.length >= 4) return coords;
    }
    return [];
}

// ---------- UTIL ----------
function getValidColumns() {
    const cols = [];
    for (let c = 0; c < COLS; c++)
        if (board[0][c] === null) cols.push(c);
    return cols.sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b));
}

function checkWinCoords(row, col, player) {
    return checkWinCoordsForBoard(board, row, col, player);
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
