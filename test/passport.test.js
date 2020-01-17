let chai = require('chai');
let chaiHttp = require('chai-http');
let bootstrapper = require('../index');
let sqlConn = require("./../app/config/DBConnection");
let eventManager = require("./../app/config/GlobalEvents");
let should = chai.should();
let {Passport} = require("./../app/Services/Passport");
let server;

bootstrapper.enableTestMode();

chai.use(chaiHttp);

describe('Passport Checks', ()=>{

    it("Saltines should generate with iteration count", (done) => {

        let saltine = Passport.createSaltine();
        let parts = saltine.split("::");

        parts.length.should.equal(2);

        done();
    });

    it("Saltine iteration counts should be between 1 and 32", (done) => {
        let saltine = Passport.createSaltine();
        let parts = saltine.split("::");

        let n = parseInt(parts[1]);

        n.should.be.lessThan(33);
        n.should.be.greaterThan(0);

        done();
    });

});