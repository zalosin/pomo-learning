/**
 * Server imports
 */
const express = require("express");
const app = express();
const port = 3001;
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
                    `Received profile/username request -> ${JSON.stringify(
                        req.params
                    )}`
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
            try {
                console.log(
                    `Received course/id GET request -> ${JSON.stringify(
                        req.params
                    )}`
                );
                const course = db
                    .get("coursesInfo")
                    .find({ id: req.params.courseId.toString() })
                    .value();
                console.log(course);
                if (course) {
                    res.json(course);
                } else {
                    res.json({
                        status: false,
                        message: "Couldn't find course"
                    });
                }
            } catch (e) {
                console.error(e);
                badRequest(res);
            }
        });
        app.get("/courses", (req, res) => {
            try {
                console.log(
                    `Received courses get request -> ${JSON.stringify(
                        req.body
                    )}`
                );
                const savedCourses = db.get("courses").value();
                res.send(savedCourses);
            } catch (e) {
                console.error(e);
                badRequest(res);
            }
        });
        app.post("/courses", (req, res) => {
            try {
                console.log(
                    `Received course post request -> ${JSON.stringify(
                        req.body
                    )}`
                );
                const course = req.body;
                if (course.title) {
                    const savedCourse = db
                        .get("coursesInfo")
                        .last()
                        .value();
                    if (savedCourse !== undefined) {
                        db.get("coursesInfo")
                            .push(course)
                            .last()
                            .assign({ id: getId(savedCourse) })
                            .write()
                            .then(() => {
                                const shortInfo = {
                                    id: getId(savedCourse),
                                    title: course.title
                                };
                                db.get("courses")
                                    .push(shortInfo)
                                    .last()
                                    .write()
                                    .then(postedCourse =>
                                        res.send({
                                            status: true,
                                            courseId: postedCourse.id,
                                            message: `Successfully added course with id ${postedCourse.id}`
                                        })
                                    );
                            });
                    } else {
                        db.get("coursesInfo")
                            .push(course)
                            .last()
                            .assign({ id: "0" })
                            .write()
                            .then(() => {
                                const shortInfo = {
                                    id: "0",
                                    title: course.title
                                };
                                db.get("courses")
                                    .push(shortInfo)
                                    .last()
                                    .write()
                                    .then(postedCourse =>
                                        res.send({
                                            status: true,
                                            courseId: postedCourse.id,
                                            message: `Successfully added course with id ${postedCourse.id}`
                                        })
                                    );
                            });
                    }
                }
            } catch (e) {
                badRequest(res);
            }
        });
        app.put("/courses/:courseId", (req, res) => {
            try {
                console.log(
                    `Received course/id PUT request -> ${JSON.stringify(
                        req.params
                    )}`
                );
                const exists = db
                    .get("coursesInfo")
                    .find({ id: req.params.courseId })
                    .value();
                if (exists) {
                    db.get("coursesInfo")
                        .find({ id: req.params.courseId.toString() })
                        .assign({
                            title: req.body.title,
                            courseIndex: req.body.courseIndex,
                            chunks: req.body.chunks
                        })
                        .write()
                        .then(thisID => {
                            db.get("courses")
                                .find({ id: req.params.courseId.toString() })
                                .assign({
                                    title: req.body.title
                                })
                                .write()
                                .then(postedCourse =>
                                    res.send({
                                        status: true,
                                        message: `Successfully updated course with id ${thisID.id}`
                                    })
                                );
                        });
                } else {
                    res.send({
                        status: false,
                        message: "Invalid id"
                    });
                }
            } catch (e) {
                console.error(e);
                badRequest(res);
            }
        });
        app.delete("/courses/:courseId", (req, res) => {
            try {
                console.log(
                    `Received course/id DELETE request -> ${JSON.stringify(
                        req.params
                    )}`
                );
                const course = db
                    .get("coursesInfo")
                    .find({ id: req.params.courseId.toString() })
                    .value();
                console.log(course);
                if (course) {
                    db.get("coursesInfo")
                        .remove(course => {
                            return course.id === req.params.courseId;
                        })
                        .write()
                        .then(() => {
                            db.get("courses")
                                .remove(course => {
                                    return course.id === req.params.courseId;
                                })
                                .write()
                                .then(() =>
                                    res.send({
                                        status: true,
                                        message: `Successfully deleted course with id ${req.params.courseId}`
                                    })
                                );
                        });
                } else {
                    res.send({
                        status: false,
                        message: "Course couldn't be found"
                    });
                }
            } catch (e) {
                console.error(e);
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

function getId(course) {
    const str = parseInt(course.id) + 1;
    console.log(course.id);
    return str.toString();
}
