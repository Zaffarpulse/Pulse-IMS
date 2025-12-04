
import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Save, CheckCircle, PenTool } from 'lucide-react';

const UploadSignature: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_signature');
    if (stored) setSignature(stored);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File size too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (signature) {
      localStorage.setItem('admin_signature', signature);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove the saved signature? Reports will revert to the default placeholder.')) {
      localStorage.removeItem('admin_signature');
      setSignature(null);
      setIsSaved(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Digital Signature</h1>
        <p className="text-slate-500 mt-2">Upload an authorized signature to be automatically included in all generated reports.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {signature ? (
            <div className="relative group w-full max-w-md">
              <div className="border-2 border-slate-200 border-dashed rounded-2xl p-8 bg-slate-50 flex items-center justify-center">
                <img src={signature} alt="Signature Preview" className="h-40 w-auto object-contain mix-blend-multiply" />
              </div>
              <button 
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-2.5 rounded-full shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Remove Signature"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-emerald-600 font-bold mt-3 bg-emerald-50 py-1 px-3 rounded-full inline-block w-full">
                Active Signature Preview
              </p>
            </div>
          ) : (
            <label className="w-full max-w-md h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-emerald-400 transition-all group">
              <div className="p-5 bg-slate-100 rounded-full mb-4 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-colors">
                <Upload className="w-10 h-10" />
              </div>
              <p className="text-base font-semibold text-slate-600 group-hover:text-emerald-700">Click to upload signature image</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Supports PNG, JPG (Transparent background recommended)</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}

          <div className="flex gap-4 pt-6 border-t border-slate-100 w-full justify-center">
             <button 
               onClick={handleSave} 
               disabled={!signature}
               className="flex items-center bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 text-sm"
             >
               {isSaved ? <CheckCircle className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
               {isSaved ? 'Signature Saved' : 'Save Signature'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
           <div className="mt-1 p-2 bg-blue-100 rounded-lg text-blue-600 h-fit"><CheckCircle className="w-5 h-5" /></div>
           <div>
              <h4 className="font-bold text-blue-900 text-sm">Automatic Integration</h4>
              <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">Once saved, this signature will appear on the footer of all Inventory Lists, POs, and Requisition reports automatically.</p>
           </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 flex gap-4">
           <div className="mt-1 p-2 bg-purple-100 rounded-lg text-purple-600 h-fit"><PenTool className="w-5 h-5" /></div>
           <div>
              <h4 className="font-bold text-purple-900 text-sm">Best Practices</h4>
              <p className="text-purple-700/80 text-xs mt-1 leading-relaxed">Use a high-contrast image with a white or transparent background. Crop the image tightly around the signature for best results.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSignature;
