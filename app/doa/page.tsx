"use client"

import { useState, useEffect, useRef } from "react"
import { BookOpen, Search, Check } from "lucide-react"

import prayersData from "../../data/prayers.json"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"

interface Prayer {
  id: string
  title: string
  notes?: string
  arabic: string
  transliteration?: string
  translation: string
  source?: string
}

export default function DoaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const [displaySettings, setDisplaySettings] = useState({
    notes: true,
    arabic: true,
    latin: false,
    translation: true,
    source: true,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("doaDisplaySettings")
    if (saved) {
      try {
        setDisplaySettings(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const toggleSetting = (key: keyof typeof displaySettings) => {
    const updated = {
      ...displaySettings,
      [key]: !displaySettings[key]
    }
    setDisplaySettings(updated)
    localStorage.setItem("doaDisplaySettings", JSON.stringify(updated))
  }

  // Filter prayers based on search query
  const getFilteredPrayers = () => {
    if (!searchQuery.trim()) return prayersData as Prayer[]
    const query = searchQuery.toLowerCase().trim()
    return (prayersData as Prayer[]).filter((doa) => 
      doa.title?.toLowerCase().includes(query) ||
      doa.notes?.toLowerCase().includes(query) ||
      doa.arabic?.toLowerCase().includes(query) ||
      doa.transliteration?.toLowerCase().includes(query) ||
      doa.translation?.toLowerCase().includes(query) ||
      doa.source?.toLowerCase().includes(query)
    )
  };

  const filteredPrayers = getFilteredPrayers()
  const displayedPrayers = filteredPrayers.slice(0, visibleCount)

  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(10)
  }, [searchQuery])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPrayers.length) {
          setVisibleCount((prev) => prev + 10)
        }
      },
      { rootMargin: "100px" }
    )

    const currentTarget = observerRef.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [visibleCount, filteredPrayers.length])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <Header
        title="Kumpulan Doa"
        subtitle="Doa & Dzikir Ibadah Umroh"
        showBackButton={true}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari doa..."
      />

      {/* Settings Panel (Sticky) */}
      <div className="sticky top-[80px] z-20 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-sm py-2.5 border-b border-gray-200/50 dark:border-slate-800/40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-slate-700/50">
            <div className="flex flex-nowrap overflow-x-auto gap-2 pb-0.5 scrollbar-none -mx-1 px-1">
              {[
                { key: "notes", label: "Catatan", icon: "💡" },
                { key: "arabic", label: "Arab", icon: "🕌" },
                { key: "latin", label: "Latin", icon: "📖" },
                { key: "translation", label: "Arti", icon: "📝" },
                { key: "source", label: "Sumber", icon: "📚" }
              ].map((setting) => {
                const isActive = displaySettings[setting.key as keyof typeof displaySettings];
                return (
                  <button
                    key={setting.key}
                    onClick={() => toggleSetting(setting.key as keyof typeof displaySettings)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 transform active:scale-95 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300 shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-400 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-900/80"
                    }`}
                  >
                    <span>{setting.icon}</span>
                    <span className="whitespace-nowrap">{setting.label}</span>
                    {isActive && <Check className="w-3 h-3 ml-0.5 text-amber-600 dark:text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-3">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">Tidak ada hasil ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 px-4">
              Coba cari dengan kata kunci lain seperti nama rukun (Thawaf, Sa'i), penggalan lafadz, atau arti doa.
            </p>
          </div>
        ) : (
          <>
            {displayedPrayers.map((doa: Prayer) => (
              <div
                key={doa.id}
                className="group bg-white dark:bg-slate-800 rounded-xl p-3.5 md:p-4 shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-amber-950/30 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-[1.005] hover:border-amber-300 dark:hover:border-amber-800/60 space-y-2.5"
              >
                {/* Doa Title (Wajib muncul) */}
                <div className="flex items-center space-x-2.5 border-b border-gray-100 dark:border-slate-700/50 pb-2">
                  <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 p-1.5 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 group-hover:scale-105 transition-all duration-300 shrink-0">
                    <BookOpen className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm md:text-base leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {doa.title}
                    </h3>
                  </div>
                </div>

                {/* Doa Body */}
                {(displaySettings.arabic || displaySettings.latin || displaySettings.translation || displaySettings.source || displaySettings.notes) && (
                  <div className="space-y-2 pt-0.5">
                    {/* Arabic */}
                    {displaySettings.arabic && (
                      <p
                        className="text-right text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-slate-100 font-arabic py-1 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                        dir="rtl"
                      >
                        {doa.arabic}
                      </p>
                    )}

                    {/* Latin/Transliteration */}
                    {displaySettings.latin && doa.transliteration && (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 italic bg-gray-50/50 dark:bg-slate-900/20 p-2 rounded-lg border-l-2 border-amber-400 group-hover:border-amber-500 transition-colors duration-300">
                        <strong>Bacaan:</strong> {doa.transliteration}
                      </p>
                    )}

                    {/* Translation */}
                    {displaySettings.translation && (
                      <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                        <strong>Artinya:</strong> {doa.translation}
                      </p>
                    )}

                    {/* Source/Sumber */}
                    {displaySettings.source && doa.source && (
                      <div className="flex items-center justify-end pt-1.5 border-t border-dashed border-gray-100 dark:border-slate-700/50 mt-0.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                          Sumber: {doa.source}
                        </span>
                      </div>
                    )}

                    {/* Catatan (Di bawah sumber) */}
                    {displaySettings.notes && doa.notes && (
                      <div className="mt-2 p-2 bg-amber-50/30 dark:bg-amber-950/10 rounded-lg border-l-2 border-amber-400/40 text-[11px] md:text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                        <span className="font-semibold text-amber-800 dark:text-amber-300">Catatan:</span> {doa.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Infinite Scroll Loader Target */}
            <div
              ref={observerRef}
              className={`flex items-center justify-center py-4 transition-all duration-300 ${
                visibleCount < filteredPrayers.length ? "opacity-100 h-16" : "opacity-0 h-0 py-0 overflow-hidden"
              }`}
            >
              <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 px-4 py-2 rounded-full shadow-sm">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Memuat doa lainnya...
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav />

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-xs text-gray-400 dark:text-slate-500">
          Semoga menjadi umroh yang mabrur. Aamiin.
        </p>
      </footer>
    </div>
  )
}
