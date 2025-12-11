import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Aperture, ShoppingBag, ArrowRight, ArrowUpRight,
  Headphones, Smartphone, ShieldCheck, ChevronLeft,
  Star, Search, Menu, X, Plus, Minus, Trash2,
  Camera, Gamepad2, Plane, Keyboard, Speaker
} from 'lucide-react';

/* --- Mock Data with RELIABLE HD Images --- */
const PRODUCTS = [
  {
    id: 1,
    name: "Vision Pro",
    category: "Spatial",
    price: 349990,
    image: import.meta.env.BASE_URL + "images/vision-pro.png",
    tag: "Future",
    description: "Пространственный компьютер, который меняет всё. Работайте, играйте и общайтесь в смешанной реальности с невероятным разрешением."
  },
  {
    id: 2,
    name: "Audio Max",
    category: "Audio",
    price: 54990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    tag: "Top Rated",
    description: "Студийный звук у вас дома. Активное шумоподавление нового поколения и режим прозрачности."
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    category: "Phone",
    price: 119990,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000",
    tag: "Titanium",
    description: "Самый прочный и легкий дизайн из титана. Чип A17 Pro меняет правила игры."
  },
  {
    id: 4,
    name: "MacBook Air",
    category: "Laptop",
    price: 149990,
    image: import.meta.env.BASE_URL + "images/macbook.png",
    tag: "M3 Chip",
    description: "Тонкий. Легкий. Мощный. Работает до 18 часов без подзарядки. Идеален для креатива."
  },
  {
    id: 5,
    name: "Watch Ultra",
    category: "Wearable",
    price: 89990,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=1000",
    tag: "Adventure",
    description: "Самые прочные и функциональные часы. Титановый корпус и невероятная автономность."
  },
  {
    id: 6,
    name: "Sky Drone X",
    category: "Drone",
    price: 129990,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000",
    tag: "4K Video",
    description: "Снимайте мир с высоты птичьего полета. Интеллектуальные режимы полета и камера Hasselblad."
  },
  {
    id: 7,
    name: "Leica M11",
    category: "Camera",
    price: 849990,
    image: import.meta.env.BASE_URL + "images/leica-m11.png",
    tag: "Legendary",
    description: "Легендарное качество снимков в компактном корпусе. Для тех, кто видит мир иначе."
  },
  {
    id: 8,
    name: "Console 5",
    category: "Gaming",
    price: 64990,
    image: import.meta.env.BASE_URL + "images/console-5.png",
    tag: "Next Gen",
    description: "Погрузитесь в игровые миры с трассировкой лучей и мгновенными загрузками."
  },
  {
    id: 9,
    name: "Mech Key Pro",
    category: "Accessory",
    price: 18990,
    image: import.meta.env.BASE_URL + "images/mech-keyboard.png",
    tag: "Custom",
    description: "Механическая клавиатура с горячей заменой свитчей. Тайпинг, от которого невозможно оторваться."
  },
  {
    id: 10,
    name: "Smart Speaker Home",
    category: "Audio",
    price: 29990,
    image: import.meta.env.BASE_URL + "images/smart-speaker.png",
    tag: "Hi-Fi",
    description: "Наполните дом музыкой. Умный помощник и потрясающее качество звука в одном устройстве."
  },
  {
    id: 11,
    name: "Gaming Mouse Alpha",
    category: "Gaming",
    price: 12990,
    image: import.meta.env.BASE_URL + "images/gaming-mouse.png",
    tag: "25K DPI",
    description: "Сверхлегкая игровая мышь с сенсором нового поколения. Точность, которая решает."
  },
  {
    id: 12,
    name: "UltraWide 49\"",
    category: "Monitor",
    price: 159990,
    image: import.meta.env.BASE_URL + "images/ultrawide-monitor.png",
    tag: "Immersive",
    description: "Замените два монитора одним. Невероятный изгиб и частота обновления 240 Гц."
  },
  {
    id: 13,
    name: "Action Cam Go",
    category: "Camera",
    price: 39990,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=1000",
    tag: "Rugged",
    description: "Снимайте свои приключения в 5.3K. Водонепроницаемая и ударопрочная."
  },
  {
    id: 14,
    name: "Pro Earbuds II",
    category: "Audio",
    price: 24990,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000",
    tag: "Noise Cancelling",
    description: "Ваш личный звуковой вакуум. До 30 часов работы с кейсом."
  },
  {
    id: 15,
    name: "Smart Ring Oura",
    category: "Wearable",
    price: 34990,
    image: import.meta.env.BASE_URL + "images/smart-ring.png",
    tag: "Health",
    description: "Трекинг сна и активности в элегантном кольце. Забудьте о зарядке на неделю."
  },
  {
    id: 16,
    name: "Kindle Paper",
    category: "Tablet",
    price: 18990,
    image: import.meta.env.BASE_URL + "images/kindle-reader.png",
    tag: "E-Ink",
    description: "Тысячи книг в одном устройстве. Читайте как с бумаги, даже на ярком солнце."
  },
  {
    id: 17,
    name: "Portable SSD 4TB",
    category: "Accessory",
    price: 45990,
    image: import.meta.env.BASE_URL + "images/portable-ssd.png",
    tag: "Fast",
    description: "Молниеносная передача данных в карманном формате. Защита от падений."
  },
  {
    id: 18,
    name: "GaN Charger 140W",
    category: "Accessory",
    price: 9990,
    image: import.meta.env.BASE_URL + "images/gan-charger.png",
    tag: "Power",
    description: "Один адаптер для всех устройств. Заряжает ноутбук, телефон и часы одновременно."
  },
  {
    id: 19,
    name: "Ergo Chair Pro",
    category: "Furniture",
    price: 59990,
    image: import.meta.env.BASE_URL + "images/ergo-chair.png",
    tag: "Comfort",
    description: "Поддержка спины, которую вы заслуживаете. Идеально для долгих сессий."
  },
  {
    id: 20,
    name: "VR Treadmill",
    category: "Gaming",
    price: 129990,
    image: import.meta.env.BASE_URL + "images/vr-treadmill.png",
    tag: "Ultimate VR",
    description: "Полное погружение в виртуальные миры. Бегите, прыгайте и приседайте в игре."
  },
  {
    id: 21,
    name: "Smart Glasses Ray",
    category: "Wearable",
    price: 49990,
    image: import.meta.env.BASE_URL + "images/smart-glasses.png",
    tag: "AI Inside",
    description: "Снимайте фото и видео, слушайте музыку и звоните, не доставая телефон."
  },
  {
    id: 22,
    name: "RTX 5090",
    category: "Gaming",
    price: 249990,
    image: import.meta.env.BASE_URL + "images/rtx-5090.png",
    tag: "Powerhouse",
    description: "Графический монстр для 8K гейминга и профессионального рендеринга."
  },
  {
    id: 23,
    name: "Robot Vacuum S7",
    category: "Home",
    price: 64990,
    image: import.meta.env.BASE_URL + "images/robot-vacuum.png",
    tag: "Clean",
    description: "Забудьте об уборке. Мощное всасывание и влажная уборка с искусственным интеллектом."
  }
];

