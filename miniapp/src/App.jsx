import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Search, ShoppingCart, User as UserIcon, Plus, X } from 'lucide-react';
import './App.css';
import './phone.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Normally Telegram WebApp injects window.Telegram.WebApp
const tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 12345, first_name: 'Test', last_name: 'User' } }, close: () => alert('App closed') };

export default function App() {
  const [onboarding, setOnboarding] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [phone, setPhone] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    tg.ready && tg.ready();
    tg.expand && tg.expand();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const checkout = async () => {
    const userId = tg.initDataUnsafe?.user?.id || 12345;
    const name = tg.initDataUnsafe?.user?.first_name || 'Xaridor';
    const totalPrice = cart.reduce((sum, item) => sum + item.newPrice, 0);
    
    try {
      await axios.post(`${API_URL}/orders`, {
        userId,
        name,
        phone,
        items: cart,
        totalPrice,
      });
      alert('Buyurtma qabul qilindi! Kuryer siz bilan boglanadi.');
      setCart([]);
      tg.close();
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  if (onboarding) {
    return (
      <div className="onboarding">
        <h1>San'at asarlari olamiga xush kelibsiz! 🎨</h1>
        <p>Uy va ofisingiz uchun eng noyob va chiroyli asarlarni tanlang.</p>
        <button className="primary-btn" onClick={() => setOnboarding(false)}>Boshlash</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {activeTab === 'home' && (
        <div className="home-screen">
          <header>
            <h2>Salom, {tg.initDataUnsafe?.user?.first_name || 'Aziz mijoz'}! 👋</h2>
            <p>Bugun qanday san'at asari izlayapsiz?</p>
          </header>
          <div className="hero-widget">
            <h3>Yangi kolleksiyalarni ko'rish</h3>
            <button onClick={() => setActiveTab('catalog')}>Katalogga o'tish</button>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="catalog-screen">
          <h2>Katalog</h2>
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-card" onClick={() => setSelectedProduct(p)}>
                <img src={p.imageUrl} alt={p.title} />
                <h4>{p.title}</h4>
                <div className="price-row">
                  {p.oldPrice && <span className="old-price">{p.oldPrice.toLocaleString()} so'm</span>}
                  <span className="new-price">{p.newPrice.toLocaleString()} so'm</span>
                </div>
                <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}><Plus size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="cart-screen">
          <h2>Savatcha ({cart.length})</h2>
          {cart.length === 0 ? <p>Savatcha bo'sh.</p> : (
            <div className="cart-items">
              {cart.map((c, idx) => (
                <div key={idx} className="cart-item">
                  <span>{c.title}</span>
                  <span>{c.newPrice.toLocaleString()} so'm</span>
                </div>
              ))}
              <div className="phone-input-container">
                <label>Telefon raqamingiz:</label>
                <input 
                  type="tel" 
                  placeholder="+998 90 123 45 67" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div className="total">
                <strong>Jami: </strong>
                <span>{cart.reduce((a, b) => a + b.newPrice, 0).toLocaleString()} so'm</span>
              </div>
              <button 
                className="primary-btn" 
                onClick={checkout}
                disabled={!phone}
                style={{ opacity: phone ? 1 : 0.5 }}
              >
                Buyurtmani tasdiqlash
              </button>
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="bottom-sheet">
          <div className="sheet-content">
            <button className="close-btn" onClick={() => setSelectedProduct(null)}><X /></button>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.title} />
            <h2>{selectedProduct.title}</h2>
            <p className="desc">{selectedProduct.description}</p>
            <p className="category">Kategoriya: {selectedProduct.category}</p>
            <button className="primary-btn sticky" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
              Savatchaga qo'shish — {selectedProduct.newPrice.toLocaleString()} so'm
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}><Home /></button>
        <button onClick={() => setActiveTab('catalog')} className={activeTab === 'catalog' ? 'active' : ''}><Search /></button>
        <button onClick={() => setActiveTab('cart')} className={activeTab === 'cart' ? 'active' : ''}>
          <ShoppingCart />
          {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </button>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}><UserIcon /></button>
      </nav>
    </div>
  );
}
