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
import { fromEvent, combineLatest, merge } from "rxjs";
import { map, startWith } from "rxjs/operators";
const textDateien = [turnier1, turnier2];

const initialize = () => {
  let samplesSlider = document.getElementById("samples") as HTMLInputElement;
  let slider = fromEvent(samplesSlider, "change").pipe(
    startWith(null),
    map(() => parseInt(samplesSlider.value))
  );

  let obs = textDateien.map((DATA, index) => {
    let mapName = "Turnier#" + index;
    let mapOption = document.createElement("div");
    mapOption.classList.add("mapOption");
    mapOption.innerHTML = mapName;
    interfaceDiv.appendChild(mapOption);

    return fromEvent(mapOption, "click").pipe(map(() => DATA));
  });
  let maps = merge(...obs);
  let options = combineLatest([slider, maps]);
  options.subscribe(event => {
    // interfaceDiv
    // .querySelectorAll("div")
    // .forEach(entry => entry.classList.remove("active"));
    // mapOption.classList.add("active");
    app(event[0], event[1]);
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
