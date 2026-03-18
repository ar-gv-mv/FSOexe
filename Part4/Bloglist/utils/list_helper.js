const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let summa = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return summa;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best));
  return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
  const counts = {};

  blogs.forEach((b) => {
    counts[b.author] = (counts[b.author] || 0) + 1;
  });

  let bestAuthor = null;
  let bestCount = -1;

  for (const author in counts) {
    if (counts[author] > bestCount) {
      bestAuthor = author;
      bestCount = counts[author];
    }
  }

  return { author: bestAuthor, blogs: bestCount };
};

const mostLikes = (blogs) => {
  const sums = {};

  blogs.forEach((b) => {
    sums[b.author] = (sums[b.author] || 0) + b.likes;
  });

  let bestAuthor = null;
  let bestLikes = -1;

  for (const author in sums) {
    if (sums[author] > bestLikes) {
      bestAuthor = author;
      bestLikes = sums[author];
    }
  }
  return { author: bestAuthor, likes: bestLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
