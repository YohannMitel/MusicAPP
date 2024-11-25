<template>
    <div class="game-container">
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
  
  const audioContext = ref(null);
  const soundButtonText = ref("Enable sound");
  const currentNoteIndex = ref(0);
  const currentNote = ref('');
  const score = ref(0);
  const isGameOver = ref(false);
  const gameStatus = ref('');
  
  const notesSequence = ['MI', 'RE', 'DO', 'MI']; // Une séquence simple
  const noteToFrequency = {
    MI: noteFrequencies['E4'],
    RE: noteFrequencies['D4'],
    DO: noteFrequencies['C4'],
  };
  
  const playSound = (frequency) => {
    const osc = audioContext.value.createOscillator();
    const gain = audioContext.value.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
  
    osc.connect(gain);
    gain.connect(audioContext.value.destination);
    gain.gain.setValueAtTime(1, audioContext.value.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + 1);
    osc.start(audioContext.value.currentTime);
    osc.stop(audioContext.value.currentTime + 1);
  };
  
  const playNoteFromButton = (note) => {
    if (!isGameOver.value && note === notesSequence[currentNoteIndex.value]) {
      playSound(noteToFrequency[note]);
      currentNoteIndex.value++;
      score.value++;
      gameStatus.value = 'Bien joué ! Continuez.';
  
      if (currentNoteIndex.value >= notesSequence.length) {
        gameOver();
      } else {
        currentNote.value = notesSequence[currentNoteIndex.value];
      }
    } else {
      gameStatus.value = 'Faux ! Essayez encore.';
    }
  };
  
  const enableSound = () => {
    if (!audioContext.value) {
      audioContext.value = new AudioContext();
    }
    audioContext.value
      .resume()
      .then(() => {
        soundButtonText.value = "Sound enabled";
      })
      .catch((err) => console.error("Error enabling sound:", err));
  };
  
  const startGame = () => {
    isGameOver.value = false;
    score.value = 0;
    currentNoteIndex.value = 0;
    currentNote.value = notesSequence[0];
    gameStatus.value = 'Rejouez la mélodie !';
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
    startGame();
    window.addEventListener('keydown', handleKeyDown);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
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
  