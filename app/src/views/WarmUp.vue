<template>
  
  <div class="game-container">
    <RouterLink :to="'/game3'">Next Game</RouterLink>

    <div :style="{ backgroundColor: signalColor }" class="signal">
      <h2>{{ currentSignal }}</h2>
    </div>

    <button 
      @mousedown="playerPressedButton('down')" 
      @mouseup="playerPressedButton('up')" 
      class="press-button"
    >
      Appuyez maintenant !
    </button>

    <div v-if="gameStatus" class="status">
      <p>{{ gameStatus }}</p>
    </div>

    <div v-if="timeRemaining > 0" class="timer">
      <p>Temps restant : {{ timeRemaining }} secondes</p>
    </div>

    <div v-if="isGameOver" class="scoreboard">
      <h3>Tableau des scores</h3>
      <p>Nombre de points : {{ pressCount }}</p>
      <button @click="restartGame" class="restart-button">
        Recommencer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GuitarHero from './GuitarHero.vue';
const audioGood = new Audio("/audio/spacebar-click-keyboard.mp3");
const audioError = new Audio("/audio/error.wav");
const emits = defineEmits(['initHeader']);

const signalColor = ref('red'); // Couleur initiale (rouge)
const currentSignal = ref('Stop'); // Message du signal
const isGameOver = ref(false); // État de fin du jeu
const gameStatus = ref(''); // Message d'état du jeu
const pressCount = ref(0); // Compteur des points
const timeRemaining = ref(30); // Temps restant
const timerId = ref(null); // ID du timer principal
const holdActive = ref(false); // Vérifie si le joueur maintient correctement appuyé
const intervalId = ref(null); // ID de l'intervalle pour changer le signal

const randomizeSignal = () => {
  if (isGameOver.value) return;

  const signalStates = ['stop', 'click', 'hold'];
  const randomState = signalStates[Math.floor(Math.random() * signalStates.length)];

  if (randomState === 'stop') {
    signalColor.value = 'red';
    currentSignal.value = 'Stop';
  } else if (randomState === 'hold') {
    signalColor.value = 'yellow';
    currentSignal.value = 'Hold';
  } else if (randomState === 'click') {
    signalColor.value = 'green';
    currentSignal.value = 'Click!';
  }
};

// Fonction déclenchée quand le joueur appuie sur le bouton
const playerPressedButton = (action) => {
  if (isGameOver.value) return;

  if (signalColor.value === 'red') {
    audioError.currentTime = 0;
    audioError.play(); 
    pressCount.value -= 1; 
    gameStatus.value = 'Erreur ! Ne touchez pas au bouton sur rouge !';
  } else if (signalColor.value === 'yellow') {
    if (action === 'down') {
      holdActive.value = true;
      gameStatus.value = 'Maintenez le bouton appuyé !';
    } else if (action === 'up') {
      if (holdActive.value) {
        pressCount.value += 1;
        gameStatus.value = 'Bien joué pour avoir tenu !';
      } else {
        gameStatus.value = 'Vous n\'avez pas tenu assez longtemps !';
      }
      holdActive.value = false;
    }
  } else if (signalColor.value === 'green') {
    if (action === 'down') {
      audioGood.currentTime = 0;
      audioGood.play(); 
      pressCount.value += 1;
      gameStatus.value = 'Bravo pour votre rapidité !';
    }
  }
};

// Fonction pour démarrer le jeu
const startGame = () => {
  isGameOver.value = false;
  pressCount.value = 0;
  timeRemaining.value = 30;
  gameStatus.value = '';
  randomizeSignal();
  intervalId.value = setInterval(randomizeSignal, randomDuration());

  timerId.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value -= 1;
    } else {
      endGame();
    }
  }, 1000);
};

// Fonction pour arrêter le jeu
const endGame = () => {
  clearInterval(intervalId.value);
  clearInterval(timerId.value);
  isGameOver.value = true;
  gameStatus.value = 'Le jeu est terminé !';
};

// Fonction pour recommencer le jeu
const restartGame = () => {
  clearInterval(intervalId.value);
  clearInterval(timerId.value);
  startGame();
};

// Calcul de la durée aléatoire des phases
const randomDuration = () => {
  return Math.floor(Math.random() * 2000) + 1000; // Entre 1 et 3 secondes
};

// Démarrage du jeu au montage du composant
onMounted(() => {
  emits('initHeader', { pageTitle: 'Warm-up', breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Warm-up', url: '' }] });
  startGame();
});

// Nettoyage à la destruction du composant
onBeforeUnmount(() => {
  clearInterval(intervalId.value);
  clearInterval(timerId.value);
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
    height: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;
  }
  
  .press-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  .status {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .restart-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
  }
  </style>
  