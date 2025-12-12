import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  DollarSign,
  Type,
} from 'lucide-react';
import axiosClient from '../../../store/axiosClient';

const ProductFormPage = () => {
  const { id } = useParams(); // Lấy ID từ URL (nếu có là mode EDIT, không có là CREATE)
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // State lưu dữ liệu Form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    categoryId: '',
    isHot: false,
    isActive: true,
    variants: [
      { name: 'Mặc định', price: 0, orginalPrice: 0 }, // Mặc định có 1 dòng variant
    ],
  });

  // --- 1. LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const initData = async () => {
      try {
        // 1.1 Lấy danh sách danh mục để đổ vào Select Box
        // Lưu ý: Đảm bảo bạn đã có API /admin/category hoặc /categories
        const catRes = await axiosClient.get('/products/seed-categories');
        // ⚠️ Tạm thời gọi seed để có data mẫu hoặc gọi API '/admin/category' nếu bạn đã làm Controller đó
        // Nếu backend chưa có API list category, bạn có thể hardcode tạm một mảng ở đây.

        // Giả sử API trả về mảng category (cần kiểm tra format trả về thực tế của bạn)
        // Ở đây mình giả định bạn đã có danh mục trong DB
        // Tạm thời mình fix cứng danh sách nếu chưa có API category:
        const mockCategories = [
          { id: 1, name: 'AI & Chatbot' },
          { id: 2, name: 'Giải trí (Netflix/Spotify)' },
          { id: 3, name: 'Game' },
          { id: 4, name: 'Phần mềm' },
        ];
        setCategories(mockCategories);

        // 1.2 Nếu là Edit Mode -> Gọi API lấy chi tiết sản phẩm
        if (isEditMode) {
          const productRes = await axiosClient.get(`/admin/product/${id}`);
          // Backend trả về object product, ta fill vào form
          const product = productRes;

          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            thumbnail: product.thumbnail || '',
            categoryId: product.categoryId,
            isHot: product.isHot,
            isActive: product.isActive,
            // Nếu sản phẩm không có variant nào thì để mảng rỗng hoặc 1 cái mặc định
            variants:
              product.variants.length > 0
                ? product.variants
                : [{ name: 'Default', price: 0, orginalPrice: 0 }],
          });
        }
      } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        alert('Có lỗi khi tải dữ liệu!');
      }
    };

    initData();
  }, [id, isEditMode]);

  // --- 2. XỬ LÝ INPUT CƠ BẢN ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto generate Slug từ Name (chỉ khi đang nhập tên và chưa có slug custom)
    if (name === 'name' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng việt
        .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, '-'); // Thay khoảng trắng bằng -
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // --- 3. XỬ LÝ VARIANTS (THÊM / SỬA / XÓA DÒNG) ---
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: 0, orginalPrice: 0 }],
    });
  };

  const removeVariant = (index) => {
    if (formData.variants.length === 1) {
      alert('Sản phẩm phải có ít nhất 1 gói dịch vụ!');
      return;
    }
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  // --- 4. SUBMIT FORM (TẠO MỚI HOẶC CẬP NHẬT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chuẩn hóa dữ liệu trước khi gửi (ép kiểu số)
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        thumbnail: formData.thumbnail,
        categoryId: Number(formData.categoryId),
        isHot: Boolean(formData.isHot),       // Đảm bảo là boolean
        isActive: Boolean(formData.isActive), // Đảm bảo là boolean
        
        // Map lại variants để loại bỏ id, productId, createdAt... thừa thãi
        variants: formData.variants.map(v => ({
            name: v.name,
            price: Number(v.price),
            orginalPrice: Number(v.orginalPrice)
            // Tuyệt đối KHÔNG gửi v.id hay v.createdAt ở đây
        }))
      };

      if (isEditMode) {
        // GỌI API UPDATE
        await axiosClient.patch(`/admin/product/${id}`, payload);
        alert('Cập nhật thành công!');
      } else {
        // GỌI API CREATE
        await axiosClient.post('/admin/product', payload);
        alert('Thêm mới thành công!');
      }

      navigate('/admin/products'); // Quay về danh sách
    } catch (error) {
      console.error('Lỗi submit:', error);
      alert(
        'Lỗi: ' +
          (error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.'),
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
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? `Chỉnh sửa sản phẩm #${id}` : 'Thêm sản phẩm mới'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-vtv-green text-black px-6 py-2.5 rounded-lg font-bold hover:bg-green-400 transition shadow-lg shadow-green-500/20 disabled:opacity-50"
        >
          <Save size={20} /> {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: THÔNG TIN CHÍNH --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Type size={18} className="text-blue-400" /> Thông tin cơ bản
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green focus:outline-none"
                  placeholder="Ví dụ: Netflix Premium 1 Năm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Slug (Đường dẫn)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-gray-300 font-mono text-sm focus:border-vtv-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green focus:outline-none"
                  placeholder="Mô tả sản phẩm..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: Biến thể (Variants) */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-purple-400" /> Các gói dịch vụ
                (Variants)
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
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-950 p-3 rounded-lg border border-slate-800 group"
                >
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Tên gói
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(index, 'name', e.target.value)
                      }
                      className="w-full bg-transparent border-b border-slate-700 focus:border-vtv-green focus:outline-none text-white text-sm pb-1"
                      placeholder="VD: Gói 1 Tháng"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Giá bán
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, 'price', e.target.value)
                      }
                      className="w-full bg-transparent border-b border-slate-700 focus:border-vtv-green focus:outline-none text-vtv-green font-bold text-sm pb-1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Giá gốc (Gạch)
                    </label>
                    <input
                      type="number"
                      value={variant.orginalPrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          'orginalPrice',
                          e.target.value,
                        )
                      }
                      className="w-full bg-transparent border-b border-slate-700 focus:border-vtv-green focus:outline-none text-gray-400 text-sm pb-1"
                    />
                  </div>
                  <button
                    onClick={() => removeVariant(index)}
                    className="text-slate-600 hover:text-red-500 p-2 sm:mt-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: CẤU HÌNH PHỤ --- */}
        <div className="space-y-6">
          {/* Card 3: Phân loại & Ảnh */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
              Phân loại
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Danh mục
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-vtv-green focus:outline-none"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isHot"
                  name="isHot"
                  checked={formData.isHot}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-vtv-green focus:ring-vtv-green"
                />
                <label
                  htmlFor="isHot"
                  className="text-sm text-white select-none cursor-pointer"
                >
                  Sản phẩm HOT 🔥
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-vtv-green focus:ring-vtv-green"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-white select-none cursor-pointer"
                >
                  Đang hoạt động (Hiện trên web)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Hình ảnh
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Link ảnh (Thumbnail)
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-gray-300 focus:border-vtv-green focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Preview Ảnh */}
              <div className="aspect-video rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <div className="text-gray-600 text-xs flex flex-col items-center">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    Chưa có ảnh
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;
