export function ballPosition() {
  return Math.floor(Math.random() * 3);
}

export function recordGuess(history, choice, ball) {
  return [{ choice, ball, correct: choice === ball }, ...history].slice(0, 10);
}
