<template>
  <div>
    <button
      v-for="item in items"
      :key="item.id"
      :class="{
        'original-red': !item.isSelected,
        'selected': item.isSelected,
        'unselected': !item.isSelected
      }"
      @click="toggleSelection(item.id)"
    >
      {{ item.text }}
    </button>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      items: [
        { id: 1, text: 'Item 1', isSelected: false },
        { id: 2, text: 'Item 2', isSelected: false },
        // ...
      ]
    };
  },
  methods: {
    toggleSelection(id) {
      this.items.forEach(item => {
        if (item.id === id) {
          item.isSelected = !item.isSelected;
        }
      });
    }
  }
};
</script>


<style>
  .original-red {
  color: red;
}
 
.selected {
  color: black; /* 选中时字体颜色 */
  background-color: black; /* 选中时背景色 */
}
 
.unselected {
  color: white; /* 未选中时字体颜色 */
  background-color: white; /* 未选中时背景色 */
}
</style>