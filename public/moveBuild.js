const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const craBuildDir = path.join(__dirname, 'build');
const targetBuildDir = path.join(__dirname, 'extension', 'devtools', 'build');

rimraf(targetBuildDir, () => {
  console.log('Cleaned previous target build directory');
  fs.rename(craBuildDir, targetBuildDir, err => {
    if (err) {
      console.log(
        'Received error before managed to move build dir to target destination:',
        err
      );
    } else {
      console.log(`Moved build to ${targetBuildDir}`);
    }
  });
});
