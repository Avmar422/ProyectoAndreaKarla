// Selectores de elementos del DOM 
const bookList = document.querySelector('#book-list');
const formBook = document.querySelector('#add-book-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');

const API_URL = 'http://localhost:3000/api/libros';

// Display de libros
const display = (books) => {
    bookList.innerHTML = '';

    for (let book of books) {
        const item = document.createElement('div');
        item.className = 'book-card';
        
        const statusClass = book.estado === 'Bueno' ? 'status-available' : 'status-borrowed';

        item.innerHTML = `
          <div class="book-card-content">
            <img src="./assets/default-cover.png" alt="Cover" class="book-cover" />
            <div class="book-info">
              <h2 class="book-title">${book.titulo}</h2>
              <p class="book-author">Autor: ${book.autor}</p>
              <span class="badge-genre">${book.genero}</span>
              <span class="badge-status ${statusClass}">${book.estado}</span>
              <p class="copies-left">Disponibilidad: ${book.disponibilidad}</p>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-borrow" onclick="borrowBook(${book.id})">Prestar</button>
            <button class="btn-return" onclick="deleteBook(${book.id})">Eliminar</button>
          </div>
        `;
        
        bookList.appendChild(item);
    }
};

// 1. Obtener todos los libros (GET general)
const obtenerBooks = async () => {
    try {
        bookList.innerHTML = '<p style="color: #c8a051;">Cargando catálogo de libros...</p>';  
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Error al obtener los libros');
        
        const books = await response.json();
        display(books);
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
            display([book]);

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

    const tituloInput = document.querySelector('#titulo').value.trim();
    const autorInput = document.querySelector('#autor').value.trim();
    const generoInput = document.querySelector('#genero').value.trim();
    const sinopsisInput = document.querySelector('#sinopsis').value.trim();
    const estadoInput = document.querySelector('#estado').value.trim();
    const disponibilidadInput = document.querySelector('#disponibilidad').value.trim();

    if (!tituloInput || !autorInput) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: tituloInput,
                autor: autorInput,
                genero: generoInput,
                sinopsis: sinopsisInput,
                estado: estadoInput,
                disponibilidad: disponibilidadInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            const newBook = data.libro;
            
            const item = document.createElement('div');
            item.className = 'book-card';
            
            const statusClass = newBook.estado === 'Bueno' ? 'status-available' : 'status-borrowed';

            item.innerHTML = `
              <div class="book-card-content">
                <img src="./assets/default-cover.png" alt="Cover" class="book-cover" />
                <div class="book-info">
                  <h2 class="book-title">${newBook.titulo} (Nuevo)</h2>
                  <p class="book-author">Autor: ${newBook.autor}</p>   
                  <span class="badge-genre">${newBook.genero}</span>    
                  <span class="badge-status ${statusClass}">${newBook.estado}</span> 
                  <p class="copies-left">Disponibilidad: ${newBook.disponibilidad}</p> 
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
            const errorText = await response.text();
            console.error('Error al registrar el libro:', errorText);
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
            body: JSON.stringify({ disponibilidad: 'No disponible' })
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

// Conexión del input de búsqueda (`#search-box`)
if (searchBox) {
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value === '') {
            obtenerBooks();
        } else if (!isNaN(value)) {
            buscarBookPorId();
        }
    });
}

// Cargar la lista automáticamente al iniciar la página
window.onload = obtenerBooks;