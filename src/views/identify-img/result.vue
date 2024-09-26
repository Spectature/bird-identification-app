<script setup lang="ts">
const route = useRoute();
const imagePath = computed(() => decodeURIComponent(route.params.imagePath as string)); // 获取并解码参数
</script>

<template>
  <img v-if="imagePath" :src="imagePath" alt="Selected" />
</template>

<style scoped lang="less"></style>
