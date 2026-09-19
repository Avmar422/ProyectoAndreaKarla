// Selectores de elementos del DOM 
const bookList = document.querySelector('#book-list');
const formBook = document.querySelector('#add-book-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');

const API_URL = 'http://localhost:3000/api/libros';

// 1. Obtener todos los libros (GET general)
const obtenerBooks = async () => {
    try {
        bookList.innerHTML = '<p style="color: #c8a051;">Cargando catálogo de libros...</p>';  
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Error al obtener los libros');
        
        const books = await response.json();
        bookList.innerHTML = '';

        for (let book of books) {
            const item = document.createElement('div');
            item.className = 'book-card';
            
            const statusClass = book.status === 'Disponible' ? 'status-available' : 'status-borrowed';

            item.innerHTML = `
              <div class="book-card-content">
                <div class="book-info">
                  <h2 class="book-title">${book.title}</h2>
                  <p class="book-author">Autor: ${book.author}</p>
                  <span class="badge-genre">${book.genre}</span>
                  <span class="badge-status ${statusClass}">${book.status}</span>
                  <p class="copies-left">Disponibles: ${book.availability}</p>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-borrow" onclick="borrowBook(${book.id})">Prestar</button>
                <button class="btn-return" onclick="deleteBook(${book.id})">Eliminar</button>
              </div>
            `;
            
            bookList.appendChild(item);
        }
    } catch (error) {
        console.error('Error al consultar a la API', error);
        bookList.innerHTML = '<p style="color: #ff6b6b;">Error al cargar el catálogo. Inténtalo de nuevo.</p>';
    }
};

// 2. Obtener un libro por ID (GET por ID)
const buscarBookPorId = async () => {
    const id = searchBox.value.trim();

    if (!id) {
        obtenerBooks(); 
        return;
    }

    try {
        bookList.innerHTML = `<p style="color: #c8a051;">Buscando libro #${id}...</p>`;
        const response = await fetch(`${API_URL}/${id}`);

        if (response.ok) {
            const book = await response.json();
            // Pintamos el resultado usando la función displayBooks pasándote un array con el libro encontrado
            displayBooks([book]);
        } else if (response.status === 404) {
            bookList.innerHTML = `<p style="color: #ff6b6b;">No se encontró ningún libro con el ID #${id}.</p>`;
        } else {
            console.error('Error en la búsqueda:', response.statusText);
            bookList.innerHTML = '<p style="color: #ff6b6b;">Error en la respuesta del servidor.</p>';
        }
    } catch (error) {
        console.error('Error al buscar libro:', error);
        bookList.innerHTML = '<p style="color: #ff6b6b;">Error al realizar la búsqueda.</p>';
    }
};
searchButton.addEventListener('click', buscarBookPorId);


// 3. Registrar un nuevo libro mediante el formulario (POST)
formBook.addEventListener('submit', async (event) => {
    event.preventDefault();

    const titleInput = document.querySelector('#title').value.trim();
    const authorInput = document.querySelector('#author').value.trim();
    const genreInput = document.querySelector('#genre').value.trim();
    const synopsisInput = document.querySelector('#synopsis').value.trim();
    const statusInput = document.querySelector('#status').value.trim();
    const availabilityInput = document.querySelector('#availability').value.trim();

    if (!titleInput || !authorInput) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titleInput,
                author: authorInput,
                genre: genreInput,
                synopsis: synopsisInput,
                status: statusInput,
                availability: availabilityInput
            })
        });

        if (response.ok) {
            const newBook = await response.json();
            
            const item = document.createElement('div');
            item.className = 'book-card';
            
            const statusClass = newBook.status === 'Disponible' ? 'status-available' : 'status-borrowed';

            item.innerHTML = `
              <div class="book-card-content">
                <img src="./assets/default-cover.png" alt="Cover" class="book-cover" />
                <div class="book-info">
                  <h2 class="book-title">✨ ${newBook.title} (Nuevo)</h2>
                  <p class="book-author">Autor: ${newBook.author}</p>
                  <span class="badge-genre">${newBook.genre}</span>
                  <span class="badge-status ${statusClass}">${newBook.status}</span>
                  <p class="copies-left">Disponibles: ${newBook.availability}</p>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-borrow" onclick="borrowBook(${newBook.id})">Prestar</button>
                <button class="btn-return" onclick="deleteBook(${newBook.id})">Eliminar</button>
              </div>
            `;
            
            bookList.prepend(item);
            formBook.reset();
        } else {
            console.error('Error al registrar el libro', response.statusText);
        }


    } catch (error) {
        console.error('Error al agregar libro:', error);
    }
});

// 4. Actualizar o prestar un libro (PUT)
async function borrowBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Prestado' })
        });
        if (!response.ok) throw new Error('Error al prestar el libro');
        obtenerBooks();
    } catch (error) {
        console.error('Error al prestar libro:', error);
    }
}

// 5. Eliminar un libro (DELETE)
async function deleteBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar');
        obtenerBooks();
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}


// Conexión del input de búsqueda (`#search-box`) para buscar por ID automáticamente si escribes un número
if (searchBox) {
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value === '') {
            obtenerBooks();
        } else if (!isNaN(value)) {
            getBookById(value);
        }
    });
}

// Cargar la lista automáticamente al iniciar la página
window.onload = obtenerBooks;

