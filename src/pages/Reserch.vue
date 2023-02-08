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
          <input type="text" placeholder="Любой" class="bigInput" v-model="typeBus">
        </div>
        <div class="line"></div>
        <div class="from">
          <p>Цена, $</p>
          <div class="price">
            <input type="text" placeholder="ОТ" class="bigInputfrom" v-model="coastFrom">
            <input type="text" placeholder="до" class="bigInputto" v-model="coastTo">
          </div>
        </div>
        <div class="line"></div>
        <div class="from">
          <p>Дата</p>
          <input type="date" placeholder="Любой" class="bigInput" v-model="date">
        </div>
        <div class="remove">
          <img src="../assets/trash-can.png" alt="" id="trashcan">
          Очистить фильтр
        </div>
      </div>
      <div class="resaults">
        <p id="from"></p>

        
        <input type="button" value="ckick" @click="fetch">
      </div>
    </div>
</template>

<script setup>
import {onMounted, ref, watchEffect } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../main'

let H1from

let from = ref('Минск'), to = ref('Москва'), typeBus= ref(''),coastFrom= ref(''),coastTo= ref(''),date= ref('')
let res = {}


onMounted(() => {
  H1from = document.querySelector('#from')
})
async function fetch(){
  const docRef = doc(db, "bus's trips", "1");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    H1from.innerHTML = `№: ${docSnap.data().trip}
    Откуда: ${docSnap.data().from}
    Куда: ${docSnap.data().to}
    Тип автобуса: ${docSnap.data().type}
    Цена: ${docSnap.data().price}
    Дата: ${new Date(docSnap.data().date.toDate()).getDate()}.${new Date(docSnap.data().date.toDate()).getMonth()}.${new Date(docSnap.data().date.toDate()).getFullYear()} 
    Водитель: ${docSnap.data().driver} 
    `
  } else {
    console.log("No such document!");
  }
}
function search(){
  res.from = from.value
  res.to = to.value
  res.typeBus = typeBus.value
  res.coastFrom = coastFrom.value
  res.coastTo = coastTo.value
  res.date = date.value
  console.log(res)
  fetch()
}
watchEffect(
  () => {search()}
)

</script>

<style> 
.search{
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: row;
}
.params{
  width: 20%;
  height: 100%;
  /* border: 1px solid; */
  display: flex;
  flex-direction: column;
  align-items:center;
}
.resaults{
  height: 100%;
  width: 85%;
  border-left: 1px solid;
}
.bigInput{
  width: 100%;
  height: 20%;
}
.from, .to{
  width: 80%;
  height: 15%;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
}
.line{
  width: 80%;
  border-top:1px solid;
  margin: auto;
}
.bigInputfrom, .bigInputto{
  width: 45%;
  height: 35%;
}
.price{
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: space-between;
}

#trashcan{
  width: 5%;
  margin-right: 2%;
}
.remove{
  margin-bottom: 5%;
  width: 80%;
  display: flex;
  align-items:flex-start;
}
.remove:hover{
  color:black;
}
</style>