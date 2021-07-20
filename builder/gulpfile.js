const path        = require('path'),
    fs            = require('fs'),
    gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    gulpSass      = require('gulp-sass'),
    gulpCopy      = require('gulp-copy'),
    gulpSvg       = require('gulp-svgmin'),
    gulpImagemin  = require('gulp-imagemin'),
    webpackStream = require('webpack-stream'),
    webpack       = require('webpack'),
    webP          = require('gulp-webp');


'use strict';

let chokidarOptions = {
    alwaysStat: true,
    awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
    }
};

let rootPath = '../',
    sourcePath = rootPath + 'sources/',
    sourcePathForWatch = '/sources/', //проблемы с путями
    buildPath = rootPath + 'public/build/',
    deploymentBuildPath = 'C:/work/muztorg/public/build', //путь для деплоя
    scssConfigPath = path.resolve(path.join('./gulp.scss.js')); //список скриптов стилей для сборки

let subDirsPath = {
    build: {
        styles: 'css/',
        images: 'images/',
        svg: 'svg/',
        bundles: 'js/',
        fonts: 'fonts/'
    },
    src: {
        styles: 'styles/',
        images: 'images/',
        svg: 'svg/',
        bundles: 'js/bundles/',
        fonts: 'fonts/'
    }
};

let scssConfig = require(scssConfigPath),
    scssEntryPoints = scssConfig.entry.map(fileName => {
        return sourcePath + subDirsPath.src.styles + fileName
    });

/*deployment on disk*/
gulp.task('single:deploy', () => {
    console.log(deploymentBuildPath);
    return gulp.src(buildPath + '**/*')
        .pipe(gulpCopy(deploymentBuildPath))
});

gulp.task('single:svg-min', () => {
    return gulp.src(sourcePath + subDirsPath.src.images + subDirsPath.src.svg + '*')
        .pipe(gulpSvg())
        .pipe(gulp.dest(buildPath + subDirsPath.build.images + subDirsPath.build.svg))
});

gulp.task('watch:styles-build', () => {

    watch([sourcePath + subDirsPath.src.styles + '**/*'], chokidarOptions, (event) => {
        let editedFile = sourcePath + subDirsPath.src.styles + event.path.replace(/\\/g, '/').split(sourcePathForWatch + subDirsPath.src.styles)[1], //путь до файла с прямыми слэшами
            editedFileNoExt = editedFile.split('.scss')[0],
            _editedFileNoExt = editedFileNoExt.split(sourcePathForWatch + subDirsPath.src.styles)[1].replace(/\//g, '\\/'); //путь до файла без расширения и с экранированным слэшем

        let buildScss = (changedFile, parentFile) => {
            //определяем, собирается корневой или импортированный файл
            let buildFile = typeof parentFile !== 'undefined' ? parentFile : changedFile.path;

            console.log( `[${(new Date).toLocaleTimeString()}] CHANGED: ${event.path}` );
            gulp.src(buildFile)
                .pipe(gulpSass({
                    outputStyle: 'compressed'
                }))
                .pipe(gulp.dest(buildPath + subDirsPath.build.styles))
                .on('end', () => {
                    console.log( `[${(new Date).toLocaleTimeString()}] BUILD: ${buildFile}` );
                })
        };

        let fileListening = (file) => {
            let foundMatches = false,
                content = fs.readFileSync(file, 'utf-8');

            if ((content.search(RegExp(`^@import.*${_editedFileNoExt}.*$`, 'm')) !== -1) ||
                (content.search(RegExp(`^@import.*${path.basename(_editedFileNoExt)}.*$`, 'm')) !== -1)
            ) {
                return foundMatches = true;
            } else {
                let matchArray = content.match(/^@import.*$/gm);
                if (matchArray !== null) {
                    let i = 0;
                    while (i < matchArray.length) {
                        let subImport = sourcePath + subDirsPath.src.styles + matchArray[i].replace(/(@import).["]+|.*\..\/|(";)/g, '');
                        //return information about matches from loop
                        foundMatches = fileListening(subImport);
                        i++;
                    }
                }
            }

            //async version if less speed
            // fs.readFile(file, 'utf-8', (error, content) => {
            //     if ( error ) { console.log(`Captain we have a problem: ${error}`); }
            //     else {
            //         if ((content.search( RegExp(`^@import.*${_editedFileNoExt}.*$`, 'm' ) ) !== -1 )||
            //             (content.search( RegExp(`^@import.*${path.basename(_editedFileNoExt)}.*$`, 'm' ) ) !== -1)
            //         ) {
            //             return foundMatches = true;
            //         } else {
            //             let matchArray = content.match(/^@import.*$/gm);
            //             console.log(matchArray);
            //             if (matchArray !== null) {
            //                 let i = 0;
            //                 while (i < matchArray.length) {
            //                     let subImport = sourcePath + subDirsPath.src.styles + matchArray[i].replace(/(@import).["]+|.*\..\/|(";)/g, '');
            //                     foundMatches = fileListening(subImport);
            //                     i++;
            //                 }
            //             }
            //         }
            //     }
            // });

            return foundMatches;
        };

        let matchFiles = (element, index, array) => {

            if (editedFile === element) { buildScss(event, element) }
            else {
                if(fileListening(element)) { buildScss(event, element) }
            }
        };

        scssEntryPoints.find(matchFiles);
    });
});

gulp.task('watch:deploy', () => {
    watch([buildPath + subDirsPath.build.styles], (event) => {
        gulp.start('single:deploy');
    })
});

gulp.task('watch:images-min', () => {
    return watch([sourcePath + subDirsPath.src.images + '/**'], (event) => {
        console.log('[' + (new Date).toLocaleTimeString() + ']' + 'CHANGED: ' + event.path);

        let changedFile = event.path.replace(/\\/g, '/').split(sourcePathForWatch + subDirsPath.src.images)[1],
            changedFilePath = path.dirname(changedFile);

        if (fs.existsSync(event.path)) {
            gulp.src(sourcePath + subDirsPath.src.images + changedFile)
                .pipe(gulpImagemin([
                    gulpImagemin.optipng({
                        optimizationLevel: 5
                    }),
                    gulpImagemin.jpegtran({
                        optimizationLevel: 5
                    }),
                    gulpImagemin.svgo({
                        plugins: [
                            {cleanupAttrs: true},
                            {removeViewBox: true},
                            {cleanupIDs: false}
                        ]
                    })
                ], {
                    verbose: true
                }))
                .pipe(gulp.dest(buildPath + subDirsPath.build.images + changedFilePath))
                .pipe(webP({
                    quality: 100,
                    sharpness: 4
                }))
                .pipe(gulp.dest(buildPath + subDirsPath.build.images + changedFilePath));

            console.log('[' + (new Date).toLocaleTimeString() + ']' + 'OPTIMIZED: ' + buildPath + subDirsPath.build.images + changedFile);
        } else {
            console.log('[' + (new Date).toLocaleTimeString() + ']' + ' DELETED:   ' + event.path)
        }
    })
});

// gulp.task('webpack', () => {
//     gulp.src(sourcePath + subDirsPath.src.bundles)
//         .pipe(named())
//         .pipe(webpackStream({
//             config: require('./webpack.config.js')
//         }))
//         .pipe(gulp.dest(buildPath + subDirsPath.build.bundles))
//
// });

gulp.task('webpack-stream', () => {
	gulp.src(`${sourcePath}${subDirsPath.src.bundles}`)
		.pipe(webpackStream({
			watch: true,
			config: require('./webpack.config.js')
		}, webpack))
		.pipe(gulp.dest(`${buildPath}${subDirsPath.build.bundles}`))
});
