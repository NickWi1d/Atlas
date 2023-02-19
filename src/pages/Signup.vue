<template>
  <form @submit.prevent="handleSubmit" class="signUpForm">
    <h3 class="headLabel">Зарегистрироваться</h3>

    <label for="email" class="emailLabel">Email:</label>
    <input class="emailInput" type="email" name="email" v-model="email" required>

    <label for="email" class="passLabel">Password:</label>
    <input class="passInput" type="password" name="password" v-model="password" required>

    <button class="w-max mt-4 px-4 py-2 text-center rounded-full bg-blue-500 text-white">Зарегистрироваться</button>
    <div v-if="error">{{ error }}</div>
    <router-link to="/Login" class="singleIn">Уже зарегестрированы? Войти</router-link>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { doc, setDoc} from "firebase/firestore"; 
import { db } from '../main'
import { auth } from '../main'

async function writeUserData(userId, email) {
  await setDoc(doc(db, `User: ${userId}`, "InfoAboutUser"), {
  email: email,
})}
const email = ref('')
const password = ref('')
const error = ref(null)

const store = useStore()
const router = useRouter()

const handleSubmit = async () => {
  try {
    await store.dispatch('signup', {
      email: email.value,
      password: password.value
    })
    router.push('/PersonalAccount')
    const user = auth.currentUser;
    writeUserData(user.uid, user.email)
  }
  catch (err) {
    error.value = err.message
  }
}

</script>


<style>
.signUpForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
  height: 90%;
}

.emailInput {
  margin-bottom: 2%;
}

.passInput {
  margin-bottom: 2%;
}

.emailLabel {
  margin-bottom: 1%;
}

.passLabel {
  margin-bottom: 1%;
}

.headLabel {
  margin-bottom: 2%;
}</style>