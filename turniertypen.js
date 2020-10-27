import { groupDuel, shuffleAndGroup } from "./method";

export function turnier(players) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups);
  return winner;
}

export function turnierX5(players) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups, 5);
  return winner;
}
