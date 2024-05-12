const container = document.querySelector(".container");
const changeGridSizeBtn = document.querySelector(".btn-change-grid-size");
const clearSketchBtn = document.querySelector(".btn-clear-sketch");
const randomizeColorBtn = document.querySelector(".btn-randomize-color");
const pixelDimmerBtn = document.querySelector(".btn-pixel-dimmer");

const DEFAULT_GRID_SIZE = 16;
const SKETCH_WIDTH = 900;
const SKETCH_HEIGHT = 900;
const PIXEL_DIM_STEP = 255 / 10;

const PIXEL_COLOR_WHITE = { r: 255, g: 255, b: 255 };
const PIXEL_COLOR_BLACK = { r: 0, g: 0, b: 0 };

let currentColor = PIXEL_COLOR_BLACK;
let isMouseDown = false;
let isColorRandomized = false;
let isPixelDimmerActivated = false;

function pixelDimmerHandler() {
  if (isPixelDimmerActivated) {
    isPixelDimmerActivated = false;
    pixelDimmerBtn.textContent = "Pixel Dimmer";
    return;
  }
  isPixelDimmerActivated = true;
  pixelDimmerBtn.textContent = "Turn off pixel dimmer";
}

function randomizeColorHandler() {
  if (!isColorRandomized) {
    isColorRandomized = true;
    randomizeColorBtn.textContent = "Back to default color";
    return;
  }
  isColorRandomized = false;
  randomizeColorBtn.textContent = "Randomize color";
  currentColor = PIXEL_COLOR_BLACK;
}

function getRandomColor() {
  return {
    r: getRandomColorChannelValue(),
    g: getRandomColorChannelValue(),
    b: getRandomColorChannelValue(),
  };
}

function getRandomColorChannelValue() {
  return Math.floor(Math.random() * 255);
}

function changeGridSize() {
  let gridSize = parseInt(prompt("Enter new grid size (from [1,100]):"));
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
  pixel.style.backgroundColor = `rgb(${color.r} ${color.g} ${color.b})`;
}

function addMouseListenersToRow(row) {
  row.addEventListener("mouseover", (e) => {
    if (isMouseDown) {
      if (isColorRandomized) currentColor = getRandomColor();
      if (isPixelDimmerActivated) {
        const color =
          e.target.style.backgroundColor === ""
            ? window
                .getComputedStyle(e.target)
                .getPropertyValue("background-color")
            : e.target.style.backgroundColor;
        const colorChannels = color.slice(4, -1).split(", ");
        colorChannels[0] -= PIXEL_DIM_STEP;
        colorChannels[1] -= PIXEL_DIM_STEP;
        colorChannels[2] -= PIXEL_DIM_STEP;
        currentColor = {
          r: colorChannels[0],
          g: colorChannels[1],
          b: colorChannels[2],
        };
      }
      changePixelColor(e.target, currentColor);
    }
  });
  row.addEventListener("mousedown", (e) => {
    if (isColorRandomized) currentColor = getRandomColor();
    if (isPixelDimmerActivated) {
      const color =
        e.target.style.backgroundColor === ""
          ? window
              .getComputedStyle(e.target)
              .getPropertyValue("background-color")
          : e.target.style.backgroundColor;
      const colorChannels = color.slice(4, -1).split(", ");
      colorChannels[0] -= PIXEL_DIM_STEP;
      colorChannels[1] -= PIXEL_DIM_STEP;
      colorChannels[2] -= PIXEL_DIM_STEP;
      currentColor = {
        r: colorChannels[0],
        g: colorChannels[1],
        b: colorChannels[2],
      };
    }
    changePixelColor(e.target, currentColor);
  });
}

createPixelGrid(DEFAULT_GRID_SIZE);

randomizeColorBtn.addEventListener("click", randomizeColorHandler);
pixelDimmerBtn.addEventListener("click", pixelDimmerHandler);
changeGridSizeBtn.addEventListener("click", changeGridSize);
clearSketchBtn.addEventListener("click", clearSketch);

addEventListener("mousedown", () => (isMouseDown = true));
addEventListener("mouseup", () => (isMouseDown = false));

// there was a bug, when we tried to drag some pixel
// because of that mouseup event didn't work and
// the cursor continued to draw when the mouse key was up
addEventListener("dragstart", (e) => e.preventDefault());
