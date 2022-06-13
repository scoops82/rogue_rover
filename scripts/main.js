const headings = ["n", "e", "s", "w"];
const instructionsArr = ["l", "r", "m"];

const plateauGrid = document.querySelector(".plateau-grid");

const messagesDisplay = document.getElementById("message-display");
const coordinatesDisplay = document.getElementById("coordinates-display");
const headingDisplay = document.getElementById("player-heading-display");
const turnCountDisplay = document.getElementById("turn-count-display");

let playerRover;
let rogueRover;

function randomNumberGenerator(min, max) {
  // Generates a random integer between min and max inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
    this.imagePath = "/assets/player-rover-icon.svg";
    this.visibilty = 2;
    this.iconRotation = 0;
    this.transformSettingsForRoverIcons = [
      `rotate(${this.iconRotation}deg) translate(0, -20px)`,
      `rotate(${this.iconRotation}deg) translate(-20px,0px)`,
      `rotate(${this.iconRotation}deg) translate(0, 20px)`,
      `rotate(${this.iconRotation}deg) translate(20px, 0px)`,
    ];
    this.turnCount = 0;
  }
  scanSurroundings() {
    const cell = document.getElementsByClassName(
      `x${this.xPosition}-y${this.yPosition}`
    )[0];
    cell.style.backgroundImage = "none";
    let xMax = this.xPosition + this.visibilty;
    const xMin = this.xPosition - this.visibilty;
    let yMax = this.yPosition + this.visibilty;
    const yMin = this.yPosition - this.visibilty;
    let x = xMin;
    let y = yMin;
    const visibleCellsClasses = [];
    if (yMin < 1) {
      y = 1;
    }
    if (xMin < 1) {
      x = 1;
    }
    if (yMax > this.plateau.height) {
      yMax = this.plateau.height;
    }
    if (xMax > this.plateau.width) {
      xMax = this.plateau.width;
    }
    console.log(
      "🚀 ~ file: main.js ~ line 103 ~ Rover ~ scanSurroundings ~ xMax",
      xMax
    );
    console.log(
      "🚀 ~ file: main.js ~ line 100 ~ Rover ~ scanSurroundings ~ yMax",
      yMax
    );
    console.log(
      "🚀 ~ file: main.js ~ line 100 ~ Rover ~ scanSurroundings ~ x",
      x
    );
    console.log(
      "🚀 ~ file: main.js ~ line 100 ~ Rover ~ scanSurroundings ~ y",
      y
    );

    while (y <= yMax) {
      let xCount = x;
      while (xCount <= this.visibilty * 2 && xCount <= xMax - x) {
        const classString = `x${xCount}-y${y}`;
        visibleCellsClasses.push(classString);
        xCount += 1;
      }
      y += 1;
    }
    console.log("visibleCellsClasses", visibleCellsClasses);

    const visibleCells = [];

    for (const item of visibleCellsClasses) {
      const cell = document.getElementsByClassName(item)[0];
      visibleCells.push(cell);
    }
    console.log(
      "🚀 ~ file: main.js ~ line 133 ~ Rover ~ scanSurroundings ~ visibleCells",
      visibleCells
    );
    for (const cell of visibleCells) {
      cell.classList.toggle("visible");
    }
  }
  selectRoverIcon() {
    const roverImageEl = document.getElementById(this.name);
    return roverImageEl;
  }
  turnLeft() {
    let currentHeadingIndex = headings.indexOf(this.heading);
    console.log(
      "🚀 ~ file: main.js ~ line 159 ~ Rover ~ turnLeft ~ currentHeadingIndex",
      currentHeadingIndex
    );
    const roverIcon = this.selectRoverIcon();
    this.iconRotation -= 90;
    console.log("turning left");
    if (currentHeadingIndex === 0) {
      this.heading = headings[3];
    } else {
      currentHeadingIndex -= 1;
      this.heading = headings[currentHeadingIndex];
    }
    this.displayInitialHeading();
    // const newHeadingIndex = headings.indexOf(this.heading);
    // console.log(
    //   "🚀 ~ file: main.js ~ line 170 ~ Rover ~ turnLeft ~ newHeadingIndex",
    //   newHeadingIndex
    // );
    // roverIcon.style.transform =
    //   this.transformSettingsForRoverIcons[newHeadingIndex];
  }
  turnRight() {
    const currentHeadingIndex = headings.indexOf(this.heading);
    this.iconRotation += 90;
    if (currentHeadingIndex === 3) {
      this.heading = headings[0];
    } else {
      this.heading = headings[currentHeadingIndex + 1];
    }
    this.displayInitialHeading();
    // const newHeadingIndex = headings.indexOf(this.heading);
    // roverIcon.style.transform =
    //   this.transformSettingsForRoverIcons[newHeadingIndex];
  }
  move() {
    const previousCell = this.getCurrentCell();
    const roverIcon = this.selectRoverIcon();
    console.log(
      "🚀 ~ file: main.js ~ line 182 ~ Rover ~ move ~ previousCell",
      previousCell
    );

    switch (this.heading) {
      case "n":
        roverIcon.style.animation =
          "move-north 600ms 100ms ease-in-out forward";
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
      // return GameOverDisplay();
      /// TODO write function to display gameover message
    }
    if (this.xPosition > xLimit || this.yPosition > yLimit) {
      console.log(`Your rover has fallen off the plateau!`);
    }

    const newCell = document.getElementsByClassName(
      `x${this.xPosition}-y${this.yPosition}`
    )[0];
    console.log(
      "🚀 ~ file: main.js ~ line 202 ~ Rover ~ move ~ newCell",
      newCell
    );
    function replaceIcon() {
      newCell.innerHTML = previousCell.innerHTML;
      previousCell.innerHTML = "";
    }
    setTimeout(replaceIcon(), 700);
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
    }
    console.log(
      `${this.name} new position: ${this.xPosition}, ${this.yPosition}, Heading: ${this.heading}`
    );
    this.turnCount += 1;
  }

  getCurrentCell() {
    return document.getElementsByClassName(
      `x${this.xPosition}-y${this.yPosition}`
    )[0];
  }
  displayInitialHeading() {
    const roverImgEl = this.selectRoverIcon();
    console.log(this.name, "heading:", this.heading);
    console.log("roverImgEl", roverImgEl);
    switch (this.heading) {
      case "e":
        roverImgEl.style.transform = `rotate(90deg) translate(-20px,0px)`;
        break;
      case "s":
        roverImgEl.style.transform = "rotate(180deg) translate(0, 20px)";
        break;
      case "w":
        roverImgEl.style.transform = "rotate(270deg)  translate(20px, 0px)";
        break;
      case "n":
        roverImgEl.style.transform = "translate(0px, -20px)";
        break;
      default:
        throw new Error(
          `Unknown heading (${this.heading}) passed to displayInitialHeading method.`
        );
    }
  }
  randomMove(numberOfMoves) {
    const randomInstructions = [];
    let i = numberOfMoves;
    while (i > 0) {
      const instruction = instructionsArr[randomNumberGenerator(0, 2)];
      randomInstructions.push(instruction);
      i -= 1;
    }
    const instructionString = randomInstructions.join("");
    this.executeInstructions(instructionString);
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
  const plateau = new Plateau(25, 25);
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
    cell.addEventListener("click", placePlayerRover);
  }
  function placePlayerRover(e) {
    console.log(e);
    const xyStart = getStartingCell(e);
    const xStart = xyStart[0] * 1;
    const yStart = xyStart[1] * 1;
    const heading = headings[randomNumberGenerator(0, 3)];
    playerRover = new Rover("playerRover", xStart, yStart, heading, plateau);
    console.log(
      "🚀 ~ file: main.js ~ line 213 ~ startingCell ~ playerRover",
      playerRover
    );

    xyStart[2][0].innerHTML = `<img id='${playerRover.name}' src="${playerRover.imagePath}" />`;
    playerRover.scanSurroundings();
    playerRover.displayInitialHeading();
    makeGridUnclickable();
    placeRogueRover(plateau.width, plateau.height, xStart, yStart);
  }
  function makeGridUnclickable() {
    const GridArray = Array.from(document.querySelectorAll(".cell"));
    for (const cell of GridArray) {
      cell.removeEventListener("click", placePlayerRover);
      // console.log(cell, "is now unclickable");
    }
  }
  function placeRogueRover(xMax, yMax, playerStartX, playerStartY) {
    let startX = randomNumberGenerator(1, xMax);
    let startY = randomNumberGenerator(1, yMax);
    while (startX == playerStartX && startY == playerStartY) {
      startX = randomNumberGenerator(1, xMax);
      startY = randomNumberGenerator(1, yMax);
    }
    const heading = headings[randomNumberGenerator(0, 3)];
    rogueRover = new Rover("rogueRover", startX, startY, heading, plateau);
    const startCellClass = `x${startX}-y${startY}`;
    const startingCell = document.getElementsByClassName(startCellClass);
    console.log(
      "🚀 ~ file: main.js ~ line 316 ~ placeRogueRover ~ startingCell",
      startingCell
    );

    startingCell[0].innerHTML = `<img id='${rogueRover.name}' src="/assets/rogue-rover-icon.svg" />`;
    console.log("Rogue Rover", rogueRover);
    rogueRover.displayInitialHeading();
  }
});

