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
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString(),         // 秒
        "Z+": dateFormat_timezone(date.getTimezoneOffset())       // 时区
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
        }
    }
    return fmt;
}

function doFunc_timeChange() {
    chrome.storage.sync.get({
        timeChange: true
    }, function (items) {
        if (!items.timeChange) {
            return;
        }

        var els = document.querySelectorAll("relative-time");
        if (!els || els.length === 0) {
            return;
        }

        els.forEach(function (el) {
            el.shadowRoot.innerHTML = `<span class="text-small">${dateFormat('yyyy/MM/dd HH:mm:ss Z', new Date(el.getAttribute("datetime")))}</span>`; // set original timestamp
        });
    });
}

var timeChangeRetryTimer = null;
var timeChangeRetryCount = 0;
var TIME_CHANGE_MAX_RETRIES = 4;
var TIME_CHANGE_RETRY_DELAY = 400;

function stopTimeChangeRetry() {
    if (timeChangeRetryTimer) {
        clearTimeout(timeChangeRetryTimer);
        timeChangeRetryTimer = null;
    }
}

function runTimeChangeWithRetry() {
    stopTimeChangeRetry();
    timeChangeRetryCount = 0;

    function attempt() {
        doFunc_timeChange();

        var els = document.querySelectorAll("relative-time");
        var hasReadyShadowRoot = Array.prototype.some.call(els, function (el) {
            return !!el.shadowRoot;
        });

        if (hasReadyShadowRoot || timeChangeRetryCount >= TIME_CHANGE_MAX_RETRIES) {
            stopTimeChangeRetry();
            return;
        }

        timeChangeRetryCount += 1;
        timeChangeRetryTimer = setTimeout(attempt, TIME_CHANGE_RETRY_DELAY);
    }

    attempt();
}

if (window.addEventListener) {
    window.addEventListener('turbo:load', runTimeChangeWithRetry);
    window.addEventListener('turbo:render', runTimeChangeWithRetry);
}

runTimeChangeWithRetry();
