import { Chart } from "chart.js";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";

import { Aspect6 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";

interface Spieler {
  name: string;
  value: number;
  [propName: string]: any | number;
}

export interface SpielerMitProWins extends Spieler {
  ProWins: number;
}

export interface TurnierFunktion {
  (players: SpielerMitProWins[]): SpielerMitProWins;
}

// type Chart = any;

/**
 * Erstell die Spieler-Objekte mit einem Wert, Namen und einer Zahl die der Gewinne entspricht die der Spieler bekommen würde, würden sich alle Spieler im Array n mal duellieren würden.
 * @param {Array} Rohes Array mit den Werten der Spiler (Zweierpotenz)
 * @param {number} wie häufig das Turnier gespielt wird.
 */
export const getPlayerValuesArray = (
  playersValueArray: number[],
  samples: number
): SpielerMitProWins[] => {
  const pool = playersValueArray.reduce((a, b) => a + b);

  const players = playersValueArray.map((value, index) => {
    return {
      name: "player" + (index + 1),
      value,
      ProWins:
        Math.round(((value / pool) * samples + Number.EPSILON) * 100) / 100
    };
  });
  return players as SpielerMitProWins[];
};

/**
 * Das Match wird nach dem in der Funktion angebenen Regeln ausgeführt.
 * Der Wert im Objekt mit dem Namen der Funktion wird um 1 addiert dies stellen die gewinnen da.
 * @param {players[]} Liste Spieler-Objekte
 * @param {function} Funktion die 1 Spieler-Objekt, das schon in der Spieler-Objekte Liste ist, zurück gibt.
 */
export const addWin = (players: SpielerMitProWins[], func: TurnierFunktion) => {
  const player = players[players.indexOf(func(players))];
  player[func.name] = player[func.name] + 1 || 1;
};

/**
 * Führt alle matches aus
 * @param {players[]} Liste von Spieler-Objekten
 * @param {function[]} Liste von Funktionen die 1 Spieler-Objekt, die schon in der Spieler-Objekte Liste sind, zurück geben.
 * @param {number} wie häufig das Turnier gespielt wird.
 */
export const runAllMatches = (
  players: SpielerMitProWins[],
  tournamentTypes: TurnierFunktion[],
  samples: number
) => {
  for (let sample = 0; sample < samples; sample++) {
    tournamentTypes.forEach((type) => addWin(players, type));
  }
};

export const addDataset = (
  chart: Chart,
  players: SpielerMitProWins[],
  property: string
) => {
  let data = [];

  players.forEach((winner, index) => {
    data.push(winner[property]);
  });
  chart.data.datasets.push({
    data,
    label: property
  });

  chart.update();
};

export const displayWinsInChart = (
  chart: Chart,
  players: SpielerMitProWins[],
  tournamentTypes: TurnierFunktion[]
) => {
  tournamentTypes.forEach((type) => addDataset(chart, players, type.name));
};

export const textZuSpielerDaten = (turnierText: string): number[] => {
  let DATA = turnierText.split("\n");
  let DATACOPY = [...DATA];
  DATACOPY.shift();
  DATACOPY.map((e) => parseInt(e, 10)).sort((a, b) => a - b);
  return (DATACOPY as unknown) as number[];
};

const chartContainer = document.getElementById("charts");

export const initChart = (labels: string[] = []): Chart => {
  let existingChart = document.getElementById("chart");
  if (existingChart) existingChart.parentNode.removeChild(existingChart);
  let ctx = document.createElement("canvas");
  ctx.setAttribute("id", "chart");
  ctx.classList.add("chart");
  chartContainer.appendChild(ctx);
  ctx.getContext("2d");

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        colorschemes: {
          scheme: Aspect6
        }
      }
    }
  });
  return myChart;
};

export const createChartWithPlayerLabel = (
  players: SpielerMitProWins[]
): Chart => {
  const labels = [...players].map(
    (player) => `${player.name} p${player.value}`
  );
  const chart = initChart(labels);
  return chart;
};

export const duel = (player1, player2) => {
  let pool = player1 + player2;

  let random = Math.random(); // zufällige zahl zwischen 0 und 1
  // player1 / pool sollte kleiner als 1 sein.
  return player1 / pool > random;
};

export const chunk = (
  array: SpielerMitProWins[],
  chunkSize: number
): SpielerMitProWins[][] => {
  var R = [];
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (c) => {
  let a = [...c];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const shuffleAndGroup = (players: SpielerMitProWins[]) => {
  const shuffledPLayers = shuffle(players);
  const groups = chunk(shuffledPLayers, 2);
  return groups;
};

export const groupDuel = (
  groups: SpielerMitProWins[][],
  roundsEach = 1,
  round = 1
): SpielerMitProWins => {
  let winners: SpielerMitProWins[] = [];
  groups.forEach((group) => {
    let player = [0, 0];
    for (let round = 0; round < roundsEach; round++) {
      let winnerOfRound = duel(group[0].value, group[1].value) ? 0 : 1;
      player[winnerOfRound] += 1;
    }

    let indexOfMax = player.indexOf(Math.max(...player));
    winners.push(group[indexOfMax]);
  });
  if (winners.length === 1) {
    return winners[0];
  } else {
    let chunkedWinners = chunk(winners, 2);
    return groupDuel(chunkedWinners, 1, round + 1);
  }
};