const navInputForm = document.forms["instruction-input-form"];
// Takes the players instructions and makes the rover execute them
navInputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = serialize(navInputForm);
  const instructions = data["navigation-input"];
  playerRover.executeInstructions(instructions);
  console.log(playerRover);
  navInputForm.reset();
  headingDisplay.textContent = playerRover.heading;
  turnCountDisplay.textContent = `${playerRover.turnCount}`;
  coordinatesDisplay.textContent = ` x: ${playerRover.xPosition} - y: ${playerRover.yPosition}`;
  if (testForWin()) {
    console.log("Congratulations! You have docked with the Rogue Rover.");
  } else {
    rogueRover.randomMove(5);
  }
});

function getStartingCell(clickEvent) {
  const xyString = clickEvent.target.classList[1];
  console.log(
    "🚀 ~ file: main.js ~ line 222 ~ getStartingCell ~ xyString",
    xyString
  );
  const regex = /[1-9]{1,}/g;
  const xyArr = [...xyString.match(regex)];
  console.log("🚀 ~ file: main.js ~ line 229 ~ getStartingCell ~ xyArr", xyArr);
  const cell = document.getElementsByClassName(xyString);
  xyArr.push(cell);
  return xyArr;
}

function testForWin() {
  if (playerRover.getCurrentCell() == rogueRover.getCurrentCell()) {
    messagesDisplay.textContent =
      "Congratulations! You have docked with the rogue rover";
    return true;
  } else {
    return false;
  }
}
