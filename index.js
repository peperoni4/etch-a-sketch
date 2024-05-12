const container = document.querySelector(".container");
const changeGridSizeBtn = document.querySelector(".btn-change-grid-size");
const clearSketchBtn = document.querySelector(".btn-clear-sketch");

const DEFAULT_GRID_SIZE = 16;
const SKETCH_WIDTH = 900;
const SKETCH_HEIGHT = 900;

const PIXEL_COLOR_WHITE = "#fff";

const currentColor = "black";
let isMouseDown = false;

function changeGridSize() {
  const gridSize = parseInt(prompt("Enter new grid size (from [1,100]):"));
  if (!isGridSizeValid(gridSize)) {
    alert(`You have entered incorrect size (${gridSize}) when bounds are [1,100]\n
    So we assign default value of 16 for grid size`);
    gridSize = DEFAULT_GRID_SIZE;
  }
  // remove prev pixel grid
  container.replaceChildren();
  createPixelGrid(gridSize);
}

function isGridSizeValid(size) {
  return size >= 1 && size <= 100;
}

function createPixelGrid(size) {
  for (let i = 0; i < size; ++i) {
    const row = createElementWithClass("div", "row");
    for (let j = 0; j < size; ++j) {
      const pixel = createElementWithClass("div", "pixel");
      adjustPixelSizeBasedOnGridSize(pixel, size);
      row.appendChild(pixel);
    }
    addMouseListenersToRow(row);
    container.appendChild(row);
  }
}

function clearSketch() {
  const rows = container.children;
  for (const row of rows) {
    for (const pixel of row.children) {
      changePixelColor(pixel, PIXEL_COLOR_WHITE);
    }
  }
}

function createElementWithClass(elementName, className) {
  const element = document.createElement(elementName);
  element.classList.add(className);
  return element;
}

function adjustPixelSizeBasedOnGridSize(pixel, gridSize) {
  pixel.style.width = SKETCH_WIDTH / gridSize + "px";
  pixel.style.height = SKETCH_HEIGHT / gridSize + "px";
}

function changePixelColor(pixel, color) {
  pixel.style.backgroundColor = color;
}

function addMouseListenersToRow(row) {
  row.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      changePixelColor(e.target, currentColor);
    }
  });
  row.addEventListener("mousedown", (e) => {
    changePixelColor(e.target, currentColor);
  });
}

createPixelGrid(DEFAULT_GRID_SIZE);

changeGridSizeBtn.addEventListener("click", changeGridSize);
clearSketchBtn.addEventListener("click", clearSketch);

addEventListener("mousedown", () => (isMouseDown = true));
addEventListener("mouseup", () => (isMouseDown = false));

// there was a bug, when we tried to drag some pixel
// because of that mouseup event didn't work and
// the cursor continued to draw when the mouse key was up
addEventListener("dragstart", (e) => e.preventDefault());
