"use client"

import { useState, useEffect } from "react"
import {
  Package,
  Send,
  Moon,
  BookOpen,
  ArrowRightCircle,
  Compass,
  MapPin,
  Star,
  ChevronsLeft,
  Home,
  ChevronDown,
  Check,
  FileText,
  X,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react"

import itinerary12092025 from "../../data/itinerary-12092025-23092025.json"
import itinerary15062026 from "../../data/itinerary-15062026-23062026.json"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"

const iconMap = {
  package: Package,
  send: Send,
  moon: Moon,
  "book-open": BookOpen,
  "arrow-right-circle": ArrowRightCircle,
  compass: Compass,
  "map-pin": MapPin,
  star: Star,
  "chevrons-left": ChevronsLeft,
  home: Home,
}

interface Task {
  time: string
  description: string
  completed: boolean
  note: string
}

interface Day {
  day: string
  title: string
  icon: string
  tasks: Task[]
}

const parseLocalDate = (dateStr: string) => {
  const parts = dateStr.split("-")
  if (parts.length !== 3) return new Date(dateStr)
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  return new Date(year, month, day)
}

const getFormattedDate = (startDateStr: string, dayLabel: string) => {
  if (dayLabel === "Pra-Keberangkatan") return "Persiapan"
  
  const match = dayLabel.match(/Hari\s+(\d+)/i)
  if (!match) return ""
  
  const dayNum = parseInt(match[1], 10)
  const date = parseLocalDate(startDateStr)
  if (isNaN(date.getTime())) return ""
  
  date.setDate(date.getDate() + (dayNum - 1))
  
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
  
  const dayName = dayNames[date.getDay()]
  const dayOfMonth = date.getDate()
  const monthName = monthNames[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName}, ${dayOfMonth} ${monthName} ${year}`
}

const getHeaderSubtitle = (startDateStr: string) => {
  const start = parseLocalDate(startDateStr)
  if (isNaN(start.getTime())) return "Antapani, Bandung"
  
  const end = new Date(start)
  const is2026 = startDateStr === "2026-06-15"
  const offsetDays = is2026 ? 8 : 11 // 15 Jun to 23 Jun is 9 days (offset +8), 12 Sep to 23 Sep is 12 days (offset +11)
  end.setDate(end.getDate() + offsetDays)
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
  
  const startDay = start.getDate()
  const startMonth = monthNames[start.getMonth()]
  const startYear = start.getFullYear()
  
  const endDay = end.getDate()
  const endMonth = monthNames[end.getMonth()]
  const endYear = end.getFullYear()
  
  return `Jadwal: ${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`
}

export default function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState<Day[]>([])
  const [startDate, setStartDate] = useState("2025-09-12")
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]))
  const [showModal, setShowModal] = useState(false)
  const [currentNote, setCurrentNote] = useState({ dayIndex: -1, taskIndex: -1 })
  const [noteText, setNoteText] = useState("")
  const [noteFontSize, setNoteFontSize] = useState(16)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter itinerary data based on search query
  const getFilteredItinerary = () => {
    if (!searchQuery.trim()) {
      return itineraryData.map((day, dIdx) => ({
        ...day,
        originalIndex: dIdx,
        tasks: day.tasks.map((task, tIdx) => ({ ...task, originalIndex: tIdx }))
      }));
    }
    
    const query = searchQuery.toLowerCase().trim();
    return itineraryData.map((day, dIdx) => {
      const dayMatches = 
        day.title.toLowerCase().includes(query) || 
        day.day.toLowerCase().includes(query) ||
        (getFormattedDate(startDate, day.day) || "").toLowerCase().includes(query);
      
      const tasksWithIndex = day.tasks.map((task, tIdx) => ({ ...task, originalIndex: tIdx }));
      const filteredTasks = tasksWithIndex.filter((task) => 
        task.description.toLowerCase().includes(query) || 
        task.time.toLowerCase().includes(query) ||
        (task.note && task.note.toLowerCase().includes(query))
      );
      
      if (dayMatches) {
        return {
          ...day,
          originalIndex: dIdx,
          tasks: tasksWithIndex
        };
      } else if (filteredTasks.length > 0) {
        return {
          ...day,
          originalIndex: dIdx,
          tasks: filteredTasks
        };
      }
      return null;
    }).filter(Boolean) as (Omit<Day, "tasks"> & {
      originalIndex: number;
      tasks: (Task & { originalIndex: number })[];
    })[];
  };

  const filteredItinerary = getFilteredItinerary();

  const STORAGE_KEY = "umrohItineraryAYFamily_v4"

  useEffect(() => {
    // Load data from localStorage or use default based on start date
    const savedStartDate = localStorage.getItem("umroh_start_date") || "2025-09-12"
    setStartDate(savedStartDate)

    const is2026 = savedStartDate === "2026-06-15"
    const activeDefaultData = is2026 ? itinerary15062026 : itinerary12092025
    const storageKey = `${STORAGE_KEY}_${savedStartDate}`

    const savedData = localStorage.getItem(storageKey)
    if (savedData) {
      try {
        setItineraryData(JSON.parse(savedData))
      } catch (e) {
        console.error("Could not parse saved data, using default.", e)
        const initialData = activeDefaultData.map((day) => ({
          ...day,
          tasks: day.tasks.map((task) => ({ ...task, completed: false, note: "" })),
        }))
        setItineraryData(initialData)
      }
    } else {
      const initialData = activeDefaultData.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => ({ ...task, completed: false, note: "" })),
      }))
      setItineraryData(initialData)
    }
  }, [])

  const saveItinerary = (data: Day[]) => {
    const savedStartDate = localStorage.getItem("umroh_start_date") || "2025-09-12"
    localStorage.setItem(`${STORAGE_KEY}_${savedStartDate}`, JSON.stringify(data))
  }

  const toggleTask = (dayIndex: number, taskIndex: number) => {
    const newData = [...itineraryData]
    newData[dayIndex].tasks[taskIndex].completed = !newData[dayIndex].tasks[taskIndex].completed
    setItineraryData(newData)
    saveItinerary(newData)
  }

  const toggleDay = (dayIndex: number) => {
    const newOpenDays = new Set(openDays)
    if (newOpenDays.has(dayIndex)) {
      newOpenDays.delete(dayIndex)
    } else {
      newOpenDays.add(dayIndex)
    }
    setOpenDays(newOpenDays)
  }

  const openNoteModal = (dayIndex: number, taskIndex: number) => {
    setCurrentNote({ dayIndex, taskIndex })
    setNoteText(itineraryData[dayIndex]?.tasks?.[taskIndex]?.note || "")
    setShowModal(true)
  }

  const saveNote = () => {
    if (!itineraryData || !itineraryData[currentNote.dayIndex]?.tasks?.[currentNote.taskIndex]) return
    const newData = [...itineraryData]
    newData[currentNote.dayIndex].tasks[currentNote.taskIndex].note = noteText
    setItineraryData(newData)
    saveItinerary(newData)
    setShowModal(false)
  }

  const calculateProgress = () => {
    if (!itineraryData || !Array.isArray(itineraryData)) return 0
    const allTasks = itineraryData.flatMap((day) => day?.tasks || [])
    const completedTasks = allTasks.filter((task) => task?.completed).length
    const totalTasks = allTasks.length
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }

  const progress = calculateProgress()
  const allTasks = (itineraryData && Array.isArray(itineraryData)) ? itineraryData.flatMap((day) => day?.tasks || []) : []
  const completedTasks = allTasks.filter((task) => task?.completed).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <Header
        title="Umroh Itinerary"
        subtitle={getHeaderSubtitle(startDate)}
        showProgress={true}
        progress={progress}
        completedTasks={completedTasks}
        totalTasks={allTasks.length}
        showEditDate={false}
        showBackButton={true}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari itinerary..."
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {filteredItinerary.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">Tidak ada hasil ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 px-4">
              Coba cari dengan kata kunci lain seperti nama kota, jenis aktivitas, doa, atau catatan.
            </p>
          </div>
        ) : (
          filteredItinerary.map((day) => {
            const dayIndex = day.originalIndex
            const IconComponent = iconMap[day.icon as keyof typeof iconMap] || Package
            const isOpen = searchQuery.trim() !== "" ? true : openDays.has(dayIndex)
            const formattedDate = getFormattedDate(startDate, day.day)

            return (
              <div key={dayIndex} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                {/* Day Header */}
                <div
                  className="p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-300"
                  onClick={() => toggleDay(dayIndex)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 p-3 rounded-lg">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {day.day.toUpperCase()} {formattedDate && `• ${formattedDate}`}
                      </p>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">{day.title}</h2>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Day Content */}
                <div
                  className={`px-4 md:px-6 overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] py-4" : "max-h-0"}`}
                >
                  <div className="relative space-y-4">
                    {day.tasks.map((task, idx) => {
                      const taskIndex = task.originalIndex
                      return (
                        <div key={taskIndex} className="group flex items-start w-full space-x-4 p-1.5 -mx-1.5 rounded-xl transition-colors duration-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/10">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            id={`task-${dayIndex}-${taskIndex}`}
                            className="hidden"
                            checked={task.completed}
                            onChange={() => toggleTask(dayIndex, taskIndex)}
                          />
                          <label
                            htmlFor={`task-${dayIndex}-${taskIndex}`}
                            className="flex items-start cursor-pointer flex-grow"
                          >
                            <div className="flex flex-col items-center mr-4">
                              <div
                                className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-115 ${
                                  task.completed
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-gray-300 dark:border-slate-600 group-hover:border-violet-400"
                                }`}
                              >
                                <Check className="w-4 h-4" />
                              </div>
                              {idx < day.tasks.length - 1 && (
                                <div className="w-0.5 h-12 bg-gray-200 dark:bg-slate-700" />
                              )}
                            </div>
                            <div className="flex-grow pt-1 transition-transform duration-300 group-hover:translate-x-1">
                              <p className="font-semibold text-gray-500 dark:text-slate-400 text-sm">{task.time}</p>
                              <p
                                className={`transition-colors duration-300 ${
                                  task.completed
                                    ? "text-gray-400 dark:text-slate-500 line-through"
                                    : "text-gray-800 dark:text-slate-300 group-hover:text-violet-900 dark:group-hover:text-violet-200"
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>
                          </label>
                          <button
                            onClick={() => openNoteModal(dayIndex, taskIndex)}
                            className="flex-shrink-0 mt-1 p-2 text-gray-400 hover:text-violet-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </main>

      <BottomNav />

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-xs text-gray-400 dark:text-slate-500">Semoga menjadi umroh yang mabrur. Aamiin.</p>
      </footer>

      {/* Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl transform transition-transform duration-300 ${
              isFullscreen ? "w-full h-full max-w-full max-h-full rounded-none flex flex-col" : "w-full max-w-lg"
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Tambah/Ubah Catatan</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {currentNote.dayIndex >= 0 && currentNote.taskIndex >= 0
                    ? itineraryData[currentNote.dayIndex]?.tasks[currentNote.taskIndex]?.description
                    : ""}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Toolbar */}
            <div className="px-5 py-2 border-b border-gray-200 dark:border-slate-700 flex items-center justify-end space-x-2 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={() => setNoteFontSize(Math.max(10, noteFontSize - 2))}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
                title="Perkecil Huruf"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 dark:text-slate-300 w-8 text-center">{noteFontSize}px</span>
              <button
                onClick={() => setNoteFontSize(Math.min(32, noteFontSize + 2))}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
                title="Perbesar Huruf"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="border-l border-gray-300 dark:border-slate-600 h-5 mx-2" />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
                title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Modal Body */}
            <div className={`p-5 ${isFullscreen ? "flex-grow" : ""}`}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 border-gray-300 dark:border-slate-600 ${
                  isFullscreen ? "h-full" : "h-32"
                }`}
                style={{ fontSize: `${noteFontSize}px` }}
                placeholder="Tulis catatan, pengingat, atau doa khusus untuk aktivitas ini..."
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Batal
              </button>
              <button
                onClick={saveNote}
                className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold text-sm"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
