const container = document.querySelector(".container");
const changeGridSizeBtn = document.querySelector(".btn-change-grid-size");
const clearSketchBtn = document.querySelector(".btn-clear-sketch");
const randomizeColorBtn = document.querySelector(".btn-randomize-color");
const pixelDimmerBtn = document.querySelector(".btn-pixel-dimmer");

const DEFAULT_GRID_SIZE = 16;
const SKETCH_WIDTH = 800;
const SKETCH_HEIGHT = 800;
const PIXEL_DIM_STEP = 255 / 10;

const PIXEL_COLOR_WHITE = { r: 255, g: 255, b: 255 };
const PIXEL_COLOR_BLACK = { r: 0, g: 0, b: 0 };

let currentColor = PIXEL_COLOR_BLACK;
let isMouseDown = false;

// to prevent pass by value we wrap them in the object
let isColorRandomized = { value: false };
let isPixelDimmerActivated = { value: false };

function toggleButtonTextContent(flag, btnElement, defaultText, activatedText) {
  if (flag.value) {
    flag.value = false;
    btnElement.textContent = defaultText;
    currentColor = PIXEL_COLOR_BLACK;
    return;
  }
  flag.value = true;
  btnElement.textContent = activatedText;
}

function pixelDimmerHandler() {
  if (!isPixelDimmerActivated.value && isColorRandomized.value) {
    randomizeColorHandler();
  }
  toggleButtonTextContent(
    isPixelDimmerActivated,
    pixelDimmerBtn,
    "Pixel Dimmer",
    "Turn off pixel dimmer"
  );
}

function randomizeColorHandler() {
  if (!isColorRandomized.value && isPixelDimmerActivated.value) {
    pixelDimmerHandler();
  }
  toggleButtonTextContent(
    isColorRandomized,
    randomizeColorBtn,
    "Randomize color",
    "Back to default color"
  );
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
  let gridSize = prompt("Enter new grid size (from [1,100]):");
  // check if the user pressed cancel button
  if (!gridSize) return;
  gridSize = parseInt(gridSize);
  if (!isGridSizeValid(gridSize)) {
    alert(`You have entered incorrect size (${gridSize}) when bounds are [1,100]\n
    Please, try again with the correct values specified above`);
    return;
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

function getDimmedPixelColor(pixel) {
  const color = getBackgroundColorObjectFromElement(pixel);
  color.r -= PIXEL_DIM_STEP;
  color.g -= PIXEL_DIM_STEP;
  color.b -= PIXEL_DIM_STEP;
  return color;
}

function getBackgroundColorObjectFromElement(element) {
  const color =
    element.style.backgroundColor === ""
      ? window.getComputedStyle(element).getPropertyValue("background-color")
      : element.style.backgroundColor;
  const colorChannels = color.slice(4, -1).split(", "); // 4 and -1 because we parse rgb()
  return { r: colorChannels[0], g: colorChannels[1], b: colorChannels[2] };
}

function drawPixel(pixel) {
  if (isColorRandomized.value) currentColor = getRandomColor();
  if (isPixelDimmerActivated.value) {
    currentColor = getDimmedPixelColor(pixel);
  }
  changePixelColor(pixel, currentColor);
}

function addMouseListenersToRow(row) {
  row.addEventListener("mouseover", (e) => {
    if (isMouseDown) {
      drawPixel(e.target);
    }
  });
  row.addEventListener("mousedown", (e) => {
    drawPixel(e.target);
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
