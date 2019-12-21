let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let sqlConn = require("./../app/config/DBConnection");
let eventManager = require("./../app/config/GlobalEvents");
let should = chai.should();

chai.use(chaiHttp);

describe('Server start', ()=>{


    it("Stack should load successfully", (done) => {
        eventManager.listen("STACK_READY",function(){
            done();
        },{ singleUse:true, autoTriggerIfMissed: true });
    });

    it("server should start successfully", (done) => {
        eventManager.listen("APP_READY",function(){
            done();
        },{ singleUse:true ,autoTriggerIfMissed: true });
    });

    it("DB should connect successfully", (done) => {
        eventManager.listen("DB_READY",function(){
            done();
        },{ singleUse:true, autoTriggerIfMissed: true });
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
        server.on("close", async function() {
            console.log("out");
            await sqlConn.end();
            done();
        });
        server.close();
    });

});