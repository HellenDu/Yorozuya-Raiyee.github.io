'use strict';

let del = require('del');
let gulp = require('gulp');
let concat = require('gulp-concat');
let hashManifest = require('gulp-json-hash-manifest');
let insert = require('gulp-insert');
let postcss = require('gulp-postcss');
let replace = require('gulp-replace');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let notify = require('gulp-notify');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let shell = require('gulp-shell');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let path = require('path');
let Task = require('shell-task');

var CONTEXT = '';

gulp.task('del', function () {
    del(['dist']);
});

gulp.task('rename-bs-scss', function () {
    return gulp.src('src/common/scss/**/*.scss')
        .pipe(rename(function (path) {
            var basename = path.basename;
            path.basename = basename.substring(basename.indexOf('_') + 1, basename.length);
        }))
        .pipe(gulp.dest('src/common/scss/'));
});

gulp.task('del-original-bs-scss', ['rename-bs-scss'], function () {
    del(['src/common/scss/**/_*.scss']);
});

var compileScss = function (srcPath) {
    return gulp.src(srcPath, {base: 'src'})
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([cssnano({safe: true}), autoprefixer({browsers: '> 1% in CN'})]))
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/scss$/, '/css');
        }))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: CONTEXT + '/src'}))
        .pipe(gulp.dest('dist'));
};

var compileJs = function (srcPath) {
    return gulp.src(srcPath, {base: 'src'})
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: CONTEXT + '/src'}))
        .pipe(gulp.dest('dist'));
};

gulp.task('scss', function () {
    return compileScss(['src/**/scss/*.scss']);
});

gulp.task('bs-js', function () {
    var bootstrapArr = [
        'transition',
        'alert',
        'button',
        'carousel',
        'collapse',
        'dropdown',
        'modal',
        'tooltip',
        'popover',
        'scrollspy',
        'tab',
        'affix'
    ].map(function (module, index) {
        return 'src/common/js/bootstrap/' + module + '.js'
    });

    return gulp.src(bootstrapArr, {base: 'src'})
        .pipe(sourcemaps.init())
        .pipe(concat('common/js/bootstrap.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: CONTEXT + '/src'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    compileJs(['src/**/js/*.js']);
});

gulp.task('manifestJson', function () {
    return gulp.src('dist/**/*.?(js|css|html)')
        .pipe(hashManifest({dest: 'dist'}));
});

gulp.task('replaceManifestJson', function () {
    return gulp.src('dist/hash-manifest.json')
        .pipe(replace(/^\{/gi, '{"hash-manifest.js":' + +new Date + ','))
        .pipe(gulp.dest('dist'));
});

gulp.task('manifestJs', function () {
    return gulp.src('dist/hash-manifest.json')
        .pipe(insert.prepend('var manifest='))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('dist'));
});

// TODO 优化静态资源正则匹配,使用完整相对路径获取对应 hash 值
gulp.task('replace', function () {
    var manifest = require('./dist/hash-manifest.json');
    return gulp.src('src/**/*.html')
        .pipe(replace(/\/([\w\-\.])+(['"]\)})?\?(hashversion)/gi, function (matched) {
            matched = matched.substring(1, matched.length - 12);
            var fileName = matched.replace(/['"]\)}/, '');
            for (var key in manifest) {
                if (key.endsWith('/' + fileName) || key === fileName) {
                    return '/' + matched + '?' + manifest[key];
                }
            }
        }))
        .pipe(gulp.dest('dist'));
});

var manifest = function () {
    new Task('gulp manifestJson')
        .then('gulp replaceManifestJson')
        .then('gulp manifestJs replace')
        .run();
};

gulp.task('build', shell.task([
    'gulp del',
    'gulp scss bs-js js',
    'gulp manifestJson',
    'gulp replaceManifestJson',
    'gulp manifestJs replace'
]));

gulp.task('manifest', manifest);

gulp.task('watch', function () {
    gulp.watch(['src/**/js/*.js'])
        .on('change', function (event) {
            var filePath = event.path;
            compileJs(filePath).pipe(notify(path.basename(filePath) + ' has been complied to <%= file.relative %>!'));
        });

    gulp.watch(['src/**/scss/*.scss', '!src/**/scss/bootstrap*.scss'])
        .on('change', function (file) {
            const filePath = file.path;
            compileScss(path.relative(__dirname, filePath))
                .pipe(notify(path.basename(filePath) + ' has been complied to <%= file.relative %>!'));
        });

    gulp.watch(['src/**/scss/bootstrap/**/*.scss'])
        .on('change', function () {
            compileScss(['src/**/scss/bootstrap*.scss'])
                .pipe(notify('bootstrap*.scss has been complied to <%= file.relative %>!'));
        });

    gulp.watch(['src/**/html/*.html'])
        .on('change', manifest);
});

gulp.task('default', ['build', 'watch']);
