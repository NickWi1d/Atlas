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
        <form action="action_page.php" @submit.prevent="saveChenges(user.uid, user.email, FullInfoAboutUser.FirstName, FullInfoAboutUser.LastName, FullInfoAboutUser.PhoneNumber)">

          <label for="fname">Email</label>
          <input type="text" id="fname" name="firstname" placeholder="Your email.." :value="user.email" readonly
            class="personalInfo">

          <label for="fname">Имя</label>
          <input type="text" id="fname" name="lastname" placeholder="Your first name.." v-model="FullInfoAboutUser.FirstName" class="personalInfo">

          <label for="lname">Фамилия</label>
          <input type="text" id="lname" name="lastname" placeholder="Your last name.."  v-model="FullInfoAboutUser.LastName" class="personalInfo">

          <label for="PhoneNumber">Номер телефона</label>
          <input type="text" id="lname" name="PhoneNumber" placeholder="Your phone number.."  v-model="FullInfoAboutUser.PhoneNumber" class="personalInfo">

          <input type="submit" value="Сохранить">

        </form>
      </div>
      <div id="myTrips" class="tabcontent">
      </div>

      <div id="settings" class="tabcontent">
        <div class="wrpDelAcc">
          <p>Вы можете удалить аккаунт без вожможности восстановления, все данные будут утеряны</p>
          <input type="button" value="Удалить аккаунт" class="delAcc" @click="deleteUser(ids)">
        </div>
      </div>
    </div>
    <div id="deleteTrip">Поездка успешно удалена</div>
    <div id="saveChenges">Успешно сохранено</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { auth, db } from '../main'
import { collection, query, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';

let myTrips, ids = []
let FullInfoAboutUser = ref({})

const user = auth.currentUser;
const error = ref(null)
const store = useStore()
const router = useRouter()

onMounted(async () => {
  document.getElementById("defaultOpen").click()
  myTrips = document.querySelector('#myTrips')
  filtr()
  await getFullInfoAboutUser()
  console.log(FullInfoAboutUser)

})
// Не работает((
  async function getFullInfoAboutUser(){
  const q = query(collection(db, `User: ${user.uid}`));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.id == 'InfoAboutUser') {
      FullInfoAboutUser.value.FirstName = doc.data().FirstName
      FullInfoAboutUser.value.LastName = doc.data().LastName
      FullInfoAboutUser.value.PhoneNumber = doc.data().PhoneNumber
    }

  })
  console.log(FullInfoAboutUser)
}

async function deleteTripFromPersonalAccount(collection, document) {
  await deleteDoc(doc(db, `User: ${collection}`, document));
}




