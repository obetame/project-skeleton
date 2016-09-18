var gulp = require('gulp');
var path = require('path');
var webpack = require('gulp-webpack');
var rename = require('gulp-rename');//更改名字
var uglify = require('gulp-uglify');//js代码压缩
var sass = require('gulp-sass');
var notify = require('gulp-notify');//通知信息
var autoprefixer = require('gulp-autoprefixer');
var html2jade = require('gulp-html2jade');

// 转换所有sass文件
gulp.task('sass',function(){
	return gulp.src('./sass/*.scss')
		.pipe(sass.sync().on('error',sass.logError))
		.pipe(autoprefixer({
				browsers: ['last 2 versions','last 3 Safari versions'],
				cascade: true,
				remove:true
		}))
		.pipe(gulp.dest('./src'));
});

// 监控所有的js文件
gulp.task('sass:watch', function () {
	gulp.watch('./sass/*.scss',['sass']);
});

gulp.task('html',function(){
	return gulp.src('.html/*.html')
		.pipe(html2jade({nspaces:2}))
		.pipe(gulp.dest('views/'));
});

// 使用ES5语法编写的js文件
gulp.task('default',['sass'],function() {
	return gulp.src('src/main.js')
		.pipe(webpack({
			watch:true,
			output:{
				filename:'bundle-main.js'
			},
			module:{
				loaders:[
					{
					// 这是处理css文件
						test:/\.css$/,
						loaders:["style","css"]
					},
				]
			}
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

// 使用es6的js文件
gulp.task('es6',function() {
	return gulp.src('src/main.js')
		.pipe(webpack({
			watch:true,
			output:{
				filename:'es6-main.js'
			},
			module:{
				loaders:[
					{
						//这是处理es6文件
						test:/\.js$/,
						loader:'babel-loader',
						query:{
							presets:['es2015'],
							compact: false
						}
					},
					{
					// 这是处理css文件
						test:/\.vue$/,
						loader:"vue"
					},
					{
						test: /\.png$/,
						loader: "file-loader?name=picture/[name].[ext]"
					},
					{
					// 这是处理css文件
						test:/\.css$/,
						loaders:["style","css"]
					},
				]
			}
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

// 压缩所有的js文件
gulp.task('compress:all',function() {
	return gulp.src('dist/*.js')
		.pipe(uglify())//生产的时候再启用压缩
		.pipe(rename(function (path) {
			path.dirname += "/uglify";
			path.basename += "-min";
			path.extname = ".js";
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});

//使用webapp打包所有的js文件
gulp.task('packjs',function() {
	return gulp.src('src/*.js')
		.pipe(webpack({
			watch:false,
			entry:{
				webapp1:'./src/webapp1.js',
				webapp2:'./src/webapp2.js',
				webapp3:'./src/webapp3.js',
			},
			output:{
				filename:'bundle-[name].js'
			},
			module:{
				loaders:[
					{
					// 这是处理css文件
						test:/\.css$/,
						loaders:["style","css"]
					},
				]
			}
		}))
		// .pipe(uglify())//生产的时候再启用压缩
		.pipe(gulp.dest('dist/'))
		.pipe(notify("<%= file.relative %> 成功生成!"));
});