<template>
    <header class="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <div
                    class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold">C</span>
                </div>
                <h1
                    class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    NX Crash Game
                </h1>
            </div>

            <div class="flex items-center space-x-2">
                <template v-if="me.data?.value?.username">
                    <span class="font-semibold text-white">{{ me.data?.value?.username }}</span>
                    <button @click="logout()"
                        class="px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800 transition cursor-pointer">
                        Logout
                    </button>
                </template>
                <template v-else>
                    <Button variant="primary" @click="showAuth('login')">Login</button>
                    <Button variant="secondary" @click="showAuth('register')">Register</button>
                </template>
            </div>
        </div>
    </header>
    <AuthModal :open="modalOpen" @close="modalOpen = false" :mode="modalMode" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../../../composables/useAuth';
import AuthModal from './AuthModal.vue'
import Button from '../common/Button.vue'

const { me, logout } = useAuth();

const modalOpen = ref(false);
const modalMode = ref<'login' | 'register'>('login');

function showAuth(mode: 'login' | 'register') {
    modalMode.value = mode;
    modalOpen.value = true;
}

</script>