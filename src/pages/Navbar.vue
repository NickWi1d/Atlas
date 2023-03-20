<template>
  <div class="perAcc">
      <Login v-if="currentUser == null"/>
      <PersonalAccount v-else />
  </div>
</template>
  
<script setup>
// import { auth } from '@/main'
import Login from '../pages/Login.vue'
import PersonalAccount from '../pages/PersonalAccount.vue'
import { onBeforeMount, ref } from 'vue';


let currentUser = ref()
onBeforeMount(()=>{
  currentUser.value = JSON.parse(localStorage.getItem('currentUser'))
})
</script>

<style>
.perAcc{
  height: 90%;
}
</style>