let capture;
let pg; 
let bubbles = []; 
let numBubbles = 50; 
let saveBtn; // 宣告按鈕變數

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  pg = createGraphics(640, 480);

  for (let i = 0; i < numBubbles; i++) {
    bubbles[i] = new Bubble(random(640), random(480, 480 + 200));
  }

  // --- 產生按鈕 ---
  saveBtn = createButton('擷取畫面 (JPG)');
  // 設定按鈕位置 (放在畫布下方中心)
  saveBtn.position(windowWidth / 2 - saveBtn.width / 2, windowHeight - 50);
  // 設定按鈕點擊事件
  saveBtn.mousePressed(captureImage);
}

function draw() {
  background('#e7c6ff');

  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 更新按鈕位置，確保視窗縮放時按鈕依然置中
  saveBtn.position(width / 2 - saveBtn.width / 2, y + videoH + 20);

  // A. 繪製視訊 (鏡像)
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  pop();

  // B. 製作氣泡
  if (pg.width !== capture.width || pg.height !== capture.height) {
    pg = createGraphics(capture.width, capture.height);
  }
  pg.clear();
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display(pg);
  }

  // C. 疊加氣泡 (鏡像)
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(pg, 0, 0, videoW, videoH);
  pop();
}

// 擷取並儲存圖片的函式
function captureImage() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 使用 get(x, y, w, h) 擷取主畫布中心顯示視訊的區域
  let snapshot = get(x, y, videoW, videoH);
  
  // 儲存為 jpg
  save(snapshot, 'my_snapshot.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- 氣泡類別 (保持不變) ---
class Bubble {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.r = random(5, 15);
    this.speed = random(1, 3);
    this.noiseOffset = random(1000);
  }
  move() {
    this.y -= this.speed;
    this.x += map(noise(this.noiseOffset), 0, 1, -0.5, 0.5);
    this.noiseOffset += 0.01;
    if (this.y < -this.r * 2) this.reset(pg.width, pg.height);
  }
  display(targetPG) {
    targetPG.stroke(255, 150);
    targetPG.fill(255, 50);
    targetPG.ellipse(this.x, this.y, this.r * 2);
    targetPG.fill(255, 200);
    targetPG.ellipse(this.x - this.r*0.3, this.y - this.r*0.3, this.r*0.5);
  }
  reset(w, h) {
    this.x = random(w);
    this.y = random(h, h + 100);
  }
}