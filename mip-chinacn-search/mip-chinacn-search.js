/**
 * @file mip-chinacn-search 组件
 * @author
 */

define(function (require) {

    var customElement = require('customElement').create();
    var $ = require('zepto');

    /**
     * 构造元素，只会运行一次
     */
    customElement.prototype.build = function () {
        var $element = $(this.element);
        var $form = $element.find('form');
        var $input = $element.find('[data-role="searchKey"]');
        var $searchBtn = $element.find('[data-role="searchIcon"]');

        $searchBtn.on('click', function () {
            forSearch($input);
        });

        $form.on('submit', function () {
            forSearch($input);
            return false;
        });
    };

    function forSearch($this) {
        var zkey = $this.val();
        zkey = c2h($.trim(zkey));
        zkey = zkey.replace(/[\\\/\#\?\$\&\=\>\<\-]/g, ' '); // 需过滤的字符
        var ztype = $('#ztype').val();
        if (zkey === '') {
            $this.focus();
            return false;
        }
        ajaxRequest(zkey, ztype);
    }

    // 全角转半角
    function c2h(str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) === 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }

            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            }
            else {
                result += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    }

    // ajax请求获取页面跳转地址
    function ajaxRequest(key, type) {
        var formData = new FormData();
        formData.append('key', key);
        formData.append('entType', type);
        fetch('/common/search.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            window.location.href = response.url;
        }).catch(function (e) {
            alert('当前访问用户较多，请稍后重试。');
        });
    }

    return customElement;
});
