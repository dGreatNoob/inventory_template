export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] w-full">
      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></span>
      <span className="ml-4 text-lg">Loading...</span>
    </div>
  )
} 