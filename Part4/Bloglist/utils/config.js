require('dotenv').config();

const PORT = process.env.PORT || 3003;
const mongoUrl =
  process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;
if (!mongoUrl) throw new Error('Missing MongoDB URI')
module.exports = {
  mongoUrl,
  PORT,
};
