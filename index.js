const container = document.querySelector(".container");
const GRID_SIZE = 16;

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

createPixelGrid(GRID_SIZE);
