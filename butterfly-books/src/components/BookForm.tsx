import React from 'react';
import type { Book } from '../App';

interface BookFormProps {
  newBook: Book;
  setNewBook: React.Dispatch<React.SetStateAction<Book>>;
  addBook: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ newBook, setNewBook, addBook }) => {
  const isFormValid = newBook.title.trim() !== '' && newBook.author.trim() !== '' && (newBook.status !== 'Read' || newBook.rating > 0);

  return (
    <div className="book-form">
      <h2>Add a New Book</h2>
      <input
        type="text"
        placeholder="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />
      <input
        type="text"
        placeholder="Cover Image URL (optional)"
        value={newBook.coverImage}
        onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
      />
      <label htmlFor="status-select">Reading Status</label>
      <select
        id="status-select"
        value={newBook.status}
        onChange={(e) => {
          const status = e.target.value as Book['status'];
          setNewBook({ ...newBook, status, rating: status === 'Read' ? newBook.rating : 0 });
        }}
      >
        <option value="Read">Read</option>
        <option value="Currently Reading">Currently Reading</option>
        <option value="To Be Read">To Be Read</option>
      </select>
      {newBook.status === 'Read' && (
        <label htmlFor="rating-select">Rating (1-5 stars)</label>
      )}
      {newBook.status === 'Read' && (
        <select
          id="rating-select"
          value={newBook.rating}
          onChange={(e) => setNewBook({ ...newBook, rating: parseInt(e.target.value) || 0 })}
          disabled={newBook.status !== 'Read'}
        >
          <option value={0}>Select Rating</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      )}
      <button onClick={addBook} disabled={!isFormValid}>
        Add Book
      </button>
    </div>
  );
};

export default BookForm;