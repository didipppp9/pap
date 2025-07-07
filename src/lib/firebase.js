// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAb9oKtZf6kbvOGDQYwW9twVOadylFPonY",
  authDomain: "sound-station-a3a3f.firebaseapp.com",
  projectId: "sound-station-a3a3f",
  storageBucket: "sound-station-a3a3f.appspot.com",
  messagingSenderId: "340235961396",
  appId: "1:340235961396:web:c3869dcb9b92049531f661",
  measurementId: "G-8WSLC3PZKZ"
};

// Inicializa o Firebase de forma segura
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Exporta os serviços que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;