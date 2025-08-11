let gameRunning = false;

export function isGameRunning() {
  return gameRunning;
}

export function stopGame() {
  gameRunning = false;
  console.log("Game stopped");
}

export function startGame() {
  if (gameRunning) return; // Already running
  gameRunning = true;
  console.log("Game started");
}

// Demo balances stored in memory
export const demoBalances = new Map();

export function getDemoBalance(userId) {
  return demoBalances.get(userId) ?? 1000;
}

export function updateDemoBalance(userId, newBalance) {
  demoBalances.set(userId, newBalance);
}

export function resetDemoBalance(userId) {
  demoBalances.set(userId, 1000);
}
