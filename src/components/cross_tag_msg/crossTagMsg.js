const channel=new BroadcastChannel('demo');

/* 
跨标签通信
*/

// 发送消息
export function sendMsg(type,content){
channel.postMessage({
    type,
    content,
})

}

// 接受消息
export function listenMsg(callback){
 const handler=(e)=>{
    callback && callback(e.data);
}
    channel.addEventListener('message',handler)

 return ()=>{
    channel.removeEventListener('message',handler);
 }
}