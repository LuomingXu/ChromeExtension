chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        // chrome.tabs.executeScript(null, { code: `console.log('location:', window.location.href);` });
        // listen for messages sent from background.js
        // if (request.message === 'hello!') {
        //     console.log(request.url) // new url is now in content scripts
        // }

        if (msg.code === 'github' && msg.event === 'onHistoryStateUpdated') {
            if (msg.count % 2 == 0) { // 点击了之后此事件会执行两次, 第二次才是跳转后的页面
                // relative time -> ISO time
                doFunc_timeChange()

                // GitHub Toc
                doFunc_toc()
            }
        }
    }
);
