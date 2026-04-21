let capture;
let pg; // 宣告離屏畫布變數

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 1. 建立一個與視訊來源解析度相同的 graphics 物件
  // 注意：capture.width/height 在 setup 剛開始時可能還沒抓到，
  // 所以通常會手動設定一個基準解析度，或在 draw 中動態檢查。
  pg = createGraphics(640, 480); 
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

  // --- B. 在離屏畫布 (Graphics) 上畫東西 ---
  // 我們讓 pg 的大小與攝影機原始比例同步
  if (pg.width !== capture.width || pg.height !== capture.height) {
    pg = createGraphics(capture.width, capture.height);
  }
  
  pg.clear(); // 清除上一幀，保持透明背景
  
  // 在 Graphics 上畫一些圖案或文字（這些會出現在視訊上方）
  pg.fill(255, 255, 0); // 黃色
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50); // 中心點畫個圓形
  
  pg.fill(0);
  pg.textSize(30);
  pg.textAlign(CENTER);
  pg.text("疊加層 (Graphics)", pg.width / 2, 50);

  // --- C. 將 Graphics 疊加顯示在畫布上 ---
  // 為了對齊視訊畫面，這裡同樣需要做鏡像與座標處理
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(pg, 0, 0, videoW, videoH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}