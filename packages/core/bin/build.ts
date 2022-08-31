/* eslint-disable no-console,import/no-extraneous-dependencies */
import * as gulp from 'gulp';
import * as path from 'path';
import * as esbuild from 'esbuild';
import { replaceTscAliasPaths } from 'tsc-alias';
import glob from 'glob';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compileTask = (cb: any) => {
  console.log('Compiling typescripts...');
  esbuild.buildSync({
    entryPoints: [
      ...glob.sync('**/*.ts', { ignore: ['node_modules/**/*', '*.d.ts'] }),
    ],
    bundle: false,
    target: 'node16',
    platform: 'node',
    format: 'cjs',
    treeShaking: true,
    minify: true,
    resolveExtensions: ['.js', '.ts'],
    outdir: path.resolve(__dirname, '../dist/'),
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
  });
  cb();
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
