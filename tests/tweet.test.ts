import mongoose from "mongoose";
import { app } from "../src/app";
import chai from "chai";
import chaiHttp from "chai-http";
import { faker } from "@faker-js/faker";

chai.use(chaiHttp);

let token = "";
let videoId = 0;

const expect = chai.expect;
describe("video", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/bemaster_backend");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  const user = {
    name: faker.name.fullName(),
    userName: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    age: faker.random.numeric(),
  };

  it("should register a user successfully", (done) => {
    chai
      .request(app)
      .post("/v1/auth/register")
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("user created successfully");
        done();
      });
  });

  it("should login a user successfully", (done) => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        token = res.body.token;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("login successful");
        done();
      });
  });

  it("should create a video successfully", (done) => {
    chai
      .request(app)
      .post("/v1/video/create")
      .set("Authorization", `Bearer ${token}`)
      .send([
        {
          message: faker.lorem.sentence(),
          id: 0,
        },
      ])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("video created successfully");
        done();
      });
  });

  it("should get a user's videos successfully", (done) => {
    chai
      .request(app)
      .get("/v1/video")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        videoId = res.body.videos[0]?._id;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should update a video successfully", (done) => {
    chai
      .request(app)
      .patch(`/v1/video/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: faker.lorem.sentence(),
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("video updated successfully");
        done();
      });
  });

  it("should user like a video", (done) => {
    chai
      .request(app)
      .patch(`/v1/video/like/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        like: true,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("video updated successfully");
        done();
      });
  });
  it("should user unlike a video", (done) => {
    chai
      .request(app)
      .patch(`/v1/video/like/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        like: false,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("video updated successfully");
        done();
      });
  });

  it("should delete a video successfully", (done) => {
    chai
      .request(app)
      .delete(`/v1/video/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("video deleted successfully");
        done();
      });
  });

  it("should get a user's feeds successfully", (done) => {
    chai
      .request(app)
      .get("/v1/video/feed")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
