require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const { Pool } = require('pg');
const ejsLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// EJS setup
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Routes
const router = express.Router();

// GET all books with sorting
router.get('/books', async (req, res) => {
  try {
    const validSorts = ['title', 'author', 'rating', 'date_read', 'created_at'];
    const validDirections = ['ASC', 'DESC'];
    
    let { sort = 'created_at', direction = 'DESC' } = req.query;
    
    sort = validSorts.includes(sort) ? sort : 'created_at';
    direction = validDirections.includes(direction.toUpperCase()) 
      ? direction.toUpperCase() 
      : 'DESC';

    const query = `
      SELECT *, 
        TO_CHAR(date_read, 'YYYY-MM-DD') AS formatted_date,
        CASE WHEN rating IS NULL THEN 0 ELSE rating END AS safe_rating
      FROM books
      ORDER BY ${sort} ${direction}
    `;
    
    const { rows } = await pool.query(query);
    res.render('books/index', { 
      books: rows,
      currentSort: sort,
      currentDirection: direction 
    });
    
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).render('error', { message: 'Failed to load books' });
  }
});

// GET new book form
router.get('/books/new', (req, res) => {
  res.render('books/new');
});

// POST create new book
router.post('/books', async (req, res) => {
  try {
    const { title, author, rating, notes, date_read, isbn } = req.body;
    
    await pool.query(
      `INSERT INTO books 
       (title, author, rating, notes, date_read, isbn)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [title, author, parseInt(rating), notes, date_read, isbn]
    );
    
    res.redirect('/books');
    
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).render('error', { 
      message: 'Failed to create book - check ISBN uniqueness'
    });
  }
});

// GET edit book form
router.get('/books/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).render('error', { message: 'Book not found' });
    }
    
    res.render('books/edit', { book: rows[0] });
    
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).render('error', { message: 'Failed to load book' });
  }
});

// PUT update book
router.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, rating, notes, date_read, isbn } = req.body;
    
    await pool.query(
      `UPDATE books SET
        title = $1,
        author = $2,
        rating = $3,
        notes = $4,
        date_read = $5,
        isbn = $6
       WHERE id = $7`,
      [title, author, rating, notes, date_read, isbn, id]
    );
    
    res.redirect('/books');
    
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).render('error', { message: 'Failed to update book' });
  }
});

// DELETE book
router.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.redirect('/books');
    
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).render('error', { message: 'Failed to delete book' });
  }
});

app.use('/', router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});