import React from 'react';

interface BookFilterProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  ratingFilter: number;
  setRatingFilter: React.Dispatch<React.SetStateAction<number>>;
  favoriteFilter: boolean;
  setFavoriteFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookFilter: React.FC<BookFilterProps> = ({
  filter,
  setFilter,
  search,
  setSearch,
  ratingFilter,
  setRatingFilter,
  favoriteFilter,
  setFavoriteFilter,
}) => {
  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        <label htmlFor="filter-select">Filter by Status</label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Read">Read</option>
          <option value="Currently Reading">Currently Reading</option>
          <option value="To Be Read">To Be Read</option>
        </select>
      </div>
      <div>
        <label htmlFor="rating-filter">Filter by Rating</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(parseInt(e.target.value) || 0)}
        >
          <option value={0}>All Ratings</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={favoriteFilter}
            onChange={(e) => setFavoriteFilter(e.target.checked)}
          /> Favorites Only
        </label>
      </div>
    </div>
  );
};

export default BookFilter;