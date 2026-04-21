let capture;
let pg; // 離屏畫布，用於繪製氣泡
let bubbles = []; // 儲存氣泡物件的陣列
let numBubbles = 50; // 氣泡數量

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 1. 初始化離屏畫布 (先設一個預設大小，draw 中會修正)
  pg = createGraphics(640, 480);

  // 2. 建立氣泡物件
  for (let i = 0; i < numBubbles; i++) {
    // 讓氣泡一開始隨機分佈在 pg 的寬度內，高度在底部之外
    bubbles[i] = new Bubble(random(640), random(480, 480 + 200));
  }
}

function draw() {
  background('#e7c6ff');

  // 計算 60% 的影像寬高
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  
  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // --- A. 繪製底層視訊 (含鏡像處理) ---
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  pop();

  // --- B. 在離屏畫布 (Graphics) 上製作冒泡效果 ---
  
  // 確保 pg 的大小與攝影機原始解析度同步
  if (pg.width !== capture.width || pg.height !== capture.height) {
    pg = createGraphics(capture.width, capture.height);
    // 解析度改變時，重新分配氣泡位置
    for (let i = 0; i < numBubbles; i++) {
      bubbles[i].reset(pg.width, pg.height);
    }
  }
  
  pg.clear(); // 清除上一幀，保持透明背景

  // 處理並繪製所有氣泡到 pg 上
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display(pg); // 將 pg 傳入，讓氣泡畫在 pg 上
  }

  // --- C. 將有氣泡的 Graphics 疊加顯示 (同樣需要鏡像) ---
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(pg, 0, 0, videoW, videoH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- 氣泡類別定義 ---
class Bubble {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.r = random(5, 15); // 氣泡半徑
    this.speed = random(1, 3); // 向上移動的速度
    this.noiseOffset = random(1000); // 用於產生左右擺動的 Noise 偏移量
  }

  // 移動氣泡
  move() {
    this.y -= this.speed; // 向上移動
    
    // 使用 Perlin Noise 產生自然的左右輕微擺動
    this.x += map(noise(this.noiseOffset), 0, 1, -0.5, 0.5);
    this.noiseOffset += 0.01;

    // 如果氣泡飄走出畫面頂部，重新從底部產生
    if (this.y < -this.r * 2) {
      this.reset(pg.width, pg.height);
    }
  }

  // 繪製氣泡到指定的 Graphics 物件上
  display(targetPG) {
    targetPG.stroke(255, 150); // 半透明白色邊框
    targetPG.strokeWeight(1);
    targetPG.fill(255, 50); // 极低透明度的白色填充，看起來輕盈
    targetPG.ellipse(this.x, this.y, this.r * 2);
    
    // 加一個小高光，讓它看起來更像氣泡
    targetPG.noStroke();
    targetPG.fill(255, 200);
    targetPG.ellipse(this.x - this.r*0.3, this.y - this.r*0.3, this.r*0.5);
  }

  // 重新設定氣泡位置 (到底部)
  reset(w, h) {
    this.x = random(w);
    this.y = random(h, h + 100); // 在畫面下方 0~100 像素處產生
  }
}