let dots = []; 
let cols, rows;
let size = 60; 
let margin = 149; 

let pg;
let clickCount = 0;

let QxOffset = 0;  
let QyOffset = 0;    
let Qvelocity = 0;  
let Qgravity = 0.8;
let QjumpForce = -25;
let QjumpDist = -740;

let WxOffset = 0;
let WyOffset = 0;
let Wvelocity = 0;
let Wgravity = 0.8;
let WjumpForce = -22;
let WjumpDist = -590;

let ExOffset = 0;
let EyOffset = 0;
let Evelocity = 0;
let Egravity = 0.8;
let EjumpForce = -20;
let EjumpDist = -400;

let RxOffset = 0;
let RyOffset = 0;
let Rvelocity = 0;
let Rgravity = 0.8;
let RjumpForce = -18; 
let RjumpDist = -400;  

// 음악
let song0, song1, song2, song3, song4, song5; 
let volon0, volon1 = 0, volon2 = 0, volon3 = 0, volon4 = 0, volon5 = 0;
let soundLoaded = false;

// 상태
let gameState = "INTRO";
let isChangingState = false;

let introOffset = 0;
let introStarted = false;
let introImgX = 0;
let introImgVelocity = -25;
let introImgGravity = 0.8;
let introTiltStarted = false;
let introTiltAngle = 0;

let bg;
let matryoImg;

let QStarted = false;
let WStarted = false;
let EStarted = false;
let RStarted = false;

let QrevealAlpha = 0;
let WrevealAlpha = 0;
let ErevealAlpha = 0;
let RrevealAlpha = 0;

let waveStrength = 0;


const BG_R = 242, BG_G = 234, BG_B = 230;



const C1 = [238, 229, 194]; // 크림 
const C2 = [211, 220, 124]; // 라임
const C3 = [142, 189, 157]; // 세이지
const C4 = [27,  71,  93];  // 네이비 
const CW = [255, 255, 255]; // 흰색 


let layerCount = 0; // 0,1,2,3,4


let QfixedX, WfixedX, EfixedX, RfixedX;
let QfixedY, WfixedY, EfixedY, RfixedY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);


  QfixedX = windowWidth / 2;
  WfixedX = windowWidth / 2;
  EfixedX = windowWidth / 2;
  RfixedX = windowWidth / 2;

  QfixedY = windowHeight / 2;
  WfixedY = windowHeight / 2;
  EfixedY = windowHeight / 2;
  RfixedY = windowHeight / 2;

  let startBtn = select('#start-button');
  startBtn.mousePressed(() => {
    if (!introStarted) {
      introStarted = true;
      introImgVelocity = -25;
      userStartAudio();
      song0 = loadSound('Track0.mp3', () => { song0.play(); song0.setVolume(1); });
    }
    return false;
  });

  let restartBtn = select('#restart-button');
  restartBtn.mousePressed(() => {
    location.reload();
  });

  cols = (width - margin * 2) / size;
  rows = (height - margin * 2) / size;

  for (let i = 0; i < cols; i++) {
    dots[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = margin + i * size;
      let y = margin + j * size;
      dots[i][j] = new Dot(x, y);
    }
  }
}

class Dot {
  constructor(x, y) {
    this.pos = createVector(x, y);  
    this.dotColor = color(210, 200, 196);
  }
  update() {}
  display() {
    noStroke();
    fill(this.dotColor);
    ellipse(this.pos.x, this.pos.y, 30, 30);
  }
}

function mousePressed() {
  if (isChangingState) return;

  if (gameState === "INTRO") {
    if (!introStarted) {
      introStarted = true;
      introImgVelocity = -25;
      userStartAudio();
      song0 = loadSound('Track0.mp3', () => { song0.play(); song0.setVolume(1); });
    }
    return;
  }

  if (gameState === "PLAY") {
    clickCount++;
    song0 = loadSound('Track0.mp3', () => { song0.play(); song0.setVolume(1); });

    if (QyOffset >= -400 && QyOffset <= 200) {
      Qvelocity = QjumpForce;
      QxOffset += QjumpDist;
      QStarted = true;
    }
    if (WyOffset >= -400 && WyOffset <= 200 && QjumpDist === 0) {
      Wvelocity = WjumpForce;
      WxOffset += WjumpDist;
      WStarted = true;
    }
    if (EyOffset >= -400 && EyOffset <= 200 && WjumpDist === 0) {
      Evelocity = EjumpForce;
      ExOffset += EjumpDist;
      EStarted = true;
    }
    if (RyOffset >= -400 && RyOffset <= 200 && EjumpDist === 0) {
      Rvelocity = RjumpForce;
      RxOffset += RjumpDist;
      RStarted = true;
    }
  }
}

