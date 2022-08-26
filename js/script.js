const gridArea = document.querySelector('#grid-area');

const tools = [...document.querySelectorAll('#button-group .button-group__button')];
const pencilTool = document.querySelector('#pencil-button');
const rainbowPenTool = document.querySelector('#rainbow-pen-button');
const bucketTool = document.querySelector('#bucket-button');
const eraserTool = document.querySelector('#eraser-button');
const gridTool = document.querySelector('#grid-lines-button');
const newSketchTool = document.querySelector('#new-sketch-button');

const colorDisplay = document.querySelector('#color-display');
const colorPicker = document.querySelector('#color-input');

const newSketchModal = document.querySelector('#confirm-new-sketch-modal');
const newSketchCloseBtn = document.querySelector('#close-confirm-new-sketch-modal-button');
const confirmNewSketchBtn = document.querySelector('#confirm-side-button');
const enterSideModal = document.querySelector('#enter-side-modal');
const userSide = document.querySelector('#side-value');

const colors = {
  black: '#000000',
  white: '#ffffff',
  transparent: 'rgba(0, 0, 0, 0)',
};

let isDrawing = false;

function createNewGrid(side) {
  let area = side * side;

  for (let i = 0; i < area; i++) {
    const square = document.createElement('div');
    square.style.flex = `0 0 ${100 / Math.sqrt(area)}%`;
    square.style.height = `${100 / Math.sqrt(area)}%`;
    square.classList.add('grid-area__square');
    gridArea.appendChild(square);
  }
}

function getSide() {
  const MIN = Number(userSide.min);
  const MAX = Number(userSide.max);
  const DEFAULT = 16;
  let side = Number(userSide.value);

  return side >= MIN && side <= MAX
    ? side
    : DEFAULT;
}

function getRandomNum(n) {
  return Math.floor(Math.random() * n) + 1;
}

function setGridHeight() {
  const FACTOR = 16;
  let gridWidth = (getComputedStyle(gridArea).width).slice(0, -2);

  gridArea.style.height = (gridWidth / FACTOR) + 'rem';
}

function setColorDisplay() {
  let pencilColor = colorPicker.value;
  colorDisplay.style.backgroundColor = pencilColor;

  if (pencilColor === colors.transparent) {
    colorPicker.value = colors.black;
    colorDisplay.style.backgroundColor = colors.black;
    colorDisplay.ariaLabel = `Current color: ${colors.black}`;
  } else {
    colorDisplay.ariaLabel = `Current color: ${pencilColor}`;
  }
}

function colorSquare(e) {
  let square = e.target;
  let pencilColor = colorPicker.value;
  let randomColor = `rgb(${getRandomNum(255)}, ${getRandomNum(255)}, ${getRandomNum(255)})`;

  switch (true) {
    case pencilTool.classList.contains('active'):
      square.style.backgroundColor = pencilColor;
      break;
    case rainbowPenTool.classList.contains('active'):
      square.style.backgroundColor = randomColor;
      break;
  }
}

function colorGrid() {
  const squares = gridArea.childNodes;
  let fillColor = colorPicker.value;

  for (const square of squares) {
    square.style.backgroundColor = fillColor;
  }
}

function eraseGrid(e) {
  let square = e.target;

  square.style.backgroundColor = colors.white;
}

function clearGrid() {
  while (gridArea.hasChildNodes()) {
    gridArea.removeChild(gridArea.firstChild);
  }
}

function toggleGridLines() {
  const grid = gridArea.querySelectorAll('div');

  for (const square of grid) {
    square.classList.toggle('show-grid');
  }
}

function toggleTool(e) {
  const activeTool = document.querySelector('.active');

  if (activeTool) {
    let activeID = activeTool.id;

    switch (activeID) {
      case 'pencil-button':
      case 'rainbow-pen-button':
        colorSquare(e);
        break;
      case 'bucket-button':
        colorGrid();
        break;
      case 'eraser-button':
        eraseGrid(e);
        break;
    }
  }
}

function removeActiveClass() {
  for (const tool of tools) {
    if (tool.id === 'grid-lines-button') continue;

    tool.classList.remove('active');
  }
}

function resetTools() {
  for (const tool of tools) {
    tool.classList.remove('active');
    tool.style.backgroundColor = '';
    tool.style.color = '';
  }

  colorDisplay.style.backgroundColor = colors.black;
  colorPicker.value = colors.black;

  pencilTool.ariaLabel = 'Pencil off';
  rainbowPenTool.ariaLabel = 'Rainbow pen off';
  bucketTool.ariaLabel = 'Fill off';
  eraserTool.ariaLabel = 'Eraser off';
  gridTool.ariaLabel = 'Hide grid lines';
}

function resetEtchASketch() {
  removeActiveClass();
  resetTools();
  clearGrid();
  createNewGrid(getSide());
  isDrawing = false;
}

function main() {
  createNewGrid(16);
  setGridHeight();
  setColorDisplay();

  window.addEventListener('resize', setGridHeight);

  gridArea.addEventListener('mouseleave', () => isDrawing = false);
  gridArea.addEventListener('mouseup', () => isDrawing = false);
  gridArea.addEventListener('mousedown', (e) => {
    isDrawing = true;
    toggleTool(e);
  });
  gridArea.addEventListener('mouseover', (e) => {
    if (isDrawing) toggleTool(e);
  });

  colorPicker.addEventListener('input', () => {
    setColorDisplay();
  });

  tools.forEach(tool => {
    tool.addEventListener('click', (e) => {
      const currentBtn = e.currentTarget;
      let btnID = currentBtn.id;

      switch (btnID) {
        case 'color-display':
          setColorDisplay();
          break;
        case 'pencil-button':
          removeActiveClass();
          currentBtn.classList.add('active');

          currentBtn.ariaLabel = 'Pencil on';
          rainbowPenTool.ariaLabel = 'Rainbow pen off';
          bucketTool.ariaLabel = 'Fill off';
          eraserTool.ariaLabel = 'Eraser off';
          break;
        case 'bucket-button':
          removeActiveClass();
          currentBtn.classList.add('active');

          currentBtn.ariaLabel = 'Fill on';
          pencilTool.ariaLabel = 'Pencil off'
          rainbowPenTool.ariaLabel = 'Rainbow pen off';
          eraserTool.ariaLabel = 'Eraser off';
          break;
        case 'eraser-button':
          removeActiveClass();
          currentBtn.classList.add('active');

          currentBtn.ariaLabel = 'Eraser on';
          pencilTool.ariaLabel = 'Pencil off';
          rainbowPenTool.ariaLabel = 'Rainbow pen off';
          bucketTool.ariaLabel = 'Fill off';
          break;
        case 'rainbow-pen-button':
          removeActiveClass();
          currentBtn.classList.add('active');

          currentBtn.ariaLabel = 'Rainbow pen on';
          bucketTool.ariaLabel = 'Fill off';
          pencilTool.ariaLabel = 'Pencil off';
          eraserTool.ariaLabel = 'Eraser off';
          break;
        case 'grid-lines-button':
          currentBtn.ariaLabel = currentBtn.classList.toggle('active')
            ? 'Hide grid lines'
            : 'Show grid lines';

          toggleGridLines();
          break;
      }
    });
  });

  confirmNewSketchBtn.addEventListener('click', () => {
    resetEtchASketch();
  });

  newSketchModal.addEventListener('shown.bs.modal', () => {
    newSketchCloseBtn.focus();
  });

  enterSideModal.addEventListener('shown.bs.modal', () => {
    userSide.focus();
  });
};

main();