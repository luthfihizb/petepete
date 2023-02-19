<template>
  <input
    :type="type || 'text'"
    :name="props.name"
    :placeholder="props.placeholder"
    :value="props.modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="
      `bg-gray-100/40 w-full rounded-md border-gray-500 border-[1px] px-4 py-2 placeholder:font-normal focus:outline outline-offset-2 outline-green-900 ` +
      props.class
    "
  />
</template>

<script setup>
const props = defineProps({
  name: String,
  placeholder: String,
  modelValue: String,
  class: String,
  type: String,
});

const emits = defineEmits(["update:modelValue"]);
</script>
