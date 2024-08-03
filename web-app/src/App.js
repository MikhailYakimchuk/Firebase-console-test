import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';

// Налаштування Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaODZhZ3uEHSWyoHAXgK7mnyxf_qDQHkY",
  authDomain: "testing-mifist.firebaseapp.com",
  projectId: "testing-mifist",
  storageBucket: "testing-mifist.appspot.com",
  messagingSenderId: "710939552204",
  appId: "1:710939552204:web:d4df6d50ad162027cd5569",
  measurementId: "G-4QLT62SWJK"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Підключення до серверу socket.io
const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling']
});

const App = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          
          getToken(messaging, { vapidKey: 'BDZDwy2xs8x5eHpHC6IzhTrTvmgw5djr3g-EqLqDTVEspFrzRd3c07daagDxV2UQxv-vRMAOEhxaH5kT6KJCQrc', serviceWorkerRegistration: registration })
            .then((currentToken) => {
              if (currentToken) {
                console.log('FCM Token:', currentToken);
                window.fcmToken = currentToken; 
              } else {
                console.log('No registration token available. Request permission for ego generation.');
              }
            }).catch((err) => {
              console.log('An error occurred while receiving the token.', err);
            });
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }

    // Отримання повідомлень через FCM
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      setMessages((prevMessages) => [...prevMessages, payload.notification]);
    });
  }, []);

  // Функція для відправки повідомлення
  const sendMessage = () => {
    const fcmToken = window.fcmToken; 
    if (fcmToken) {
      socket.emit('send_message', { title, message, fcmToken });
    } else {
      console.error('FCM Token is not available');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Send Message</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Box>

      <Paper sx={{ mt: 5, padding: 2 }}>
        <Typography variant="h6" gutterBottom>Received Messages</Typography>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={msg.title} secondary={msg.body} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
