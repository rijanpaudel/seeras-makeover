// Import the Express framework to build a web server
const express = require("express");
// Initialize an Express application instance.
// This `app` object is used to set up routes, middleware, and handle HTTP requests.
const app = express();

app.get("/", (req, res)=> {
  res.status(200).send("Sucessfull");
});

const PORT = 5000;
app.listen(PORT, ()=> {
  console.log(`Server running in Port ${PORT}`);
})