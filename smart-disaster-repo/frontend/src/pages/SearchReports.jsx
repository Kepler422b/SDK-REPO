import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, MapPin, Calendar, FileText, Building2, Users, Loader2, AlertCircle, SearchX } from 'lucide-react';

const SearchReports = () => {
    const [query, setQuery] = useState('');
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            setError('');

            try {
                const res = await axios.get('/api/reports', {
                    params: query ? { q: query } : undefined,
                });
                setReports(res.data);
            } catch (err) {
                console.error("Error fetching reports", err);
                setError('We could not load reports right now. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, [query]);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Smart Search Repository</h2>
            
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 text-brand-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="E.g. NGO coordination problems in floods in Maharashtra" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                    />
                </div>
                <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2 font-medium">
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {isLoading && (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-8 text-slate-500">
                        <Loader2 className="animate-spin text-brand-500" size={28} />
                        <p className="text-sm font-medium">Loading reports...</p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                        <AlertCircle className="text-red-500" size={28} />
                        <div>
                            <p className="font-semibold text-red-800">Unable to load reports</p>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && reports.length === 0 && (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-8 text-center">
                        <SearchX className="text-brand-500" size={30} />
                        <div>
                            <p className="font-semibold text-slate-800">No reports found</p>
                            <p className="mt-1 text-sm text-slate-500">
                                {query ? 'Try a different search term.' : 'Upload the first disaster report to get started.'}
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && reports.map(report => (
                    <Link key={report._id} to={`/report/${report._id}`} className="block">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-100 transition-all cursor-pointer group space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{report.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs font-medium">
                                    <div className="flex items-center gap-1"><MapPin size={14} className="text-brand-500"/> {report.location?.state}</div>
                                    <div className="flex items-center gap-1"><Calendar size={14} className="text-brand-500"/> {new Date(report.date).getFullYear()}</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{report.disasterType}</span>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-2 italic">"{report.aiSummary}"</p>

                        <div className="grid grid-cols-2 gap-4 pb-2">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                    <Building2 size={16} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-teal-700 block uppercase leading-none mb-0.5">NGO</span>
                                    <span className="text-xs font-semibold text-slate-700">{report.ngoDetails?.name || 'N/A'}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-indigo-700 block uppercase leading-none mb-0.5">Volunteers</span>
                                    <span className="text-xs font-semibold text-slate-700">{report.volunteerDetails?.count || 0} Members</span>
                                </div>
                             </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4">
                            <div className="flex items-center gap-1"><FileText size={14}/> Full Analysis</div>
                            <div className="flex gap-1 ml-auto">
                                {(report.tags || []).slice(0, 3).map(t => (
                                    <span key={t} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">#{t}</span>
                                ))}
                            </div>
                        </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SearchReports;