/* --- Components --- */

const NoiseBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

const AmbientLight = () => (
  <>
    <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 blur-[120px] rounded-full z-0 pointer-events-none" />
    <div className="fixed bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-rose-900/10 blur-[120px] rounded-full z-0 pointer-events-none" />
    <div className="fixed top-[40%] left-[40%] w-[800px] h-[800px] bg-blue-500/05 blur-[150px] rounded-full z-0 pointer-events-none mix-blend-screen" />
  </>
);

const Navbar = ({ cartCount, onNavigate, activePage, openCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1600px]">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-8 py-3 md:py-5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden">

          {/* Glossy effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Back/Logo Button */}
          <button
            onClick={() => activePage === 'product' ? onNavigate('catalog') : onNavigate('home')}
            className="flex items-center gap-3 group relative z-10"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${activePage === 'product' ? 'bg-white text-black rotate-0' : 'bg-white text-black group-hover:rotate-180'}`}>
              {activePage === 'product' ? <ChevronLeft size={24} /> : <Aperture size={22} />}
            </div>
            <div className="flex flex-col items-start leading-none hidden sm:flex">
              <span className="text-lg font-bold tracking-[0.2em] text-white uppercase transition-all duration-300">
                {activePage === 'product' ? 'Back' : 'Aura'}
              </span>
              <span className="text-lg text-zinc-400 font-medium tracking-widest text-[9px]">
                {activePage === 'product' ? 'TO CATALOG' : 'STORE'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 md:gap-4 lg:gap-8 bg-white/5 rounded-full px-2 py-1 relative z-10 border border-white/5">
            {['home', 'catalog', 'vision'].map((page) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest relative overflow-hidden group ${activePage === page ? 'text-black' : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {activePage === page && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{page === 'home' ? 'Главная' : page === 'catalog' ? 'Каталог' : 'Вижн'}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative group w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]"
                >
                  <span className="text-[10px] font-bold text-white">{cartCount}</span>
                </motion.div>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 active:scale-95"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
          >
            {['home', 'catalog', 'vision', 'about', 'support'].map((item, idx) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                onClick={() => {
                  if (['home', 'catalog', 'vision'].includes(item)) {
                    onNavigate(item);
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-4xl font-bold uppercase tracking-tight ${activePage === item ? 'text-white' : 'text-zinc-500 hover:text-white'
                  }`}
              >
                {item === 'home' ? 'Главная' :
                  item === 'catalog' ? 'Каталог' :
                    item === 'vision' ? 'Вижн' : item}
              </motion.button>
            ))}

            <div className="absolute bottom-12 flex gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500">
                <span className="text-xs">IG</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500">
                <span className="text-xs">TW</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* --- Views --- */

