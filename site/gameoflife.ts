export type Grid = State[][];

export enum State {
    "dead",
    "alive",
}

export const StateColors = ["#202020", "#FF5050", "#50FF50", "#5050FF"];

/**
 * Make a new 2D array with the specified size
 *
 * @param {number} cols
 * @param {number} rows
 * @return {Grid} An instance of `Grid` (a 2D array)
 */
export function make2DArray(cols: number, rows: number): Grid {
    return new Array(cols)
        .fill(undefined)
        .map(() => new Array(rows).fill(State.dead));
}

/**
 * Randomize the given world by setting cells to "alive" with a certain probability.
 *
 * @param {Grid} world - The world grid to be randomized
 * @param {number} [probability=3] - The probability of a cell becoming alive (lower = more likely)
 * @return {Grid} The randomized world grid
 */
export function randomizeWorld(world: Grid, probability: number = 3): Grid {
    let cols = world.length;
    let rows = world[0].length;
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (Math.floor(Math.random() * probability) === 0) {
                world[c][r] = State.alive;
            }
        }
    }
    return world;
}

/**
 * Update the world grid based on the rules of the Game of Life.
 *
 * @param {Grid} world - The current state of the world grid
 * @return {Grid} The updated state of the world grid
 */
export function updateWorld(world: Grid): Grid {
    let cols = world.length;
    let rows = world[0].length;
    let nextGen = make2DArray(cols, rows);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const neighbors = countNeighbors(world, x, y);

            if (neighbors[State.alive] === 3) {
                nextGen[x][y] = State.alive;
            } else if (
                world[x][y] === State.alive &&
                neighbors[State.alive] === 2
            ) {
                nextGen[x][y] = State.alive;
            } else {
                nextGen[x][y] = State.dead;
            }
        }
    }
    return nextGen;
}

/**
 * Counts the number of neighboring cells in the given world grid at the specified coordinates.
 *
 * @param {Grid} world - The world grid with the cells
 * @param {number} x - Cell's X coordinate
 * @param {number} y - Cell's Y coordinate
 * @return {number[]} An array representing the count of neighboring cells in each state
 */
function countNeighbors(world: Grid, x: number, y: number): number[] {
    let cols = world.length;
    let rows = world[0].length;
    let neighbors: number[] = new Array(2).fill(0);

    for (let sampleX = -1; sampleX <= 1; sampleX++) {
        for (let sampleY = -1; sampleY <= 1; sampleY++) {
            if (sampleX + x < 0 || sampleX + x >= cols) continue;
            if (sampleY + y < 0 || sampleY + y >= rows) continue;
            if (sampleX === 0 && sampleY === 0) continue;

            // Get the numeric value of a state in the State enum
            neighbors[world[sampleX + x][sampleY + y]]++;
        }
    }
    return neighbors;
}
