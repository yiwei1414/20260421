let capture;
let pg; 
let bubbles = []; 
let numBubbles = 50; 
let saveBtn;
const gridSize = 20; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 指定一個常見的解析度，確保穩定
  capture = createCapture(VIDEO);
  capture.size(640, 480); 
  capture.hide();

  pg = createGraphics(640, 480);
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i] = new Bubble(random(640), random(480, 480 + 200));
  }

  saveBtn = createButton('擷取黑白畫面 (JPG)');
  saveBtn.mousePressed(captureImage);
}

function draw() {
  background('#e7c6ff');

  // 檢查攝影機是否已經準備好，避免抓到全黑畫面
  if (capture.width <= 1) return;

  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  saveBtn.position(width / 2 - saveBtn.width / 2, y + videoH + 20);

  // --- A. 處理黑白馬賽克 ---
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  
  let scaleX = videoW / capture.width;
  let scaleY = videoH / capture.height;
  
  // 核心修正：先載入像素資料
  capture.loadPixels();
  
  // 遍歷單位
  for (let gy = 0; gy < capture.height; gy += gridSize) {
    for (let gx = 0; gx < capture.width; gx += gridSize) {
      // 效能優化：直接從 pixels 陣列計算索引，不使用 get()
      // 公式: index = (x + y * width) * 4
      let index = (gx + gy * capture.width) * 4;
      
      let r = capture.pixels[index];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];
      
      // 計算灰階值
      let avg = (r + g + b) / 3;
      
      fill(avg);
      noStroke();
      // 繪製方塊
      rect(gx * scaleX, gy * scaleY, gridSize * scaleX, gridSize * scaleY);
    }
  }
  pop();

  // --- B. 氣泡與疊加 (保持不變) ---
  if (pg.width !== capture.width || pg.height !== capture.height) {
    pg = createGraphics(capture.width, capture.height);
  }
  pg.clear();
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display(pg);
  }

  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(pg, 0, 0, videoW, videoH);
  pop();
}

// 擷取與氣泡類別程式碼同前...
function captureImage() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  let snapshot = get(x, y, videoW, videoH);
  save(snapshot, 'grayscale_mosaic.jpg');
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

class Bubble {
  constructor(startX, startY) {
    this.x = startX; this.y = startY;
    this.r = random(5, 15); this.speed = random(1, 3);
    this.noiseOffset = random(1000);
  }
  move() {
    this.y -= this.speed;
    this.x += map(noise(this.noiseOffset), 0, 1, -0.5, 0.5);
    this.noiseOffset += 0.01;
    if (this.y < -this.r * 2) this.reset(640, 480);
  }
  display(targetPG) {
    targetPG.stroke(255, 150); targetPG.fill(255, 50);
    targetPG.ellipse(this.x, this.y, this.r * 2);
    targetPG.fill(255, 200); targetPG.ellipse(this.x - this.r*0.3, this.y - this.r*0.3, this.r*0.5);
  }
  reset(w, h) { this.x = random(w); this.y = random(h, h + 100); }
}