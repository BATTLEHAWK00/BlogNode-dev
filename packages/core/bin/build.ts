/* eslint-disable no-console,import/no-extraneous-dependencies */
import gulp from 'gulp';
import path from 'path';
import esbuild from 'esbuild';
import { replaceTscAliasPaths } from 'tsc-alias';
import glob from 'glob';

const dirname = path.dirname(new URL(import.meta.url).href.replace('file:///', ''));
console.log(dirname);

function resolve(...paths: string[]) {
  return path.resolve(dirname, ...paths);
}

const tsConfigPath = resolve('../tsconfig.json');
const distDir = resolve('../dist/');

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
    format: 'esm',
    treeShaking: true,
    minify: true,
    resolveExtensions: ['.js', '.ts'],
    outdir: distDir,
    tsconfig: tsConfigPath,
  });
  cb();
};

const aliasTransform = async () => {
  console.log('Transforming alias path...');
  replaceTscAliasPaths({
    configFile: tsConfigPath,
  });
};

const copyNonTsFiles = () => {
  console.log('Copy non-ts files...');

  return gulp
    .src('src/**/*', {
      base: resolve('../'),
      ignore: '**/*.ts',
    })
    .pipe(gulp.dest('dist/'));
};

gulp.series(
  compileTask,
  aliasTransform,
  copyNonTsFiles,
)((err) => err);
