// Board state
let board = ["", "", "", "", "", "", "", "", ""];

// Players
const HUMAN = "X";
const AI = "O";

// DOM elements
const cells = document.querySelectorAll("#board button");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

// Winning combinations
const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Event listeners
cells.forEach(cell => {
    cell.addEventListener("click", handleHumanMove);
});

resetBtn.addEventListener("click", resetGame);

// ---------------- GAME LOGIC ----------------

function handleHumanMove(e) {
    const index = e.target.dataset.index;

    // Invalid move or game already over
    if (board[index] !== "" || checkWinner(board) || isDraw(board)) return;

    makeMove(index, HUMAN);

    // Check game state immediately
    const winner = checkWinner(board);

    if (winner || isDraw(board)) {
        updateStatus();
        disableBoard();
        return;
    }

    // AI turn
    statusText.textContent = "AI is thinking...";
    setTimeout(aiMove, 300);
}

function aiMove() {
    const bestMove = minimax(board, AI).index;
    makeMove(bestMove, AI);
    updateStatus();

    if (checkWinner(board) || isDraw(board)) {
        disableBoard();
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function updateStatus() {
    const winner = checkWinner(board);

    if (winner === HUMAN) {
        statusText.textContent = "You win!";
    } else if (winner === AI) {
        statusText.textContent = "AI wins!";
    } else if (isDraw(board)) {
        statusText.textContent = "It's a draw!";
    } else {
        statusText.textContent = "Your turn (X)";
    }
}

function checkWinner(b) {
    for (let pattern of winPatterns) {
        const [a, c, d] = pattern;
        if (b[a] && b[a] === b[c] && b[a] === b[d]) {
            return b[a];
        }
    }
    return null;
}

function isDraw(b) {
    return b.every(cell => cell !== "");
}

function disableBoard() {
    cells.forEach(cell => cell.disabled = true);
}

function enableBoard() {
    cells.forEach(cell => cell.disabled = false);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
    });
    statusText.textContent = "Your turn (X)";
}

// ---------------- MINIMAX ----------------

function minimax(newBoard, player) {
    const availableMoves = newBoard
        .map((val, idx) => val === "" ? idx : null)
        .filter(v => v !== null);

    const winner = checkWinner(newBoard);

    if (winner === AI) return { score: 10 };
    if (winner === HUMAN) return { score: -10 };
    if (availableMoves.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        let move = {};
        move.index = availableMoves[i];

        newBoard[availableMoves[i]] = player;

        if (player === AI) {
            move.score = minimax(newBoard, HUMAN).score;
        } else {
            move.score = minimax(newBoard, AI).score;
        }

        newBoard[availableMoves[i]] = "";
        moves.push(move);
    }

    let bestMoveIndex;

    if (player === AI) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMoveIndex = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMoveIndex = i;
            }
        }
    }

    return moves[bestMoveIndex];
}
