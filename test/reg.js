'use strict';

let str = 'href="../../../../dist/common/js/require.js" <a href="/dist/ife/task/html/index.html"></a>';
str = str.replace(/"([\w\-\.]*\/)+[\w\-\.]+\.(js|css|html)"/gi, function (matched) {
    console.log(matched);
    const rootIndex = matched.indexOf('/dist/');
    const fileRelativePath = matched.substring(rootIndex + 6, matched.length - 1);
    console.log(rootIndex);
    console.log(fileRelativePath);
    return matched;
});

console.log(str);