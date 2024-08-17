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

app.get("/api/persons", (request, response, next) => {
  Phonebook.find({})
    .then((phonebook) => {
      response.json(phonebook);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  response.send(
    `<div><p>Phonebook has info for ${Phonebook.length} people</p><p>${new Date(
      Date.now()
    )}</p></div>`
  );
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
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

app.put("/api/persons/:id", (request, response, next) => {
  const person = request.body;

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Phonebook.findByIdAndDelete(id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
