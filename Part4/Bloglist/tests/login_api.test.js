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


beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({username: 'boss007', name: 'maia', passwordHash});
    await user.save();
  });

test('login succeeds with correct credentials and returns token', async () => {
    const res = await api
        .post('/api/login')
        .send({ username: 'boss007', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/);

    assert(res.body.token);
    assert.strictEqual(res.body.username, 'boss007');
    assert.strictEqual(res.body.name, 'maia');
});

test('login fails with wrong password', async () => {
    await api
        .post('/api/login')
        .send({ username: 'boss007', password: 'qwerty' })
        .expect(401);
});

test('login fails with non-existing username', async () => {
    await api
        .post('/api/login')
        .send({ username: 'boss', password: 'sekret' })
        .expect(401);
});

after(async () => {
    await mongoose.connection.close();
});