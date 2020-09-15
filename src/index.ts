#!/usr/bin/env node
import express from "express";
import request from "request";
import { globalOptions } from "./global-options";

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

    if (globalOptions.whitelistMatchers) {
        for (const match of globalOptions.whitelistMatchers) {
            const params = match(path);
            // match
            if (params !== false) {
                allowed = true;
                break;
            }
        }
    }

    if (!allowed && globalOptions.blacklistMatchers) {
        for (const match of globalOptions.blacklistMatchers) {
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
            for (let index = 0; index < res1.rawHeaders.length; index += 2) {
                const key = res1.rawHeaders[index];
                const value = res1.rawHeaders[index + 1];
                if (key.startsWith('X-') || key.startsWith('x-')) {
                    res.header(key, value);
                }
            }
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
