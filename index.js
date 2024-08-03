const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));
const PORT = process.env.PORT || 3001;
console.log("Port:", PORT);

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/info", (request, response) => {
  response.send(
    `<div><p>Phonebook has info for ${phonebook.length} people</p><p>${new Date(
      Date.now()
    )}</p></div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === id);

  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
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

  const existingName = phonebook.find((p) => p.name === person.name);

  if (existingName) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const id = Math.floor(Math.random() * 1000).toString();
  const newPerson = { id, name: person.name, number: person.number };
  phonebook = phonebook.concat(newPerson);
  response.json(phonebook);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
