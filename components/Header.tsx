"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Search, X } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title: string
  subtitle: string
  showProgress?: boolean
  progress?: number
  completedTasks?: number
  totalTasks?: number
  showEditDate?: boolean
  showThemeToggle?: boolean
  showBackButton?: boolean
  showSearch?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
}

export default function Header({
  title,
  subtitle,
  showProgress = false,
  progress = 0,
  completedTasks = 0,
  totalTasks = 0,
  showEditDate = false,
  showThemeToggle = false,
  showBackButton = false,
  showSearch = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Cari...",
}: HeaderProps) {
  const [isDark, setIsDark] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)
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

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-30 border-b border-transparent dark:border-slate-800">
      <div className="max-w-4xl mx-auto py-4 px-5">
        <div className="flex justify-between items-center w-full">
          {isSearching ? (
            <div className="flex items-center w-full py-1">
              <div className="flex items-center space-x-2.5 flex-grow py-1.5 px-3.5 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-all focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500">
                <Search className="w-4 h-4 text-gray-500 dark:text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-800 dark:text-slate-100 text-sm py-0.5"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onSearchChange?.("")
                    setIsSearching(false)
                  }}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
                  aria-label="Close Search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <img src="/logo-ss-umroh.jpg" alt="SS Umroh Logo" className="w-12 h-12 rounded-lg" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                    {title}
                  </h1>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {subtitle}
                      </p>
                      {showEditDate && (
                        <Link
                          href="/select-date"
                          className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
                        >
                          (Ubah)
                        </Link>
                      )}
                    </div>
                    {showBackButton && (
                      <Link
                        href="/select-date"
                        className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium mt-1 w-fit"
                      >
                        Kembali
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {showSearch && (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Search Itinerary"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
                {showThemeToggle && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Toggle Theme"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        {showProgress && !isSearching && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-violet-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-600 dark:text-slate-400 mt-1">
              {Math.round(progress)}% Selesai ({completedTasks} dari {totalTasks} aktivitas)
            </p>
          </div>
        )}
      </div>
    </header>
  )
}