async function saveChenges(userId, email, Fname, Lname, PhoneNumber) {
  await setDoc(doc(db, `User: ${userId}`, "InfoAboutUser"), {
    "email": email,
    "FirstName": Fname,
    "LastName": Lname,
    "PhoneNumber": PhoneNumber,
  })
  // Get the snackbar DIV
  var x = document.getElementById("saveChenges");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
async function getCollection() {
  ids = []
  const querySnapshot = await getDocs(collection(db, `User: ${user.uid}`));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    ids.push(doc.id)
  })
  console.log(ids)
}
async function delDosFromCollection(arr) {
  for (let val in arr) {
    await deleteDoc(doc(db, `User: ${user.uid}`, arr[val]));
  }
}
async function deleteUser() {
  await getCollection()
  await delDosFromCollection(ids)
  user.delete().then(function () {
    console.log('пользователь удален')
  }).catch(function (error) {
    console.log(`Не удалился по причине: ${error.message}`)
  });
  handleSubmit()

}
async function filtr() {
  const q = query(collection(db, `User: ${user.uid}`));
  const querySnapshot = await getDocs(q);
  // deleteItems()
  querySnapshot.forEach((doc) => {
    if (doc.id != 'InfoAboutUser') {
      let div = document.createElement('div')
      div.className = 'resOfSearchPA'

      let wrapForDiv = document.createElement('div')
      wrapForDiv.className = 'wrapForDivPA'

      let fromVrap = document.createElement('div')
      fromVrap.className = 'fromVrapPA'
      let from = document.createElement('h1')
      from.innerHTML = `${doc.data().from}`
      fromVrap.append(from)
      wrapForDiv.append(fromVrap)


      let dashVrap = document.createElement('div')
      dashVrap.className = 'dashVrapPA'
      let dash = document.createElement('h1')
      dash.innerHTML = `-`
      dashVrap.append(dash)
      wrapForDiv.append(dashVrap)

      let toVrap = document.createElement('div')
      toVrap.className = 'toVrapPA'
      let to = document.createElement('h1')
      to.innerHTML = doc.data().to
      toVrap.append(to)
      wrapForDiv.append(toVrap)

      let timeVrap = document.createElement('div')
      timeVrap.className = 'timeVrapPA'
      let time = document.createElement('h1')
      time.innerHTML = doc.data().time
      timeVrap.append(time)
      wrapForDiv.append(timeVrap)

      let dateVrap = document.createElement('div')
      dateVrap.className = 'dateVrapPA'
      let date = document.createElement('h1')
      date.innerHTML = doc.data().date
      dateVrap.append(date)
      wrapForDiv.append(dateVrap)

      let priceVrap = document.createElement('div')
      priceVrap.className = 'priceVrapPA'
      let price = document.createElement('h1')
      price.innerHTML = `${doc.data().price}$`
      priceVrap.append(price)
      wrapForDiv.append(priceVrap)

      let orderVrap = document.createElement('div')
      orderVrap.className = 'orderVrapPA'
      let order = document.createElement('input')
      order.className = 'order'
      order.type = 'button'
      order.value = 'Удалить'
      order.onclick = function () {
        div.remove()
        deleteTripFromPersonalAccount(user.uid, doc.id)
        // Get the snackbar DIV
        var x = document.getElementById("deleteTrip");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      }
      orderVrap.append(order)
      wrapForDiv.append(orderVrap)

      div.append(wrapForDiv)

      div.onclick = function () {
       if(div.querySelector('.aditionInfoPA') == null){
        wrapForDiv.style.height = '50%'
        div.style.height = "200px"

        let aditionInfo = document.createElement('div')
        aditionInfo.className = 'aditionInfoPA'

        let Bus = document.createElement('div')
        Bus.className = 'busVrapPA'
        let typeOfBus = document.createElement('h1')
        typeOfBus.innerHTML = `Тип автобуса: ${doc.data().type}`
        Bus.append(typeOfBus)
        aditionInfo.append(Bus)


        let driverVrap = document.createElement('div')
        driverVrap.className = 'driverVrapPA'
        let driver = document.createElement('h1')
        driver.innerHTML = `Водитель: ${doc.data().driver}`
        driverVrap.append(driver)
        aditionInfo.append(driverVrap)

        div.append(aditionInfo)
       }else{
        wrapForDiv.style.height = '100%'
        div.style.height = "100px"
        div.querySelector('.aditionInfoPA').remove()
       }
      }
      myTrips.append(div)
    }
  });
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

</script>

<style>

* {
  margin: 0;
}

body,
html {
  height: 100%;
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

.fromVrapPA,
.toVrapPA,
.dateVrapPA {
  width: 18%;
}

.busVrapPA, .driverVrapPA{
  width: 50%;
  margin-left: 3%;
}
.dashVrapPA {
  width: 2%;
}

.timeVrapPA,
.priceVrapPA {
  width: 15%;
}

.orderVrapPA {
  height: 80%;
  width: 16%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resOfSearchPA {
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  margin-bottom: 3%;
  background: #fff;
  box-shadow: 0px 2px 4px rgb(8 78 104 / 12%), 0px 0px 2px rgb(8 78 104 / 18%);
  border-radius: 3px;
}

.wrapForDivPA {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.aditionInfoPA{
  display: flex;
  justify-content: space-around;
  width: 70%;
  height: 50%;
}

input[type=text],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical
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
}

/* The snackbar - position it at the bottom and in the middle of the screen */
#deleteTrip,
#saveChenges {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#deleteTrip.show,
#saveChenges.show {
  visibility: visible;
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }

  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }

  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }

  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }

  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>