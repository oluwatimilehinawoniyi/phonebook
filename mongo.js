// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];
// const url = `mongodb+srv://phonebook:${password}@phonebook.6uzof.mongodb.net/phonebooks?retryWrites=true&w=majority&appName=phonebook`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// // SCHEMA
// const phonebookSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Phonebook = mongoose.model("Phonebook", phonebookSchema);

// if (process.argv.length === 3) {
//   // LIST ENTRIES
//   Phonebook.find({}).then((result) => {
//     console.log("phonebook:");
//     result.forEach((phonebook) =>
//       console.log(`${phonebook.name} ${phonebook.number}`)
//     );
//     mongoose.connection.close();
//   });
// } else {
//   // ADD ENTRIES
//   const phonebook = new Phonebook({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   phonebook.save().then((result) => {
//     console.log(`added ${result.name} ${result.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }
