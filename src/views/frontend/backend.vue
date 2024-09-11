<template>
  <div class="app-search-input">
    <div class="app-search-input-other">
      <slot name="before"></slot>
    </div>
    <div class="app-search-input-main">
      <div class="app-search-input-content">
        <app-icon class="el-icon-search"/>
        <input v-bind="$attrs"
               class="app-search-input_input"
               type="search"
               @keypress="search"
               @focus="inputFocus = true"
               @blur="inputFocus=false"
               @input="value = $event.target.value"
               :value="value"/>
        <i class="el-icon-circle-close" v-show="value" @click="value = ''"/>
        <div class="app-search-input-separator"/>
        <app-button class="app-search-button" :borderRadius="0.2" type="primary"  @click="search">搜索</app-button>
      </div>
      <transition name="app-search-input-history">
        <div class="app-search-input-history" v-show="inputFocus && searchHistoryList.length">
          <div class="app-search-input-history-title">
            <div style="display: inherit">
              <app-icon class="material-icons" v-cloak>history</app-icon>
              <span class="app-search-input-history-title-text">历史搜索</span>
            </div>
            <div style="display: inherit" @click="clearHistory">
              <app-icon class="el-icon-delete"/>
              <span class="app-search-input-history-title-text">清空</span>
            </div>
          </div>
          <li class="app-search-input-history-item"
              @click="itemClick(item)"
              :key="item.value"
              v-for="item in searchHistoryList">
            <app-icon class="el-icon-search"/>
            <span>{{item.value}}</span>
          </li>
        </div>
      </transition>
    </div>
    <div class="app-search-input-other">
      <slot name="after"></slot>
    </div>
  </div>
</template>
 
<!-- <script>
export default {
  name: "appSearchInput",
  props:{
    //默认值
    defaultValue:{
      type: String | Number,
      default: null
    },
    // 搜索历史最大缓存数量
    maxCacheLength:{
      type: Number,
      default:6
    }
  },
  data(){
    return{
      cacheKey:`app-input-search-history${window.location.href}`,
      searchHistoryList:this.$ls.get(this.cacheKey)||[],
      inputFocus:false,
      value:null
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.value = this.defaultValue;
    },
    search(){
      this.$emit('search',this.value)
      this.saveSearchHistory()
    },
    saveSearchHistory(){
      if(!this.value){
        return
      }
      if(this.searchHistoryList.some(v=>v.value == this.value)){
        this.searchHistoryList.splice(this.searchHistoryList.findIndex(v=>v.value == this.value),1)
      }
      this.searchHistoryList.unshift({value : this.value})
      if (this.searchHistoryList.length > this.maxCacheLength) {
        this.searchHistoryList.pop()
      }
      this.$ls.set(this.cacheKey, this.searchHistoryList)
    },
    itemClick(item){
      this.value = item.value
      this.$emit('itemClick',item)
      this.search()
    },
    clearHistory(){
      this.$ls.remove(this.cacheKey)
      this.searchHistoryList=[]
    },
  },
  watch:{
    defaultValue:{
      handle(v){
        this.value = v
      },
    }
  }
}
</script> -->
 
<style scoped>
  .app-search-input{
    display: inline-flex;
    position: relative;
    padding:0.2rem;
    width: calc(100% - 0.4rem);
  }
 
  .app-search-input-content{
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    color: #868686;
    border: 0.025rem solid var(--theme-color);
    border-radius:0.2rem;
    height:0.7rem;
    padding:0 0.1rem;
  }
  .app-search-input_input{
    font-size:0.4rem;
    border:0;
    background:none;
  }
  .app-search-input-history{
    position:absolute;
    z-index:1;
    width:calc(100% - 0.2rem);
    background-color: #fdfdfd;
    color: #868686;
    border-radius: 0.2rem;
    box-shadow: 0 0.15rem 0.3rem  0.1rem var(--border-color);
    font-size:0.29rem;
    padding:0.1rem;
    /*transition: height .3s ease-out;*/
    /*border : 0.03rem solid var(--border-color);*/
  }
  .app-search-input-history > li{
    /*padding:0 0.2rem 0 0.1rem;*/
    display:flex;
    align-items:center;
    min-height:0.65rem;
    border-bottom: 0.025rem solid var(--border-color);
    word-break: break-all;
    font-size:0.34rem;
  }
 
  /*.app-search-input-history > li:last-child{*/
  /*  border-bottom:none;*/
  /*}*/
 
  .app-search-input-history-item:active{
    background-color: var(--theme-color);
    color: white;
    border-radius: 0.2rem;
  }
  .app-search-input-history-item .el-icon-search{
    padding-right:0.1rem;
    padding-left:0.05rem;
    font-size:0.4rem;
  }
  .app-search-input-content .el-icon-circle-close{
    font-size:0.35rem;
  }
  .app-search-input_input{
    font-size:0.3rem;
    flex: 1;
    /*让flex分配宽度*/
    width: 0;
  }
  .app-search-button-content{
    padding: 0 0.1rem;
  }
 
  .app-search-input-main{
    position: relative;
    flex:1;
  }
  .app-search-button{
    color: #3F310C;
  }
  .app-search-input-other{
    display:inline-flex;
    align-items: center;
    justify-content: center;
    padding:0 0.1rem;
  }
  .app-search-input-content .el-icon-search{
    padding:0 0.1rem;
    font-size:0.4rem;
  }
  .app-search-input-history-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size:0.32rem;
    color: #5A5C5B;
    padding:0.05rem 0.1rem 0.05rem 0;
  }
 
  .app-search-input-history-title .app-icon{
    font-size:0.45rem;
    padding-right: 0.05rem;
  }
  .app-search-input-history-title .el-icon-delete{
    font-size:0.4rem;
  }
 
  .app-search-input-history-enter-active,.app-search-input-history-leave-active {
    transition: all 0.3s ease;
  }
 
  .app-search-input-history-enter, .app-search-input-history-leave-to {
    opacity: 0;
    transform: translate3d(0,-0.75rem,0);
  }
 
  .app-search-input-history-enter-to, .app-search-input-history-leave {
    opacity:1;
    transform: translate3d(0,0,0);
  }
 
  .app-search-input-separator{
    height: 65%;
    width: 1px;
    background-color: #868686;
    margin:0 0.1rem;
  }
 
  .app-search-input_input::-webkit-search-cancel-button{
    -webkit-appearance: none;
  }
 
  .app-search-input-history-title-text{
    line-height: 1;
    display: flex;
    align-items: center
  }
</style>