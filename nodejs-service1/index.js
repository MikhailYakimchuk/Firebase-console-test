const dgram = require('dgram');
const admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const UDP_PORT = 41234;

// Створення UDP сервера
const udpServer = dgram.createSocket('udp4');

// Обробка отриманих UDP повідомлень
udpServer.on('message', (msg, rinfo) => {
  console.log(`UDP message received: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const data = JSON.parse(msg);

  // Формування FCM повідомлення
  const message = {
    notification: {
      title: data.title,
      body: data.message,
    },
    token: data.fcmToken,
  };

  // Відправка повідомлення через FCM
  admin.messaging().send(message)
    .then(response => {
      console.log('Message successfully sent:', response);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
});

// Запуск UDP сервера
udpServer.bind(UDP_PORT, () => {
  console.log(`Server 2 is running and listening on port ${UDP_PORT}`);
});
