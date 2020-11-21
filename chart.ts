import { Chart } from "chart.js";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";

import { Aspect6 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";
import { SpielerMitProWins, TurnierFunktion } from "./method";
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
  chart.data.datasets.push({
    label: "!" + property,
    //new option, type will default to bar as that what is used to create the scale
    type: "line",
    fill: "none",
    data
  });

  chart.update();
};
export const displayWinsInChart = (
  chart: Chart,
  players: SpielerMitProWins[],
  tournamentTypes: TurnierFunktion[]
) => {
  tournamentTypes.forEach(type => addDataset(chart, players, type.name));
};
const chartContainer = document.getElementById("charts");

export const initChart = (labels: string[] = []): Chart => {
  let existingChart = document.getElementById("chart");
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }
  if (existingChart) {
    existingChart.parentNode.removeChild(existingChart);
  }

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
      },
      legend: {
        labels: {
          filter: function(item: any, chart: any) {
            // Logic to remove a particular legend item goes here
            return !item.text.includes("!");
          }
        },
        onClick: function(event: MouseEvent, label: any) {
          let labelT = label.text;
          let chart = (this as Chart).chart;
          let data = chart.data.datasets
            .filter((e: any) => labelT == e.label || "!" + labelT == e.label)
            .map((e: any) => {
              let metaNull = e._meta[Object.keys(e._meta)[0]];
              return chart.getDatasetMeta(metaNull.index);
            })
            .forEach((meta: any) => {
              console.log(meta.hidden === null ? !meta.hidden : null);
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            });
          chart.update();
        }
      }
    }
  });
  return myChart;
};
export const createChartWithPlayerLabel = (
  players: SpielerMitProWins[]
): Chart => {
  const labels = [...players].map(player => `${player.name} p${player.value}`);
  const chart = initChart(labels);
  return chart;
};
