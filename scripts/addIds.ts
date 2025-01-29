import { PathLike } from 'fs';
import { FileHandle, readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Function to add a random ID to each element in the array
const addIdsToArray = async (inputFile: PathLike | FileHandle, outputFile: PathLike | FileHandle) => {
    try {
        // Read and parse the JSON file
        const data = JSON.parse(await readFile(inputFile, 'utf8'));

        if (!Array.isArray(data)) {
            throw new Error("Invalid JSON: Expected an array");
        }

        // Add a unique ID to each object in the array
        const updatedData = data.map(item => ({
            ...item,
            id: uuidv4() // Generate a unique random ID
        }));

        // Write the updated array back to a new file
        await writeFile(outputFile, JSON.stringify(updatedData, null, 2));

        console.log(`✅ Successfully added IDs! Updated file: ${outputFile}`);
    } catch (error) {
        let message
        if (error instanceof Error) {
            message = error.message
        } else {
            message = String(error)
        }
        console.error(`❌ Error: ${message}`);
    }
};

// Read input arguments from the command line
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node addIds.mjs input.json output.json");
    process.exit(1);
}

const [inputFile, outputFile] = args;
addIdsToArray(inputFile, outputFile);