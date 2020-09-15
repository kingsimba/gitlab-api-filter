import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiString from 'chai-string';
import { app } from './index';
import { globalOptions } from './global-options';

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiString);

let gitlabDotCom = true;
let projectId = 0;

describe('App', () => {
    before(() => {
        if (process.env.GITLAB_AF_URL == "https://gitlab.com") {
            gitlabDotCom = true;
            projectId = 20912856;
        } else {
            gitlabDotCom = false;
            projectId = 199;
        }
    });

    beforeEach(() => {
        globalOptions.secret = undefined;
    });

    it('blacklist works', async () => {
        const res = await chai.request(app).get(`/api/v4/projects/${projectId}/repository/files`).set('GITLAB_AF_SECRET', 'ASD');
        expect(res).to.have.status(403);
        expect(res.body).deep.contains({
            status: 403,
            message: "Forbidden: The request is prohibited by the blacklist."
        })
    });

    it('whitelist works', async () => {
        if (gitlabDotCom) {
            expect(process.env.GITLAB_AF_URL).equals("https://gitlab.com");
            expect(process.env.GITLAB_AF_ACCESS_TOKEN).startsWith('mQX');
        }

        const res = await chai.request(app).get('/api/v4/projects');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        expect(res.body.length).gt(1);
        const firstProject = res.body[0];
        expect(firstProject).to.include.all.keys('id', 'name');

        const res2 = await chai.request(app).get(`/api/v4/projects/${projectId}/repository/files/readme.rst?ref=master`);
        expect(res2).to.have.status(403);
    });

    it('secret works', async () => {
        globalOptions.secret = 'ABC';
        // right secret
        const res = await chai.request(app).get('/api/v4/projects').set('GITLAB_AF_SECRET', 'ABC');
        expect(res).to.have.status(200);
        // wrong secret
        const res2 = await chai.request(app).get('/api/v4/projects').set('GITLAB_AF_SECRET', 'WRONG');
        expect(res2).to.have.status(401);
    });

    it('/projects/id return a project', async () => {
        const res = await chai.request(app).get(`/api/v4/projects/${projectId}`);
        expect(res).to.have.status(200);
        expect(res.body.id).equals(projectId);
    });

    it('/projects/:id/repository/branches return branches', async () => {
        const res = await chai.request(app).get(`/api/v4/projects/${projectId}/repository/branches?per_page=100`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        const branches: any[] = res.body;
        let master;
        for (const b of branches) {
            if (b.name == 'master') {
                master = b;
            }
        }
        expect(master).exist;
    });

    it('/projects/:id/repository/tags return tags', async () => {
        const res = await chai.request(app).get(`/api/v4/projects/${projectId}/repository/tags?per_page=100`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        expect(res.header['x-page']).equals('1');
        const tags: any[] = res.body;
        let v1;
        for (const b of tags) {
            if (b.name == '5.2.0' || b.name == 'v1.0.0') {
                v1 = b;
            }
        }
        expect(v1).exist;
    });

    it('/projects/:id/member return all members, including inherited ones', async () => {
        const res = await chai.request(app).get(`/api/v4/projects/${projectId}/members/all`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        const users: any[] = res.body;
        let user;
        for (const b of users) {
            if (b.name == 'kingsimba0511' || b.name == 'Zhaolin Feng') {
                user = b;
            }
        }
        expect(user).exist;
    });
});
