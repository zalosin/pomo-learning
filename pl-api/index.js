/**
 * Server imports
 */
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
/**
 * DB imports
 */
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync("db.json");
/**
 * Server setup
 */
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
/**
 * Actual logic
 */
low(adapter)
    .then(db => {
        app.post("/login", (request, response) => {
            const test = db
                .get("users")
                .find({ username: request.body.username })
                .value();
            console.log(
                `test -> ${JSON.stringify(
                    test.password
                )} req password -> ${JSON.stringify(request.body.password)}`
            );
            if (test.password === request.body.password) {
                response.status(200).send({
                    success: true
                });
            } else {
                response.status(404).send({
                    error: "Username or password invalid",
                    success: false
                });
            }
        });
    })
    .then(() => {
        app.listen(port, () => console.log(`Running on port ${port}`));
    });
