var gulp = require('gulp');
var gutil = require('gulp-util');
var concatJS = require('gulp-concat');
var sassCompile = require('gulp-sass');
var sassGlob = require('gulp-css-globbing');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserSync = require('browser-sync'),
    reload = browserSync.reload;
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var merge = require('merge-stream');
var angularFilesort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var compressHtml = require('gulp-minify-html');
var mainBowerFiles = require('main-bower-files');
var imageop = require('gulp-image-optimization');
var runSequence = require('run-sequence');
var cleanPath = require('gulp-clean');
var stripDebug = require('gulp-strip-debug');
var argv = require('yargs').argv;
var replace = require('gulp-replace-task');
var gulpif = require('gulp-if');
var exec = require('child_process').exec;

var paths = {
    desenvolvimento: 'src',
    producao: 'www',
    sass: ['./src/assets/styles/scss/**/*.scss', './src/modules/**/*.scss']
};

/*tasks dev*/
gulp.task('bower-wiredep', bowerInjectFiles);
gulp.task('serve', serve);
gulp.task('watch', watch);
gulp.task('sass', sass);
gulp.task('wiredep', ['bower-wiredep'], wiredep);
gulp.task('default', ['serve']);

/*prod*/
gulp.task('plugin-install', pluginInstall);
gulp.task('compress', compress);
gulp.task('replaceurl', replaceUrl);
gulp.task('compresslib', compressLib);
gulp.task('wiredepproducao',  wiredepProducao);
gulp.task('stripdebugs', stripdebugs);
gulp.task('build', ['clean'], builder);
gulp.task('clean', clean);
gulp.task('copy', ['clean'], copy);
gulp.task('debug', debugBuild)

function debugBuild() {
    runSequence('wiredep', 'bower-wiredep', 'copy');
}

function copy() {
    return gulp.src('**/* ', {
            cwd: paths.desenvolvimento
        })
        .pipe(gulp.dest(paths.producao));
}


var imgFilter = gulpFilter(['*.{png,jpg,jpeg,gif}'], {
    restore: true
})
var fontFilter = gulpFilter(['*.{eot,svg,ttf,woff}'], {
    restore: true
})

function builder() {
    runSequence('clean', 'sass', 'compresslib', 'compress', 'stripdebugs', 'replaceurl', 'wiredepproducao');
}

function replaceUrl() {

    function replacement() {
        var func;
        if (argv.p) {
            func = replace({
                patterns: [{
                    match: "basepath",
                    replacement: 'PROD'
                }]
            })
        } else if (argv.h) {
            func = replace({
                patterns: [{
                    match: "basepath",
                    replacement: 'HOMO'
                }]
            })
        } else if (argv.d) {
            func = replace({
                patterns: [{
                    match: "basepath",
                    replacement: 'DEV'
                }]
            })
        } else {
            func = replace();
        }
        return func;
    }

    return gulp.src(['./app.min.js'], {
            cwd: paths.producao
        })
        .pipe(replacement())
        .pipe(gulp.dest('./', {
            cwd: paths.producao
        }));
}

function clean() {
    var target = gulp.src(paths.producao);
    return target
        .pipe(cleanPath({
            force: true
        }));
}

function stripdebugs() {
    var target = gulp.src(['./**/*.js'], {
        cwd: paths.producao
    });
    return target
        .pipe(stripDebug())
        .pipe(gulp.dest('./', {
            cwd: paths.producao
        }));
}

function wiredepProducao(done) {
    var target = gulp.src('index.html', {
        cwd: paths.producao
    })

    var js = target.pipe(inject(gulp.src(['./**/*.js', '!./lib/**/*', './**/*.css'], {
        cwd: paths.producao
    }), {
        starttag: '<!--files:{{ext}}-->',
        addRootSlash: false
    })).pipe(gulp.dest(paths.producao));


    var lib = target.pipe(inject(gulp.src(['./lib/**/*', '!./lib/ionic/**/*', '!./lib/**/*.html'], {
            cwd: paths.producao
        }), {
            starttag: '<!--bower:{{ext}}-->',
            addRootSlash: false
        }))
        .pipe(gulp.dest(paths.producao));

    return merge(js, lib);
}


function bowerInjectFiles() {
    var target = gulp.src('./index.html', {
        cwd: paths.desenvolvimento
    });
    var sources = gulp.src(mainBowerFiles({
        path: './',
        overrides: {
            "angular": { //name of package you want to ignore
                "main": [
                    // keep this blank to skip the entire package
                ]
            },
            "font-awesome" : {
                "main" : [
                    "css/font-awesome.min.css"
                ]
            }
        },
        debugging: true
    }), {
        read: false
    });
    return target
        .pipe(inject(sources, {
            name: 'bower',
            addRootSlash: false,
            starttag: '<!-- bower:{{ext}} -->',
            relative: true
        }))
        .pipe(gulp.dest(paths.desenvolvimento))
}

