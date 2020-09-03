import express from "express";
import request from "request";
import { globalOptions, GlobalOptions } from "./global-options";

const PORT = 8080; // default port to listen
const GITLAB = 'https://gitlab.navinfo.com';
const PERSONAL_ACCESS_TOKEN = 'uWyWh3iXTD2guy2RyHLe';  // acquired from https://gitlab.example.com/profile/personal_access_tokens
const FILTER = [
    '/api/v4/projects',
    '/api/v4/projects/:id/repository/branches',
    '/api/v4/projects/:id/repository/tags']

// Create Express instance
export const app = express();

app.use('/', async (req, res, next) => {
    if (globalOptions == undefined) {
        res.status(500).send({ message: `config file ${GlobalOptions.configFileName} not loaded correctly` });
    }
    next();
});

// Demonstrate how to read data from another server and return the result.
app.get(FILTER, async (req, res) => {
    const headers = {
        'Private-Token': PERSONAL_ACCESS_TOKEN
    }
    request(`${GITLAB}/${req.path}`, { json: true, headers }, (err, res1, body) => {
        if (res1) {
            res.send(res1.body);
        } else {
            res.sendStatus(404);
        }
    });
});

// start the Express server
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
