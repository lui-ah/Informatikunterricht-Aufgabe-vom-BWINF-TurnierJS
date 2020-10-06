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
  let shuffledPLayers = shuffle(players);

  let groups = chunk(shuffledPLayers, 2)



  let winner = groupDuel(groups)
  return winner;
}

function app(samples = 2000) {
  console.clear();
  let playersValueArray = SPIELER.map(spieler => parseInt(spieler));
  let pool = playersValueArray.reduce((a,b) => a + b);

  let players = playersValueArray.map((player, index) => {
    return {
      name: 'player' + (index + 1),
      value: player,
      KOWins: 0,
      ProWins: Math.round((((player / pool) * samples) + Number.EPSILON) * 100) / 100      
    };
  });
  // Spieler sind standardmäßig sortiert. ! MUSS IMMER VON SCHWÄCHSTER ZU STÄRKSTER SORTIERT SEIN
  appDiv.innerHTML = 
  'Mittelwert: ' + pool / players.length
  + '<br />' + 
  'Median: ' + players[Math.round((players.length - 1) / 2)].value;

  let chart = initChart();

  let labels = []
  players.forEach(player => {
    labels.push(player.name + ' p' + player.value)
  })  
  // updateLabels(chart, labels);
  chart.data.labels = labels;

  // Das ist das Knockout match
  for(var i=0; i < samples; i++){
    let winner = turnier(players); // Players kann sortiert werden weil die spieler im Turnier ge shuffeld werden.
    let indexOfWinner = players.indexOf(winner)
    players[indexOfWinner].KOWins += 1
  }
  addDataset(chart, players, 'ProWins')
  addDataset(chart, players, 'KOWins')  
}


app(100000);