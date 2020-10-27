import {
  addDataset,
  getPlayerValuesArray,
  createChart,
  addWin,
  runAllMatches
} from "./method";
import { turnier, turnierX5 } from "./turniertypen";
import { turnier2 } from "./map";

let DATA = turnier2.split("\n");
// const ANZAHLSPIELER = DATA[0];
DATA.shift();
const SPIELER = DATA;

function app(samples = 2000) {
  console.clear();
  const tournamentTypes = [turnier, turnierX5];
  const players = getPlayerValuesArray(SPIELER, samples);
  const chart = createChart(players);

  runAllMatches(players, tournamentTypes, samples, chart);

  // Das ist jetzt so hässlich in einer Zeile damit man das besser skalieren kann
  addDataset(chart, players, "ProWins");
}

app(100000);
