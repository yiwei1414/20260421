let capture;

function setup() {
  // 1. 產生全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片標籤，只在 p5 畫布上繪製
  capture.hide();
}

function draw() {
  // 3. 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 4. 計算 60% 的影像寬高
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  
  // 5. 計算置中座標
  // 畫布中心 (width/2) 減去 影像一半寬度 (videoW/2)
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  
  // 6. 將攝影機影像繪製在畫布中間
  image(capture, x, y, videoW, videoH);
}

// 視窗大小改變時，自動調整畫布大小保持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}