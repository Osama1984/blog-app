export default function TestPage() {
  return (
    <div className="p-8 bg-red-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Tailwind Test</h1>
      <p className="text-lg mb-4">This text should be white on red background</p>
      <div className="bg-blue-500 p-4 rounded-lg">
        <p className="text-yellow-300">This should be yellow text on blue background</p>
      </div>
      <div className="mt-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300">
          Hover Test Button
        </button>
      </div>
      <div className="mt-4 animate-bounce">
        <p>This should bounce (animation test)</p>
      </div>
    </div>
  )
}
