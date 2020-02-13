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

describe('Transaction Checks', ()=>{

    it("should contain property X", (done) => {

        // Get something from db for transaction and check property X exists on response

        done();
    });

});