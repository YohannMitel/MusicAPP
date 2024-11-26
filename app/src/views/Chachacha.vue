<template>
    <div id="app">
      <div class="container-fluid">
        <!-- Section centrale avec un GIF et de la musique -->
        <div class="row justify-content-center align-items-center text-center">
          <div class="col-md-8">
            <div class="gif-container">
              <img :src="isPaused ? '/gif/muchachos-statico.jpg'  : '/gif/muchachos.gif'" alt="muchachachos" class="centered-gif" />
            </div>
            <h1 class="mt-4">Shake It !</h1>
            <button @click="start()">
                start
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const audio = new Audio("/audio/chachachas.wav"); // Remplacer par l'URL de votre fichier audio
  const isPaused = ref(true);

  const emits = defineEmits(['initHeader', 'wsMsg']);


  onMounted(() => {
    emits('initHeader', { pageTitle: 'Chachachas', breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Chachachas', url: '' }] });
    emits('wsMsg', 'startchachachagame')
    
  });
  

  const start = () =>{
    console.log('DDD')
    isPaused.value = false;
    audio.loop = true; // Activer la boucle pour la musique
    audio.volume = 0.5; // Ajuster le volume si nécessaire
    audio.play().catch((err) => console.error("Audio playback failed", err)); // Jouer la musique de fond
  }
  </script>
  
  <style scoped>
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #282c34;
    color: #f7f7f7;
    font-family: Arial, sans-serif;
    flex-direction: column;
  }
  
  .container-fluid {
    text-align: center;
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
  