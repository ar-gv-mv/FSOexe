import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import React from 'react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../components/BlogForm';

test('renders title and author', () => {
  const blog = {
    title: 'The Testi',
    author: 'Testikovich',
  };

  const userik = { username: 'tester' }

  render(<Blog
    blog={blog}
    user={userik}
    handleLike={vi.fn()}
    handleDelete={vi.fn()} />);

  expect(screen.getByText('The Testi Testikovich')).toBeInTheDocument()

  const element2 = screen.getByText('Testikovich');
  expect(element2).toBeDefined();

  const notThere1 = screen.queryByText('test.com');
  expect(notThere1).toBeNull();

  const notThere2 = screen.queryByText('likes 90');
  expect(notThere2).toBeNull();
});

test('the blogs URL and number of likes are shown', async () => {
  const blog = {
    title: 'The Testi',
    author: 'Testikovich',
    url: 'test.com',
    likes: 77,
  };

  const userik = { username: 'tester' }

  render(<Blog
    blog={blog}
    user={userik}
    handleLike={vi.fn()}
    handleDelete={vi.fn()} />);

  const user = userEvent.setup();
  const button = screen.getByText('View');
  await user.click(button);

  const notThere1 = screen.getByText('test.com');
  expect(notThere1).toBeDefined();

  const notThere2 = screen.getByText('likes 77');
  expect(notThere2).toBeDefined();
});

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const handleCreate = vi.fn();
  const mockSetNewBlog = vi.fn();
  const initialNewBlog = { title: '', author: '', url: '' };
  const user = userEvent.setup();

  render(<BlogForm handleCreate={handleCreate} />);

  const inputTitle = screen.getByPlaceholderText('Title');
  const inputAuthor = screen.getByPlaceholderText('Author');
  const inputURL = screen.getByPlaceholderText('URL');

  await user.type(inputTitle, 'The Testi');
  await user.type(inputAuthor, 'Testikovich');
  await user.type(inputURL, 'test.com');

  const buttonCreate = screen.getByText('Create');

  await user.click(buttonCreate);

  expect(handleCreate.mock.calls).toHaveLength(1);
  expect(handleCreate).toHaveBeenCalledWith({
    title: 'The Testi',
    author: 'Testikovich',
    url: 'test.com',
  });
});

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    id: 1334,
    title: 'The Testi',
    author: 'Testikovich',
    url: 'test.com',
    likes: 77,
    user: { username: 'tester' },
  };

  const mockHandler = vi.fn();

  render(<Blog
    blog={blog}
    user={{ username: 'tester' }}
    handleLike={mockHandler}
    handleDelete={vi.fn()}
  />);

  const user = userEvent.setup();
  const buttonView = screen.getByText('View');
  await user.click(buttonView);

  const buttonLike = screen.getByText('Like');
  await user.click(buttonLike);
  await user.click(buttonLike);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
