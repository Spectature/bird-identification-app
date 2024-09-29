<script setup lang="ts">
const tabSwitch = (item, index) => {
  console.log(item, index);
  updateValue(index);
};

// 定义组件的 props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue"]);

// 更新值的方法
const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <nut-tabbar @tab-switch="tabSwitch">
    <nut-tabbar-item tab-title="标签" icon="home"></nut-tabbar-item>
    <nut-tabbar-item tab-title="标签" icon="category"> </nut-tabbar-item>
    <nut-tabbar-item tab-title="标签" icon="find"></nut-tabbar-item>
    <nut-tabbar-item tab-title="标签" icon="cart"></nut-tabbar-item>
    <nut-tabbar-item tab-title="标签" icon="my"></nut-tabbar-item>
  </nut-tabbar>
</template>

<style scoped></style>
