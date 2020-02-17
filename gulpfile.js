'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Node Sass se utilizará de forma predeterminada,
// aún así se recomienda que se configure explícitamente
// para mantener una compatibilidad futura en caso de que
// cambie el valor predeterminado.
sass.compiler = require('node-sass');

// Compilar los ficheros SCSS y enviar el CSS resutlante
// en la carpeta /assets/css
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
  .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('../../sass/sourcemap/'))
    .pipe(gulp.dest('./assets/css'));
});

// Vigilar si hay algún cambio en los SCSS
gulp.task('default', function () {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});
