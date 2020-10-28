import {
  addDataset,
  getPlayerValuesArray,
  createChartWithPlayerLabel,
  runAllMatches,
  displayWinsInChart,
  textZuSpielerDaten
} from "./method";

import "./style.css";
const interfaceDiv = document.querySelector("#interface");

import { turnier, turnierX5 } from "./turniertypen";
const tournamentTypes = [turnier, turnierX5];

import { turnier1, turnier2 } from "./map";
const textDateien = [turnier1, turnier2];

const initialize = () => {
  textDateien.forEach((DATA, index) => {
    let mapName = "Turnier#" + index;
    let mapOption = document.createElement("div");
    mapOption.classList.add("mapOption");
    mapOption.innerHTML = mapName;
    mapOption.addEventListener("click", function() {
      interfaceDiv
        .querySelectorAll("div")
        .forEach(entry => entry.classList.remove("active"));
      mapOption.classList.add("active");
      app(100000, DATA);
    });
    interfaceDiv.appendChild(mapOption);
  });
};

const app = (samples = 2000, DATA) => {
  const SPIELER = textZuSpielerDaten(DATA);

  const players = getPlayerValuesArray(SPIELER, samples);
  const chart = createChartWithPlayerLabel(players);
  runAllMatches(players, tournamentTypes, samples);

  displayWinsInChart(chart, players, tournamentTypes);
  addDataset(chart, players, "ProWins");
};

initialize();
