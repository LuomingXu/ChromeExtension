function dateFormat_timezone(offset) {
    if (offset == 0) {
        return "UTC";
    }

    if (offset < 0) {
        return `UTC+${String(-offset / 60).padStart(2, '0')}`;
    } else {
        return `UTC-${String(offset / 60).padStart(2, '0')}`;
    }
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString(),          // 秒
        "Z+": dateFormat_timezone(date.getTimezoneOffset())       // 时区
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function doFunc_timeChange() {
    chrome.storage.sync.get({
        timeChange: true
    }, function (items) {
        // console.log(`time change: ${items.timeChange}`)
        temp = items.timeChange;
        if (items.timeChange) {
            var els = document.querySelectorAll("relative-time");
            // console.log(`els lenght: ${els.length}`)
            els.forEach(function (el) {
                el.innerHTML = `<span class="text-small">on ${dateFormat('yyyy/MM/dd HH:mm:ss Z', new Date(el.getAttribute("datetime")))}</span>`; // set original timestamp
                //el.disconnectedCallback(); // stop auto-updates
            });
        }
    });
}

doFunc_timeChange()
