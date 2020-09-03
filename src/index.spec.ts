import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from './index';

const expect = chai.expect;

chai.use(chaiHttp);

describe('App', () => {

    it('/projects return an array of projects', async () => {
        const res = await chai.request(app).get('/api/v4/projects');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        expect(res.body.length).gt(1);
        const firstProject = res.body[0];
        expect(firstProject).to.include.all.keys('id', 'name');
    });

    it('/projects/:id/repository/branches return branches', async () => {
        const res = await chai.request(app).get('/api/v4/projects/20912856/repository/branches');
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

    it('/projects/:id/repository/branches return tags', async () => {
        const res = await chai.request(app).get('/api/v4/projects/20912856/repository/tags');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        const branches: any[] = res.body;
        let v1;
        for (const b of branches) {
            if (b.name == 'v1.0.0') {
                v1 = b;
            }
        }
        expect(v1).exist;
    });
});
