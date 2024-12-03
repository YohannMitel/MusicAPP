<template>
  <div class="game-container">

    <div class="d-flex flex-row justify-content-between w-100 px-2">
      <button @click="enableSound" type="button" class="btn btn-primary">Start</button>
      <RouterLink class="btn btn-primary " :to="{ name: 'Chachacha',  query: { sessionId: sessionId }}">Next Game</RouterLink>
    </div>

    <h1>Piano Hero - Jingle Bells</h1>
    <!--
    <div v-if="!isGameOver" class="signal">
      <h2>{{ notesSequenceGame[0]?.signal }}</h2>
    </div>
-->
    <div class="button-container">
      <button @click="playNoteFromButton('BLUE')" class="note-button blue">1</button>
      <button @click="playNoteFromButton('RED')" class="note-button red">2</button>
      <button @click="playNoteFromButton('YELLOW')" class="note-button yellow">3</button>
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
import { ref, onMounted, onBeforeUnmount, computed, onUnmounted } from 'vue';
import { noteFrequencies } from '../utils/noteFrequencies.js';
import { useRoute, useRouter } from 'vue-router';


const audioError = new Audio("/audio/error.wav");

const emits = defineEmits(['initHeader', 'wsMsg']);
const props = defineProps(["lastMessage"]);

const route = useRoute();
const router = useRouter();
const sessionId = route.query.sessionId;

const audioContext = ref(null);


const score = ref(0);
const isGameOver = ref(false);
const isGameStarted = ref(false);
const gameStatus = ref('');

const notesSequenceGame = ref([]);


const noteTimer = (duration, signal) => {
  emits('wsMsg', JSON.stringify({ type: "mqtt", color: signal }));

  notesSequenceGame.value[0].timer = setTimeout(() => {
    audioError.currentTime = 0;
    audioError.play();
    score.value--
    console.log('-1')

    notesSequenceGame.value.shift();

    if (notesSequenceGame.value.length == 0) {
      gameOver()

    } else {
      const { duration, signal } = notesSequenceGame.value[0];
      notesSequenceGame.value[0].chrono = noteTimer(duration, signal);

    }

  }
    , duration
  )
}


const notesSequence = [
  // Première partie de l'Overworld Theme
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },
  { signal: 'RED', note: 'C4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null },
  { signal: 'RED', note: 'C4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'D4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },

  // Partie répétitive
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },
  { signal: 'RED', note: 'C4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null },

  // Partie finale pour allonger la durée
  { signal: 'RED', note: 'C4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'D4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'RED', note: 'F4', duration: 4000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 4000, timer: null },

  // Répétition du motif principal pour augmenter la durée
  { signal: 'RED', note: 'C4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'D4', duration: 2000, timer: null },
  { signal: 'BLUE', note: 'E4', duration: 2000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null },
  { signal: 'YELLOW', note: 'G4', duration: 4000, timer: null }
];
const noteToFrequency = {
  C4: noteFrequencies['C4'],
  D4: noteFrequencies['D4'],
  E4: noteFrequencies['E4'],
  F4: noteFrequencies['F4'],
  G4: noteFrequencies['G4'],
  A4: noteFrequencies['A4']
};

const playSound = (frequency) => {
  const osc = audioContext.value.createOscillator();
  const gain = audioContext.value.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequency;

  osc.connect(gain);
  gain.connect(audioContext.value.destination);
  gain.gain.setValueAtTime(1, audioContext.value.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + 1);
  osc.start(audioContext.value.currentTime);
  osc.stop(audioContext.value.currentTime + 1);
};

const playNoteFromButton = (btn) => {

  if (!isGameOver.value && btn === notesSequenceGame.value[0]?.signal) {
    playSound(noteToFrequency[notesSequenceGame.value[0].note]);
    console.log('+1')
    clearTimeout(notesSequenceGame.value[0].timer)
    score.value++;
    gameStatus.value = 'Bien joué ! Continuez.';
    notesSequenceGame.value.shift()

    if (notesSequenceGame.value.length == 0) {
      gameOver()

    } else {
      const { duration, signal } = notesSequenceGame.value[0];
      notesSequenceGame.value[0].chrono = noteTimer(duration, signal);

    }

  } else {
    audioError.currentTime = 0;
    audioError.play();
    console.log('-1')
    score.value--
    gameStatus.value = 'Faux ! Essayez encore.';

  }
};

// Fonction pour jouer automatiquement la séquence
const playSequence = () => {
  const { duration, signal } = notesSequenceGame.value[0];
  notesSequenceGame.value[0].chrono = noteTimer(duration, signal);
  /* let time = 0;
   notesSequence.forEach(({ signal, note, duration }) => {
     setTimeout(() => {
       
     }, time);
     time += duration;
   });
 
   setTimeout(() => {
     gameOver(); // Fin de la séquence
   }, time);*/
};

const enableSound = () => {
  if (!audioContext.value) {

    audioContext.value = new AudioContext();
  }
  audioContext.value
    .resume()
    .then(() => {
      startGame();
    })
    .catch((err) => console.error("Error enabling sound:", err));
};

const startGame = () => {

  isGameOver.value = false;
  isGameStarted.value = true;
  score.value = 0;

  notesSequenceGame.value = notesSequence;

  gameStatus.value = 'Rejouez la mélodie !';
  playSequence();
};

const gameOver = () => {
  isGameOver.value = true;
  isGameStarted.value = false;
  gameStatus.value = 'Bravo ! Vous avez terminé !';
};

const restartGame = () => {
  startGame();
};

const handleKeyDown = (event) => {

  if (isGameStarted.value == false) {
    gameStatus.value = 'You must start the game';
    return
  }
  const keyMap = {
    1: 'BLUE',
    2: 'RED',
    3: 'YELLOW',
  };
  const btn = keyMap[event.key];
  //console.log(btn)
  if (btn) {
    playNoteFromButton(btn);
  }
};




onMounted(() => {
  console.log(sessionId)
  /*if (!(sessionId && sessionId.trim() != '')) {
    return
  }
*/
  emits('initHeader', { pageTitle: 'Guitar-hero | SessionID : ' + sessionId, breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Warm-up', url: '' }] });

  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  gameOver();
  audioContext.value = null
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
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