function compressLib() {
    //CÓDIGO REPETIDO POIS PLUGIN (GULP-FILTER) NÃO SUPORTA RE-USO DE STREAM.
    var jsFilter = gulpFilter(['**/*.js'], {
        restore: true
    });
    var cssFilter = gulpFilter(['**/*.css'], {
        restore: true
    });

    var sources = gulp.src(mainBowerFiles({
            path: './'
        }));

    var lib = sources
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(concatJS('lib.min.js'))
        .pipe(gulp.dest('./lib', {
            cwd: paths.producao
        }))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(concatCss('lib.min.css'))
        .pipe(gulp.dest('./lib', {
            cwd: paths.producao
        }))

    var espcFilter = gulpFilter(['*.js'], {
        restore: true
    })
    var libIonic = gulp.src(['!**/*.html', './lib/ionic/js/ionic.bundle.min.js', './lib/ionic/fonts/**'], {
            cwd: paths.desenvolvimento
        })
        .pipe(espcFilter)
        .pipe(gulp.dest('./lib/ionic/js', {
            cwd: paths.producao
        }))
        .pipe(espcFilter.restore)
        .pipe(fontFilter)
        .pipe(gulp.dest('./lib/ionic/fonts', {
            cwd: paths.producao
        }))


    return merge(lib, libIonic);
}

function compress(done) {
    //CÓDIGO REPETIDO POIS PLUGIN (GULP-FILTER) NÃO SUPORTA RE-USO DE STREAM.
    var jsFilter = gulpFilter(['**/*.js'], {
        restore: true
    });
    var cssFilter = gulpFilter(['**/*.css'], {
        restore: true
    });
    var htmlFilter = gulpFilter(['**/*.html'], {
        restore: true
    });

    var fontFilter = gulpFilter(['**/*.{eot,svg,ttf,woff,otf}'], {
        restore: true
    });

    var sources = gulp.src(['./**/*.js', '!./lib/**/*', './assets/fonts/**/*', './assets/**/*.css', './**/*.html', './assets/img/**/*.{png,jpg,jpeg,gif}'], {
        cwd: paths.desenvolvimento
    });

    var stream = sources
        .pipe(jsFilter)
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(concatJS('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./', {
            cwd: paths.producao
        }))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concatCss('app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./assets', {
            cwd: paths.producao
        }))
        .pipe(cssFilter.restore)
        .pipe(htmlFilter)
        .pipe(compressHtml({
            comments: true,
            conditionals: true,
            loose: true
        }))
        .pipe(gulp.dest(paths.producao))
        .pipe(htmlFilter.restore)
        .pipe(fontFilter)
        .pipe(gulp.dest('./assets/fonts', {
            cwd: paths.producao
        }))
        .pipe(fontFilter.restore)
        .pipe(imgFilter)
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./assets/img', {
            cwd: paths.producao
        }))
        .pipe(imgFilter.restore);


    return stream;
}


function wiredep() {
    var target = gulp.src('index.html', {
        cwd: paths.desenvolvimento
    })

    var js = target.pipe(inject(gulp.src(['./**/*.js', '!lib/**/*'], {
        cwd: paths.desenvolvimento
    }).pipe(angularFilesort()), {
        starttag: '<!-- files:{{ext}} -->',
        addRootSlash: false
    })).pipe(gulp.dest(paths.desenvolvimento));

    var css = target.pipe(inject(gulp.src(['./assets/**/*.css'], {
            cwd: paths.desenvolvimento
        }), {
            starttag: '<!-- files:{{ext}} -->',
            addRootSlash: false
        }))
        .pipe(gulp.dest(paths.desenvolvimento));

    return merge(js, css);
}

function serve() {
    browserSync({
        port: 9000,
        server: {
            baseDir: 'src'
        },
        ui: {
            port: 8100
        }
    });
    gulp.watch(['src/**/*.html', 'src/**/*.js', 'src/assets/**/*.css'], reload);
    watch();
}

function sass() {
    gulp.src(['./assets/styles/scss/**/*.scss', './modules/**/*.scss'], {
        cwd: paths.desenvolvimento
    }) 
        .pipe(sassGlob({
            extensions: ['.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(sassCompile({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./assets/styles/css/', {
            cwd: paths.desenvolvimento
        }));
}

function watch() {
    gulp.watch(paths.sass, ['sass']);
}


function pluginInstall() {
    require('./plugins.json')
        .forEach(function(plugin) {
            exec('cordova plugin add ' + plugin, function(code, output) {
                console.log(output);
            });
        });
}