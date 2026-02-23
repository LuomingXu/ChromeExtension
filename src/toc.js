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

var getTocScrollKey = function () {
    return 'toc_scroll_top:' + window.location.pathname;
};

var getLinks = function () {
    var header, tag, headerLevelStr, depth;
    var headers = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
    var links = [];

    if (!headers || headers.length === 0) {
        return links;
    }

    var baseUrl = window.location.href.split('#')[0];

    for (var i = 0; i < headers.length; ++i) {
        header = headers[i];
        tag = header.tagName;
        headerLevelStr = tag.substring(1);
        depth = Number.parseInt(headerLevelStr, 10);

        var anchor = null;
        if (header.nextElementSibling && header.nextElementSibling.matches('a.anchor[href]')) {
            anchor = header.nextElementSibling;
        } else if (header.parentElement) {
            anchor = header.parentElement.querySelector('a.anchor[href]');
        }

        if (!anchor) {
            continue;
        }

        var rawHash = anchor.getAttribute('href') || '';
        if (!rawHash) {
            continue;
        }

        var hashId = rawHash.replace(/^#/, '');
        if (!hashId) {
            continue;
        }

        links.push({
            text: header.innerText,
            hash: baseUrl + '#' + hashId,
            depth: depth,
            hashId: hashId
        });
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

        contents += '<li id="toc_line_' + encodeURIComponent(node.hashId) + '" class="toc__lineDepth-' + currentDepth + '"><a title="' + node.text + '" href="' + node.hash + '">' + node.text + '</a></li>';
    }

    while (currentDepth--) {
        contents += '</ul>';
    }

    return contents;
};

var getSidebarContainer = function () {
    var candidates = [
        '.Layout-sidebar',
        '[data-position="end"] rails-partial[data-partial-name="codeViewRepoRoute.Sidebar"]',
        '[data-position="end"] .prc-PageLayout-Pane-AyzHK'
    ];

    for (var i = 0; i < candidates.length; i++) {
        var node = document.querySelector(candidates[i]);
        if (node) {
            return node;
        }
    }

    return null;
};

var getSidebarAnchor = function (section) {
    var pane = section.closest('.prc-PageLayout-Pane-AyzHK');
    if (pane) {
        return pane;
    }

    var fallback = document.querySelector('[data-position="end"] .prc-PageLayout-Pane-AyzHK');
    return fallback || section;
};

var calculateTopFromReferenceRow = function (referenceRow) {
    if (!referenceRow) {
        return 72;
    }

    var rect = referenceRow.getBoundingClientRect();
    var computedTop = Math.round(rect.bottom + 16);
    if (computedTop < 72) {
        return 72;
    }

    return computedTop;
};

var pinTocToRightPane = function (toc, section, referenceRow) {
    var anchor = getSidebarAnchor(section);
    if (!anchor) {
        return;
    }

    // mobile / narrow layouts: keep natural flow
    if (window.innerWidth < 960) {
        toc.style.position = 'static';
        toc.style.top = '';
        toc.style.left = '';
        toc.style.width = '';
        toc.style.zIndex = '';
        return;
    }

    var rect = anchor.getBoundingClientRect();
    toc.style.position = 'fixed';

    var calculatedTop = calculateTopFromReferenceRow(referenceRow);
    // Ensure the top does not go off the top of the screen or overlap other header elements (e.g. 72px)
    if (calculatedTop < 72) {
        calculatedTop = 72;
    }

    toc.style.top = calculatedTop + 'px';
    toc.style.left = rect.left + 'px';
    toc.style.width = rect.width + 'px';
    toc.style.zIndex = '30';
};

var removeOldToc = function () {
    var old = document.querySelector('.toc[data-myownext="true"]');
    if (old && old.parentNode) {
        old.parentNode.removeChild(old);
    }
};

var insertAfterLastBorderGridRow = function (section, toc) {
    var rows = section.querySelectorAll('.BorderGrid-row');
    if (rows.length > 0) {
        var last = rows[rows.length - 1];
        if (last.parentNode) {
            if (last.nextSibling) {
                last.parentNode.insertBefore(toc, last.nextSibling);
            } else {
                last.parentNode.appendChild(toc);
            }
            return last;
        }
    }

    section.appendChild(toc);
    return null;
};

function doFunc_toc(retryCount) {
    var attempt = typeof retryCount === 'number' ? retryCount : 0;
    removeOldToc();

    var section = getSidebarContainer();
    var links = getLinks();

    if (!section || !links || links.length === 0) {
        if (attempt < 12) {
            window.setTimeout(function () {
                doFunc_toc(attempt + 1);
            }, 250);
        }
        return;
    }

    var toc = document.createElement('div');
    toc.className = 'toc toc__row';
    toc.setAttribute('data-myownext', 'true');

    var referenceRow = insertAfterLastBorderGridRow(section, toc);

    toc.innerHTML = "<div class='Box-header toc__header'><h2 class='Box-title toc_title'>Table Of Contents</h2></div>" + buildContents(links);
    toc.setAttribute('data-fixed-top', String(calculateTopFromReferenceRow(referenceRow)));
    pinTocToRightPane(toc, section, referenceRow);
    addEvent(window, 'resize', function () {
        toc.setAttribute('data-fixed-top', String(calculateTopFromReferenceRow(referenceRow)));
        pinTocToRightPane(toc, section, referenceRow);
    });
    addEvent(window, 'scroll', function () {
        pinTocToRightPane(toc, section, referenceRow);
    });

    var toc_ul = toc.getElementsByClassName('toc__ul')[0];
    if (!toc_ul) {
        return;
    }

    var scrollKey = getTocScrollKey();
    var savedScrollTop = window.localStorage.getItem(scrollKey);
    if (savedScrollTop !== null) {
        toc_ul.scrollTop = Number(savedScrollTop);
    }

    addEvent(toc_ul, 'scroll', function () {
        window.localStorage.setItem(scrollKey, String(toc_ul.scrollTop));
    });

    addEvent(toc_ul, 'click', function (e) {
        var target = e.target;
        if (target && target.closest && target.closest('a')) {
            var currentTop = toc_ul.scrollTop;
            window.localStorage.setItem(scrollKey, String(currentTop));
        }
    });
}

doFunc_toc();
