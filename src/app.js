const path = require("path");
const express = require("express");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
//for partials
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// getting handlebars set up
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// serve up static directory of assets...HTML, CSS, Client side JS
app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Oscar Mugambi",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Oscar Mugambi",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Help Me",
    title: "Help",
    name: "Oscar Mugambi",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: "provide address",
    });
  }
  // res.send({
  //   forecast: "Its raining",
  //   location: req.query.address,
  // });

  geocode(address, (error, { longitude, latitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 help",
    name: "Oscar Mugambi",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Oscar Mugambi",
    errorMessage: "Article not found",
  });
});

app.listen(port, () => {
  console.log("listening" + port);
});
