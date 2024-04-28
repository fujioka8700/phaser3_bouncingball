function isSmartPhone() {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}

let width: number;
let height: number;
let fontSize: string;

if (isSmartPhone() == true) {
  width = 500;
  height = 800;
  fontSize = "40px";
} else {
  width = 750;
  height = 500;
  fontSize = "16px";
}

export const gameConfigs = {
  width: width,
  height: height,
  backgroundColor: 0x87ceeb,
};

export const gameOptions = {
  bounceHeight: 300,
  ballGravity: 1200,
  ballPower: 1200,
  obstacleSpeed: 250,
  obstacleDistanceRange: [200, 450],
  localStorageName: "bestballscore",
  fontSize: fontSize,
};
