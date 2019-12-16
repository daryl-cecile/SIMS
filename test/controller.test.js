// Import the dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Requests", () => {

    it("GET / should return successfully", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("GET /fake should return 404", (done) => {
        chai.request(app)
            .get("/fake")
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

});