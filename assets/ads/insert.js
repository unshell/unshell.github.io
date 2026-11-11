var prefix = 'fish-ads-', styleId = prefix + 'dynamic-style', fullscreenClass = prefix + 'video-fullscreen';

// 创建样式元素
function createStyle() {
    if (document.getElementById(styleId)) {
        return true;
    }
    const style = document.createElement('style');
    style.id = styleId;
    const styleInnerHtml = `
        .${fullscreenClass} {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 1997 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            transform: none !important;
            border-radius: 0 !important;
        }
    `;
    style.appendChild(document.createTextNode(styleInnerHtml));
    document.head.appendChild(style);
}

// 切换全屏功能
function toggleFullScreen() {
    // 自带全屏功能的按钮
    var fullscreenSelectors = [
        '.webfullscreenBtn i', // 芒果TV
        '[aria-label="网页全屏"]', // B站、腾讯视频
        '.xgplayer-page-full-screen .xgplayer-icon',
        '.player-buttons_videofullBtn__\\+Euuz' // 爱奇艺视频
    ], $fullscreen = document.body.querySelector(fullscreenSelectors.join(','));

    if ($fullscreen && $fullscreen.click) {
        $fullscreen.click();
        throw new Error('已存在网页全屏功能');
    }

    // 恢复样式
    if (document.body.querySelector(`.${fullscreenClass}`)) {
        document.body.querySelectorAll(`.${fullscreenClass}`).forEach(el => el.classList.remove(fullscreenClass))
        document.body.querySelectorAll('[fish-ads-original-display]').forEach(el => {
            var originalDisplay = el.getAttribute('fish-ads-original-display')
            if (originalDisplay === 'none') return
            el.removeAttribute('fish-ads-original-display')
            el.style.display = originalDisplay
        });
        document.body.style.height = 'auto';
        document.body.style.overflow = 'visible';
    }

    // 视频容器选择器
    var videoWrapper = {
        // 夸克网盘
        'pan.quark.cn': '.video-container',
        // 百度网盘
        'pan.baidu.com': '.vp-video',
        // 优酷视频
        'v.youku.com': '.player-container',
        // 好好看
        'www.hhkan4.com': '.play-box-main',
        // 超格教育
        'chaogejiaoyu.com': '.ppt'
    }[location.host]

    // 模糊匹配，针对域名后缀切换的网站
    if (location.host.includes('vidhub.')) {
        videoWrapper = '.MacPlayer';
    }

    return videoWrapper;
}

// 隐藏其他元素
function hideOtherDocument(target) {
    if (!target instanceof HTMLElement || target.tagName === 'BODY') {
        return;
    }
    target.classList.add(fullscreenClass);
    for (let i = 0, nodes = target.parentElement.children; i < nodes.length; i++) {
        const node = nodes[i], originalDisplay = window.getComputedStyle(node).display || '';
        if (node === target) continue;
        if (['STYLE', 'SCRIPT', 'LINK'].includes(node.tagName)) continue;
        if (originalDisplay === 'none') continue;
        if (node.classList.contains(fullscreenClass)) continue;
        node.setAttribute('fish-ads-original-display', originalDisplay);
        node.style.display = 'none';
    }
    target.parentElement && hideOtherDocument(target.parentElement);
}

// 实现网页全屏
function topVideo(selector) {
    selector = selector || toggleFullScreen();
    var video = findValidVideo(selector);
    if (!video) {
        if (location.host === 'pan.baidu.com') {
            circulator(500, 1, topVideo);
            throw new Error('No video found');
        }
        selector !== 'iframe' && circulator(500, 1, () => topVideo('iframe'));
        throw new Error('No video found');
    }
    hideOtherDocument(video);
}

// 查找有效的视频元素
function findValidVideo(selector) {
    const videos = document.body.querySelectorAll(selector || 'video');
    console.log('allVideos', videos);
    if (videos.length > 0) {
        const valids = Array.from(videos).filter(video => {
            const src = video.getAttribute('src');
            if (video.tagName !== 'IFRAME' && video.tagName !== 'VIDEO') return true;
            if (location.host === 'pan.baidu.com') {
                return video.id !== 'vjs_video_3_html5_api';
            }
            return src && src.trim() !== '' && !src.toLowerCase().includes('unknown');
        })
        console.log('validVideos', valids);
        if (valids.length > 0) return valids[0];
    }
    return undefined;
}

// 特殊网站处理
function handleSpecialWebsite() {
    // 抖音
    if (location.host === 'www.douyin.com') {
        var listener = function () {
            var video = findValidVideo(), filter = ['.xgplayer-listen-video', '.xgplayer-picture-in-picture-setting', '.xgplayer-fullscreen'];
            video.onpause = listener;

            // 移除小屏幕时不常用的元素
            circulator(500, 10, () => {
                document.body.querySelectorAll(filter.join(',')).forEach(el => el.remove());
            }, 'remove-douyin-elements');
        }
        // 取消最低高度，防止有效元素遮挡
        document.body.querySelectorAll('.fullscreen_capture_feedback').forEach(el => el.style.removeProperty('min-height'));
        listener();
    }
    // 爱奇艺
    if (location.host === 'www.iqiyi.com') {
        var filter = ['.xplayer_root__HlX4a', '.XPlayer_root__eWzab', '.iqp-player.use-pc-bridge', '#outlayer'];
        document.body.querySelectorAll(filter.join(',').forEach(el => el.style.minWidth = 'auto'));
    }
    // 超格教育
    if (location.host === 'chaogejiaoyu.com') {
        // 检测内置 iframe 进行跳转
        circulator(500, 8, () => {
            let iframeSrc = document.getElementsByTagName('iframe').item(0).src;
            if (iframeSrc && iframeSrc.indexOf('chaogejiaoyu.com') != -1) {
                location.href = iframeSrc;
                return false;
            }
        });
    }
}

// 循环执行器
function circulator(interval, maxcount, invoke, log) {
    if (invoke === undefined || typeof invoke !== 'function') return;
    if (!log) log = 'unknown';
    function loop() {
        if (maxcount <= 0) return;
        if (invoke && invoke()) return;
        console.log(`${log}-loop...`, maxcount);
        maxcount--;
        setTimeout(loop, interval);
    }
    setTimeout(loop, interval);
}

console.clear()
console.log(`
  ___ __         __               __ 
.'  _|__|.-----.|  |--. .---.-.--|  |.-----. .---.-.-----.-----.
|   _|  ||__ --||     | |  _  |  _  ||__ --| |  _  |  _  |  _  |
|__| |__||_____||__|__| |___._|_____||_____| |___._|   __|   __|
                                                   |__|  |__|
-------------------  网页全屏、优化插入脚本  -------------------
`)
// 创建样式
circulator(500, 10, createStyle, 'create-style')