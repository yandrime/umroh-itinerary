"use client"

import { useState } from "react"
import { BookOpen, Search } from "lucide-react"

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
}

export default function DoaPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter prayers based on search query
  const getFilteredPrayers = () => {
    if (!searchQuery.trim()) return prayersData as Prayer[]
    const query = searchQuery.toLowerCase().trim()
    return (prayersData as Prayer[]).filter((doa) => 
      doa.title?.toLowerCase().includes(query) ||
      doa.notes?.toLowerCase().includes(query) ||
      doa.arabic?.toLowerCase().includes(query) ||
      doa.transliteration?.toLowerCase().includes(query) ||
      doa.translation?.toLowerCase().includes(query)
    )
  };

  const filteredPrayers = getFilteredPrayers()

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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">Tidak ada hasil ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 px-4">
              Coba cari dengan kata kunci lain seperti nama rukun (Thawaf, Sa'i), penggalan lafadz, atau arti doa.
            </p>
          </div>
        ) : (
          filteredPrayers.map((doa: Prayer) => (
            <div
              key={doa.id}
              className="group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-amber-950/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.01] hover:border-amber-300 dark:hover:border-amber-800/60 space-y-3"
            >
              {/* Doa Title */}
              <div className="flex items-start space-x-3 border-b border-gray-100 dark:border-slate-700/50 pb-2.5">
                <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 p-2 rounded-lg mt-0.5 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-slate-200 text-base leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {doa.title}
                  </h3>
                  {doa.notes && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      💡 {doa.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Doa Body */}
              <div className="space-y-3 pt-1">
                {/* Arabic */}
                <p
                  className="text-right text-2xl leading-relaxed text-gray-800 dark:text-slate-100 font-arabic py-2 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                  dir="rtl"
                >
                  {doa.arabic}
                </p>

                {/* Latin/Transliteration */}
                {doa.transliteration && (
                  <p className="text-sm text-gray-600 dark:text-slate-400 italic bg-gray-50 dark:bg-slate-900/30 p-2.5 rounded-lg border-l-2 border-amber-400 group-hover:border-amber-500 transition-colors duration-300">
                    <strong>Bacaan:</strong> {doa.transliteration}
                  </p>
                )}

                {/* Translation */}
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  <strong>Artinya:</strong> {doa.translation}
                </p>
              </div>
            </div>
          ))
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
