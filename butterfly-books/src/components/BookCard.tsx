import React from 'react';
import type { Book } from '../App';

interface BookCardProps {
  book: Book;
  deleteBook: (id: number) => void;
  toggleFavorite: (id: number, currentFavorite: boolean) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, deleteBook, toggleFavorite }) => {
  return (
    <div className="book-card">
      <img
        src={book.coverImage || 'https://via.placeholder.com/150'}
        alt={book.title}
        className="book-cover"
      />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.status}</p>
      {book.rating > 0 && <p>★ Rating: {book.rating}/5</p>}
      <div>
        <button className="delete-btn" onClick={() => deleteBook(book.id)}>
          Delete
        </button>
        <button
          className={`favorite-btn ${book.favorite ? 'favorite-btn--active' : 'favorite-btn--inactive'}`}
          onClick={() => {
            console.log(`Clicked favorite button for book ID ${book.id}, current favorite: ${book.favorite}`);
            toggleFavorite(book.id, book.favorite);
          }}
        >
          {book.favorite ? '❤' : '♡'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;