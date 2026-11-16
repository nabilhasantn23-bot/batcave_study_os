import React, { useState, useEffect } from 'react';
import { 
  Shield, BookOpen, Clock, Users, Sparkles, Target, 
  Flame, LogOut, Send
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    name: 'Nabil Hasan',
    userId: 'Batman18',
    password: '',
    roomCode: 'BAT-HSC28',
    targetHours: '42'
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routine' | 'taya' | 'squad'>('dashboard');
  const [tayaInput, setTayaInput] = useState('');
  const [tayaMessages, setTayaMessages] = useState([
    { sender: 'taya', text: 'Hey Boss plus Batman! Ami Ela / Taya. Apnar HSC 28 Science prep ar squad sync ready! Ki niye discussion hobe ekhon?' }
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Physics: Vector Math Practice (ACS PCMB 28)', done: false },
    { id: 2, text: 'Higher Math: Conic Section Revision', done: true },
    { id: 3, text: 'Chemistry: Mole Concept & Stoichiometry', done: false },
    { id: 4, text: 'ICT: Boolean Algebra & Logic Gates', done: false }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('batcave_user');
    if (savedUser) {
      setFormData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.userId || !formData.roomCode) {
      alert('Shob field thik moto puron korun, Boss!');
      return;
    }
    localStorage.setItem('batcave_user', JSON.stringify(formData));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('batcave_user');
    setIsLoggedIn(false);
  };

  const handleTayaSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tayaInput.trim()) return;
    const newMsg = { sender: 'user', text: tayaInput };
    setTayaMessages(prev => [...prev, newMsg]);
    const query = tayaInput;
    setTayaInput('');

    setTimeout(() => {
      let reply = "Bhalo point tolechen, Boss! Eta aro bhalo vabe practice korte hobe.";
      if (query.toLowerCase().includes('physics') || query.toLowerCase().includes('math')) {
        reply = "Physics ba Math-e numerical problem beshi kore solve korte hobe. BUET ba DU target korle concept crystal clear rakhte hobe, Boss!";
      } else if (query.toLowerCase().includes('squad') || query.toLowerCase().includes('friend')) {
        reply = "Apnar squad room code '" + formData.roomCode + "' active ache. Friend-o ei same code diye dhukle dujonar progress sync thakbe!";
      }
      setTayaMessages(prev => [...prev, { sender: 'taya', text: reply }]);
    }, 600);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white">BatCave Study OS</h1>
            <p className="text-xs text-slate-400 mt-1">HSC Science Dual Study Tracker, Routine & Taya AI</p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
            <button 
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              1st-Time Sign Up
            </button>
            <button 
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              ID & Pass Login
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Display Name (e.g., Batman)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Unique User ID (e.g., Batman18)</label>
              <input 
                type="text" 
                value={formData.userId}
                onChange={e => setFormData({...formData, userId: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shared Squad Room Code (Must match friend!)</label>
              <input 
                type="text" 
                value={formData.roomCode}
                onChange={e => setFormData({...formData, roomCode: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Study Hours Target</label>
              <input 
                type="number" 
                value={formData.targetHours}
                onChange={e => setFormData({...formData, targetHours: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Create Account & Enter BatCave
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wide text-white">BATCAVE STUDY OS</h1>
            <p className="text-[11px] text-indigo-400 font-medium">Squad: {formData.roomCode} | Boss: {formData.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-slate-300">Streak: <strong className="text-white">7 Days</strong></span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        <nav className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/60'}`}
          >
            <Target className="w-4 h-4" /> Study Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('routine')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'routine' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/60'}`}
          >
            <Clock className="w-4 h-4" /> HSC 28 Routine
          </button>
          <button 
            onClick={() => setActiveTab('taya')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'taya' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/60'}`}
          >
            <Sparkles className="w-4 h-4" /> Taya AI Guide
          </button>
          <button 
            onClick={() => setActiveTab('squad')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'squad' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/60'}`}
          >
            <Users className="w-4 h-4" /> Squad Room ({formData.roomCode})
          </button>
        </nav>

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs text-slate-400 font-medium">Weekly Target</p>
                  <h3 className="text-2xl font-black text-white mt-1">{formData.targetHours} Hours</h3>
                  <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
                    <div className="bg-indigo-500 h-full w-[65%]"></div>
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs text-slate-400 font-medium">Core Focus</p>
                  <h3 className="text-lg font-black text-indigo-400 mt-1">Physics & Math</h3>
                  <p className="text-[11px] text-slate-400 mt-1">ACS PCMB 28 Batch Active</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <p className="text-xs text-slate-400 font-medium">Admission Goal</p>
                  <h3 className="text-lg font-black text-emerald-400 mt-1">BUET & DU A-Unit</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Strategic Self-Study</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Today's Science Action Plan
                </h3>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${task.done ? 'bg-indigo-950/20 border-indigo-900/50 text-slate-400 line-through' : 'bg-slate-950 border-slate-800 text-white hover:border-slate-700'}`}>
                      <span className="text-xs font-medium">{task.text}</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${task.done ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                        {task.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routine' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> HSC 28 Daily Routine (Science)
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400">Morning Session (6:00 AM - 9:00 AM)</h4>
                    <p className="text-xs text-slate-300 mt-1">Higher Math & Physics Problem Solving</p>
                  </div>
                  <span className="text-[11px] bg-slate-900 px-3 py-1 rounded-lg text-slate-400">3 Hours</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400">Evening Session (4:00 PM - 8:00 PM)</h4>
                    <p className="text-xs text-slate-300 mt-1">Chemistry Concepts & ACS PCMB Lecture</p>
                  </div>
                  <span className="text-[11px] bg-slate-900 px-3 py-1 rounded-lg text-slate-400">4 Hours</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400">Night Session (9:30 PM - 11:30 PM)</h4>
                    <p className="text-xs text-slate-300 mt-1">ICT / Revision & Taya AI Review</p>
                  </div>
                  <span className="text-[11px] bg-slate-900 px-3 py-1 rounded-lg text-slate-400">2 Hours</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'taya' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Taya AI Study Partner & Guide
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {tayaMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleTayaSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={tayaInput}
                  onChange={e => setTayaInput(e.target.value)}
                  placeholder="Ask Taya anything about studies, physics, math..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'squad' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Squad Room: {formData.roomCode}
              </h3>
              <p className="text-xs text-slate-400">Apnar friend-o jodi ei same Room Code (`{formData.roomCode}`) diye login kore, tahole se apnar active squad room-e connect hoye jabe!</p>
              
              <div className="space-y-3 mt-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {formData.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{formData.name} ({formData.userId})</h4>
                      <p className="text-[10px] text-emerald-400">Online & Active in BatCave</p>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg font-bold">Host / Boss</span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between opacity-75">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                      F
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Squad Friend (Waiting...)</h4>
                      <p className="text-[10px] text-slate-500">Share code `{formData.roomCode}` with your friend</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-900 text-slate-400 px-3 py-1 rounded-lg font-bold">Offline</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
