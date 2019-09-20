# r-wrapper

### Prerequisites
- Node.js 6+
- R 3.0+
  - jsonlite


### Installing
```bash
# install jsonlite
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
     * cwd: '...,
     * env: {...},
     * ...
     */
});
```

### Implementation

Through `src/wrapper.R`, we read in the following parameters as command line arguments:

- R source file path
- R function name
- Function parameters file path
- output file path

We then do the following:

1. `source` the specified file
2. Deserialize the function's parameters using `jsonlite::read_json`
3. `do.call` the specified function, passing in any parameters as a list
4. Write any output to the output file path

We can then write a script (`src/r.js`) to call `wrapper.R` using `Rscript`. This script serializes function parameters to a json file, executes the wrapper, and returns the parsed contents of the output json file after cleaning up after itself.
