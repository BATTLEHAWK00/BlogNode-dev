const gulp = require('gulp')
const path = require('path')
const ts = require('gulp-typescript')
const {replaceTscAliasPaths } = require('tsc-alias')

const tsProject = ts.createProject(path.resolve(__dirname,'../tsconfig.json'));


const compileTask = ()=>tsProject.src()
.pipe(tsProject())
.js
.pipe(gulp.dest('dist'))

const aliasTransform=()=>replaceTscAliasPaths({configFile:path.resolve(__dirname,'../tsconfig.json')})

const copyNonTsFiles=()=>gulp.src('src/**/*',{base:path.resolve(__dirname,"../"), ignore:'**/*.ts'})
.pipe(gulp.dest('dist/'))

gulp.series(compileTask,aliasTransform,copyNonTsFiles)(()=>{

})
