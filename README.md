# r-wrapper

### Prerequisites
- Node.js 8+
- R 3.0+
  - jsonlite


### Installing
Ensure that R is in the current user's PATH.

```bash
# install jsonlite (note: Rscript.exe does not pick up all .libPaths() by default unless R_LIBS_USER is set, so the command below installs to the default .Library location)
Rscript -e "install.packages('jsonlite', repos='https://cloud.r-project.org/', lib = .Library)"

npm install --save r-wrapper
```

### Example file: _test.R_
```R
add <- function(a, b) {
    a + b
}

greet <- function(name, adjective) {
    paste('Hello', name, 'the', adjective)
}
```

### Example: run functions from _test.R_
```javascript
const r = require('r-wrapper');

// positional parameters are passed in through arrays
const sum = r('test.R', 'add', [2, 3]);
console.log(sum); // 5

// named parameters are passed in through objects
const greeting = r('test.R', 'greet', {
    name: 'John',
    adjective: 'Wise',
});
console.log(greeting); // "Hello John the Wise"

// child_process.execFileSync options can also be supplied
r('test.R', 'add', [1, 2], {
    /*
     * input: '...',
     * stdio: '...',
     * cwd: '...',
     * env: {...},
     * maxBuffer: x,
     * ...
     */
});
```


### Example: run functions from _test.R_ asynchronously
```javascript
const r = require('r-wrapper').async;

// assuming we have top-level await support, or the following code is executed inside an async function

// positional parameters are passed in through arrays
const sum = await r('test.R', 'add', [2, 3]);
console.log(sum); // 5

// named parameters are passed in through objects
const greeting = await r('test.R', 'greet', {
    name: 'John',
    adjective: 'Wise',
});
console.log(greeting); // "Hello John the Wise"

// child_process.execFile options can also be supplied
await r('test.R', 'add', [1, 2], {
    /*
     * cwd: '...',
     * env: {...},
     * maxBuffer: x,
     * ...
     */
});
```