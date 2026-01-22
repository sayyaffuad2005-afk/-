
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onBack, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header باللون الكحلي الغامق */}
      <header className="bg-[#0C1844] border-b border-[#E4C59E]/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2.5 bg-[#E4C59E]/10 hover:bg-[#E4C59E]/20 rounded-2xl transition-all text-[#E4C59E] group active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#E4C59E] rounded-2xl flex items-center justify-center text-[#0C1844] shadow-lg shadow-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight leading-none">المحاسب الذكي</h1>
                <p className="text-[9px] text-[#E4C59E] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-80">الدفعة التاسعة • محاسبة</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] font-black text-white/60 bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">
              المساعد الأكاديمي الرقمي
            </span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      {/* Footer يتناسب مع الخلفية البيجية */}
      <footer className="py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          <div className="px-8 py-4 rounded-3xl bg-[#0C1844] border border-[#E4C59E]/30 shadow-2xl transition-all hover:shadow-[#0C1844]/20 group">
            <p className="text-[12px] font-medium text-[#E4C59E]/70 group-hover:text-[#E4C59E] transition-colors text-center">
              إعداد وتصميم : <span className="font-black text-white group-hover:text-[#E4C59E]">سياف الحاتمــي</span> | مندوب الدفعة
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black text-[#0C1844]/40 uppercase tracking-[0.4em]">
             <span>دقة</span>
             <span className="w-1.5 h-1.5 rounded-full bg-[#0C1844]/20"></span>
             <span>أمانة</span>
             <span className="w-1.5 h-1.5 rounded-full bg-[#0C1844]/20"></span>
             <span>إبداع</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
