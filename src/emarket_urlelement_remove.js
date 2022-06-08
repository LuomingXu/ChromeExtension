var current_href = window.location.href;
var new_href = current_href;
var url = new URL(current_href)
var keys = Array.from(url.searchParams.keys())

function replace_url(current_href, new_href) {
    if (current_href !== new_href)
        window.location.replace(new_href)
}

if (current_href.includes("item.m.jd.com")) {
    // https://item.m.jd.com/product/31815069118.html
    new_href = current_href.replace("m.", "")
    new_href = new_href.replace("/product", "")
} else if (current_href.includes("item.taobao.com") || current_href.includes("detail.tmall.com")) {
    // remove taobao useless params
    for (var item of keys) {
        if (item !== "id")
            url.searchParams.delete(item)
    }
    url.hash = ""

    new_href = url.toString()
} else if (current_href.includes("https://www.bilibili.com/video/BV")
    || current_href.includes("https://www.bilibili.com/video/av")
    || url.host === "item.jd.com") {
    for (var item of keys) {
        url.searchParams.delete(item)
    }
    url.hash = ""
    new_href = url.toString()
} else if (url.host.endsWith("bilibili.com")) {
    if (current_href.includes("https://www.bilibili.com/video/BV")
        || current_href.includes("https://www.bilibili.com/video/av")) {
        for (var item of keys) {
            url.searchParams.delete(item)
        }
    } else if (url.host === "live.bilibili.com") {
        const params = ["session_id", "visit_id", "spm_id_from", "hotRank", "broadcast_type", "is_room_feed"]
        for (var item of keys) {
            if (params.includes(item)) {
                url.searchParams.delete(item)
            }
        }
    } else {
        url.searchParams.delete("spm_id_from")
    }

    new_href = url.toString()
} else if (url.host === "img30.360buyimg.com") {
    const reg = /\d+x\d+/
    url.pathname = url.pathname.replace(reg, "2000x2000")
    new_href = url.toString()
}

replace_url(current_href, new_href)
