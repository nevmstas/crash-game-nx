<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <MainHeader />
        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import MainHeader from '../components/layout/MainHeader.vue'
</script>