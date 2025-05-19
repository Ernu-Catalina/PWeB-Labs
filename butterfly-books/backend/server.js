const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

// Configure CORS for production with Vercel frontend
const corsOptions = {
  origin: 'butterfly-books-clfl6n5cp-linas-projects-f17e0da0.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  exposedHeaders: [],
  credentials: false,
  maxAge: 600,
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors(corsOptions), (req, res) => {
  console.log('Handled OPTIONS preflight request');
  res.status(204).send();
});

app.use(express.json());

// In-memory database (replace with real database in production)
let books = [
  {
    id: 1,
    title: 'Sample Book',
    author: 'John Doe',
    coverImage: 'https://via.placeholder.com/150',
    status: 'To Be Read',
    rating: 0,
    favorite: false,
  },
];
let nextId = 2;

// Get all books
app.get('/api/books', (req, res) => {
  console.log('GET /api/books - Fetching all books');
  res.json(books);
});

// Add a book
app.post('/api/books', (req, res) => {
  console.log('POST /api/books - Received request with body:', req.body);

  const { title, author, coverImage, status, rating, favorite } = req.body;

  if (!title || !author || !status) {
    console.error('Invalid book data:', { title, author, status });
    return res.status(400).json({ message: 'Title, author, and status are required' });
  }

  const book = {
    id: nextId++,
    title,
    author,
    coverImage: coverImage || '',
    status,
    rating: status === 'Read' ? Math.max(0, Math.min(5, parseInt(rating) || 0)) : 0,
    favorite: !!favorite,
  };

  console.log('Adding new book:', book);
  books.push(book);
  res.status(201).json(book);
});

// Update a book (for favorite only)
app.put('/api/books/:id', (req, res) => {
  console.log(`PUT /api/books/${req.params.id} - Received request with body:`, req.body);

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    console.error('Invalid ID:', req.params.id);
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const { favorite } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) {
    console.error('Book not found:', id);
    return res.status(404).json({ message: 'Book not found' });
  }

  if (favorite === undefined) {
    console.warn('No favorite field provided in PUT request');
    return res.status(400).json({ message: 'Favorite field is required' });
  }

  book.favorite = !!favorite;
  console.log('Updated book:', book);
  res.json(book);
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  console.log('DELETE /api/books/:id - Received request');

  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    console.error('Book not found for deletion:', id);
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.status(204).send();
});

// Start server on Render-assigned port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});