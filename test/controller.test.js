let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let sqlConn = require("./../app/config/db_conn");
let eventManager = require("./../app/config/GlobalEvents");
let should = chai.should();

chai.use(chaiHttp);

describe('Server start', ()=>{

    it("server should start successfully with db connection", (done) => {
        eventManager.listen("APP_READY",function(){
            done();
        },{ autoTriggerIfMissed: true });
    });

});

describe('Requests', () => {

    it('GET / should be successful', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.length.should.not.be.eql(0);
                done();
            });
    });

    it('GET /fake should not be successful', (done) => {
        chai.request(server)
            .get('/fake')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

});

describe('Server close', ()=>{

    it("server should end successfully", (done) => {
        server.on("close", function() {
            done();
            sqlConn.end();
        });
        server.close();
    });

});