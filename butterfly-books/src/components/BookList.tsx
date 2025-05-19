import React from 'react';
import BookCard from './BookCard';
import type { Book } from '../App';

interface BookListProps {
  books: Book[];
  deleteBook: (id: number) => void;
  toggleFavorite: (id: number, currentFavorite: boolean) => void;
}

const BookList: React.FC<BookListProps> = ({ books, deleteBook, toggleFavorite }) => {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} deleteBook={deleteBook} toggleFavorite={toggleFavorite} />
      ))}
    </div>
  );
};

export default BookList;