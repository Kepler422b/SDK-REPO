import React from 'react';
import { ArrowRight, Search, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-full flex flex-col gap-20 pb-20 animate-in fade-in duration-700 perspective-2000">
      
      {/* 3D Hero Stage */}
      <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 pt-10 md:pt-20">
        
        {/* Left Side: Content */}
        <div className="relative z-20 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest animate-bounce">
            <Zap size={14} /> AI-Powered Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 leading-[0.9] drop-shadow-sm">
            DISASTER <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">INTELLIGENCE</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-medium">
            Transforming raw emergency reports into structured, 3D-mapped insights for rapid humanitarian response.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/search" className="group bg-slate-900 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95">
              Explore Repository <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: 3D Illustration & Stage */}
        <div className="relative flex-1 w-full max-w-2xl h-[500px] flex items-center justify-center preserve-3d">
            {/* 3D Stage Background */}
            <div className="absolute w-[120%] h-[120%] bg-brand-50/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            
            {/* The Main 3D Asset - Digital Tech Mesh Illustration */}
            <div className="relative z-10 animate-float preserve-3d">
                <div className="absolute inset-0 bg-brand-400/20 rounded-full blur-3xl scale-125 animate-pulse"></div>
                <img 
                    src="https://img.freepik.com/free-vector/network-mesh-wire-digital-technology-background_1017-15437.jpg" 
                    alt="Disaster Intelligence 3D" 
                    className="w-full h-auto rounded-3xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] select-none rotate-3 opacity-90 mix-blend-screen"
                />
            </div>

            {/* Floating Glass UI Overlay */}
            <div className="absolute top-10 right-0 glass p-6 rounded-2xl shadow-2xl animate-float-delayed z-20 preserve-3d hidden lg:block border-l-4 border-brand-500 transform rotate-y-12 -rotate-x-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/40">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Active Insight</div>
                        <div className="text-sm font-bold text-slate-800">Maharashtra Floods</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 w-3/4 animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>ANALYZING</span>
                        <span>78%</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive 3D Features Section */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
            <h2 className="text-sm font-black text-brand-500 uppercase tracking-[0.3em]">Core Modules</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Immersive Data Management</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 h-full">
          {[
            { 
                title: 'Smart Search', 
                desc: 'Find critical patterns using natural language filters and location intelligence.', 
                icon: Search, 
                color: 'blue', 
                link: '/search',
                rotate: 'hover:-rotate-y-12 hover:rotate-x-6'
            },
            { 
                title: 'AI Summarization', 
                desc: 'Automated OCR deep-learning extracts key lessons from unstructured field reports.', 
                icon: Zap, 
                color: 'teal', 
                link: '/upload',
                rotate: 'hover:translate-z-10'
            },
            { 
                title: 'Visual Compare', 
                desc: 'Side-by-side incident analysis to understand strategy efficiency globally.', 
                icon: ShieldCheck, 
                color: 'indigo', 
                link: '/compare',
                rotate: 'hover:rotate-y-12 hover:rotate-x-6'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={idx} 
                to={feature.link}
                className={`group relative h-64 preserve-3d transition-all duration-500 cursor-pointer ${feature.rotate}`}
              >
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col justify-end gap-3 backface-hidden group-hover:shadow-2xl transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 flex items-center justify-center mb-auto shadow-inner`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  
                  {/* Subtle 3D Depth Decoration */}
                  <div className="absolute top-4 right-4 text-slate-100 group-hover:text-slate-200 transition-colors">
                     <Icon size={80} strokeWidth={0.5} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  );
};

// Re-defining internal icons for cleaner component code
import { MapPin } from 'lucide-react';

export default Home;
