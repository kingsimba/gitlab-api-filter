#!/usr/bin/env node
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
    request(`${globalOptions.url}/${req.url}`, { json: true, headers }, (err, res1, body) => {
        if (res1) {
            res.send(res1.body);
        } else {
            res.sendStatus(404);
        }
    });
});

if (globalOptions.errorMessage) {
    console.log(globalOptions.errorMessage);
    process.exit(1);
} else {
    console.log(`Starting server with options...`);
    console.log('url:', globalOptions.url);
    console.log('port:', globalOptions.port);
    console.log('accessToken:', globalOptions.accessToken ? 'x'.repeat(globalOptions.accessToken.length) : '(empty)');
    console.log('filters:', globalOptions.filters);
    console.log('');

    // start the Express server
    app.listen(globalOptions.port, () => {
        console.log(`Server started at http://localhost:${globalOptions.port}`);
    });
}
