'use strict';

const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./routers/blogpostsRouter');
const app = express();

app.use(morgan('common'));
app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, 'localhost', () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}.`);
});

console.log('');
console.log('              Andy Amaya');
console.log('             |');
console.log('            ||');
console.log('¯\\_(ツ)_/¯ |||');