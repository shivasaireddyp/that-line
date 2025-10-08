export default function ResultsList({ results }) {
  return (
    <div>
          <p className="fond-bold">Check these out!</p>
          {results.map((res, idx) => (
            <div key={idx} className="bg-white p-3 rounded shadow mb-2">
              <p>{res.text}</p>
              <p>
                Time Stamp: {res.start_time} → {res.end_time}
              </p>
            </div>
          ))}
    </div>
  );
}