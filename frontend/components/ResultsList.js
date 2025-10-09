
export default function ResultsList({ results }) {
  return (
    <div className="space-y-4">
      {results.map((res, idx) => (
        <div 
          key={idx} 
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-violet-500 transition-all duration-300"
        >
          <p className="text-slate-200 text-lg mb-3 leading-relaxed">{res.text}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Timestamp:</span>
            <span className="text-violet-400 font-mono font-medium">
              {res.start_time} → {res.end_time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}