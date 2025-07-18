<template>
    <div class="w-full">
        <label v-if="label" class="block text-sm font-medium mb-1 text-white">
            {{ label }}
        </label>

        <input :value="modelValue" @input="updateValue($event)" type="number" :disabled="disabled" :min="min" :max="max"
            class="w-full min-w-50 h-10 bg-gray-800/50 border rounded-lg px-3 py-2 text-white
               focus:outline-none focus:ring-2 focus:ring-purple-500
               transition disabled:opacity-50 disabled:cursor-not-allowed
               border-purple-500/30" :class="{ 'border-red-500 ring-red-500 ring-2': error }"
            :placeholder="placeholder" />

        <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
    modelValue: number | null
    label?: string
    error?: string
    disabled?: boolean
    min?: number
    max?: number
    placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

function updateValue(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.valueAsNumber)
}
</script>