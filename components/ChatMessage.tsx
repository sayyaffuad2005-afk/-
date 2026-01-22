
import React, { useState } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const renderContent = (content: string) => {
    if (!isModel) return <p className="whitespace-pre-wrap leading-[1.6] text-[13px] font-bold">{content}</p>;

    const curriculumSectionMatch = content.match(/\[نص المنهج\]:(.*?)(\[شرح المحاسب الذكي\]:|$)/s);
    const explanationSectionMatch = content.match(/\[شرح المحاسب الذكي\]:(.*)/s);

    if (curriculumSectionMatch || explanationSectionMatch) {
      return (
        <div className="space-y-4">
          {curriculumSectionMatch && (
            <div className="bg-[#0C1844]/5 rounded-[16px] p-4 border border-[#0C1844]/10 shadow-inner relative group/section">
              <button 
                onClick={() => copyToClipboard(curriculumSectionMatch[1].trim(), 'curriculum')}
                className="absolute left-2 top-2 p-1.5 bg-white border border-[#0C1844]/10 rounded-lg shadow-sm opacity-0 group-hover/section:opacity-100 transition-all hover:bg-[#0C1844] text-[#0C1844] hover:text-white z-10"
              >
                {copiedSection === 'curriculum' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-1.5 mb-2 text-[#0C1844]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest">التوثيق من المنهج</span>
              </div>
              <div className="text-[#0C1844]/80 text-[12px] leading-[1.6] whitespace-pre-wrap font-medium italic pl-6">
                {curriculumSectionMatch[1].trim()}
              </div>
            </div>
          )}
          
          {explanationSectionMatch && (
            <div className="bg-white rounded-[16px] p-5 border-l-4 border-[#0C1844] shadow-sm relative group/section">
              <button 
                onClick={() => copyToClipboard(explanationSectionMatch[1].trim(), 'explanation')}
                className="absolute left-2 top-2 p-1.5 bg-[#E4C59E]/20 border border-[#0C1844]/5 rounded-lg shadow-sm opacity-0 group-hover/section:opacity-100 transition-all hover:bg-[#0C1844] text-[#0C1844] hover:text-white z-10"
              >
                {copiedSection === 'explanation' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-1.5 mb-3 text-[#0C1844]">
                <div className="p-1 bg-[#0C1844] rounded text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">شرح المحاسب الذكي</span>
              </div>
              <div className="text-[#0C1844] leading-[1.7] text-[13.5px] font-medium space-y-3 pl-6">
                {formatMarkdown(explanationSectionMatch[1].trim())}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative group/message">
        <button 
          onClick={() => copyToClipboard(content, 'plain')}
          className="absolute left-0 top-[-25px] p-1.5 bg-[#0C1844] rounded-lg shadow-md opacity-0 group-hover/message:opacity-100 transition-all text-white z-10"
        >
          {copiedSection === 'plain' ? 'تم النسخ!' : 'نسخ'}
        </button>
        <div className="whitespace-pre-wrap leading-[1.7] text-[13.5px] font-medium">{content}</div>
      </div>
    );
  };

  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return null;

      if (trimmedLine.includes('|')) {
        const cells = trimmedLine.split('|').filter(cell => cell.trim().length > 0);
        if (cells.length < 2) return null;
        return (
          <div key={i} className="my-4 overflow-x-auto rounded-xl border border-[#0C1844]/10 bg-[#E4C59E]/5 shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#0C1844] text-white">
                  {cells.map((cell, j) => (
                    <th key={j} className="px-3 py-2 text-[9px] font-black text-center uppercase tracking-wider border-l border-white/10">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-white transition-colors">
                  {cells.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 text-[12px] text-[#0C1844] text-center font-bold border-l border-[#0C1844]/5">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      
      return (
        <p key={i} className="mb-1.5 last:mb-0">
          {trimmedLine.split(/\*\*(.*?)\*\*/g).map((part, idx) => 
            idx % 2 === 1 ? <strong key={idx} className="font-black text-[#0C1844] bg-[#E4C59E]/20 px-1 rounded">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-[24px] px-5 py-4 shadow-xl ${
        isModel 
          ? 'bg-[#E4C59E]/40 text-[#0C1844] border border-[#0C1844]/5 rounded-tr-none' 
          : 'bg-[#0C1844] text-white rounded-tl-none shadow-black/20'
      }`}>
        <div className={`flex items-center gap-2 mb-3 opacity-40 text-[9px] font-black uppercase tracking-widest ${isModel ? 'text-[#0C1844]' : 'text-[#E4C59E]'}`}>
           <div className={`w-1.5 h-1.5 rounded-full ${isModel ? 'bg-[#0C1844]' : 'bg-[#E4C59E]'}`}></div>
           {isModel ? 'المحاسب الذكي' : 'الطالب'}
        </div>
        <div>{renderContent(message.content)}</div>
        <div className={`text-[7px] mt-3 font-black opacity-30 ${isModel ? 'text-[#0C1844]' : 'text-[#E4C59E]'} text-left uppercase`}>
          {new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
