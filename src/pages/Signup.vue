<template>
  <form @submit.prevent="handleSubmit" class="signUpForm">
    <h1>Зарегистрироваться</h1>
    <p>Пожалуйста заполните эту форму, что бы создать учетётную запись</p>
    <hr>

    <label for="email"><b>Email</b></label>
    <input class="emailInput" type="text" placeholder="Enter Email" name="email" v-model="email" required>

    <label for="psw"><b>Пароль</b></label>
    <input class="passInput" type="password" placeholder="Enter Password" name="psw" v-model="password" required>

    <div v-if="error">{{ error }}</div>

    <button type="submit" class="registerbtn">Зарегистрироваться</button>

  <div class="container signin">
    <p>Уже есть аккаунт? <router-link to="/Login" class="singleIn">Войти</router-link></p>
  </div>
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
  "email": email,
  "FirstName": "",
  "LastName": "",
  "PhoneNumber": "",
  })
  await setDoc(doc(db, `users`, userId), {})
}
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
    localStorage.setItem('currentUser', JSON.stringify(auth.currentUser))
    router.push('/PersonalAccount')
    writeUserData(auth.currentUser.uid, auth.currentUser.email)
    
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
  width: 30%;
  margin: auto;
}
.signUpForm > h1{
  margin-bottom: 2%;
}

* {box-sizing: border-box}

/* Add padding to containers */
.container {
  padding: 16px;
}

/* Full-width input fields */
.emailInput, .passInput {
  width: 100%;
  /* padding: 15px;
  margin: 5px 0 22px 0; */
  display: inline-block;
  background: #f1f1f1;
}
.passInput{
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 12px;
  margin: 6px 0 16px 0; 
}
.emailInput:focus, .passInput:focus {
  background-color: #ddd;
  outline: none;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit/register button */
.registerbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.registerbtn:hover {
  opacity:1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}
</style>