import { useMemo, useState, useEffect, useRef } from 'react';
import { Home, Menu, Paperclip, Mic, Send, Shield, BarChart2, Plus } from 'lucide-react';
import './index.css';

type Message = { id: string; role: 'user' | 'ai'; content: string };

const WELCOME = {
  title: 'Welcome to Ai.sha',
  description:
    'Your intelligent real estate assistant. Ask me anything about properties, investments, market trends, or fraud detection.'
};

const TOPICS = [
  { name: 'Property Buying', keywords: ['buy', 'purchase'], response: '🏠 **Property Buying Guide** - Location analysis, legal verification, market rates, home loan tips, property inspection' },
  { name: 'Property Selling', keywords: ['sell', 'selling'], response: '🏡 **Property Selling Guide** - Property valuation, market timing, documentation, staging tips, marketing strategies' },
  { name: 'Rental & Leasing', keywords: ['rent', 'lease'], response: '🏘️ **Rental & Leasing Guide** - Tenant advice, landlord advice, agreement tips, security deposit info' },
  { name: 'Investment Analysis', keywords: ['investment', 'invest'], response: '💰 **Real Estate Investment Guide** - Growing areas, rental yield, capital appreciation, RERA compliance, diversification' },
  { name: 'Fraud Detection', keywords: ['fraud', 'scam'], response: '🚨 **Fraud Detection & Prevention** - Red flags, verification steps, document checks, RERA registration, title deed verification' },
  { name: 'Market Analysis', keywords: ['market', 'trends'], response: '📊 **Market Analysis Dashboard** - Hot markets, city-wise growth, sector performance, interest rates, market outlook' },
  { name: 'Home Loans', keywords: ['emi', 'loan'], response: '🏦 **Home Loan & EMI Guide** - Current interest rates, loan-to-value ratios, tenure options, tax benefits' },
  { name: 'Legal & RERA', keywords: ['law', 'legal', 'rera'], response: '⚖️ **Legal & RERA Compliance** - RERA Act, Transfer of Property Act, stamp duty, registration, GST' }
];

