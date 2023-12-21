"use strict";
/** Adapted from https://codepen.io/pimskie/pen/jEVPNx **/

window.running = true;
window.start = () => (window.running = true);
window.stop = () => (window.running = false);

function Flake(x, y, maxSpeedConfig) {
  const maxWeight = 5;
  
  // Get the screen height
  const screenHeight = window.innerHeight;

  // Define a base speed for a standard screen height (adjust this based on a common reference, like 1080 for Full HD screens)
  const standardScreenHeight = 1920;

  // Adjust maxSpeed based on screen height
  const maxSpeed = 1.25 * (screenHeight / standardScreenHeight);

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
  canvasElement.style.top = "0";

  document.body.appendChild(canvasElement);
  return canvasElement;
}

function initHolidayOverlay({
  name,
  drawLines,
  imageSrc,
  maxSpeed,
}) {
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

  var i = imageSrc.length,
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
    const src = imageSrc[i % imageSrc.length];
    const background = new Image();
    if (src === "snow") {
      ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgba(255, 255, 255, " + flakeA.alpha + ")";
    } else if (src.includes("http") || src.includes("/")) {
      background.src = src;
      if (src.includes("santas-sleigh")) {
        ctx.drawImage(background, flakeA.x, flakeA.y, 160, 103);
      } else {
        ctx.drawImage(background, flakeA.x, flakeA.y, 32, 32);
      }
      
    } else {
      ctx.font = "20pt serif";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(src, flakeA.x, flakeA.y);
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

function makeRange(startDay, endDay) {
  const numberOfDays = endDay + 1 - startDay;
  return Array.from(new Array(numberOfDays), (x, i) => i + startDay);
}

function validateDate(month, days) {
  const now = new Date();
  return days.includes(now.getDate()) && now.getMonth() == month - 1;
}

console.log("Loaded ha-snow.js");

const isMemorialDay = validateDate(5, makeRange(29, 31));
const isFourth = validateDate(7, makeRange(3, 5));
const isOctober = validateDate(10, makeRange(1, 31));
const isHalloween = validateDate(10, makeRange(30, 31));
const isFall = validateDate(11, makeRange(1, 26));
const isThanksgiving = validateDate(11, makeRange(20, 26));
const isDecember = validateDate(12, makeRange(1, 25));
const isChristmas = validateDate(12, makeRange(20, 25));
const isNewYears = validateDate(12, makeRange(29, 31)) || validateDate(12, makeRange(1, 1));

function run() {
  if (isMemorialDay || isFourth) {
    initHolidayOverlay({
      name: isMemorialDay ? "Memorial Day" : "4th of July",
      drawLines: false,
      imageSrc: ["🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸"],
      maxSpeed: 2,
    });
  } else if (isOctober) {
    const imageSrcs = ["/local/local/assets/spooky_ghost.png", "🎃"]
    if (isHalloween) {
      imageSrcs.push("👻");
      imageSrcs.push("💀");
      imageSrcs.push("🍬");
    }

    initHolidayOverlay({
      name: "Halloween",
      drawLines: false,
      imageSrc: imageSrcs,
      maxSpeed: 1,
    });
  } else if (isFall) {
    const leafImg = "🍁";
    const imgs = [leafImg];
    if (isThanksgiving) {
      imgs.push("🦃");
      imgs.push("🦃");
      imgs.push("🦃");
      imgs.push("🍂");
      imgs.push("🍂");
      imgs.push("🍂");
    }

    initHolidayOverlay({
      name: "Fall",
      drawLines: false,
      imageSrc: imgs,
      maxSpeed: 1,
    });
  } else if (isDecember) {
    const date = new Date();
    const flakes = []
    let numFlakes = date.getDate() * 2;
    for (let i = 0; i < numFlakes; i++) {
      flakes.push("snow");
    }
    if (isChristmas) {
      flakes.push("https://raw.githubusercontent.com/konecnyna/ha-holiday-integration/main/assets/santas-sleigh.png");
      flakes.push("🎄");
      flakes.push("🎄");
      flakes.push("🎄");
    }

    initHolidayOverlay({
      name: "Christmas",
      drawLines: false,
      maxSpeed: 3,
      imageSrc: flakes,
    });
  } else if (isNewYears) {
    initHolidayOverlay({
      name: "New Years",
      drawLines: false,
      imageSrc: ["🎉", "🎉", "🎉", "🎉", "🥂"],
      maxSpeed: 2,
    });
  }
}

window.test = () => {
  if (window.running) {
    window.running = false;
    return;
  }

  window.running = true;
  initHolidayOverlay({
    drawLines: false,
    imageSrc: ["https://raw.githubusercontent.com/konecnyna/ha-holiday-integration/main/assets/warning.png"],
    maxSpeed: 2,
  });
};

run();
