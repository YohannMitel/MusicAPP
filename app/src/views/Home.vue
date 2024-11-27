<template>
  <div id="app">
    <div class="container-fluid">
      <!-- Row pour la disposition à gauche et à droite -->
      <div class="row align-items-center">
        <!-- Colonne gauche: Description du jeu -->
        <div class="col-md-8">
          <div class="game-description">
            <h1 class="text-center mb-4">Game Description</h1>
            <p class="lead text-center mb-4">
              This game is divided into three mini-games, each designed to interact with connected external objects,
              providing a unique and immersive experience. Here's a breakdown of each mini-game:
            </p>

            <!-- Accordion de description des mini-jeux -->
            <div class="accordion" id="gameDescription">
              <!-- Mini-game 1: Warm-Up -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    1. Mini-game: "Warm-Up"
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                  data-bs-parent="#gameDescription">
                  <div class="accordion-body">
                    In this game, you will interact with a light signal that can be in three different states:
                    <ul>
                      <li><strong>Red:</strong> This means the game is paused or stopped.</li>
                      <li><strong>Green:</strong> This indicates you need to get ready.</li>
                      <li><strong>Flashing Green:</strong> This signals that it's time to press the connected external
                        button.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Mini-game 2: Guitar Hero -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    2. Mini-game: "Guitar Hero"
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                  data-bs-parent="#gameDescription">
                  <div class="accordion-body">
                    This mini-game is inspired by the famous rhythm game. It involves three connected LED lights. Each
                    LED represents a different button. As the LEDs light up, you need to press the corresponding button
                    on the connected object in sync with the rhythm.
                  </div>
                </div>
              </div>

              <!-- Mini-game 3: Cha-Cha-Cha -->
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    3. Mini-game: "Cha-Cha-Cha"
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                  data-bs-parent="#gameDescription">
                  <div class="accordion-body">
                    In this mini-game, you will use a connected maraca. A song will play, and when you hear the maraca
                    sounds in the music, you need to shake the connected maraca to match the rhythm and score points.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite: Bouton Start -->
        <div class="col-md-4 text-center">
          <div class="mb-3">
            <input               type="text"
              class="form-control"
              placeholder="Enter session ID of your connected device"
              v-model="sessionId"
              />
          </div>
          <RouterLink :to="startTheGame()">
            <button @click="playNote();" type="button" class="music-button" :disabled="!sessionId">
              Start 🎵
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";


const sessionId = ref(''); // Session ID stocké par l'utilisateur
const audio = new Audio("/audio/start.mp3");

const emits = defineEmits(['initHeader', 'wsConnect'])


const playNote = () => {
  if (!sessionId.value) return; // Ne joue pas si l'ID de session est vide

  audio.currentTime = 0; // Revenir au début
  audio.play(); // Jouer le son
  emits('wsConnect', sessionId.value);

};

const startTheGame = () => {
  if (!sessionId.value.trim() != '' ) return '';
  return { name: 'WarmUp',  query: { sessionId: sessionId.value }}
}


</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 900px;
}

.game-description {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.accordion-button {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.accordion-button:not(.collapsed) {
  background-color: #45a049;
}

.accordion-body {
  font-size: 16px;
  color: #6c757d;
}

.music-button {
  padding: 15px 30px;
  font-size: 18px;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.music-button:disabled {
  background-color: #9e9e9e;
  /* Gris clair pour montrer qu'il est désactivé */
  cursor: not-allowed;
  /* Curseur changé pour indiquer l'état désactivé */
  box-shadow: none;
  /* Retirer l'ombre pour un effet visuel atténué */
  color: #dcdcdc;
  /* Texte plus clair pour renforcer l'aspect désactivé */
}

.music-button:hover:enabled {
  background-color: #45a049;
}
</style>