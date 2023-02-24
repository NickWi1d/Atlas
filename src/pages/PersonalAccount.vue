<template>
  <div class="TabMenu">
    <div class="tabs">
      <button class="tablink" @click="openPage('PersonalInfo')" id="defaultOpen">Личная информация</button>
      <button class="tablink" @click="openPage('myTrips')">Мои поездки</button>
      <button class="tablink" @click="openPage('settings')">Настройки</button>
      <button class="tablink" @click="handleSubmit">Выйти</button>
    </div>
    <div class="content">
      <div id="PersonalInfo" class="tabcontent">
        <form action="action_page.php" @submit.prevent="saveChenges(user.uid, user.email, Fname, Lname, PhoneNumber)">

          <label for="fname">Email</label>
          <input type="text" id="fname" name="firstname" placeholder="Your email.." :value="user.email" readonly>

          <label for="fname">First Name</label>
          <input type="text" id="fname" name="lastname" placeholder="Your first name.." v-model="Fname">

          <label for="lname">Last Name</label>
          <input type="text" id="lname" name="lastname" placeholder="Your last name.." v-model="Lname">

          <label for="PhoneNumber">Phone number</label>
          <input type="text" id="lname" name="PhoneNumber" placeholder="Your phone number.." v-model="PhoneNumber">

          <input type="submit" value="Save">

        </form>
      </div>
      <div id="myTrips" class="tabcontent">
      </div>

      <div id="settings" class="tabcontent">
        <div class="wrpDelAcc">
          <p>Вы можете удалить аккаунт без вожможности восстановления, все данные будут утеряны</p>
          <input type="button" value="Удалить аккаунт" class="delAcc" @click="deleteUser">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { auth, db } from '../main'
