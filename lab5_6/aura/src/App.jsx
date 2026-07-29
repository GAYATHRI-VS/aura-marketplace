import { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, PlusCircle, Trash2, ShieldCheck, Tag, Send } from 'lucide-react';

export default function App() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    material: 'Organic Cotton',
    ecoScore: 85,
  });

  // Local Catalog State (with initial item and baseline metrics)
  const [items, setItems] = useState([
    { 
      id: 101, 
      name: 'Eco Linen Shirt', 
      material: 'Hemp Fiber', 
      ecoScore: 92,
      waterSaved: 1380,
      carbonOffset: 37,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. GET REQUEST: DummyJSON API on mount
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        await axios.get('https://dummyjson.com/products/1');
      } catch (error) {
        console.error('API GET Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  // Calculate dynamic totals based on active catalog items
  const totalWaterSaved = items.reduce((sum, item) => sum + (item.waterSaved || 0), 0);
  const totalCarbonOffset = items.reduce((sum, item) => sum + (item.carbonOffset || 0), 0);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. POST REQUEST: Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    const score = parseInt(formData.ecoScore, 10);
    const payload = {
      title: formData.name,
      category: 'sustainable-fashion',
      price: 49.99,
      description: `Material: ${formData.material} | Eco-Score: ${score}/100`,
    };

    try {
      const response = await axios.post('https://dummyjson.com/products/add', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Dynamically calculate metrics based on eco-score
      const newItem = {
        id: response.data.id || Date.now(),
        name: formData.name,
        material: formData.material,
        ecoScore: score,
        waterSaved: score * 15,
        carbonOffset: Math.round(score * 0.4),
      };

      setItems((prev) => [newItem, ...prev]);
      setFormData({ name: '', material: 'Organic Cotton', ecoScore: 85 });
    } catch (error) {
      console.error('API POST Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item handler
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-stone-200 pb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-800 text-white p-2.5 rounded-full">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-widest text-stone-900 uppercase">Aura</h1>
              <p className="text-xs text-stone-500 tracking-wider">Sustainable Fashion Management System</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-3 py-1 rounded-full border border-emerald-200">
            System Active
          </span>
        </header>

        {/* Dynamic Environmental Metrics */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Environmental Impact Metrics
          </h2>
          {loading ? (
            <div className="p-6 bg-white rounded-xl shadow-sm text-stone-400 text-center animate-pulse">
              Syncing analytics data...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <p className="text-xs text-stone-500 uppercase font-medium">Water Saved</p>
                <p className="text-2xl font-medium text-emerald-700 mt-1">
                  {totalWaterSaved.toLocaleString()} L
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <p className="text-xs text-stone-500 uppercase font-medium">Carbon Offset</p>
                <p className="text-2xl font-medium text-stone-800 mt-1">
                  {totalCarbonOffset} kg CO₂e
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <p className="text-xs text-stone-500 uppercase font-medium">Catalog Count</p>
                <p className="text-2xl font-medium text-emerald-700 mt-1">
                  {items.length}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Form and Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className="md:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4 self-start"
          >
            <h2 className="text-base font-medium text-stone-900 border-b pb-2 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              Register New Garment
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Garment Title</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Organic Cotton Trench"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Sustainable Material</label>
              <select
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Organic Cotton">Organic Cotton</option>
                <option value="Recycled Polyester">Recycled Polyester</option>
                <option value="Hemp Fiber">Hemp Fiber</option>
                <option value="Tencel / Lyocell">Tencel / Lyocell</option>
                <option value="Upcycled Denim">Upcycled Denim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Eco-Score: <span className="font-bold text-emerald-700">{formData.ecoScore}</span>/100
              </label>
              <input
                type="range"
                name="ecoScore"
                min="50"
                max="100"
                value={formData.ecoScore}
                onChange={handleChange}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-900 transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting Garment...' : 'Add Garment to Catalog'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Catalog List */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              Active Inventory
            </h2>

            {items.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-stone-200 rounded-xl text-center text-stone-400 text-sm">
                No items registered yet.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between transition-all hover:border-emerald-300"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                          ID: {item.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          {item.material}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          Score: {item.ecoScore}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-400 hover:text-red-500 p-2 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}