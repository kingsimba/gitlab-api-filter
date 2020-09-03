import fs from 'fs';
import deepExtend from "deep-extend";
import stripJsonComments from "strip-json-comments";

export class GlobalOptions {
    public static configFileName = 'gitlab-api-filter.jsonc';
    port = 8080;
    url = "https://gitlab.example.com";
    accessToken: string = '';
    filters = [];

    static instanceWithDefaultConfigFile(): GlobalOptions | undefined {
        let o: GlobalOptions | undefined = new GlobalOptions();
        try {
            // read from file
            let text = fs.readFileSync(GlobalOptions.configFileName, 'utf8');
            text = stripJsonComments(text);
            const config = JSON.parse(text);
            deepExtend(o, config);

            // read from environment variables
            if (process.env.GITLAB_ACCESS_TOKEN) {
                o.accessToken = process.env.GITLAB_ACCESS_TOKEN;
            }
        } catch (error) {
            o = undefined;
            console.log(error);
        }

        return o;
    }
};

export const globalOptions = GlobalOptions.instanceWithDefaultConfigFile();
