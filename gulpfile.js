const { src, dest, parallel, series, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();

const IS_PROD = process.env.NODE_ENV === 'production';
const BUILD_DIR = './build/';

const styles = () => src('./src/styles/styles.scss')
  .pipe(plugins.sass().on('error', plugins.sass.logError))
  .pipe(plugins.autoprefixer({ cascade: false }))
  .pipe(plugins.if(IS_PROD, plugins.sass({ outputStyle: 'compressed' })))
  .pipe(dest(BUILD_DIR));

const presets = ['@babel/env'];
if (IS_PROD) {
  presets.push(['minify', {
    'mangle': {
      'keepFnName': true
    }
  }]);
}
const scripts = () => src('./src/js/main.js')
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel({
      presets,
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining']
  }))

  .pipe(plugins.sourcemaps.write(BUILD_DIR))
  .pipe(dest(BUILD_DIR));

const html = () => src('./src/index.html')
  .pipe(plugins.if(IS_PROD, plugins.htmlmin({ removeComments: true, collapseWhitespace: true })))
  .pipe(dest(BUILD_DIR));

const server = done => plugins.serve({
  root: [BUILD_DIR],
  port: 8080
})(done);

const watcher = () => {
  watch('./src/styles/**', styles);
  watch('./src/js/**', scripts);
  watch('./src/index.html', html);
};

const main = done => parallel(server, styles, html, scripts, watcher)(done);
const build = done => parallel(styles, html, scripts)(done);

exports.default = main;
exports.build = build;
