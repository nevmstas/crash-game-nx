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
                <button @click="handleLogin"
                    class="px-4 py-2 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600 transition cursor-pointer">Login</button>
                <button @click="handleRegister"
                    class="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition cursor-pointer">Register</button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
function handleLogin() {
    console.log('Login clicked')
    alert('Mock login logic')
}
function handleRegister() {
    console.log('Register clicked')
    alert('Mock register logic')
}
</script>