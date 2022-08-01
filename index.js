const { response } = require("express");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Detail = require("./models/note");

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

let persons = [];

App.get("/", (request, response) => {
  response.send("");
});

App.get("/persons", (request, response) => {
  Detail.find().then((result) => response.json(result));
  // response.json(persons);
});

App.get("/info", (request, response) => {
  response.send(`<div>
        Phonebook has info for ${persons.length} people </div>
    <div> ${new Date()} </div>`);
});

App.get("/persons/:id", (request, response, next) => {
  Detail.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
      // response.status(400).send({ error: "malformatted id" });
    });
});
//   const id = Number(request.params.id);
//   const personId = persons.find((x) => x.id === id);
//   if (personId) response.json(personId);
//   else
//     response
//       .status(404)
//       .send({ error: 404, message: ` There is no person with id ${id}` });
// });

App.delete("/persons/:id", (request, response, next) => {
  Detail.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
// App.delete("/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((x) => x.id !== id);
//   response.status(204).end();
// });

App.post("/persons", (request, response, next) => {
  let newInfo = request.body;

  newInfo.id = Math.floor(Math.random() * 1000000);
  let detail = new Detail({
    name: newInfo.name,
    number: newInfo.number,
  });

  // if (!newInfo.name) response.status(404).send({ Errror: `Name is empty` });
  // if (!newInfo.number) response.status(404).send({ Errror: `Number is empty` });

  let filteredName = persons.filter((x) => x.name === newInfo.name);
  if (filteredName.length !== 0)
    response
      .status(404)
      .send({ Errror: ` ${newInfo.name} is already exists in the phonebook` });
  else {
    detail
      .save()
      .then((savedNote) => {
        response.json(savedNote);
      })
      .catch((error) => next(error));
  }
});
//   else {
//     response.status(201).json(newInfo);
//     persons.push(newInfo);
//   }
// });

App.put("/persons/:id", (request, response, next) => {
  const body = request.body;

  const detail = {
    name: body.name,
    number: body.number,
  };

  Detail.findByIdAndUpdate(request.params.id, detail, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedDetail) => {
      response.json(updatedDetail);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
App.use(errorHandler);

const PORT = process.env.PORT || "3001";
App.listen(PORT, () => console.log(`lsitening on ${PORT}`));
