import fs from 'fs';
import deepExtend from "deep-extend";
import stripJsonComments from "strip-json-comments";

export class GlobalOptions {
    public errorMessage: string | undefined;

    public static configFileName = 'gitlab-api-filter.jsonc';
    public port = 8080;
    public url = "https://gitlab.example.com";
    public filters: string[] = [];
    accessToken: string = '';

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
                o.accessToken = process.env.GITLAB_AF_ACCESS_TOKEN;
            }
            if (process.env.GITLAB_AF_URL) {
                o.url = process.env.GITLAB_AF_URL;
            }

            // check
            if (o.accessToken == '') {
                o.errorMessage = 'error: access token is empty';
                return o;
            }
        } catch (error) {
            o.errorMessage = error;
        }

        return o;
    }
};

export const globalOptions = GlobalOptions.instanceWithDefaultConfigFile();
