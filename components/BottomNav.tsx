"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Navigation, BookOpen } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()

  const isItineraryActive = pathname === "/itinerary"
  const isStepsActive = pathname === "/steps"
  const isDoaActive = pathname === "/doa"

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 z-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex">
          <Link
            href="/itinerary"
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
              isItineraryActive
                ? "text-violet-600 dark:text-violet-400 border-t-2 border-violet-600 dark:border-violet-400"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Itinerary</span>
          </Link>
          <Link
            href="/steps"
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
              isStepsActive
                ? "text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-600 dark:border-emerald-400"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="font-medium">Steps</span>
          </Link>
          <Link
            href="/doa"
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
              isDoaActive
                ? "text-amber-600 dark:text-amber-400 border-t-2 border-amber-600 dark:border-amber-400"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Doa</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
