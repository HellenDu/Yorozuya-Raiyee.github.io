+function(){var e="/dist";require.config({baseUrl:e,urlArgs:"undefined"==typeof manifest||function(r,n){return 0===n.indexOf(e)&&(n=n.replace(e+"/","")),"?"+manifest[n]},paths:{jquery:"common/js/jquery-1.12.1",bootstrap:"common/js/bootstrap"}}),require(["jquery"],function(e){alert("requireJs 加载成功！当前使用的 jQuery 版本为："+e().jquery+"！")})}();
//# sourceMappingURL=ife-config.js.map
