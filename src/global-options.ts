import fs from 'fs';
import deepExtend from "deep-extend";
import stripJsonComments from "strip-json-comments";
const route = require('path-match')({
    // path-to-regexp options
    sensitive: false,
    strict: false,
    end: false
});

export class GlobalOptions {
    public errorMessage: string | undefined;

    public static configFileName = 'gitlab-api-filter.jsonc';

    public port = 8080;
    public upstream = {
        url: "https://gitlab.example.com",
        accessToken: ''
    };

    public whitelist: string[] | undefined;
    public blacklist: string[] | undefined;

    public whitelistMatchers: any[] | undefined;
    public blacklistMatchers: any[] | undefined;

    public secret: string | undefined;

    static instanceWithDefaultConfigFile(): GlobalOptions {
        const o: GlobalOptions = new GlobalOptions();
        const fileName = GlobalOptions.configFileName;
        try {
            // read from file
            if (!fs.existsSync(fileName)) {
                o.errorMessage = `error: config file ${fileName} not exist`;
                return o;
            }
            let text = fs.readFileSync(fileName, 'utf8');
            text = stripJsonComments(text);
            const config = JSON.parse(text);
            deepExtend(o, config);

            // read from environment variables
            if (process.env.GITLAB_AF_ACCESS_TOKEN) {
                o.upstream.accessToken = process.env.GITLAB_AF_ACCESS_TOKEN;
            }
            if (process.env.GITLAB_AF_URL) {
                o.upstream.url = process.env.GITLAB_AF_URL;
            }

            // check
            if (o.upstream.accessToken == '') {
                o.errorMessage = 'error: access token is empty';
                return o;
            }

            // disallow empty secret
            if (o.secret == '') {
                o.secret = undefined;
            }

            // compile URL matchers
            if (o.blacklist) {
                o.blacklistMatchers = [];
                for (const line of o.blacklist) {
                    const match = route(line);
                    o.blacklistMatchers.push(match);
                }
            }
            if (o.whitelist) {
                o.whitelistMatchers = [];
                for (const line of o.whitelist) {
                    const match = route(line);
                    o.whitelistMatchers.push(match);
                }
            }
        } catch (error) {
            o.errorMessage = error;
        }

        return o;
    }
};

export const globalOptions = GlobalOptions.instanceWithDefaultConfigFile();
