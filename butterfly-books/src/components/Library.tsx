import React from 'react';
import BookList from './BookList';

interface LibraryProps {
  books: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
    status: 'Read' | 'Currently Reading' | 'To Be Read';
    rating: number;
    favorite: boolean;
  }[];
  filter: string;
  setFilter: (filter: string) => void;
  search: string;
  setSearch: (search: string) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  favoriteFilter: boolean;
  setFavoriteFilter: (favorite: boolean) => void;
  deleteBook: (id: number) => void;
  toggleFavorite: (id: number, currentFavorite: boolean) => void;
}

const Library: React.FC<LibraryProps> = ({
  books,
  filter,
  setFilter,
  search,
  setSearch,
  ratingFilter,
  setRatingFilter,
  favoriteFilter,
  setFavoriteFilter,
  deleteBook,
  toggleFavorite,
}) => {
  return (
    <div className="library-container">
      <div className="filter-section">
        <div className="search-bar">
          <label>Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author"
          />
        </div>
        <div className="filter-row">
          <span className="filter-label">Filter:</span>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All</option>
            <option value="Read">Read</option>
            <option value="Currently Reading">Currently Reading</option>
            <option value="To Be Read">To Be Read</option>
          </select>
          <select
            id="rating-filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(parseInt(e.target.value))}
            aria-label="Filter by rating"
          >
            <option value={0}>All</option>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={favoriteFilter}
              onChange={(e) => setFavoriteFilter(e.target.checked)}
            /> Favorites Only
          </label>
        </div>
      </div>
      <div className="book-list-container">
        <BookList books={books} deleteBook={deleteBook} toggleFavorite={toggleFavorite} />
      </div>
    </div>
  );
};

export default Library;