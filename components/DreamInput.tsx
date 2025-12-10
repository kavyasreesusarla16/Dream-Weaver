import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface DreamInputProps {
  onAnalyze: (text: string) => void;
  isProcessing: boolean;
}

const DreamInput: React.FC<DreamInputProps> = ({ onAnalyze, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze(text);
    setText('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in-up">
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-mystic-500" />
          <h2 className="text-xl font-bold text-slate-100">Describe your dream</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-mystic-600 focus:border-transparent outline-none transition-all placeholder-slate-500 resize-none"
            placeholder="I was flying over a city made of crystal, but suddenly the sky turned purple..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!text.trim() || isProcessing}
            className={`
              flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all
              ${!text.trim() || isProcessing 
                ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/25 active:scale-95'}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Interpreting & Dreaming...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Dream
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DreamInput;
