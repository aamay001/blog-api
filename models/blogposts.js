'use strict';

const uuid = require('uuid');

function StorageException(message) {
    this.message = messgae;
    this.name = 'StorageException';
}

const BlogPosts = {

  create: function(title, content, author, publishDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex(
      post => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function(updatedPost) {
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
      throw new StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [
    {
        "id": "420ef05f-2d42-4416-a524-0a419a25cfe7",
        "title": "New Blog Post Title 3",
        "content": "This is the content of the new blog post 3 that is being sene over the api.",
        "author": "John Seracusa",
        "publishDate": 1503636080224
    },
    {
        "id": "e86be3ef-4c44-46d5-adb9-5ce3f12ae239",
        "title": "New Blog Post Title 2",
        "content": "This is the content of the new blog post 2 that is being sene over the api.",
        "author": "New Blog Post Author",
        "publishDate": 1503636075853
    },
    {
        "id": "e7866390-6c0c-4357-b82e-2bdf21ffe57c",
        "title": "New Blog Post Title 1",
        "content": "This is the content of the new blog post 1 that is being sene over the api.",
        "author": "New Blog Post Author",
        "publishDate": 1503636070973
    }
];
  storage.requiredFields = ['title','content','author'];
  return storage;
}

module.exports = {BlogPosts: createBlogPostsModel()};