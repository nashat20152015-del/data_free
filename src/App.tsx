import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Plus, Trash2, Layout, Image as ImageIcon, Palette, 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Settings2, Download, Share2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface DataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
}

type ThemeMode = 'modern' | 'brutalist' | 'minimal';

const HEADER_IMAGES = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1000',
];

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export default function App() {
  const [data, setData] = useState<DataPoint[]>([
    { id: '1', label: 'المبيعات', value: 400, color: COLORS[0] },
    { id: '2', label: 'التسويق', value: 300, color: COLORS[1] },
    { id: '3', label: 'التطوير', value: 200, color: COLORS[2] },
    { id: '4', label: 'الدعم', value: 278, color: COLORS[3] },
  ]);

  const [theme, setTheme] = useState<ThemeMode>('modern');
  const [headerImg, setHeaderImg] = useState(HEADER_IMAGES[0]);
  const [title, setTitle] = useState('لوحة تحكم البيانات الذكية');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [mainChartType, setMainChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');

  // Handlers
  const addDataPoint = () => {
    const newPoint: DataPoint = {
      id: Math.random().toString(36).substr(2, 9),
      label: `بند جديد ${data.length + 1}`,
      value: Math.floor(Math.random() * 500),
      color: COLORS[data.length % COLORS.length],
    };
    setData([...data, newPoint]);
  };

  const removeDataPoint = (id: string) => {
    setData(data.filter(p => p.id !== id));
  };

  const updateDataPoint = (id: string, updates: Partial<DataPoint>) => {
    setData(data.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const totalValue = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 0), [data]);

  // Theme Styles
  const themeClasses = {
    modern: {
      card: "bg-white rounded-2xl shadow-sm border border-slate-100 p-6",
      button: "bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-4 py-2 transition-all",
      input: "border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none",
      accent: "text-indigo-600",
      bg: "bg-slate-50",
    },
    brutalist: {
      card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6",
      button: "bg-[#00FF00] text-black border-2 border-black font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 transition-all",
      input: "border-2 border-black px-3 py-2 focus:bg-yellow-100 outline-none font-mono",
      accent: "text-black font-black uppercase tracking-tighter",
      bg: "bg-[#F0F0F0]",
    },
    minimal: {
      card: "bg-white border-b border-slate-200 p-8",
      button: "text-slate-900 border border-slate-900 hover:bg-slate-900 hover:text-white rounded-none px-6 py-2 transition-all uppercase text-xs tracking-widest",
      input: "border-b border-slate-300 focus:border-slate-900 outline-none py-1 text-sm",
      accent: "text-slate-900 font-light",
      bg: "bg-white",
    }
  }[theme];

  return (
    <div dir="rtl" className={cn("min-h-screen font-sans transition-colors duration-500", themeClasses.bg)}>
      
      {/* Header Section */}
      <header className="relative h-[300px] overflow-hidden group">
        <img 
          src={headerImg} 
          alt="Header" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn("text-4xl md:text-6xl font-bold text-center mb-4", theme === 'brutalist' && "uppercase italic")}
          >
            {title}
          </motion.h1>
          <button 
            onClick={() => setIsEditingHeader(!isEditingHeader)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full p-2 transition-all"
          >
            <Settings2 size={20} />
          </button>
        </div>

        {/* Header Customizer Dropdown */}
        <AnimatePresence>
          {isEditingHeader && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 bg-white rounded-2xl shadow-2xl p-6 z-50 w-80 text-slate-800"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ImageIcon size={18} /> تخصيص المظهر
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-2">عنوان الصفحة</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-slate-500 block mb-2">صورة الغلاف</label>
                  <div className="grid grid-cols-4 gap-2">
                    {HEADER_IMAGES.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setHeaderImg(img)}
                        className={cn(
                          "h-12 rounded-md overflow-hidden border-2 transition-all",
                          headerImg === img ? "border-indigo-600 scale-110" : "border-transparent"
                        )}
                      >
                        <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-2">نمط العرض</label>
                  <div className="flex gap-2">
                    {(['modern', 'brutalist', 'minimal'] as ThemeMode[]).map((m) => (
                      <button 
                        key={m}
                        onClick={() => setTheme(m)}
                        className={cn(
                          "flex-1 py-2 text-xs rounded-lg border transition-all capitalize",
                          theme === m ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-200 text-slate-600"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-10">
        
        {/* Stats Grid - Infographic Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className={themeClasses.card}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm mb-1">إجمالي القيم</p>
                <h2 className="text-3xl font-bold">{totalValue.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-2/3" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={themeClasses.card}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm mb-1">أعلى قيمة</p>
                <h2 className="text-3xl font-bold">{maxValue.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Info size={24} />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-4 flex items-center gap-1">
              <span>+12% عن الشهر الماضي</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={themeClasses.card}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm mb-1">عدد المؤشرات</p>
                <h2 className="text-3xl font-bold">{data.length}</h2>
              </div>
              <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                <Palette size={24} />
              </div>
            </div>
            <div className="flex -space-x-2 space-x-reverse mt-4">
              {data.slice(0, 4).map((d, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: d.color }} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Data Entry Form */}
          <section className={cn("lg:col-span-1", themeClasses.card)}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus size={20} className={themeClasses.accent} /> إدخال البيانات
              </h3>
              <button onClick={addDataPoint} className={themeClasses.button}>
                إضافة بند
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {data.map((point) => (
                <motion.div 
                  layout
                  key={point.id} 
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3"
                >
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={point.label} 
                      onChange={(e) => updateDataPoint(point.id, { label: e.target.value })}
                      placeholder="اسم البند"
                      className={cn("flex-1", themeClasses.input)}
                    />
                    <button 
                      onClick={() => removeDataPoint(point.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={point.value} 
                      onChange={(e) => updateDataPoint(point.id, { value: Number(e.target.value) })}
                      className={cn("w-24", themeClasses.input)}
                    />
                    <input 
                      type="color" 
                      value={point.color} 
                      onChange={(e) => updateDataPoint(point.id, { color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none"
                    />
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500" 
                        style={{ width: `${(point.value / maxValue) * 100}%`, backgroundColor: point.color }} 
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Visualization Section */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* Main Chart */}
            <div className={themeClasses.card}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 size={20} className={themeClasses.accent} /> التوزيع البياني
                </h3>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <label className="text-xs text-slate-500 whitespace-nowrap">نوع المخطط:</label>
                  <select 
                    value={mainChartType}
                    onChange={(e) => setMainChartType(e.target.value as any)}
                    className={cn("text-sm flex-1 md:w-40", themeClasses.input)}
                  >
                    <option value="bar">أعمدة (Bar)</option>
                    <option value="line">خطي (Line)</option>
                    <option value="area">مساحي (Area)</option>
                    <option value="pie">دائري (Pie)</option>
                  </select>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Download size={18} /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Share2 size={18} /></button>
                  </div>
                </div>
              </div>
              
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {mainChartType === 'bar' ? (
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : mainChartType === 'line' ? (
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  ) : mainChartType === 'area' ? (
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="mainAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#mainAreaGradient)" />
                    </AreaChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ label }) => label}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={themeClasses.card}>
                <h4 className="font-bold mb-6 flex items-center gap-2">
                  <PieChartIcon size={18} className={themeClasses.accent} /> النسب المئوية
                </h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={themeClasses.card}>
                <h4 className="font-bold mb-6 flex items-center gap-2">
                  <LineChartIcon size={18} className={themeClasses.accent} /> اتجاهات البيانات
                </h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
