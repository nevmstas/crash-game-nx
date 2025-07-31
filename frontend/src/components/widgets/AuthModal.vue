<template>
    <BaseModal :open="open" @close="$emit('close')">
        <h2 class="text-xl font-bold mb-4 text-center">{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
        <AuthForm :mode="mode" @success="onSuccess" @toggle="toggleMode" />
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import AuthForm from '../widgets/AuthForm.vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['close', 'success']);

const mode = ref<'login' | 'register'>('login');

function toggleMode() {
    mode.value = mode.value === 'login' ? 'register' : 'login';
}

function onSuccess() {
    emit('success');
    emit('close');
}
</script>