import { collection, query, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';

let Fname = ref(), Lname = ref(), PhoneNumber = ref()
let myTrips
const user = auth.currentUser;

async function deleteTripFromPersonalAccount(collection, document) {
  await deleteDoc(doc(db, `User: ${collection.uid}`, document));
}

async function deleteCollection(user){
  const allDocs = query(collection(db, `User: ${user.uid}`));
  const allDocsSnapshot = await getDocs(allDocs);
  allDocsSnapshot.forEach((docum) => {
    del(docum)
  })
  async function del(d){
    await deleteDoc(doc(db, `User: ${user.uid}`, d.id));
  }
}


onMounted(() => {
  document.getElementById("defaultOpen").click()
  myTrips = document.querySelector('#myTrips')
  filtr()
})
const error = ref(null)

const store = useStore()
const router = useRouter()

async function saveChenges(userId, email, Fname, Lname, PhoneNumber) {
  await setDoc(doc(db, `User: ${userId}`, "InfoAboutUser"), {
    "email": email,
    "First name": Fname,
    "Last name": Lname,
    "Phone number": PhoneNumber,
  })
}

function deleteUser() {
  deleteCollection(user.uid)
  user.delete().then(function () {
    console.log('пользователь удален')
  }).catch(function (error) {
    console.log(`Не удалился по причине: ${error.message}`)
  });
  handleSubmit()

}

const handleSubmit = async () => {
  try {
    await store.dispatch('logout')
    router.push('/Login')
  }
  catch (err) {
    error.value = err.message
  }
}




function openPage(pageName) {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById(pageName).style.display = "";
}

async function filtr() {
  const q = query(collection(db, `User: ${user.uid}`));
  const querySnapshot = await getDocs(q);
  // deleteItems()
  querySnapshot.forEach((doc) => {
    if (doc.id != 'InfoAboutUser') {
      let div = document.createElement('div')
      div.className = 'resOfSearch'

      let fromVrap = document.createElement('div')
      fromVrap.className = 'fromVrap'
      let from = document.createElement('h1')
      from.innerHTML = `${doc.data().from}`
      fromVrap.append(from)
      div.append(fromVrap)


      let dashVrap = document.createElement('div')
      dashVrap.className = 'dashVrap'
      let dash = document.createElement('h1')
      dash.innerHTML = `-`
      dashVrap.append(dash)
      div.append(dashVrap)

      let toVrap = document.createElement('div')
      toVrap.className = 'toVrap'
      let to = document.createElement('h1')
      to.innerHTML = doc.data().to
      toVrap.append(to)
      div.append(toVrap)

      let timeVrap = document.createElement('div')
      timeVrap.className = 'timeVrap'
      let time = document.createElement('h1')
      time.innerHTML = doc.data().time
      timeVrap.append(time)
      div.append(timeVrap)

      let dateVrap = document.createElement('div')
      dateVrap.className = 'dateVrap'
      let date = document.createElement('h1')
      date.innerHTML = doc.data().date
      dateVrap.append(date)
      div.append(dateVrap)

      let priceVrap = document.createElement('div')
      priceVrap.className = 'priceVrap'
      let price = document.createElement('h1')
      price.innerHTML = `${doc.data().price}$`
      priceVrap.append(price)
      div.append(priceVrap)

      let orderVrap = document.createElement('div')
      orderVrap.className = 'orderVrap'
      let order = document.createElement('input')
      order.className = 'order'
      order.type = 'button'
      order.value = 'Удалить'
      order.onclick = function () {
        div.remove()
        deleteTripFromPersonalAccount(user.uid, doc.id)
      }
      orderVrap.append(order)
      div.append(orderVrap)

      myTrips.append(div)
    }
  });
}

</script>

<style>
body,
html {
  height: 100%;
  margin: 0;
}

* {
  margin: 0;
}

.title {
  margin-right: 5%;
}

.TabMenu {
  display: flex;
  height: 100%;
}

.tabs {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 5%;
  align-items: center;
  width: 20%;
  height: 100%;
}

.content {
  padding-top: 5%;
  width: 80%;
  height: 100%;
}

/* Style tab links */
.tablink {
  background-color: #b1afaf;
  margin-left: 2%;
  margin-right: 2%;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  font-size: 17px;
  width: 80%;
}

.tablink:first-child {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.tablink:last-child {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.tablink:not(:last-child) {
  margin-bottom: 1%;
}

.tablink:hover {
  background-color: #9c9c9c;
}

/* Style the tab content (and add height:100% for full page content) */
.tabcontent {
  color: black;
  /* display: none; */
  /* padding: 100px 20px; */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.order {
  width: 80%;
  height: 70%;
  border: none;
  background-color: #2A5FCF;
  border-radius: 20px;
  color: white;
  font-size: large;
}

.fromVrap,
.toVrap,
.dateVrap {
  width: 18%;
}

.dashVrap {
  width: 2%;
}

.timeVrap,
.priceVrap {
  width: 15%;
}

.orderVrap {
  height: 80%;
  width: 16%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resOfSearch {
  width: 90%;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 3%;
  background: #fff;
  box-shadow: 0px 2px 4px rgb(8 78 104 / 12%), 0px 0px 2px rgb(8 78 104 / 18%);
  border-radius: 3px;
}


input[type=text],
select,
textarea {
  width: 100%;
  /* Full width */
  padding: 12px;
  /* Some padding */
  border: 1px solid #ccc;
  /* Gray border */
  border-radius: 4px;
  /* Rounded borders */
  box-sizing: border-box;
  /* Make sure that padding and width stays in place */
  margin-top: 6px;
  /* Add a top margin */
  margin-bottom: 16px;
  /* Bottom margin */
  resize: vertical
    /* Allow the user to vertically resize the textarea (not horizontally) */
}

/* Style the submit button with a specific background color etc */
input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* When moving the mouse over the submit button, add a darker green color */
input[type=submit]:hover {
  background-color: #45a049;
}

/* Add a background color and some padding around the form */
.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}

label {
  float: left;
}

.wrpDelAcc {
  width: 90%;
  height: 120px;
  background-color: white;
  box-shadow: 0px 2px 4px rgb(8 78 104 / 12%), 0px 0px 2px rgb(8 78 104 / 18%);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
}

.wrpDelAcc>p {
  margin-left: 2%;
  padding-top: 20px;
}

.delAcc {
  color: #075FFA;
  border: none;
  background-color: white;
  font-size: 20px;
  padding: 0;
  margin-left: 2%;
}

.delAcc:hover {
  text-decoration: underline;
}</style>