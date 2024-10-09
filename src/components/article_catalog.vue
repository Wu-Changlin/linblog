<template>

    <div class="side-bar-catalog">
        <div class="catalog-card" v-if="Object.keys(tocArray).length > 0">
            <div class="catalog-card-header">
                <!-- <div style="display: flex;align-items: center; justify-content: center; "> -->
                <!-- <svg-icon icon-class="catalog" /> -->
                <span>目录</span>
                <!-- </div> -->
                <span class="progress">{{ progress }}</span>
            </div>

            <div class="catalog-content">
                <div v-for="title in tocArray" :key="title.id" @click="scrollToView(title.scrollTop,title.id)" :class="[
                        'catalog-item',
                        currentTitle.id == title.id ? 'active' : 'not-active',
                    ]" :style="{ marginLeft: title.level * 20 + 'px' }" v-show="title.isVisible"
                    :title="title.rawName">
                    {{ title.rawName }}
                </div>
            </div>
        </div>
        <div v-else>没有目录</div>
    </div>

</template>

<script setup>
    import { reactive, ref, nextTick, onMounted, onUnmounted } from "vue";



    const props = defineProps({
        containerName: {
            type: String,
            default: ".article-content",
        },

    });



    //获取目录
    const tocArray = ref([]);
    // let titles = reactive(getTitles());
    // let currentTitle = reactive({});
    // let progress = ref(0);
    const currentTitle = reactive({});
    const progress = ref(0);


    const  firstValue=ref();
    

    getTitles();
    // 获取目录的标题
    function getTitles() {

        nextTick(() => {
            let titles = [];
            let levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            let articleElement = document.querySelector(props.containerName);
            if (!articleElement) {
                return titles;
            }


            let elements = Array.from(articleElement.querySelectorAll("*"));

            // 调整标签等级
            let tagNames = new Set(
                elements.map((el) => el.tagName.toLowerCase())
            );
            for (let i = levels.length - 1; i >= 0; i--) {
                if (!tagNames.has(levels[i])) {
                    levels.splice(i, 1);
                }
            }

            let serialNumbers = levels.map(() => 0);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                let tagName = element.tagName.toLowerCase();
                let level = levels.indexOf(tagName);
                if (level == -1) continue;

                let id = tagName + "-" + element.innerText + "-" + i;
                let node = {
                    id,
                    level,
                    parent: null,
                    children: [],
                    rawName: element.innerText,
                    scrollTop: element.offsetTop,
                };

                if (tocArray.value.length > 0) {//目录数组长度大于0
                    let lastNode = tocArray.value.at(-1);

                    // 遇到子标题
                    if (lastNode.level < node.level) {
                        node.parent = lastNode;
                        lastNode.children.push(node);
                    }
                    // 遇到上一级标题
                    else if (lastNode.level > node.level) {
                        serialNumbers.fill(0, level + 1);
                        let parent = lastNode.parent;
                        while (parent) {
                            if (parent.level < node.level) {
                                parent.children.push(node);
                                node.parent = parent;
                                break;
                            }
                            parent = parent.parent;
                        }
                    }
                    // 遇到平级
                    else if (lastNode.parent) {
                        node.parent = lastNode.parent;
                        lastNode.parent.children.push(node);
                    }
                }


                serialNumbers[level] += 1;
                let serialNumber = serialNumbers.slice(0, level + 1).join(".");

                node.isVisible = node.parent == null;
                // node.isVisible =  null;
                // console.log('titles.length,',JSON.stringify(node));

                node.name = serialNumber + ". " + element.innerText;
                tocArray.value.push(node);//循环每一条目录加入目录数组
            }

            //如果tocArray.value对象有值，那么获取序号为0的值
            if (Object.keys(tocArray.value).length) {
    
    firstValue.value = Object.values(tocArray.value)[0];
  }

            // console.log('tocArray:',JSON.stringify(tocArray.value))
            //  return titles;  
        })

        
    }






   //获取元素的height margin-top padding margin-bottom
    function getElementHeightWithMargin(element) {
        if (element) {
            var style = window.getComputedStyle(element);
            return (
                parseFloat(style.height) +
                parseFloat(style.marginTop) +
                parseFloat(style.padding) +
                parseFloat(style.marginBottom)
            );
            // 其他操作
        } else {
            console.error('Element does not exist.');
        }

    }


    //多余占用滚动高度
    const total_occupy_scroll_height=ref(0);
    //总滚动高度=可滚动高度-多余占用滚动高度
    const total_scroll_height = ref(0);
    //计算减去多余占位高度的总滚动距离长度
    function surplusHeight() {
        let articleElement = document.querySelector(props.containerName);
        //标题占用高度
        let articleTitleElement = document.querySelector('.article-title');
        let title_height = getElementHeightWithMargin(articleTitleElement);
        //元数据占用高度
        let articleMetadataElement = document.querySelector('.article-metadata');
        let metadata_height = getElementHeightWithMargin(articleMetadataElement);
        //多余占用高度=标题占用高度+元数据占用高度+导航栏高度
        let surplus_height = title_height + metadata_height + 72;
        total_occupy_scroll_height.value=surplus_height;//滚动到指定的位置需减去多余占用高度=标题占用高度+元数据占用高度+导航栏高度
        total_scroll_height.value = articleElement.scrollHeight - surplus_height;
        // console.log(`surplus_height:${surplus_height},articleElement.scrollHeight:${articleElement.scrollHeight},total_scroll_height:${total_scroll_height.value},window.scrollY:${window.scrollY}`)

    }


    // 监听滚动事件并更新样式
    function watchScrollUpdateStyle() {
        // 使用Math.ceil()函数进行向上取整。该函数会将小数直接进位，返回最接近且大于等于原数的整数。
        progress.value = Math.ceil ((window.scrollY / total_scroll_height.value) *100);
        progress.value>100 ? progress.value= "100%":progress.value=progress.value+"%";
        // console.log('window.scrollY:', window.scrollY);

        // console.log('window.scrollY / total_scroll_height.value ',window.scrollY,'/',total_scroll_height.value);
        let visibleTitles = [];

        for (let i = tocArray.value.length - 1; i >= 0; i--) {
            const title = tocArray.value[i];

            if (title.scrollTop <= window.scrollY) {
                
                if (currentTitle.id === title.id) return;

                Object.assign(currentTitle, title);

                // 展开节点
                setChildrenVisible(title, true);
                visibleTitles.push(title);

                // 展开父节点
                let parent = title.parent;
                while (parent) {
                    setChildrenVisible(parent, true);
                    visibleTitles.push(parent);
                    parent = parent.parent;
                }

                // 折叠其余节点
                for (const t of tocArray.value) {
                    if (!visibleTitles.includes(t)) {
                        setChildrenVisible(t, false);
                    }
                }

                return;
            }
        }
    }



    // 设置子节点的可见性
    function setChildrenVisible(title, isVisible) {
        for (const child of title.children) {
            child.isVisible = isVisible;
        }
    }


    //已选中目录标题
    const current_title_id=ref('');
    // 滚动到指定的位置
    function scrollToView(scroll_top_to,title_id) {
        current_title_id.value=title_id;
        
        //获取滚动条位置(可以理解为当前高度)
        let current_height=0;
        current_height=document.documentElement.scrollTop || window.pageYOffset ||document.body.scrollTop; //兼容写法 
         // 使用Math.ceil()函数进行向上取整。该函数会将小数直接进位，返回最接近且大于等于原数的整数。
         // current_height+72  头部导航栏占用高度导致滚动目的位置出现遮盖，所以需减去头部导航栏的高度72。
         let current_height_add_nav_height=Math.ceil(current_height+72);
         if(Math.ceil(current_height_add_nav_height)==scroll_top_to)return;//重复点击无效（滚动条位置等于目录标题的目的位置），直接返回
        // console.log('current_height:',current_height,',scroll_top_to:',scroll_top_to)
       
        // HACK 滚动到指定的位置需减去多余占用高度=标题占用高度+元数据占用高度+导航栏高度(初始化)
        //实际滚动方向高度
        let  reality_scroll_top=scroll_top_to-total_occupy_scroll_height.value;
        if(current_height>reality_scroll_top){
            // HACK 向上滚动 因为向上滚动有头部导航栏占用高度导致滚动目的位置出现遮盖，所以需减去头部导航栏的高度72。
            // HACK‌ 第一个目录标题的目的位置初始化后实际为1px,出现头部导航栏占用高度导致滚动目的位置出现遮盖，所以需减去头部导航栏的高度72。
            // HACK‌ 总结凡实际高度小于头部导航栏的高度72，都需要减去头部导航栏占用高度防止出现遮盖。
            if(reality_scroll_top<=72){
                scroll_top_to=scroll_top_to-72; 
                // console.log('上滚动-scroll_top_to-=72:',scroll_top_to)
            }
            
        }else{
            // HACK 滚动到指定的位置减去多余占用高度(初始化) 
            // HACK‌ 第一个目录标题的目的位置初始化后实际为1px,出现头部导航栏占用高度导致滚动目的位置出现遮盖，所以需减去头部导航栏的高度72。
            // HACK‌ 总结凡实际高度小于头部导航栏的高度72，都需要减去头部导航栏占用高度防止出现遮盖。
            if(reality_scroll_top<=72){
                scroll_top_to=scroll_top_to-72; 
                // console.log('下滚动-scroll_top_to-=72:',scroll_top_to)
            }
        
            
        }

        current_height=0;
        window.scrollTo({ top: scroll_top_to, behavior: "smooth" });
    }



    onMounted(() => {
        nextTick(() => {
            surplusHeight();
        })

        window.addEventListener("scroll", watchScrollUpdateStyle);


    })


    onUnmounted(() => {
        window.removeEventListener('scroll', watchScrollUpdateStyle)
    })//离开页面时移除监听窗口滚动


