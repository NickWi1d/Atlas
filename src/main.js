import { createApp } from 'vue'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

import App from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

const firebaseConfig = {
  apiKey: "AIzaSyCW3OriEr2uJPQuTJhwMxcvWlFLHnaTTQk",
  authDomain: "atlas-7dd34.firebaseapp.com",
  projectId: "atlas-7dd34",
  storageBucket: "atlas-7dd34.appspot.com",
  messagingSenderId: "336018364512",
  appId: "1:336018364512:web:9f13c58e33dfbd89ae4b05"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

createApp(App).use(router).mount('#app')
