const apiUrl = 'http://localhost:3000/books'; 

// Función para obtener todos los libros
async function getBooks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error al obtener los libros');
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error(error);
  }
}

// Función para mostrar los libros en el DOM
function displayBooks(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = ''; // Limpiar la lista antes de agregar los nuevos libros
  books.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.className = 'book-card';
    bookItem.innerHTML = `
      <div class="book-card-content">
        <img src="./assets/default-cover.png" alt="Cover" class="book-cover" />
        <div class="book-info">
          <h2 class="book-title">${book.title}</h2>
          <p class="book-author">Autor: \${book.author}</p>
          <p class="copies-left">Disponibles: \${book.availability}</p>
          <span class="badge-genre">${book.genre}</span>
          <span class="badge-status \${book.status === 'Disponible' ? 'status-available' : 'status-borrowed'}">${book.status}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-borrow" onclick="borrowBook(${book.id})">Prestar</button>
        <button class="btn-return" onclick="deleteBook(${book.id})">Eliminar</button>
      </div>
    `;
    bookList.appendChild(bookItem);
  });
}
  window.onload = getBooks;

