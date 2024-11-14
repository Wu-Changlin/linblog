//图标
// 文本
import { createVNode,render } from 'vue'
import myMessage from './message.vue'

// 动态创建一个DOM容器
const div=document.createElement('div')
div.setAttribute('class','my-message-container')
document.body.appendChild(div)


export default function Messages (text,type){
  
  let timer=null;

 //createVNode 用于创建一个虚拟节点
 // 参数1 支持组件
 // 参数2 表示传递给组件的选项
const vnode= createVNode(myMessage,{text, type})
//把虚拟的节点渲染到页面的DOM中即可
// render函数的参数
//参数一：表示表示需要渲染的内容（虚拟节点）
// 参数二：表示渲染的目标位置 （DOM元素）
render(vnode,div);

 // 希望3s后消失
 clearTimeout(timer)
   timer=setTimeout(()=>{
    // 清空div里面的内容
    render(null,div);
   },30000000)
}


// 页面使用
// $message('成功', 'success');
// $message('消息', 'message');
// $message('警告', 'warning');
// $message('错误', 'error');
