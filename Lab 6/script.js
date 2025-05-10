document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const themeToggle = document.getElementById('theme-toggle');
    const statusFilter = document.getElementById('status-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const favoriteFilter = document.getElementById('favorite-filter');

    // Load books from localStorage
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const status = statusFilter.value;
        const rating = parseInt(ratingFilter.value);
        const favoriteOnly = favoriteFilter.checked;
        bookList.innerHTML = '';

        books.forEach((book, index) => {
            if ((status === 'All' || book.status === status) &&
                (rating === 0 || book.rating === rating) &&
                (!favoriteOnly || book.favorite)) {
                const bookCard = document.createElement('div');
                bookCard.className = 'col-12 col-md-6 col-lg-4';
                bookCard.innerHTML = `
                    <div class="card ${document.body.classList.contains('dark-mode') ? 'dark-mode' : ''}">
                        <img src="${book.cover}" alt="${book.title}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">by ${book.author}</p>
                            <p>Status: ${book.status}</p>
                            <p>Rating: ${'⭐'.repeat(book.rating)}</p>
                            <button class="btn btn-danger" onclick="removeBook(${index})">Remove</button>
                            <button class="btn ${book.favorite ? 'btn-warning' : 'btn-outline-warning'}" onclick="toggleFavorite(${index})">
                                ${book.favorite ? '★' : '☆'} Favorite
                            </button>
                        </div>
                    </div>
                `;
                bookList.appendChild(bookCard);
            }
        });
    };

    // Add new book
    window.addBook = () => {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const cover = document.getElementById('cover').value;
        const status = document.getElementById('status').value;
        const rating = parseInt(document.getElementById('rating').value);
        if (title && author && cover) {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            books.push({ title, author, cover, status, rating, favorite: false });
            localStorage.setItem('books', JSON.stringify(books));
            loadBooks();
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
            document.getElementById('cover').value = '';
            document.getElementById('status').value = 'To Be Read';
            document.getElementById('rating').value = '0';
        }
    };

    // Remove book
    window.removeBook = (index) => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    };

    // Toggle favorite status
    window.toggleFavorite = (index) => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books[index].favorite = !books[index].favorite;
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    };

    // Theme toggle
    const updateTheme = () => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', darkMode);
        themeToggle.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
        loadBooks();  // Reapply dark mode to cards
    };

    themeToggle.addEventListener('click', () => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        localStorage.setItem('darkMode', !darkMode);
        updateTheme();
    });

    // Filter listeners
    statusFilter.addEventListener('change', loadBooks);
    ratingFilter.addEventListener('change', loadBooks);
    favoriteFilter.addEventListener('change', loadBooks);

    // Initial load
    updateTheme();
    loadBooks();
});
