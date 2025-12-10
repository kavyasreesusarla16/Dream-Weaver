import React from 'react';
import { DreamEntry } from '../types';
import { ArrowRight, Trash2 } from 'lucide-react';

interface DreamHistoryProps {
  dreams: DreamEntry[];
  onSelectDream: (dream: DreamEntry) => void;
  onDeleteDream: (id: string, e: React.MouseEvent) => void;
}

const DreamHistory: React.FC<DreamHistoryProps> = ({ dreams, onSelectDream, onDeleteDream }) => {
  if (dreams.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p className="text-lg">No dreams recorded yet.</p>
        <p className="text-sm">Start by describing your dream above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {dreams.map((dream) => (
        <div 
          key={dream.id}
          onClick={() => onSelectDream(dream)}
          className="bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group flex flex-col h-full"
        >
          <div className="relative h-48 bg-slate-900 overflow-hidden">
            {dream.imageUrl ? (
              <img 
                src={dream.imageUrl} 
                alt={dream.analysis?.title || 'Dream'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950">
                <span className="text-4xl">?</span>
              </div>
            )}
            <div className="absolute top-0 right-0 p-2">
               <button
                  onClick={(e) => onDeleteDream(dream.id, e)}
                  className="p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                  title="Delete dream"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
               <span className="text-xs font-medium text-slate-300 bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm">
                 {new Date(dream.date).toLocaleDateString()}
               </span>
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
              {dream.analysis?.title || 'Untitled Dream'}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
              {dream.analysis?.summary || dream.originalText}
            </p>
            
            <div className="flex items-center text-purple-400 text-sm font-medium mt-auto">
              View Interpretation 
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DreamHistory;
