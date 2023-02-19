import { initializeApp } from "@firebase/app"
import {getAuth} from "firebase/auth"

const firebaseConfigDev = {
    apiKey: import.meta.env.VITE_apiKey,
  
    authDomain: import.meta.env.authDomain,
  
    projectId: import.meta.env.projectId,
  
    storageBucket: import.meta.env.storageBucket,
  
    messagingSenderId: import.meta.env.messagingSenderId,
  
    appId: import.meta.env.appId
}

const firebaseConfig = {
    apiKey: "AIzaSyDYxEKJROXDEvjrB_GWeez5M3hhBQKBaas",
  
    authDomain: "nt-chess.firebaseapp.com",
  
    projectId: "nt-chess",
  
    storageBucket: "nt-chess.appspot.com",
  
    messagingSenderId: "522459140272",
  
    appId: "1:522459140272:web:5fb594d1b7ba75e34b2b75"
}

const app = initializeApp(firebaseConfig) 
export const auth = getAuth(app)
export default app

