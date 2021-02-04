var addEvent = (function () {
    if (window.addEventListener) {
        return function (elm, type, handle) {
            elm.addEventListener(type, handle, false);
        }
    }
    if (window.attachEvent) {
        return function (elm, type, handle) {
            elm.attachEvent('on' + type, handle);
        }
    }
})();

var getLinks = function () {
    var header, tag, headerLevelStr, depth;
    var headers = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
    var links = [];

    for (var i = 0; i < headers.length; ++i) {
        header = headers[i];
        tag = header.tagName;
        headerLevelStr = tag.substring(1);
        depth = Number.parseInt(headerLevelStr);

        if (typeof header.children[0] !== 'undefined') {
            var hash = undefined;
            for (var j = 0; j < header.children.length; ++j) {
                var child = header.children[j];
                hash = child.hash;
                if (hash != undefined && hash != '') {
                    break;
                }
            }

            links.push({
                text: header.innerText,
                hash: hash,
                depth: depth
            });
        }
    }

    return links;
};

var openList = function (depth) {
    var html = '';

    while (depth--) {
        html += '<li><ul>';
    }

    return html;
};

var closeList = function (depth) {
    var html = '';

    while (depth--) {
        html += '</ul></li>';
    }

    return html;
};

var buildContents = function (links) {
    var node;
    var contents = '<ul class="toc__ul">';
    var currentDepth = 1;

    for (var i = 0; i < links.length; ++i) {
        node = links[i];

        if (node.depth > currentDepth) {
            contents += openList(node.depth - currentDepth);
        } else if (node.depth < currentDepth) {
            contents += closeList(currentDepth - node.depth);
        }

        currentDepth = node.depth;

        contents += `<li id="toc_line_${node.hash}" class="toc__lineDepth-${currentDepth}"><a title="${node.text}" href="${node.hash}">${node.text}</a></li>`;
    }

    while (currentDepth--) {
        contents += '</ul>';
    }

    return contents;
};

var section = document.getElementsByClassName('flex-shrink-0 col-12 col-md-3');
var toc = document.createElement("div");
toc.className = "toc toc__row";
console.log("section: ", section);
var links;

// https://github.com/$USERNAME下, 因为github, 有首页readme, 所以需要剔除, 不显示toc
var isGen = function () {
    var arr = window.location.href.split('/');
    if (arr[4] != undefined) {
        return true;
    }

    return false;
}

if (typeof (section[0]) != 'undefined' && section[0] != null) {
    section[0].appendChild(toc);
    links = getLinks();
}

if (isGen() && typeof links !== 'undefined' && links.length !== 0 && typeof document.getElementsByClassName("toc")[0] !== 'undefined') {
    document.getElementsByClassName("toc")[0].innerHTML = "<div class='Box-header toc__header'><h2 class='Box-title toc_title'>Table Of Contents</h2></div>" + buildContents(links)
}

// 解决滚动条会自动复原的问题
var toc_ul = document.getElementsByClassName("toc__ul")[0]
addEvent(toc_ul, 'scroll', function () {
    window.localStorage.setItem("toc_scroll_top", toc_ul.scrollTop);
});

var tartget = window.location.href.split('#')[1];
if (tartget != undefined) {
    var element = document.getElementById(`toc_line_#${tartget}`);
    if (element != undefined && element != null) {
        var scrollTop = window.localStorage.getItem("toc_scroll_top");

        if (scrollTop != null) {
            toc_ul.scrollTo(0, scrollTop) // scroll to remembered position
        }
    }
}
