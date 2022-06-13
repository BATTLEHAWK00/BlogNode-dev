/* eslint-disable no-console,import/no-extraneous-dependencies */
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as path from 'path';
import { replaceTscAliasPaths } from 'tsc-alias';

const tsProject = ts.createProject(path.resolve(__dirname, '../tsconfig.json'), {
  declaration: true,
  // eslint-disable-next-line global-require
  typescript: require('typescript'),
  declarationFiles: true,
});

const compileTask = () => {
  console.log('Compiling typescripts...');

  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
};

const aliasTransform = async () => {
  console.log('Transforming alias path...');
  replaceTscAliasPaths({
    configFile: path.resolve(__dirname, '../tsconfig.json'),
  });
};

const copyNonTsFiles = () => {
  console.log('Copy non-ts files...');

  return gulp
    .src('src/**/*', {
      base: path.resolve(__dirname, '../'),
      ignore: '**/*.ts',
    })
    .pipe(gulp.dest('dist/'));
};

gulp.series(
  compileTask,
  aliasTransform,
  copyNonTsFiles,
)((err) => err);
