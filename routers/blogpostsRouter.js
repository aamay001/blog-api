'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const colors = require('colors');
const router = express.Router();
const {BlogPosts} = require('../models/blogposts');

////////////////////////////////////////////////////////////////
/// GET / READ
////////////////////////////////////////////////////////////////
router.get('/:id?', (req, res) => {

    if (req.params.id){
        console.log(`Getting blog post with id ${req.params.id}.`.blue);
        res.status(200).json(BlogPosts.get(req.params.id));
    }
    else {
        console.log(`Getting all blog posts.`.blue);
        res.status(200).json(BlogPosts.get());
    }
});

////////////////////////////////////////////////////////////////
/// POST / CREATE
////////////////////////////////////////////////////////////////
router.post('/', jsonParser, (req, res) => {
    
    let validation = validateFields(BlogPosts.requiredFields, req);
    if( !validation.ok ){
        return res.status(400).send(validation.message);
    }

    let post = BlogPosts.create(req.body.title
                              , req.body.content
                              , req.body.author
                              , req.body.publishDate);
    console.log('Blog post created.'.green);
    res.status(201).json(post);        
});

////////////////////////////////////////////////////////////////
/// DELETE
////////////////////////////////////////////////////////////////
router.delete('/:id', (req, res) => {

    if( BlogPosts.posts.find(post => post.id = req.params.id)){
        BlogPosts.delete(req.params.id);
        console.log(`Deleted blog post with id ${req.params.id}.`.red);    
    }
    else{
        let message = `Nothing deleted. Post with id ${req.params.id} not found.`;
        console.log(message.yellow);            
    }

    res.status(204).end();
});

////////////////////////////////////////////////////////////////
/// PUT / UPDATE
////////////////////////////////////////////////////////////////
router.put('/:id', jsonParser, (req,res) => {

    let validation = validateFields(BlogPosts.requiredFields, req);
    if(!validation.ok){
        console.error(validation.message);
        return res.status(400).send(validation.message);
    }

    if(req.params.id !== req.body.id){
        let message = `Request id parameter must match body id.`;
        console.error(message);
        return res.status(400).send(message);
    }

    let updatedPost = BlogPosts.update({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        publishDate: req.body.publishDate
    });   
    
    console.log(`Updated blog post with id ${req.params.id}.`.green);
    res.status(200).json(updatedPost);
});

////////////////////////////////////////////////////////////////
//// Utility
////////////////////////////////////////////////////////////////
function validateFields(requiredFields, req){    
    requiredFields.forEach( field => {
        if (!(field in req.body)){
            let message = `Request is missing a required field: ${field}.`;
            console.error(message);
            return { 
                ok: false, 
                message: message
            };
        }
    });

    return {ok:true};
}

module.exports = router;