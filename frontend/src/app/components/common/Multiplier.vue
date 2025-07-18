<template>
    <div class="text-6xl font-mono text-green-400 mb-6">
        {{ multiplierNum }}x
    </div>
</template>

<script lang="ts" setup>
const { multiplierNum } = defineProps<{
    multiplierNum: number
}>()

</script>