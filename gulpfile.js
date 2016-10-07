// TODO: investigate writing gulp tasks in Typescript http://www.codeproject.com/Tips/1073438/Create-a-gulpfile-and-Write-gulp-Tasks-Using-TypeS
// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('require-dir')('build/tasks');