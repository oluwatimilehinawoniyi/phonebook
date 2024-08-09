require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Phonebook = require("./models/phonebook");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

const PORT = process.env.PORT;

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((phonebook) => {
    response.json(phonebook);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<div><p>Phonebook has info for ${phonebook.length} people</p><p>${new Date(
      Date.now()
    )}</p></div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Phonebook.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});

app.use((request, response, next) => {
  if (request.method === "POST") {
    console.log("Body:  ", request.body);
    morgan(bodyFormat)(request, response, next);
  } else {
    next();
  }
});

const bodyFormat =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  const newPerson = new Phonebook({
    name: person.name,
    number: person.number,
  });

  newPerson.save().then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
