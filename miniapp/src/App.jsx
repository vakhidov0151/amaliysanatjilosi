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

  const [location, setLocation] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const deliveryFee = 20000; // 20,000 UZS static fake delivery fee

  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

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

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Sizning qurilmangizda manzilni aniqlash funksiyasi yo'q.");
      return;
    }
    setAddressLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setAddressLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Manzilni aniqlashda xatolik! Telefon sozlamalaridan GPS'ga ruxsat bering.");
        setAddressLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const checkout = async () => {
    if (!location) {
      alert("Iltimos, avval manzilingizni aniqlang!");
      return;
    }
    const userId = tg.initDataUnsafe?.user?.id || 12345;
    const name = tg.initDataUnsafe?.user?.first_name || 'Xaridor';
    const itemsTotal = cart.reduce((sum, item) => sum + item.newPrice, 0);
    const totalPrice = itemsTotal + deliveryFee;
    
    try {
      await axios.post(`${API_URL}/orders`, {
        userId,
        name,
        phone,
        items: cart,
        totalPrice,
        location: `https://www.google.com/maps?q=${location.lat},${location.lng}`
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
        <h1>Apteka botiga xush kelibsiz! 💊</h1>
        <p>Sog'lig'ingiz uchun eng kerakli dorilarni uydan chiqmay buyurtma qiling.</p>
        <button className="primary-btn" onClick={() => setOnboarding(false)}>Katalogga o'tish</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {activeTab === 'home' && (
        <div className="home-screen">
          <header>
            <h2>Salom, {tg.initDataUnsafe?.user?.first_name || 'Aziz mijoz'}! 👋</h2>
            <p>Bugun qanday dori vositalari izlayapsiz?</p>
          </header>
          <div className="hero-widget">
            <h3>Yangi dorilar va vitaminlar</h3>
            <button className="primary-btn" onClick={() => setActiveTab('catalog')}>Katalogga o'tish</button>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="catalog-screen">
          <h2>Katalog</h2>
          <div className="categories-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '0 15px 15px', scrollbarWidth: 'none' }}>
            {['Barchasi', ...new Set(products.map(p => p.category))].map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedCategory(c)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  whiteSpace: 'nowrap',
                  background: selectedCategory === c ? '#1e88e5' : '#e3f2fd',
                  color: selectedCategory === c ? '#fff' : '#1e88e5',
                  fontWeight: selectedCategory === c ? 'bold' : 'normal',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {products.filter(p => selectedCategory === 'Barchasi' || p.category === selectedCategory).map(p => (
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

              <div className="location-container" style={{ marginTop: '15px' }}>
                <label>Yetkazib berish manzili:</label>
                {location ? (
                  <div style={{ color: '#2ecc71', fontSize: '14px', marginTop: '5px' }}>
                    ✅ Manzilingiz aniqlandi (GPS orqali)
                  </div>
                ) : (
                  <button 
                    onClick={getLocation} 
                    style={{ background: '#f0f0f0', color: '#333', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginTop: '5px', cursor: 'pointer' }}
                  >
                    {addressLoading ? "Aniqlanmoqda..." : "📍 Manzilimni aniqlash"}
                  </button>
                )}
              </div>

              <div className="total" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#666' }}>
                  <span>Tovarlar:</span>
                  <span>{cart.reduce((a, b) => a + b.newPrice, 0).toLocaleString()} so'm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  <span>Yetkazib berish:</span>
                  <span>{deliveryFee.toLocaleString()} so'm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                  <strong>Jami: </strong>
                  <strong>{(cart.reduce((a, b) => a + b.newPrice, 0) + deliveryFee).toLocaleString()} so'm</strong>
                </div>
              </div>
              <button 
                className="primary-btn" 
                onClick={checkout}
                disabled={!phone || !location}
                style={{ opacity: (phone && location) ? 1 : 0.5 }}
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
