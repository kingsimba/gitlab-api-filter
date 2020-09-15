#!/usr/bin/env node
import express from "express";
import request from "request";
import { globalOptions, GlobalOptions } from "./global-options";
const route = require('path-match')({
    // path-to-regexp options
    sensitive: false,
    strict: false,
    end: false,
});
const parse = require('url').parse;

// Create Express instance
export const app = express();

// Middleware to return error message, if there is any error in the config file.
app.use('/', async (req, res, next) => {
    if (globalOptions.errorMessage) {
        res.status(500).send({ message: globalOptions.errorMessage });
    } else {
        next();
    }
});

// handle blacklist/whitelist
app.use('/', async (req, res, next) => {
    let allowed = false;
    let blocked = false;

    const path = req.path;

    if (globalOptions.whitelist) {
        for (const line of globalOptions.whitelist) {
            const match = route(line);
            const params = match(path);
            // match
            if (params !== false) {
                allowed = true;
                break;
            }
        }
    }

    if (!allowed && globalOptions.blacklist) {
        for (const line of globalOptions.blacklist!) {
            const match = route(line);
            const params = match(path);
            // match
            if (params !== false) {
                blocked = true;
                break;
            }
        }
    }
    if (blocked) {
        res.status(403).send({ status: 403, message: "Forbidden: The request is prohibited by the blacklist." });
    } else {
        next();
    }
});

// handle request
app.use('/', async (req, res) => {
    const headers = {
        'Private-Token': globalOptions.upstream.accessToken
    }
    request(`${globalOptions.upstream.url}/${req.url}`, { json: true, headers }, (err, res1, body) => {
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
    console.log('port:', globalOptions.port);
    console.log('upstream.url:', globalOptions.upstream.url);
    console.log('upstream.accessToken:', globalOptions.upstream.accessToken ? 'x'.repeat(globalOptions.upstream.accessToken.length) : '(empty)');
    if (globalOptions.blacklist) {
        console.log('blacklist:', globalOptions.blacklist);
    }
    if (globalOptions.whitelist) {
        console.log('whitelist:', globalOptions.whitelist);
    }
    console.log('');

    // start the Express server
    app.listen(globalOptions.port, () => {
        console.log(`Server started at http://localhost:${globalOptions.port}`);
    });
}
