import mongoose from "mongoose";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// MongoDB Atlas connection string
const MONGO_URI =
  "mongodb+srv://AG2199:JAMK2026@cluster0.bfs47ll.mongodb.net/e03?retryWrites=true&w=majority";

// Schema
const nameSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true }
});

const Name = mongoose.model("Name", nameSchema);

// CLI setup
const argv = yargs(hideBin(process.argv))
  .command("add <firstname> <lastname>", "Add a new name")
  .help()
  .parse();

async function main() {
  await mongoose.connect(MONGO_URI);

  // No arguments list names
  if (argv._.length === 0) {
    const names = await Name.find({});
    console.log("Saved names:");
    names.forEach((n, i) =>
      console.log(`${i + 1}. ${n.firstname} ${n.lastname}`)
    );
  }

  // Add new name
  if (argv._[0] === "add") {
    const newName = await Name.create({
      firstname: argv.firstname,
      lastname: argv.lastname
    });

    console.log("Name added:");
    console.log(`${newName.firstname} ${newName.lastname}`);
  }

  mongoose.connection.close();
}

main();
