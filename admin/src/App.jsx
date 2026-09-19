import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';

export default function App() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (tab === 'orders') {
      axios.get(`${API_URL}/orders`).then(res => setOrders(res.data));
    } else {
      axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
    }
  }, [tab]);

  const handleDeleteProduct = async (id) => {
    if(confirm("Rostdan ham o'chirmoqchimisiz?")) {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', oldPrice: '', newPrice: '', category: '', imageUrl: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setNewProduct(prev => ({ ...prev, imageUrl: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        oldPrice: newProduct.oldPrice ? parseInt(newProduct.oldPrice) : null,
        newPrice: parseInt(newProduct.newPrice)
      };
      await axios.post(`${API_URL}/products`, payload);
      setIsAddingProduct(false);
      setNewProduct({ title: '', description: '', oldPrice: '', newPrice: '', category: '', imageUrl: '' });
      axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
    } catch (error) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Amaliy San'at Admin</h2>
        <nav>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><ShoppingBag /> Buyurtmalar</button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><Package /> Asarlar</button>
        </nav>
      </aside>
      <main className="content">
        {tab === 'orders' ? (
          <div>
            <h2>Tushgan Buyurtmalar</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mijoz</th>
                  <th>Tel</th>
                  <th>Asarlar</th>
                  <th>Summa</th>
                  <th>Vaqt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user.name}</td>
                    <td>{o.user.phone || '-'}</td>
                    <td>{o.items.map(i => i.title).join(', ')}</td>
                    <td>{o.totalPrice.toLocaleString()} so'm</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div className="header-flex">
              <h2>Galereyadagi asarlar</h2>
              <button className="primary-btn" onClick={() => setIsAddingProduct(!isAddingProduct)}>
                <Plus /> {isAddingProduct ? "Yopish" : "Yangi qo'shish"}
              </button>
            </div>
            
            {isAddingProduct && (
              <div className="add-product-form">
                <h3>Yangi asar qo'shish</h3>
                <form onSubmit={submitProduct}>
                  <input type="text" placeholder="Asar nomi" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                  <input type="text" placeholder="Kategoriya (masalan: Moybo'yoq)" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                  <textarea placeholder="Tarifi (o'lchamlari va hk)" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                  <div className="price-inputs">
                    <input type="number" placeholder="Eski narxi (ixtiyoriy)" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} />
                    <input type="number" placeholder="Yangi narxi" required value={newProduct.newPrice} onChange={e => setNewProduct({...newProduct, newPrice: e.target.value})} />
                  </div>
                  <div className="image-upload">
                    <label>Asar rasmini yuklang:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} required />
                    {newProduct.imageUrl && <img src={newProduct.imageUrl} width="100" alt="Preview" />}
                  </div>
                  <button type="submit" className="primary-btn">Saqlash</button>
                </form>
              </div>
            )}
            <table>
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Nom</th>
                  <th>Kategoriya</th>
                  <th>Narx</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.imageUrl} width="50" alt="art" /></td>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.newPrice.toLocaleString()} so'm</td>
                    <td><button className="danger-btn" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
