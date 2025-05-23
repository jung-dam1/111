// 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 배경 이미지
const backgroundImg = new Image();
backgroundImg.src = 'images/background.png';

// 점수
let score = 0;

// 주인공 설정
const player = {
  x: 20,
  y: 20,
  width: 60,
  height: 60,
  speed: 3
};

// 주인공, 케이크 이미지
const playerImg = new Image();
playerImg.src = 'images/player.png';

const cakeImg = new Image();
cakeImg.src = 'images/cake.png';

// 아이템 이미지 목록
const itemImgs = [
  { name: 'wash', src: 'images/washitem.png' },
  { name: 'heart', src: 'images/heartitem.png' },
  { name: 'cook', src: 'images/cookitem.png' },
  { name: 'book', src: 'images/bookitem.png' }
];

// 각각 로드된 이미지 저장
const loadedItemImgs = {};
for (let item of itemImgs) {
  const img = new Image();
  img.src = item.src;
  loadedItemImgs[item.name] = img;
  img.onload = checkImagesLoaded;
}

// 키 입력 저장
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// 벽 설정
const walls = [
  { x: 0, y: 0, width: 800, height: 10 },
  { x: 0, y: 0, width: 10, height: 600 },
  { x: 0, y: 590, width: 800, height: 10 },
  { x: 790, y: 0, width: 10, height: 600 },
  { x: 100, y: 0, width: 10, height: 500 },
  { x: 200, y: 100, width: 10, height: 500 },
  { x: 300, y: 0, width: 10, height: 400 },
  { x: 400, y: 200, width: 10, height: 400 },
  { x: 500, y: 0, width: 10, height: 500 },
  { x: 600, y: 100, width: 10, height: 500 }
];

// 도착 지점
const goal = {
  x: 700,
  y: 500,
  width: 60,
  height: 60
};

// 충돌 체크
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 플레이어 이동
function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys['ArrowUp']) nextY -= player.speed;
  if (keys['ArrowDown']) nextY += player.speed;
  if (keys['ArrowLeft']) nextX -= player.speed;
  if (keys['ArrowRight']) nextX += player.speed;

  let willCollide = false;
  for (let wall of walls) {
    if (isColliding({ x: nextX, y: nextY, width: player.width, height: player.height }, wall)) {
      willCollide = true;
      break;
    }
  }

  if (!willCollide) {
    player.x = nextX;
    player.y = nextY;
  }
}

// 아이템 생성
const items = [];
for (let i = 0; i < 10; i++) {
  const randomItem = itemImgs[Math.floor(Math.random() * itemImgs.length)];
  items.push({
    x: Math.random() * 700 + 30,
    y: Math.random() * 500 + 30,
    width: 60,
    height: 60,
    collected: false,
    type: randomItem.name
  });
}

// 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // 벽
  ctx.fillStyle = 'white';
  for (let wall of walls) {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  // 도착지점
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  // 아이템
  for (let item of items) {
    if (!item.collected) {
      ctx.drawImage(loadedItemImgs[item.type], item.x, item.y, item.width, item.height);
    }
  }

  // 주인공
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // 점수
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 20, 30);
}

// 게임 루프
function gameLoop() {
  movePlayer();
  draw();

  // 아이템 먹기
  for (let item of items) {
    if (!item.collected && isColliding(player, item)) {
      item.collected = true;
      score += 1000;
    }
  }

  // 도착 검사
  if (isColliding(player, goal)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (score >= 5000) {
      ctx.drawImage(cakeImg, 300, 200, 200, 200);
      ctx.fillStyle = "red";
      ctx.font = "50px Arial";
      ctx.fillText("Success!", 330, 450);
    } else {
      ctx.fillStyle = "blue";
      ctx.font = "40px Arial";
      ctx.fillText("Not enough score! (Need 5000+)", 150, 300);
    }
    return;
  }

  requestAnimationFrame(gameLoop);
}

// 이미지 로딩 체크
let imagesLoaded = 0;
const totalImages = 1 + 1 + 1 + itemImgs.length; // background + player + cake + items

backgroundImg.onload = checkImagesLoaded;
playerImg.onload = checkImagesLoaded;
cakeImg.onload = checkImagesLoaded;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    gameLoop();
  }
}
