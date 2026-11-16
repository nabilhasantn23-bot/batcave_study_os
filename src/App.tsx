import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query
} from 'firebase/firestore';
import {
  BookOpen,
  Clock,
  Target,
  Users,
  Plus,
  ExternalLink,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Flame,
  ShieldAlert,
  Sparkles,
  Trash2,
  Copy,
  LayoutDashboard,
  Timer,
  LogOut,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingUp,
  Search,
  UserPlus,
  LogIn,
  Calendar,
  Settings2,
  Compass,
  Swords,
  BrainCircuit,
  MessageSquare,
  Send,
  Bot,
  UserCheck,
  UserX,
  Mail,
  Check
} from 'lucide-react';

// ==========================================
// FIREBASE INITIALIZATION (MANDATORY PATTERN)
// ==========================================
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'batcave-study-os';

// ==========================================
// COMPLETE NCTB HSC SCIENCE SYLLABUS DATABASE
// ==========================================
const SUBJECTS = [
  { id: 'Physics 1st', name: 'Physics 1st Paper', short: 'Phy 1st', color: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30', bar: 'bg-sky-500' },
  { id: 'Physics 2nd', name: 'Physics 2nd Paper', short: 'Phy 2nd', color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', bar: 'bg-cyan-500' },
  { id: 'Chemistry 1st', name: 'Chemistry 1st Paper', short: 'Chem 1st', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', bar: 'bg-emerald-500' },
  { id: 'Chemistry 2nd', name: 'Chemistry 2nd Paper', short: 'Chem 2nd', color: 'text-teal-400', bg: 'bg-teal-500/15', border: 'border-teal-500/30', bar: 'bg-teal-500' },
  { id: 'Higher Math 1st', name: 'Higher Math 1st Paper', short: 'Math 1st', color: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', bar: 'bg-indigo-500' },
  { id: 'Higher Math 2nd', name: 'Higher Math 2nd Paper', short: 'Math 2nd', color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/30', bar: 'bg-violet-500' },
  { id: 'Biology 1st', name: 'Biology 1st (Botany)', short: 'Bio 1st', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30', bar: 'bg-rose-500' },
  { id: 'Biology 2nd', name: 'Biology 2nd (Zoology)', short: 'Bio 2nd', color: 'text-pink-400', bg: 'bg-pink-500/15', border: 'border-pink-500/30', bar: 'bg-pink-500' },
  { id: 'ICT', name: 'ICT', short: 'ICT', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', bar: 'bg-amber-500' }
];

const MASTER_NCTB_SYLLABUS = [
  // Physics 1st Paper (10 Chapters)
  { id: 'phy1-1', subject: 'Physics 1st', chapterNo: 1, en: 'Physical World & Measurement', bn: 'ভৌত জগৎ ও পরিমাপ', defaultClasses: 4 },
  { id: 'phy1-2', subject: 'Physics 1st', chapterNo: 2, en: 'Vectors', bn: 'ভেক্টর', defaultClasses: 12 },
  { id: 'phy1-3', subject: 'Physics 1st', chapterNo: 3, en: 'Dynamics', bn: 'গতিবিদ্যা', defaultClasses: 10 },
  { id: 'phy1-4', subject: 'Physics 1st', chapterNo: 4, en: 'Newtonian Mechanics', bn: 'নিউটনিয়ান বলবিদ্যা', defaultClasses: 14 },
  { id: 'phy1-5', subject: 'Physics 1st', chapterNo: 5, en: 'Work, Energy & Power', bn: 'কাজ, শক্তি ও ক্ষমতা', defaultClasses: 9 },
  { id: 'phy1-6', subject: 'Physics 1st', chapterNo: 6, en: 'Gravitation & Gravity', bn: 'মহাকর্ষ ও অভিকর্ষ', defaultClasses: 8 },
  { id: 'phy1-7', subject: 'Physics 1st', chapterNo: 7, en: 'Structural Properties of Matter', bn: 'পদার্থের গাঠনিক ধর্ম', defaultClasses: 9 },
  { id: 'phy1-8', subject: 'Physics 1st', chapterNo: 8, en: 'Periodic Motion', bn: 'পর্যাবৃত্ত গতি', defaultClasses: 8 },
  { id: 'phy1-9', subject: 'Physics 1st', chapterNo: 9, en: 'Waves', bn: 'তরঙ্গ', defaultClasses: 8 },
  { id: 'phy1-10', subject: 'Physics 1st', chapterNo: 10, en: 'Ideal Gas & Kinetic Theory', bn: 'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব', defaultClasses: 8 },

  // Physics 2nd Paper (11 Chapters)
  { id: 'phy2-1', subject: 'Physics 2nd', chapterNo: 1, en: 'Thermodynamics', bn: 'তাপগতিবিদ্যা', defaultClasses: 10 },
  { id: 'phy2-2', subject: 'Physics 2nd', chapterNo: 2, en: 'Electrostatics', bn: 'স্থির তড়িৎ', defaultClasses: 12 },
  { id: 'phy2-3', subject: 'Physics 2nd', chapterNo: 3, en: 'Current Electricity', bn: 'চল তড়িৎ', defaultClasses: 12 },
  { id: 'phy2-4', subject: 'Physics 2nd', chapterNo: 4, en: 'Magnetic Effects of Current', bn: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', defaultClasses: 8 },
  { id: 'phy2-5', subject: 'Physics 2nd', chapterNo: 5, en: 'Electromagnetic Induction & AC', bn: 'তাড়িতচৌম্বক আবেশ ও পরিবর্তী প্রবাহ', defaultClasses: 7 },
  { id: 'phy2-6', subject: 'Physics 2nd', chapterNo: 6, en: 'Geometrical Optics', bn: 'জ্যামিতিক আলোকবিজ্ঞান', defaultClasses: 8 },
  { id: 'phy2-7', subject: 'Physics 2nd', chapterNo: 7, en: 'Physical Optics', bn: 'ভৌত আলোকবিজ্ঞান', defaultClasses: 8 },
  { id: 'phy2-8', subject: 'Physics 2nd', chapterNo: 8, en: 'Modern Physics', bn: 'আধুনিক পদার্থবিজ্ঞানের সূচনা', defaultClasses: 9 },
  { id: 'phy2-9', subject: 'Physics 2nd', chapterNo: 9, en: 'Atomic Model & Nuclear Physics', bn: 'পরমাণুর মডেল এবং নিউক্লিয়ার পদার্থবিজ্ঞান', defaultClasses: 7 },
  { id: 'phy2-10', subject: 'Physics 2nd', chapterNo: 10, en: 'Semiconductors & Electronics', bn: 'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স', defaultClasses: 8 },
  { id: 'phy2-11', subject: 'Physics 2nd', chapterNo: 11, en: 'Astronomy', bn: 'জ্যোতির্বিজ্ঞান', defaultClasses: 4 },

  // Chemistry 1st Paper (5 Chapters)
  { id: 'chem1-1', subject: 'Chemistry 1st', chapterNo: 1, en: 'Safe Use of Laboratory', bn: 'ল্যাবরেটরির নিরাপদ ব্যবহার', defaultClasses: 5 },
  { id: 'chem1-2', subject: 'Chemistry 1st', chapterNo: 2, en: 'Qualitative Chemistry', bn: 'গুণগত রসায়ন', defaultClasses: 16 },
  { id: 'chem1-3', subject: 'Chemistry 1st', chapterNo: 3, en: 'Periodic Properties & Chemical Bonding', bn: 'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', defaultClasses: 16 },
  { id: 'chem1-4', subject: 'Chemistry 1st', chapterNo: 4, en: 'Chemical Changes', bn: 'রাসায়নিক পরিবর্তন', defaultClasses: 14 },
  { id: 'chem1-5', subject: 'Chemistry 1st', chapterNo: 5, en: 'Vocational Chemistry', bn: 'কর্মমুখী রসায়ন', defaultClasses: 6 },

  // Chemistry 2nd Paper (5 Chapters)
  { id: 'chem2-1', subject: 'Chemistry 2nd', chapterNo: 1, en: 'Environmental Chemistry', bn: 'পরিবেশ রসায়ন', defaultClasses: 12 },
  { id: 'chem2-2', subject: 'Chemistry 2nd', chapterNo: 2, en: 'Organic Chemistry', bn: 'জৈব রসায়ন', defaultClasses: 28 },
  { id: 'chem2-3', subject: 'Chemistry 2nd', chapterNo: 3, en: 'Quantitative Chemistry', bn: 'পরিমাণগত রসায়ন', defaultClasses: 14 },
  { id: 'chem2-4', subject: 'Chemistry 2nd', chapterNo: 4, en: 'Electrochemistry', bn: 'তড়িৎ রসায়ন', defaultClasses: 10 },
  { id: 'chem2-5', subject: 'Chemistry 2nd', chapterNo: 5, en: 'Economic Chemistry', bn: 'অর্থনৈতিক রসায়ন', defaultClasses: 6 },

  // Higher Math 1st Paper (10 Chapters)
  { id: 'math1-1', subject: 'Higher Math 1st', chapterNo: 1, en: 'Matrices & Determinants', bn: 'ম্যাট্রিক্স ও নির্ণায়ক', defaultClasses: 10 },
  { id: 'math1-2', subject: 'Higher Math 1st', chapterNo: 2, en: 'Vectors', bn: 'ভেক্টর', defaultClasses: 6 },
  { id: 'math1-3', subject: 'Higher Math 1st', chapterNo: 3, en: 'Straight Lines', bn: 'সরলরেখা', defaultClasses: 14 },
  { id: 'math1-4', subject: 'Higher Math 1st', chapterNo: 4, en: 'Circles', bn: 'বৃত্ত', defaultClasses: 8 },
  { id: 'math1-5', subject: 'Higher Math 1st', chapterNo: 5, en: 'Permutations & Combinations', bn: 'বিন্যাস ও সমাবেশ', defaultClasses: 8 },
  { id: 'math1-6', subject: 'Higher Math 1st', chapterNo: 6, en: 'Trigonometric Ratios', bn: 'ত্রিকোণমিতিক অনুপাত', defaultClasses: 5 },
  { id: 'math1-7', subject: 'Higher Math 1st', chapterNo: 7, en: 'Trigonometric Ratios of Associated Angles', bn: 'সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত', defaultClasses: 12 },
  { id: 'math1-8', subject: 'Higher Math 1st', chapterNo: 8, en: 'Functions & Graphs', bn: 'ফাংশন ও ফাংশনের লেখচিত্র', defaultClasses: 6 },
  { id: 'math1-9', subject: 'Higher Math 1st', chapterNo: 9, en: 'Differentiation', bn: 'অন্তরীকরণ', defaultClasses: 16 },
  { id: 'math1-10', subject: 'Higher Math 1st', chapterNo: 10, en: 'Integration', bn: 'যোগজীকরণ', defaultClasses: 16 },

  // Higher Math 2nd Paper (10 Chapters)
  { id: 'math2-1', subject: 'Higher Math 2nd', chapterNo: 1, en: 'Real Numbers & Inequalities', bn: 'বাস্তব সংখ্যা ও অসমতা', defaultClasses: 5 },
  { id: 'math2-2', subject: 'Higher Math 2nd', chapterNo: 2, en: 'Linear Programming', bn: 'যোগাশ্রয়ী প্রোগ্রাম', defaultClasses: 4 },
  { id: 'math2-3', subject: 'Higher Math 2nd', chapterNo: 3, en: 'Complex Numbers', bn: 'জটিল সংখ্যা', defaultClasses: 8 },
  { id: 'math2-4', subject: 'Higher Math 2nd', chapterNo: 4, en: 'Polynomials', bn: 'বহুপদী ও বহুপদী সমীকরণ', defaultClasses: 9 },
  { id: 'math2-5', subject: 'Higher Math 2nd', chapterNo: 5, en: 'Binomial Expansion', bn: 'দ্বিপদী বিস্তৃতি', defaultClasses: 6 },
  { id: 'math2-6', subject: 'Higher Math 2nd', chapterNo: 6, en: 'Conics', bn: 'কনিকস', defaultClasses: 12 },
  { id: 'math2-7', subject: 'Higher Math 2nd', chapterNo: 7, en: 'Inverse Trig Functions', bn: 'বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ', defaultClasses: 8 },
  { id: 'math2-8', subject: 'Higher Math 2nd', chapterNo: 8, en: 'Statics', bn: 'স্থিতিবিদ্যা', defaultClasses: 9 },
  { id: 'math2-9', subject: 'Higher Math 2nd', chapterNo: 9, en: 'Motion in a Plane', bn: 'সমতলে বস্তুকণার গতি', defaultClasses: 9 },
  { id: 'math2-10', subject: 'Higher Math 2nd', chapterNo: 10, en: 'Measures of Dispersion & Probability', bn: 'বিস্তার পরিমাপ ও সম্ভাবনা', defaultClasses: 6 },

  // Biology 1st Paper - Botany (12 Chapters)
  { id: 'bio1-1', subject: 'Biology 1st', chapterNo: 1, en: 'Cell & Its Structure', bn: 'কোষ ও এর গঠন', defaultClasses: 8 },
  { id: 'bio1-2', subject: 'Biology 1st', chapterNo: 2, en: 'Cell Division', bn: 'কোষ বিভাজন', defaultClasses: 6 },
  { id: 'bio1-3', subject: 'Biology 1st', chapterNo: 3, en: 'Cell Chemistry', bn: 'কোষ রসায়ন', defaultClasses: 7 },
  { id: 'bio1-4', subject: 'Biology 1st', chapterNo: 4, en: 'Microorganisms', bn: 'অণুজীব', defaultClasses: 7 },
  { id: 'bio1-5', subject: 'Biology 1st', chapterNo: 5, en: 'Algae & Fungi', bn: 'শৈবাল ও ছত্রাক', defaultClasses: 5 },
  { id: 'bio1-6', subject: 'Biology 1st', chapterNo: 6, en: 'Bryophyta & Pteridophyta', bn: 'ব্রায়োফাইটা ও টেরিডোফাইটা', defaultClasses: 4 },
  { id: 'bio1-7', subject: 'Biology 1st', chapterNo: 7, en: 'Gymnosperms & Angiosperms', bn: 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', defaultClasses: 6 },
  { id: 'bio1-8', subject: 'Biology 1st', chapterNo: 8, en: 'Tissue & Tissue System', bn: 'টিস্যু ও টিস্যুতন্ত্র', defaultClasses: 6 },
  { id: 'bio1-9', subject: 'Biology 1st', chapterNo: 9, en: 'Plant Physiology', bn: 'উদ্ভিদ শারীরতত্ত্ব', defaultClasses: 9 },
  { id: 'bio1-10', subject: 'Biology 1st', chapterNo: 10, en: 'Plant Reproduction', bn: 'উদ্ভিদ প্রজনন', defaultClasses: 4 },
  { id: 'bio1-11', subject: 'Biology 1st', chapterNo: 11, en: 'Biotechnology', bn: 'জীবপ্রযুক্তি', defaultClasses: 6 },
  { id: 'bio1-12', subject: 'Biology 1st', chapterNo: 12, en: 'Environment, Distribution & Conservation', bn: 'জীবের পরিবেশ, বিস্তার ও সংরক্ষণ', defaultClasses: 4 },

  // Biology 2nd Paper - Zoology (12 Chapters)
  { id: 'bio2-1', subject: 'Biology 2nd', chapterNo: 1, en: 'Animal Diversity & Classification', bn: 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', defaultClasses: 6 },
  { id: 'bio2-2', subject: 'Biology 2nd', chapterNo: 2, en: 'Introduction to Animals (Hydra, Grasshopper, Rohu)', bn: 'প্রাণীর পরিচিতি (হাইড্রা, ঘাসফড়িং, রুই মাছ)', defaultClasses: 12 },
  { id: 'bio2-3', subject: 'Biology 2nd', chapterNo: 3, en: 'Digestion & Absorption', bn: 'পরিপাক ও শোষণ', defaultClasses: 7 },
  { id: 'bio2-4', subject: 'Biology 2nd', chapterNo: 4, en: 'Blood & Circulation', bn: 'রক্ত ও সঞ্চালন', defaultClasses: 8 },
  { id: 'bio2-5', subject: 'Biology 2nd', chapterNo: 5, en: 'Respiration & Breathing', bn: 'শ্বাসক্রিয়া ও শ্বসন', defaultClasses: 5 },
  { id: 'bio2-6', subject: 'Biology 2nd', chapterNo: 6, en: 'Waste & Excretion', bn: 'বর্জ্য ও নিষ্কাশন', defaultClasses: 5 },
  { id: 'bio2-7', subject: 'Biology 2nd', chapterNo: 7, en: 'Locomotion & Movement', bn: 'চলন ও অঙ্গচালনা', defaultClasses: 6 },
  { id: 'bio2-8', subject: 'Biology 2nd', chapterNo: 8, en: 'Coordination & Control', bn: 'সমন্বয় ও নিয়ন্ত্রণ', defaultClasses: 8 },
  { id: 'bio2-9', subject: 'Biology 2nd', chapterNo: 9, en: 'Continuity of Human Life', bn: 'মানব জীবনের ধারাবাহিকতা', defaultClasses: 6 },
  { id: 'bio2-10', subject: 'Biology 2nd', chapterNo: 10, en: 'Defense of Human Body', bn: 'মানবদেহের প্রতিরক্ষা', defaultClasses: 5 },
  { id: 'bio2-11', subject: 'Biology 2nd', chapterNo: 11, en: 'Genetics & Evolution', bn: 'জিনতত্ত্ব ও বিবর্তন', defaultClasses: 8 },
  { id: 'bio2-12', subject: 'Biology 2nd', chapterNo: 12, en: 'Animal Behavior', bn: 'প্রাণীর আচরণ', defaultClasses: 4 },

  // ICT (6 Chapters)
  { id: 'ict-1', subject: 'ICT', chapterNo: 1, en: 'ICT: World & Bangladesh Perspective', bn: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', defaultClasses: 5 },
  { id: 'ict-2', subject: 'ICT', chapterNo: 2, en: 'Communication Systems & Networking', bn: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', defaultClasses: 8 },
  { id: 'ict-3', subject: 'ICT', chapterNo: 3, en: 'Number Systems & Digital Devices', bn: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', defaultClasses: 12 },
  { id: 'ict-4', subject: 'ICT', chapterNo: 4, en: 'Web Design & HTML', bn: 'ওয়েব ডিজাইন পরিচিতি এবং HTML', defaultClasses: 7 },
  { id: 'ict-5', subject: 'ICT', chapterNo: 5, en: 'Programming Language (C)', bn: 'প্রোগ্রামিং ভাষা (C Programming)', defaultClasses: 12 },
  { id: 'ict-6', subject: 'ICT', chapterNo: 6, en: 'Database Management System', bn: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম', defaultClasses: 6 }
];

const buildInitialCoursesFromSyllabus = (withDemoProgress = false) => {
  return MASTER_NCTB_SYLLABUS.map((item) => {
    const count = item.defaultClasses;
    let watchedPre = 0;
    let notesPre = 0;
    let practicePre = 0;
    let demoUrl = '';

    if (withDemoProgress) {
      if (item.id === 'phy1-2') {
        watchedPre = 7;
        notesPre = 6;
        practicePre = 4;
        demoUrl = 'https://www.youtube.com/results?search_query=hsc+physics+vector+playlist';
      } else if (item.id === 'math1-1') {
        watchedPre = 6;
        notesPre = 5;
        practicePre = 3;
        demoUrl = 'https://www.youtube.com/results?search_query=hsc+higher+math+matrix+playlist';
      } else if (item.id === 'chem1-2') {
        watchedPre = 4;
        notesPre = 3;
        practicePre = 2;
        demoUrl = 'https://www.youtube.com/results?search_query=hsc+qualitative+chemistry+playlist';
      }
    }

    return {
      id: item.id,
      subject: item.subject,
      chapterNo: item.chapterNo,
      chapterName: `${item.en} (${item.bn})`,
      enName: item.en,
      bnName: item.bn,
      playlistUrl: demoUrl,
      totalClasses: count,
      classes: Array.from({ length: count }, (_, i) => ({
        number: i + 1,
        watched: i < watchedPre,
        notes: i < notesPre,
        practice: i < practicePre
      }))
    };
  });
};

const getLast7Days = () => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    days.push({
      iso,
      label: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday: i === 0
    });
  }
  return days;
};

const INITIAL_DEMO_PROFILE = {
  uid: 'demo-user-1',
  userId: 'batman',
  displayName: 'Batman (You)',
  squadCode: 'BAT-HSC26',
  weeklyHourTarget: 42,
  streakDays: 6,
  activeDates: getLast7Days().slice(1).map((d) => d.iso),
  courses: buildInitialCoursesFromSyllabus(true),
  weeklyGoals: [
    { id: 'g-1', subject: 'Physics 1st', title: 'Complete Vector (ভেক্টর) Class 1–8 + Concept Book', completed: true },
    { id: 'g-2', subject: 'Higher Math 1st', title: 'Finish Matrix (ম্যাট্রিক্স) Ex 1.1 & 1.2 Board Questions', completed: true },
    { id: 'g-3', subject: 'Chemistry 1st', title: 'Qualitative Chemistry (গুণগত রসায়ন) Solubility Math', completed: false },
    { id: 'g-4', subject: 'Biology 1st', title: 'Cell Division (কোষ বিভাজন) Mitosis & Meiosis Diagrams', completed: false }
  ],
  dailyGoals: [
    { id: 'dg-1', subject: 'Physics 1st', title: 'Watch 2 Vector Lectures & solve 5 math problems', completed: true },
    { id: 'dg-2', subject: 'Chemistry 1st', title: 'Revise Quantum Numbers & electron configuration', completed: false }
  ],
  studyLogs: [
    { id: 'l-1', subject: 'Physics 1st', minutes: 210, date: getLast7Days()[6].iso, note: 'Vector dot & cross product classes' },
    { id: 'l-2', subject: 'Higher Math 1st', minutes: 180, date: getLast7Days()[5].iso, note: 'Matrix inverse & Cramer rule' },
    { id: 'l-3', subject: 'Chemistry 1st', minutes: 240, date: getLast7Days()[4].iso, note: 'Quantum numbers & orbital lecture' }
  ],
  incomingInvites: [
    { id: 'inv-99', fromUserId: 'robin', fromName: 'Robin (Study Partner)', squadCode: 'BAT-HSC26' }
  ],
  sentInvites: []
};

const DEMO_PARTNER_DATA = {
  uid: 'demo-partner-2',
  userId: 'robin',
  displayName: 'Robin (Study Partner)',
  squadCode: 'BAT-HSC26',
  weeklyHourTarget: 40,
  streakDays: 5,
  activeDates: getLast7Days().slice(2).map((d) => d.iso),
  courses: buildInitialCoursesFromSyllabus(true),
  weeklyGoals: [
    { id: 'pg-1', subject: 'Physics 1st', title: 'Vector Class 1-6', completed: true },
    { id: 'pg-2', subject: 'Chemistry 2nd', title: 'Organic Intro Lecture 1-4', completed: true }
  ],
  dailyGoals: [],
  studyLogs: [
    { id: 'pl-1', subject: 'Physics 1st', minutes: 180, date: getLast7Days()[6].iso, note: 'Vector practice' }
  ],
  incomingInvites: [],
  sentInvites: []
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const getSubjectStyle = (subjectName) => {
  return SUBJECTS.find((s) => s.id === subjectName) || SUBJECTS[0];
};

const computeUpdatedStreak = (profile) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().split('T')[0];

  const existingDates = Array.from(new Set(profile.activeDates || []));
  if (existingDates.includes(todayIso)) {
    return {
      streakDays: Math.max(profile.streakDays || 1, 1),
      activeDates: existingDates
    };
  }

  const updatedDates = [...existingDates, todayIso];
  const hadYesterday = existingDates.includes(yesterdayIso);
  const newStreak = hadYesterday ? (profile.streakDays || 0) + 1 : 1;

  return {
    streakDays: newStreak,
    activeDates: updatedDates
  };
};

const calculateMetrics = (profile) => {
  if (!profile) {
    return {
      totalHours: 0,
      targetHours: 42,
      hourRatio: 0,
      totalGoals: 0,
      completedGoals: 0,
      goalRatio: 0,
      totalClasses: 0,
      watchedClasses: 0,
      notesDone: 0,
      practiceDone: 0,
      compositeScore: 0,
      verdict: {
        label: 'Awaiting Data',
        tone: 'neutral',
        message: 'Log your study hours and weekly goals to get your reality check!'
      }
    };
  }

  const targetHours = Number(profile.weeklyHourTarget) || 42;
  const totalMinutes = (profile.studyLogs || []).reduce((acc, log) => acc + (Number(log.minutes) || 0), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const hourRatio = Math.min(totalHours / targetHours, 1.2);

  const goals = profile.weeklyGoals || [];
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed).length;
  const goalRatio = totalGoals > 0 ? completedGoals / totalGoals : 0;

  let totalClasses = 0;
  let watchedClasses = 0;
  let notesDone = 0;
  let practiceDone = 0;

  (profile.courses || []).forEach((course) => {
    totalClasses += Number(course.totalClasses) || 0;
    (course.classes || []).forEach((c) => {
      if (c.watched) watchedClasses += 1;
      if (c.notes) notesDone += 1;
      if (c.practice) practiceDone += 1;
    });
  });

  const effectiveGoalScore = totalGoals > 0 ? goalRatio : Math.min(hourRatio, 1);
  const effectiveHourScore = Math.min(hourRatio, 1);
  const compositeScore = Math.round((effectiveGoalScore * 0.7 + effectiveHourScore * 0.3) * 100);

  let verdict = {
    label: 'Behind Schedule',
    tone: 'danger',
    message: `You logged ${totalHours}h/${targetHours}h and finished ${completedGoals}/${totalGoals} weekly goals. Time to lock in and catch up!`
  };

  if (totalHours === 0 && totalGoals === 0 && watchedClasses === 0) {
    verdict = {
      label: 'Ready to Launch',
      tone: 'neutral',
      message: 'Set your weekly chapter goals and log your first study block to unlock your weekly verdict.'
    };
  } else if (compositeScore >= 85) {
    verdict = {
      label: 'Admission-Ready Pace',
      tone: 'success',
      message: `Solid! ${totalHours}h logged and ${completedGoals}/${totalGoals} weekly goals crushed. Keep this exact momentum!`
    };
  } else if (compositeScore >= 60) {
    verdict = {
      label: 'On Track — Push Harder',
      tone: 'warning',
      message: `Good progress (${totalHours}h logged), but push a bit more on your remaining weekly goals to hit 85%+ readiness.`
    };
  } else if (hourRatio >= 0.8 && goalRatio < 0.5 && totalGoals > 0) {
    verdict = {
      label: 'High Hours, Low Chapter Output',
      tone: 'warning',
      message: `You studied ${totalHours}h, but less than half your weekly goals are checked off. Focus on finishing chapters faster!`
    };
  }

  return {
    totalHours,
    targetHours,
    hourRatio,
    totalGoals,
    completedGoals,
    goalRatio,
    totalClasses,
    watchedClasses,
    notesDone,
    practiceDone,
    compositeScore,
    verdict
  };
};

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // Auth & Mode States
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 1st-Time Sign Up vs Login States
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [squadCodeInput, setSquadCodeInput] = useState('BAT-HSC26');
  const [targetHoursInput, setTargetHoursInput] = useState(42);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // User & Squad Profiles
  const [userProfile, setUserProfile] = useState(null);
  const [squadMembers, setSquadMembers] = useState([]);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState([]);

  // Friend Invite Input State
  const [friendIdInput, setFriendIdInput] = useState('');

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Courses & NCTB Syllabus States
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourseModal, setEditingCourseModal] = useState(null);
  const [newCourse, setNewCourse] = useState({
    subject: 'Physics 1st',
    chapterName: '',
    playlistUrl: '',
    totalClasses: 10
  });
  const [expandedCourses, setExpandedCourses] = useState({});

  // Smart Study Planner & Gamified Quest Routine States
  const [plannerForm, setPlannerForm] = useState({
    targetDays: 7,
    dailyHours: 6,
    totalClassesToFinish: 10,
    subjectsPerDay: 2,
    weakSubject: 'Physics 1st',
    weakChapter: 'Vectors (ভেক্টর)'
  });
  const [selectedQuestDay, setSelectedQuestDay] = useState(1);

  // Weekly Goals States
  const [newGoalSubject, setNewGoalSubject] = useState('Physics 1st');
  const [newGoalTitle, setNewGoalTitle] = useState('');

  // Daily Goals States
  const [newDailySubject, setNewDailySubject] = useState('Physics 1st');
  const [newDailyTitle, setNewDailyTitle] = useState('');

  // Study Timer & Manual Log States
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [pomodoroTargetSeconds, setPomodoroTargetSeconds] = useState(50 * 60);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSubject, setTimerSubject] = useState('Physics 1st');
  const timerIntervalRef = useRef(null);

  const [logSubject, setLogSubject] = useState('Physics 1st');
  const [logHours, setLogHours] = useState(1);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNote, setLogNote] = useState('');

  // Taya Chatbot States
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: "Salam! I am Taya, your 24/7 HSC Science study assistant. Ask me anything about Physics, Chemistry, Math, Biology, or study planning!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // FIREBASE AUTH & FIRESTORE SYNC EFFECTS
  // ==========================================
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn('Background auth warning:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Squad Members and Registered Users in Firestore
  useEffect(() => {
    if (isDemoMode || !db || !isSetupComplete || !userProfile?.squadCode) return;

    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'study_profiles'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members = [];
        const allUsers = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          allUsers.push(data);
          if (data.squadCode && data.squadCode.toUpperCase() === userProfile.squadCode.toUpperCase()) {
            members.push(data);
          }
        });
        setSquadMembers(members);
        setAllRegisteredUsers(allUsers);

        // Also check if our own user profile got updated invites in the database
        const me = allUsers.find((u) => u.userId === userProfile.userId);
        if (me && JSON.stringify(me.incomingInvites) !== JSON.stringify(userProfile.incomingInvites)) {
          setUserProfile((prev) => ({ ...prev, incomingInvites: me.incomingInvites || [] }));
        }
      },
      (err) => {
        console.error('Squad listener error:', err);
      }
    );

    return () => unsubscribe();
  }, [isDemoMode, isSetupComplete, userProfile?.squadCode, userProfile?.userId]);

  // Save Helper (Syncs to Firestore or Local Demo State)
  const saveProfileData = async (updatedProfile) => {
    setUserProfile(updatedProfile);
    if (isDemoMode) {
      setSquadMembers((prev) =>
        prev.map((m) => (m.uid === updatedProfile.uid ? updatedProfile : m))
      );
      return;
    }

    if (db && updatedProfile.uid) {
      try {
        const ref = doc(db, 'artifacts', appId, 'public', 'data', 'study_profiles', updatedProfile.uid);
        await setDoc(ref, { ...updatedProfile, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.error('Failed to sync profile:', err);
      }
    }
  };

  // Focus Timer Interval Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (timerMode === 'pomodoro' && next >= pomodoroTargetSeconds) {
            setIsTimerRunning(false);
            handleAutoLogTimer(pomodoroTargetSeconds);
            return 0;
          }
          return next;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerMode, pomodoroTargetSeconds]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Start Demo Mode
  const handleEnterDemoMode = () => {
    setIsDemoMode(true);
    setUserProfile(INITIAL_DEMO_PROFILE);
    setSquadMembers([INITIAL_DEMO_PROFILE, DEMO_PARTNER_DATA]);
    setIsSetupComplete(true);
    showToast('Entered Demo Mode with complete NCTB HSC Science syllabus!');
  };

  // 1st-Time Sign Up OR Subsequent ID/Password Login
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const cleanId = userIdInput.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

    if (!cleanId || !passwordInput) {
      setAuthError('Please enter both a valid User ID and Password.');
      return;
    }

    if (passwordInput.length < 4) {
      setAuthError('Password must be at least 4 characters.');
      return;
    }

    if (!db) {
      setAuthError('Cloud database unavailable. Use Quick Demo Login below.');
      return;
    }

    setAuthSubmitting(true);

    try {
      if (auth && !auth.currentUser) {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      }

      const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'study_profiles', cleanId);
      const existingSnap = await getDoc(profileRef);

      if (authMode === 'signup') {
        if (!displayNameInput.trim()) {
          setAuthError('Please enter your Display Name.');
          setAuthSubmitting(false);
          return;
        }

        if (existingSnap.exists()) {
          setAuthError(`User ID "${cleanId}" is already registered! Switch to "ID & Pass Login" tab.`);
          setAuthSubmitting(false);
          return;
        }

        const cleanCode = (squadCodeInput.trim() || 'BAT-HSC26').toUpperCase();
        const todayIso = new Date().toISOString().split('T')[0];

        const freshProfile = {
          uid: cleanId,
          userId: cleanId,
          password: passwordInput,
          displayName: displayNameInput.trim(),
          squadCode: cleanCode,
          weeklyHourTarget: Number(targetHoursInput) || 42,
          streakDays: 1,
          activeDates: [todayIso],
          courses: buildInitialCoursesFromSyllabus(false),
          weeklyGoals: [],
          dailyGoals: [],
          studyLogs: [],
          incomingInvites: [],
          sentInvites: [],
          updatedAt: new Date().toISOString()
        };

        await setDoc(profileRef, freshProfile);

        setUserProfile(freshProfile);
        setIsSetupComplete(true);
        showToast(`Account created! Welcome ${freshProfile.displayName} (ID: ${cleanId})`);
      } else {
        if (!existingSnap.exists()) {
          setAuthError(`No account found with User ID "${cleanId}". Please Sign Up first!`);
          setAuthSubmitting(false);
          return;
        }

        const loaded = existingSnap.data();
        if (loaded.password !== passwordInput) {
          setAuthError('Incorrect Password! Please try again.');
          setAuthSubmitting(false);
          return;
        }

        if (!loaded.courses || loaded.courses.length === 0) {
          loaded.courses = buildInitialCoursesFromSyllabus(false);
        }
        if (!loaded.incomingInvites) loaded.incomingInvites = [];
        if (!loaded.sentInvites) loaded.sentInvites = [];

        setUserProfile(loaded);
        setIsSetupComplete(true);
        showToast(`Welcome back, ${loaded.displayName}!`);
      }
    } catch (err) {
      console.error('Profile auth error:', err);
      setAuthError('Could not connect to cloud database. Please try again or use Demo Mode.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    setIsTimerRunning(false);
    setIsSetupComplete(false);
    setIsDemoMode(false);
    setUserProfile(null);
    setSquadMembers([]);
    setPasswordInput('');
  };

  // ==========================================
  // FRIEND INVITE HANDLERS
  // ==========================================
  const handleSendFriendInvite = async (e) => {
    e.preventDefault();
    const targetId = friendIdInput.trim().toLowerCase();
    if (!targetId || !userProfile) return;

    if (targetId === userProfile.userId) {
      showToast('You cannot invite yourself!');
      return;
    }

    if (isDemoMode) {
      showToast(`Invite sent to @${targetId}!`);
      setFriendIdInput('');
      return;
    }

    try {
      const targetRef = doc(db, 'artifacts', appId, 'public', 'data', 'study_profiles', targetId);
      const targetSnap = await getDoc(targetRef);

      if (!targetSnap.exists()) {
        showToast(`User ID "@${targetId}" not found in database!`);
        return;
      }

      const targetData = targetSnap.data();
      const existingInvites = targetData.incomingInvites || [];

      if (existingInvites.some((inv) => inv.fromUserId === userProfile.userId)) {
        showToast(`You already sent an invite to @${targetId}!`);
        return;
      }

      const newInvite = {
        id: `inv-${Date.now()}`,
        fromUserId: userProfile.userId,
        fromName: userProfile.displayName,
        squadCode: userProfile.squadCode
      };

      const updatedTargetInvites = [...existingInvites, newInvite];
      await setDoc(targetRef, { incomingInvites: updatedTargetInvites }, { merge: true });

      showToast(`Squad invite sent to @${targetId}!`);
      setFriendIdInput('');
    } catch (err) {
      console.error('Send invite error:', err);
      showToast('Failed to send invite. Check User ID.');
    }
  };

  const handleAcceptInvite = async (invite) => {
    if (!userProfile) return;

    const updatedSquadCode = invite.squadCode.toUpperCase();
    const remainingInvites = (userProfile.incomingInvites || []).filter((inv) => inv.id !== invite.id);

    const updated = {
      ...userProfile,
      squadCode: updatedSquadCode,
      incomingInvites: remainingInvites
    };

    await saveProfileData(updated);
    showToast(`Joined Squad Room "${updatedSquadCode}" with ${invite.fromName}!`);
  };

  const handleRejectInvite = async (inviteId) => {
    if (!userProfile) return;
    const remainingInvites = (userProfile.incomingInvites || []).filter((inv) => inv.id !== inviteId);
    await saveProfileData({ ...userProfile, incomingInvites: remainingInvites });
    showToast('Invite declined.');
  };

  // ==========================================
  // FEATURE HANDLERS
  // ==========================================

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.chapterName.trim() || !userProfile) return;

    const count = Math.min(Math.max(Number(newCourse.totalClasses) || 1, 1), 60);
    const createdCourse = {
      id: `course-${Date.now()}`,
      subject: newCourse.subject,
      chapterNo: 99,
      chapterName: newCourse.chapterName.trim(),
      enName: newCourse.chapterName.trim(),
      bnName: 'Custom Chapter',
      playlistUrl: newCourse.playlistUrl.trim(),
      totalClasses: count,
      classes: Array.from({ length: count }, (_, idx) => ({
        number: idx + 1,
        watched: false,
        notes: false,
        practice: false
      }))
    };

    const updated = {
      ...userProfile,
      courses: [createdCourse, ...(userProfile.courses || [])]
    };

    setExpandedCourses((prev) => ({ ...prev, [createdCourse.id]: true }));
    setNewCourse({ subject: 'Physics 1st', chapterName: '', playlistUrl: '', totalClasses: 10 });
    setShowAddCourseModal(false);
    await saveProfileData(updated);
    showToast(`Added "${createdCourse.chapterName}" (${count} classes)`);
  };

  const handleSaveChapterConfig = async (e) => {
    e.preventDefault();
    if (!editingCourseModal || !userProfile) return;

    const newCount = Math.min(Math.max(Number(editingCourseModal.totalClasses) || 1, 1), 60);
    const cleanUrl = (editingCourseModal.playlistUrl || '').trim();

    const updatedCourses = (userProfile.courses || []).map((course) => {
      if (course.id !== editingCourseModal.id) return course;

      const existingClasses = course.classes || [];
      const resizedClasses = Array.from({ length: newCount }, (_, idx) => {
        if (existingClasses[idx]) return existingClasses[idx];
        return {
          number: idx + 1,
          watched: false,
          notes: false,
          practice: false
        };
      });

      return {
        ...course,
        playlistUrl: cleanUrl,
        totalClasses: newCount,
        classes: resizedClasses
      };
    });

    setExpandedCourses((prev) => ({ ...prev, [editingCourseModal.id]: true }));
    setEditingCourseModal(null);
    await saveProfileData({ ...userProfile, courses: updatedCourses });
    showToast(`Updated playlist & ${newCount} classes!`);
  };

  const handleToggleClassField = async (courseId, classNumber, field) => {
    if (!userProfile) return;

    const updatedCourses = (userProfile.courses || []).map((course) => {
      if (course.id !== courseId) return course;
      return {
        ...course,
        classes: course.classes.map((cls) => {
          if (cls.number !== classNumber) return cls;
          return {
            ...cls,
            [field]: !cls[field]
          };
        })
      };
    });

    const streakData = computeUpdatedStreak(userProfile);
    const updated = {
      ...userProfile,
      courses: updatedCourses,
      ...streakData
    };

    await saveProfileData(updated);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!userProfile) return;
    const updatedCourses = (userProfile.courses || []).filter((c) => c.id !== courseId);
    await saveProfileData({ ...userProfile, courses: updatedCourses });
    showToast('Chapter removed');
  };

  const handleUpdateTargetHours = async (newVal) => {
    if (!userProfile) return;
    const val = Number(newVal) || 42;
    await saveProfileData({ ...userProfile, weeklyHourTarget: val });
  };

  // Smart Quest Routine Generator with 1.5h realistic math
  const handleGenerateRoutinePlan = (e) => {
    e.preventDefault();
    if (!userProfile) return;

    const targetDays = Number(plannerForm.targetDays) || 7;
    const dailyHours = Number(plannerForm.dailyHours) || 6;
    const totalCls = Number(plannerForm.totalClassesToFinish) || 10;
    const subPerDay = Number(plannerForm.subjectsPerDay) || 2;

    const hoursPerClass = 1.5;
    const days = [];
    let classesAssigned = 0;

    for (let d = 1; d <= targetDays; d++) {
      const dayTasks = [];
      let dayHoursUsed = 0;

      for (let s = 0; s < subPerDay; s++) {
        if (classesAssigned < totalCls && dayHoursUsed + hoursPerClass <= dailyHours) {
          classesAssigned++;
          dayHoursUsed += hoursPerClass;
          dayTasks.push({
            id: `task-d${d}-cls-${classesAssigned}`,
            subject: plannerForm.weakSubject,
            slot: `Lecture Session ${classesAssigned}`,
            title: `Study ${plannerForm.weakChapter} (Class ${classesAssigned}) + Notes`,
            duration: '1.5 hrs',
            xp: 150,
            completed: false
          });
        }
      }

      if (dayHoursUsed < dailyHours) {
        const remTime = (dailyHours - dayHoursUsed).toFixed(1);
        dayTasks.push({
          id: `task-d${d}-rev`,
          subject: plannerForm.weakSubject,
          slot: 'Self Practice & Board MCQ',
          title: `Practice Problem Solving & Formula Revision (${remTime}h)`,
          duration: `${remTime} hrs`,
          xp: 100,
          completed: false
        });
      }

      days.push({
        dayNumber: d,
        dateStr: `Cycle Day ${d}`,
        targetHours: dailyHours,
        isBossDay: d % 3 === 0,
        tasks: dayTasks
      });
    }

    const routinePlan = {
      createdAt: new Date().toISOString(),
      days
    };

    saveProfileData({ ...userProfile, routinePlan });
    setSelectedQuestDay(1);
    showToast('Smart Quest Routine generated successfully!');
  };

  const handleToggleRoutineTask = (dayNumber, taskId) => {
    if (!userProfile || !userProfile.routinePlan) return;

    const updatedDays = userProfile.routinePlan.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        tasks: day.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return { ...task, completed: !task.completed };
        })
      };
    });

    const streakData = computeUpdatedStreak(userProfile);
    saveProfileData({
      ...userProfile,
      routinePlan: { ...userProfile.routinePlan, days: updatedDays },
      ...streakData
    });
  };

  // Weekly Goal Handlers
  const handleAddWeeklyGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !userProfile) return;

    const goal = {
      id: `goal-${Date.now()}`,
      subject: newGoalSubject,
      title: newGoalTitle.trim(),
      completed: false
    };

    const updated = {
      ...userProfile,
      weeklyGoals: [...(userProfile.weeklyGoals || []), goal]
    };

    setNewGoalTitle('');
    await saveProfileData(updated);
    showToast('Weekly goal added!');
  };

  const handleToggleWeeklyGoal = async (goalId) => {
    if (!userProfile) return;
    const updatedGoals = (userProfile.weeklyGoals || []).map((g) =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    const streakData = computeUpdatedStreak(userProfile);
    await saveProfileData({ ...userProfile, weeklyGoals: updatedGoals, ...streakData });
  };

  const handleDeleteWeeklyGoal = async (goalId) => {
    if (!userProfile) return;
    const updatedGoals = (userProfile.weeklyGoals || []).filter((g) => g.id !== goalId);
    await saveProfileData({ ...userProfile, weeklyGoals: updatedGoals });
  };

  // Daily Goal Handlers
  const handleAddDailyGoal = async (e) => {
    e.preventDefault();
    if (!newDailyTitle.trim() || !userProfile) return;

    const goal = {
      id: `dgoal-${Date.now()}`,
      subject: newDailySubject,
      title: newDailyTitle.trim(),
      completed: false
    };

    const updated = {
      ...userProfile,
      dailyGoals: [...(userProfile.dailyGoals || []), goal]
    };

    setNewDailyTitle('');
    await saveProfileData(updated);
    showToast('Daily goal added!');
  };

  const handleToggleDailyGoal = async (goalId) => {
    if (!userProfile) return;
    const updatedGoals = (userProfile.dailyGoals || []).map((g) =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    const streakData = computeUpdatedStreak(userProfile);
    await saveProfileData({ ...userProfile, dailyGoals: updatedGoals, ...streakData });
  };

  const handleDeleteDailyGoal = async (goalId) => {
    if (!userProfile) return;
    const updatedGoals = (userProfile.dailyGoals || []).filter((g) => g.id !== goalId);
    await saveProfileData({ ...userProfile, dailyGoals: updatedGoals });
  };

  // Study Timer & Manual Log Handlers
  const formatClock = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoLogTimer = async (seconds) => {
    if (!userProfile || seconds < 30) {
      showToast('Session too short to log (< 30s)');
      return;
    }

    const mins = Math.round(seconds / 60);
    const newLog = {
      id: `log-${Date.now()}`,
      subject: timerSubject,
      minutes: mins,
      date: new Date().toISOString().split('T')[0],
      note: `Timer Session (${formatClock(seconds)})`
    };

    const streakData = computeUpdatedStreak(userProfile);
    const updated = {
      ...userProfile,
      studyLogs: [newLog, ...(userProfile.studyLogs || [])],
      ...streakData
    };

    setSecondsElapsed(0);
    await saveProfileData(updated);
    showToast(`Logged ${mins} minutes to ${timerSubject}! Streak updated 🔥`);
  };

  const handleManualLogSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) return;

    const totalMins = (Number(logHours) || 0) * 60 + (Number(logMinutes) || 0);
    if (totalMins <= 0) {
      showToast('Please enter valid study time.');
      return;
    }

    const newLog = {
      id: `log-${Date.now()}`,
      subject: logSubject,
      minutes: totalMins,
      date: new Date().toISOString().split('T')[0],
      note: logNote.trim() || 'Manual study block'
    };

    const streakData = computeUpdatedStreak(userProfile);
    const updated = {
      ...userProfile,
      studyLogs: [newLog, ...(userProfile.studyLogs || [])],
      ...streakData
    };

    setLogHours(1);
    setLogMinutes(30);
    setLogNote('');
    await saveProfileData(updated);
    showToast(`Successfully logged ${totalMins} mins!`);
  };

  const handleDeleteLog = async (logId) => {
    if (!userProfile) return;
    const updatedLogs = (userProfile.studyLogs || []).filter((l) => l.id !== logId);
    await saveProfileData({ ...userProfile, studyLogs: updatedLogs });
  };

  const handleCopySquadCode = () => {
    if (!userProfile?.squadCode) return;
    const code = userProfile.squadCode;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
        showToast('Squad code copied to clipboard!');
      }).catch(() => {
        fallbackCopyText(code);
      });
    } else {
      fallbackCopyText(code);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      showToast('Squad code copied!');
    } catch (err) {
      showToast('Could not copy code');
    }
    document.body.removeChild(textArea);
  };

  // Taya Chatbot handler using Gemini API
  const handleSendMessageToTaya = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    const newHistory = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const contents = newHistory.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const payload = {
        contents,
        systemInstruction: {
          parts: [
            {
              text: 'You are Taya, a friendly, encouraging, and expert 24/7 HSC Science study assistant (Physics, Chemistry, Math, Biology, ICT) in Bangladesh. Help students clarify concepts, solve numerical problems, and manage their study goals.'
            }
          ]
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const candidate = result.candidates?.[0];
      if (candidate && candidate.content?.parts?.[0]?.text) {
        const reply = candidate.content.parts[0].text;
        setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: 'Sorry Boss, I had trouble processing that. Try asking again!' }
        ]);
      }
    } catch (err) {
      console.error('Taya chatbot error:', err);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Network connection issue with Taya AI. Please check your connection.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ==========================================
  // COMPUTED METRICS & FILTERED DATA
  // ==========================================
  const myMetrics = useMemo(() => calculateMetrics(userProfile), [userProfile]);

  const partnerProfile = useMemo(() => {
    if (!userProfile || squadMembers.length <= 1) return null;
    return squadMembers.find((m) => m.uid !== userProfile.uid) || null;
  }, [squadMembers, userProfile]);

  const partnerMetrics = useMemo(() => calculateMetrics(partnerProfile), [partnerProfile]);

  const filteredCourses = useMemo(() => {
    if (!userProfile || !userProfile.courses) return [];
    return userProfile.courses.filter((course) => {
      const matchSubject = selectedSubjectFilter === 'All' || course.subject === selectedSubjectFilter;
      const q = chapterSearchQuery.toLowerCase();
      const matchSearch =
        !q ||
        course.chapterName.toLowerCase().includes(q) ||
        course.subject.toLowerCase().includes(q);
      return matchSubject && matchSearch;
    });
  }, [userProfile, selectedSubjectFilter, chapterSearchQuery]);

  const last7Days = useMemo(() => getLast7Days(), []);

  const weeklyAnalytics = useMemo(() => {
    if (!userProfile || !userProfile.studyLogs) return { thisWeekHrs: 0, lastWeekHrs: 0, diffHrs: 0, pctChange: 0, subjectTotals: {} };
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    let thisWeekMins = 0;
    let lastWeekMins = 0;
    const subjectTotals = {};

    userProfile.studyLogs.forEach((log) => {
      const logDate = new Date(log.date);
      const mins = Number(log.minutes) || 0;
      if (logDate >= sevenDaysAgo) {
        thisWeekMins += mins;
        subjectTotals[log.subject] = (subjectTotals[log.subject] || 0) + mins;
      } else if (logDate >= fourteenDaysAgo && logDate < sevenDaysAgo) {
        lastWeekMins += mins;
      }
    });

    const thisWeekHrs = Number((thisWeekMins / 60).toFixed(1));
    const lastWeekHrs = Number((lastWeekMins / 60).toFixed(1));
    const diffHrs = Number((thisWeekHrs - lastWeekHrs).toFixed(1));
    const pctChange = lastWeekHrs > 0 ? Math.round((diffHrs / lastWeekHrs) * 100) : thisWeekHrs > 0 ? 100 : 0;

    return {
      thisWeekHrs,
      lastWeekHrs,
      diffHrs,
      pctChange,
      subjectTotals,
      hasPrevLogs: lastWeekMins > 0
    };
  }, [userProfile]);

  // ==========================================
  // RENDER: LOADING OR AUTH SCREEN
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading BatCave Study OS...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete || !userProfile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">BatCave Study OS</h1>
            <p className="text-xs text-slate-400">HSC Science Dual Study Tracker, Routine & Taya AI</p>
          </div>

          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1st-Time Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ID & Pass Login
            </button>
          </div>

          {authError && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Display Name (e.g., Batman / Friend A)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Unique User ID (e.g., batman01)
              </label>
              <input
                type="text"
                required
                placeholder="batman01"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Shared Squad Room Code (Must match with friend!)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BAT-HSC26"
                    value={squadCodeInput}
                    onChange={(e) => setSquadCodeInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm font-mono text-indigo-300 placeholder-slate-600 outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Weekly Study Hours Target (e.g., 42h)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={targetHoursInput}
                    onChange={(e) => setTargetHoursInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
            >
              {authSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : authMode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Enter BatCave</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login with ID & Password</span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500 font-semibold uppercase">Or Test Instantly</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={handleEnterDemoMode}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Enter Interactive Demo Mode (Instant Access)</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
              🦇
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">BatCave Study OS</h1>
                {isDemoMode && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    DEMO MODE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Squad Code: <span className="text-indigo-400 font-mono font-bold">{userProfile.squadCode}</span> • User:{' '}
                <span className="text-slate-200 font-bold">{userProfile.displayName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-300">{userProfile.streakDays || 1}d Streak</span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout / Switch Account"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 py-2.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Smart Quest Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subject Tracker & Playlists</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Timer & Study Log</span>
          </button>

          <button
            onClick={() => setActiveTab('duo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'duo'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Study Group Duo</span>
          </button>

          <button
            onClick={() => setActiveTab('taya')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'taya'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Taya Chatbot</span>
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ==========================================
            TAB 1: OVERVIEW, DAILY/WEEKLY GOALS & ANALYTICS
           ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Reality Check Analyzer Card */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 transition ${
                myMetrics.verdict.tone === 'success'
                  ? 'bg-emerald-950/25 border-emerald-500/40'
                  : myMetrics.verdict.tone === 'warning'
                  ? 'bg-amber-950/25 border-amber-500/40'
                  : myMetrics.verdict.tone === 'danger'
                  ? 'bg-rose-950/25 border-rose-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Weekly "Is It Enough?" Reality Check
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        myMetrics.verdict.tone === 'success'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : myMetrics.verdict.tone === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : myMetrics.verdict.tone === 'danger'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {myMetrics.verdict.label}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Weekly Readiness Score: {myMetrics.compositeScore}%
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{myMetrics.verdict.message}</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 shrink-0">
                  <div className="text-center px-2">
                    <div className="text-2xl font-extrabold text-indigo-400">
                      {myMetrics.totalHours}h
                      <span className="text-xs font-normal text-slate-500">/{myMetrics.targetHours}h</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Hours Logged</div>
                  </div>
                  <div className="h-10 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <div className="text-2xl font-extrabold text-emerald-400">
                      {myMetrics.completedGoals}
                      <span className="text-xs font-normal text-slate-500">/{myMetrics.totalGoals}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Weekly Goals</div>
                  </div>
                  <div className="h-10 w-px bg-slate-800" />
                  <div className="text-center px-2">
                    <div className="text-2xl font-extrabold text-sky-400">
                      {myMetrics.watchedClasses}
                      <span className="text-xs font-normal text-slate-500">/{myMetrics.totalClasses}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Classes Done</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>WEEKLY STUDY HOURS</span>
                  <Clock className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{myMetrics.totalHours} hrs</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>Goal:</span>
                    <input
                      type="number"
                      value={userProfile.weeklyHourTarget}
                      onChange={(e) => handleUpdateTargetHours(e.target.value)}
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-200"
                    />
                    <span>h</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.min((myMetrics.totalHours / myMetrics.targetHours) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>PLAYLIST CLASSES</span>
                  <BookOpen className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">
                    {myMetrics.watchedClasses} / {myMetrics.totalClasses}
                  </span>
                  <span className="text-xs text-sky-400 font-semibold">
                    {myMetrics.totalClasses > 0
                      ? Math.round((myMetrics.watchedClasses / myMetrics.totalClasses) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Notes: {myMetrics.notesDone} • Practice/HW: {myMetrics.practiceDone}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>WEEKLY TOPIC GOALS</span>
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">
                    {myMetrics.completedGoals} / {myMetrics.totalGoals}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {Math.round(myMetrics.goalRatio * 100)}% Done
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${myMetrics.goalRatio * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>STUDY STREAK</span>
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-amber-300">{userProfile.streakDays || 1} Days</span>
                  <span className="text-xs text-emerald-400 font-medium">7-Day Log</span>
                </div>
                <div className="flex items-center justify-between gap-1 mt-2.5">
                  {last7Days.map((day) => {
                    const active = (userProfile.activeDates || []).includes(day.iso);
                    return (
                      <div key={day.iso} className="flex flex-col items-center gap-0.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            active
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {active ? '🔥' : day.label[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Goals & Weekly Goals Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Goals (Ajker Target) */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    🎯 Daily Goals (Ajker Target)
                  </h3>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {((userProfile.dailyGoals || []).filter((g) => g.completed)).length}/
                    {(userProfile.dailyGoals || []).length} Done
                  </span>
                </div>

                <form onSubmit={handleAddDailyGoal} className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={newDailySubject}
                      onChange={(e) => setNewDailySubject(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.short}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Add today's study target..."
                      value={newDailyTitle}
                      onChange={(e) => setNewDailyTitle(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {(userProfile.dailyGoals || []).length === 0 ? (
                    <p className="text-xs text-slate-400">No daily goals added for today yet.</p>
                  ) : (
                    (userProfile.dailyGoals || []).map((goal) => {
                      const style = getSubjectStyle(goal.subject);
                      return (
                        <div
                          key={goal.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition ${
                            goal.completed
                              ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleDailyGoal(goal.id)}
                              className="cursor-pointer"
                            >
                              {goal.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500" />
                              )}
                            </button>
                            <div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.color}`}>
                                {goal.subject}
                              </span>
                              <p className={`text-xs font-semibold mt-0.5 ${goal.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                {goal.title}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteDailyGoal(goal.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Weekly Goals (Ei Week-er Chapter/Topic Targets) */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    📅 Weekly Goals (Ei week-er chapter target)
                  </h3>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {myMetrics.completedGoals}/{myMetrics.totalGoals} Done
                  </span>
                </div>

                <form onSubmit={handleAddWeeklyGoal} className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={newGoalSubject}
                      onChange={(e) => setNewGoalSubject(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.short}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="e.g., Physics Vector Chapter Class 1-6"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {(userProfile.weeklyGoals || []).length === 0 ? (
                    <p className="text-xs text-slate-400">No weekly goals added yet.</p>
                  ) : (
                    (userProfile.weeklyGoals || []).map((goal) => {
                      const style = getSubjectStyle(goal.subject);
                      return (
                        <div
                          key={goal.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition ${
                            goal.completed
                              ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleWeeklyGoal(goal.id)}
                              className="cursor-pointer"
                            >
                              {goal.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500" />
                              )}
                            </button>
                            <div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.color}`}>
                                {goal.subject}
                              </span>
                              <p className={`text-xs font-semibold mt-0.5 ${goal.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                {goal.title}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteWeeklyGoal(goal.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      Weekly Analytics (This Week vs Last Week)
                    </h3>
                    <p className="text-xs text-slate-400">
                      {weeklyAnalytics.hasPrevLogs ? 'Comparing last 7 days against previous week' : 'Comparing against baseline'}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      weeklyAnalytics.diffHrs >= 0
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {weeklyAnalytics.diffHrs >= 0 ? `+${weeklyAnalytics.diffHrs}h` : `${weeklyAnalytics.diffHrs}h`} (
                    {weeklyAnalytics.pctChange >= 0 ? `+${weeklyAnalytics.pctChange}%` : `${weeklyAnalytics.pctChange}%`})
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-indigo-300">This Week (Current 7 Days)</span>
                      <span className="font-bold text-white">{weeklyAnalytics.thisWeekHrs} hrs</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (weeklyAnalytics.thisWeekHrs /
                              Math.max(weeklyAnalytics.thisWeekHrs, weeklyAnalytics.lastWeekHrs, myMetrics.targetHours, 1)) *
                              100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-400">
                        {weeklyAnalytics.hasPrevLogs ? 'Previous Week' : 'Baseline Benchmark'}
                      </span>
                      <span className="font-bold text-slate-300">{weeklyAnalytics.lastWeekHrs} hrs</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-slate-600 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (weeklyAnalytics.lastWeekHrs /
                              Math.max(weeklyAnalytics.thisWeekHrs, weeklyAnalytics.lastWeekHrs, myMetrics.targetHours, 1)) *
                              100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white">Subject-Wise Time Distribution</h3>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {Object.keys(weeklyAnalytics.subjectTotals).length === 0 ? (
                    <p className="text-xs text-slate-400">Log study hours to view subject-wise analytics.</p>
                  ) : (
                    Object.entries(weeklyAnalytics.subjectTotals)
                      .sort((a, b) => b[1] - a[1])
                      .map(([subName, mins]) => {
                        const style = getSubjectStyle(subName);
                        const hrs = (mins / 60).toFixed(1);
                        const totalAllMins = Object.values(weeklyAnalytics.subjectTotals).reduce((a, b) => a + b, 0);
                        const share = totalAllMins > 0 ? Math.round((mins / totalAllMins) * 100) : 0;
                        return (
                          <div key={subName} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={`font-semibold ${style.color}`}>{subName}</span>
                              <span className="text-slate-300 font-medium">
                                {hrs}h ({share}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <div className={`h-full ${style.bar}`} style={{ width: `${share}%` }} />
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: SMART QUEST PLANNER (1.5H PACE)
           ========================================== */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  Smart Quest Routine Planner (1.5h/Class Pace)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Answer 5 quick questions below. App will generate a realistic routine ensuring 1.5h per lecture fits comfortably without overload!
                </p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>XP Gamified Quests</span>
              </div>
            </div>

            <form
              onSubmit={handleGenerateRoutinePlan}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    1. Target Days (Cycle)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={plannerForm.targetDays}
                    onChange={(e) => setPlannerForm({ ...plannerForm, targetDays: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    2. Daily Study Hours
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="16"
                    value={plannerForm.dailyHours}
                    onChange={(e) => setPlannerForm({ ...plannerForm, dailyHours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    3. Total Classes to Finish
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={plannerForm.totalClassesToFinish}
                    onChange={(e) => setPlannerForm({ ...plannerForm, totalClassesToFinish: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    4. Subjects Per Day
                  </label>
                  <select
                    value={plannerForm.subjectsPerDay}
                    onChange={(e) => setPlannerForm({ ...plannerForm, subjectsPerDay: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    <option value={1}>1 Subject (Deep Focus)</option>
                    <option value={2}>2 Subjects (Balanced)</option>
                    <option value={3}>3 Subjects (Intense)</option>
                    <option value={4}>4 Subjects (Multi-Combo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    5. Weak / Priority Subject
                  </label>
                  <select
                    value={plannerForm.weakSubject}
                    onChange={(e) => setPlannerForm({ ...plannerForm, weakSubject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Weak Chapter Focus Name
                  </label>
                  <input
                    type="text"
                    value={plannerForm.weakChapter}
                    onChange={(e) => setPlannerForm({ ...plannerForm, weakChapter: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Swords className="w-4 h-4" />
                <span>Generate Smart Quest Routine (1.5h/Class Realistic Math)</span>
              </button>
            </form>

            {userProfile.routinePlan && userProfile.routinePlan.days ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Active Routine Cycle ({userProfile.routinePlan.days.length} Days)
                  </h3>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {userProfile.routinePlan.days.map((d) => (
                      <button
                        key={d.dayNumber}
                        onClick={() => setSelectedQuestDay(d.dayNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedQuestDay === d.dayNumber
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const dayObj = userProfile.routinePlan.days.find((d) => d.dayNumber === selectedQuestDay);
                  if (!dayObj) return null;
                  return (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white">Day {dayObj.dayNumber} Routine</span>
                            <span className="text-xs text-slate-400">({dayObj.dateStr})</span>
                            {dayObj.isBossDay && (
                              <span className="text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                                ⚔️ BOSS BATTLE DAY
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Target Study Hours: {dayObj.targetHours}h</p>
                        </div>
                        <div className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
                          {dayObj.tasks.filter((t) => t.completed).length} / {dayObj.tasks.length} Quests Done
                        </div>
                      </div>

                      <div className="space-y-3">
                        {dayObj.tasks.map((task) => {
                          const style = getSubjectStyle(task.subject);
                          return (
                            <div
                              key={task.id}
                              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition ${
                                task.completed
                                  ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                                  : 'bg-slate-950 border-slate-800'
                              }`}
                            >
                              <div className="flex items-start gap-3.5 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleRoutineTask(dayObj.dayNumber, task.id)}
                                  className="mt-0.5 cursor-pointer"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                                  )}
                                </button>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                      {task.slot}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.bg} ${style.color}`}>
                                      {task.subject}
                                    </span>
                                    <span className="text-[10px] font-bold bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded">
                                      +{task.xp} XP
                                    </span>
                                  </div>
                                  <h4
                                    className={`text-sm font-semibold ${
                                      task.completed ? 'line-through text-slate-500' : 'text-white'
                                    }`}
                                  >
                                    {task.title}
                                  </h4>
                                </div>
                              </div>

                              <div className="text-xs font-mono font-bold text-slate-400 shrink-0 pt-1">
                                ⏱️ {task.duration}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                <BrainCircuit className="w-10 h-10 text-indigo-400 mx-auto mb-3 opacity-75" />
                <p className="text-sm font-medium">Click "Generate Smart Quest Routine" above to create your customized study plan.</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: SUBJECT TRACKER (NCTB CHAPTERS)
           ========================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  NCTB HSC Science Chapter Tracker & Playlists
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Pre-loaded with 82 chapters (Physics, Chemistry, Math, Biology, ICT). Tick Watched, Notes, and Practice checkboxes!
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Chapter</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1">
                <button
                  onClick={() => setSelectedSubjectFilter('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedSubjectFilter === 'All'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({MASTER_NCTB_SYLLABUS.length})
                </button>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectFilter(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedSubjectFilter === sub.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sub.short}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search chapter name..."
                  value={chapterSearchQuery}
                  onChange={(e) => setChapterSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredCourses.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                  No chapters match your filter or search query.
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const style = getSubjectStyle(course.subject);
                  const totalCls = course.classes.length;
                  const watchedCount = course.classes.filter((c) => c.watched).length;
                  const notesCount = course.classes.filter((c) => c.notes).length;
                  const practiceCount = course.classes.filter((c) => c.practice).length;
                  const pct = totalCls > 0 ? Math.round((watchedCount / totalCls) * 100) : 0;
                  const isExpanded = !!expandedCourses[course.id];

                  return (
                    <div
                      key={course.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 transition hover:border-slate-700 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${style.bg} ${style.color}`}>
                              {course.subject}
                            </span>
                            {course.chapterNo !== 99 && (
                              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                Ch #{course.chapterNo}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-400">
                              {watchedCount}/{totalCls} Classes ({pct}%)
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white">{course.chapterName}</h3>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {course.playlistUrl ? (
                            <a
                              href={course.playlistUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Playlist Link</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => setEditingCourseModal(course)}
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-400" />
                              <span>Add Playlist Link</span>
                            </button>
                          )}

                          <button
                            onClick={() => setEditingCourseModal(course)}
                            title="Configure classes & playlist URL"
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setExpandedCourses((prev) => ({ ...prev, [course.id]: !isExpanded }))
                            }
                            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Classes' : `View ${totalCls} Classes`}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {course.chapterNo === 99 && (
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full ${style.bar} transition-all`} style={{ width: `${pct}%` }} />
                      </div>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                            <span>Interactive Class Checklist (Watched • Notes • Practice)</span>
                            <span>
                              Notes: {notesCount}/{totalCls} | HW: {practiceCount}/{totalCls}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                            {course.classes.map((cls) => (
                              <div
                                key={cls.number}
                                className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2"
                              >
                                <span className="text-xs font-mono font-bold text-slate-300">
                                  Class {cls.number}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleClassField(course.id, cls.number, 'watched')}
                                    title="Watched / Lecture Done"
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                      cls.watched
                                        ? 'bg-emerald-500 text-slate-950 shadow'
                                        : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    👁️ Watched
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleClassField(course.id, cls.number, 'notes')}
                                    title="Notes Done"
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                      cls.notes
                                        ? 'bg-indigo-500 text-white shadow'
                                        : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    📝 Notes
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleClassField(course.id, cls.number, 'practice')}
                                    title="HW / Practice Done"
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                      cls.practice
                                        ? 'bg-amber-500 text-slate-950 shadow'
                                        : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    ✏️ HW
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {showAddCourseModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-lg font-bold text-white">Add Custom Chapter / Course</h3>
                  <form onSubmit={handleAddCourse} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Subject
                      </label>
                      <select
                        value={newCourse.subject}
                        onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Chapter Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Organic Conversion Masterclass"
                        value={newCourse.chapterName}
                        onChange={(e) => setNewCourse({ ...newCourse, chapterName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Playlist / Course Direct Link (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/playlist?..."
                        value={newCourse.playlistUrl || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, playlistUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Total Classes (1 - 60)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={newCourse.totalClasses}
                        onChange={(e) => setNewCourse({ ...newCourse, totalClasses: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCourseModal(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition shadow cursor-pointer"
                      >
                        Save Chapter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {editingCourseModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                  <h3 className="text-lg font-bold text-white">Configure: {editingCourseModal.chapterName}</h3>
                  <form onSubmit={handleSaveChapterConfig} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Playlist / Course Direct Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/playlist?..."
                        value={editingCourseModal.playlistUrl || ''}
                        onChange={(e) =>
                          setEditingCourseModal({ ...editingCourseModal, playlistUrl: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Total Classes Count (1 - 60)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editingCourseModal.totalClasses}
                        onChange={(e) =>
                          setEditingCourseModal({ ...editingCourseModal, totalClasses: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCourseModal(null)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition shadow cursor-pointer"
                      >
                        Update Chapter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: TIMER & STUDY LOG
           ========================================== */}
        {activeTab === 'timer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <Timer className="w-5 h-5 text-indigo-400" />
                  BatCave Study Focus Timer
                </h3>
                <p className="text-xs text-slate-400 mt-1">Automatically logs study hours and increases streak on completion.</p>
              </div>

              <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMode('pomodoro');
                    setSecondsElapsed(0);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timerMode === 'pomodoro' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Pomodoro (50m)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMode('stopwatch');
                    setSecondsElapsed(0);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timerMode === 'stopwatch' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Stopwatch
                </button>
              </div>

              <div className="max-w-xs mx-auto">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Tracking Subject
                </label>
                <select
                  value={timerSubject}
                  onChange={(e) => setTimerSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="py-6">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-white">
                  {formatClock(secondsElapsed)}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSecondsElapsed(0);
                  }}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAutoLogTimer(secondsElapsed)}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/25"
                >
                  Save Session
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <form
                onSubmit={handleManualLogSubmit}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Manual Study Hour Logger
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Subject
                    </label>
                    <select
                      value={logSubject}
                      onChange={(e) => setLogSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.short}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={logHours}
                        onChange={(e) => setLogHours(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Mins
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        step="5"
                        value={logMinutes}
                        onChange={(e) => setLogMinutes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Session Note / Topics Covered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Vector dot product & relative velocity problems"
                    value={logNote}
                    onChange={(e) => setLogNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Log Study Block
                </button>
              </form>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white">Recent Study Sessions</h3>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {(userProfile.studyLogs || []).length === 0 ? (
                    <p className="text-xs text-slate-400">No study sessions logged yet.</p>
                  ) : (
                    (userProfile.studyLogs || []).map((log) => {
                      const style = getSubjectStyle(log.subject);
                      const hrs = (Number(log.minutes) / 60).toFixed(1);
                      return (
                        <div
                          key={log.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.bg} ${style.color}`}>
                                {log.subject}
                              </span>
                              <span className="text-xs font-bold text-white">{hrs} hrs</span>
                              <span className="text-[10px] text-slate-500">({log.date})</span>
                            </div>
                            <p className="text-xs text-slate-300">{log.note}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: STUDY GROUP (DUO) & INVITE SYSTEM
           ========================================== */}
        {activeTab === 'duo' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Squad Room & Friend Invites ({userProfile.squadCode})
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Send invitations by friend User ID, accept invites to sync Squad Codes, and compare progress in real-time!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySquadCode}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Squad Code</span>
                </button>
              </div>
            </div>

            {/* Send Friend Invite Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Invite Friend to Your Squad
              </h3>
              <form onSubmit={handleSendFriendInvite} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter friend's User ID (e.g., robin01)"
                  value={friendIdInput}
                  onChange={(e) => setFriendIdInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Invite</span>
                </button>
              </form>

              {/* Incoming Invites List */}
              {(userProfile.incomingInvites || []).length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-semibold uppercase text-amber-400">Incoming Squad Invites:</span>
                  <div className="space-y-2">
                    {userProfile.incomingInvites.map((inv) => (
                      <div
                        key={inv.id}
                        className="bg-slate-950 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">
                            {inv.fromName} (@{inv.fromUserId})
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Invited you to Squad Code: <span className="text-indigo-400 font-mono font-bold">{inv.squadCode}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptInvite(inv)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleRejectInvite(inv.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                      YOU
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{userProfile.displayName}</h3>
                      <p className="text-xs text-indigo-400 font-mono">@{userProfile.userId || 'agent'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                    {myMetrics.compositeScore}% Ready
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-lg font-extrabold text-indigo-400">{myMetrics.totalHours}h</div>
                    <div className="text-[10px] text-slate-400">Study Hours</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-lg font-extrabold text-emerald-400">
                      {myMetrics.completedGoals}/{myMetrics.totalGoals}
                    </div>
                    <div className="text-[10px] text-slate-400">Weekly Goals</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-lg font-extrabold text-amber-400">{userProfile.streakDays || 1}d</div>
                    <div className="text-[10px] text-slate-400">Streak</div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Reality Verdict:</span>
                  <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {myMetrics.verdict.message}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                      DUO
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {partnerProfile ? partnerProfile.displayName : 'Waiting for partner...'}
                      </h3>
                      <p className="text-xs text-cyan-400 font-mono">
                        {partnerProfile ? `@${partnerProfile.userId}` : 'Send invite above to connect'}
                      </p>
                    </div>
                  </div>
                  {partnerProfile && (
                    <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
                      {partnerMetrics.compositeScore}% Ready
                    </span>
                  )}
                </div>

                {partnerProfile ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-extrabold text-indigo-400">{partnerMetrics.totalHours}h</div>
                        <div className="text-[10px] text-slate-400">Study Hours</div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-extrabold text-emerald-400">
                          {partnerMetrics.completedGoals}/{partnerMetrics.totalGoals}
                        </div>
                        <div className="text-[10px] text-slate-400">Weekly Goals</div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                        <div className="text-lg font-extrabold text-amber-400">{partnerProfile.streakDays || 1}d</div>
                        <div className="text-[10px] text-slate-400">Streak</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Partner Verdict:</span>
                      <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {partnerMetrics.verdict.message}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center text-slate-400 space-y-3">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs">
                      No partner found in squad <span className="text-indigo-400 font-mono">{userProfile.squadCode}</span> yet.
                      Type your friend's User ID above and click "Send Invite"!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 6: TAYA CHATBOT (AI STUDY ASSISTANT)
           ========================================== */}
        {activeTab === 'taya' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Taya AI Study Assistant</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      Online 24/7
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Ask physics, chemistry, math, or biology doubts anytime!</p>
                </div>
              </div>
            </div>

            {/* Messages Box */}
            <div ref={chatScrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white font-bold text-xs'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? 'YOU' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Taya is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessageToTaya} className="p-4 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl flex gap-2">
              <input
                type="text"
                placeholder="Ask Taya a study question (e.g., Explain Gauss's law in Physics)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
