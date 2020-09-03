import express from "express";
import request from "request";
import { globalOptions, GlobalOptions } from "./global-options";

// Create Express instance
export const app = express();

app.use('/', async (req, res, next) => {
    if (globalOptions.errorMessage) {
        res.status(500).send({ message: globalOptions.errorMessage });
    } else {
        next();
    }
});

// Demonstrate how to read data from another server and return the result.
app.get(globalOptions.filters, async (req, res) => {
    const headers = {
        'Private-Token': globalOptions.accessToken
    }
    request(`${globalOptions.url}/${req.path}`, { json: true, headers }, (err, res1, body) => {
        if (res1) {
            res.send(res1.body);
        } else {
            res.sendStatus(404);
        }
    });
});

// start the Express server
app.listen(globalOptions.port, () => {
    console.log(`server started at http://localhost:${globalOptions.port}`);
});
