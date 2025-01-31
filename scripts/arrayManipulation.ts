import { PathLike } from "fs";
import { FileHandle, readFile, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

function handleError(error: unknown) {
  let message;
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }
  console.error(`❌ Error: ${message}`);
}

async function readArrayInput(inputFile: PathLike | FileHandle) {
  try {
    const data = JSON.parse(await readFile(inputFile, "utf8"));

    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON: Expected an array");
    }
    return data as Array<any>;
  } catch (error) {
    handleError(error);
  }
}

async function writeOutput(data: any, outputFile: PathLike | FileHandle) {
  try {
    await writeFile(outputFile, JSON.stringify(data, null, 2));
  } catch (error) {
    handleError(error);
  }
}

// Function to add a random ID to each element in the array
async function addIdsToArray(
  inputFile: PathLike | FileHandle,
  outputFile: PathLike | FileHandle
) {
  const data = (await readArrayInput(inputFile)) || [];

  const updatedData = data.map((item) => ({
    ...item,
    id: uuidv4(),
  }));

  await writeOutput(updatedData, outputFile);

  console.log(`✅ Successfully added IDs! Updated file: ${outputFile}`);
}

async function filterArray(
  inputFile: PathLike | FileHandle,
  outputFile: PathLike | FileHandle
) {
  const data = (await readArrayInput(inputFile)) || [];

  const updatedData = data.filter(
    (item) => item.category === "monthly" || item.category === "weekly"
  );

  await writeOutput(updatedData, outputFile);

  // const set = new Set();
  // for (const item of data) {
  //   set.add(item.category);
  // }

  // console.log(set);

  console.log(`✅ Successfully filtered array! Updated file: ${outputFile}`);
}

// Read input arguments from the command line
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node addIds.mjs input.json output.json");
  process.exit(1);
}

const [command, inputFile, outputFile] = args;

switch (command) {
  case "addId":
    addIdsToArray(inputFile, outputFile);
    break;

  case "filter":
    filterArray(inputFile, outputFile);
    break;

  default:
    console.log("unknown command");
    break;
}
