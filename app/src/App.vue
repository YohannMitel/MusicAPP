<template>

<div class="d-flex flex-column px-0 w-100 h-100">
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
import { onMounted, onUnmounted, ref } from 'vue';
import PageHeader from './components/PageHeader.vue';

const props = defineProps(["sessionId", "lastMessage"]);

const pageTitle = ref('');
const breadcrumbs = ref([]);

const lastMessage = ref(null);
const sessionId = ref(""); // ID de session de l'utilisateur
const socket = ref(null); // Référence au WebSocket
const isConnected = ref(false); // Statut de la connexion
const messages = ref([]); // Historique des messages reçus
let reconnectTimeout = null; // Timeout pour la reconnexion
const isReconnecting = ref(false); // État de reconnexion

// Fonction pour gérer la connexion WebSocket
const connectWebSocket = (sessionId_temp) => {
  if (isReconnecting.value) return; // Évite les reconnexions simultanées

  console.log("Tentative de connexion WebSocket...");

  // Initialiser la connexion WebSocket
  socket.value = new WebSocket("ws://localhost:8989");

  // Gérer les événements WebSocket
  socket.value.onopen = () => {
    console.log("WebSocket connected");
    isConnected.value = true;
    isReconnecting.value = false; // Réinitialise l'état de reconnexion

    // Envoyer l'ID de session une fois connecté
    socket.value.send(sessionId_temp);
    sessionId.value = sessionId_temp;
  };

  socket.value.onmessage = async (event) => {
    let message = event.data;


    try {

      message = JSON.parse(message);


      if(message.type != "game"){

        return
      }
    } catch (error) {
      return
    }

    lastMessage.value = message.value;
    messages.value.push(message);

    if ( message.value != 'shaked') return;
    await new Promise((resolve) => setTimeout(resolve, 100));
    lastMessage.value = null;
  };

  socket.value.onclose = () => {
    console.log("WebSocket disconnected");
    isConnected.value = false;

    // Déclencher la reconnexion
    attemptReconnect(sessionId_temp);
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket error:", error);
    isConnected.value = false;

    // Déclencher la reconnexion
    attemptReconnect(sessionId_temp);
  };
};

// Fonction pour tenter la reconnexion
const attemptReconnect = (sessionId_temp) => {
  if (isReconnecting.value) return; // Évite les reconnexions multiples
  isReconnecting.value = true;

  reconnectTimeout = setTimeout(() => {
    console.log("Tentative de reconnexion...");
    connectWebSocket(sessionId_temp);
  }, 3000); // Reconnexion après 3 secondes (ajustable)
};

// Fonction pour envoyer un message
const sendMessage = (message) => {

  if (socket.value && socket.value.readyState === WebSocket.OPEN  ) {

    socket.value.send(message);
  }
};

onMounted(() => {
  pageTitle.value = 'MusicApp';
  breadcrumbs.value = [
    { label: 'Home', url: '/' },
  ];

  // Initialisation de la connexion WebSocket
  if (props.sessionId) {
    connectWebSocket(props.sessionId);
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
});

const handleDataUpdate = (newData) => {
  pageTitle.value = newData.pageTitle;
  breadcrumbs.value = newData.breadcrumbs;
};
</script>
