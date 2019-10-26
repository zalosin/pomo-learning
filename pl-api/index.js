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
                    res.status(404).json({
                        status: false,
                        message: false
                    });
                }
            } catch (e) {
                res.status(500).json({
                    status: false,
                    message: "Bad request"
                });
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
                    res.status(200).json({
                        status: true,
                        data: userInfo
                    });
                } else {
                    res.status(401).json({
                        status: false,
                        message: "Invalid username or password"
                    });
                }
            } catch (e) {
                res.status(500).json({
                    status: false,
                    message: "Bad request"
                });
            }
        });
    })
    .then(() => {
        app.listen(port, () => console.log(`Running on port ${port}`));
    });
