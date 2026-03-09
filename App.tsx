
import React, { useState, useRef, useCallback } from 'react';
import { PRESETS } from './constants';
import { editProductImage } from './services/gemini';
import { GenerationState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    originalImage: null,
    editedImage: null,
    history: []
  });

  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target?.result as string;
        setState(prev => ({
          ...prev,
          originalImage: result,
          editedImage: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!state.originalImage) {
      setState(prev => ({ ...prev, error: "يرجى رفع صورة المنتج أولاً" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const preset = PRESETS.find(p => p.id === selectedPreset);
      const prompt = customPrompt || (preset?.prompt ?? '');
      
      const editedBase64 = await editProductImage(state.originalImage, prompt);
      
      setState(prev => ({
        ...prev,
        editedImage: editedBase64,
        isLoading: false,
        history: [{ original: prev.originalImage!, edited: editedBase64 }, ...prev.history].slice(0, 5)
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى."
      }));
    }
  };

  const downloadImage = () => {
    if (state.editedImage) {
      const link = document.createElement('a');
      link.href = state.editedImage;
      link.download = `edited-product-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="py-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          محترف تصوير المنتجات AI
        </h1>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
          حول صور منتجاتك العادية إلى لقطات احترافية عالمية بضغطة زر واحدة. اختر النمط الذي يناسب علامتك التجارية ودع الذكاء الاصطناعي يقوم بالسحر.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">1</span>
              رفع صورة المنتج
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${state.originalImage ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700 hover:border-blue-500 hover:bg-blue-500/5'}
              `}
            >
              {state.originalImage ? (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden group">
                  <img src={state.originalImage} alt="Original" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-sm font-medium">تغيير الصورة</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl">📸</div>
                  <p className="text-sm text-slate-400">اسحب الصورة هنا أو اضغط للاختيار</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">2</span>
              اختر نمط التعديل
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    setCustomPrompt('');
                  }}
                  className={`p-3 rounded-xl border text-right transition-all
                    ${selectedPreset === preset.id 
                      ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}
                  `}
                >
                  <div className="text-xl mb-1">{preset.icon}</div>
                  <div className="font-semibold text-sm">{preset.name}</div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-500 block">أو اكتب وصفاً مخصصاً (باللغة الإنجليزية):</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Place on a vintage coffee shop table..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
              />
            </div>
          </div>

          <button
            onClick={handleProcessImage}
            disabled={state.isLoading || !state.originalImage}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all
              ${state.isLoading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/20 shadow-xl'}
            `}
          >
            {state.isLoading ? 'جاري السحر... ✨' : 'تعديل الصورة الآن'}
          </button>

          {state.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-center text-sm">
              {state.error}
            </div>
          )}
        </div>

        {/* Right Side: Preview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-2 rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center justify-center bg-slate-900/40">
            {!state.originalImage && !state.isLoading && (
              <div className="text-center p-12 space-y-4">
                <div className="text-6xl opacity-20">🎨</div>
                <h3 className="text-2xl font-bold opacity-30">معاينة النتيجة</h3>
                <p className="text-slate-500">ارفع صورة المنتج وابدأ الإبداع</p>
              </div>
            )}

            {state.isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-6 bg-slate-900/60 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold mb-2 animate-pulse">جاري التصميم...</p>
                  <p className="text-sm text-slate-400">الذكاء الاصطناعي يقوم الآن بضبط الإضاءة والخلفية</p>
                </div>
              </div>
            )}

            {state.editedImage && (
              <div className="w-full h-full p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <span className="text-xs font-semibold text-slate-500 px-3 uppercase tracking-wider">الأصلية</span>
                     <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner aspect-[4/5] md:aspect-square">
                        <img src={state.originalImage!} alt="Original" className="w-full h-full object-contain bg-black/20" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <span className="text-xs font-semibold text-purple-400 px-3 uppercase tracking-wider">النتيجة الاحترافية</span>
                     <div className="rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10 aspect-[4/5] md:aspect-square">
                        <img src={state.editedImage} alt="Edited" className="w-full h-full object-contain" />
                     </div>
                   </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <button
                    onClick={downloadImage}
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تحميل الصورة عالية الدقة
                  </button>
                </div>
              </div>
            )}
            
            {state.originalImage && !state.editedImage && !state.isLoading && (
              <div className="text-center p-8">
                 <img src={state.originalImage} alt="Uploaded" className="max-h-[500px] rounded-2xl shadow-lg border border-slate-800 opacity-50 grayscale-[0.5]" />
                 <p className="mt-6 text-blue-400 animate-bounce">اضغط على "تعديل الصورة" للبدء!</p>
              </div>
            )}
          </div>

          {/* Tips / Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-xl">✓</div>
              <div>
                <h4 className="font-bold text-sm">جودة فائقة</h4>
                <p className="text-xs text-slate-500">نتائج بدقة 4K للمطبوعات</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center text-xl">⚡</div>
              <div>
                <h4 className="font-bold text-sm">سرعة البرق</h4>
                <p className="text-xs text-slate-500">تعديل كامل في ثوانٍ معدودة</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-xl">🎯</div>
              <div>
                <h4 className="font-bold text-sm">ذكاء بصري</h4>
                <p className="text-xs text-slate-500">تحليل تلقائي للإضاءة والظلال</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* History Bar (Optional) */}
      {state.history.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 p-4 z-50">
          <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">السجل الأخير:</span>
            {state.history.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setState(prev => ({ ...prev, originalImage: item.original, editedImage: item.edited }))}
                className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 hover:border-blue-500 transition-colors"
              >
                <img src={item.edited} className="w-full h-full object-cover" alt="History" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
