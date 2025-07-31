<template>
    <div class="w-full">
        <label v-if="label" class="block text-sm font-medium mb-1 text-white">
            {{ label }}
        </label>

        <div class="relative">
            <input :type="type" :value="modelValue" @input="updateValue" :disabled="disabled"
                :min="type === 'number' ? min : undefined" :max="type === 'number' ? max : undefined"
                :placeholder="placeholder" class="w-full min-w-50 h-10 bg-gray-800/50 border rounded-lg px-3 py-2 text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition disabled:opacity-50 disabled:cursor-not-allowed
                     border-purple-500/30" :class="{ 'border-red-500 ring-red-500 ring-2': error }" />
            <slot name="suffix"></slot>
        </div>

        <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number | null
    label?: string
    error?: string
    disabled?: boolean
    type?: string
    min?: number
    max?: number
    placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

function updateValue(event: Event) {
    const target = event.target as HTMLInputElement
    let value: string | number | null = target.value
    if (props.type === 'number') value = target.valueAsNumber
    emit('update:modelValue', value)
}
</script>