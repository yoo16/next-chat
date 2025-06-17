'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { languages } from '@/data/langs';

export default function EditUserForm({ user }: { user: any }) {
    const [formData, setFormData] = useState({
        name: user.name,
        displayName: user.displayName || '',
        profile: user.profile || '',
        lang: user.lang || '',
        image: user.image || '',
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', formData.name);
        form.append('displayName', formData.displayName);
        form.append('profile', formData.profile);
        form.append('lang', formData.lang);
        if (formData.image) {
            form.append('image', formData.image); // File を送信
        }

        const res = await fetch(`/user/${user.id}/edit/update`, {
            method: 'POST',
            body: form,
        });

        if (res.ok) {
            router.push(`/user/${user.id}`);
        } else {
            alert('更新に失敗しました');
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10" encType="multipart/form-data">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
                <input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロフィール</label>
                <textarea
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">言語</label>
                <select
                    name="lang"
                    value={formData.lang}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">選択してください</option>
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">画像ファイル</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData(prev => ({ ...prev, image: file }));
                    }}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button type="submit" className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    保存
                </button>
                <a href={`/user/${user.id}`} className="px-6 py-2 border rounded text-blue-500 hover:bg-gray-100">
                    キャンセル
                </a>
            </div>

        </form>

    );
}