<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from './components/common/MainHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
    <MainHeader />
    <RouterView />
  </div>
</template>
