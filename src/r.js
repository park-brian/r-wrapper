const { execFileSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { tmpdir } = require('os');
const path = require('path');

module.exports = r;

/**
 * Runs a function from an R source file using wrapper.R.
 * This function requires jsonlite to be installed.
 * @param {string} sourceFilePath - The absolute path to the source file
 * @param {string} functionName - The function to call
 * @param {array|object} functionArgs - An array consisting of positional parameters. If an object is provided, named parameters are used instead.
 * @param {object} execFileOptions - An object containing options for child_process.execFileSync
 */
function r(sourceFilePath, functionName, functionArgs, execFileOptions) {
    let inputFilePath = tempFilePath('.json');
    let outputFilePath = tempFilePath('.json');
    let output;

    // creates the json parameters file
    if (functionArgs !== undefined) {
        writeFileSync(
            inputFilePath,
            JSON.stringify(functionArgs)
        );
    }

    // runs the wrapper against the provided arguments
    execFileSync(
        'Rscript', [
            path.resolve(__dirname, 'wrapper.R'),
            sourceFilePath,
            functionName,
            inputFilePath,
            outputFilePath
        ], execFileOptions
    );

    // populate output file if it exists
    if (existsSync(outputFilePath)) {
        output = JSON.parse(
            readFileSync(outputFilePath)
        );
    }

    // clean up temporary files
    // note: if an exception is thrown, these files
    // should not be cleaned up.
    [inputFilePath, outputFilePath].forEach(filePath => {
        if (existsSync(filePath)) unlinkSync(filePath);
    });

    return output;
}

/**
 * Generates a unique, temporary file path in the system's temp directory
 * @param {string} suffix - an optional suffix
 */
function tempFilePath(suffix) {
    do {
        var filePath = path.join(
            tmpdir(),
            Math.random() + (suffix || '')
        );
    } while (existsSync(filePath));

    return filePath;
}