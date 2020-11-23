import {
  getPlayerValuesArray,
  runAllMatches,
  textZuSpielerDaten
} from "./method";

import "./style.css";
import { turnier, turnierX5, liga } from "./turniertypen";
import { turnier1, turnier2 } from "./map";
import { fromEvent, combineLatest, merge } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";
import {
  addDataset,
  createChartWithPlayerLabel,
  displayWinsInChart
} from "./chart";

const textDateien = [turnier1, turnier2];
const interfaceDiv = document.querySelector("#interface");
const tournamentTypes = [turnier, turnierX5, liga];

const app = (samples: number = 2000, DATA: string) => {
  const SPIELER = textZuSpielerDaten(DATA);

  const players = getPlayerValuesArray(SPIELER, samples);

  const chart = createChartWithPlayerLabel(players);

  runAllMatches(players, tournamentTypes, samples);

  addDataset(chart, players, "ProWins");
  displayWinsInChart(chart, players, tournamentTypes);
};

const initialize = () => {
  let samplesSlider = document.getElementById("samples") as HTMLInputElement;
  let samplesCounter = document.getElementById("samplesCounter") as HTMLElement;
  let slider = fromEvent(samplesSlider, "change").pipe(
    startWith(null),

    map(() => parseInt(samplesSlider.value, 10)),
    tap(e => (samplesCounter.innerHTML = e.toString()))
  );
  let obs = textDateien.map((DATA, index) => {
    let mapName = "Turnier#" + index;
    let mapOption = document.createElement("div");
    mapOption.classList.add("mapOption");
    mapOption.innerHTML = mapName;
    interfaceDiv.appendChild(mapOption);

    return fromEvent(mapOption, "click").pipe(
      tap(() => {
        interfaceDiv
          .querySelectorAll(".mapOption")
          .forEach(entry => entry.classList.remove("active"));
        mapOption.classList.add("active");
      }),
      map(() => DATA)
    );
  });
  let maps = merge(...obs);
  let options = combineLatest([slider, maps]);
  options.subscribe(event => {
    // app(event[0], Array.from(Array(32 + 1).keys()).join("\n"));
    app(event[0], event[1]);
  });
};

initialize();
