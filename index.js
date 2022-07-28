const { response } = require("express");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const App = express();
App.use(express.static("build"));
App.use(cors());
App.use(express.json());

// App.use(morgan("token"));

// morgan.token("body", (req) => {
//   return JSON.stringify(req.body);
// });

// App.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :body")
// );

// App.use(
//   morgan((tokens, req, res) => {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       JSON.stringify(req.body),
//     ].join(" ");
//   })
// );

App.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

App.get("/", (request, response) => {
  response.send("");
});

App.get("/persons", (request, response) => {
  response.json(persons);
});

App.get("/info", (request, response) => {
  response.send(`<div>
        Phonebook has info for ${persons.length} people </div>
    <div> ${new Date()} </div>`);
});

App.get("/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personId = persons.find((x) => x.id === id);
  if (personId) response.json(personId);
  else
    response
      .status(404)
      .send({ error: 404, message: ` There is no person with id ${id}` });
});

App.delete("/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((x) => x.id !== id);
  response.status(204).end();
});

App.post("/persons/", (request, response) => {
  let newInfo = request.body;

  newInfo.id = Math.floor(Math.random() * 1000000);

  if (!newInfo.name) response.status(404).send({ Errror: `Name is empty` });
  if (!newInfo.number) response.status(404).send({ Errror: `Number is empty` });

  let filteredName = persons.filter((x) => x.name === newInfo.name);
  if (filteredName.length !== 0)
    response
      .status(404)
      .send({ Errror: ` ${newInfo.name} is already exists in the phonebook` });
  else {
    response.status(201).json(newInfo);
    persons.push(newInfo);
  }
});

const PORT = process.env.PORT || "3001";
App.listen(PORT, () => console.log(`lsitening on ${PORT}`));