function preload() {
  bg = loadImage('bgMatryoshka.png');
  matryoImg = loadImage('matryo.png');
}


function drawLayered(cx, cy, baseW, baseH, gap, layers, alpha) {
  // 레이어 [C4, C3, C2, C1] 순서로 바깥에서 안으로
  let palette = [C1, C2, C3, C4];
  

  for (let l = layers - 1; l >= 0; l--) {
    let w = baseW + gap * l;
    let h = baseH + gap * l;
    let col = palette[l % palette.length];
    tint(col[0], col[1], col[2], alpha);
    imageMode(CENTER);
    image(matryoImg, cx, cy, w, h);
  }
  noTint();
}

function draw() {

  //INTRO
  if (gameState === "INTRO") {
    background(BG_R, BG_G, BG_B);

    if (!introStarted) {
      let pulse = 1 + 0.06 * sin(frameCount * 0.05);
      select('#start-button').style('transform', `scale(${pulse})`);
    }

    if (introStarted) {
      introImgVelocity += introImgGravity;
      introImgX += 40;
      introOffset += introImgVelocity;
      if (introOffset > 200) {
        introOffset = 200;
        introImgVelocity *= -0.82;
      }
    }

    if (introImgX > windowWidth) {
      select('#intro-screen').hide();
      gameState = "PLAY";
    }

    imageMode(CENTER);

    tint(C3[0], C3[1], C3[2], 255);
    //image(matryoImg, windowWidth/2, windowHeight/2, 900 * 5.5, 1500 * 5.4);

    tint(BG_R, BG_G, BG_B, 255);
    //image(matryoImg, windowWidth/2, windowHeight/2, 900 * 4.5, 1500 * 3.4);

    tint(C4[0], C4[1], C4[2], 255);
    image(matryoImg, windowWidth/2, windowHeight/2, 1900, 2200);

    tint(C3[0], C3[1], C3[2], 255);
    image(matryoImg, windowWidth/2, windowHeight/2, 1650, 2100);

    tint(C2[0], C2[1], C2[2], 255);
    image(matryoImg, windowWidth/2, windowHeight/2, 1450, 1950);

    tint(C1[0], C1[1], C1[2], 255);
    image(matryoImg, windowWidth/2, windowHeight/2, 1200, 1750);
    noTint();

    tint(CW[0], CW[1], CW[2], 255);
    image(matryoImg, windowWidth/2 + introImgX, windowHeight/2 + introOffset, 900, 1500);
    noTint();

  // PLAY 
  } else if (gameState === "PLAY") {

 
    background(BG_R, BG_G, BG_B);

    // 음악
    if (!soundLoaded && QjumpDist === 0 && QStarted) {
      soundLoaded = true;
      song1 = loadSound('Track1.mp3', () => { song1.loop(); song1.setVolume(1); });
      song2 = loadSound('Track2.mp3', () => { song2.loop(); song2.setVolume(0); });
      song3 = loadSound('Track3.mp3', () => { song3.loop(); song3.setVolume(0); });
      song4 = loadSound('Track4.mp3', () => { song4.loop(); song4.setVolume(0); });
      song5 = loadSound('Track5.mp3', () => { song5.loop(); song5.setVolume(0); });
    }
    if (song2 && WjumpDist === 0 && WStarted) { song2.setVolume(1); song1.setVolume(0.5); }
    if (song3 && EjumpDist === 0 && EStarted) { song3.setVolume(0.5); song2.setVolume(0.5); }
    if (song4 && EjumpDist === 0 && EStarted) { song4.setVolume(1); }
    if (song5 && RjumpDist === 0 && RStarted) { song5.setVolume(1); song4.setVolume(0.5); }

    // 점 색상 — 레이어 쌓이는 순서대로
    let dotR = 210, dotG = 200, dotB = 196;
    if      (RjumpDist === 0 && RStarted) { dotR = C4[0]; dotG = C4[1]; dotB = C4[2]; }
    else if (EjumpDist === 0 && EStarted) { dotR = C3[0]; dotG = C3[1]; dotB = C3[2]; }
    else if (WjumpDist === 0 && WStarted) { dotR = C2[0]; dotG = C2[1]; dotB = C2[2]; }
    else if (QjumpDist === 0 && QStarted) { dotR = C1[0]; dotG = C1[1]; dotB = C1[2]; }

    // 파도 강도 
    if (RjumpDist === 0 && RStarted) {
      waveStrength = min(waveStrength + 0.015, 1);
    }

  
    noStroke();
    let t = frameCount * 0.03;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots[i][j].update();
        fill(dotR, dotG, dotB);
        let px = dots[i][j].pos.x;
        let py = dots[i][j].pos.y;
        if (waveStrength > 0) {
          let dx = sin(py * 0.018 + t) * 18 * waveStrength;
          let dy = sin(px * 0.018 + t) * 18 * waveStrength;
          px += dx;
          py += dy;
        }
        ellipse(px, py, 30, 30);
      }
    }


    QrevealAlpha = constrain(map(QxOffset, 0, -3100, 0, 255), 0, 255);
    WrevealAlpha = constrain(map(WxOffset, 0, -2650, 0, 165), 0, 165);
    ErevealAlpha = constrain(map(ExOffset, 0, -2100, 0, 135), 0, 135);
    RrevealAlpha = constrain(map(RxOffset, 0, -1500, 0, 105), 0, 105);

    // 가리개 
    rectMode(CENTER);
    fill(BG_R, BG_G, BG_B);
    rect(width/2 - 240, height/2, 80, 950);

    fill(BG_R, BG_G, BG_B, 255 - QrevealAlpha);
    rect(width/2, height/2, windowWidth, windowHeight);

    fill(BG_R, BG_G, BG_B, 255 - WrevealAlpha);
    rect(width/2, height/2, windowWidth/2 + 1400, windowHeight);

    fill(BG_R, BG_G, BG_B, 255 - ErevealAlpha);
    rect(width/2, height/2, windowWidth/2 + 800, windowHeight);

    fill(BG_R, BG_G, BG_B, 255 - RrevealAlpha);
    rect(width/2, height/2, windowWidth/2 + 400, windowHeight);

    fill(BG_R, BG_G, BG_B, 255);
    rect(width/2, height/2, windowWidth/2 + 120, windowHeight);

    // 현재 레이어 수 계산
    // Q고정=1, W고정=2, E고정=3, R고정=4
    let currentLayers = 0;
    if (QjumpDist === 0 && QStarted) currentLayers = 1;
    if (WjumpDist === 0 && WStarted) currentLayers = 2;
    if (EjumpDist === 0 && EStarted) currentLayers = 3;
    if (RjumpDist === 0 && RStarted) {
      currentLayers = 4;
      select('#restart-button').show();
    }



    //---------- R껍질 (가장 작은 4번째) ----------
    let Ropacity = 255 - RrevealAlpha;
    if (EjumpDist === 0) {
      if (RxOffset >= -1600) {
        Rvelocity += Rgravity;
        RyOffset += Rvelocity;
      } else {
        Rgravity = 0;
        RyOffset = 0;
        RjumpDist = 0;
        Ropacity = 255;
      }
    }
    if (RyOffset > 0) { RyOffset = 0; Rvelocity *= -0.45; }

    push();
    translate(RxOffset, RyOffset);
    imageMode(CENTER);
    let Rlayers = currentLayers >= 4 ? 4 : 0;
    let Rpulse = (RjumpDist === 0 && RStarted) ? 1 + 0.025 * sin(frameCount * 0.05 + 1.5) : 1;
    if (Rlayers > 0) {
      for (let l = Rlayers - 1; l >= 3; l--) {
        let w = (300 + 70 * l) * Rpulse;
        let h = (450 + 105 * l) * Rpulse;
        let col = [C1, C2, C3, C4][l];
        tint(col[0], col[1], col[2], Ropacity);
        image(matryoImg, windowWidth + 400, windowHeight/2 + 530, w, h);
      }
      tint(255, 255, 255, 255);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 530, 440 * Rpulse, 660 * Rpulse);
      noTint();
    } else if (RStarted) {
      tint(255, 255, 255, Ropacity);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 530, 440 * Rpulse, 660 * Rpulse);
      noTint();
    }
    pop();

    //---------- E껍질 (3번째) ----------
    let Eopacity = 255 - ErevealAlpha;
    if (WjumpDist === 0) {
      if (ExOffset >= -2100) {
        Evelocity += Egravity;
        EyOffset += Evelocity;
      } else {
        Egravity = 0;
        EyOffset = 0;
        EjumpDist = 0;
        Eopacity = 255;
      }
    }
    if (EyOffset > 0) { EyOffset = 0; Evelocity *= -0.45; }

    push();
    translate(ExOffset, EyOffset);
    imageMode(CENTER);
    let Elayers = currentLayers >= 3 ? currentLayers : 0;
    let Epulse = (EjumpDist === 0 && EStarted) ? 1 + 0.025 * sin(frameCount * 0.05 + 1.0) : 1;
    if (Elayers > 0) {
      for (let l = Elayers - 1; l >= 2; l--) {
        let w = (420 + 100 * l) * Epulse;
        let h = (630 + 150 * l) * Epulse;
        let col = [C1, C2, C3, C4][l];
        tint(col[0], col[1], col[2], Eopacity);
        image(matryoImg, windowWidth + 400, windowHeight/2 + 450, w, h);
      }
      tint(255, 255, 255, Eopacity);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 450, 520 * Epulse, 780 * Epulse);
      noTint();
    } else if (EStarted) {
      tint(255, 255, 255, 255);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 450, 520 * Epulse, 780 * Epulse);
      noTint();
    }
    pop();

    //---------- W껍질 (2번째) ----------
    let Wopacity = 255 - WrevealAlpha;
    if (QjumpDist === 0) {
      if (WxOffset >= -2550) {
        Wvelocity += Wgravity;
        WyOffset += Wvelocity;
      } else {
        Wgravity = 0;
        WyOffset = 0;
        WjumpDist = 0;
        Wopacity = 255;
      }
    }
    if (WyOffset > 0) { WyOffset = 0; Wvelocity *= -0.45; }

    push();
    translate(WxOffset, WyOffset);
    imageMode(CENTER);
    let Wlayers = currentLayers >= 2 ? currentLayers : 0;
    let Wpulse = (WjumpDist === 0 && WStarted) ? 1 + 0.025 * sin(frameCount * 0.05 + 0.5) : 1;
    if (Wlayers > 0) {
      for (let l = Wlayers - 1; l >= 1; l--) {
        let w = (600 + 130 * l) * Wpulse;
        let h = (900 + 200 * l) * Wpulse;
        let col = [C1, C2, C3, C4][l];
        tint(col[0], col[1], col[2], Wopacity);
        image(matryoImg, windowWidth + 400, windowHeight/2 + 300, w, h);
      }
      tint(255, 255, 255, Wopacity);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 300, 600 * Wpulse, 900 * Wpulse);
      noTint();
    } else if (WStarted) {
      tint(255, 255, 255, 255);
      image(matryoImg, windowWidth + 400, windowHeight/2 + 300, 600 * Wpulse, 900 * Wpulse);
      noTint();
    }
    pop();

    //---------- Q껍질 (가장 큰 1번째) ----------
    let Qopacity = 255 - 0.2 *QrevealAlpha;
    if (QxOffset >= -3300) {
      Qvelocity += Qgravity;
      QyOffset += Qvelocity;
    } else {
      Qgravity = 0;
      QyOffset = 0;
      QjumpDist = 0;
      Qopacity = 255;
    }
    if (QyOffset > 0) { QyOffset = 0; Qvelocity *= -0.45; }

    push();
    translate(QxOffset, QyOffset);
    imageMode(CENTER);
    let Qlayers = currentLayers >= 1 ? currentLayers : 0;
    let Qpulse = (QjumpDist === 0 && QStarted) ? 1 + 0.025 * sin(frameCount * 0.05) : 1;
    if (Qlayers > 0) {
      for (let l = Qlayers - 1; l >= 0; l--) {
        let w = (900 + 160 * l) * Qpulse;
        let h = (1500 + 250 * l) * Qpulse;
        let col = [C1, C2, C3, C4][l];
        tint(col[0], col[1], col[2], Qopacity);
        image(matryoImg, windowWidth + 400, windowHeight/2, w, h);
      }
      tint(255, 255, 255, Qopacity);
      image(matryoImg, windowWidth + 400, windowHeight/2, 740 * Qpulse, 1250 * Qpulse);
      noTint();
    } else if (QStarted) {
      tint(255, 255, 255, 255);
      image(matryoImg, windowWidth + 400, windowHeight/2, 740 * Qpulse, 1250 * Qpulse);
      noTint();
    }


    pop();

    // 2번째 갔을때 텍스트
    if (clickCount === 0) {
      let textPulse = 1 + 0.06 * sin(frameCount * 0.05);
      noStroke();
      fill(BG_R - 40, BG_G - 40, BG_B - 40);
      textFont('Plus Jakarta Sans');
      textSize(180 * textPulse);
      textAlign(CENTER, BOTTOM);
      text('Click to Open', windowWidth / 2, windowHeight/2);
    }
  }
}







  





