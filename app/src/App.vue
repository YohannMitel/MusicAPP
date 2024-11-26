<template>

  <div class="container-fluid overflow-hidden px-0 py-2 h-100">
    <PageHeader :pageTitle="pageTitle" :breadcrumbs="breadcrumbs" />
    <RouterView 
      :lastMessage="lastMessage"
      :sessionId="sessionId"
      @initHeader="handleDataUpdate" 
      @wsConnect="connectWebSocket" 
      @wsMsg="sendMessage">
    </RouterView>
  </div>


</template>


<script setup>
import { onMounted,onUnmounted, ref } from 'vue';
import PageHeader from './components/PageHeader.vue';


const props = defineProps(["sessionId", "lastMessage"]);



const pageTitle = ref('')
const breadcrumbs = ref([]);


const lastMessage = ref(null);
const sessionId = ref(""); // ID de session de l'utilisateur
const socket = ref(null); // Référence au WebSocket
const isConnected = ref(false); // Statut de la connexion
const messages = ref([]); // Historique des messages reçus

// Fonction pour gérer la connexion WebSocket
const connectWebSocket = (sessionId_temp) => {
  // Initialiser la connexion WebSocket
  socket.value = new WebSocket("ws://localhost:8989");

  // Gérer les événements WebSocket
  socket.value.onopen = () => {
    console.log("WebSocket connected");
    isConnected.value = true;

    // Envoyer l'ID de session une fois connecté
    socket.value.send(sessionId_temp);
    sessionId.value = sessionId_temp;

  };

  socket.value.onmessage = async (event) => {
    console.log("Message reçu :", event.data);
    lastMessage.value = event.data;
    messages.value.push(event.data);

    if (event.data != 'shake' ) return 
    await new Promise((resolve) => setTimeout(resolve, 200));
    lastMessage.value = null;

  };

  socket.value.onclose = () => {
    console.log("WebSocket disconnected");
    isConnected.value = false;
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket error:", error);
  };



  return true

};

// Fonction pour envoyer un message
const sendMessage = (message) => {
  console.log('ICI')
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    console.log('ICI2')

    socket.value.send(message);

  }
};





onMounted(() => {


  pageTitle.value = 'MusicApp';
  breadcrumbs.value = [
    { label: 'Home', url: '/' },
  ];
})


onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});


const handleDataUpdate = (newData) => {
  // Ici on met à jour la variable ref ou data dans le parent
  console.log(newData)
  pageTitle.value = newData.pageTitle;
  breadcrumbs.value = newData.breadcrumbs;

}


</script>