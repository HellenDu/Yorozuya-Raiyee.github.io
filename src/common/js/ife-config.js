+function () {
    var rootDir = '/dist';

    require.config({
        baseUrl: rootDir,
        urlArgs: typeof manifest === 'undefined' || function (moduleName, url) {
            url.indexOf(rootDir) === 0 && (url = url.replace(rootDir + '/', ''));
            return '?' + manifest[url];
        },
        paths: {
            jquery: 'common/js/jquery-1.12.1',
            bootstrap: 'common/js/bootstrap'
        }
    });

    require(['jquery'], function ($) {
        alert('requireJs 加载成功！当前使用的 jQuery 版本为：' + $().jquery + '！');
    });
}();