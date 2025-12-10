import React, { useState } from 'react';
import { DreamEntry } from '../types';
import EmotionChart from './EmotionChart';
import DreamChat from './DreamChat';
import { Quote, Brain, Palette, Code, MessageSquare } from 'lucide-react';

interface DreamResultProps {
  dream: DreamEntry;
  onSendChatMessage: (message: string) => void;
  isChatting: boolean;
}

const DreamResult: React.FC<DreamResultProps> = ({ dream, onSendChatMessage, isChatting }) => {
  const { analysis, imageUrl, originalText, chatHistory } = dream;
  const [showJson, setShowJson] = useState(false);

  if (!analysis) return null;

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-20">
      {/* Title Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-4">
          {analysis.title}
        </h1>
        <p className="text-slate-400 italic text-lg">{analysis.mood} • {new Date(dream.date).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Visuals & Stats */}
        <div className="space-y-6">
          {/* Image Card */}
          <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 aspect-square">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Dream visualization" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                <p>Visualization unavailable</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white text-sm line-clamp-2 italic">"{originalText}"</p>
            </div>
          </div>

          {/* Chart */}
          <EmotionChart data={analysis.emotions} />
        </div>

        {/* Right Column: Text Analysis & Chat */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Summary */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
              <Quote className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wide text-sm">Summary</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Interpretation */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <Brain className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wide text-sm">Psychological Meaning</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {analysis.interpretation}
            </p>
          </div>

           {/* Keywords */}
           <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 text-pink-400">
              <Palette className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wide text-sm">Symbols</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-200 border border-slate-600">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section - Full Width below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-xl font-bold text-slate-200">Deep Dive Chat</h2>
           </div>
           <DreamChat 
              history={chatHistory} 
              onSendMessage={onSendChatMessage}
              isChatting={isChatting}
           />
        </div>

        <div className="lg:col-span-1">
           {/* Developer Data Toggle */}
           <div className="mt-8 lg:mt-0">
             <button 
               onClick={() => setShowJson(!showJson)}
               className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-4 text-sm font-mono"
             >
               <Code className="w-4 h-4" />
               {showJson ? "Hide Raw Data" : "Show Developer Data"}
             </button>
             
             {showJson && (
               <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-auto max-h-[550px] text-xs font-mono text-emerald-400 shadow-inner">
                 <pre>{JSON.stringify(analysis, null, 2)}</pre>
               </div>
             )}
             
             {!showJson && (
                <div className="bg-slate-800/20 rounded-xl border border-slate-800/50 p-6 text-slate-500 text-sm text-center">
                   <p className="mb-2">Developer Tools</p>
                   <p className="text-xs opacity-70">Inspect the raw JSON structure generated by the AI model for debugging or analysis verification.</p>
                </div>
             )}
           </div>
        </div>
      </div>

    </div>
  );
};

export default DreamResult;