</script>

<style scoped>
    .side-bar-catalog {
        height: calc(100vh - 72px);
        overflow-y: scroll;
        background-color: var(--bg);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        /* padding-top: 16px; */
        margin-top: 72px;
        position: fixed;
        overflow: visible;
   

        /* 移动端右侧遮罩目录 */
        @media screen and (max-width: 959px) {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            width: 280px;
            height: 100%;
            /* 半透明背景 */
            background-color: var(--bg);
            /* background-color: rgba(0, 0, 0, 0.5);  */
            /* 确保遮罩在其他内容之上 */
            z-index: 12;
        }


        @media screen and (min-width: 960px) and (max-width: 1191px) {
            width: calc(-18px + 25vw);
            margin-left: 12px;
        }

        @media screen and (min-width: 1192px) and (max-width: 1423px) {
            width: calc(-16.8px + 20vw);
            margin-left: 12px;
        }

        @media screen and (min-width: 1424px) and (max-width: 1727px) {
            width: calc(-21.33333px + 16.66667vw);
            margin-left: 16px;
        }

        @media screen and (min-width: 1728px) {
            width: 266.66667px;
            margin-left: 16px;
        }


    }




    .catalog-card {
        color: var(--color-secondary-label);
        /* border-radius: 8px; */
        box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
        padding: 0px 20px 24px 20px;
        width: 100%;
        /* margin-top: 25px; */
        box-sizing: border-box;
        height: 100%;

    }

    .catalog-card-header {
        text-align: left !important;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .catalog-icon {
        font-size: 18px;
        margin-right: 10px;
        color: var(--color-primary-label) !important;
    }

    .catalog-card-header div>span {
        font-size: 17px;
        color: var(--color-primary-label) !important;
    }

    /* 阅读进度 */
    .progress {
        color: dodgerblue;
        font-style: italic;
        font-size: 140%;
    }

    .catalog-content {
        max-height: calc(100vh - 120px);
        overflow: auto;
        margin-right: -24px;
        padding-right: 20px;
        color: var(--color-secondary-label);
    }

    .catalog-item {
        color: var(--color-secondary-label) !important;
        margin: 5px 0;
        line-height: 28px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-size: 14px;
        padding: 2px 6px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        &:hover {
            background-color: var(--color-active-background) !important;
            border-radius: 999px;
            color: var(--color-primary-label) !important;
        }
    }

    .active {
        background-color: var(--color-active-background) !important;
        border-radius: 999px;
        color: var(--color-primary-label) !important;

        &:hover {
            background-color: var(--color-active-background) !important;
            border-radius: 999px;
            color: var(--color-primary-label) !important;
        }
    }

    .not-active {
        color: var(--color-secondary-label) !important;
    }
</style>