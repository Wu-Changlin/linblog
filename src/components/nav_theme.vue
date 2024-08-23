<template>
    <div v-if="theme==='dark'"   @click="setTheme('light')">
        <svg-icon class="svg-icon"  icon-class="dark"/>
    </div>

    <div v-else @click="setTheme('dark')">
        <svg-icon class="svg-icon"  icon-class="light" />
    </div>

        
       
</template>

<script setup>
import useTheme from '@/hooks/useTheme'

const {theme} = useTheme();

//切换主题

function setTheme(data){
        theme.value = data
}

</script>