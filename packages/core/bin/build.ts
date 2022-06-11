/* eslint-disable no-console,import/no-extraneous-dependencies */
import gulp from 'gulp';
import ts from 'gulp-typescript';
import path from 'path';
import { replaceTscAliasPaths } from 'tsc-alias';

const tsProject = ts.createProject(path.resolve(__dirname, '../tsconfig.json'));

const compileTask = () => {
  console.log('Compiling typescripts...');

  return tsProject
    .src()
    .pipe(tsProject())
    .js
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
