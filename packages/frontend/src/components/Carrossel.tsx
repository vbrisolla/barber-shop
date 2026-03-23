import { useState } from 'react';

const imagens = [
  '/barbearia1.jpg',
  '/barbearia2.jpg',
  '/barbearia3.jpg',
  '/barbearia4.jpg',
  '/barbearia5.jpg',
];

export default function Carrossel() {
  const [atual, setAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);

  function anterior() {
    setAtual((c) => (c === 0 ? imagens.length - 1 : c - 1));
  }

  function proximo() {
    setAtual((c) => (c === imagens.length - 1 ? 0 : c + 1));
  }

  return (
    <>
      <div className="relative w-full max-w-3xl mx-auto">
        <div
          className="overflow-hidden rounded-xl shadow-lg cursor-zoom-in"
          onClick={() => setModalAberto(true)}
        >
          <img
            src={imagens[atual]}
            alt={`Barbearia foto ${atual + 1}`}
            className="w-full max-h-[450px] object-contain transition-all duration-500"
          />
        </div>

       <button
        onClick={(e) => { e.stopPropagation(); anterior(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        </button>

       <button
        onClick={(e) => { e.stopPropagation(); proximo(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {imagens.map((_, i) => (
            <button
              key={i}
              onClick={() => setAtual(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === atual ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <button
            onClick={() => setModalAberto(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
          >
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); anterior(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
           </button>
          <img
            src={imagens[atual]}
            alt={`Barbearia foto ${atual + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); proximo(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
           </button>
        </div>
      )}
    </>
  );
}