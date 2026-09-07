import { FormEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

const api = axios.create({
  baseURL: '/api',
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalProducts = products.length;

  const totalValue = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<Product[]>('/products');
      setProducts(response.data);
    } catch {
      setError('Unable to load products. Please make sure the backend and database are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      await api.post('/products', {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
      });

      setName('');
      setPrice('');
      setCategory('');

      await fetchProducts();
    } catch {
      setError('Unable to add the product. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError('');

      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch {
      setError('Unable to delete the product. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div className="hero-content">
            <span className="eyebrow">Docker Learning Project</span>

            <h1>MERN Product Dashboard</h1>

            <p className="hero-text">
              A simple full-stack application built with MongoDB, Express, React, and Node.js. This
              project is used to learn how to containerize a MERN application with Docker and Docker
              Compose.
            </p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span className="stat-icon">▦</span>
              <div>
                <span className="stat-label">Products</span>
                <strong>{totalProducts}</strong>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">₹</span>
              <div>
                <span className="stat-label">Total Value</span>
                <strong>₹{totalValue.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        </header>

        <main className="grid">
          <section className="card add-card">
            <div className="card-header">
              <div>
                <span className="section-number">01</span>
                <h2>Add Product</h2>
              </div>
            </div>

            <p className="muted">Add a product to test the React → Express → MongoDB flow.</p>

            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Wireless Keyboard"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="price">Price</label>
                <div className="input-wrapper">
                  <span>₹</span>
                  <input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={event => setPrice(event.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  type="text"
                  placeholder="e.g. Electronics"
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  required
                />
              </div>

              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Add Product
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="card products-card">
            <div className="card-header products-header">
              <div>
                <span className="section-number">02</span>
                <h2>Product List</h2>
              </div>

              <span className="count-badge">
                {totalProducts} {totalProducts === 1 ? 'item' : 'items'}
              </span>
            </div>

            <p className="muted">Manage the products stored in your MongoDB database.</p>

            {loading ? (
              <div className="empty-state">
                <span className="spinner dark-spinner" />
                <span>Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">+</div>
                <strong>No products yet</strong>
                <span>Add your first product using the form.</span>
              </div>
            ) : (
              <div className="product-list">
                {products.map(product => (
                  <div className="product-card" key={product._id}>
                    <div className="product-info">
                      <div className="product-icon">{product.name.charAt(0).toUpperCase()}</div>

                      <div>
                        <h3>{product.name}</h3>
                        <span className="category">{product.category}</span>
                      </div>
                    </div>

                    <div className="product-meta">
                      <strong>₹{product.price.toLocaleString('en-IN')}</strong>

                      <button
                        className="danger-button"
                        onClick={() => handleDelete(product._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {error && <div className="error-box">{error}</div>}

        <footer className="footer">
          <span>MERN Stack</span>
          <span>•</span>
          <span>Docker Learning Project</span>
        </footer>
      </div>
    </div>
  );
}
