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
              <button className="primary-btn"><Plus /> Yangi qo'shish</button>
            </div>
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
