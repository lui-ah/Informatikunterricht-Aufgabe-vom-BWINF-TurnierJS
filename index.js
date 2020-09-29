// Import stylesheets
import './style.css';
import {duel, shuffle, groupDuel, chunk, addDataset, initChart, updateLabels } from './method'
import {turnier2 } from './map'






// Write TypeScript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>Der gewinner ist: ${duel(60, 800)}</h1>`;

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
  let players = SPIELER.map(spieler => parseInt(spieler));
  players = players.map((player, index) => {
    return {
      name: 'player' + (index + 1),
      value: player,
      wins: 0,
    };
  }) // Spieler sind standardmäßig sortiert. ! MUSS IMMER VON SCHWÄCHSTER ZU STÄRKSTER SORTIERT SEIN
  
  let chart = initChart();

  let labels = []
  players.forEach(player => {
    labels.push(player.name + ' p' + player.value)
  })  
  updateLabels(chart, labels);

  
  for(var i=0; i < samples; i++){
    let winner = turnier(players); // Players kann sortiert werden weil die spieler im Turnier ge shuffeld werden.
    let indexOfWinner = players.indexOf(winner)
    players[indexOfWinner].wins += 1
  }
  
  let INDEXOFKOMATCHDATASET = addDataset(chart, players)
  console.log(INDEXOFKOMATCHDATASET)


}


app(4000);