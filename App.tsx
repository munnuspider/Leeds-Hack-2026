
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Leaf, Award, Info, Globe, CheckCircle2, Trophy, ChevronRight } from 'lucide-react';
import { SoftEarth, ClayTree, GalaxyPlanet } from './components/ThreeModels';
import { Task, LeaderboardEntry } from './types';

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

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll monitoring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Earth scale animation (stops expanding halfway through)
  const earthScale = useTransform(scrollYProgress, [0, 0.4], [1.5, 4.5]);
  const earthOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);

  // Tree growth section monitoring
  const treeSectionRef = useRef(null);
  const isTreeInView = useInView(treeSectionRef, { amount: 0.5, once: false });

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div ref={containerRef} className="relative min-h-[400vh] text-slate-50 overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md bg-slate-950/20 border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Earthly</span>
        </div>
        <ul className="hidden md:flex items-center gap-8 font-medium text-slate-300">
          <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Globe size={18} /> Your Earth
          </li>
          <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Leaf size={18} /> Daily Tasks
          </li>
          <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Award size={18} /> Leaderboard
          </li>
          <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Info size={18} /> About
          </li>
        </ul>
        <button className="px-6 py-2.5 clay-button rounded-full font-semibold text-sm">
          Join Community
        </button>
      </nav>

      {/* Hero Section */}
      <section className="h-screen sticky top-0 flex flex-col items-center justify-start pt-32 px-4 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl z-10"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/20">
            Current Global Impact
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            Together, we’ve saved <br/>
            <span className="text-blue-400">10,000</span> bottles from landfill!
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Join thousands of Earthlings tracking their daily environmental impact through our soft-space digital ecosystem.
          </p>
        </motion.div>

        {/* 3D Earth Viewport */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Canvas dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              
              <motion.group 
                style={{ 
                  scale: earthScale,
                  opacity: earthOpacity 
                }}
              >
                <SoftEarth scale={1} />
              </motion.group>

              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Transition Space */}
      <div className="h-screen pointer-events-none" />

      {/* Daily Tasks Section */}
      <section ref={treeSectionRef} className="min-h-screen relative flex items-center justify-center py-20 px-8">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          
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

        <div className="h-[800px] w-full cursor-grab active:cursor-grabbing">
          <Canvas>
            <Suspense fallback={null}>
              <Stars count={2000} factor={2} />
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              
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

      {/* Leaderboard Section */}
      <section className="min-h-screen py-24 px-8 bg-slate-950/40">
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
      </section>

      {/* About / Footer */}
      <footer className="py-24 px-8 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
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
      <div className="fixed inset-0 z-[-1] opacity-40">
        <Canvas>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        </Canvas>
      </div>

    </div>
  );
};

export default App;
