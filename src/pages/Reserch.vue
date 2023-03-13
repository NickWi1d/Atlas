<template>
  <div class="search">
    <div class="params">
      <h1>Фильтр</h1>
      <div class="from">
        <p>Отправление из</p>
        <input type="text" placeholder="Любое" class="bigInput" v-model="from">
      </div>
      <div class="line"></div>
      <div class="to">
        <p>Отправление куда</p>
        <input type="text" placeholder="Любое" class="bigInput" v-model="to">
      </div>
      <div class="line"></div>
      <div class="from">
        <p>Тип автобуса</p>
        <input type="text" placeholder="Любой" class="bigInput" v-model="type">
      </div>
      <div class="line"></div>
      <div class="from">
        <p>Цена, $</p>
        <div class="price">
          <input type="number" placeholder="От" class="bigInputfrom" v-model="coastFrom">
          <input type="number" placeholder="до" class="bigInputto" v-model="coastTo">
        </div>
      </div>
      <div class="line"></div>
      <div class="date">
        <p>Дата</p>
        <input type="date" placeholder="Любой" class="bigInput" v-model="date">
      </div>
      <div class="remove" @click="removeFiltr()">
        <img src="../assets/trash-can.png" alt="" id="trashcan">
        Очистить фильтр
      </div>
    </div>
    <div class="resaults">
    </div>
    <div id="snackbar">Поездка успешно добавлена</div>
  </div>
</template>

<script setup>

import { onMounted, ref, watchEffect } from "vue";
import { db, auth } from '../main'
import { doc, setDoc, collection, query, where, getDocs  } from "firebase/firestore";

let resaults, currentDate = new Date(),  currentDay, currentMounth, res = {}
String(currentDate.getDate()).length > 1 ? currentDay = currentDate.getDate() : currentDay = `0${currentDate.getDate()}`
String(currentDate.getMonth()).length > 1 ? currentMounth = currentDate.getMonth() : currentMounth = `0${currentDate.getMonth() + 1}`
let from = ref(), to = ref(), type = ref(), coastFrom = ref(), coastTo = ref(), date = ref(`${currentDate.getFullYear()}-${currentMounth}-${currentDay}`)



onMounted(() => {
  resaults = document.querySelector('.resaults')
  console.log(`${currentDate.getFullYear()}-${currentMounth}-${currentDay}`)
})


function removeFiltr() {
  deleteItems()
  from.value = ''
  to.value = ''
  type.value = ''
  coastTo.value = ''
  coastFrom.value = ''
  date.value = `${currentDate.getFullYear()}-${currentMounth}-${currentDay}`
}
function deleteItems() {
  let deleteElement = resaults.querySelectorAll('div');
  for (let i = 0; i < deleteElement.length; i++) {
    deleteElement[i].remove();
  }
  let deleteElementH1 = resaults.querySelectorAll('h1');
  for (let i = 0; i < deleteElementH1.length; i++) {
    deleteElementH1[i].remove();
  }
}
function search() {
  from.value == '' ? res.from = undefined : res.from = from.value
  to.value == '' ? res.to = undefined : res.to = to.value
  type.value == '' ? res.type = undefined : res.type = type.value
  coastFrom.value == '' ? res.coastFrom = undefined : res.coastFrom = coastFrom.value
  coastTo.value == '' ? res.coastTo = undefined : res.coastTo = coastTo.value
  date.value == '' ? res.date = undefined : res.date = date.value
  console.log(res)
  filtr()
}


async function AddInfoIntoUserData(userId, documentId, date, driver, from, price, time, to, trip, type) {
  await setDoc(doc(db, `User: ${userId}`, documentId), {
    date: date,
    driver: driver,
    from: from,
    price: price,
    time: time,
    to: to,
    trip: trip,
    type: type
  });
}
async function filtr() {
  const queryConstraints = []
  for (let prop in res) {
    if (res[prop] != undefined && prop != 'coastFrom' && prop != 'coastTo') { queryConstraints.push(where(`${prop}`, "==", `${res[prop]}`)) }
    else if (res[prop] != undefined && prop == 'coastFrom') { queryConstraints.push(where(`price`, ">=", Number(res[prop]))) }
    else if (res[prop] != undefined && prop == 'coastTo') { queryConstraints.push(where(`price`, "<=", Number(res[prop]))) }
  }
  console.log(queryConstraints)
  const q = query(collection(db, "bus's trips"), ...queryConstraints);
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot)
  deleteItems()

  if (querySnapshot._snapshot.docChanges.length == 0){
    let h1 = document.createElement('h1')
    h1.innerHTML = "По данному запросу не ничего не найдено, пожалуйста измените запрос"
    resaults.append(h1)
  } else {
    querySnapshot.forEach((doc) => {
      console.log(doc)
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
      order.value = 'Добавить'
      order.onclick = function () {
        const user = auth.currentUser;
        AddInfoIntoUserData(user.uid, doc.id, doc.data().date, doc.data().driver, doc.data().from, doc.data().price, doc.data().time, doc.data().to, doc.data().trip, doc.data().type)
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      }
      orderVrap.append(order)
      div.append(orderVrap)

      resaults.append(div)
    })
  }
}


watchEffect(
  () => { search() }
)

</script>

<style> 

.search {
   width: 100%;
   height: 90%;
   display: flex;
   flex-direction: row;
 }

 .params {
   width: 20%;
   height: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
 }

 .resaults {
   height: 100%;
   width: 85%;
 }

 .bigInput {
   width: 100%;
   height: 20%;
   border: 1px solid #ccc
 }

 .from,
 .to,
 .date {
   width: 80%;
   height: 15%;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   justify-content: space-evenly;
 }

 .from>p {
   padding-top: 10%;
 }

 .line {
   width: 80%;
   border-top: 1px solid;
   margin: auto;
 }

 .bigInputfrom,
 .bigInputto {
   width: 45%;
   height: 30%;
   border: 1px solid #ccc
 }

 .price {
   width: 100%;
   height: 80%;
   display: flex;
   justify-content: space-between;
   align-items: center;
 }

 #trashcan {
   width: 5%;
   margin-right: 2%;
 }

 .remove {
   margin-bottom: 5%;
   width: 80%;
   display: flex;
   align-items: flex-start;
 }

 .remove:hover {
   color: black;
 }


 .resaults {
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
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

 .order {
   width: 80%;
   height: 70%;
   border: none;
   background-color: #2A5FCF;
   border-radius: 20px;
   color: white;
   font-size: large;
 }

 .order:hover {
   background-color: #0d3ca3;
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


 /* The snackbar - position it at the bottom and in the middle of the screen */
 #snackbar {
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
 #snackbar.show {
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