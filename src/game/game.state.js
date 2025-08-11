let gameRunning = true;

export function isGameRunning() {
  return gameRunning;
}

export function stopGame() {
  gameRunning = false;
}

export function startGame() {
  gameRunning = true;
}
