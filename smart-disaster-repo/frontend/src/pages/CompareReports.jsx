import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Columns, ArrowRight, CheckCircle2, XCircle, MapPin, Calendar, Building2, Users, ClipboardList } from 'lucide-react';

const CompareReports = () => {
    const [mockComparison, setMockComparison] = useState([]);

    useEffect(() => {
        // Fetch top 2 reports to compare for demo purposes
        const fetchCompare = async () => {
            try {
                const res = await axios.get('/api/reports');
                const top2 = res.data.slice(0, 2).map((r, i) => ({
                    id: r._id,
                    title: r.title || `Report ${i+1}`,
                    problems: r.tags || [],
                    worked: r.assessment?.outcomes?.whatWorked || 'Analysis complete.',
                    failed: r.assessment?.outcomes?.whatFailed || 'No significant failures reported.',
                    efficiency: r.assessment?.outcomes?.recoveryEfficiency || (i === 0 ? 'High' : 'Medium'),
                    basicInfo: {
                        type: r.disasterType,
                        location: `${r.location?.district}, ${r.location?.state}, India`,
                        date: r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'
                    },
                    ngo: r.ngoDetails,
                    volunteers: r.volunteerDetails
                }));
                setMockComparison(top2);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCompare();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Compare Incidents</h2>
            <p className="text-slate-500 mb-8">Side-by-side analysis of disaster response strategies</p>

            <div className="grid md:grid-cols-2 gap-6 relative">
                {/* Visual Connector */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm z-10 text-slate-400">
                    <Columns size={20} />
                </div>

                {mockComparison.map((report) => (
                    <Link key={report.id} to={`/report/${report.id}`} className="block h-full group">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full group-hover:border-brand-300 transition-colors">
                        <div className="p-6 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">{report.title}</h3>
                            <span className={`mt-2 inline-block px-3 py-1 text-xs font-bold rounded-full ${report.efficiency === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Efficiency: {report.efficiency}
                            </span>
                        </div>
                        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Location</span>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                        <MapPin size={12} className="text-brand-500" /> {report.basicInfo.location}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Date</span>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                        <Calendar size={12} className="text-brand-500" /> {report.basicInfo.date}
                                    </div>
                                </div>
                            </div>

                            {/* NGO Details */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5">
                                    <Building2 size={14} className="text-brand-500"/> NGO Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b border-slate-50 pb-1">
                                        <span className="text-slate-500">Name</span>
                                        <span className="font-semibold text-slate-700">{report.ngo?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-1">
                                        <span className="text-slate-500">Resources</span>
                                        <span className="font-semibold text-slate-700 text-right">{report.ngo?.resourcesProvided?.join(', ') || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Volunteer Details */}
                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5">
                                    <Users size={14} className="text-brand-500"/> Volunteers
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="bg-brand-50 px-3 py-2 rounded-lg">
                                        <span className="text-lg font-bold text-brand-700">{report.volunteers?.count || 0}</span>
                                        <span className="text-[10px] block text-brand-600 font-medium -mt-1 uppercase">Personnel</span>
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium">
                                        Roles: {report.volunteers?.roles?.join(', ') || 'N/A'}
                                        <br/>
                                        Availability: {report.volunteers?.availability || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Major Problems</h4>
                                <div className="flex flex-wrap gap-2">
                                    {report.problems.map((p, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase border border-red-100">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <hr className="border-slate-100" />

                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500"/> What Worked</h4>
                                <p className="text-xs leading-relaxed text-slate-700 bg-green-50/50 p-3 rounded-lg border border-green-100/50 italic">"{report.worked}"</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center gap-1.5"><XCircle size={14} className="text-red-500"/> What Failed</h4>
                                <p className="text-xs leading-relaxed text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100/50 italic">"{report.failed}"</p>
                            </div>
                        </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CompareReports;
