export function randomCup() {
  return Math.floor(Math.random() * 3);
}

const pairs = [[0, 1], [0, 2], [1, 2]];

export function swapCups(order, previousPair) {
  const choices = pairs.filter((pair) => pair !== previousPair);
  const pair = choices[Math.floor(Math.random() * choices.length)];
  const [first, second] = pair;
  const next = [...order];
  [next[first], next[second]] = [order[second], order[first]];
  return { order: next, pair };
}

export function recordGuess(history, choice, ball) {
  return [{ choice, ball, correct: choice === ball }, ...history].slice(0, 10);
}
