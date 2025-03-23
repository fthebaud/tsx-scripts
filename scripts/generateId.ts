import { v4 as uuidv4 } from "uuid";

function generateID() {
  const id = uuidv4();
  console.log(id);
}

generateID();
