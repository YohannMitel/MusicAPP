<template>

  <div class="container-fluid">

    <div class="d-flex flex-row justify-content-between w-100 px-2">
      <button type="button"  @click="start()" class="btn btn-primary">Start</button>
      <RouterLink class="btn btn-primary " :to="'/'">Home</RouterLink>
    </div>
    <!-- Section centrale avec un GIF et de la musique -->
    <div class="row justify-content-center align-items-center text-center">
      <div class="col-md-8">
        <div class="gif-container">
          <img :src="isPaused ? lastMessage == 'shaked' ? '/gif/muchachos-statico-f2.png'
            : '/gif/muchachos-statico-f1.png' : '/gif/muchachos.gif'" alt="muchachachos" class="centered-gif" />
        </div>
        <h1 class="mt-4">Shake It !</h1>
      </div>
    </div>
  </div>



</template>


<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const audio = new Audio("/audio/chachachas.wav"); // Musique de fond
const isPaused = ref(true); // Indique si le jeu est en pause
const gameOver = ref(false); // Indique si le jeu est terminé

const emits = defineEmits(["initHeader", "wsMsg"]);
const props = defineProps(["lastMessage"]);

const router = useRouter();
const route = useRoute();
const sessionId = route.query.sessionId;

const noteTimer = (duration, signal) => {

  notesSequenceGame.value[0].timer = setTimeout(() => {
    audioError.currentTime = 0;
    audioError.play();


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
  { signal: 'shake', duration: 700 },
  { signal: 'stop', duration: 700 },
  { signal: 'shake', duration: 4000 },
  { signal: 'stop',  duration: 2500 }

]
// Fonction appelée à la fin du jeu
const endGame = () => {
  isPaused.value = false; // Mettre le jeu en pause
  gameOver.value = true; // Marquer le jeu comme terminé
  audio.pause(); // Arrêter la musique
  audio.currentTime = 0; // Réinitialiser la musique
  console.log("Game over!"); // Debug

};

// Synchronisez la prop avec la logique de fin de jeu
watch(
  () => props.lastMessage, // Surveille les changements de la prop
  (newValue) => {
    console.log("lastMessage updated:", newValue);
    if (newValue === "finish") {
      endGame(); // Appeler la fonction de fin du jeu
    }
  }
);

onMounted(() => {
  /*if (!(sessionId && sessionId.trim() !== "")) {
    route.push("/");
    return;
  }*/

  emits("initHeader", {
    pageTitle: "Chachachas | SessionID : " + sessionId,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Chachachas", url: "" },
    ],
  });
});

onUnmounted(()=>{
  endGame();
})

const start = () => {
  console.log('START')
  isPaused.value = true;
  gameOver.value = false;
  audio.loop = true; // Activer la boucle pour la musique
  audio.volume = 0.05; // Ajuster le volume si nécessaire
  audio.play().catch((err) => console.error("Audio playback failed", err)); // Jouer la musique de fond
  emits("wsMsg", "startchachachagame");
};
</script>


<style scoped>
.container-fluid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background-color: #dcdcdc;
  color: #f7f7f7;
  font-family: Arial, sans-serif;
  flex-direction: column;
}



.gif-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.centered-gif {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}

h1 {
  color: #4caf50;
  font-weight: bold;
}

.lead {
  font-size: 18px;
  margin-top: 10px;
  color: #dcdcdc;
}
</style>