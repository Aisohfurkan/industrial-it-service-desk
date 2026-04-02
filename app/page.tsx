"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

// Enterprise Veri Tipleri
type Comment = {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  profiles?: { role: string };
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'acik' | 'beklemede' | 'cozuldu';
  image_url?: string;
  created_at: string;
  comments?: Comment[];
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("musteri");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'acik').length,
    solved: tickets.filter(t => t.status === 'cozuldu').length
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkUserRole(session.user.id);
      else { setUserRole("musteri"); setTickets([]); }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    if (data) {
      setUserRole(data.role);
      fetchTickets(data.role, userId);
    }
  };

  const fetchTickets = async (role: string, userId: string) => {
    let query = supabase.from("tickets").select(`*, comments (*, profiles(role))`);
    if (role !== "admin") query = query.eq("customer_id", userId);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data) setTickets(data as Ticket[]);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('ticket-images').upload(fileName, file);
    if (uploadError) return null;
    const { data: { publicUrl } } = supabase.storage.from('ticket-images').getPublicUrl(fileName);
    return publicUrl;
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUploading(true);
    let imageUrl = "";
    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }
    const { error } = await supabase.from("tickets").insert([{ title, description, customer_id: user.id, image_url: imageUrl }]);
    if (!error) { setTitle(""); setDescription(""); setFile(null); fetchTickets(userRole, user.id); }
    setIsUploading(false);
  };

  const sendComment = async (ticketId: string) => {
    if (!newComment[ticketId]?.trim()) return;
    const { error } = await supabase.from("comments").insert([{ ticket_id: ticketId, user_id: user?.id, message: newComment[ticketId] }]);
    if (!error) { setNewComment({ ...newComment, [ticketId]: "" }); fetchTickets(userRole, user!.id); }
  };

  const updateStatus = async (id: string, s: string) => {
    await supabase.from("tickets").update({ status: s }).eq("id", id);
    fetchTickets(userRole, user!.id);
  };

  const handleAuth = async (type: "login" | "signup") => {
    const { error } = type === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  if (loading) return <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-slate-500 font-mono tracking-tighter animate-pulse">INITIATING SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
        
        {/* TOP NAVIGATION BAR */}
        <nav className="flex justify-between items-center bg-[#161a22] border-b border-white/5 px-8 py-5 rounded-t-2xl shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="h-10 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase italic">Industrial IT Service Desk</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-[0.2em] uppercase">Operations Control Center • v4.2.0</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-[11px] font-mono text-slate-400 bg-black/30 px-3 py-1 rounded border border-white/5">{user.email}</span>
              <button onClick={() => supabase.auth.signOut()} className="text-[11px] font-black text-red-400 hover:text-red-300 transition uppercase tracking-widest">Logout</button>
            </div>
          )}
        </nav>

        {!user ? (
          /* AUTH INTERFACE */
          <div className="max-w-md mx-auto pt-20">
            <div className="bg-[#161a22] border border-white/10 p-10 rounded-2xl shadow-2xl space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-light text-white tracking-tight">System Login</h2>
                <p className="text-[10px] text-slate-500 uppercase mt-2">Internal Access Only</p>
              </div>
              <div className="space-y-4">
                <input type="email" placeholder="Employee Email" className="w-full bg-[#0a0c10] border border-white/5 p-4 rounded focus:border-blue-500 outline-none transition" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Terminal Password" className="w-full bg-[#0a0c10] border border-white/5 p-4 rounded focus:border-blue-500 outline-none transition" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => handleAuth("login")} className="w-full bg-blue-600 hover:bg-blue-500 py-4 font-bold tracking-widest uppercase transition rounded shadow-lg shadow-blue-900/20">Authorize</button>
                <button onClick={() => handleAuth("signup")} className="w-full text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-[0.3em] py-2">Request Access (Register)</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SIDEBAR / STATS */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#161a22] p-6 rounded-xl border border-white/5 space-y-6">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase italic">System Health</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[ {l: 'Total Incidents', v: stats.total, c: 'blue'}, {l: 'Active Cases', v: stats.open, c: 'amber'}, {l: 'Resolved', v: stats.solved, c: 'emerald'} ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/20 p-4 rounded border border-white/5">
                      <span className="text-xs font-semibold text-slate-400">{s.l}</span>
                      <span className={`text-xl font-mono text-${s.c}-500`}>{s.v.toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {userRole === "musteri" && (
                <div className="bg-[#161a22] p-8 rounded-xl border border-white/5 space-y-6">
                  <h2 className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase italic underline decoration-blue-500/50 underline-offset-8">Report New Issue</h2>
                  <form onSubmit={createTicket} className="space-y-4">
                    <input required placeholder="Issue Title (e.g. Terminal A-4 Down)" className="w-full bg-[#0a0c10] border border-white/5 p-4 rounded text-sm outline-none focus:border-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea required placeholder="Technical details..." className="w-full bg-[#0a0c10] border border-white/5 p-4 rounded text-sm h-32 outline-none focus:border-blue-500 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold text-slate-500 cursor-pointer hover:text-blue-400 transition bg-black/40 p-3 rounded border border-white/5 border-dashed text-center uppercase tracking-widest">
                        Attach Evidence (JPG/PNG)
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                      </label>
                      {file && <span className="text-[10px] text-blue-400 bg-blue-500/10 p-2 text-center rounded animate-pulse italic">{file.name} ready for upload.</span>}
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 py-4 rounded font-black tracking-widest uppercase text-xs transition-all">
                      {isUploading ? 'Transferring Data...' : 'Submit Incident Report'}
                    </button>
                  </form>
                </div>
              )}
            </aside>

            {/* MAIN FEED */}
            <main className="lg:col-span-8 space-y-6">
              <h2 className="text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase italic px-2">Incident Log Output</h2>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-[#161a22] border border-white/5 rounded-xl overflow-hidden shadow-sm hover:shadow-blue-500/5 transition-all">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${ticket.status === 'acik' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse' : 'bg-emerald-500'}`}></div>
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">{ticket.status === 'acik' ? 'Awaiting Dispatch' : 'Incident Resolved'}</span>
                            <span className="text-[9px] font-mono text-slate-600">|</span>
                            <span className="text-[9px] font-mono text-slate-600 uppercase">{new Date(ticket.created_at).toLocaleString('tr-TR')}</span>
                          </div>
                          <h3 className="text-xl font-medium text-white tracking-tight leading-none">{ticket.title}</h3>
                          <p className="text-slate-500 text-[13px] leading-relaxed font-light">{ticket.description}</p>
                          
                          {ticket.image_url && (
                            <div className="mt-4 border border-white/5 rounded-lg overflow-hidden max-w-sm">
                              <img src={ticket.image_url} alt="Evidence" className="w-full opacity-80 hover:opacity-100 transition grayscale hover:grayscale-0" />
                            </div>
                          )}
                        </div>
                        {userRole === "admin" && ticket.status !== "cozuldu" && (
                          <button onClick={() => updateStatus(ticket.id, "cozuldu")} className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-6 py-2 border border-emerald-500/20 rounded font-black text-[10px] tracking-widest transition">RESOLVE CASE</button>
                        )}
                      </div>

                      {/* INTERNAL CHAT LOG */}
                      <div className="mt-8 pt-6 border-t border-white/5 space-y-4 bg-black/10 p-4 rounded-lg">
                        <p className="text-[10px] font-black text-slate-700 tracking-widest uppercase italic">Secure Channel Communication</p>
                        <div className="space-y-4 max-h-48 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-white/5">
                          {ticket.comments?.map((c) => (
                            <div key={c.id} className={`flex ${c.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded text-[12px] ${
                                c.user_id === user?.id 
                                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                                  : 'bg-white/5 text-slate-400 border border-white/5'
                              }`}>
                                <p className="text-[8px] font-black opacity-40 uppercase mb-1">{c.profiles?.role === 'admin' ? 'SYSTEM_OPERATOR' : 'CLIENT_TERMINAL'}</p>
                                {c.message}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <input 
                            type="text" 
                            placeholder="Input message to channel..." 
                            className="flex-1 bg-[#0a0c10] border border-white/5 p-3 rounded text-xs outline-none focus:border-blue-500"
                            value={newComment[ticket.id] || ""}
                            onChange={(e) => setNewComment({ ...newComment, [ticket.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && sendComment(ticket.id)}
                          />
                          <button onClick={() => sendComment(ticket.id)} className="text-[10px] font-black bg-blue-600/20 text-blue-400 px-4 py-2 hover:bg-blue-600 hover:text-white transition rounded border border-blue-500/20">SEND</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}