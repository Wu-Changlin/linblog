<template>
    
    <div class="flex-container">
        <div class="flex-item">请输入您收到的邮箱验证码</div>
    </div>
    <div class="six-character-input-box">
        <input
            :ref="inputElement[index]"
            @keyup="onKeyup"
            @paste="onPaste"
            @input="onInput"
            v-model="inputValue[index]"
            v-for="(_, index) in inputValue"
            :key="index"
            :data-index="index"
            pattern="[a-zA-Z0-9]" 
            maxlength="1"
            @compositionstart="handleCompositionStart" 
            @compositionend="handleCompositionEnd" 
        >
    </div>
    <div class="box" v-if="showSubmitButton">
        <div class="butt" @click="submitVerificationCodeToParent">
            <div>提交</div>
        </div>
    </div>
</template>

<script setup>
    // vue 3.x setup 模式
    import { defineEmits, defineProps, nextTick, onMounted,onUnmounted,ref, watch,computed } from 'vue'
    

    // 使用该变量在中文输入法输入时，阻止@input事件的触发。
    const isComposing=ref(false);

//     const props = defineProps({
//         value: {
// 			type: String,
//     },
// });


// watch(() => props.value, () => {
//         resetValue(props.value);
//     })
    
    
    // const props = withDefaults(defineProps(), {})
    // const emit = defineEmits(['update:value'])
    const emit = defineEmits(['completeVerificationCode'])

    
    
    const emptyArray = new Array(6).fill(undefined)
    const inputElement = ref(emptyArray.map(ref))
    const inputValue = ref(emptyArray.map(() => ''))
    
    onMounted(() => {
        // resetValue(props.value);
        resetValue('');//初始化

        nextTick(() => {
            inputEl('Home')?.focus()
        })
    })
    
    // 设置边练来停止监听的函数
    // const stopWatchInputValue=ref(null);
    // stopWatchInputValue.value = watch(() => props.value, () => {
    //     resetValue(props.value);
    // })


    // watch(() => inputValue.value, () => {
    //     console.log('inputValue:',inputValue.value);
    // })


    // 计算所有输入框都有值显示提交按钮
    const showSubmitButton = computed(() => {
        let count=inputValue.value.join('');
        if(count.length === emptyArray.length){
            return true;
        }
        return false;
    });
    // const allValuesAreEmpty = computed(() => inputValue.value.every(value => value.trim() === ''));

    // const showSubmitButton = computed(() => inputValue.value.every(value => value.trim() === ''));
    
    // 设置第N个输入框的值
    function setInputValue(index, value) {
        inputValue.value.splice(index, 1, value)
    }
    
    // 获取第N个输入框的dom元素
    function inputEl(type) {
        const index = type === 'Home' ? 0 : type === 'End' ? inputElement.value.length - 1 : type
        const firstInputRef = inputElement.value[index]
        return firstInputRef.value[0]
    }
    // 初始值（复位值）
    function resetValue(str) {
        // 匹配字符串是否包含字母、数字
        let  contains_letter_or_digit=/^[A-Za-z0-9]+$/.test(str);
        // 没有包含字母、数字直接返回
        if(!contains_letter_or_digit){
            return;
        }
        if (str.length === emptyArray.length) {
            inputValue.value = str.split('');
        } else {
            inputValue.value = emptyArray.map(() => '')
        }
    }
    // onkeyup事件：当用户释放键盘上的键时触发。常用于文本输入框等需要实时响应用户输入的场景。
    function onKeyup(e) {
        const index = e.target.dataset.index * 1;
        const el = e.target;
    
        if (e.code === 'Backspace') {
            setInputValue(index, null)
    
            if (el.previousElementSibling) {
                el.previousElementSibling.focus()
            }
        } else if (e.code === 'Delete') {
            setInputValue(index, null)
            if (el.nextElementSibling) {
                el.nextElementSibling.focus()
            }
        } else if (e.code === 'Home') {
            inputEl('Home').focus()
        } else if (e.code === 'End') {
            inputEl('End').focus()
        } else if (e.code === 'ArrowLeft') {
            if (el.previousElementSibling) {
                el.previousElementSibling.focus()
            }
        } else if (e.code === 'ArrowRight') {
            if (el.nextElementSibling) {
                el.nextElementSibling.focus()
            }
        }
    
        if (inputValue.value.join('').length === emptyArray.length) {
            // emit('update:value', inputValue.value.join(''));
            // emit('completeVerificationCode', inputValue.value.join(''));

            
        }
    }
    
    // 粘贴事件 
    function onPaste(e) {
        // 当进行粘贴时
        e.clipboardData.items[0].getAsString((str) => resetValue(str))
    }
    
    //适用于实时查询，每输入一个字符都会触发该事件。
    function onInput(e) {
        if (isComposing.value) {
            return;
        }
        const index = e.target.dataset.index * 1;
        const old = inputValue.value[index];
        const el = e.target;
        const value = e.data;
        // console.log('原值,输入框值：',old,',',value);

    // /^\d$/ 判断数字
    // /^[A-Za-z0-9]$/ 检查value是否是大小写字母或数字，不包含其他字符
    /* 
        注意：^和$分别指定了正则表达式必须从字符串的开始位置匹配，
        并在字符串的结束位置匹配，确保整个字符串只有一个字符且是我们想要的字符。
    */

        if (/^[A-Za-z0-9]$/.test(value)) {
            // 设置当前输入框的值
            setInputValue(index, value);
            if (index === emptyArray.length - 1) {
                if (inputValue.value.join('').length === emptyArray.length) {
                    // emit('update:value', inputValue.value.join(''));
            // emit('completeVerificationCode', inputValue.value.join(''));

                }
            } else if (el.nextElementSibling) {
                /*
                    el.nextElementSibling是JavaScript中的一个方法，用于将焦点设置到当前元素的下一个兄弟元素上。
                    这里的 el 是一个DOM元素，nextElementSibling 属性返回当前元素之后的所有兄弟元素中的第一个元素节点
                    （不包括文本节点和注释节点），
                    而 focus() 方法则是将焦点设置到该元素上。
                */
                el.nextElementSibling.focus()
            }
        } else {// 非匹配值
            // console.log('false-old,value:',old,',',value);
            // 重置原值
            inputValue.value[index]='';
            // 重置输入框值
            el.value = '';
        
            // if (value) {
            //     el.value = old;
            //     setInputValue(index, old)
            // }
        }
    }

    
    /* 监听compositionstart和compositionend事件，在中文输入法输入时，阻止@input事件的触发。
    根据官方规范，Composition 事件触发顺序如下：
        输入开始时触发 compositionstart
        选择字/词完成输入时触发 compositionend
        那么通过 Composition 事件，在 compositionend 赋值而非直接赋值既可
    开始*/


    function handleCompositionStart() {
        isComposing.value = true;
    }

    function handleCompositionEnd(event) {
        isComposing.value = false;
        onInput(event);
    }

    // 提交验证码到父页面
    function submitVerificationCodeToParent() {
        emit('completeVerificationCode', inputValue.value.join(''));

    }

    /* 监听compositionstart和compositionend事件，在中文输入法输入时，阻止@input事件的触发。结束*/
    
