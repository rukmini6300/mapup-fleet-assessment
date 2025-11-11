export default function ControlPanel({ isPlaying, setIsPlaying, speed, setSpeed }) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <label className="text-gray-700 font-medium">
        Speed:
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="ml-2 border rounded p-1"
        >
          <option value={1}>1x</option>
          <option value={5}>5x</option>
          <option value={10}>10x</option>
        </select>
      </label>
    </div>
  );
}
