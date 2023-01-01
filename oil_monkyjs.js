// ==UserScript==
// @name         ChatGPT-Magic
// @namespace    ChatGPT-Magic
// @version      0.6
// @license MIT
// @description  这是一个最新的ai交互功能chatgpt，与搜索引擎融合的油猴插件，通过这个插件可以实现左边查看搜索引擎搜索结果，右边查看ai方给的答案方便日常工作优化搜索引擎。（重大更新！）
// @author       //作者微信号wxid_qo94xu9bwvwo22
// @match        *://*.baidu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @grant       GM_xmlhttpRequest
// @connect     *
// ==/UserScript==

(function () {
    'use strict';
    // 节流函数
    function throttle(fn, delay) {
        // last为上一次触发回调的时间
        let last = 0;
        // 将throttle处理结果当作函数返回
        return function () {
            // 保留调用时的this上下文
            let context = this;
            // 保留调用时传入的参数
            let args = arguments;
            // 获取当前时间
            let now = +new Date();
            // 判断上次触发的时间和当前的时间差是否小于时间间隔的阈值
            if (now - last >= delay) {
                // 将this和参数传入函数执行
                fn.apply(context, args);
                // 更新时间
                last = now;
            }
        }
    }
    //xss注入转义函数 防范xss
    function htmlEncodeByRegExp(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    }
    //获取问答数据函数
    function get_question(content_val, chatgpt_img, kw) {
        console.log(kw.value)
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                "url": "接口地址",
                "data": JSON.stringify({
                    "prompt": kw.value,
                }),
                "method": "post",

                "responseType": 'json',
                onload: function (res) {
                    let result = res.response
                    //加载完创建复制的按钮
                    //console.log(content_val)
                    chatgpt_img.remove()
                    content_val.innerHTML = result.msg
                    // copytext(result.msg) //如果是html的要小心
                    resolve(result.msg)

                },
                onerror: function () {
                    chatgpt_img.remove()
                    content_val.innerHTML = "服务器出错请联系开发者~"//作者微信号wxid_qo94xu9bwvwo22，有问题请联系
                    reject("fail")
                }
            })
        })
    }
    //获取元素
    function get_ele(value) {
        var su, kw
        if (value == 1) {
            su = document.querySelector("#su")
            kw = document.querySelector("#kw")
            kw.maxLength=1000
        }
        if (value == 2) {
            su = document.querySelector(".Tg7LZd")
            kw = document.querySelector("input")
        }
        if(value == 3){
            su = document.querySelector("#sb_form_go")
            kw = document.querySelector("#sb_form_q")
        }
        kw.maxLength=1000 //取消字数限制
        return { su, kw }
    }
    //拖拽函数
    function drap(warp, gbt_title) {
        let flag = false;
        let disX, disY;
        let bound;
        // flag 设为 true 表示按下鼠标，并记录鼠标离盒子左上角的相对距离
        function leftDown(e) {
            if (e.button === 0) {   // 按下鼠标左键
                flag = true;
                bound = warp.getBoundingClientRect();

                disX = e.clientX - bound.left;
                disY = e.clientY - bound.top;
            }
        }

        function drag(e) {
            if (flag) {
                let top = e.clientY - disY;
                let left = e.clientX - disX;

                // 处理边界条件
                if (top < 0) top = 0;
                if (left < 0) left = 0;
                // if (top + bound.height > document.body.clientHeight) {
                //     top = document.body.clientHeight - bound.height;
                //     console.log(top,"top")
                // }
                if (left + bound.width > document.body.clientWidth) {
                    left = document.body.clientWidth - bound.width;
                }

                warp.style.top = `${top}px`;
                warp.style.left = `${left}px`;
            }
        }

        function leftUp(e) {
            if (e.button === 0) {
                flag = false;
            }
        }

        gbt_title.addEventListener('mousedown', leftDown);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', leftUp);
    }
    //界面渲染函数
    function render(top,left) {
        var box = `
        <div id="warp" class="warp">
            <div class="content" style="display:flex;justify-content: center;flex-direction: column;align-items: center">
                <div id="gbt_title" class ="gbt_title" style="padding-top:20px;margin-bottom:0px;font-weight: 800;text-align: center">Chatgpt-AI插件</div>
                <div style="word-wrap:break-word;word-break:break-all;" class="content_val">chatgpt插件已经触发，稍等片刻即可获得相应答案~</div>
                <img id="chatgpt_img" style="width:100%;margin-top:20px;border-radius:20px"  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719182507_fbc17.thumb.1000_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673322367&t=ab3d1b28dfc19845790520826340af93" alt="">
  
            </div>
        </div>
        `
        document.body.insertAdjacentHTML('afterbegin', box);
        let warp = document.querySelector("#warp")
        let gbt_title = document.querySelector("#gbt_title")

        console.log(warp)
        gbt_title.style.padding = "10px"
        warp.style.position = "absolute"
        warp.style.borderRadius = "20px"
        warp.style.margin = "50px 20px"
        warp.style.border = "1px solid #96C2F1"
        warp.style.backgroundColor = "rgba(247, 247, 247)"

        warp.style.paddingBottom = "20px"
        warp.style.right = "20px"
        //渲染框的位置
        if(left){
            console.log("ssssddss")
            warp.style.left = left +"px"
            warp.style.top = top +"px"
        }
        warp.style.width = "20%"
        warp.style.zIndex = "999"
        let content = document.querySelector(".content")

        content.style.padding = "10px"
        content.style.color = "rgba(112, 112, 112)"
        let content_val = document.querySelector(".content_val")
        let chatgpt_img = document.querySelector("#chatgpt_img")
        content_val.style.paddingRight = "20px"
        content_val.style.paddingLeft = "20px"
        return { warp, gbt_title, content_val, chatgpt_img }
    }
    //监听页面事件函数
    function watch_click(value,top,left) {
        var { su, kw } = get_ele(value)
        var button_ele = getbutton(value)
        if (su) {
            su.addEventListener("click", function () {
                let warps = document.querySelectorAll("#warp")
                console.log(warps)
                if (warps.length != 0) {
                    warps[0].remove()
                }
             
                //渲染
                let { warp, gbt_title, content_val, chatgpt_img } = render(top,left)
                drap(warp, gbt_title)
                get_question(content_val, chatgpt_img, kw).then((res) => {
                    console.log(res)
                })
            })
        }
        button_ele.addEventListener("click", function () {
            let warps = document.querySelectorAll("#warp")
            console.log(warps)
            if (warps.length != 0) {
                warps[0].remove()
            }
            //渲染
            let { warp, gbt_title, content_val, chatgpt_img } = render(top,left)
            drap(warp, gbt_title)
            get_question(content_val, chatgpt_img, kw).then((res) => {
                console.log(res)
            })
        })

    }
    //得到按钮的事件
    function getbutton(value) {
        //把button_ele挂载到html里面

        var button_ele = `  <button id="gpt_bt" style='  color: white;
        background-color: #4e6ef2;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 20px;
        z-index:999;
        width: 100px;
        cursor: pointer;
        left:50px;
        top:27px;
        height: 40px;'>AI回答</button>`
        console.log("ssssssss")
        var { su, kw } = get_ele(value)
        document.body.insertAdjacentHTML('afterbegin', button_ele);
        button_ele = document.querySelector("#gpt_bt")
        button_ele.style.position = "absolute"
        if(su){
            var rect = su.getBoundingClientRect();
            console.log(333)
            button_ele.style.top = rect.top + "px"
            button_ele.style.left = rect.left + 200 + su.width + "px"
            
        }
        else{
            console.log(444)
            // button_ele.style.left = "50px"
        }
        return button_ele

    }
    // 复制文本
    function copytext(val){
        var gpt_copy = document.querySelector("#gpt_copy")
        gpt_copy.style.display = "block"
        gpt_copy.addEventListener("click",function(){
            clipboardData.setData("text/plain", val);
            alert("全部复制成功")

        })
    }
    // 去除热搜
    function remove_hot(){
        let hot = document.querySelector(".FYB_RD") 
        var rect = hot.getBoundingClientRect()
        hot.style.display = 'none'
        var [top,left] = [rect.top,rect.left] 
        return {top,left}
    }
    //百度
    if (window.location.href.indexOf("https://www.baidu.com") != -1) {
        // let hot = document.querySelector(".FYB_RD") 
        // var rect = hot.getBoundingClientRect()
        // hot.style.display = 'none'
        // var [top,left] = [rect.top,rect.left] 
        // console.log(top,left)
        var {top,left} = remove_hot()
        watch_click(1,top,left)

    }
    //谷歌
    if (window.location.href.indexOf("https://www.google.com") != -1) {
        watch_click(2)
    }
    //bing
    if (window.location.href.indexOf("https://www.bing.com") != -1) {
        watch_click(3)
    }



})();