import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, FolderTree } from 'lucide-react';
import axiosClient from '../../../store/axiosClient';

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        try {
          const res = await axiosClient.get(`/admin/categories/${id}`);
          setFormData({ name: res.name, slug: res.slug });
        } catch (error) {
          console.error("Lỗi tải chi tiết:", error);
        }
      };
      fetchDetail();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto Slug
    if (name === 'name' && !isEditMode) {
        const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
        setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (isEditMode) {
            await axiosClient.patch(`/admin/categories/${id}`, formData);
            alert("Cập nhật thành công!");
        } else {
            await axiosClient.post('/admin/categories', formData);
            alert("Tạo danh mục thành công!");
        }
        navigate('/admin/categories');
    } catch (error) {
        console.error("Lỗi lưu:", error);
        alert("Lỗi: " + (error.response?.data?.message || "Có lỗi xảy ra"));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/categories')} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={20}/> Quay lại
        </button>
        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h1>
      </div>

      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên Danh mục</label>
                <input 
                    type="text" name="name"
                    value={formData.name} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-vtv-green outline-none"
                    placeholder="VD: Phần mềm AI"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Slug (Đường dẫn)</label>
                <input 
                    type="text" name="slug"
                    value={formData.slug} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-gray-400 font-mono text-sm focus:border-vtv-green outline-none"
                />
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={loading || !formData.name}
                className="w-full bg-vtv-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
                <Save size={20}/> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormPage;