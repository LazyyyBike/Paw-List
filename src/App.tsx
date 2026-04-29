import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Info, 
  X, 
  Youtube, 
  User, 
  Gamepad2, 
  Clock,
  Sparkles,
  Heart
} from 'lucide-react';
import { getDemonList, getDemonDetail, getYoutubeThumbnail, Demon, DemonDetail } from './services/pointercrate';
import { LoadingFuff, PawIcon } from './components/Common';

export default function App() {
  const [demons, setDemons] = useState<Demon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<DemonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const LIMIT = 50;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDemonList(LIMIT, page * LIMIT);
        setDemons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    if (selectedId) {
      async function loadDetail() {
        setDetailLoading(true);
        try {
          const data = await getDemonDetail(selectedId!);
          setDetail(data);
        } catch (err) {
          console.error(err);
        } finally {
          setDetailLoading(false);
        }
      }
      loadDetail();
    } else {
      setDetail(null);
    }
  }, [selectedId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="bg-vibrant-orange h-20 flex items-center justify-between px-6 md:px-10 shadow-lg shrink-0 border-b-4 border-vibrant-dark-orange z-10">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-12 h-12 bg-white rounded-full items-center justify-center shadow-inner relative">
            <div className="w-6 h-5 bg-vibrant-orange rounded-full absolute top-4"></div>
            <div className="w-3 h-3 bg-vibrant-orange rounded-full absolute -top-1 left-2"></div>
            <div className="w-3 h-3 bg-vibrant-orange rounded-full absolute -top-1 right-2"></div>
            <div className="w-3 h-3 bg-vibrant-orange rounded-full absolute top-1 left-0"></div>
            <div className="w-3 h-3 bg-vibrant-orange rounded-full absolute top-1 right-0"></div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">PAW-LIST</h1>
        </div>
        <div className="flex gap-4 md:gap-6 text-white font-bold uppercase text-[10px] md:text-sm">
          <a href="#" className="hover:bg-white/20 px-4 py-2 rounded-2xl transition-colors hidden sm:block">Demonlist</a>
          <a href="#" className="hover:bg-white/20 px-4 py-2 rounded-2xl transition-colors hidden sm:block">Leaderboard</a>
          <button className="bg-white text-vibrant-orange px-4 md:px-6 py-2 rounded-2xl shadow-md text-xs md:text-sm">Submit</button>
        </div>
      </nav>

      <main className="flex flex-1 overflow-hidden p-4 md:p-6 gap-6 bg-vibrant-cream">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col gap-4">
          <div className="sidebar-card">
            <h2 className="text-vibrant-orange font-black mb-4 uppercase text-xs tracking-widest">Categories</h2>
            <ul className="space-y-2">
              <li className="bg-vibrant-light-peach text-vibrant-dark-orange px-4 py-3 rounded-2xl font-bold flex justify-between items-center cursor-pointer">
                <span>Main List</span>
                <div className="w-2 h-2 rounded-full bg-vibrant-dark-orange animate-pulse"></div>
              </li>
              <li className="px-4 py-3 hover:bg-vibrant-light-peach rounded-2xl font-medium cursor-pointer transition-all">Extended List</li>
              <li className="px-4 py-3 hover:bg-vibrant-light-peach rounded-2xl font-medium cursor-pointer transition-all">Legacy List</li>
            </ul>
          </div>
          <div className="sidebar-card flex-1">
            <h2 className="text-vibrant-orange font-black mb-4 uppercase text-xs tracking-widest">Global Stats</h2>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed opacity-80 italic">
                The hardest user-created levels in Geometry Dash, curated with fluff and precision.
              </p>
              <div className="mt-4 p-4 bg-vibrant-orange/10 rounded-2xl border border-vibrant-peach">
                <div className="text-[10px] font-black text-vibrant-dark-orange mb-1 uppercase tracking-wider">CURRENT TOP 1</div>
                <div className="text-lg font-black tracking-tight">{demons[0]?.name || "Loading..."}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60">Listing Page</span>
                  <span className="font-bold">#{page + 1}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60">Status</span>
                  <span className="text-green-500 font-bold flex items-center gap-1">Online <Sparkles size={10} /></span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 listing-container overflow-hidden flex flex-col">
          <div className="bg-vibrant-light-peach p-6 border-b-2 border-vibrant-peach flex justify-between items-end shrink-0">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">MAIN LISTING</h3>
              <p className="text-sm font-medium opacity-60">Showing Ranking {page * LIMIT + 1}-{ (page + 1) * LIMIT }</p>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="bg-white p-2 rounded-xl border-2 border-vibrant-peach hover:bg-vibrant-cream disabled:opacity-30 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                className="bg-white p-2 rounded-xl border-2 border-vibrant-peach hover:bg-vibrant-cream transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <LoadingFuff />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-[1]">
                  <tr className="table-header">
                    <th className="py-4 px-8">Rank</th>
                    <th className="py-4 px-4">Level</th>
                    <th className="py-4 px-4 hidden md:table-cell">Creator</th>
                    <th className="py-4 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {demons.map((demon, index) => (
                      <motion.tr
                        key={demon.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group border-b border-vibrant-light-peach hover:bg-vibrant-cream transition-colors cursor-pointer"
                        onClick={() => setSelectedId(demon.id)}
                      >
                        <td className="py-5 px-8 font-black text-2xl text-vibrant-orange group-hover:scale-110 transition-transform origin-left">
                          #{demon.position}
                        </td>
                        <td className="py-5 px-4 font-bold text-lg md:text-xl tracking-tight text-vibrant-brown">
                          {demon.name}
                        </td>
                        <td className="py-5 px-4 text-sm font-semibold opacity-70 hidden md:table-cell">
                          {demon.publisher.name}
                        </td>
                        <td className="py-5 px-8 text-right">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-vibrant-light-peach text-vibrant-orange group-hover:bg-vibrant-orange group-hover:text-white transition-colors">
                            <Info size={20} />
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="h-10 bg-vibrant-brown text-white flex items-center justify-center text-[10px] uppercase tracking-widest gap-2 shrink-0">
        <span>Powered by Pointercrate API</span>
        <span className="opacity-30">|</span>
        <span>Designed for the Furry Community</span>
        <span className="text-vibrant-orange">🐾</span>
      </footer>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-vibrant-brown/60 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-8 border-vibrant-peach/50"
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-vibrant-cream rounded-full hover:bg-white shadow-md text-vibrant-brown transition-colors"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto">
                {detailLoading || !detail ? (
                  <LoadingFuff />
                ) : (
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
                      <div className="w-full lg:w-2/3">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl mb-6 border-4 border-vibrant-peach">
                           <img 
                            src={getYoutubeThumbnail(detail.video)} 
                            alt={detail.name}
                            className="w-full h-auto aspect-video object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <a 
                            href={detail.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all group"
                          >
                            <Youtube size={64} className="text-white opacity-0 group-hover:opacity-100 transition-all drop-shadow-lg" />
                          </a>
                        </div>
                        <h2 className="font-display font-black text-4xl md:text-6xl mb-4 italic tracking-tighter text-vibrant-brown uppercase">
                          {detail.name}
                          <span className="text-2xl text-vibrant-orange font-bold ml-4 border-l-4 border-vibrant-peach pl-4">#{detail.position}</span>
                        </h2>
                      </div>
                      
                      <div className="w-full lg:w-1/3 bg-vibrant-light-peach rounded-[1.5rem] p-6 border-2 border-vibrant-peach">
                        <h4 className="font-display font-black text-xl mb-4 flex items-center gap-2 uppercase italic text-vibrant-dark-orange">
                          <Info size={20} /> Details
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="opacity-60 text-xs font-bold uppercase tracking-widest">Publisher</span>
                            <span className="font-bold">{detail.publisher.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="opacity-60 text-xs font-bold uppercase tracking-widest">Verifier</span>
                            <span className="font-bold">{detail.verifier.name}</span>
                          </div>
                          <div className="pt-4 border-t border-vibrant-peach">
                            <a 
                              href={`https://pointercrate.com/demonlist/${detail.position}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-white border-b-4 border-vibrant-dark-orange/20 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:translate-y-0.5 transition-all"
                            >
                              Pointercrate <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <section>
                        <h4 className="font-display font-black text-2xl mb-6 flex items-center gap-2 uppercase italic text-vibrant-brown">
                          <Heart size={24} className="text-vibrant-orange" /> Hall of Fame
                        </h4>
                        <div className="space-y-3">
                          {detail.records.filter(r => r.progress === 100).slice(0, 5).map((record, i) => (
                            <div key={record.id} className="flex items-center justify-between p-4 bg-vibrant-light-peach/30 border-2 border-transparent rounded-2xl hover:border-vibrant-orange/50 transition-colors group">
                              <div className="flex items-center gap-3">
                                <div className="font-black text-vibrant-orange/40 text-sm">0{i+1}</div>
                                <span className="font-black tracking-tight">{record.player.name}</span>
                              </div>
                              <a href={record.video} target="_blank" rel="noopener noreferrer" className="text-vibrant-orange opacity-40 group-hover:opacity-100 transition-opacity">
                                <Youtube size={20} />
                              </a>
                            </div>
                          ))}
                          {detail.records.filter(r => r.progress === 100).length === 0 && (
                            <p className="text-center py-8 text-vibrant-brown/40 italic font-medium">No victors yet! Be the first? 🐾</p>
                          )}
                        </div>
                      </section>
                      <section>
                         <h4 className="font-display font-black text-2xl mb-6 flex items-center gap-2 uppercase italic text-vibrant-brown">
                           <Clock size={24} className="text-vibrant-dark-orange" /> Level Notes
                        </h4>
                        <div className="bg-vibrant-cream border-2 border-vibrant-peach rounded-2xl p-6 text-vibrant-brown/80 leading-relaxed font-medium">
                           {detail.description || "The sheer difficulty of this level leaves observers speechless. A true test of mechanical skill."}
                        </div>
                        <div className="mt-8 p-6 bg-vibrant-orange text-white rounded-2xl shadow-xl shadow-vibrant-orange/20 relative overflow-hidden">
                          <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-20 rotate-12" />
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Community Pro-Tip</p>
                          <p className="text-sm font-bold leading-tight italic">"Stay determined and keep your paws warm. Consistency is key to victory!"</p>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
