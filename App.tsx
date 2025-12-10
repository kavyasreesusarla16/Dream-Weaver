import React, { useState, useEffect } from 'react';
import { DreamEntry, ViewState, ChatMessage } from './types';
import DreamInput from './components/DreamInput';
import DreamResult from './components/DreamResult';
import DreamHistory from './components/DreamHistory';
import { analyzeDreamText, generateDreamImage, sendDreamChat } from './services/gemini';
import { Moon, BookOpen, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dreamweaver_dreams');
    if (saved) {
      try {
        setDreams(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse dreams", e);
      }
    }
  }, []);

  // Save to local storage whenever dreams change
  useEffect(() => {
    localStorage.setItem('dreamweaver_dreams', JSON.stringify(dreams));
  }, [dreams]);

  const handleAnalyze = async (text: string) => {
    setIsProcessing(true);
    setError(null);
    const newId = crypto.randomUUID();

    try {
      // 1. Text Analysis
      const analysis = await analyzeDreamText(text);
      
      // 2. Image Generation
      const imageUrl = await generateDreamImage(text, analysis.mood);

      const newDream: DreamEntry = {
        id: newId,
        date: new Date().toISOString(),
        originalText: text,
        analysis: analysis,
        imageUrl: imageUrl,
        isLoading: false,
        chatHistory: [] // Initialize empty chat
      };

      setDreams(prev => [newDream, ...prev]);
      setSelectedDreamId(newId);
      setCurrentView(ViewState.HOME);

    } catch (err) {
      console.error(err);
      setError("Failed to interpret the dream. Please check your API key and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendChatMessage = async (messageText: string) => {
    if (!selectedDreamId) return;
    
    const activeDreamIndex = dreams.findIndex(d => d.id === selectedDreamId);
    if (activeDreamIndex === -1) return;
    
    const activeDream = dreams[activeDreamIndex];
    if (!activeDream.analysis) return;

    setIsChatting(true);

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: messageText,
      timestamp: Date.now()
    };

    // Optimistically update UI
    const updatedDreams = [...dreams];
    updatedDreams[activeDreamIndex] = {
      ...activeDream,
      chatHistory: [...activeDream.chatHistory, userMessage]
    };
    setDreams(updatedDreams);

    try {
      // Get AI response
      const responseText = await sendDreamChat(
        activeDream.chatHistory, // Pass history BEFORE the new message (service handles appending if needed, or we append here)
        messageText,
        activeDream.analysis
      );

      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      // Update with bot response
      const finalDreams = [...updatedDreams];
      finalDreams[activeDreamIndex] = {
        ...finalDreams[activeDreamIndex],
        chatHistory: [...finalDreams[activeDreamIndex].chatHistory, botMessage]
      };
      setDreams(finalDreams);

    } catch (err) {
      console.error("Chat failed", err);
      // You might want to remove the user message or show an error state here
    } finally {
      setIsChatting(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDreams(prev => prev.filter(d => d.id !== id));
    if (selectedDreamId === id) {
      setSelectedDreamId(null);
    }
  };

  const activeDream = dreams.find(d => d.id === selectedDreamId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => {
              setSelectedDreamId(null);
              setCurrentView(ViewState.HOME);
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Moon className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              DreamWeaver
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedDreamId(null);
                setCurrentView(ViewState.HOME);
              }}
              className={`p-2 rounded-lg transition-colors ${currentView === ViewState.HOME && !selectedDreamId ? 'bg-slate-800 text-purple-400' : 'hover:bg-slate-800/50'}`}
              title="New Dream"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentView(ViewState.HISTORY)}
              className={`p-2 rounded-lg transition-colors ${currentView === ViewState.HISTORY ? 'bg-slate-800 text-purple-400' : 'hover:bg-slate-800/50'}`}
              title="Dream Journal"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* View Switching Logic */}
        
        {/* State 1: Input Form (Home View, No Dream Selected) */}
        {currentView === ViewState.HOME && !selectedDreamId && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Unlock the secrets of your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">subconscious</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Enter your dream below. AI will interpret the psychology behind it, visualize it, and let you chat with a Dream Guide.
              </p>
            </div>
            <DreamInput onAnalyze={handleAnalyze} isProcessing={isProcessing} />
          </div>
        )}

        {/* State 2: Active Dream Result */}
        {(selectedDreamId && activeDream) && (
          <DreamResult 
            dream={activeDream} 
            onSendChatMessage={handleSendChatMessage}
            isChatting={isChatting}
          />
        )}

        {/* State 3: History List */}
        {currentView === ViewState.HISTORY && (
          <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-bold text-slate-100">Dream Journal</h2>
               <span className="text-slate-500 text-sm">{dreams.length} entries</span>
             </div>
             <DreamHistory 
                dreams={dreams} 
                onSelectDream={(d) => {
                  setSelectedDreamId(d.id);
                  setCurrentView(ViewState.HOME); // Switch view to show detail
                }}
                onDeleteDream={handleDelete}
             />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
