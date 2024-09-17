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
                <div
                    v-for="title in tocArray"
                    :key="title.id"
                    @click="scrollToView(title.scrollTop)"
                    :class="[
                        'catalog-item',
                        currentTitle.id == title.id ? 'active' : 'not-active',
                    ]"
                    :style="{ marginLeft: title.level * 20 + 'px' }"
                    v-show="title.isVisible"
                    :title="title.rawName"
                >
                  {{ title.rawName }} 
                </div>
            </div>
        </div>
        <div v-else>没有目录</div>
    </div>

</template>

<script setup>
import { reactive, ref,nextTick } from "vue";

 

const props = defineProps({
    containerName: {
        type: String,
        default: ".article-content",
    },
    
});



        //获取目录
        const tocArray =ref([]);
        // let titles = reactive(getTitles());
        let currentTitle = reactive({});
        let progress = ref(0);

        getTitles();
        // 获取目录的标题
        function getTitles() {

            nextTick(()=>{
                let titles = [];
                let levels = ['h1','h2','h3','h4','h5','h6'];
              
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

                    if (tocArray.value.length> 0) {//目录数组长度大于0
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
            
                // console.log('tocArray:',JSON.stringify(tocArray.value))
                //  return titles;  
            })
        }

        // 监听滚动事件并更新样式
        window.addEventListener("scroll", function () {
            progress.value =
                parseInt(
                    (window.scrollY / document.documentElement.scrollHeight) *
                        100
                ) + "%";

            let visibleTitles = [];

            for (let i =  tocArray.value.length - 1; i >= 0; i--) {
                const title =  tocArray.value[i];
             
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
                    for (const t of  tocArray.value) {
                        if (!visibleTitles.includes(t)) {
                            setChildrenVisible(t, false);
                        }
                    }

                    return;
                }
            }
        });

        // 设置子节点的可见性
        function setChildrenVisible(title, isVisible) {
            for (const child of title.children) {
                child.isVisible = isVisible;
            }
        }

        // 滚动到指定的位置
        function scrollToView(scrollTop) {
            scrollTop=scrollTop-72;//减去头部导航栏
            window.scrollTo({ top: scrollTop, behavior: "smooth" });
        }

       

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
            z-index: 10;
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
    background: white;
    /* border-radius: 8px; */
    box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
    padding: 0px 20px  24px 20px;
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
    color: dodgerblue;
}

.catalog-card-header div > span {
    font-size: 17px;
    color: #4c4948;
}

.progress {
    color: #a9a9a9;
    font-style: italic;
    font-size: 140%;
}

.catalog-content {
    max-height: calc(100vh - 120px);
    overflow: auto;
    margin-right: -24px;
    padding-right: 20px;
}

.catalog-item {
    color: #666261;
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
        color: #1892ff;
    }
}

.active {
    background-color:  #0c82e9;
    color: white;

    &:hover {
        background-color: #0c82e9;
        color: white;
    }
}
</style>
