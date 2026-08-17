import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ChevronLeft, Star, MapPin, Calendar, Building2, Users, 
    AlertTriangle, Lightbulb, TrendingUp, CheckCircle2,
    FileText, Globe, Home, Zap, AlertCircle
} from 'lucide-react';

const ReportDetails = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportRes, recRes] = await Promise.all([
                    axios.get(`/api/reports/${id}`),
                    axios.get(`/api/reports/recommendations/${id}`)
                ]);
                setReport(reportRes.data);
                setRecommendations(recRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching report details", err);
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="p-10 text-slate-500 animate-pulse">Loading Deep Analysis...</div>;
    if (!report) return <div className="p-10 text-red-500">Report not found.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link to="/search" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-semibold group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Search
                </Link>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider">{report.disasterType}</span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">High Efficiency</span>
                </div>
            </div>

            {/* Hero Section */}
            <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {report.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2"><MapPin size={18} className="text-brand-500"/> {report.location.district}, {report.location.state}</div>
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-brand-500"/> {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="flex items-center gap-2"><Building2 size={18} className="text-brand-500"/> {report.ngoDetails?.name}</div>
                    <div className="flex items-center gap-2"><Users size={18} className="text-brand-500"/> {report.volunteerDetails?.count} Volunteers</div>
                    
                    <div className="ml-auto flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[10px] uppercase font-black text-slate-400">Intelligence Rating</div>
                            <div className="flex gap-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Main Analysis Column - 7 Section Framework */}
                <div className="lg:col-span-2 space-y-8">
                    {[
                        { 
                            id: 'executiveSummary', 
                            title: 'Executive Summary', 
                            icon: FileText, 
                            color: 'brand', 
                            content: report.detailedAnalysis?.executiveSummary || report.aiSummary 
                        },
                        { 
                            id: 'contextualOverview', 
                            title: 'Contextual Overview', 
                            icon: Globe, 
                            color: 'blue', 
                            content: report.detailedAnalysis?.contextualOverview 
                        },
                        { 
                            id: 'impactAssessment', 
                            title: 'Impact Assessment', 
                            icon: Users, 
                            color: 'rose', 
                            content: report.detailedAnalysis?.impactAssessment 
                        },
                        { 
                            id: 'infrastructureDamage', 
                            title: 'Infrastructure Damage', 
                            icon: Home, 
                            color: 'amber', 
                            content: report.detailedAnalysis?.infrastructureDamage 
                        },
                        { 
                            id: 'responseEfforts', 
                            title: 'Response Efforts', 
                            icon: Zap, 
                            color: 'teal', 
                            content: report.detailedAnalysis?.responseEfforts 
                        },
                        { 
                            id: 'causesRiskFactors', 
                            title: 'Causes and Risk Factors', 
                            icon: AlertCircle, 
                            color: 'orange', 
                            content: report.detailedAnalysis?.causesRiskFactors 
                        },
                        { 
                            id: 'futureRecommendations', 
                            title: 'Future Recommendations', 
                            icon: CheckCircle2, 
                            color: 'green', 
                            content: report.detailedAnalysis?.futureRecommendations 
                        }
                    ].map((section, idx) => {
                        const Icon = section.icon;
                        if (!section.content) return null;
                        return (
                            <section key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="p-6 md:p-8 flex gap-6">
                                    <div className={`w-12 h-12 rounded-2xl bg-${section.color}-50 text-${section.color}-600 flex items-center justify-center shrink-0`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{section.title}</h2>
                                        <p className="text-slate-700 leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Suggested Actions */}
                    <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Lightbulb size={20} className="text-yellow-500" /> Suggested Actions
                        </h2>
                        <ul className="space-y-4">
                            {[
                                'Establish immediate unified command structure.',
                                'Utilize drone-based resource mapping for remote areas.',
                                'Deploy satellite-linked mobile communication units.',
                                'Implement real-time supply chain tracking for food kits.'
                            ].map((action, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2 shrink-0"></span>
                                    {action}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* What Worked Elsewhere */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-green-500" /> What Worked Elsewhere
                        </h2>
                        <div className="space-y-4">
                            {recommendations.length > 0 ? recommendations.map(rec => (
                                <Link 
                                    key={rec._id} 
                                    to={`/report/${rec._id}`}
                                    className="block p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors group"
                                >
                                    <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors uppercase tracking-tight line-clamp-1">{rec.title}</h3>
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                                        <span>{rec.location.district}</span>
                                        <span className="text-green-600 group-hover:translate-x-1 transition-transform">View →</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-xs text-slate-400 font-medium italic p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    No direct comparisons found in this sector.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
