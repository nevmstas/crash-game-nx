<template>
    <form @submit.prevent="onSubmit">
        <BaseInput v-model="email" type="email" placeholder="Email" class="input mb-2 w-full" required />
        <BaseInput v-if="mode === 'register'" v-model="username" type="text" placeholder="Username"
            class="input mb-2 w-full" required />
        <BaseInput v-model="password" type="password" placeholder="Password" class="input mb-4 w-full" required />
        <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>
        <Button variant="primary" type="submit" :disabled="loading">
            <span v-if="loading">...</span>
            <span v-else>{{ mode === 'login' ? 'Login' : 'Register' }}</span>
        </Button>
        <div class="mt-4 text-center">
            <Button variant="secondary" type="button" @click="$emit('toggle')">
                {{ mode === 'login' ? 'No account? Register' : 'Have an account? Login' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useAuth } from '../../composables/useAuth';
import BaseInput from '../ui/BaseInput.vue';
import Button from '../ui/Button.vue';

const props = defineProps<{ mode: 'login' | 'register' }>();
const emit = defineEmits(['success', 'toggle']);

const email = ref('');
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const { login, register } = useAuth();

watch(() => props.mode, () => {
    email.value = '';
    username.value = '';
    password.value = '';
    error.value = '';
});

async function onSubmit() {
    error.value = '';
    loading.value = true;
    try {
        if (props.mode === 'login') {
            await login.mutateAsync({ email: email.value, password: password.value });
        } else {
            await register.mutateAsync({
                email: email.value,
                username: username.value,
                password: password.value,
            });
        }
        emit('success');
    } catch (e: any) {
        error.value = e?.message || 'Auth failed';
    } finally {
        loading.value = false;
    }
}
</script>