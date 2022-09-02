import tsPaths from 'tsconfig-paths'
const { absoluteBaseUrl, paths } = tsPaths.loadConfig();
console.log(paths);
const pathMatch = tsPaths.createMatchPath(absoluteBaseUrl, paths);
// // todo: import resolver
// eslint-disable-next-line import/prefer-default-export
export const resolve = (specifier, ctx, nextResolve) => {
    console.log('hello');
    console.log(specifier);
    // return nextResolve(specifier)
}
