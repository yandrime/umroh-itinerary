"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedDate = localStorage.getItem("umroh_start_date")
      if (savedDate) {
        router.push("/itinerary")
      } else {
        router.push("/select-date")
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/logo-ss-umroh.jpg"
          alt="SS Umroh Logo"
          className="w-48 h-48 animate-bounce rounded-full shadow-lg border-4 border-violet-500/20"
        />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent animate-pulse">
          Umroh Itinerary
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Menyiapkan jadwal perjalanan ibadah Anda...
        </p>
      </div>
    </div>
  )
}
