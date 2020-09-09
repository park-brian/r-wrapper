const { readFile, writeFile, unlink, mkdtemp, rmdir } = require('fs').promises;
const execFile = require('util').promisify(require('child_process').execFile);
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
async function r(sourceFilePath, functionName, functionArgs, execFileOptions) {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'r-'));
    const inputFilePath = path.join(tempDir, 'input.json');
    const outputFilePath = path.join(tempDir, 'output.json');
    let output;

    try {
        // creates the json parameters file
        if (functionArgs !== undefined) {
            await writeFile(
                inputFilePath,
                JSON.stringify(functionArgs)
            );
        }

        // runs the wrapper against the provided arguments
        await execFile(
            'Rscript', [
                path.resolve(__dirname, '../wrapper.R'),
                sourceFilePath,
                functionName,
                inputFilePath,
                outputFilePath
            ], execFileOptions
        );

        try {
            // read output file if it exists
            output = JSON.parse(String(await readFile(outputFilePath)))
        } catch (e) {
            // output file does not exist, do nothing
        }

    } finally {
        try {
            // clean up temporary files
            await unlink(inputFilePath);
            await unlink(outputFilePath);
            await rmdir(tempDir);
        } catch(e) {
            // do nothing if files do not exist
        }
    }

    return output;
}