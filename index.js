const container = document.querySelector(".container");

const GRID_SIZE = 16;
const currentColor = "black";

let isMouseDown = false;

function createPixelGrid(size) {
  for (let i = 0; i < size; ++i) {
    const row = createElementWithClass("div", "row");
    for (let j = 0; j < size; ++j) {
      row.appendChild(createElementWithClass("div", "pixel"));
    }
    container.appendChild(row);
  }
}

function createElementWithClass(elementName, className) {
  const element = document.createElement(elementName);
  element.classList.add(className);
  return element;
}

function changePixelColor(pixel) {
  pixel.style.backgroundColor = currentColor;
}

createPixelGrid(GRID_SIZE);

const rows = document.querySelectorAll(".row");

rows.forEach((row) => {
  row.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      changePixelColor(e.target);
    }
  });
  row.addEventListener("mousedown", (e) => {
    changePixelColor(e.target);
  });
});

addEventListener("mousedown", () => (isMouseDown = true));
addEventListener("mouseup", () => (isMouseDown = false));

// there was a bug, when we tried to drag some pixel
// because of that mouseup event didn't work and
// the cursor continued to draw when the mouse key was up
addEventListener("dragstart", (e) => e.preventDefault());
