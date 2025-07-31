<template>
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="handleBackdropClick">
        <div ref="modalRef" class="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 w-full max-w-sm relative" @click.stop>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ open: boolean }>();
const emit = defineEmits(['close']);

const modalRef = ref<HTMLElement | null>(null);

const handleBackdropClick = () => {
    emit('close');
};
</script>