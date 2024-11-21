<template>
    <div class="game-container">
      <div
        :style="{ backgroundColor: signalColor }"
        class="signal"
      >
        <h2>{{ currentSignal }}</h2>
      </div>
      
      <button 
        v-if="signalColor === 'green'" 
        @click="playerPressedButton"
        class="press-button"
      >
        Appuyez maintenant !
      </button>
  
      <div v-if="gameStatus" class="status">
        <p>{{ gameStatus }}</p>
      </div>
  
      <button v-if="isGameOver" @click="restartGame" class="restart-button">
        Recommencer
      </button>
    </div>
  </template>
  
  <script setup>
  import { onMounted,ref,onBeforeUnmount  } from 'vue';
    const emits = defineEmits(['initHeader'])


    const signalColor =  ref('red'); // Initial signal state (red means stop)
    const currentSignal = ref('Arrêté'); // Signal message
    const isGameOver =  ref(false); // Flag to control game over state
    const gameStatus =  ref(''); // Message showing game status
    const intervalId =  ref(null); // For clearing the interval when game ends
    const pressAllowed =  ref(false); // Whether the player can press the button
    const pressCount = ref(0); // Count for successful presses

    const randomizeSignal = () => {
        if (isGameOver.value) return;
  
        const signalStates = ['red', 'green', 'flashingGreen'];
        const randomState = signalStates[Math.floor(Math.random() * signalStates.length)];
  
        if (randomState === 'red') {
          signalColor.value = 'red';
          currentSignal.value = 'Arrêté';
        } else if (randomState === 'green') {
          signalColor.value = 'green';
          currentSignal.value = 'Préparez-vous';
          pressAllowed.value = false; // Disable pressing when green
        } else if (randomState === 'flashingGreen') {
          signalColor.value = this.signalColor === 'green' ? 'green' : 'flashingGreen';
          currentSignal.value = 'Appuyez maintenant !';
          pressAllowed.value = true; // Enable pressing when flashing green
        }
      },
  
      // Method for when the player presses the button
      playerPressedButton = () => {
        if (pressAllowed.value) {
          pressCount.value += 1;
          gameStatus.value = 'Bien joué, vous avez appuyé au bon moment !';
          stopGame();
        } else {
          gameStatus.value = 'Trop tard ou appui incorrect !';
          stopGame();
        }
      };
  
      // Method to stop the game after a press
    const stopGame = () =>  {
        clearInterval(this.intervalId); // Stop the signal change
        isGameOver.value = true;
      };
  
      // Method to start the game and reset the variables
    const startGame = () => {
        isGameOver.value = false;
        gameStatus.value = '';
        pressCount.value = 0;
        intervalId.value = setInterval(randomizeSignal, randomDuration());
      };
  
      // Randomize the duration of each signal phase (between 1 and 3 seconds)
    const randomDuration = () => {
        return Math.floor(Math.random() * 2000) + 1000;
      };
  
      // Method to restart the game
    const restartGame = () => {
        startGame();
    }
    // Start the game when the component is mounted
    onMounted(()=> {
        emits('initHeader', { pageTitle: 'Warm-up', breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Warm-up', url: '' }] })
        startGame();
    })
  
    onBeforeUnmount(()=>  {
      clearInterval(intervalId.value); // Cleanup interval before destroying the component
    })

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
  