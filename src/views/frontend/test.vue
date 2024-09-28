<template>
  <div style="padding-top: 200px;">
    <h1>Broadcast Channel Example</h1>
    <p>Messages:</p>
    <ul>
      <li v-for="message in messages" :key="message">{{ message }}</li>
    </ul>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
 

    const messages = ref([]);
    let broadcastChannel = null;
 
    const handleMessage = (event) => {
      // messages.value.push(event.data);
      messages.value=event.data;

    };
 
    onMounted(() => {
      broadcastChannel = new BroadcastChannel('my-channel');
      broadcastChannel.onmessage = handleMessage;
    });
 
    onUnmounted(() => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    });
 
   

</script>