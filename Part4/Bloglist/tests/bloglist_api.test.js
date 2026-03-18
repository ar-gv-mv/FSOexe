const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const listHelper = require('../utils/list_helper');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

let token = null;
let userId = null;
const loginAndGetToken = async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'boss007', password: 'sekret' })
      .expect(200);
    return res.body.token;
  };

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = await new User({ username: 'boss007', name: 'maia', passwordHash }).save();
    userId = user._id.toString();
    token = await loginAndGetToken();
    const b1 = await new Blog({ title: 'Something', author: 'gugu', url: 'huhu', likes: 1000, user: user._id }).save();
    const b2 = await new Blog({ title: 'Nothing', author: 'gaga', url: 'haha', likes: 1, user: user._id }).save();
    user.blogs = [b1._id, b2._id];
    await user.save();
});

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs').expect(200);
  assert.strictEqual(res.body.length, 2);
});

test('blog has id field', async () => {
  const res = await api.get('/api/blogs');
  assert(res.body[0].id);
  assert.strictEqual(res.body[0]._id, undefined);
});

test('a valid blog can be added', async () => {
  const newBlog = { title: 'anything', author: 'gigi', url: 'hihi', likes: 96 };

  const initialBlogs = await Blog.find({});

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  const titles = blogsAtEnd.map((n) => n.title);
  assert(titles.includes(newBlog.title));
});

test('if likes is missing, it will default to the value 0', async () => {
  const nb = { title: 'Once Upon a Time', author: 'Testikovich', url: 'out.testik' };
  const res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(nb)
    .expect(201);
  assert.strictEqual(res.body.likes, 0);
});

test('title is missing', async () => {
  const nb = { author: 'Testikovic', url: 'wl.com', likes: 1 };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(nb)
    .expect(400);
  const res = await api.get('/api/blogs');
  assert.strictEqual(res.body.length, 2);
});

test('url is missing', async () => {
  const nb = { title: 'Wonderful Life', author: 'Testikovic', likes: 1 };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(nb)
    .expect(400);
  const res = await api.get('/api/blogs');
  assert.strictEqual(res.body.length, 2);
});

test('a blog can be deleted', async () => {
  const initialBlogs = await Blog.find({});
  const blogToDelete = initialBlogs[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await Blog.find({});
  const titles = blogsAtEnd.map((n) => n.title);
  assert(!titles.includes(blogToDelete.title));
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
});

test('updatable', async () => {
  const initialBlogs = await Blog.find({});
  const blogToUpd = initialBlogs[0];
  const blogUpd = { likes: blogToUpd.likes + 1 };

  const response = await api
    .put(`/api/blogs/${blogToUpd.id}`)
    .send(blogUpd)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, blogUpd.likes);

  const blogsAtEnd = await Blog.find({});

  const updBlog1 = blogsAtEnd.find((n) => n.id === blogToUpd.id);

  assert.strictEqual(updBlog1.likes, blogUpd.likes);

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
});

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

test('returns the blog with the most likes', () => {
  const result = listHelper.favoriteBlog(blogs);
  assert.deepStrictEqual(result, {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  });
});

test('returns the author who has the largest amount of blogs', () => {
  const result = listHelper.mostBlogs(blogs);
  assert.deepStrictEqual(result, {
    author: 'Robert C. Martin',
    blogs: 3,
  });
});

test('returns the author whose blog posts have the largest amount of likes', () => {
  const result = listHelper.mostLikes(blogs);
  assert.deepStrictEqual(result, {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  });
});

test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = { title: 'a', author: 'b', url: 'c', likes: 1 };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);
});

after(async () => {
  await mongoose.connection.close();
});
