<template>
  <div class="TabMenu">
    <div class="tabs">
      <h1 class="title">Личный кабинет</h1>
      <button class="tablink" @click="openPage('Home')" id="defaultOpen">Личная информация</button>
      <button class="tablink" @click="openPage('News')" >Мои поездки</button>
      <button class="tablink" @click="openPage('Contact')">Contact</button>
      <button class="tablink" @click="openPage('About')">About</button>
    </div>
    <div class="content">
      <div id="Home" class="tabcontent">
        
        <button @click="handleSubmit">Выйти</button>
      </div>
      <div id="News" class="tabcontent">
        <h3>News</h3>
        <p>Some news this fine day!</p>
      </div>

      <div id="Contact" class="tabcontent">
        <h3>Contact</h3>
        <p>Get in touch, or swing by for a cup of coffee.</p>
      </div>

      <div id="About" class="tabcontent">
        <h3>About</h3>
        <p>Who we are and what we do.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => { document.getElementById("defaultOpen").click(); })

const error = ref(null)

const store = useStore()
const router = useRouter()


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
  document.getElementById(pageName).style.display = "block";
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
.title{
  margin-right: 5%;
}
.TabMenu {
  display: flex;
  height: 100%;
}
.tabs {
  display: flex;
  flex-direction: column;
  width: 15%;
  height: 100%;
}

.content {
  width: 85%;
  height: 90%;
  margin-top: 5%;
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
  width: 90%;
}
.tablink:nth-child(2){
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.tablink:last-child{
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.tablink:not(:last-child){
  margin-bottom: 1%;
}
.tablink:hover {
  background-color: #9c9c9c;
}

/* Style the tab content (and add height:100% for full page content) */
.tabcontent {
  color: black;
  display: none;
  /* padding: 100px 20px; */
  height: 100%;
}
</style>