// 组件销毁前调用方法移除stopWatchInputValue
onUnmounted(() => {
	// stopWatchInputValue.value=null; // 如果watch返回了一个停止监听的函数，调用它

});
    </script>


<style scoped>

.flex-container {
  display: flex; /* 使用Flex布局 */
position: absolute;
  flex-direction: row; /* 主轴方向为水平（默认值，可以省略） */
 margin-bottom: 200px;

}

/* 样式化子元素 */
.flex-item {
width: auto;
height: auto;
margin: 5px;
}

.six-character-input-box {
    width: 360px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    input {
        color: inherit;
        font-family: inherit;
        outline: 0;
        border: 1px solid #ccc;
        height: 50px;
        width: 50px;
        font-size: 30px;
        text-align: center;
        line-height: 1;
        letter-spacing: 0;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            appearance: none;
            margin: 0;
        }
    }
}



.box {
    display: flex; /* 使用Flex布局 */
position: absolute;
  flex-direction: row; /* 主轴方向为水平（默认值，可以省略） */
 bottom: 20px;
    .butt {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 150px;
        height: 50px;
        border: 1px solid transparent;
        color: #000;
        overflow: hidden;
        box-sizing: content-box;
        z-index: 0;
        cursor: pointer;
        border-radius: 25px;
        box-shadow: inset 0 0 6px 2px #11ef49;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 144px;
            height: 44px;
            color: #000;
            border-radius: 23px;
            background-color: #11ef49;
        }
        &::before {
            position: absolute;
            content: "";
            top: 50%;
            left: 50%;
            width: 30px;
            height: 150px;
            animation: sss 6s linear infinite;
            z-index: -1;
            transform-origin: center;
            transform: translate(-50%, -50%);
            background-image: linear-gradient(to left, #e71919, #d849b1, #f7f31d);
        }
    }
}
 
@keyframes sss {
    100% {
        transform: translate(-50%, -50%) rotate(720deg);
    }
}

</style>