const HomeView = ({ onNavigate, onProductSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto w-full relative z-10"
    >
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-24 md:mb-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">New Drop 2025</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-9xl font-semibold text-white tracking-tighter mb-6 leading-[0.85]"
        >
          Pure <span className="text-zinc-700 font-serif italic">Art.</span><br />
          Pure <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x">Tech.</span>
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mt-8"
        >
          <button
            onClick={() => onNavigate('catalog')}
            className="group px-8 py-4 rounded-full bg-white text-black text-sm font-bold tracking-wide hover:bg-zinc-200 transition-all hover:px-10 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            В каталог
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:auto-rows-[400px]">
        {/* Featured Item (Vision Pro) */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          onClick={() => onProductSelect(PRODUCTS[0])}
          className="group md:col-span-4 cursor-pointer relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10"
        >
          <div className="absolute inset-0">
            <img
              src={PRODUCTS[0].image}
              alt="Vision Pro"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full border border-white/20 text-[10px] bg-black/50 backdrop-blur-md uppercase tracking-widest text-white">
                Flagship
              </span>
              <div className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-medium text-white mb-2 tracking-tight">Vision Pro</h3>
              <p className="text-zinc-300">Измени свой взгляд на реальность.</p>
            </div>
          </div>
        </motion.div>

        {/* Square Item (Audio) */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          onClick={() => onProductSelect(PRODUCTS[1])}
          className="group md:col-span-2 cursor-pointer relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10"
        >
          <div className="absolute inset-0">
            <img
              src={PRODUCTS[1].image}
              alt="Headphones"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <h3 className="text-2xl font-medium text-white">Audio Max</h3>
            <p className="text-sm text-zinc-400">Почувствуй бас.</p>
          </div>
        </motion.div>

        {/* Vertical Card (Phone) */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          onClick={() => onProductSelect(PRODUCTS[2])}
          className="group md:col-span-2 md:row-span-2 cursor-pointer relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10"
        >
          <div className="absolute inset-0">
            <img
              src={PRODUCTS[2].image}
              alt="Phone"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Bestseller</span>
            </div>
            <div>
              <h3 className="text-3xl font-medium text-white tracking-tight">iPhone 15 Pro</h3>
              <p className="text-sm text-zinc-300 mt-2">Titanium. Perfection.</p>
            </div>
          </div>
        </motion.div>

        {/* Drone Card */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          onClick={() => onProductSelect(PRODUCTS[5])}
          className="group md:col-span-2 cursor-pointer relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10"
        >
          <div className="absolute inset-0">
            <img
              src={PRODUCTS[5].image}
              alt="Drone"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
          </div>
          <div className="relative z-10 p-8 h-full flex items-end">
            <div>
              <h3 className="text-xl font-medium text-white">Sky Drone</h3>
              <p className="text-xs text-zinc-400">4K Video</p>
            </div>
          </div>
        </motion.div>

        {/* Camera Card */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          onClick={() => onProductSelect(PRODUCTS[6])}
          className="group md:col-span-2 cursor-pointer relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10"
        >
          <div className="absolute inset-0">
            <img
              src={PRODUCTS[6].image}
              alt="Camera"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          </div>
          <div className="relative z-10 p-8 h-full flex items-end justify-between">
            <div>
              <h3 className="text-xl font-medium text-white">Leica M11</h3>
              <p className="text-xs text-zinc-400">Pure Photography</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              <Plus size={20} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CatalogView = ({ onProductSelect }) => {
  const [filter, setFilter] = useState('All');
  // Dynamic categories from products
  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto w-full relative z-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-semibold text-white mb-4 tracking-tight">Коллекция</h2>
          <p className="text-zinc-500 max-w-md text-lg">Выбирай лучшее. Каждое устройство здесь — произведение искусства. 🎨</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:overflow-visible md:flex-wrap md:justify-end w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${filter === cat
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-black/20 border-white/10 text-zinc-400 hover:border-white/30 hover:text-white backdrop-blur-sm'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => onProductSelect(product)}
              className="group cursor-pointer relative h-[300px] md:h-[500px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    {product.tag}
                  </span>
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors transform group-hover:rotate-45 duration-300">
                    <ArrowUpRight size={18} />
                  </button>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl md:text-3xl font-medium text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-400 font-medium">{product.category}</p>
                    <span className="text-lg font-bold text-white">{product.price.toLocaleString()}₽</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProductDetail = ({ product, onBack, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto w-full relative z-10 min-h-screen"
    >


      <div className="flex flex-col lg:flex-row gap-12 items-center h-full">
        {/* Hero Image Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-3/5 aspect-[4/3] lg:aspect-auto lg:h-[700px] relative rounded-[3rem] overflow-hidden group"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />

          {/* Floating tags */}
          <div className="absolute bottom-8 left-8 flex gap-4">
            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Star size={12} className="text-yellow-500 fill-current" />
              4.9 Rating
            </div>
            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
              In Stock
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-4 block">{product.category} Series</span>
            <h1 className="text-6xl md:text-7xl font-semibold text-white tracking-tighter mb-6">{product.name}</h1>
            <p className="text-3xl text-white font-light mb-8">{product.price.toLocaleString()}₽</p>

            <div className="space-y-6 mb-12">
              <p className="text-zinc-400 leading-relaxed text-lg font-light">
                {product.description}
              </p>
              <div className="flex gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={16} />
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 h-16 rounded-full bg-white text-black font-bold text-lg tracking-wide hover:bg-rose-500 hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]"
              >
                <ShoppingBag size={20} />
                В корзину
              </button>
              <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all">
                <ArrowUpRight size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const CartSidebar = ({ isOpen, onClose, items, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-medium text-white">Your Bag <span className="text-rose-500 text-lg">({items.length})</span></h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Корзина пуста, подруга! 🛍️</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-white/5 group hover:border-white/20 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-white font-medium leading-tight">{item.name}</h4>
                      <p className="text-zinc-500 text-xs mt-1">{item.category}</p>
                      <p className="text-white mt-2 font-bold">{item.price.toLocaleString()}₽</p>
                    </div>
                    <button
                      onClick={() => onRemove(idx)}
                      className="text-zinc-600 hover:text-rose-500 transition-colors self-center p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex justify-between items-end mb-6">
                <span className="text-zinc-400">Итого:</span>
                <span className="text-3xl font-bold text-white tracking-tight">{total.toLocaleString()}₽</span>
              </div>
              <button className="w-full py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                Оформить (Checkout)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatWidget = ({ isOpen, onClose, products }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Привет! 👋 Я AI-помощник Aura. Чем могу помочь с выбором гаджетов?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Direct REST API usage to avoid SDK CORS issues on localhost
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const productContext = products ? products.map(p =>
        `- ${p.name} (${p.category}): ${p.price}₽. ${p.description}`
      ).join('\n') : "";

      const systemPrompt = `
        Ты — Aura AI, виртуальный консультант премиального магазина гаджетов Aura.
        
        ТВОЯ ЗАДАЧА:
        Помогать клиентам выбирать товары из списка ниже.
        
        ТОВАРЫ МАГАЗИНА:
        ${productContext}
        
        ИНСТРУКЦИИ:
        1. Отвечай кратко, "вкусно" и с эмодзи.
        2. Если спросят про что-то левое (погоду, политику) — отшутись и предложи гаджет.
        3. Не выдумывай товары, которых нет в списке.
        
        Вопрос клиента: "${userMsg.text}"
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API Error");
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Хм, что-то я задумался...";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
    } catch (error) {
      console.error("Gemini Details:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: `Ошибка связи с космосом... 🌌 (${error.message})`, sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 h-[500px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-[60] flex flex-col overflow-hidden ring-1 ring-white/5"
        >
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center">
                  <Aperture size={16} className="text-white animate-spin-slow" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Aura AI</h3>
                <p className="text-[10px] text-zinc-400">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-white text-black rounded-br-none'
                  : 'bg-zinc-800/80 text-zinc-200 border border-white/5 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/80 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 focus:bg-black/80 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black transition-all"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- Main App --- */

const App = () => {
  // Initialize cart from localStorage to persist data on refresh
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aura_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });

  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  // Navigation Logic
  const handleNavigate = (page) => {
    setActivePage(page);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActivePage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-rose-500/30 selection:text-white overflow-x-hidden">
      <NoiseBackground />
      <AmbientLight />

      <Navbar
        cartCount={cart.length}
        onNavigate={handleNavigate}
        activePage={activePage}
        openCart={() => setIsCartOpen(true)}
      />

      <AnimatePresence mode="wait">
        {activePage === 'home' && (
          <HomeView key="home" onNavigate={handleNavigate} onProductSelect={handleProductSelect} />
        )}
        {activePage === 'catalog' && (
          <CatalogView key="catalog" onProductSelect={handleProductSelect} />
        )}
        {activePage === 'product' && selectedProduct && (
          <ProductDetail
            key="detail"
            product={selectedProduct}
            onBack={() => handleNavigate('catalog')}
            onAddToCart={addToCart}
          />
        )}
        {activePage === 'vision' && (
          <motion.div
            key="vision"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-screen flex items-center justify-center relative z-10"
          >
            <div className="text-center">
              <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-600 mb-4 tracking-tighter">Vision OS</h1>
              <p className="text-zinc-500 text-xl font-light">Скоро... (Coming Soon)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
      />

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} products={PRODUCTS} />

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50 group">
        {!isChatOpen && (
          <>
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#050505] z-10 animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#050505] z-10"></span>
          </>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] ${isChatOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-white text-black'
            }`}
        >
          {isChatOpen ? <X size={24} /> : <Aperture className="w-6 h-6 animate-spin-slow" />}
        </button>
      </div>

    </div>
  );
};

export default App;
