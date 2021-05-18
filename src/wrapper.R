args = commandArgs(trailingOnly = TRUE)
sourceFile <- args[1]
functionName <- args[2]
functionArgumentsFile <- args[3]
outputFile <- args[4]

source(sourceFile)
functionArguments <- list()
if (file.exists(functionArgumentsFile))
    functionArguments <- jsonlite::read_json(functionArgumentsFile, simplifyDataFrame = T)
output <- do.call(functionName, as.list(functionArguments))
jsonlite::write_json(output, outputFile, auto_unbox = TRUE, force = TRUE, na = "null")
