<template>
    <button :class="[
        'w-full py-2 px-4 h-10 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variantClass
    ]" @click="handleClick">
        <slot />
    </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    variant?: 'primary' | 'secondary'
}>()

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
    emit('click', event)
}

const variantClass = computed(() => {
    switch (props.variant) {
        case 'secondary':
            return 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400'
        case 'primary':
            return 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
        default:
            return 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
    }
})
</script>

<style scoped>
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>