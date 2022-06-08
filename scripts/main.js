const headings = ["n", "e", "s", "w"];
const plateauGrid = document.querySelector(".plateau-grid");

class Plateau {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.xMax = width - 1;
    this.yMax = height - 1;
  }
  renderGrid(targetNode = plateauGrid) {
    console.log(`Creating a grid 25 by 25.`);

    let yRemaining = 25;
    const frag = document.createDocumentFragment();

    let rowCount = 0;

    while (yRemaining > 0) {
      let xValue = 1;

      while (xValue <= 25) {
        const div = document.createElement("div");
        div.className = `cell x${xValue}-y${yRemaining}`;
        frag.append(div);
        xValue += 1;
        // console.log(
        //   "🚀 ~ file: main.js ~ line 24 ~ Plateau ~ createHTML ~ xValue",
        //   xValue
        // );
      }

      yRemaining -= 1;
      console.log(
        "🚀 ~ file: main.js ~ line 27 ~ Plateau ~ createHTML ~ yRemaining",
        yRemaining
      );

      rowCount += 1;
      console.log(
        "🚀 ~ file: main.js ~ line 39 ~ Plateau ~ createHTML ~ rowCount",
        rowCount
      );
    }
    targetNode[0].replaceChildren(frag);
  }
  getCellWidth() {
    const viewport = window.visualViewport;
    const viewportPixelWidth = viewport.width;
    console.log(
      "🚀 ~ file: main.js ~ line 50 ~ Plateau ~ getCellWidth ~ pixelWidth",
      viewportPixelWidth
    );
    const cellWidth = viewportPixelWidth / this.width;

    return cellWidth;
  }
}

class Rover {
  constructor(name, xPosition, yPosition, heading, plateau) {
    this.name = name;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.heading = heading;
    this.plateau = plateau;
    this.imagePath = "/assets/moon-rover-svgrepo-com.svg";
    this.visibilty = 2;
  }
  selectRoverIcon() {
    return (roverImageEl = document.getElementsByClassName(this.name));
  }
  turnLeft() {
    const currentHeadingIndex = headings.indexOf(this.heading);
    if (currentHeadingIndex === 0) {
      this.heading = headings[3];
    } else {
      this.heading = headings[currentHeadingIndex - 1];
    }
  }
  turnRight() {
    const currentHeadingIndex = headings.indexOf(this.heading);
    if (currentHeadingIndex === 3) {
      this.heading = headings[0];
    } else {
      this.heading = headings[currentHeadingIndex + 1];
    }
  }
  move() {
    switch (this.heading) {
      case "n":
        this.yPosition += 1;
        break;
      case "s":
        this.yPosition -= 1;
        break;
      case "e":
        this.xPosition += 1;
        break;
      case "w":
        this.xPosition -= 1;
        break;
      default:
        throw new Error(`Something wrong with the rover move() method!`);
    }

    const xLimit = this.plateau.xMax;
    const yLimit = this.plateau.yMax;

    if (this.xPosition <= 0 || this.yPosition <= 0) {
      console.log(`Your rover has fallen off the plateau! (below zero)`);
    }
    if (this.xPosition > xLimit || this.yPosition > yLimit) {
      console.log(`Your rover has fallen off the plateau!`);
    }
  }
  executeInstructions(instructionsString) {
    // Instructions will come in as a string
    const instructions = Array.from(instructionsString.toLowerCase());

    for (const instruction of instructions) {
      switch (instruction) {
        case "l":
          this.turnLeft();
          break;
        case "r":
          this.turnRight();
          break;
        case "m":
          this.move();
          break;
        default:
          throw new Error(
            `An unknown instruction was given to executeInstructions() method!`
          );
      }
      console.log(`${this.name}: ${this.xPosition}, ${this.yPosition}`);
    }
  }
}

// const plateau1 = new Plateau(9, 9);

// const rover1 = new Rover("rover1", 2, 8, "e", plateau1);
// console.log(rover1);

function serialize(form) {
  // get most things
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const multis = Array.from(
    form.querySelectorAll(`select[multiple], [type="checkbox"]`)
  );

  // console.log("multis", multis);

  if (multis.length) {
    const multiNames = Array.from(new Set(multis.map((input) => input.name)));

    // Get full values for checkboxes & multi-selects
    for (const key in data) {
      if (data.hasOwnProperty(key) && multiNames.includes(key)) {
        const fullData = formData.getAll(key);
        if (fullData.length > 1) {
          data[key] = fullData;
        }
      }
    }
  }

  return data;
}

//Takes player input to create the grid
const gridGeneratorForm = document.forms["grid-generator-form"];
gridGeneratorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = serialize(gridGeneratorForm);
  const width = data["grid-width"];
  const height = data["grid-height"];
  const plateau = new Plateau(width, height);
  const gridContainer = document.getElementsByClassName("plateau-grid");
  // gridContainer.classList.remove("hidden");
  const gridStyles = new CSSStyleSheet();
  const cellWidth = plateau.getCellWidth();

  plateau.renderGrid(gridContainer);
  const clickableGridArray = Array.from(document.querySelectorAll(".cell"));
  console.log(
    "🚀 ~ file: main.js ~ line 202 ~ clickableGrid",
    clickableGridArray
  );

  for (const cell of clickableGridArray) {
    const startingCell = cell.addEventListener("click", (e) => {
      console.log(e);
      startingCell.innerHTML;
    });
  }
});

const navInputForm = document.forms["instruction-input-form"];
// Takes the players instructions and makes the rover execute them
navInputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = serialize(navInputForm);
  const instructions = data["navigation-input"];
  rover.executeInstructions(instructions);
  console.log(rover);
});

function placeRover(xyClass) {}

// console.log("plateauGrid", plateauGrid);
