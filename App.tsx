
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatMessage } from './components/ChatMessage';
import { Message, CurriculumFile, AppStatus, Course, AppView } from './types';
import { geminiService } from './services/geminiService';

const COURSES: Course[] = [
  { id: 'acc-en', name: 'محاسبة إنجليزي', englishName: 'Accounting in English', icon: '🔤', color: 'bg-[#0C1844]' },
  { id: 'mkt', name: 'مبادئ التسويق', englishName: 'Principles of Marketing', icon: '📢', color: 'bg-[#0C1844]' },
  { id: 'corp-acc', name: 'محاسبة شركات', englishName: 'Corporate Accounting', icon: '🏢', color: 'bg-[#0C1844]' },
  { id: 'op-res', name: 'بحوث العمليات', englishName: 'Operations Research', icon: '📊', color: 'bg-[#0C1844]' },
  { id: 'corp-law', name: 'قانون الشركات', englishName: 'Corporate Law', icon: '⚖️', color: 'bg-[#0C1844]' },
  { id: 'risk-ins', name: 'خطر وتأمين', englishName: 'Risk and Insurance', icon: '🛡️', color: 'bg-[#0C1844]' },
];

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB limit

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [courseFiles, setCourseFiles] = useState<Record<string, CurriculumFile>>({});
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCourse = COURSES.find(c => c.id === activeCourseId);
  const currentMessages = activeCourseId ? (messages[activeCourseId] || []) : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, view]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeCourseId || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    if (file.type !== 'application/pdf') {
      alert('يرجى رفع ملف PDF فقط');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(`⚠️ حجم الملف كبير جداً (${(file.size / (1024 * 1024)).toFixed(1)}MB). الحد الأقصى المسموح به حالياً هو 200MB.`);
      return;
    }

    setStatus(AppStatus.FILE_PROCESSING);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = () => reject(new Error("فشل في قراءة الملف"));
        reader.readAsDataURL(file);
      });

      setCourseFiles(prev => ({
        ...prev,
        [activeCourseId]: {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          base64,
          type: file.type
        }
      }));
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء معالجة الملف.");
      setStatus(AppStatus.IDLE);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activeCourseId || status === AppStatus.PROCESSING) return;

    const file = courseFiles[activeCourseId];
    if (!file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [activeCourseId]: [...(prev[activeCourseId] || []), userMessage]
    }));
    
    const currentInput = input;
    setInput('');
    setStatus(AppStatus.PROCESSING);

    try {
      const history = (messages[activeCourseId] || []).map(m => ({ role: m.role, content: m.content }));
      const response = await geminiService.askQuestion(
        currentInput, 
        [file], 
        history,
        selectedChapter
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => ({
        ...prev,
        [activeCourseId]: [...(prev[activeCourseId] || []), aiMessage]
      }));
      setStatus(AppStatus.IDLE);
    } catch (error: any) {
      setStatus(AppStatus.ERROR);
      const errMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: error.message || "حدث خطأ أثناء معالجة البيانات.",
        timestamp: Date.now()
      };
      setMessages(prev => ({ ...prev, [activeCourseId]: [...(prev[activeCourseId] || []), errMessage] }));
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center space-y-3 py-6">
        <h2 className="text-4xl md:text-5xl font-black text-[#0C1844] tracking-tight">بوابـة الطالب الذكي</h2>
        <p className="text-[#0C1844]/60 text-base font-bold opacity-80">اختر مسارك التعليمي للمذاكرة المدعومة بالذكاء الاصطناعي</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2 pb-12">
        {COURSES.map(course => {
          const hasFile = !!courseFiles[course.id];
          return (
            <button
              key={course.id}
              onClick={() => {
                setActiveCourseId(course.id);
                setView(AppView.COURSE_DETAIL);
              }}
              className="group bg-white/60 backdrop-blur-sm border border-[#0C1844]/5 p-6 rounded-[32px] text-center transition-all hover:bg-white hover:shadow-2xl hover:shadow-[#0C1844]/10 hover:-translate-y-2 flex flex-col items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${course.color} flex items-center justify-center text-2xl shadow-xl shadow-[#0C1844]/20 group-hover:scale-110 transition-transform`}>
                <span className="filter drop-shadow-md">{course.icon}</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0C1844] leading-tight mb-1">{course.name}</h3>
                <p className="text-[7px] text-[#0C1844]/40 font-black uppercase tracking-widest">{course.englishName}</p>
              </div>
              <div className={`mt-auto px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${hasFile ? 'bg-[#0C1844] text-white border-[#0C1844]' : 'bg-[#E4C59E]/30 text-[#0C1844]/40 border-transparent'}`}>
                {hasFile ? 'جاهز للمذاكرة' : 'ارفع المنهج'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCourseDetail = () => {
    const file = activeCourseId ? courseFiles[activeCourseId] : null;
    const isProcessing = status === AppStatus.FILE_PROCESSING;

    return (
      <div className="max-w-md mx-auto py-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[40px] border border-[#0C1844]/5 p-8 shadow-2xl shadow-[#0C1844]/10 text-center space-y-8">
          <div className={`w-20 h-20 mx-auto rounded-3xl ${activeCourse?.color} flex items-center justify-center text-4xl shadow-xl shadow-[#0C1844]/20`}>
            {activeCourse?.icon}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0C1844]">{activeCourse?.name}</h2>
            <p className="text-[#0C1844]/40 font-bold uppercase tracking-widest text-[10px] mt-2">{activeCourse?.englishName}</p>
          </div>

          <div className="space-y-6">
            {!file ? (
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`border-3 border-dashed border-[#E4C59E] rounded-[32px] p-10 cursor-pointer transition-all bg-[#E4C59E]/5 ${isProcessing ? 'opacity-50 cursor-wait' : 'hover:border-[#0C1844] hover:bg-[#E4C59E]/10'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-[#0C1844] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h4 className="text-sm font-black text-[#0C1844]">جاري تجهيز الكتاب...</h4>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-[#0C1844] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <h4 className="text-base font-black text-[#0C1844]">ارفع منهج المادة (PDF)</h4>
                    <p className="text-[10px] text-[#0C1844]/40 mt-2 font-bold uppercase tracking-widest">يدعم حتى 200MB</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#0C1844] rounded-[24px] p-5 flex items-center gap-4 text-white shadow-xl shadow-[#0C1844]/20">
                  <div className="w-10 h-10 bg-[#E4C59E] text-[#0C1844] rounded-xl flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-right overflow-hidden flex-1">
                    <p className="text-[10px] text-[#E4C59E] font-black uppercase tracking-widest mb-1">الكتاب المتصل</p>
                    <p className="text-xs font-bold truncate">{file.name}</p>
                  </div>
                  <button onClick={() => setCourseFiles({})} className="text-[10px] font-black text-white/50 hover:text-white transition-colors underline">تغيير</button>
                </div>

                <div className="bg-[#E4C59E]/10 rounded-[24px] p-5 border border-[#0C1844]/5 text-right">
                  <label className="block text-[10px] font-black text-[#0C1844] uppercase mb-3 tracking-widest">تحديد الفصل الدراسي (تركيز الذكاء 🎯):</label>
                  <input 
                    type="text" 
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    placeholder="مثال: الفصل الخامس - الميزانية"
                    className="w-full bg-white border border-[#E4C59E] rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0C1844] text-[#0C1844]"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => file && setView(AppView.CHAT)}
              disabled={!file || isProcessing}
              className={`w-full py-4 rounded-[24px] font-black text-sm transition-all active:scale-95 shadow-2xl ${
                file && !isProcessing
                ? 'bg-[#0C1844] text-white shadow-[#0C1844]/30' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              ابدأ الجلسة الدراسية
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="h-[calc(100vh-200px)] flex flex-col gap-4 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-[#0C1844]/10 border border-[#0C1844]/5 overflow-hidden relative">
        <div className="bg-[#0C1844] px-6 py-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E4C59E] rounded-xl flex items-center justify-center text-xl shadow-lg shadow-black/20">
              {activeCourse?.icon}
            </div>
            <div>
              <h3 className="font-black text-white text-sm">{activeCourse?.name}</h3>
              <p className="text-[8px] text-[#E4C59E] font-bold uppercase tracking-widest">
                {selectedChapter ? `تركيز: ${selectedChapter}` : 'المنهج كاملاً'}
              </p>
            </div>
          </div>
          <button onClick={() => setView(AppView.COURSE_DETAIL)} className="p-2 bg-white/10 text-[#E4C59E] hover:bg-white/20 rounded-xl transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white to-[#E4C59E]/10">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
              <div className="w-16 h-16 bg-[#0C1844] rounded-full flex items-center justify-center mb-6 text-[#E4C59E]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-black text-[#0C1844] uppercase tracking-widest">مستعد لنقاش المنهج وشرح المفاهيم المحاسبية.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMessages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            </div>
          )}
          {status === AppStatus.PROCESSING && (
            <div className="flex justify-start my-4">
              <div className="bg-[#0C1844] border border-[#E4C59E]/10 rounded-[20px] px-5 py-3 flex items-center gap-3 shadow-xl shadow-black/20">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#E4C59E] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#E4C59E] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#E4C59E] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[9px] font-black text-[#E4C59E] uppercase tracking-[0.2em]">جاري استخراج البيانات...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-white border-t border-[#0C1844]/5">
          <div className="relative flex items-center gap-3">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="اكتب سؤالك أو اطلب شرح مفهوم..."
              className="flex-1 resize-none bg-[#E4C59E]/10 border-2 border-transparent rounded-[20px] px-6 py-4 focus:outline-none focus:border-[#0C1844] text-[#0C1844] font-bold text-xs shadow-inner"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || status === AppStatus.PROCESSING}
              className={`w-14 h-14 flex items-center justify-center rounded-[20px] transition-all shadow-xl active:scale-90 ${
                input.trim() && status !== AppStatus.PROCESSING ? 'bg-[#0C1844] text-white shadow-[#0C1844]/30' : 'bg-slate-200 text-slate-400 shadow-none'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout onBack={view !== AppView.HOME ? () => setView(view === AppView.CHAT ? AppView.COURSE_DETAIL : AppView.HOME) : undefined}>
      {view === AppView.HOME && renderHome()}
      {view === AppView.COURSE_DETAIL && renderCourseDetail()}
      {view === AppView.CHAT && renderChat()}
    </Layout>
  );
};

export default App;
