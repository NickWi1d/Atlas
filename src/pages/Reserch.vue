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
      <div class="resaultsContent"></div>
    </div>
    <div id="snackbar"></div>
  </div>
</template>

<script setup>

import { onMounted, ref, watchEffect } from "vue";
import { db, auth } from '../main'
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

let resaults, currentDate = new Date(), currentDay, currentMounth, res = {}
String(currentDate.getDate()).length > 1 ? currentDay = currentDate.getDate() : currentDay = `0${currentDate.getDate()}`
String(currentDate.getMonth()).length > 1 ? currentMounth = currentDate.getMonth() : currentMounth = `0${currentDate.getMonth() + 1}`
let from = ref(), to = ref(), type = ref(), coastFrom = ref(), coastTo = ref(), date = ref(`${currentDate.getFullYear()}-${currentMounth}-${currentDay}`)

onMounted(() => {
  resaults = document.querySelector('.resaultsContent')
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

function notification(id, time, message) {
  let x = document.getElementById(id);
  x.innerText = message
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, time);
}




async function AddInfoIntoUserData(userId, documentId, date, driver, from, price, time, to, trip, type, unarmored, amountOfTrips) {
  await setDoc(doc(db, userId, documentId), {
    date: date,
    driver: driver,
    from: from,
    price: price,
    time: time,
    to: to,
    trip: trip,
    type: type,
    unarmored: unarmored
  })
  let listOfUsers = []
  let listOfTrips = []
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docum) => {
    if (docum.id != 'admin') {
      listOfUsers.push(`User: ${docum.id}`)
    }
  })
  listOfUsers.push(`bus's trips`)
  for (let val in listOfUsers) {
    const specialQuery = query(collection(db, listOfUsers[val]));
    const specialQuerySnapshot = await getDocs(specialQuery);
    specialQuerySnapshot.forEach((docum) => {
      if (docum.id == documentId) {
        listOfTrips.push(listOfUsers[val])
      }
    })
  }
  console.log(`Список все пользователей: ${listOfUsers}`)
  console.log(`Список все пользователей с документом '1': ${listOfTrips}`)
  for (let value in listOfTrips) {
    if (listOfTrips[value] != `bus's trips`) {
      await setDoc(doc(db, listOfTrips[value], documentId), {
        date: date,
        driver: driver,
        from: from,
        price: price,
        time: time,
        to: to,
        trip: trip,
        type: type,
        unarmored: unarmored - amountOfTrips,
        person: amountOfTrips
      })
    } else {
      await setDoc(doc(db, listOfTrips[value], documentId), {
        date: date,
        driver: driver,
        from: from,
        price: price,
        time: time,
        to: to,
        trip: trip,
        type: type,
        unarmored: unarmored - amountOfTrips
      })
    }

  }
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

  if (querySnapshot._snapshot.docChanges.length == 0) {
    let h1 = document.createElement('h1')
    h1.innerHTML = "По данному запросу не ничего не найдено, пожалуйста измените запрос"
    resaults.append(h1)
  } else {
    querySnapshot.forEach((doc) => {
      if (doc.data().unarmored > 0) {
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

        let unarmoredVrap = document.createElement('div')
        unarmoredVrap.className = 'unarmoredVrap'
        let unarmored = document.createElement('h1')
        unarmored.innerHTML = `Мест свободно: ${doc.data().unarmored}`
        unarmoredVrap.append(unarmored)
        div.append(unarmoredVrap)

        let orderVrap = document.createElement('div')
        orderVrap.className = 'orderVrap'
        let order = document.createElement('input')
        order.className = 'order'
        order.type = 'button'
        order.value = 'Добавить'
        order.onclick = function () {
          if (Number(counter.value) > 0 && Number(counter.value) <= doc.data().unarmored && doc.data().unarmored > 0) {
            const user = auth.currentUser;
            AddInfoIntoUserData(`User: ${user.uid}`, doc.id, doc.data().date, doc.data().driver, doc.data().from, doc.data().price, doc.data().time, doc.data().to, doc.data().trip, doc.data().type, doc.data().unarmored, Number(counter.value))
            notification('snackbar', 3000, 'Поездка успешно добавлена')
            //потом заменить на отслеживание изменения даных в фаербасе
            setTimeout(() => {
              deleteItems()
              search()
            }, 1000);
          } else {
            notification('snackbar', 3000, 'Нельзя добавить такое кол-во поездок')
          }
        }
        orderVrap.append(order)
        div.append(orderVrap)

        let counterVrap = document.createElement('div')
        counterVrap.className = 'counterVrap'

        let decreaseCount = document.createElement('input')
        decreaseCount.className = 'decreaseCount'
        decreaseCount.type = 'button'
        decreaseCount.value = '-'
        decreaseCount.onclick = function () {
          if (Number(counter.value) > 1) {
            counter.value = Number(counter.value) - 1
          } else {
            notification('snackbar', 3000, 'Минимальное кол-во поездок для покупки: 1')
          }
        }
        counterVrap.append(decreaseCount)

        let counter = document.createElement('input')
        counter.className = 'counter'
        counter.type = 'number'
        counter.value = 1
        counterVrap.append(counter)

        let increaseCount = document.createElement('input')
        increaseCount.className = 'increaseCount'
        increaseCount.type = 'button'
        increaseCount.value = '+'
        increaseCount.onclick = function () {
          if (Number(counter.value) < doc.data().unarmored) {
            counter.value = Number(counter.value) + 1
          } else {
            notification('snackbar', 3000, `Максимальное кол-во поездок для покупки: ${doc.data().unarmored}`)
          }
        }
        counterVrap.append(increaseCount)

        div.append(counterVrap)


        resaults.append(div)
      }
    })
    resaults.height = `${querySnapshot.length * 140}px`
  }
}


watchEffect(
  () => { search() }
)

</script>

<style> .search {
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
   width: 100%;
 }

 .resaultsContent {
   overflow-y: scroll;
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
   width: 95%;
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

 .dateVrap {
   width: 15%;
 }

 .unarmoredVrap {
   width: 25%;
 }

 .dashVrap {
   width: 2%;
 }

 .timeVrap,
 .priceVrap,
 .fromVrap,
 .toVrap {
   width: 12%;
 }

 /* .fromVrap{
  margin-left: 1px;
 } */

 .counterVrap {
   width: 15%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: space-around;
   margin-right: 1%;
 }

 .counter {
   width: 30%;
   border: 1px solid;
   height: 40%;
   font-size: 200%;
   color: #2c3e50;
   font-family: Avenir, Helvetica, Arial, sans-serif;
   font-weight: bold;
   border-radius: 4px;
   outline: none;
 }

 .decreaseCount {
   width: 20%;
   border: 1px solid;
   height: 40%;
   font-size: 200%;
   color: #2c3e50;
   font-family: Avenir, Helvetica, Arial, sans-serif;
   font-weight: bold;
   border-radius: 4px;
 }

 .increaseCount {
   width: 20%;
   border: 1px solid;
   height: 40%;
   font-size: 200%;
   color: #2c3e50;
   font-family: Avenir, Helvetica, Arial, sans-serif;
   font-weight: bold;
   border-radius: 4px;
 }

 .counter::-webkit-outer-spin-button,
 .counter::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
 }

 .orderVrap {
   height: 80%;
   width: 16%;
   display: flex;
   justify-content: center;
   align-items: center;
 }

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

 #snackbar.show {
   visibility: visible;
   -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
   animation: fadein 0.5s, fadeout 0.5s 2.5s;
 }

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
 }</style>