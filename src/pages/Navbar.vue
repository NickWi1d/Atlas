<template>
  <div class="main">
      <Login v-if="auth.currentUser == null"/>
      <PersonalAccount v-else/>
  </div>
</template>
  
<script setup>
import { auth } from '../main'
import Login from '../pages/Login.vue'
import PersonalAccount from '../pages/PersonalAccount.vue'

</script>

<style>
.main{
  height: 95%;
}
</style>