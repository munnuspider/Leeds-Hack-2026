
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Leaf, Award, Info, Globe, CheckCircle2, Trophy, ChevronRight, Calculator, ArrowLeft, Zap, Box, ShoppingBag } from 'lucide-react';
import { SoftEarth, ClayTree, GalaxyPlanet } from './components/ThreeModels';
import { Task, LeaderboardEntry } from './types';
import * as THREE from 'three';

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Use a reusable water bottle', impact: '2.5kg CO2 saved', completed: true },
  { id: 2, title: 'Compost organic waste', impact: '1.2kg CO2 saved', completed: false },
  { id: 3, title: 'Switch to LED bulbs', impact: '5.0kg CO2 saved', completed: false },
  { id: 4, title: 'Walk to work/school', impact: '3.8kg CO2 saved', completed: false },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { id: 1, name: 'EcoWarrior_99', points: 12500, rank: 1 },
  { id: 2, name: 'GreenGuardian', points: 11200, rank: 2 },
  { id: 3, name: 'SolarPioneer', points: 10800, rank: 3 },
  { id: 4, name: 'OceanSaver', points: 9500, rank: 4 },
  { id: 5, name: 'ForestFriend', points: 8900, rank: 5 },
];

// --- Calculation Logic (Ported exactly from Python emissions_calculator) ---
const CARBON_FACTORS = {
  // RECYCLING (kg CO2 saved per unit)
  plastic_bottle_500ml: 0.033,
  plastic_bottle_1L: 0.066,
  aluminium_can_100ml: 0.17,
  glass_bottle_500ml: 0.15,
  glass_bottle_300ml: 0.12,
  carboard_box_100g: 0.7, // As named in carbon_factors.py

  // TRANSPORT (kg CO2 saved per km)
  walking_per_km: 0.192,
  bus_per_km_saved: 0.087,
};

interface ImpactResult {
  recycling_co2_saved: number;
  transport_co2_saved: number;
  total_co2_saved: number;
  unit: string;
}

const calculateImpact = (data: { 
  p_500: number; 
  p_1l: number; 
  alum: number; 
  g_500: number; 
  g_300: number; 
  card: number;
  walk: number; 
  bus: number;
}): ImpactResult => {
  // Logic matches CarbonCalculator class in calculator.py
  const recycling_co2 = 
    (data.p_500 * CARBON_FACTORS.plastic_bottle_500ml) +
    (data.p_1l * CARBON_FACTORS.plastic_bottle_1L) +
    (data.alum * CARBON_FACTORS.aluminium_can_100ml) +
    (data.g_500 * CARBON_FACTORS.glass_bottle_500ml) +
    (data.g_300 * CARBON_FACTORS.glass_bottle_300ml) +
    (data.card * CARBON_FACTORS.carboard_box_100g);

  const transport_co2 = 
    (data.walk * CARBON_FACTORS.walking_per_km) +
    (data.bus * CARBON_FACTORS.bus_per_km_saved);

  const total_co2 = recycling_co2 + transport_co2;

  return {
    recycling_co2_saved: Math.round(recycling_co2 * 1000) / 1000,
    transport_co2_saved: Math.round(transport_co2 * 1000) / 1000,
    total_co2_saved: Math.round(total_co2 * 1000) / 1000,
    unit: "kg CO2"
  };
};

// --- Components ---

// Helper component to animate Three.js elements using Framer Motion values
// This avoids the use of motion.group which is not part of the standard framer-motion DOM package.
const AnimatedEarth: React.FC<{ scale: any; opacity: any }> = ({ scale, opacity }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Apply the animated scale
      const s = scale.get();
      groupRef.current.scale.set(s, s, s);
      
      // Control visibility based on opacity threshold as a proxy for fading the whole group
      const o = opacity.get();
      groupRef.current.visible = o > 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <SoftEarth scale={1} />
    </group>
  );
};



const CalculatorPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({ 
    p_500: 0, p_1l: 0, alum: 0, g_500: 0, g_300: 0, card: 0, walk: 0, bus: 0 
  });
  const [result, setResult] = useState<ImpactResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateImpact(formData));
  };

  const formFields = [
    { id: 'p_500', label: '500ml Plastic Bottles', icon: <Globe className="text-blue-400" />, section: 'Recycling' },
    { id: 'p_1l', label: '1L Plastic Bottles', icon: <Globe className="text-blue-500" />, section: 'Recycling' },
    { id: 'alum', label: '100ml Aluminum Cans', icon: <Zap className="text-yellow-400" />, section: 'Recycling' },
    { id: 'g_500', label: '500ml Glass Bottles', icon: <ShoppingBag className="text-emerald-400" />, section: 'Recycling' },
    { id: 'g_300', label: '300ml Glass Bottles', icon: <ShoppingBag className="text-emerald-500" />, section: 'Recycling' },
    { id: 'card', label: '100g Cardboard Boxes', icon: <Box className="text-orange-400" />, section: 'Recycling' },
    { id: 'walk', label: 'Kilometres Walked', icon: <Leaf className="text-green-400" />, section: 'Transport' },
    { id: 'bus', label: 'Bus Kilometres (vs Car)', icon: <Calculator className="text-purple-400" />, section: 'Transport' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto"
    >
      <div className="fixed inset-0 z-[-1] opacity-30">
        <Canvas>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={20} /> Back to Earth
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">Precision Impact Calculator</h1>
          <p className="text-slate-400 text-lg">Detailed assessment based on our latest carbon factors.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formFields.map((field) => (
              <div key={field.id} className="clay-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {field.icon}
                  </div>
                  <div>
                    <label className="font-bold text-slate-200 block text-sm">{field.label}</label>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{field.section}</span>
                  </div>
                </div>
                <input 
                  type="number" 
                  step="any"
                  min="0"
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.id]: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-2 border-white/5 rounded-2xl p-4 text-xl font-black focus:border-blue-500 outline-none transition-all shadow-inner"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <button 
            type="submit" 
            className="w-full py-8 rounded-3xl bg-blue-500 hover:bg-blue-600 font-black text-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-4"
          >
            <Calculator size={32} />
            Generate Detailed Impact Report
          </button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              className="clay-card p-10 bg-emerald-500/5 border-emerald-500/20"
            >
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Trophy className="text-yellow-400" /> Your Earthly Report
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Recycling CO2 Saved</p>
                  <p className="text-3xl font-black text-blue-400">{result.recycling_co2_saved} {result.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Transport CO2 Saved</p>
                  <p className="text-3xl font-black text-emerald-400">{result.transport_co2_saved} {result.unit}</p>
                </div>
                <div className="space-y-1 md:border-l border-white/10 md:pl-8">
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Total Daily Impact</p>
                  <p className="text-4xl font-black text-white">{result.total_co2_saved} {result.unit}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  
  // line below: only in studio
  const [view, setView] = useState<'landing' | 'calculator'>('landing');
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // few lines below: only in studio
  const heroRef = useRef<HTMLElement>(null);
  const tasksRef = useRef<HTMLElement>(null);
  const leaderboardRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  

  // Scroll monitoring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Earth scale animation (starts expanding as you scroll)
  // Start at 1.5 and grow to 10.0
  const earthScale = useTransform(scrollYProgress, [0, 0.4], [1.5, 10.0]);
  const earthOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);
  
  // Text fade out as scroll progresses
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // Tree growth section monitoring
  const treeSectionRef = useRef(null);
  const isTreeInView = useInView(treeSectionRef, { amount: 0.5, once: false });

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // below few lines scrollToSection: only in studio

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // below few lines: only in studio
    <div ref={containerRef} className="relative min-h-[400vh] text-slate-50 overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        {view === 'calculator' && (
          <CalculatorPage key="calculator" onBack={() => setView('landing')} />
      
        )}
      {/* Navigation */}
      </AnimatePresence>"
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md bg-slate-950/20 border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => scrollToSection(heroRef)}> 
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Earthly</span>
        </div>
        <ul className="hidden md:flex items-center gap-8 font-medium text-slate-300">
          <li onClick={() => scrollToSection(heroRef)} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Globe size={18} /> Your Earth
          </li>
          <li onClick={() => scrollToSection(tasksRef)} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Leaf size={18} /> Daily Tasks
          </li>
          <li onClick={() => scrollToSection(leaderboardRef)} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Award size={18} /> Leaderboard
          </li>
          <li onClick={() => scrollToSection(aboutRef)} className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Info size={18} /> About
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setView('calculator')} className="px-6 py-2.5 clay-button rounded-full font-semibold text-sm">
            My Impact
          </button>
        <a href='signin.html' className="px-6 py-2.5 clay-button rounded-full font-semibold text-sm  bg-emerald-600 hover:bg-emerald-500">
          Join Community
        </a>
        </div>

      </nav>

      {/* Hero Section - Fixed background logic for the scroll effect */}
      <section ref={heroRef} className="h-screen sticky top-0 flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        
        {/* Text content - Now positioned above the Earth container */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl z-10 mb-8 pointer-events-none"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/20">
            Current Global Impact
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Together, we’ve saved <br/>
            <span className="text-blue-400">10,000</span> bottles from landfill!
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Join thousands of Earthlings tracking their daily environmental impact through our soft-space digital ecosystem.
          </p>
        </motion.div>

        {/* 3D Earth Viewport - Positioned relative and below text */}
        <div className="relative w-full flex-grow max-h-[60vh] z-0 cursor-grab active:cursor-grabbing">
          <Canvas dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              
              {/* Fix: Replaced motion.group with a custom AnimatedEarth component that correctly handles motion values via useFrame */}
              <AnimatedEarth scale={earthScale} opacity={earthOpacity} />

              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Transition Space - Provides the scroll length to animate Earth growth */}
      <div className="h-screen pointer-events-none" />

      {/* Daily Tasks Section */}
      <section ref={tasksRef} className="min-h-screen relative flex items-center justify-center py-20 px-8 bg-slate-900/50">
        <div ref={treeSectionRef} className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Growing Tree Column */}
          <div className="h-[500px] w-full relative">
            <Canvas>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} />
                <ClayTree growing={isTreeInView} />
                <Environment preset="park" />
              </Suspense>
            </Canvas>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <span className="text-slate-500 font-mono text-sm tracking-widest uppercase">Digital Reforestation</span>
            </div>
          </div>
      

          {/* Tasks Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-black mb-4 flex items-center gap-3">
                <Leaf className="text-emerald-400" size={40} />
                Daily Tasks
              </h2>
              <p className="text-slate-400 text-lg">
                Small consistent actions lead to massive planetary shifts. 
                Complete your daily quest to grow your digital tree.
              </p>
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`clay-card p-6 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] ${task.completed ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.completed ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                      <CheckCircle2 size={24} className={task.completed ? 'text-emerald-400' : 'text-slate-500'} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
                      <p className="text-sm text-blue-400 font-medium">{task.impact}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-600" />
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
              Sync Smart Watch <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Galaxy of Planets Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center py-32 px-8 overflow-hidden">
        <div className="z-10 text-center mb-16">
          <h2 className="text-5xl font-black mb-4">Intergalactic Community</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Explore other eco-systems created by our top contributors. Each planet represents a distinct community goal.
          </p>
        </div>

{/* in studio file its 600 instead of 800*/}
        <div className="h-[800px] w-full cursor-grab active:cursor-grabbing">
          <Canvas>
            <Suspense fallback={null}>
              <Stars count={2000} factor={2} />
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              {/* in studio file its different numbers instead of 0,0,0*/}
              <group position={[-3, 1, 0]}>
                <GalaxyPlanet color="#f472b6" size={1.2} position={[0, 0, 0]} distort={0.4} />
              </group>
              
              <group position={[3, -1, -2]}>
                <GalaxyPlanet color="#fbbf24" size={0.8} position={[0, 0, 0]} distort={0.2} />
              </group>
              
              <group position={[0, 2, -4]}>
                <GalaxyPlanet color="#a78bfa" size={1.5} position={[0, 0, 0]} distort={0.5} />
              </group>

              <group position={[-4, -2, -3]}>
                <GalaxyPlanet color="#2dd4bf" size={1} position={[0, 0, 0]} distort={0.3} />
              </group>

              <OrbitControls enableZoom={false} rotateSpeed={0.3} autoRotate autoRotateSpeed={0.5} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Leaderboard Section. in line 350 onwards in textCompare not yet implemented */}
      <section ref={leaderboardRef} className="min-h-screen py-24 px-8 bg-slate-950/40">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-black mb-4 flex items-center gap-4">
                <Trophy className="text-yellow-400" size={48} />
                Global Leaderboard
              </h2>
              <p className="text-slate-400 text-lg">The top 0.1% of Earth's guardians. Are you on the list?</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-xl bg-slate-800 font-bold border border-white/5 hover:bg-slate-700 transition-colors">Daily</button>
              <button className="px-6 py-2 rounded-xl bg-blue-500 font-bold shadow-lg shadow-blue-500/20">All Time</button>
            </div>
          </div>

          <div className="space-y-4">
            {LEADERBOARD.map((user, idx) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="clay-card p-6 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black w-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-orange-400' : 'text-slate-500'}`}>
                    #{user.rank}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${user.id}/100`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{user.name}</h4>
                    <p className="text-sm text-slate-500">Member since 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{user.points.toLocaleString()}</p>
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">Eco-Points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>



          <div className="flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={() => setView('calculator')}
              className="px-12 py-6 rounded-3x1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-2x1 shadow-2x1 shadow-emerald-500/20 flex items-center gap-4 transition-colors group">

      
              <Calculator size={32} className="group-hover:rotate-12 transition-transform" />
              What's your impact?
            </motion.button>
          </div>
      </section>






      {/* About / Footer */}
      <footer ref={aboutRef} className="py-24 px-8 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto grid md:grid-cols-4 gap-12 text-center">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Globe className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight">Earthly</span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed">
              We believe environmental awareness shouldn't be boring. By combining soft 3D design with interactive social mechanics, we're building a future where saving the planet is as intuitive as scrolling through space.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'Instagram', 'Github'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current opacity-20 rounded-sm" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-bold text-lg uppercase tracking-widest text-slate-400">Platform</h5>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li className="hover:text-blue-400 cursor-pointer">Live Stats</li>
              <li className="hover:text-blue-400 cursor-pointer">Mobile App</li>
              <li className="hover:text-blue-400 cursor-pointer">API Access</li>
              <li className="hover:text-blue-400 cursor-pointer">Enterprise</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-lg uppercase tracking-widest text-slate-400">Support</h5>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li className="hover:text-blue-400 cursor-pointer">Knowledge Base</li>
              <li className="hover:text-blue-400 cursor-pointer">Community Forum</li>
              <li className="hover:text-blue-400 cursor-pointer">Report Bug</li>
              <li className="hover:text-blue-400 cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-sm font-medium">
          &copy; 2025 Earthly Digital Ecosystem. All rights reserved. Built with love for the Planet.
        </div>
      </footer>

      {/* Global Galaxy Background for all sections */}
      <div className="fixed inset-0 z-[-1] opacity-40 pointer-events-none">
        <Canvas>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        </Canvas>
      </div>

    </div>
  );
};

export default App;
