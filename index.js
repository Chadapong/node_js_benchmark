const { performance } = require('perf_hooks');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./isBackend');
const { Console } = require('console');
const { start } = require('repl');

// ADD THIS
var cors = require('cors');
app.use(cors());
const port = 9000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
// healthcare
app.get('/very-complex-query',db.getVeryComplexQuery);
app.get('/complex-query',db.getComplexQuery);

//user
app.post("/create",db.createUser);
app.get("/getUser",db.getUser);
app.put("/editUser",db.editUser);
app.delete("/deleteUser/:username",db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});