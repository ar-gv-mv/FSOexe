const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({username: 'boss007', passwordHash});
    await user.save();
})

test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({});
    const newUser = { username: 'mumu123', name: 'maia', password: 'qwerty' };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({});
    const newUser = { username: 'boss007', name: 'maia', password: 'qwerty' };
    const res = await api.post('/api/users').send(newUser).expect(400);
    assert(res.body.error);
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test('creation fails if username is too short', async () => {
    const usersAtStart = await User.find({});
    const newUser = { username: 'a', name: 'b', password: 'qwerty' };
    await api.post('/api/users').send(newUser).expect(400);
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test('creation fails if password is too short', async () => {
    const usersAtStart = await User.find({});
    const newUser = { username: 'boss008', name: 'maia', password: 'q' };
    await api.post('/api/users').send(newUser).expect(400);
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

after(async () => {
    await mongoose.connection.close();
});

