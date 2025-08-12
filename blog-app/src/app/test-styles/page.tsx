export default function TestStyles() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Tailwind Test</h1>
      <div className="w-32 h-32 bg-red-500 rounded-lg mb-4"></div>
      <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      <div className="mt-4 p-4 bg-green-600 rounded shadow-lg">
        <p className="text-lg">If you can see blue background, red square, yellow circle, and green box with shadow, Tailwind is working!</p>
      </div>
    </div>
  )
}
