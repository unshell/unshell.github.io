/**
 * List repository issues
 * 
 * @param {*} success 成功的回调
 */
function issues(success) {
    $.ajax({
        url: 'https://api.github.com/repos/unshell/posts/issues',
        headers: {
            accept: 'application/vnd.github+json'
        },
        success: success,
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}

/**
 * Get an issue
 * @param {*} success 成功的回调
 * @param {*} number Issue Number（issue 索引）
 */
function issue(success, number) {
    $.ajax({
        url: 'https://api.github.com/repos/unshell/posts/issues/' + number,
        headers: {
            accept: 'application/vnd.github+json'
        },
        success: success,
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}

/**
 * Get location params
 */
function params() {
    var urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

/* Request loading */
function loading(end) {
    var $target = $('p.loading'), html = $target.html();
    $target.css('display', end ? 'none' : 'inherit');
}