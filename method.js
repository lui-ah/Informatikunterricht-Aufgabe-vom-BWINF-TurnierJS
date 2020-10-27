import { Chart } from "chart.js";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";

import { Aspect6 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";

/**
 * Erstell die Spieler-Objekte mit einem Wert, Namen und einer Zahl die der Gewinne entspricht die der Spieler bekommen würde, würden sich alle Spieler im Array n mal duellieren würden.
 * @param {Array} Rohes Array mit den Werten der Spiler (Zweierpotenz)
 * @param {number} wie häufig das Turnier gespielt wird.
 */
export const getPlayerValuesArray = (SPIELER, samples) => {
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
  return players;
};

/**
 * Das Match wird nach dem in der Funktion angebenen Regeln ausgeführt.
 * Der Wert im Objekt mit dem Namen der Funktion wird um 1 addiert dies stellen die gewinnen da.
 * @param {players[]} Liste Spieler-Objekte
 * @param {function} Funktion die 1 Spieler-Objekt, das schon in der Spieler-Objekte Liste ist, zurück gibt.
 */
export const addWin = (players, func) => {
  const player = players[players.indexOf(func(players))];
  player[func.name] = player[func.name] + 1 || 1;
};

/**
 * Führt alle matches aus
 * @param {players[]} Liste von Spieler-Objekten
 * @param {function[]} Liste von Funktionen die 1 Spieler-Objekt, die schon in der Spieler-Objekte Liste sind, zurück geben.
 * @param {number} wie häufig das Turnier gespielt wird.
 */
export const runAllMatches = (players, tournamentTypes, samples) => {
  for (let sample = 0; sample < samples; sample++) {
    tournamentTypes.forEach(type => addWin(players, type));
  }
};

export const displayWinsInChart = (chart, players, tournamentTypes) => {
  tournamentTypes.forEach(type => addDataset(chart, players, type.name));
};

export const textZuSpielerDaten = turnierText => {
  let DATA = turnierText.split("\n");
  let DATACOPY = [...DATA];
  DATACOPY.shift();
  DATACOPY.sort((a, b) => a - b);
  return DATACOPY;
};

export const createChartWithPlayerLabel = players => {
  const labels = [...players].map(player => `${player.name} p${player.value}`);
  const chart = initChart(labels);
  return chart;
};

export const duel = (player1, player2) => {
  let pool = player1 + player2;

  let random = Math.random(); // zufällige zahl zwischen 0 und 1
  // player1 / pool sollte kleiner als 1 sein.
  return player1 / pool > random;
};

export const chunk = (array, chunkSize) => {
  var R = [];
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export const shuffle = c => {
  let a = [...c];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const shuffleAndGroup = players => {
  const shuffledPLayers = shuffle(players);
  const groups = chunk(shuffledPLayers, 2);
  return groups;
};

export const groupDuel = (groups, roundsEach = 1, round = 1) => {
  let winners = [];
  groups.forEach(group => {
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

const chartContainer = document.getElementById("charts");

export const initChart = (labels = []) => {
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

export const addDataset = (chart, players, property) => {
  let data = [];

  players.forEach((winner, index) => {
    data.push(winner[property]);
  });
  chart.data.datasets.push({
    data,
    label: property
  });

  chart.update();
  let indexOfDataSet = chart.data.datasets.length - 1;

  return indexOfDataSet;
};
