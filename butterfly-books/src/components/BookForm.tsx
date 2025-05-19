import React from 'react';
import type { Book } from '../App';

interface BookFormProps {
  newBook: Book;
  setNewBook: React.Dispatch<React.SetStateAction<Book>>;
  addBook: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ newBook, setNewBook, addBook }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBook();
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Add New Book</h2>
      </div>

      <div className="form-fields">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />

        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />

        <label htmlFor="coverImage">Cover Image URL</label>
        <input
          id="coverImage"
          type="text"
          placeholder="Cover Image URL"
          value={newBook.coverImage}
          onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
        />

        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          value={newBook.status}
          onChange={(e) => {
            const status = e.target.value as Book['status'];
            setNewBook({
              ...newBook,
              status,
              rating: status === 'Read' ? newBook.rating : 0,
            });
          }}
        >
          <option value="Read">Read</option>
          <option value="Currently Reading">Currently Reading</option>
          <option value="To Be Read">To Be Read</option>
        </select>

        {newBook.status === 'Read' && (
          <>
            <label htmlFor="rating-select">Rating (1-5 stars)</label>
            <select
              id="rating-select"
              value={newBook.rating}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  rating: parseInt(e.target.value) || 0,
                })
              }
            >
              <option value={0}>Select Rating</option>
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </>
        )}
      </div>

      <div className="form-footer">
        <button
          type="submit"
          disabled={!newBook.title || !newBook.author || !newBook.status}
        >
          Add Book
        </button>
      </div>
    </form>
  );
};

export default BookForm;
