import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UploadReport = () => {
    const { currentUser } = useAuth();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, done
    const [formData, setFormData] = useState({
        title: '',
        disasterType: '',
        state: '',
        district: '',
        date: new Date().toISOString().slice(0, 10),
    });
    const [resultData, setResultData] = useState(null);
    const [errors, setErrors] = useState({});

    const handleUpload = async (e) => {
        e.preventDefault();
        const nextErrors = {};
        if (!file) nextErrors.file = 'Please select a PDF or image report.';
        ['title', 'disasterType', 'state', 'district', 'date'].forEach((field) => {
            if (!formData[field].trim()) nextErrors[field] = 'This field is required.';
        });

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        if (!currentUser) {
            setErrors({ form: 'Please log in before uploading a report.' });
            return;
        }

        setErrors({});
        
        const data = new FormData();
        data.append('file', file);
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        
        try {
            const token = await currentUser.getIdToken();
            setStatus('uploading');
            setStatus('processing'); // The backend does the OCR/AI processing synchronously for now
            const response = await axios.post('/api/reports/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            });
            setResultData(response.data);
            setStatus('done');
        } catch (error) {
            console.error(error);
            setErrors({ form: error.response?.data?.error || 'Upload failed. Please try again.' });
            setStatus('idle');
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Ingest Disaster Report</h2>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                {status === 'idle' && (
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="application/pdf, image/*"
                            />
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="p-4 bg-brand-50 text-brand-600 rounded-full">
                                    <UploadCloud size={32} />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-medium">{file ? file.name : "Drag & drop PDF or Image"}</p>
                                    <p className="text-slate-500 text-sm mt-1">OCR will automatically extract contents</p>
                                </div>
                            </div>
                        </div>
                        {errors.file && <p className="-mt-4 text-sm font-medium text-red-600">{errors.file}</p>}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Report Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="E.g. Flood response in Mumbai"
                                className={`w-full rounded-lg border bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Disaster Type</label>
                                <select 
                                    className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.disasterType ? 'border-red-400' : 'border-slate-200'}`}
                                    value={formData.disasterType}
                                    onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                                >
                                    <option value="">Select disaster type</option>
                                    <option value="Flood">Flood</option>
                                    <option value="Earthquake">Earthquake</option>
                                    <option value="Cyclone">Cyclone</option>
                                    <option value="Heatwave">Heatwave</option>
                                    <option value="Landslide">Landslide</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.disasterType && <p className="mt-1 text-sm text-red-600">{errors.disasterType}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                <input
                                    type="text"
                                    placeholder="E.g. Maharashtra"
                                    className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.state ? 'border-red-400' : 'border-slate-200'}`}
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                />
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                                <input
                                    type="text"
                                    placeholder="E.g. Mumbai Suburban"
                                    className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.district ? 'border-red-400' : 'border-slate-200'}`}
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                                {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Report Date</label>
                                <input
                                    type="date"
                                    className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.date ? 'border-red-400' : 'border-slate-200'}`}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                            </div>
                        </div>

                        {errors.form && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                                <AlertCircle size={18} /> {errors.form}
                            </div>
                        )}

                        <button className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-brand-600 transition-colors">
                            Upload and Extract
                        </button>
                    </form>
                )}

                {status === 'uploading' && (
                    <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
                        <UploadCloud size={48} className="text-slate-400" />
                        <h3 className="text-xl font-medium text-slate-700">Uploading File...</h3>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
                        <FileText size={48} className="text-brand-500" />
                        <h3 className="text-xl font-medium text-slate-700">AI Extracting Text & Summarizing...</h3>
                        <p className="text-slate-500">Running OCR and passing to OpenAI</p>
                    </div>
                )}

                {status === 'done' && (
                    <div className="py-12 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Extraction Complete!</h3>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl text-left w-full mt-6 space-y-4">
                             <div>
                                 <span className="text-xs font-bold uppercase text-slate-400">Extracted Tags</span>
                                 <div className="flex gap-2 mt-2">
                                     {(resultData?.tags || []).map((tag, i) => (
                                         <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{tag}</span>
                                     ))}
                                 </div>
                             </div>
                             <div>
                                 <span className="text-xs font-bold uppercase text-slate-400">AI Summary</span>
                                 <p className="text-sm text-slate-700 mt-1">{resultData?.aiSummary || "No summary available"}</p>
                             </div>
                        </div>

                        <button onClick={() => setStatus('idle')} className="mt-8 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-slate-800 w-full">
                            Import Another Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadReport;
