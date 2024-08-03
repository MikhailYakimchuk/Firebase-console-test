
// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAaODZhZ3uEHSWyoHAXgK7mnyxf_qDQHkY",
  authDomain: "testing-mifist.firebaseapp.com",
  projectId: "testing-mifist",
  storageBucket: "testing-mifist.appspot.com",
  messagingSenderId: "710939552204",
  appId: "1:710939552204:web:d4df6d50ad162027cd5569",
  measurementId: "G-4QLT62SWJK"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
