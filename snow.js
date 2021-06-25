"use strict";
/** Adapted from https://codepen.io/pimskie/pen/jEVPNx **/

window.running = true;
window.start = () => window.running = true;
window.stop = () => window.running = false;


function Flake(x, y, maxSpeedConfig) {
  const maxWeight = 5;
  const maxSpeed = maxSpeedConfig || 3;

  this.x = x;
  this.y = y;
  this.r = randomBetween(0, 1);
  this.a = randomBetween(0, Math.PI);
  this.aStep = 0.01;

  this.weight = randomBetween(2, maxWeight);
  this.alpha = this.weight / maxWeight;
  this.speed = (this.weight / maxWeight) * maxSpeed;

  this.update = function () {
    this.x += Math.cos(this.a) * this.r;
    this.a += this.aStep;

    this.y += this.speed;
  };
}

function makeCanvasElement() {
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "snow";
  canvasElement.style.backgroundColor = "transparent";
  canvasElement.style.position = "absolute";
  canvasElement.style.pointerEvents = "none";
  document.body.appendChild(canvasElement);
  return canvasElement;
}

function initHolidayOverlay(
  { name, numFlakes, drawLines, imageSrc, maxSpeed },
) {
  console.log(`Enabling ${name} mode`);
  const flakes = [];
  const windowW = window.innerWidth;
  const windowH = window.innerHeight;
  const canvasElement = document.querySelector(".snow") || makeCanvasElement();

  const canvas = document.querySelector(".snow");
  const ctx = canvas.getContext("2d");

  canvasElement.style.backgroundColor = "transparent";
  canvasElement.style.position = "absolute";
  canvasElement.style.pointerEvents = "none";

  var i = numFlakes,
    flake,
    x,
    y;

  while (i--) {
    x = randomBetween(0, windowW, true);
    y = randomBetween(0, windowH, true);

    flake = new Flake(x, y, maxSpeed);
    flakes.push(flake);
  }

  scaleCanvas(canvas, windowW, windowH);
  loop(ctx, flakes, drawLines, imageSrc, windowW, windowH);
}

function scaleCanvas(canvas, windowW, windowH) {
  canvas.width = windowW;
  canvas.height = windowH;
}

function loop(ctx, flakes, drawLines, imageSrc, windowW, windowH) {
  var i = flakes.length,
    z,
    dist,
    flakeA,
    flakeB;

  if (!window.running) {
    ctx.clearRect(0, 0, windowW, windowH);
    return;
  }

  // clear canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, windowW, windowH);
  ctx.restore();

  // loop of hell
  while (i--) {
    flakeA = flakes[i];
    flakeA.update();

    if (drawLines) {
      for (z = 0; z < flakes.length; z++) {
        flakeB = flakes[z];
        if (flakeA !== flakeB && distanceBetween(flakeA, flakeB) < 150) {
          ctx.beginPath();
          ctx.moveTo(flakeA.x, flakeA.y);
          ctx.lineTo(flakeB.x, flakeB.y);
          ctx.strokeStyle = "#444444";
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    ctx.beginPath();
    if (imageSrc && imageSrc.length) {
      const background = new Image();
      background.src = imageSrc[i % imageSrc.length];
      ctx.drawImage(background, flakeA.x, flakeA.y, 32, 32);
    } else {
      ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(255, 255, 255, " + flakeA.alpha + ")";
    }

    ctx.fill();

    if (flakeA.y >= windowH) {
      flakeA.y = -flakeA.weight;
    }
  }

  requestAnimationFrame(() => {
    loop(ctx, flakes, drawLines, imageSrc, windowW, windowH);
  });
}

function randomBetween(min, max, round) {
  var num = Math.random() * (max - min + 1) + min;

  if (round) {
    return Math.floor(num);
  } else {
    return num;
  }
}

function distanceBetween(vector1, vector2) {
  var dx = vector2.x - vector1.x,
    dy = vector2.y - vector1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function makeRange(startDay, numberOfDays) {
  return Array.from(new Array(numberOfDays), (x, i) => i + startDay);
}

function validateDate(month, days) {
  const now = new Date();
  return days.includes(now.getDate()) && now.getMonth() == month - 1;
}

console.log("Loaded ha-snow.js");

const isMemorialDay = validateDate(5, makeRange(29, 31));
const isFourth = validateDate(7, makeRange(3, 5));
const isOctober = validateDate(11, makeRange(1, 31));
const isThanksgiving = validateDate(11, makeRange(20, 26));
const isDecember = validateDate(12, makeRange(1, 25));
const isNewYears = validateDate(12, makeRange(29, 31)) ||
  validateDate(12, makeRange(1, 1));

function run() {
  if (isMemorialDay || isFourth) {
    initHolidayOverlay({
      numFlakes: 3,
      drawLines: false,
      imageSrc: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/flag-united-states_1f1fa-1f1f8.png",
      ],
      maxSpeed: 2,
    });
  } else if (isOctober) {
    initHolidayOverlay({
      numFlakes: 4,
      drawLines: false,
      imageSrc: [
        "http://clipart-library.com/images/M8iGa75ca.png",
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/jack-o-lantern_1f383.png",
      ],
      maxSpeed: 1,
    });
  } else if (isOctober) {
    initHolidayOverlay({
      numFlakes: 4,
      drawLines: false,
      imageSrc: [
        "http://clipart-library.com/images/M8iGa75ca.png",
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/jack-o-lantern_1f383.png",
      ],
      maxSpeed: 1,
    });
  } else if (isThanksgiving) {
    initHolidayOverlay({
      numFlakes: 5,
      drawLines: false,
      imageSrc: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/turkey_1f983.png",
      ],
      maxSpeed: 1,
    });
  } else if (isDecember) {
    initHolidayOverlay({
      numFlakes: 30,
      drawLines: false,
      maxSpeed: 3,
    });
  } else if (isNewYears) {
    initHolidayOverlay({
      numFlakes: 5,
      drawLines: false,
      imageSrc: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/274/party-popper_1f389.png",
      ],
      maxSpeed: 2,
    });
  }
}

window.test = () => {
  initHolidayOverlay({
    numFlakes: 10,
    drawLines: false,
    imageSrc: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/274/warning_26a0-fe0f.png",
    ],
    maxSpeed: 2,
  });  
};

run();