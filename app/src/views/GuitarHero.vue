<template>
  <div class="game-container">

    <div class="d-flex flex-row justify-content-between w-100 px-2">
      <button type="button" class="btn btn-primary">Start</button>
      <RouterLink  class="btn btn-primary " :to="'/game3'">Next Game</RouterLink>
    </div>

    <h1>Piano Hero - Jingle Bells</h1>
    <button @click="enableSound">{{ soundButtonText }}</button>
    <div v-if="!isGameOver" class="signal">
      <h2>{{ currentNote }}</h2>
    </div>

    <div class="button-container">
      <button @click="playNoteFromButton('MI')" class="note-button blue">MI</button>
      <button @click="playNoteFromButton('RE')" class="note-button red">RE</button>
      <button @click="playNoteFromButton('DO')" class="note-button yellow">DO</button>
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
import { useRoute,useRouter } from 'vue-router';


const emits = defineEmits(['initHeader', 'wsMsg']);
const props = defineProps(["lastMessage"]);

const route = useRoute();
const router = useRouter();
const sessionId = route.query.sessionId;

const audioContext = ref(null);
const soundButtonText = ref("Enable sound");
const currentNoteIndex = ref(0);
const currentNote = ref('');
const score = ref(0);
const isGameOver = ref(false);
const gameStatus = ref('');


const notesSequence = [
  // Première partie de l'Overworld Theme
  { signal : 'BLUE' , note: 'E4', duration: 400 },
  { signal: 'BLUE' , note: 'E4', duration: 400 },
  { signal: 'BLUE' , note: 'E4', duration: 400 },
  { signal: 'RED', note: 'C4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'YELLOW', note: 'G4', duration: 400 },
  { signal: 'YELLOW', note: 'G4', duration: 400 },
  { signal: 'RED', note: 'C4', duration: 400 },
  { signal: 'BLUE', note: 'D4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 400 },
  
  // Partie répétitive
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 400 },
  { signal: 'RED', note: 'C4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'YELLOW', note: 'G4', duration: 400 },
  { signal: 'YELLOW', note: 'G4', duration: 400 },

  // Partie finale pour allonger la durée
  { signal: 'RED', note: 'C4', duration: 400 },
  { signal: 'BLUE', note: 'D4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'RED', note: 'F4', duration: 400 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 400 },

  // Répétition du motif principal pour augmenter la durée
  { signal: 'RED', note: 'C4', duration: 200 },
  { signal: 'BLUE', note: 'D4', duration: 200 },
  { signal: 'BLUE' , note: 'E4', duration: 200 },
  { signal: 'YELLOW', note: 'G4', duration: 400 },
  { signal: 'YELLOW', note: 'G4', duration: 400 }
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

const playNoteFromButton = (note) => {
  if (!isGameOver.value && note === notesSequence[currentNoteIndex.value].note) {
    playSound(noteToFrequency[note]);
    currentNoteIndex.value++;
    score.value++;
    gameStatus.value = 'Bien joué ! Continuez.';

    if (currentNoteIndex.value >= notesSequence.length) {
      gameOver();
    } else {
      currentNote.value = notesSequence[currentNoteIndex.value].note;

    }
  } else {
    gameStatus.value = 'Faux ! Essayez encore.';
  }
};

// Fonction pour jouer automatiquement la séquence
const playSequence = () => {
  
  let time = 0;
  notesSequence.forEach(({ signal, note, duration }) => {
    setTimeout(() => {
      emits('wsMsg', JSON.stringify({ type: "mqtt", color: signal }));

      playSound(noteToFrequency[note]);
      currentNote.value = note; // Met à jour la note actuelle affichée
    }, time);
    time += duration;
  });

  setTimeout(() => {
    gameOver(); // Fin de la séquence
  }, time);
};

const enableSound = () => {
  if (!audioContext.value) {

    audioContext.value = new AudioContext();
  }
  audioContext.value
    .resume()
    .then(() => {
      soundButtonText.value = "Sound enabled";
      startGame();
    })
    .catch((err) => console.error("Error enabling sound:", err));
};

const startGame = () => {

  isGameOver.value = false;
  score.value = 0;
  currentNoteIndex.value = 0;
  currentNote.value = notesSequence[0].note;
  gameStatus.value = 'Rejouez la mélodie !';
  playSequence();
};

const gameOver = () => {
  isGameOver.value = true;
  gameStatus.value = 'Bravo ! Vous avez terminé !';
};

const restartGame = () => {
  startGame();
};

const handleKeyDown = (event) => {
  const keyMap = {
    1: 'MI',
    2: 'RE',
    3: 'DO',
  };
  const note = keyMap[event.key];
  if (note) {
    playNoteFromButton(note);
  }
};




onMounted(() => {
  console.log(sessionId)
  if (!(sessionId && sessionId.trim() != '')) {
    //router.push('/');
    return
  }


  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
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
