import { useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visibleDetail, setVisibleDetail] = useState(false);

  const visibilty = () => {
    setVisibleDetail(!visibleDetail);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="Blog" data-testid="blog" style={blogStyle}>
      <div className="Blog-Title">
        {blog.title} {blog.author}
        <button onClick={visibilty}>{visibleDetail ? 'Hide' : 'View'}</button>
        <div
          className="Blog-Details"
          style={{ display: visibleDetail ? 'block' : 'none' }}
        >
          <div>{blog.url}</div>
          <div>
            likes {blog.likes || 0} <button onClick={handleLike}>Like</button>
          </div>
          <div className="Blog-Author">{blog.author}</div>
          {blog.user?.username === user.username && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;
