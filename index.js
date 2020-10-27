// Import stylesheets
import "./style.css";
import {
  duel,
  shuffle,
  groupDuel,
  chunk,
  addDataset,
  initChart,
  updateLabels,
  shuffleAndGroup
} from "./method";
import { turnier2 } from "./map";

// Write TypeScript code!
const appDiv = document.getElementById("app");

let DATA = turnier2.split("\n");
// const ANZAHLSPIELER = DATA[0];
DATA.shift();
const SPIELER = DATA;

function turnier(players) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups);
  return winner;
}

function turnierX5(players) {
  let groups = shuffleAndGroup(players);
  const winner = groupDuel(groups, 5);
  return winner;
}

function addWin(players, func) {
  const player = players[players.indexOf(func(players))];
  player[func.name] = player[func.name] + 1 || 1;
}

function app(samples = 2000) {
  console.clear();
  const playersValueArray = SPIELER.map(spieler => parseInt(spieler));
  const pool = playersValueArray.reduce((a, b) => a + b);

  const players = playersValueArray.map((player, index) => {
    return {
      name: "player" + (index + 1),
      value: player,
      ProWins:
        Math.round(((player / pool) * samples + Number.EPSILON) * 100) / 100
    };
  });
  // Players Reinfolge egal weil die spieler im Turnier ge shuffeld werden.

  const labels = [...players].map(player => `${player.name} p${player.value}`);
  const chart = initChart(labels);

  const tournamentTypes = [turnier, turnierX5];
  for (let sample = 0; sample < samples; sample++) {
    tournamentTypes.forEach(type => addWin(players, type));
  }
  tournamentTypes.forEach(type => addDataset(chart, players, type.name));
  // Das ist jetzt so hässlich in einer Zeile damit man das besser skalieren kann
  addDataset(chart, players, "ProWins");
}

app(100);
