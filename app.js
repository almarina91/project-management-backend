const express = require('express');
const app = express();

const userRouter = require('./src/routers/users');
const projectsRouter = require('./src/routers/projects');
const tasksRouter = require('./src/routers/tasks');


require('./src/db/mongoose');
app.use(express.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.use(userRouter);
app.use(projectsRouter);
app.use(tasksRouter);

module.exports = app;