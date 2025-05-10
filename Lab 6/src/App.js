import React, { useState, useEffect } from 'react';
import './App.css';

const loadBooksFromLocalStorage = () => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  return books;
};

const saveBooksToLocalStorage = (books) => {
  localStorage.setItem('books', JSON.stringify(books));
};

function App() {
  const [books, setBooks] = useState(loadBooksFromLocalStorage());
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [status, setStatus] = useState('To Be Read');
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [favoriteFilter, setFavoriteFilter] = useState(false);

  // Save books to localStorage whenever the books array changes
  useEffect(() => {
    saveBooksToLocalStorage(books);
  }, [books]);

  // Toggle Dark Mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Filter books based on status, rating, and favorite status
  const filteredBooks = books.filter((book) => {
    return (
      (statusFilter === 'All' || book.status === statusFilter) &&
      (ratingFilter === 0 || book.rating === ratingFilter) &&
      (!favoriteFilter || book.favorite === favoriteFilter)
    );
  });

  // Add new book to the list
  const addBook = () => {
    const newBook = {
      title,
      author,
      cover,
      status,
      rating,
      favorite,
    };
    setBooks([...books, newBook]);
    setTitle('');
    setAuthor('');
    setCover('');
    setStatus('To Be Read');
    setRating(0);
    setFavorite(false);
  };

  // Remove a book from the list
  const removeBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  // Toggle favorite status for a book
  const toggleFavorite = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].favorite = !updatedBooks[index].favorite;
    setBooks(updatedBooks);
  };

  return (
    <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
      <div className="container py-4">
        <h1 className="text-center mb-4">Butterfly Books</h1>

        <div className="d-flex justify-content-end mb-3">
          <button onClick={toggleTheme} className="btn btn-dark">
            Toggle {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="To Be Read">To Be Read</option>
              <option value="Currently Reading">Currently Reading</option>
              <option value="Read">Read</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-check-label">Show Favorites</label>
            <input
              type="checkbox"
              checked={favoriteFilter}
              onChange={() => setFavoriteFilter(!favoriteFilter)}
              className="form-check-input"
            />
          </div>
        </div>

        {/* Add New Book Form */}
        <div className="mb-4">
          <h4>Add New Book</h4>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Title"
            required
          />
          <br />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-control"
            placeholder="Author"
            required
          />
          <br />
          <input
            type="text"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="form-control"
            placeholder="Cover Image URL"
            required
          />
          <br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control"
          >
            <option value="To Be Read">To Be Read</option>
            <option value="Currently Reading">Currently Reading</option>
            <option value="Read">Read</option>
          </select>
          <br />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="form-control"
          >
            <option value={0}>0 Stars</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <br />
          <button onClick={addBook} className="btn btn-primary">
            Add Book
          </button>
        </div>

        {/* Book List */}
        <div className="row" id="book-list">
          {filteredBooks.map((book, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card">
                <img src={book.cover} alt={book.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">by {book.author}</p>
                  <p>Status: {book.status}</p>
                  <p>Rating: {'⭐'.repeat(book.rating)}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBook(index)}
                  >
                    Remove
                  </button>
                  <button
                    className={`btn ${book.favorite ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => toggleFavorite(index)}
                  >
                    {book.favorite ? '★' : '☆'} Favorite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
