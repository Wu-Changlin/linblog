<!-- <template>
  <h1>Home Page</h1>
  <p> {{ pageData }} </p>
</template>
<script lang="ts"setup>
import { ref } from 'vue'; 
import axios from 'axios';
 const pageData = ref({});
const load = async () => { 
    console.log('执行请求'); 
    try { const { data } = await axios.get('./data/page.json'); 
    console.log(data); pageData.value = data; 
    } catch (error) { console.error(error); } 
    }load();
</script> -->