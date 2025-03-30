import gulp from "gulp"
import browserSync from "browser-sync"
import rename from "gulp-rename"
import uglify from "gulp-uglify"
import autoprefixer from "gulp-autoprefixer"
import * as dartSass from "sass"
import gulpSass from "gulp-sass"
import htmlMin from "gulp-htmlmin"
const sass = gulpSass(dartSass)

const sassToCSS = async () => {
    return gulp.src('app/scss/*.scss')
        .pipe(sass({ style: 'compressed' }
        ).on('error', sass.logError))
        .pipe(autoprefixer({ovverideBrowserslist: ['last 100 versions'],
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css'))
}

const minHTML = async () => {
    return gulp.src('app/*.html')
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'))
}

const minJS = async () => {
    return gulp.src('app/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/'))
}

const server = async ()=>{
    const browser = browserSync.create()
    browser.init({
        server: "public"
    })
    browser.watch("public/**/*").on("change", browser.reload)
}

const watchFiles = async ()=>{
    gulp.watch("app/scss/*.scss", gulp.series(sassToCSS))
    gulp.watch("app/**/*.html", gulp.series(minHTML))
    gulp.watch("app/**/*.js", gulp.series(minJS))
}

const build = gulp.parallel(watchFiles, server)

export{
    sassToCSS,
    minHTML,
    watchFiles,
    build as default,
    server
}
