// Import stylesheets
import './style.css';
import {duel, shuffle, groupDuel, chunk, addDataset, initChart, updateLabels } from './method'
import {turnier2 } from './map'

// Write TypeScript code!
const appDiv = document.getElementById('app');

let DATA = turnier2.split('\n');
// const ANZAHLSPIELER = DATA[0];
DATA.shift();
const SPIELER = DATA; 

function turnier(players) {
  const shuffledPLayers = shuffle(players);
  const groups = chunk(shuffledPLayers, 2);
  const winner = groupDuel(groups);

  return winner;
}



function addWin(players, func) {
  const player = players[players.indexOf(func(players))]
  player[func.name] = player[func.name] + 1 || 1;
}

const times = x => f => {if (x > 0) {f(),times(x - 1)(f)}}

function app(samples = 2000) {
  console.clear();
  const playersValueArray = SPIELER.map(spieler => parseInt(spieler));
  const pool = playersValueArray.reduce((a,b) => a + b);

  const players = playersValueArray.map((player, index) => {
    return {
      name: 'player' + (index + 1),
      value: player,
      ProWins: Math.round((((player / pool) * samples) + Number.EPSILON) * 100) / 100      
    };
  });
  // Players Reinfolge egal weil die spieler im Turnier ge shuffeld werden.


  const chart = initChart();

  const labels = [...players].map(player => `${player.name} p${player.value}`)  
  chart.data.labels = labels;
  
  const tournamentTypes = [turnier];

  times(samples)(() => tournamentTypes.forEach(type => addWin(players, type)))
  tournamentTypes.forEach(type => addDataset(chart, players, type.name))
  // Das ist jetzt so hässlich in einer Zeile damit man das besser skalieren kann
  addDataset(chart, players, 'ProWins')

}


app(1000);