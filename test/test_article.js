let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../routes/articleRouter");

//Assertion

chai.should();
chai.use(chaiHttp);

describe("Article API", () => {
  //Test the GET route
  describe("GET api/article/all", () => {
    it("it should GET all the articles", (done) => {
      chai
        .request(server)
        .get("/all")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  //Test the POST route
});
