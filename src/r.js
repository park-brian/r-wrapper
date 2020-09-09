const { execFileSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync, unlinkSync, rmdirSync, mkdtempSync } = require('fs');
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
    const tempDir = mkdtempSync(path.join(tmpdir(), 'r-'));
    const inputFilePath = path.join(tempDir, 'input.json');
    const outputFilePath = path.join(tempDir, 'output.json');
    let output;

    try {
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
                readFileSync(outputFilePath).toString()
            );
        }
    } finally {
        try {
            // clean up temporary files
            unlinkSync(inputFilePath);
            unlinkSync(outputFilePath);
            rmdirSync(tempDir);
        } catch(e) {
            // do nothing if files do not exist
        }
    }

    return output;
}