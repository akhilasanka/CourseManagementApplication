var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('assert');
var expect = chai.expect;
var testInput_name = "Mocha";
var testInput_email = "mocha.testemail@gmail.com";
var testInput_password = "test";
var studentid = 1;
var courseid = 200;

describe('Canvas Mocha Tests:', () => {

    // Get course details
    it("Test Case 1 - Details of an student courses", (done) => {
        chai.request('http://localhost:3001')
        .get(`/student/home`)
        .query({id : studentid})
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('array');
            res.status.should.be.equal(200);  
            expect(res.body[0].course_id);
            expect(res.body[0].dept);
        done();
        });
    })

   // Get profile
    it("Test Case 2 - Details of an existing profile Get", (done) => {
        chai.request('http://localhost:3001')
        .get(`/profile`)
        .query({table: "student",id : studentid})
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);
            expect(res.body.email).to.equal("sandeep@canvas.com");
        done();
        });
    })

    // SignUp Faculty
    it("Test Case 3 - Faculty SignUp Post", (done) => { 

        const facultySignupData = {
            "name":testInput_name,
            "email": testInput_email,
            "password" : testInput_password,
            "isFaculty" : true
        }

        chai.request('http://localhost:3001')
        .post('/signup')
        .send(facultySignupData)
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
            res.body.should.have.property('responseMessage').equal('Successfully Added!');
        done();
        });
    })

    // Get announcements
    it("Test Case 4 - Announcements of a course", (done) => {
        chai.request('http://localhost:3001')
        .get(`/announcements`)
        .query({courseID : courseid})
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('array');
            res.status.should.be.equal(200);
            expect(res.body[0].id);
        done();
        });
    })

    
    // Get files
    it("Test Case 5 - Files of a course", (done) => {
        chai.request('http://localhost:3001')
        .get(`/files`)
        .query({courseID : courseid})
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('array');
            res.status.should.be.equal(200);
            expect(res.body[0].id);
        done();
        });
    })

})