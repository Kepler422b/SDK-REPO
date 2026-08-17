import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, BarChart2, PieChart, ShieldCheck, Globe, Zap, Layers } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/analytics/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching analytics:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="h-[80vh] flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Initializing Mission Intelligence...</span>
             </div>
        </div>
    );

    return (
        <div className="perspective-2000 h-full relative overflow-hidden">
            {/* 3D Background Mesh */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale brightness-150">
                <img 
                    src="/dashboard_3d_data_mesh_1776180358069.png" 
                    alt="Background Mesh" 
                    className="w-full h-full object-cover scale-110 animate-pulse"
                />
            </div>

            <div className="relative z-10 space-y-8 pb-12 preserve-3d">
                <header className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xs font-black text-brand-500 uppercase tracking-[0.3em] mb-2">Live Operations</h2>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Analytical Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-white/50 shadow-sm">
                        <div className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded-full flex items-center gap-1.5 ring-1 ring-green-600/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> SYSTEM STABLE
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.4.9-REL</div>
                    </div>
                </header>
                
                {/* 3D Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 preserve-3d">
                    {[
                        { label: 'Total Reports', value: data.totalReports, icon: Layers, color: 'brand', delay: '0ms' },
                        { label: 'Active Nodes', value: '42', icon: Globe, color: 'blue', delay: '100ms' },
                        { label: 'Response Efficiency', value: '89%', icon: Zap, color: 'amber', delay: '200ms' },
                        { label: 'Security Status', value: 'Secure', icon: ShieldCheck, color: 'teal', delay: '300ms' },
                    ].map((stat, i) => (
                        <div key={i} 
                            className="glass hologram-glow p-6 rounded-3xl animate-float hover:scale-105 transition-all duration-500 cursor-pointer group preserve-3d"
                            style={{ animationDelay: stat.delay }}
                        >
                            <div className="scanline"></div>
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                            <span className={`text-3xl font-black text-${stat.color}-600 tracking-tight`}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 preserve-3d">
                    {/* Main Chart Card */}
                    <div className="lg:col-span-2 glass hologram-glow p-8 rounded-[2.5rem] min-h-[450px] relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <BarChart2 size={18} className="text-brand-500" /> Geospatial Distribution
                                </h3>
                                <p className="text-2xl font-black text-slate-800 mt-1">Incident reports by State</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-500 transition-colors"><Activity size={20} /></button>
                                <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-500 transition-colors"><TrendingUp size={20} /></button>
                            </div>
                        </div>

                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.stateWise} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="_id" 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        fontWeight={700}
                                        tickLine={false} 
                                        axisLine={false} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        fontWeight={700}
                                        tickLine={false} 
                                        axisLine={false} 
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(20, 184, 166, 0.05)'}} 
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: '1.5rem',
                                            border: '1px solid rgba(255, 255, 255, 0.4)',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            padding: '12px 16px'
                                        }} 
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="url(#barGradient)" 
                                        radius={[12, 12, 0, 0]} 
                                        barSize={32}
                                        animationBegin={500}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Trend Card */}
                    <div className="glass hologram-glow p-8 rounded-[2.5rem] flex flex-col justify-between group">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-500" /> Volumetric Trends
                            </h3>
                            <div className="space-y-2">
                                <span className="text-4xl font-black text-slate-800 block">+14.2%</span>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Report Ingestion Rate</span>
                            </div>
                        </div>

                        <div className="h-40 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.stateWise.slice(0, 5)}>
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fill="url(#areaGradient)" 
                                        animationBegin={800}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 tracking-widest">
                            <span>AUG - DEC 2026</span>
                            <span className="text-indigo-500 cursor-pointer hover:underline uppercase tracking-[0.1em]">Detailed Logs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

