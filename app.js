'use strict';

const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./routers/blogpostsRouter');
const app = express();

app.use(morgan('dev'));
app.use('/blog-posts', blogPostsRouter);

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise( (resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Server listening on port ${port}.`);
            resolve(server);
        }).on('error', err => {
            reject(err);
        });
    });
}

function closeServer() {
    return new Promise( (resolve, reject) => {
        console.log('Closing server');
        server.close( err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};

console.log('');
console.log('              Andy Amaya');
console.log('             |');
console.log('            ||');
console.log('¯\\_(ツ)_/¯ |||');