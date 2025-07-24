<template>
    <GameContainer>
        <div class="flex flex-col items-center justify-center">
            <Multipier :multiplier-num="multiplier" />

            <div class="flex my-4 space-x-4 items-end">
                <BaseInput v-model="amount" label="Bet Amount" :min="1" :max="1000" placeholder="Enter bet amount"
                    :error="error" />
                <Button @click="handleBet" variant="primary">
                    Bet (Next round)
                </Button>
            </div>

            <div class="flex space-x-4">
                <Button @click="cashOut" variant="secondary" :disabled="!playing">
                    Cash Out <span class="mr-1">💰</span>
                </Button>
            </div>

            <div v-if="crashed" class="mt-6 text-red-500 text-xl">💣 Crashed at {{ crashPoint }}x</div>
            <div v-if="cashedOut" class="mt-6 text-green-300 text-xl">✅ Cashed out at {{ multiplier }}x</div>
        </div>
    </GameContainer>
</template>


<script setup lang="ts">
import GameContainer from '../common/GameContainer.vue'
import Button from '../common/Button.vue'
import Multipier from '../common/Multiplier.vue'
import { onMounted, ref, onUnmounted } from 'vue'
import BaseInput from '../common/BaseInput.vue'

const multiplier = ref(1.0)
let timer: NodeJS.Timer | undefined = undefined

const amount = ref<number | null>(null)
const error = ref('')

const playing = ref(false) // true if user has an active bet
const crashed = ref(false)
const cashedOut = ref(false)
const crashPoint = ref(0)

function startMultiplierLoop() {
    resetRound()
    crashPoint.value = +(Math.random() * 4 + 1).toFixed(2) // crash at 1.00x – 5.00x
    multiplier.value = 1.00
    timer = setInterval(() => {
        multiplier.value = +(multiplier.value + 0.01).toFixed(2)
        if (multiplier.value >= crashPoint.value) {
            clearInterval(timer)
            crashed.value = true
            if (playing.value) {
                // User loses if they haven't cashed out
                playing.value = false
            }
            setTimeout(() => {
                startMultiplierLoop()
            }, 2000) // short pause before next round
        }
    }, 100)
}

function resetRound() {
    crashed.value = false
    cashedOut.value = false
    playing.value = false
    error.value = ''
}

function handleBet() {
    if (playing.value) return
    if (!amount.value || amount.value < 1 || amount.value > 1000) {
        error.value = 'Enter a valid bet amount (1-1000)'
        return
    }
    error.value = ''
    playing.value = true
    cashedOut.value = false
}

function cashOut() {
    if (!playing.value || crashed.value) return
    clearInterval(timer)
    cashedOut.value = true
    playing.value = false
    // Wait a moment, then start next round
    setTimeout(() => {
        startMultiplierLoop()
    }, 2000)
}

onMounted(() => {
    startMultiplierLoop()
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>
