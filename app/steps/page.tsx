"use client"

import { useState } from "react"
import { Navigation, ChevronDown, Search } from "lucide-react"

import umrohStepsData from "../../data/umroh-steps.json"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"

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

export default function StepsPage() {
  const [openStages, setOpenStages] = useState<Set<number>>(new Set([0]))
  const [searchQuery, setSearchQuery] = useState("")

  const toggleStage = (stageIndex: number) => {
    const newOpenStages = new Set(openStages)
    if (newOpenStages.has(stageIndex)) {
      newOpenStages.delete(stageIndex)
    } else {
      newOpenStages.add(stageIndex)
    }
    setOpenStages(newOpenStages)
  }

  // Filter steps data based on search query
  const getFilteredStages = () => {
    if (!searchQuery.trim()) {
      return umrohStepsData.map((stage, sIdx) => ({
        ...stage,
        originalIndex: sIdx
      }));
    }
    
    const query = searchQuery.toLowerCase().trim();
    return umrohStepsData.map((stage, sIdx) => {
      const stageMatches = stage.stage_title.toLowerCase().includes(query);
      
      const filteredSteps = stage.steps.filter((step) => {
        const stepTitleMatches = step.step_title.toLowerCase().includes(query);
        const detailsMatch = step.details?.some(detail => detail.toLowerCase().includes(query));
        
        const notesMatch = Array.isArray(step.notes)
          ? step.notes.some(note => typeof note === 'string' && note.toLowerCase().includes(query))
          : (typeof step.notes === 'string' && step.notes.toLowerCase().includes(query));
          
        const postActionMatch = step.post_action?.toLowerCase().includes(query);
        
        const prayersMatch = step.prayers?.some(prayer => 
          (prayer.prayer_title && prayer.prayer_title.toLowerCase().includes(query)) ||
          (Array.isArray(prayer.notes)
            ? prayer.notes.some(note => typeof note === 'string' && note.toLowerCase().includes(query))
            : (typeof prayer.notes === 'string' && prayer.notes.toLowerCase().includes(query))
          ) ||
          prayer.arabic.toLowerCase().includes(query) ||
          (prayer.transliteration && prayer.transliteration.toLowerCase().includes(query)) ||
          prayer.translation.toLowerCase().includes(query)
        );
        
        const subStepsMatch = step.sub_steps?.some(sub => 
          sub.title.toLowerCase().includes(query) ||
          (Array.isArray(sub.notes)
            ? sub.notes.some(note => typeof note === 'string' && note.toLowerCase().includes(query))
            : (typeof sub.notes === 'string' && sub.notes.toLowerCase().includes(query))
          ) ||
          sub.prayer.arabic.toLowerCase().includes(query) ||
          (sub.prayer.transliteration && sub.prayer.transliteration.toLowerCase().includes(query)) ||
          sub.prayer.translation.toLowerCase().includes(query)
        );
        
        return stepTitleMatches || detailsMatch || notesMatch || postActionMatch || prayersMatch || subStepsMatch;
      });
      
      if (stageMatches) {
        return {
          ...stage,
          originalIndex: sIdx
        };
      } else if (filteredSteps.length > 0) {
        return {
          ...stage,
          steps: filteredSteps,
          originalIndex: sIdx
        };
      }
      return null;
    }).filter(Boolean) as (Stage & { originalIndex: number })[];
  };

  const filteredStages = getFilteredStages();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <Header
        title="Panduan Umroh"
        subtitle="Tata Cara Pelaksanaan Umroh"
        showBackButton={true}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari panduan..."
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {filteredStages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <Search className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">Tidak ada hasil ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 px-4">
              Coba cari dengan kata kunci lain seperti nama rukun (Thawaf, Sa'i), bacaan doa, atau rincian tata cara.
            </p>
          </div>
        ) : (
          filteredStages.map((stage) => {
            const stageIndex = stage.originalIndex
            const isOpen = searchQuery.trim() !== "" ? true : openStages.has(stageIndex)

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
                  <div className="space-y-4">
                    {stage.steps.map((step: Step, stepIndex: number) => (
                      <div
                        key={stepIndex}
                        className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-6 pb-4 last:pb-1"
                      >
                        <div className="relative">
                          <div className="absolute -left-8 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                          <h3 className="text-base font-semibold text-gray-800 dark:text-slate-200 mb-2">
                            {step.step_title}
                          </h3>

                          {/* Step Details */}
                          {step.details && step.details.length > 0 && (
                            <div className="mb-2.5">
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
                            <div className="mb-2.5 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">📝 {step.notes}</p>
                            </div>
                          )}

                          {/* Prayers */}
                          {step.prayers && step.prayers.length > 0 && (
                            <div className="space-y-3 mb-2.5">
                              {step.prayers.map((prayer: Prayer, prayerIndex: number) => (
                                <div key={prayerIndex} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                  {prayer.prayer_title && (
                                    <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                                      {prayer.prayer_title}
                                    </h4>
                                  )}
                                  {prayer.notes && (
                                    <p className="text-xs text-gray-600 dark:text-slate-400 mb-1.5 italic">
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
                            <div className="mt-3 space-y-2.5 mb-2.5">
                              {step.sub_steps.map((subStep: SubStep, subStepIndex: number) => (
                                <div
                                  key={subStepIndex}
                                  className="ml-4 border-l border-gray-300 dark:border-slate-600 pl-4"
                                >
                                  <h4 className="font-medium text-gray-800 dark:text-slate-200 mb-1.5">
                                    {subStep.title}
                                  </h4>
                                  {subStep.notes && (
                                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-1.5">{subStep.notes}</p>
                                  )}
                                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2.5">
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
                            <div className="mt-3 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
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
          })
        )}
      </main>

      <BottomNav />

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-xs text-gray-400 dark:text-slate-500">Semoga menjadi umroh yang mabrur. Aamiin.</p>
      </footer>
    </div>
  )
}
