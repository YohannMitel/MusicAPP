<template>

  <div class="container-fluid">

    <div class="d-flex flex-row justify-content-between w-100 px-2">
      <button type="button" @click="start()" class="btn btn-primary">Start</button>
      <RouterLink class="btn btn-primary " :to="{ name: 'Score', query: { sessionId: sessionId } }">Score</RouterLink>
    </div>
    <!-- Section centrale avec un GIF et de la musique -->
    <div class="d-flex flex-row justify-content-around text-center h-75 w-100">

      <div class="d-flex flex-column justify-content-center">
        <div class="gif-container">
          <img :src="!gameOver ? lastMessage == 'shaked' ? '/gif/muchachos-statico-f2.png'
            : '/gif/muchachos-statico-f1.png' : '/gif/muchachos.gif'" alt="muchachachos" class="centered-gif" />
        </div>
        <h1 v-if="!gameOver && gameStarted" class="mt-4"> {{ notesSequenceGame[0]?.signal == "shake" ? "Shake it !" : "Dont move " }}</h1>
        <h1 v-else-if="!gameOver" class="mt-4"> Start the game </h1>
      </div>

      <iframe v-if="gameOver" class="px-4"
        src="http://192.168.1.68:3900/d-solo/ee5u0bi8ox534a/musicapp-dashboard?orgId=1&from=now-40s&to=now&timezone=browser&theme=light&panelId=2&__feature.dashboardSceneSolo"
        width="70%" frameborder="0"></iframe>


    </div>
  </div>



</template>


<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";


const audio = new Audio("/audio/chachachas.wav"); // Musique de fond

const gameOver = ref(false); // Indique si le jeu est terminé
const gameStarted =  ref(false);

const emits = defineEmits(["initHeader", "wsMsg", "updtScore"]);
const props = defineProps(["lastMessage"]);

const router = useRouter();
const route = useRoute();
const sessionId = route.query.sessionId;

const score = ref(0);

const notesSequenceGame = ref([]);


// Fonction appelée à la fin du jeu
const endGame = () => {
  if(gameOver.value) return
  emits("updtScore", score.value)
  gameOver.value = true; // Marquer le jeu comme terminé
  audio.pause(); // Arrêter la musique
  audio.currentTime = 0; // Réinitialiser la musique
  console.log("Game over!"); // Debug

};


const noteTimer = (duration) => {

  notesSequenceGame.value[0].timer = setTimeout(() => {

    notesSequenceGame.value.shift();

    if (notesSequenceGame.value.length == 0) {
      endGame()

    } else {
      const { duration, signal } = notesSequenceGame.value[0];
      notesSequenceGame.value[0].timer = noteTimer(duration, signal);

    }

  }
    , duration
  )
}

const notesSequence = [
  // Première partie de l'Overworld Theme
  { signal: 'stop', duration: 696 },
  { signal: 'shake', duration: 1082 },
  { signal: 'stop', duration: 2861 },
  { signal: 'shake', duration: 4870 },
  { signal: 'stop', duration: 1546 },
  { signal: 'shake', duration: 1392 },

  { signal: 'stop', duration: 696 },
  { signal: 'shake', duration: 1082 },
  { signal: 'stop', duration: 2861 },
  { signal: 'shake', duration: 4870 },
  { signal: 'stop', duration: 1546 },
  { signal: 'shake', duration: 1392 }


]


// Synchronisez la prop avec la logique de fin de jeu
watch(
  () => props.lastMessage, // Surveille les changements de la prop
  (newValue) => {
    //console.log("lastMessage updated:", newValue);
    if(newValue == "shaked" && notesSequenceGame.value[0]?.signal == "shake"){
      console.log('+1')
      score.value ++
    }else{
      console.log('-1')
      score.value -- 
    }
    if (newValue === "finish") {
      endGame(); // Appeler la fonction de fin du jeu
    }
  }
);

onMounted(() => {
  if (!(sessionId && sessionId.trim() !== "")) {
    router.push("/");
    return;
  }

  emits("initHeader", {
    pageTitle: "Chachachas | SessionID : " + sessionId,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Chachachas", url: "" },
    ],
  });
});

onUnmounted(() => {
  endGame();
})

const start = () => {
  notesSequenceGame.value = notesSequence
  noteTimer(notesSequenceGame.value[0]?.duration)
  console.log('START')

  gameOver.value = false;
  gameStarted.value = true;

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
  background-color: #f0f0f0;
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