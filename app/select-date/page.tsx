"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Sun, Moon } from "lucide-react"

export default function SelectDatePage() {
  const router = useRouter()
  const STORAGE_KEY = "umroh_start_date"
  const [isDark, setIsDark] = useState(true)
  const [selectedDate, setSelectedDate] = useState("2025-09-12")

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)

    const savedDate = localStorage.getItem(STORAGE_KEY)
    if (savedDate) {
      setSelectedDate(savedDate)
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleSelectPreset = (date: string) => {
    localStorage.setItem(STORAGE_KEY, date)
    setSelectedDate(date)
    router.push("/itinerary")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 relative">
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 mb-4">
            <img
              src="/logo-ss-umroh.jpg"
              alt="SS Umroh Logo"
              className="w-full h-full rounded-2xl shadow-md border-2 border-violet-500/10"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">
            Pilih Tanggal Umroh
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Pilih jadwal keberangkatan untuk melihat rencana perjalanan ibadah Anda.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 pt-4">
          
          {/* Card 1: Preset 1 (2025) */}
          <button
            onClick={() => handleSelectPreset("2025-09-12")}
            className={`w-full text-left p-5 rounded-xl border-2 flex items-start space-x-4 transition-all focus:outline-none ${
              selectedDate === "2025-09-12"
                ? "border-violet-600 bg-violet-50/50 dark:border-violet-500 dark:bg-violet-900/10"
                : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-400 dark:hover:border-violet-600"
            }`}
          >
            <div className="bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 p-3 rounded-lg mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-grow">
              <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full mb-1">
                Jadwal Utama
              </span>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-snug">
                12 Sep 2025 - 23 Sep 2025
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Gunakan jadwal eksisting 12 hari perjalanan dari Bandung ke Tanah Suci.
              </p>
            </div>
          </button>

          {/* Card 2: Preset 2 (2026) */}
          <button
            onClick={() => handleSelectPreset("2026-06-15")}
            className={`w-full text-left p-5 rounded-xl border-2 flex items-start space-x-4 transition-all focus:outline-none ${
              selectedDate === "2026-06-15"
                ? "border-violet-600 bg-violet-50/50 dark:border-violet-500 dark:bg-violet-900/10"
                : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-400 dark:hover:border-violet-600"
            }`}
          >
            <div className="bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 p-3 rounded-lg mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-grow">
              <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full mb-1">
                Jadwal Baru
              </span>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-snug">
                15 Jun 2026 - 23 Jun 2026
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Gunakan jadwal perjalanan baru 9 hari dari Bandung ke Tanah Suci.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Preferensi Anda akan disimpan secara lokal di perangkat ini.
          </p>
        </div>
      </div>
    </div>
  )
}
