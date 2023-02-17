<template>
    <nav class="flex items-center justify-between">
      <h1 class="text-2xl">Firebase Vuex Auth</h1>
  
      <!-- for all users
      <div class="">
        <router-link to="/">Home</router-link>
      </div> -->
  
      <!-- for logged in users -->
      <div class="flex space-x-4">
        <button>Logout</button>
      </div>
  
      <!-- for logged out users -->
      <div class="flex space-x-4">
        <router-link to="/signup">Signup</router-link>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
  
  }
  </script>