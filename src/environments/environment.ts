// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const environment = {
//   apiKey: "AIzaSyAgxP6rYyc-Y_bHBTF31z5IdiG2q-3dsU0",
//   authDomain: "assignment5-expensetracker.firebaseapp.com",
//   projectId: "assignment5-expensetracker",
//   storageBucket: "assignment5-expensetracker.firebasestorage.app",
//   messagingSenderId: "244025986694",
//   appId: "1:244025986694:web:ada06053e8b2eadc7d4b07",
//   measurementId: "G-99D7CW0LCJ"
// };

// // Initialize Firebase
// const app = initializeApp(environment);
// const analytics = getAnalytics(app);

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAgxP6rYyc-Y_bHBTF31z5IdiG2q-3dsU0",
    authDomain: "assignment5-expensetracker.firebaseapp.com",
    projectId: "assignment5-expensetracker",
    storageBucket: "assignment5-expensetracker.firebasestorage.app",
    messagingSenderId: "244025986694",
    appId: "1:244025986694:web:ada06053e8b2eadc7d4b07",
    measurementId: "G-99D7CW0LCJ"
  }
};