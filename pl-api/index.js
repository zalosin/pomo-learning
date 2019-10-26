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
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
/**
 * Server setup
 */
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.listen(port);
/**
 * DB setup
 */

/**
 * Actual logic
 */
app.post("/login", (request, response) => {
    //TODO search by password as well
    const test = db
        .get("posts")
        .find({ username: request.body.username })
        .value();
    if (test) {
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
