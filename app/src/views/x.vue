<template>
  <div class="game-container">
    <h1>Guitar Hero - Jingle Bells</h1>

    <div v-if="!isGameOver" class="signal">
      <h2>{{ currentNote }}</h2>
    </div>

    <div class="button-container">
      <button class="note-button blue">MI</button>
      <button class="note-button red">RE</button>
      <button class="note-button yellow">DO</button>
    </div>

    <div class="status">
      <p>{{ gameStatus }}</p>
    </div>

    <div v-if="isGameOver" class="scoreboard">
      <h3>Tableau des scores</h3>
      <p>Nombre de points : {{ score }}</p>
      <button @click="restartGame" class="restart-button">Recommencer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { noteFrequencies } from '../utils/noteFrequencies.js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

console.log(noteFrequencies)
const keysNote = Object.keys(noteFrequencies);

const notes = noteFrequencies;
console.log(notes)


const currentNoteIndex = ref(0); // Indice de la note actuelle
const currentNote = ref(''); // Note affichée
const score = ref(0); // Score
const isGameOver = ref(false); // État de fin de jeu


const gameStatus = ref(''); // Statut du jeu

// Sons pour chaque note
const audioFiles = {
  MI: new Audio('/audio/mi.wav'),
  RE: new Audio('/audio/re.wav'),
  DO: new Audio('/audio/do.wav'),
};

// Fonction pour jouer une note donnée

function Sound(frequency, type) {
  this.osc = audioContext.createOscillator(); // Create oscillator node
  this.pressed = false; // flag to indicate if sound is playing

  /* Set default configuration for sound */
  if (typeof frequency !== 'undefined') {
    /* Set frequency. If it's not set, the default is used (440Hz) */
    this.osc.frequency.value = frequency;
  }

  /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
  this.osc.type = type || 'triangle';

  /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
  piped to output (AKA your speakers). */
  this.osc.start(0);
};

Sound.prototype.play = function () {
  if (!this.pressed) {
    this.pressed = true;
    this.osc.connect(audioContext.destination);
  }
};

Sound.prototype.stop = function () {
  this.pressed = false;
  this.osc.disconnect();
};


keysNote.forEach(element => {
  notes[element] = new Sound(noteFrequencies[element], 'triangle');
})
var playNote = function (event) {
  event.preventDefault();
  notes['A4'].play();
  console.log("ici")


};

var endNote = function (event) {
  notes['A4'].stop();


};
// Fonction pour démarrer le jeu
const startGame = () => {
  isGameOver.value = false;
  score.value = 0;
  currentNoteIndex.value = 0;
  currentNote.value = ""
  gameStatus.value = 'Rejouez la mélodie !';
};

// Fonction pour terminer le jeu
const gameOver = () => {
  isGameOver.value = true;
  gameStatus.value = 'Bravo ! Vous avez terminé !';
};

// Fonction pour recommencer le jeu
const restartGame = () => {
  startGame();
};

// Gérer les pressions de touches (1, 2, 3 pour MI, RE, DO)




// Démarrer le jeu à l'initialisation
onMounted(() => {

  startGame();

  window.addEventListener('keydown', playNote);
  window.addEventListener('keyup', endNote);
});

// Nettoyer l'écouteur d'événement lors du démontage du composant
onBeforeUnmount(() => {

  window.removeEventListener('keydown', playNote);
  window.removeEventListener('keyup', endNote);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.signal {
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.button-container {
  display: flex;
  gap: 10px;
}

.note-button {
  width: 100px;
  height: 100px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.note-button.blue {
  background-color: #2196f3;
}

.note-button.red {
  background-color: #f44336;
}

.note-button.yellow {
  background-color: #ffeb3b;
  color: #000;
}

.status {
  font-size: 20px;
  margin: 20px 0;
}

.scoreboard {
  text-align: center;
}

.restart-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
