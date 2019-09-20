# r-wrapper

## Getting Started

### Prerequisites
- Node.js 6+
- R 3.0+
  - jsonlite


### Install package
```bash
# install jsonlite before use
R -e "install.packages('jsonlite', repos='https://cloud.r-project.org/')"

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

### Run functions from _test.R_
```javascript
const r = require('r-wrapper');
const path = require('path');

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
     * cwd: '...,
     * env: {...},
     * ...
     */
});
```