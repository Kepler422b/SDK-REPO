import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, done
    const [formData, setFormData] = useState({ state: 'Maharashtra', disasterType: 'Flood'});
    const [resultData, setResultData] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if(!file) return;
        
        setStatus('uploading');
        
        const data = new FormData();
        data.append('file', file);
        data.append('state', formData.state);
        data.append('disasterType', formData.disasterType);
        data.append('title', file.name.split('.')[0]); // basic title fallback
        
        try {
            setStatus('processing'); // The backend does the OCR/AI processing synchronously for now
            const response = await axios.post('/api/reports/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResultData(response.data);
            setStatus('done');
        } catch (error) {
            console.error(error);
            setStatus('idle');
            alert('Upload failed!');
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Disaster Type (Optional)</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.disasterType}
                                    onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                                >
                                    <option>Auto-detect</option>
                                    <option value="Flood">Flood</option>
                                    <option value="Earthquake">Earthquake</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">State (Optional)</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                >
                                    <option>Auto-detect</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Assam">Assam</option>
                                </select>
                            </div>
                        </div>

                        <button disabled={!file} className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
