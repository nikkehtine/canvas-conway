import * as game from "./gameoflife.js";

const canvasID = "game";
const app = document.getElementById(canvasID) as HTMLCanvasElement;
if (app === null) throw new Error(`Could not find ${canvasID}`);

app.width = 600;
app.height = app.width;

const BOARD_ROWS = 60;
const BOARD_COLS = BOARD_ROWS;
const CELL_WIDTH = app.width / BOARD_COLS;
const CELL_HEIGHT = app.height / BOARD_ROWS;

const ctx = app.getContext("2d");
if (ctx === null) throw new Error("Could not initialize 2D context");

let board: game.Grid = game.make2DArray(BOARD_COLS, BOARD_ROWS);

function render() {
    ctx!.fillStyle = game.StateColors[game.State.dead];
    ctx!.fillRect(0, 0, app.width, app.height);

    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            const x = col * CELL_WIDTH;
            const y = row * CELL_HEIGHT;
            ctx!.fillStyle = game.StateColors[board[col][row]];
            ctx!.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
        }
    }
}
render();

app.addEventListener("click", (e) => {
    const state = document.querySelector(
        'input[name="state"]:checked'
    ) as HTMLInputElement;
    if (state === null) throw new Error("Could not find the state selector");

    if (!(state.value in game.State)) {
        throw new Error(`Invalid state value: ${state.value}`);
    }

    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    board[col][row] = game.State[state.value as keyof typeof game.State];
    render();
});

function nextIteration() {
    let nextBoard = game.updateWorld(board);
    [board, nextBoard] = [nextBoard, board];
    render();
}

const nextID = "next";
const nextBtn = document.getElementById(nextID) as HTMLButtonElement;
if (nextBtn === null) throw new Error(`Could not find button ${nextID}`);
nextBtn.addEventListener("click", () => {
    nextIteration();
});
