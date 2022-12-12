// ==UserScript==
// @name         Chatgpt AI对话插件
// @namespace    Chatgpt AI对话插件
// @version      0.1
// @description  Chatgpt AI对话插件
// @author       //作者微信号wxid_qo94xu9bwvwo22
// @match        *://*.baidu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
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
    console.log("欢迎使用chatgpt功能")
    // Your code here...
    var su, kw
    window.onload = function () {
        var href = window.location.href;
        if (href.indexOf("https://www.baidu.com") != -1) {
            su = document.querySelector("#su")
            kw = document.querySelector("#kw")
        }
        if (href.indexOf("csdn") != -1) {
            su = document.querySelector("#search")
            kw = document.querySelector("#keyword")
            console.log(su, kw)
        }
        if (href.indexOf("google") != -1) {
            su = document.querySelector(".Tg7LZd")
            kw = document.querySelector("input")
            console.log(su, kw)
        }

        su.addEventListener("click", throttle(() => {
            let warps = document.querySelectorAll("#warp")
            console.log(warps)
            if (warps.length != 0) {
                warps[0].remove()
            }

            var box = `
    <div id="warp" class="warp">
        <div class="content">
            <div style="margin-bottom:20px;font-weight: 800;text-align: center">Chatgpt-AI插件</div>
            <span class="content_val">chatgpt插件已经触发，稍等片刻即可获得相应答案~</span>
            <img id="chatgpt_img" style="width:100%;margin-top:40px;border-radius:20px"  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719182507_fbc17.thumb.1000_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673322367&t=ab3d1b28dfc19845790520826340af93" alt="">

        </div>
    </div>
    `
            document.body.insertAdjacentHTML('afterbegin', box);
            let warp = document.querySelector("#warp")
            console.log(warp)

            warp.style.position = "absolute"
            warp.style.borderRadius = "20px"
            warp.style.margin = "50px 20px"
            warp.style.border = "1px solid #96C2F1"
            warp.style.backgroundColor = "rgba(245, 245, 245)"
            warp.style.height = "100%"
            warp.style.right = "40px"
            warp.style.top = "0px"
            warp.style.width = "20%"
            warp.style.zIndex = "999"
            let content = document.querySelector(".content")
            content.style.padding = "20px"
            content.style.color = "rgba(112, 112, 112)"
            let content_val = document.querySelector(".content_val")
            let chatgpt_img = document.querySelector("#chatgpt_img")
            content_val.style.paddingRight = "20px"
            $.ajax({
                "url": "https://www.miku39.fun/openai/get_answer", "data": JSON.stringify({
                    "prompt": kw.value,
                }),
                "type": "POST",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == 200) {
                        console.log(result.msg)
                        //console.log(content_val)
                        content_val.innerHTML = ""
                        chatgpt_img.remove()
                        content_val.innerHTML = result.msg
                        console.log(content_val)

                    }
                    else {
                        chatgpt_img.remove()
                        content_val.innerHTML = "出错了哦，请联系开发者"
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status,XMLHttpRequest.statusText,XMLHttpRequest.responseText); // 获取状态码
                    chatgpt_img.remove()
                    if(XMLHttpRequest.status==0){
                        content_val.innerHTML = "请求太频繁，请勿短时间内请求多次"
                    }
                    else{
                        content_val.innerHTML = "服务器出错请联系开发者~" //作者微信号wxid_qo94xu9bwvwo22，有问题请联系

                    }
                }
            })

        },1000))
    }




})();