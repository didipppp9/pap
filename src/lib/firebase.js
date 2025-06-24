// Ficheiro: src/lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Importe outros serviços do Firebase que precisar, como o Firestore, Storage, etc.

// Objeto de configuração que lê as variáveis de ambiente
const firebaseConfig = {
  apiKey: "AIzaSyAb9oKtZf6kbvOGDQYwW9twVOadylFPonY",
  authDomain: "sound-station-a3a3f.firebaseapp.com",
  projectId: "sound-station-a3a3f",
  storageBucket: "sound-station-a3a3f.firebasestorage.app",
  messagingSenderId: "340235961396",
  appId: "1:340235961396:web:c3869dcb9b92049531f661",
  measurementId: "G-8WSLC3PZKZ"
};

// Inicializa o Firebase apenas se ainda não tiver sido inicializado
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Usa a aplicação já existente
}

// Exporta os serviços do Firebase que quer usar no seu projeto
export const auth = getAuth(app);
export const db = getFirestore(app); // Exemplo para o Firestore

export default app;