import { Chart } from "chart.js";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";

import { Aspect6 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";

export function duel(player1, player2) {
  let pool = player1 + player2;

  let random = Math.random(); // zufällige zahl zwischen 0 und 1
  // player1 / pool sollte kleiner als 1 sein.
  return player1 / pool > random;
}

export function chunk(array, chunkSize) {
  var R = [];
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle(c) {
  let a = [...c];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function groupDuel(groups, round = 1) {
  let winners = [];
  // console.log(groups, 'round', round, 'starter')

  groups.forEach(group => {
    let player1 = group[0];
    let player2 = group[1];
    let winner = duel(player1.value, player2.value) ? player1 : player2;
    winners.push(winner);
  });
  // console.log(winners, 'round', round, 'winner')
  if (winners.length === 1) {
    return winners[0];
  } else {
    let chunkedWinners = chunk(winners, 2);
    return groupDuel(chunkedWinners, round + 1);
  }
}

export function initChart(labels = []) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: []
    },
    options: {
      plugins: {
        colorschemes: {
          scheme: Aspect6
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
  return myChart;
}

export function addDataset(chart, players, property) {
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
}
