const game = document.getElementById("game");
const stack = document.getElementById("stack");
const movingBlock = document.getElementById("moving-block");
const scoreDisplay = document.getElementById("score");

let score = 0;
let movingRight = true;
let speed = 2;
let blockWidth = 60;
let lastBlockLeft = 120;
let lastBlockWidth = blockWidth;

// Moving block left and right

function moveBlock() {
  let position = parseInt(movingBlock.style.left || "0");
  const gameWidth = game.offsetWidth;

  if (movingRight) {
    position += speed;
    if (position + blockWidth >= gameWidth) {
      movingRight = false;
    }
  } else {
    position -= speed;
    if (position <= 0) {
      movingRight = true;
    }
  }

  movingBlock.style.left = position + "px";
  requestAnimationFrame(moveBlock);
}

// block dropping and aligning

function dropBlock() {
  const movingLeft = parseInt(movingBlock.style.left || "0");
  const overlap =
    Math.min(lastBlockLeft + lastBlockWidth, movingLeft + blockWidth) -
    Math.max(lastBlockLeft, movingLeft);

  if (overlap > 0) {
    // add block to the stack
    const newBlock = document.createElement("div");
    newBlock.className = "block";
    newBlock.style.left = Math.max(lastBlockLeft, movingLeft) + "px";
    newBlock.style.width = overlap + "px";
    newBlock.style.bottom = stack.offsetHeight + "px";

    stack.appendChild(newBlock);
    stack.style.height = stack.offsetHeight + 20 + "px";

    // new block variables

    lastBlockLeft = Math.max(lastBlockLeft, movingLeft);
    lastBlockWidth = overlap;
    blockWidth = overlap;

    // score and speed

    score++;
    scoreDisplay.innerText = "Score: " + score;
    speed += 0.2;

    // check if stack has reached the top of the game area div

    const gameHeight = game.offsetHeight;

    if (stack.offsetHeight + 20 >= gameHeight) {
      showMessage("Congratulations! You have reached the top! Score: " + score);
    }

    // reset the moving block (why make a new one when you can reuse the old one?)
    // (also just realised that I will have to remove all comments before submitting this)
    // (to fit it inside the 3kb limit for the qr code)

    movingBlock.style.width = blockWidth + "px";
    movingBlock.style.left = "0px";
    movingBlock.style.top = parseInt(movingBlock.style.top) - 20 + "px";
  } else {
    showMessage("Game Over! Your final score is: " + score);
  }
}

// key click

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowDown" || e.code === "KeyS") {
    dropBlock();
  }
});

// mouse click

document.addEventListener("click", dropBlock);

function showMessage(message) {
  const messageBox = document.createElement("div");
  messageBox.className = "message-box";
  messageBox.innerText = message;

  document.body.appendChild(messageBox);

  // remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(messageBox);
    restartGame();
    location.reload();
  }, 3000);
}

function restartGame() {
  score = 0;
  scoreDisplay.innerText = "Score: 0";
  stack.innerHTML = ""; // cleared stack
  blockWidth = 60;
  lastBlockLeft = 120;
  lastBlockWidth = blockWidth;
  movingBlock.style.width = blockWidth + "px";
  movingBlock.style.left = "10px";
  movingBlock.style.top = "400px";
  speed = 1;

  initGame();
}

function initGame() {
  // initial block for helping the player to align the blocks
  const initialBlock = document.createElement("div");
  initialBlock.className = "block";
  initialBlock.style.left = lastBlockLeft + "px";
  initialBlock.style.width = lastBlockWidth + "px";
  initialBlock.style.bottom = "0px";
  stack.appendChild(initialBlock);
  stack.style.height = "20px";

  movingBlock.style.left = "10px";
  movingBlock.style.width = blockWidth + "px";
  movingBlock.style.top = "400px";
  moveBlock();
  console.log("Game started");
}

initGame();
