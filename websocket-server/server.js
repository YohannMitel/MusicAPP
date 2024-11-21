const WebSocket = require('ws');

// Création du serveur WebSocket
const wss = new WebSocket.Server({ port: 8989 });

console.log("Serveur WebSocket en écoute sur ws://localhost:8989");

// Stockage des connexions par session
const sessions = {};

wss.on('connection', (ws) => {
  console.log("Nouveau client connecté.");
  
  // Flag pour vérifier si l'ID de session est défini
  let sessionInitialized = false;

  // Réception des messages du client
  ws.on('message', (message) => {
    // Vérifie si l'ID de session est défini

    if (!sessionInitialized) {

      const sessionId = message.toString().trim(); // Utilise le premier message comme ID de session
      ws.sessionId = sessionId;

      // Ajouter le client à la session
      if (!sessions[sessionId]) {
        sessions[sessionId] = [];
      }
      sessions[sessionId].push(ws);
      sessionInitialized = true;

      console.log(`Client ajouté à la session : ${sessionId}`);
      ws.send(JSON.stringify({ message: `Bienvenue dans la session ${sessionId}!` }));
      return;
    }

    // Une fois l'ID de session défini, diffuser les messages aux autres clients de la même session
    console.log(`Message reçu du client dans la session ${ws.sessionId}: ${message}`);
    sessions[ws.sessionId].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message, from: ws.sessionId }));
      }
    });
  });

  // Gestion de la déconnexion
  ws.on('close', () => {
    console.log(`Client déconnecté de la session ${ws.sessionId}.`);

    if (ws.sessionId && sessions[ws.sessionId]) {
      const index = sessions[ws.sessionId].indexOf(ws);
      if (index !== -1) {
        sessions[ws.sessionId].splice(index, 1);
      }

      // Supprimer la session si elle est vide
      if (sessions[ws.sessionId].length === 0) {
        delete sessions[ws.sessionId];
      }
    }
  });

  // Gestion des erreurs
  ws.on('error', (error) => {
    console.error("Erreur WebSocket :", error);
  });
});
