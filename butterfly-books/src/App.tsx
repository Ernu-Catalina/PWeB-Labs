import { useState, useEffect } from 'react';
import Header from './components/Header';
import BookForm from './components/BookForm';
import BookFilter from './components/BookFilter';
import BookList from './components/BookList';

export type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  status: 'Read' | 'Currently Reading' | 'To Be Read';
  rating: number;
  favorite: boolean;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      console.log('Books state before fetch:', books);
      const res = await fetch(`${API_URL}/api/books?_t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
      });
      if (res.ok) {
        const data: Book[] = await res.json();
        console.log('Fetched books:', data);
        setBooks(data);
        console.log('Books state after fetch:', data);
      } else {
        console.error('Failed to fetch books:', res.status, res.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching books:', error.message);
      } else {
        console.error('Unknown error fetching books:', error);
      }
    }
  };

  const checkBackendAvailability = async () => {
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
      console.error('Invalid book data before sending:', newBook);
      alert('Please provide title, author, and status');
      return;
    }

    console.log('Sending book data:', newBook);

    const isBackendAvailable = await checkBackendAvailability();
    if (!isBackendAvailable) {
      console.error('Backend is not available at', `${API_URL}/api/books`);
      alert('Error: Backend server is not running or not reachable at ' + API_URL);
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

      if (res.ok) {
        setNewBook({ id: 0, title: '', author: '', coverImage: '', status: 'To Be Read', rating: 0, favorite: false });
        fetchBooks();
      } else {
        const errorText = await res.text();
        console.error('Failed to add book:', {
          status: res.status,
          statusText: res.statusText,
          responseText: errorText,
        });
        alert(`Failed to add book: ${res.status} ${res.statusText} - ${errorText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding book:', error.message);
      } else {
        console.error('Unknown error adding book:', error);
      }
      alert(`Error adding book: ${error instanceof Error ? error.message : 'Failed to fetch - check if the backend is running and CORS is configured correctly'}`);
    }
  };

  const deleteBook = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      if (res.ok) {
        fetchBooks();
      } else {
        console.error('Failed to delete book:', res.status, res.statusText);
        alert('Failed to delete book');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting book:', error.message);
      } else {
        console.error('Unknown error deleting book:', error);
      }
      alert('Error deleting book');
    }
  };

  const toggleFavorite = async (id: number, currentFavorite: boolean) => {
    console.log(`Attempting to toggle favorite for book ID ${id}, currentFavorite: ${currentFavorite}`);
    // Optimistic update
    const newBooks = books.map(book => book.id === id ? { ...book, favorite: !currentFavorite } : book);
    setBooks(newBooks);
    console.log('Books state after optimistic update:', newBooks);
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !currentFavorite }),
      });
      console.log(`PUT request to ${API_URL}/api/books/${id} - Status: ${res.status}, Headers:`, res.headers);
      const responseText = await res.text();
      console.log(`Response body: ${responseText}`);
      if (res.status >= 200 && res.status < 300) {
        console.log(`Successfully toggled favorite for book ID ${id} to ${!currentFavorite}`);
        const updatedBook = JSON.parse(responseText);
        setBooks(books.map(book => book.id === id ? updatedBook : book));
        console.log(`Books state after PUT update:`, books);
        await fetchBooks();
        const updatedBookAfterFetch = books.find(book => book.id === id);
        console.log(`Updated book (ID ${id}) after fetchBooks:`, updatedBookAfterFetch);
      } else {
        console.error('Failed to toggle favorite:', {
          status: res.status,
          statusText: res.statusText,
          responseText: responseText,
        });
        setBooks(books.map(book => book.id === id ? { ...book, favorite: currentFavorite } : book));
        console.log('Books state after rollback:', books);
        alert(`Failed to toggle favorite: ${res.status} ${res.statusText} - ${responseText}`);
        await fetchBooks();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error toggling favorite:', error.message);
      } else {
        console.error('Unknown error toggling favorite:', error);
      }
      setBooks(books.map(book => book.id === id ? { ...book, favorite: currentFavorite } : book));
      console.log('Books state after error rollback:', books);
      alert(`Error toggling favorite: ${error instanceof Error ? error.message : 'Network error - check if the backend is running'}`);
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
    <div data-theme={theme}>
      <div className="container">
        <Header theme={theme} setTheme={setTheme} />
        <BookForm newBook={newBook} setNewBook={setNewBook} addBook={addBook} />
        <BookFilter
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          favoriteFilter={favoriteFilter}
          setFavoriteFilter={setFavoriteFilter}
        />
        <BookList books={filteredBooks} deleteBook={deleteBook} toggleFavorite={toggleFavorite} />
      </div>
    </div>
  );
};

export default App;