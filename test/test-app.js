'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../app');
const should = chai.should();
const uuid = require('uuid');
chai.use(chaiHttp);

describe('Blog API', function() {
    const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
    // Start Server before tests start
    before(function(){
      return runServer();
    });
    // Stop server after tests are done
    after(function(){
      return closeServer();
    });
    /////////////////////////////////////////
    // Test GET all blog posts
    /////////////////////////////////////////
    it('should list all blog posts on GET', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            res.body.forEach(function(element) {
              element.should.be.a('object');
              element.should.include.keys(expectedKeys)
              element.id.should.be.a( typeof(uuid.v4()));
            });
        });
    });

    /////////////////////////////////////////
    // Test GET single blog posts
    /////////////////////////////////////////
    it('should get a single blog post on GET', function() {
      const postId = '420ef05f-2d42-4416-a524-0a419a25cfe7';
      return chai.request(app)
        .get(`/blog-posts/${postId}`)
        .then(function(res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(expectedKeys);
          res.body['title'].should.deep.equal('New Blog Post Title 3');
          res.body['author'].should.deep.equal('John Seracusa');
          res.body.id.should.equal(postId);
        });
    });
    /////////////////////////////////////////
    // Test POST new blog post
    /////////////////////////////////////////
    it('should add a post on POST', function(){
      let newPost = {
        title : 'Accidental Tech Podcast',
        content : 'This was an accidental blog post on tech.',
        author: 'Homer Simpson',
        publishDate : '05/02/1988'
      };
      return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res){
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(expectedKeys);
          res.body.id.should.not.be.null;
          res.body.should.deep.equal(Object.assign(newPost, {id:res.body.id}));
        });
    });
    /////////////////////////////////////////
    // Test DELETE new blog post
    /////////////////////////////////////////
    it('should delete a post on DELETE', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
          return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
        })
        .then(function(res){
          res.should.have.status(204);
        });
    });
    /////////////////////////////////////////
    // Test PUT new blog post
    /////////////////////////////////////////
    it('should update a post on PUT', function(){
      const updateData = {
        title: "The updated title",
        content: "This is the updated title. It worked."
      }
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
          updateData.id = res.body[0].id;
          return chai.request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.deep.equal(updateData);
        });
    });
});
