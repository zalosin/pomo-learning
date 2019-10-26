/**
 * Server imports
 */
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
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
app.use(cors());
/**
 * Actual logic
 */
low(adapter)
    .then(db => {
        app.get("/profile/:username", (req, res) => {
            try {
                console.log(
                    `Received profile request -> ${JSON.stringify(req.params)}`
                );
                const user = db
                    .get("users")
                    .find({ username: req.params.username })
                    .value();
                const userInfo = db
                    .get("profile")
                    .find({ id: user.id })
                    .value();
                if (userInfo) {
                    res.json(userInfo);
                } else {
                    res.json({
                        status: false,
                        message: false
                    });
                }
            } catch (e) {
                badRequest(res);
            }
        });
        app.post("/login", (req, res) => {
            try {
                console.log(
                    `Received login request -> ${JSON.stringify(req.params)}`
                );
                const user = db
                    .get("users")
                    .find({ username: req.body.username.toLowerCase() })
                    .value();
                if (user.password === req.body.password) {
                    const userInfo = db
                        .get("profile")
                        .find({ id: user.id })
                        .value();
                    res.json({
                        status: true,
                        data: userInfo
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Invalid username or password"
                    });
                }
            } catch (e) {
                badRequest(res);
            }
        });
        app.get("/courses/:courseId", (req, res) => {
            //TODO
        });
        app.post("/courses", (req, res) => {
            //TODO
            try {
                const course = req.body;
                if (course.title && course.chunks.length > 0) {
                    db.get("courses")
                        .push(req.body)
                        .last()
                        .assign({ id: Date.now().toString() })
                        .write()
                        .then(course => res.send(course));
                }
            } catch (e) {
                badRequest(res);
            }
        });
    })
    .then(() => {
        app.listen(port, () => console.log(`Running on port ${port}`));
    });

function badRequest(res) {
    return res.json({
        status: false,
        message: "Bad request"
    });
}
