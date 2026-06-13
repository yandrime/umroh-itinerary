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
  Sun,
  Calendar,
  Navigation,
} from "lucide-react"

import defaultItineraryData from "../data/itinerary.json"
import umrohStepsData from "../data/umroh-steps.json"

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

interface Prayer {
  prayer_title?: string
  notes?: string
  arabic: string
  transliteration?: string
  translation: string
}

interface SubStep {
  title: string
  notes?: string
  prayer: Prayer
}

interface Step {
  step_id: string
  step_title: string
  details?: string[]
  notes?: string
  prayers?: Prayer[]
  sub_steps?: SubStep[]
  post_action?: string
}

interface Stage {
  stage_id: string
  stage_title: string
  steps: Step[]
}

export default function UmrahItinerary() {
  const [itineraryData, setItineraryData] = useState<Day[]>([])
  const [showSplash, setShowSplash] = useState(true)
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]))
  const [showModal, setShowModal] = useState(false)
  const [currentNote, setCurrentNote] = useState({ dayIndex: -1, taskIndex: -1 })
  const [noteText, setNoteText] = useState("")
  const [noteFontSize, setNoteFontSize] = useState(16)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<"itinerary" | "steps">("itinerary")
  const [openStages, setOpenStages] = useState<Set<number>>(new Set([0]))

  const STORAGE_KEY = "umrohItineraryAYFamily_v4"

  useEffect(() => {
    // Load data from localStorage or use default
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        setItineraryData(JSON.parse(savedData))
      } catch (e) {
        console.error("Could not parse saved data, using default.", e)
        const initialData = defaultItineraryData.map((day) => ({
          ...day,
          tasks: day.tasks.map((task) => ({ ...task, completed: false, note: "" })),
        }))
        setItineraryData(initialData)
      }
    } else {
      const initialData = defaultItineraryData.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => ({ ...task, completed: false, note: "" })),
      }))
      setItineraryData(initialData)
    }

    // Check for dark mode preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }

    // Hide splash screen after 2.5 seconds
    setTimeout(() => {
      setShowSplash(false)
    }, 2500)
  }, [])

  const saveItinerary = (data: Day[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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

  const toggleStage = (stageIndex: number) => {
    const newOpenStages = new Set(openStages)
    if (newOpenStages.has(stageIndex)) {
      newOpenStages.delete(stageIndex)
    } else {
      newOpenStages.add(stageIndex)
    }
    setOpenStages(newOpenStages)
  }

  const openNoteModal = (dayIndex: number, taskIndex: number) => {
    setCurrentNote({ dayIndex, taskIndex })
    setNoteText(itineraryData[dayIndex].tasks[taskIndex].note || "")
    setShowModal(true)
  }

  const saveNote = () => {
    const newData = [...itineraryData]
    newData[currentNote.dayIndex].tasks[currentNote.taskIndex].note = noteText
    setItineraryData(newData)
    saveItinerary(newData)
    setShowModal(false)
  }

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

  const calculateProgress = () => {
    const allTasks = itineraryData.flatMap((day) => day.tasks)
    const completedTasks = allTasks.filter((task) => task.completed).length
    const totalTasks = allTasks.length
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }

  const progress = calculateProgress()
  const allTasks = itineraryData.flatMap((day) => day.tasks)
  const completedTasks = allTasks.filter((task) => task.completed).length

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center">
        <img src="/logo-ss-umroh.jpg" alt="SS Umroh Logo" className="w-48 animate-bounce rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-transparent dark:border-slate-800">
        <div className="max-w-4xl mx-auto py-4 px-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/logo-ss-umroh.jpg" alt="SS Umroh Logo" className="w-12 h-12 rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                  {activeTab === "itinerary" ? "Itinerary Umroh AY" : "Panduan Umroh AY"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {activeTab === "itinerary" ? "Dari: Antapani, Bandung, Indonesia" : "Tata Cara Pelaksanaan Umroh"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          {activeTab === "itinerary" && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-violet-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-600 dark:text-slate-400 mt-1">
                {Math.round(progress)}% Selesai ({completedTasks} dari {allTasks.length} aktivitas)
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {activeTab === "itinerary"
          ? // Itinerary Content
            itineraryData.map((day, dayIndex) => {
              const IconComponent = iconMap[day.icon as keyof typeof iconMap] || Package
              const isOpen = openDays.has(dayIndex)

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
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{day.day.toUpperCase()}</p>
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
                      {day.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start w-full space-x-4">
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
                                className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${
                                  task.completed
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-gray-300 dark:border-slate-600"
                                }`}
                              >
                                <Check className="w-4 h-4" />
                              </div>
                              {taskIndex < day.tasks.length - 1 && (
                                <div className="w-0.5 h-12 bg-gray-200 dark:bg-slate-700" />
                              )}
                            </div>
                            <div className="flex-grow pt-1">
                              <p className="font-semibold text-gray-500 dark:text-slate-400 text-sm">{task.time}</p>
                              <p
                                className={`transition-colors duration-300 ${
                                  task.completed
                                    ? "text-gray-400 dark:text-slate-500 line-through"
                                    : "text-gray-800 dark:text-slate-300"
                                }`}
                              >
                                {task.description}
                              </p>
                            </div>
                          </label>
                          <button
                            onClick={() => openNoteModal(dayIndex, taskIndex)}
                            className="flex-shrink-0 mt-1 p-2 text-gray-400 hover:text-violet-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          : umrohStepsData.map((stage: Stage, stageIndex: number) => {
              const isOpen = openStages.has(stageIndex)

              return (
                <div key={stageIndex} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                  {/* Stage Header */}
                  <div
                    className="p-4 flex justify-between items-center bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 cursor-pointer transition-colors duration-300"
                    onClick={() => toggleStage(stageIndex)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg">
                        <Navigation className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">{stage.stage_title}</h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Stage Content */}
                  <div
                    className={`px-4 md:px-6 overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[4000px] py-4" : "max-h-0"}`}
                  >
                    <div className="space-y-6">
                      {stage.steps.map((step: Step, stepIndex: number) => (
                        <div
                          key={stepIndex}
                          className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-6 pb-6"
                        >
                          <div className="relative">
                            <div className="absolute -left-8 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-3">
                              {step.step_title}
                            </h3>

                            {/* Step Details */}
                            {step.details && step.details.length > 0 && (
                              <div className="mb-4">
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-slate-300">
                                  {step.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="text-sm">
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Step Notes */}
                            {step.notes && (
                              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">📝 {step.notes}</p>
                              </div>
                            )}

                            {/* Prayers */}
                            {step.prayers && step.prayers.length > 0 && (
                              <div className="space-y-4">
                                {step.prayers.map((prayer: Prayer, prayerIndex: number) => (
                                  <div key={prayerIndex} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                                    {prayer.prayer_title && (
                                      <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">
                                        {prayer.prayer_title}
                                      </h4>
                                    )}
                                    {prayer.notes && (
                                      <p className="text-xs text-gray-600 dark:text-slate-400 mb-2 italic">
                                        {prayer.notes}
                                      </p>
                                    )}
                                    <div className="space-y-2">
                                      <p
                                        className="text-right text-xl leading-relaxed text-gray-800 dark:text-slate-200 font-arabic"
                                        dir="rtl"
                                      >
                                        {prayer.arabic}
                                      </p>
                                      {prayer.transliteration && (
                                        <p className="text-sm text-gray-600 dark:text-slate-400 italic">
                                          <strong>Bacaan:</strong> {prayer.transliteration}
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-700 dark:text-slate-300">
                                        <strong>Artinya:</strong> {prayer.translation}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Sub Steps */}
                            {step.sub_steps && step.sub_steps.length > 0 && (
                              <div className="mt-4 space-y-3">
                                {step.sub_steps.map((subStep: SubStep, subStepIndex: number) => (
                                  <div
                                    key={subStepIndex}
                                    className="ml-4 border-l border-gray-300 dark:border-slate-600 pl-4"
                                  >
                                    <h4 className="font-medium text-gray-800 dark:text-slate-200 mb-2">
                                      {subStep.title}
                                    </h4>
                                    {subStep.notes && (
                                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{subStep.notes}</p>
                                    )}
                                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                      <p
                                        className="text-right text-lg leading-relaxed text-gray-800 dark:text-slate-200 font-arabic"
                                        dir="rtl"
                                      >
                                        {subStep.prayer.arabic}
                                      </p>
                                      {subStep.prayer.transliteration && (
                                        <p className="text-sm text-gray-600 dark:text-slate-400 italic mt-1">
                                          <strong>Bacaan:</strong> {subStep.prayer.transliteration}
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">
                                        <strong>Artinya:</strong> {subStep.prayer.translation}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Post Action */}
                            {step.post_action && (
                              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                                  ⚡ {step.post_action}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
                activeTab === "itinerary"
                  ? "text-violet-600 dark:text-violet-400 border-t-2 border-violet-600 dark:border-violet-400"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Itinerary</span>
            </button>
            <button
              onClick={() => setActiveTab("steps")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
                activeTab === "steps"
                  ? "text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-600 dark:border-emerald-400"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              }`}
            >
              <Navigation className="w-5 h-5" />
              <span className="font-medium">Umroh Steps</span>
            </button>
          </div>
        </div>
      </div>

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
