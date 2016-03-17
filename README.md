# Yorozuya-Raiyee.github.io
瑞奕惟扬万事屋小组公用仓库，用于学习分享各种知识。

请 Fork 项目后再 Clone 自己的仓库代码到本地。

--

代码编写与构建：

1. 进入项目根目录直接运行`(c)npm i`（建议先安装 [cnpm](http://npm.taobao.org)）
2. 在项目根目录运行 `gulp watch`
3. 编写 *src* 目录下对应的 _HTML_/_JavaScript_/_SCSS_ 文件，文件变动后将自动编译到 *dist* 目录
4. push 代码之前运行 `gulp manifest`
5. 在自己 fork 的 github 项目中提交 *pull request*
6. 到 [源项目](https://github.com/Yorozuya-Raiyee/Yorozuya-Raiyee.github.io)（需要账号密码）确认 *merge*
7. 稍后前往 [项目主页](http://Yorozuya-Raiyee.github.io) 查看实际上线效果

关于项目路径即 CONTEXT ：

由于 *GitHub pages* 项目 CONTEXT 为 */*，为了本地测试时展示与线上相似的效果，建议 *nginx* 配置文件中新增如下配置项：

``` nginx
server {
    listen 8000;
    server_name localhost;

    location / {
        root /YOUR/PATH/TO/LOCAL/Yorozuya-Raiyee.github.io;
    }
}
```

之后直接通过访问 [http://localhost:8000](http://localhost:8000) 项目主页即可。