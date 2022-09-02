/* eslint-disable no-console,import/no-extraneous-dependencies */
import gulp from 'gulp';
import path from 'path';
import esbuild from 'esbuild';
import { replaceTscAliasPaths } from 'tsc-alias';
import glob from 'glob';
import tsPaths from 'tsconfig-paths';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

const dirname = path.dirname(new URL(import.meta.url).href.replace('file:///', ''));
console.log(dirname);

function resolve(...paths: string[]) {
  return path.resolve(dirname, ...paths);
}

const tsConfigPath = resolve('../tsconfig.json');
const distDir = resolve('../dist/');
// const { absoluteBaseUrl, paths } = tsPaths.loadConfig(resolve('../'));
// const matchPaths = tsPaths.createMatchPath(absoluteBaseUrl, paths);

// const tsPathsPlugin: esbuild.Plugin = {
//   name: 'example',
//   setup(build) {
//     build.onResolve({ filter: /^example$/ }, async () => {
//       const result = await build.resolve('./foo', { resolveDir: './bar' });
//       if (result.errors.length > 0) {
//         return { errors: result.errors };
//       }
//       return { path: result.path, external: true };
//     });
//   },
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compileTask = async (cb: any) => {
  console.log('Compiling typescripts...');
  await esbuild.build({
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
    plugins: [esbuildPluginAliasPath()],
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
