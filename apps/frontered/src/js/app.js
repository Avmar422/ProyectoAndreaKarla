const API_URL = 'http://localhost:3000/api/libros';

  // Función para obtener todos los libros
  async function getBooks() {
    const response = await fetch(apiUrl);
    const books = await response.json();
    displayBooks(books);
  }

  // Función para mostrar los libros en el DOM
  function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; 
    books.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.className = 'book-item';
      bookItem.innerHTML = `
        <h2>${book.title}</h2>
        <p>Autor: \${book.author}</p>
        <p>ISBN: \${book.isbn}</p>
        <button onclick="deleteBook(${book.id})">Eliminar</button>
      `;
      bookList.appendChild(bookItem);
    });
  };

  window.onload = getBooks;
