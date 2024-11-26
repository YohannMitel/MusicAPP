const WebSocket = require('ws');

// Créez une connexion WebSocket au serveur
const ws = new WebSocket('ws://localhost:8989');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');

  // Envoi de deux messages
  ws.send('1000'); // Envoi du premier message
  ws.send('shake'); // Envoi du deuxième message

  console.log('Messages sent!');
});

ws.on('message', function message(data) {
  console.log(`Message received: ${data}`);

  // Après avoir reçu un message, on ferme la connexion
  ws.close();
  console.log('Connection closed');
});

ws.on('close', function close() {
  console.log('WebSocket connection closed');
});

ws.on('error', function error(err) {
  console.error('Error: ', err);
});
