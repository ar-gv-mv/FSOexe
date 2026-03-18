const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  const popBlog = await savedBlog.populate('user', { username: 1, name: 1 });
  response.status(201).json(popBlog);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'a blog can be deleted only by the user who added it' });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});


blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const likes = request.body.likes;

  const blog = {
    likes,
  };

  const blogUpd = await Blog.findByIdAndUpdate(id, blog, {new: true});
  response.json(blogUpd);
});

module.exports = blogsRouter;
