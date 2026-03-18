const Blog = require('../models/blog');
const User = require('../models/user');

initialBlogs = [
  { title: 'testi1', author: 'tata', url: 'tutu', likes: 78 },
  { title: 'testi2', author: 'toto', url: 'titi', likes: 32 },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = { usersInDb, initialBlogs, nonExistingId };
