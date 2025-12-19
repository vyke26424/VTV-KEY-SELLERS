import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  Type,
  Tag,
  BrainCircuit,
  X,
} from 'lucide-react';
import axiosClient from '../../../store/axiosClient';

// --- COMPONENT NHẬP TAGS (Tái sử dụng) ---
const TagInput = ({ label, value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-700 rounded-lg focus-within:border-vtv-green transition">
        {value.map((tag, index) => (
          <span
            key={index}
            className="bg-slate-800 text-gray-200 text-xs px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none text-white text-sm flex-1 min-w-[100px]"
          placeholder={placeholder || 'Nhập rồi bấm Enter...'}
        />
      </div>
    </div>
  );
};

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // State Form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    categoryId: '',
    isHot: false,
    isActive: true,
    variants: [{ name: 'Mặc định', price: 0, orginalPrice: 0 }],
    // --- THÊM TRƯỜNG MỚI ---
    keywords: [], // Mảng string
    aiMeta: {
      // Object chứa các mảng con
      features: [],
      suitable_for: [],
    },
  });

  // 1. Load dữ liệu
  useEffect(() => {
    const initData = async () => {
      try {
        const catRes = await axiosClient.get('/products/seed-categories');
        // Mock category nếu API chưa có
        const mockCategories = [
          { id: 1, name: 'AI & Chatbot' },
          { id: 2, name: 'Giải trí' },
          { id: 3, name: 'Game' },
          { id: 4, name: 'Phần mềm' },
        ];
        setCategories(mockCategories);

        if (isEditMode) {
          const product = await axiosClient.get(`/admin/product/${id}`);
          console.log('Fetched Product Data:', product);
          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            thumbnail: product.thumbnail || '',
            categoryId: product.categoryId,
            isHot: product.isHot,
            isActive: product.isActive,
            variants:
              product.variants.length > 0
                ? product.variants
                : [{ name: 'Default', price: 0, orginalPrice: 0 }],
            // Load Keywords & Meta (nếu có)
            keywords: product.keyword ? product.keyword.map((k) => k.name) : [],
            aiMeta: product.aiMetadata || { features: [], suitable_for: [] },
          });
        }
      } catch (error) {
        console.error('Lỗi khởi tạo:', error);
      }
    };
    initData();
  }, [id, isEditMode]);

  // 2. Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Auto Slug Logic... (Giữ nguyên)
    if (name === 'name' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // 3. Variant Logic... (Giữ nguyên các hàm handleVariantChange, addVariant, removeVariant)
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };
  const addVariant = () =>
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: 0, orginalPrice: 0 }],
    });
  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      });
    }
  };

  // 4. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        thumbnail: formData.thumbnail,
        categoryId: Number(formData.categoryId),
        isHot: Boolean(formData.isHot),
        isActive: Boolean(formData.isActive),
        variants: formData.variants.map((v) => ({
          name: v.name,
          price: Number(v.price),
          orginalPrice: Number(v.orginalPrice),
        })),
        // --- GỬI THÊM 2 TRƯỜNG MỚI ---
        keywords: formData.keywords, // Backend cần mảng string ['youtube', 'nhạc']
        meta: formData.aiMeta, // Backend cần object json { features: [], ... }
      };

      if (isEditMode) {
        await axiosClient.patch(`/admin/product/${id}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await axiosClient.post('/admin/product', payload);
        alert('Thêm mới thành công!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Lỗi submit:', error);
      alert(
        'Lỗi: ' + (error.response?.data?.message || 'Kiểm tra lại thông tin.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? `Sửa sản phẩm #${id}` : 'Thêm sản phẩm'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-vtv-green text-black px-6 py-2.5 rounded-lg font-bold hover:bg-green-400 transition disabled:opacity-50"
        >
          <Save size={20} /> {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Thông tin cơ bản */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Type size={18} className="text-blue-400" /> Thông tin cơ bản
            </h3>

            {/* Tên & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green outline-none"
                  placeholder="Sản phẩm A"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-gray-300 font-mono text-sm focus:border-vtv-green outline-none"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Mô tả</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green outline-none"
              ></textarea>
            </div>

            {/* --- KEYWORDS (TỪ KHÓA TÌM KIẾM) --- */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-white font-medium">
                <Tag size={16} className="text-yellow-500" /> Từ khóa tìm kiếm
                (SEO & Search)
              </div>
              <TagInput
                placeholder="Nhập từ khóa (youtube, nhạc...) rồi Enter"
                value={formData.keywords}
                onChange={(newTags) =>
                  setFormData({ ...formData, keywords: newTags })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Các từ đồng nghĩa, viết tắt, tiếng việt có dấu/không dấu mà
                người dùng hay tìm.
              </p>
            </div>
          </div>

          {/* 2. Dữ liệu AI (Metadata) */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BrainCircuit size={18} className="text-pink-500" /> Dữ liệu AI
              (Metadata)
            </h3>

            <TagInput
              label="Tính năng nổi bật (Features)"
              placeholder="VD: Không quảng cáo, Nghe nhạc nền..."
              value={formData.aiMeta.features || []}
              onChange={(newTags) =>
                setFormData({
                  ...formData,
                  aiMeta: { ...formData.aiMeta, features: newTags },
                })
              }
            />

            <TagInput
              label="Đối tượng phù hợp (Suitable For)"
              placeholder="VD: Sinh viên, Gia đình, Người yêu nhạc..."
              value={formData.aiMeta.suitable_for || []}
              onChange={(newTags) =>
                setFormData({
                  ...formData,
                  aiMeta: { ...formData.aiMeta, suitable_for: newTags },
                })
              }
            />
          </div>

          {/* 3. Variants (Giữ nguyên) */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-purple-400" /> Các gói dịch vụ
              </h3>
              <button
                onClick={addVariant}
                type="button"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded flex items-center gap-1 transition"
              >
                <Plus size={14} /> Thêm gói
              </button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 items-center bg-slate-950 p-3 rounded-lg border border-slate-800"
                >
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, 'name', e.target.value)
                    }
                    className="flex-1 bg-transparent border-b border-slate-700 focus:border-vtv-green outline-none text-white text-sm pb-1"
                    placeholder="Tên gói"
                  />
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, 'price', e.target.value)
                    }
                    className="w-24 bg-transparent border-b border-slate-700 focus:border-vtv-green outline-none text-vtv-green font-bold text-sm pb-1"
                    placeholder="Giá bán"
                  />
                  <input
                    type="number"
                    value={variant.orginalPrice}
                    onChange={(e) =>
                      handleVariantChange(index, 'orginalPrice', e.target.value)
                    }
                    className="w-24 bg-transparent border-b border-slate-700 focus:border-vtv-green outline-none text-gray-400 text-sm pb-1"
                    placeholder="Giá gốc"
                  />
                  <button
                    onClick={() => removeVariant(index)}
                    className="text-slate-600 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">
              Phân loại
            </h3>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green outline-none"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isHot"
                checked={formData.isHot}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-white">Sản phẩm HOT 🔥</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-white">Đang hoạt động</label>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
              <ImageIcon size={16} /> Hình ảnh
            </h3>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-gray-300 focus:border-vtv-green outline-none"
              placeholder="Link ảnh..."
            />
            <div className="aspect-video rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden">
              {formData.thumbnail ? (
                <img
                  src={formData.thumbnail}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <span className="text-gray-600 text-xs">No Image</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;