const SAMPLE_PROPERTIES = [
  { id: 1, title: 'Luxury Villa - Whitefield', price: '₹2.5 Cr', roi: '12.5%', location: 'Bangalore, Karnataka', type: 'Residential', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop&crop=center' },
  { id: 2, title: 'Premium Apartment - Bandra', price: '₹1.8 Cr', roi: '10.8%', location: 'Mumbai, Maharashtra', type: 'Residential', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop&crop=center' },
  { id: 3, title: 'Commercial Space - Cyber City', price: '₹3.2 Cr', roi: '14.2%', location: 'Gurgaon, Haryana', type: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&crop=center' },
  { id: 4, title: 'Modern Villa - Koramangala', price: '₹3.8 Cr', roi: '11.5%', location: 'Bangalore, Karnataka', type: 'Residential', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop&crop=center' },
  { id: 5, title: 'Penthouse - Juhu', price: '₹5.2 Cr', roi: '9.8%', location: 'Mumbai, Maharashtra', type: 'Luxury', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=250&fit=crop&crop=center' },
  { id: 6, title: 'Office Complex - Noida', price: '₹2.9 Cr', roi: '13.5%', location: 'Noida, Uttar Pradesh', type: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop&crop=center' }
];

function pickDailyRotation(list: typeof SAMPLE_PROPERTIES, count: number): typeof SAMPLE_PROPERTIES {
  const day = Math.floor((Date.now() / 86400000)) % list.length;
  const rotated: typeof SAMPLE_PROPERTIES = [] as any;
  for (let i = 0; i < list.length; i++) rotated.push(list[(day + i) % list.length]);
  return rotated.slice(0, count) as any;
}

function App(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'ai', content: `**${WELCOME.title}**\n${WELCOME.description}` }
  ]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  const featured = useMemo(() => pickDailyRotation(SAMPLE_PROPERTIES as any, 3), []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function routeAiResponse(text: string): string {
    const lower = text.toLowerCase();
    for (const t of TOPICS) {
      if (t.keywords.some(k => lower.includes(k))) return t.response;
    }
    return '🤖 I can help with buying, selling, renting, investments, fraud detection, and market trends. Ask me anything!';
  }

  function sendMessage(): void {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newUser: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    const ai: Message = { id: crypto.randomUUID(), role: 'ai', content: routeAiResponse(trimmed) };
    setMessages(prev => [...prev, newUser, ai]);
    setInput('');
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxBytes = 10 * 1024 * 1024;
    const accepted = ['image/', 'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const okType = accepted.some(t => t.endsWith('/') ? file.type.startsWith(t) : file.type === t);
    if (!okType || file.size > maxBytes) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: 'File not accepted. Allowed: images, PDF, DOC, DOCX up to 10MB.' }]);
      return;
    }
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: `Received file: ${file.name}. I will analyze it shortly.` }]);
  }

  function simulateVoice(): void {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      const simulated = 'Analyze market trends in Bangalore';
      setInput(simulated);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', content: '🎙️ Voice captured. Ready to send.' }]);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-80 max-w-[320px] border-r border-neutral-800 bg-neutral-950 hidden md:flex flex-col" style={{ transition: '300ms ease-in-out' }}>
          <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center"><Home className="w-6 h-6" /></div>
            <div>
              <div className="text-lg font-semibold">Ai.sha</div>
              <div className="text-sm text-neutral-400">Real Estate Assistant</div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg px-3 py-2 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <button className="w-full rounded-lg px-3 py-2 flex items-center gap-2 bg-neutral-900 border border-neutral-800">
              <Shield className="w-4 h-4 text-red-400" /> Fraud Detection
            </button>
            <button className="w-full rounded-lg px-3 py-2 flex items-center gap-2 bg-neutral-900 border border-neutral-800">
              <BarChart2 className="w-4 h-4 text-green-400" /> Market Analysis
            </button>
          </div>
          <div className="p-4">
            <div className="text-sm text-neutral-400 mb-3">Best Investments Today</div>
            <div className="space-y-3">
              {featured.map(p => (
                <div key={p.id} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                  <img src={p.image} alt={p.title} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-neutral-400">{p.location}</div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-cyan-400">{p.price}</span>
                      <span className="text-green-400">ROI {p.roi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle menu">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center"><Home className="w-6 h-6" /></div>
            <div>
              <div className="text-lg font-semibold">Ai.sha</div>
              <div className="text-sm text-neutral-400">Real Estate Assistant</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {/* Welcome card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Home className="w-5 h-5" />
              <span className="font-medium">Ai.sha</span>
            </div>
            <div className="mt-2 text-xl font-semibold">{WELCOME.title}</div>
            <p className="text-neutral-400 mt-1">{WELCOME.description}</p>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-neutral-900 border border-neutral-800'} max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap`}>
                  {m.role === 'ai' && (
                    <div className="mb-1 flex items-center gap-2 text-cyan-300 text-sm">
                      <Home className="w-4 h-4" /> <span>Ai.sha</span>
                    </div>
                  )}
                  <div className={m.role === 'user' ? 'text-white' : 'text-neutral-100'} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </main>

        {/* Input area */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-4 md:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <label className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer" title="Attach file">
              <input type="file" className="hidden" onChange={handleFile} accept="image/*,.pdf,.doc,.docx" />
              <Paperclip className="w-5 h-5 text-neutral-300" />
            </label>
            <textarea
              className="flex-1 resize-none rounded-lg bg-neutral-900 border border-neutral-800 outline-none p-3 max-h-32 text-neutral-100 placeholder:text-neutral-500"
              placeholder="Ask anything about real estate..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button className={`p-2 rounded-lg border ${recording ? 'border-red-500 bg-red-950 animate-pulse' : 'border-neutral-800 bg-neutral-900'}`} onClick={simulateVoice} aria-pressed={recording} aria-label="Voice input">
              <Mic className={`w-5 h-5 ${recording ? 'text-red-400' : 'text-neutral-300'}`} />
            </button>
            <button
              className={`p-2 rounded-lg text-white ${input.trim() ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-neutral-700 to-neutral-600'}`}
              onClick={sendMessage}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
