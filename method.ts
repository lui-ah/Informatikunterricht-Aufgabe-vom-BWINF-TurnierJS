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
      playernumber: index + 1,
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
    tournamentTypes.forEach(type => addWin(players, type));
  }
};

export const textZuSpielerDaten = (turnierText: string): number[] => {
  let DATA = turnierText.split("\n");
  let DATACOPY = [...DATA];
  DATACOPY.shift();
  let DATACOPYNUM = DATACOPY.map(Number);
  // .sort((a, b) => a - b);
  return DATACOPYNUM;
};

export const duel = (player1: number, player2: number) => {
  // return player1 < player2 ? false : true;
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
export const shuffle = c => {
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

const pairs = (arr: any[]) =>
  arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

export const generatePermutations = (players: SpielerMitProWins[]) => {
  return pairs(players);
};

export const duelLiga = (playerPermutations: SpielerMitProWins[][]) => {
  let newArray = shuffle([...playerPermutations]).map(group => shuffle(group));
  let winner = newArray.map((group: SpielerMitProWins[]) => {
    let winner = duel(group[0].value, group[1].value) ? group[0] : group[1];
    return winner;
  });

  var mf: number = 1;
  var m: number = 0;
  let item;
  for (let i = 0; i < winner.length; i++) {
    for (let j = i; j < winner.length; j++) {
      if (winner[i] == winner[j]) m++;
      if (mf < m) {
        mf = m;
        item = winner[i];
      }
    }
    m = 0;
  }
  return item as SpielerMitProWins;
};

export const groupDuel = (
  groups: SpielerMitProWins[][],
  roundsEach = 1,
  round = 1
): SpielerMitProWins => {
  let winners: SpielerMitProWins[] = [];
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
