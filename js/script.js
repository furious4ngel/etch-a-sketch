const gridArea = document.querySelector('#grid-area');
const customPenButton = document.querySelector('#custom-pen-button');
const rainbowPenButton = document.querySelector('#rainbow-pen-button');
const eraserButton = document.querySelector('#eraser-button');
const gridLinesButton = document.querySelector('#grid-lines-button');
const newSketchButton = document.querySelector('#new-sketch-button');

function setGridArea(side) {
  let area = side * side;
  for (let i = 0; i < area; i++) {
    const square = document.createElement('div');
    gridArea.appendChild(square);
  }
  setGridAreaCSS(side);
}

function getSide() {
  let side;
  do {
    side = Number(prompt('Enter the side length for the ' +
        'area of the grid (value must be a number ' +
        'less than or equal to 64).', '16'));
  } while (side > 64 || !side);
  side = Math.floor(side);

  return side;
}

function setPenColor() {
  resetEraserButtonCSS();
  resetRainbowPenButtonCSS();

  gridArea.addEventListener('mouseover', (e) => {
    const penColor = document.querySelector('#pen-color');
    let square = e.target;
    square.style.backgroundColor = penColor.value;
  });
}

function random(number) {
  return Math.floor(Math.random() * number) + 1;
}

function setRandomPenColor() {
  resetEraserButtonCSS();
  setRainbowPenButtonCSS();

  gridArea.addEventListener('mouseover', (e) => {
    let square = e.target;
    square.style.backgroundColor = 
        `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  });
}

function eraseGrid() {
  setEraserButtonCSS();
  resetRainbowPenButtonCSS();

  gridArea.addEventListener('mouseover', (e) => {
    let square = e.target;
    square.style.backgroundColor = '#ffffff';
  });
}

function showGridLines() {
  toggleGridLinesButtonCSS();

  const grid = gridArea.querySelectorAll('div');
  for (const square of grid) {
   square.classList.toggle('grid-lines');
  }
}

function createNewGrid() {
  if (!confirm('Are you sure you want to start a new sketch?')) return;

  resetGridLinesButtonCSS();
  clearGridArea();
  setGridArea(getSide());
}

function clearGridArea() {
  const grid = gridArea.querySelectorAll('div');
  for (const square of grid) {
    gridArea.removeChild(square);
  }
}

function setGridAreaCSS(side) {
  gridArea.style.gridTemplateColumns = `repeat(${side}, 1fr)`;
  gridArea.style.userSelect = 'none';
}

function setRainbowPenButtonCSS() {
  rainbowPenButton.classList.add('rainbow-pen-button--selected');
}

function setEraserButtonCSS() {
  eraserButton.textContent = 'Eraser: ON';
}

function toggleGridLinesButtonCSS() {
  if (gridLinesButton.textContent === 'Grid Lines: OFF') {
    gridLinesButton.textContent = 'Grid Lines: ON';
  } else {
    gridLinesButton.textContent = 'Grid Lines: OFF';
  }
}

function resetRainbowPenButtonCSS() {
  rainbowPenButton.classList.remove('rainbow-pen-button--selected');
}

function resetEraserButtonCSS() {
  eraserButton.textContent = 'Eraser: OFF';
}

function resetGridLinesButtonCSS() {
  gridLinesButton.classList.remove('grid-lines-button--selected');
  gridLinesButton.textContent = 'Grid Lines: OFF';
}

function main() {
  setGridArea(16);

  customPenButton.addEventListener('click', setPenColor);
  eraserButton.addEventListener('click', eraseGrid);
  rainbowPenButton.addEventListener('click', setRandomPenColor);
  gridLinesButton.addEventListener('click', showGridLines);
  newSketchButton.addEventListener('click', createNewGrid);
}

main();