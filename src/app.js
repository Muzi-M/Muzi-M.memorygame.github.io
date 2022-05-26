const htmlElements = {
  win: document.getElementById("win"),
  seconds: document.getElementById("seconds"),
  minutes: document.getElementById("minutes"),
  muteBtn: document.getElementById("mute"),
  clickAudio: document.getElementById("clicking"),
  correctCombo: document.getElementById("correctCombo"),
  winAudio: document.getElementById("winaudio"),
  start: document.getElementById("start"),
  gameCanvas: document.getElementById("gameCanvas"),
  gameOver: document.getElementById("game-over"),
  playAgain: document.getElementById("play-again"),
  streakDiv: document.getElementById("streak"),
  startGameAudio: document.getElementById("startGameAudio"),
};

const projectStrings = {
  timeUp: "Please reload page",
  switchGridsAlert:
    "Please flip a matching card for the flipped card before switching grids",
  hiddenCard: "card card-hidden colour-hidden",
  hiddenColour: "colour-hidden",
};

let clickedCard = null;
let preventClick = false;
let combosFound = 0;
let myInterval;
let preventSound = false;
let streak = 0;

const startGame = () => {
  htmlElements.start.style.display = "none";
  htmlElements.gameCanvas.style.display = "contents";
  htmlElements.gameOver.style.display = "none";
  htmlElements.playAgain.style.display = "none";

  resetGrids();
  sound(htmlElements.startGameAudio);
};

const gameDone = () => {
  htmlElements.start.style.display = "none";
  htmlElements.gameCanvas.style.display = "none";
  htmlElements.gameOver.style.display = "block";
  htmlElements.playAgain.style.display = "none";
  streak = 0;
};

const winGame = () => {
  htmlElements.start.style.display = "none";
  htmlElements.gameCanvas.style.display = "none";
  htmlElements.gameOver.style.display = "none";
  htmlElements.playAgain.style.display = "block";
  winMessage();
};
const fullColours = [
  "yellow",
  "red",
  "black",
  "plum",
  "green",
  "aqua",
  "orange",
  "blue",
];

function assignDataAttributes() {
  const cards = [...document.querySelectorAll(".card")];

  for (let colour of fullColours) {
    const cardAIndex = parseInt(Math.random() * cards.length);
    const cardA = cards[cardAIndex];
    cards.splice(cardAIndex, 1);
    cardA.className += ` ${colour}`;
    cardA.setAttribute("data-colour", colour);

    const cardBIndex = parseInt(Math.random() * cards.length);
    const cardB = cards[cardBIndex];
    cards.splice(cardBIndex, 1);
    cardB.className += ` ${colour}`;
    cardB.setAttribute("data-colour", colour);
  }
}

function onCardClicked(target) {
  target.addEventListener("click", () => {
    if (
      preventClick ||
      target === clickedCard ||
      target.className.includes("done")
    ) {
      return;
    }

    target.className = target.className
      .replace(projectStrings.hiddenColour, "")
      .trim();
    target.className += " done";
    gridPreventClick = true;

    if (!clickedCard) {
      clickedCard = target;
      sound(htmlElements.clickAudio);
    } else if (clickedCard) {
      if (
        clickedCard.getAttribute("data-colour") !==
        target.getAttribute("data-colour")
      ) {
        sound(htmlElements.clickAudio);
        preventClick = true;
        gridPreventClick = true;
        setTimeout(() => {
          clickedCard.className =
            clickedCard.className.replace("done", "").trim() +
            ` ${projectStrings.hiddenColour}`;
          target.className =
            target.className.replace("done", "").trim() +
            ` ${projectStrings.hiddenColour}`;
          clickedCard = null;
          preventClick = false;
          gridPreventClick = false;
        }, 1000);
      } else {
        combosFound++;
        sound(htmlElements.correctCombo);
        clickedCard = null;
        gridPreventClick = false;
        if (combosFound === 8) {
          sound(htmlElements.winAudio);
          clearTimer();
          winGame();
        }
      }
    }
  });
}

function eachCardEventListener() {
  const cards = [...document.querySelectorAll(".card")];
  for (let i = 0; i < cards.length; i++) {
    onCardClicked(cards[i]);
  }
}

function gridSelector() {
  assignDataAttributes();
  preventClick = false;
  clearTimer();
  counter();
  combosFound = 0;
  htmlElements.win.innerHTML = "";
  eachCardEventListener();
}

function counter() {
  let count = 60;
  let minutes = 0;
  myInterval = setInterval(function () {
    count--;
    if ((count + "").length === 1) {
      count = "0" + count;
    }
    htmlElements.seconds.innerHTML = count;
    htmlElements.minutes.innerHTML = minutes;

    if (count === "00") {
      clearTimer();
      htmlElements.seconds.innerHTML = "00";
      count = 0;
      htmlElements.minutes.innerHTML = minutes;
      gameDone();
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(myInterval);
}

function winMessage() {
  const completedSeconds = htmlElements.seconds.innerHTML;

  let displayMessage = "Well done! You completed the game in ";
  const displaySeconds = 60 - parseInt(completedSeconds);

  displayMessage += String(displaySeconds) + " seconds.";
  htmlElements.win.innerHTML = displayMessage;
  streak += 1;
  htmlElements.streakDiv.innerHTML = "Streak: " + String(streak);
}

function resetGrids() {
  const cards = [...document.querySelectorAll(".card")];
  const moreCards = [...document.querySelectorAll(".non-existent")];
  for (let i = 0; i < cards.length; i++) {
    cards[i].className = projectStrings.hiddenCard;
  }
  for (let i = 0; i < moreCards.length; i++) {
    moreCards[i].className = projectStrings.hiddenCard;
  }
  gridSelector();
}

function sound(audio) {
  if (!preventSound) {
    audio.play();
  } else return;
}

htmlElements.muteBtn.addEventListener("click", () => {
  if (!preventSound) {
    preventSound = true;
  } else {
    preventSound = false;
  }
});
