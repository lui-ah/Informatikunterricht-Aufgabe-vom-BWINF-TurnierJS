import {
  groupDuel,
  shuffleAndGroup,
  SpielerMitProWins,
  duelLiga,
  generatePermutations
} from "./method";

export function turnier(players: SpielerMitProWins[]) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups);
  return winner;
}

export function turnierX5(players: SpielerMitProWins[]) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups, 5);
  return winner;
}

export function liga(players: SpielerMitProWins[]) {
  let groups = generatePermutations(players);
  const winner = duelLiga(groups);
  return winner;
}
