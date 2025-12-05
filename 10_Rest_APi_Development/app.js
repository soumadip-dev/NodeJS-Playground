const express = require('express');

const app = express();
const port = 8080;

// Enable JSON parsing middleware
app.use(express.json());

// Initial book collection
let books = [
  { id: '1', title: 'Pather Panchali' },
  { id: '2', title: 'Chokher Bali' },
  { id: '3', title: 'Gora' },
  { id: '4', title: 'Srikanta' },
  { id: '5', title: 'Devdas' },
  { id: '6', title: 'Aranyak' },
  { id: '7', title: 'Pather Sesh Kothay' },
  { id: '8', title: 'Durgeshnandini' },
  { id: '9', title: 'Anandamath' },
  { id: '10', title: 'Kapalkundala' },
  { id: '11', title: 'Shesher Kobita' },
];

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to our book store API 📚',
  });
});

// Get all books
app.get('/get', (req, res) => {
  res.json(books);
});

// Get a specific book by ID
app.get('/get/:id', (req, res) => {
  const { id } = req.params;
  const matchedBook = books.find(book => book.id === id);

  if (matchedBook) {
    res.json({
      message: 'Book retrieved successfully ✅',
      data: matchedBook,
    });
  } else {
    res.status(404).json({
      message: 'Book not found ❌',
      data: null,
    });
  }
});

// Add a new book
app.post('/add-book', (req, res) => {
  const newBook = {
    id: (books.length + 1).toString(),
    title: 'Chander Pahar',
  };

  books.push(newBook);

  res.status(200).json({
    message: 'New book added successfully ✨',
    newBook,
  });
});

// Update a book title
app.put('/update-book/:id', (req, res) => {
  const { id } = req.params;
  const targetBook = books.find(book => book.id === id);

  if (!targetBook) {
    return res.status(404).json({
      message: 'Book not found ❌',
      data: null,
    });
  }

  targetBook.title = req.body.title || targetBook.title;

  res.status(200).json({
    message: `Book with ID ${id} updated successfully 📝`,
    books,
  });
});

// Delete a book
app.delete('/delete-book/:id', (req, res) => {
  const { id } = req.params;
  const targetBook = books.find(book => book.id === id);

  if (!targetBook) {
    return res.status(404).json({
      message: 'Book not found ❌',
      data: null,
    });
  }

  books = books.filter(book => book.id !== id);

  res.status(200).json({
    message: `Book with ID ${id} deleted successfully 🚮`,
    books,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is now running on port: ${port}`);
});
