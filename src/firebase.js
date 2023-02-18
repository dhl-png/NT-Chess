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
    apiKey: process.env.APIKEY,
  
    authDomain: process.env.authDomain,
  
    projectId: process.env.projectId,
  
    storageBucket: process.env.storageBucket,
  
    messagingSenderId: process.env.messagingSenderId,
  
    appId: process.env.appId
}

console.log("T",  process.env.TEST)
const app = initializeApp(firebaseConfig) 
export const auth = getAuth(app)
export default app

