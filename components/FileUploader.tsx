
import React, { useRef } from 'react';
import { CurriculumFile } from '../types';

interface FileUploaderProps {
  onFilesAdded: (files: CurriculumFile[]) => void;
  files: CurriculumFile[];
  onRemoveFile: (id: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAdded, files, onRemoveFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: CurriculumFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type !== 'application/pdf') {
        alert('يرجى رفع ملفات PDF فقط.');
        continue;
      }

      const base64 = await fileToBase64(file);
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        base64: base64.split(',')[1],
        type: file.type
      });
    }

    onFilesAdded(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="bg-white rounded-[32px] shadow-2xl shadow-[#0C1844]/5 border border-[#0C1844]/5 p-8">
      <div 
        className="group relative overflow-hidden flex flex-col items-center justify-center border-3 border-dashed border-[#E4C59E] rounded-[24px] py-12 px-6 transition-all hover:border-[#0C1844] hover:bg-[#E4C59E]/5 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 bg-[#0C1844] rounded-2xl flex items-center justify-center text-[#E4C59E] mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-[#0C1844]/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-[#0C1844] font-black mb-1 text-base uppercase tracking-widest">إضافة كتاب المنهج</h3>
        <p className="text-[10px] text-[#0C1844]/40 font-black uppercase tracking-widest">اسحب الملف أو انقر هنا للاختيار</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          multiple
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black text-[#0C1844] uppercase tracking-[0.3em]">المكتبة الحالية ({files.length}):</h4>
          </div>
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-[#E4C59E]/10 border border-[#0C1844]/5 px-5 py-4 rounded-[20px] group hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-[#0C1844] text-white rounded-xl flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-[#0C1844] truncate font-bold">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
