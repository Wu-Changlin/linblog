
//  防抖：某一高频事件不断被触发时，仅在最后一次真正执行事件处理代码。
//  节流：某一高频事件不断被触发时，确保在每一个特定的时间段内被执行一次。
//  相似点：都是为应对事件持续频繁发生，造成前端性能下降或对后端服务造成的压力。
//  区别：节流会不断的触发，而防抖仅在最后一次触发。
//  防抖适用于，如搜索输入框提示,仅在输入停止后进行一次提示更新，以减少后台压力。
//  节流适用于，如窗体以拖动的方式调整大小，在每次特定的时间片结束后触发一次窗体大小调整。

//  防抖
let timer = null
export function debounce (fn, delay = 1000){
    if(timer != null){
        clearTimeout(timer)
        timer = null
    }
    timer = setTimeout(fn, delay)
}

//节流
export function throttle (fn, delay = 300) {
    let timer = null
    return function (...args) {
        if(timer == null){
            timer = setTimeout(() => {
                fn.call(this, ...args)
    
                clearTimeout(timer)
                timer = null
            }, delay);
        }
    }
}
