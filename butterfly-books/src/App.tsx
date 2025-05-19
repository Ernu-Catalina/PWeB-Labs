import { useState, useEffect } from 'react';
import Header from './components/Header';
import BookForm from './components/BookForm';
import Library from './components/Library';

// Define the Book type for type safety
export type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  status: 'Read' | 'Currently Reading' | 'To Be Read';
  rating: number;
  favorite: boolean;
};

// Get API URL from environment variable (set in Vercel as VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL;

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filter, setFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: '',
    author: '',
    coverImage: '',
    status: 'To Be Read',
    rating: 0,
    favorite: false,
  });

  // Validate API_URL on component mount
  useEffect(() => {
    if (!API_URL) {
      console.error('VITE_API_URL is not defined. Please set it in Vercel environment variables.');
      alert('Error: Backend URL (VITE_API_URL) is not defined. Please contact the administrator.');
      return;
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books?_t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const data: Book[] = await res.json();
      setBooks(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching books:', errorMessage);
      alert(`Failed to fetch books: ${errorMessage}. Ensure the backend is running and CORS is configured.`);
    }
  };

  const checkBackendAvailability = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: 'HEAD',
        mode: 'cors',
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.status) {
      alert('Please provide title, author, and status');
      return;
    }

    const isBackendAvailable = await checkBackendAvailability();
    if (!isBackendAvailable) {
      console.error('Backend is not available at', `${API_URL}/api/books`);
      alert(`Error: Backend server is not running or not reachable at ${API_URL}. Please ensure the backend is deployed on Render.`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error ${res.status}: ${res.statusText} - ${errorText}`);
      }

      setNewBook({ id: 0, title: '', author: '', coverImage: '', status: 'To Be Read', rating: 0, favorite: false });
      fetchBooks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error adding book:', errorMessage);
      alert(`Error adding book: ${errorMessage}. Ensure the backend is running and CORS is configured correctly. Check console for details.`);
    }
  };

  const deleteBook = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      fetchBooks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error deleting book:', errorMessage);
      alert(`Failed to delete book: ${errorMessage}. Ensure the backend is running.`);
    }
  };

  const toggleFavorite = async (id: number, currentFavorite: boolean) => {
    // Optimistic update
    const newBooks = books.map(book => book.id === id ? { ...book, favorite: !currentFavorite } : book);
    setBooks(newBooks);

    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !currentFavorite }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error ${res.status}: ${res.statusText} - ${errorText}`);
      }

      const updatedBook = await res.json();
      setBooks(books.map(book => book.id === id ? updatedBook : book));
      await fetchBooks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error toggling favorite:', errorMessage);
      // Rollback on error
      setBooks(books.map(book => book.id === id ? { ...book, favorite: currentFavorite } : book));
      alert(`Failed to toggle favorite: ${errorMessage}. Ensure the backend is running.`);
      await fetchBooks();
    }
  };

  const filteredBooks = books.filter((book) => {
    if (filter !== 'All' && book.status !== filter) return false;
    if (ratingFilter > 0 && book.rating !== ratingFilter) return false;
    if (favoriteFilter && !book.favorite) return false;
    if (search && !book.title.toLowerCase().includes(search.toLowerCase()) && !book.author.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div data-theme={theme} className="app-container">
      <Header theme={theme} setTheme={setTheme} />
      <div className="main-layout">
        <div className="add-book-section">
          <BookForm newBook={newBook} setNewBook={setNewBook} addBook={addBook} />
        </div>
        <div className="library-section">
          <Library
            books={filteredBooks}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            favoriteFilter={favoriteFilter}
            setFavoriteFilter={setFavoriteFilter}
            deleteBook={deleteBook}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};

export default App;