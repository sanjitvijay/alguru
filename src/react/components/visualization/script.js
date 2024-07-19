let grid = [];
let rows = 3;
let cols = 3;
let timeElapsed = 0;
let intervalId;

const gridElement = document.getElementById('grid');
const statusElement = document.getElementById('status');
const generateButton = document.getElementById('generate');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');

generateButton.addEventListener('click', generateGrid);
startButton.addEventListener('click', startSimulation);
resetButton.addEventListener('click', resetSimulation);

function generateGrid() {
    rows = parseInt(rowsInput.value);
    cols = parseInt(colsInput.value);
    grid = [];
    timeElapsed = 0;
    clearInterval(intervalId);

    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridElement.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => toggleCell(i, j));
            gridElement.appendChild(cell);
            grid[i][j] = 0;
        }
    }
    updateGrid();
    statusElement.textContent = 'Click on cells to toggle between fresh (1), rotten (2), and empty (0)';
}

function toggleCell(i, j) {
    grid[i][j] = (grid[i][j] + 1) % 3;
    updateGrid();
}

function updateGrid() {
    const cells = gridElement.getElementsByClassName('cell');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = cells[i * cols + j];
            cell.classList.remove('fresh', 'rotten', 'empty');
            if (grid[i][j] === 1) {
                cell.classList.add('fresh');
                cell.textContent = '🍊';
            } else if (grid[i][j] === 2) {
                cell.classList.add('rotten');
                cell.textContent = '🦠';
            } else {
                cell.classList.add('empty');
                cell.textContent = '';
            }
        }
    }
}

function startSimulation() {
    clearInterval(intervalId);
    timeElapsed = 0;
    intervalId = setInterval(simulateRotting, 1000);
}

function simulateRotting() {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const newGrid = JSON.parse(JSON.stringify(grid));
    let changed = false;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) {
                for (const [dx, dy] of directions) {
                    const newX = i + dx;
                    const newY = j + dy;
                    if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && grid[newX][newY] === 1) {
                        newGrid[newX][newY] = 2;
                        changed = true;
                    }
                }
            }
        }
    }

    if (!changed) {
        clearInterval(intervalId);
        const freshOranges = grid.flat().filter(cell => cell === 1).length;
        if (freshOranges === 0) {
            statusElement.textContent = `Simulation complete. All oranges rotted in ${timeElapsed} minutes.`;
        } else {
            statusElement.textContent = `Simulation complete. ${freshOranges} fresh oranges remaining after ${timeElapsed} minutes.`;
        }
        return;
    }

    grid = newGrid;
    timeElapsed++;
    updateGrid();
    statusElement.textContent = `Time elapsed: ${timeElapsed} minute(s)`;
}

function resetSimulation() {
    clearInterval(intervalId);
    generateGrid();
}

generateGrid();