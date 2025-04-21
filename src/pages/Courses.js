"use client"
import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  CheckCircle,
  Award,
  LockIcon as LockClosed,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw,
} from "lucide-react"
import Leaderboard from "../components/Leaderboard"
import Hearts from "../components/Hearts" // Import the Hearts component

const Courses = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [currentModule, setCurrentModule] = useState(1)
  const [completedModules, setCompletedModules] = useState({})
  const [completedQuizzes, setCompletedQuizzes] = useState({})
  const pathRef = useRef(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const location = useLocation()

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("kaChingCurrentUser")
    if (!user) {
      navigate("/login")
    } else {
      setIsLoggedIn(true)

      // Load progress from localStorage if available
      const savedProgress = localStorage.getItem("courseProgress")
      if (savedProgress) {
        const progress = JSON.parse(savedProgress)
        setCurrentStep(progress.currentStep || 1)
        setCurrentModule(progress.currentModule || 1)
        setCompletedModules(progress.completedModules || {})
        setCompletedQuizzes(progress.completedQuizzes || {})
        setQuizAnswers(progress.quizAnswers || {})
      } else {
        // Initialize progress for new users
        setCurrentStep(1)
        setCurrentModule(1)
        setCompletedModules({})
        setCompletedQuizzes({})
        setQuizAnswers({})
        // Save initial progress to localStorage
        localStorage.setItem(
          "courseProgress",
          JSON.stringify({
            currentStep: 1,
            currentModule: 1,
            completedModules: {},
            completedQuizzes: {},
            quizScores: {},
            quizAnswers: {},
          }),
        )
      }
    }
  }, [location])

  // Save progress when it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        "courseProgress",
        JSON.stringify({
          currentStep,
          currentModule,
          completedModules,
          completedQuizzes,
          quizAnswers,
        }),
      )
    }
  }, [currentStep, currentModule, completedModules, completedQuizzes, quizAnswers, isLoggedIn])

  // Handle heart lost event
  const handleHeartLost = () => {
    console.log("Heart lost in courses page")
    // You can add additional logic here if needed
  }

  // Handle heart gained event
  const handleHeartGained = () => {
    console.log("Heart gained in courses page")
    // You can add additional logic here if needed
  }

  // Update the steps array to include three main sections with modules and separate quizzes
  const steps = [
    {
      id: 1,
      title: "Introduction to Stock Market Basics",
      modules: [
        {
          id: 1,
          title: "Start with your Why", //module 1.1.1
          duration: "3 min",
          type: "content",
        },
        {
          id: "1q",
          title: "Start with your Why: Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 1,
        },
        {
          id: 2,
          title: "What is a Stock?",
          duration: "3 min",
          type: "content",
        },
        {
          id: "2q",
          title: "What is a stock: Recall Quiz", //1.1.2
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 2,
          description: "Test your knowledge of stock types and classifications",
        },
        //{
          //id: "2q-apply",
          //title: "Module 1.2: Application Quiz",
          //type: "quiz",
          //quizType: "application",
          //relatedModuleId: 2,
          //description: "Apply your knowledge to real-world scenarios",
        //},
        {
          id: 3,
          title: "Meet the Markets",
          duration: "3 min",
          type: "content",
        },
        {
          id: "3q",
          title: "Meet the Markets: Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 3,
          description: "NYSE, Nasdaq, SGX- what's the diff?",
        
        },
        {
          id: 4,
          title: "Primary Market", //1.1.4
          duration: "3 min",
          type: "content",
        },
        {
          id: "4q",
          title: "Primary Market: Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 4,
          description: "Primary Market",
        },
        {
          id: 5,
          title: "Secondary Market",
          duration: "3 min",
          type: "content",
        },
        {
          id: "5q",
          title: "Secondary Market: Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 5,
          description: "Secondary Market",
        },
        {
          id: 6,
          title: "Going Public: IPO",
          duration: "3 min",
          type: "content",
        },
        {
          id: "6q",
          title: "Going Public: IPO Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 6,
          description: "Test your knowledge!",
        },
        {
          id: 7,
          title: "Common vs Preferred Stock",
          duration: "3 min",
          type: "content",
        },
        {
          id: "7q",
          title: "Common vs Preferred Stock Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 7,
          description: "Test your knowledge!",
        },
        {
          id: 8,
          title: "Market Capitalization",
          duration: "3 min",
          type: "content",
        },
        {
          id: "8q",
          title: "Market Capitalization",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 8,
          description: "Test your knowledge!",
        },
        {
          id: 9,
          title: "Market Cap Categories",
          duration: "3 min",
          type: "content",
        },
        {
          id: "9q",
          title: "Market Cap Categories Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 9,
          description: "Test your knowledge!",
        },
        {
          id: 10,
          title: "Divdend, Value, Growth Stocks",
          duration: "3 min",
          type: "content",
        },
        {
          id: "10q",
          title: "Divdend, Value, Growth Stocks Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 10,
          description: "Test your knowledge!",
        },

      ],
    },
    {
      id: 2,
      title: "Fundamental Analysis",
      modules: [
        {
          id: 1,
          title: "Introduction to Fundamental Analysis I",
          duration: "5 min",
          type: "content",
        },
        {
          id: "1q",
          title: "Intro to FA I Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 1,
        },
        {
          id: 2,
          title: "Introduction to Fundamental Analysis II",
          duration: "4 min",
          type: "content",
        },
        {
          id: "2q",
          title: "Intro to FA II Quiz",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 2,
        },
        {
          id: 3,
          title: "Company Valuation: Introduction to Financial Statements I",
          duration: "3 min",
          type: "content",
        },
        {
          id: "3q",
          title: "Company Valuation: Introduction to Financial Statements I",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 3,
        },
        {
          id: 4, 
          title: "Company Valuation: Introduction to Financial Statements II",
          duration: "6 min",
          type: "content",
        },
        {
          id: "4q",
          title: "Company Valuation: Introduction to Financial Statements II",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 4,
        },
        {
          id: 5,
          title: "Income Statement",
          duration: "10 min",
          type: "content",
        },
        {
          id: "5q",
          title: "Income Statement",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 5,
        },
        {
          id: 6,
          title: "Balance Sheet",
          duration: "10 min",
          type:"content",
        },
        {
          id: "6q",
          title: "Balance Sheet",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 6,
        },
        {
          id: 7,
          title: "Cash Flow Statement",
          duration: "10 min",
          type: "content",
        },
        {
          id: "7q",
          title: "Cash Flow Statement",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 7,
        },
        {
          id: 8,
          title: "Key Financial Ratios: Liquidity Ratios",
          duration: "6 min",
          type: "content",
        },
        {
          id: "8q",
          title: "Key Financial Ratios: Liquidity Ratios",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 8,
        },
        {
          id: 9,
          title: "Key Financial Ratios: Leverage Ratios",
          duration: "6 min",
          type: "content",
        },
        {
          id: "9q",
          title: "Key Financial Ratios: Leverage Ratios",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 9,
        },
        {
          id: 10,
          title: "Key Financial Ratios: Efficiency Ratios",
          duration: "6 min",
          type: "content",
        },
        {
          id: "10q",
          title: "Key Financial Ratios: Efficiency Ratios",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 10,
        },
        {
          id: 11,
          title: "Key Financial Ratios: Profitability Ratios",
          duration: "6 min",
          type: "content",
        },
        {
          id: "11q",
          title: "Key Financial Ratios: Profitability Ratios",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 11,
        },
        {
          id: 12,
          title: "Key Financial Ratios: Market Value Ratios",
          duration: "6 min",
          type: "content",
        },
        {
          id: "12q",
          title: "Key Financial Ratios: Market Value Ratios",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 12,
        },
      ],
    },
    {
      id: 3,
      title: "ETFs",
      modules: [
        {
          id: 1,
          title: "Introduction to ETFs",
          duration: "3 min",
          type: "content",
        },
        {
          id: "1q",
          title: "Introduction to ETFs",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 1,
        },
        {
          id: 2,
          title: "Advantages and Disadvantages of ETFs",
          duration: "5 min",
          type: "content",
        },
        {
          id: "2q",
          title: "Advantages and Disadvantages of ETFs",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 2,
        },
        {
          id: 3,
          title: "Types of ETFs",
          duration: "8 min",
          type: "content",
        },
        {
          id: "3q",
          title: "Types of ETFs",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 3,
        },
        {
          id: 4,
          title: "How to Buy an ETF",
          duration: "8 min",
          type: "content",
        },
        {
          id: "4q",
          title: "How to Buy an ETF",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 4,
        },
        {
          id: 5,
          title: "How to Pick an ETF: Define Your Investment Goals and Time Horizon",
          duration: "8 min",
          type: "content",
        },
        {
          id: "5q",
          title: "How to Pick an ETF: Define Your Investment Goals and Time Horizon",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 5,
        },
        {
          id: 6,
          title: "How to Pick an ETF: Assess Risk Tolerance",
          duration: "8 min",
          type: "content",
        },
        {
          id: "6q",
          title: "How to Pick an ETF: Assess Risk Tolerance",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 6,
        },
        {
          id: 7,
          title: "How to Pick an ETF: Analyze the ETF's Holdings",
          duration: "8 min",
          type: "content",
        },
        {
          id: "7q",
          title: "How to Pick an ETF: Analyze the ETF's Holdings",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 7,
        },
        {
          id: 8,
          title: "How to Pick an ETF: Check the ETF's Expense Ratio",
          duration: "8 min",
          type: "content",
        },
        {
          id: "8q",
          title: "How to Pick an ETF: Check the ETF's Expense Ratio",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 8,
        },
        {
          id: 9,
          title: "How to Pick an ETF: Evaluate Historical Performance",
          duration: "8 min",
          type: "content",
        },
        {
          id: "9q",
          title: "How to Pick an ETF: Evaluate Historical Performance",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 9,
        },
        {
          id: 10,
          title: "How to Pick an ETF: Liquidity and Trading Volume",
          duration: "8 min",
          type: "content",
        },
        {
          id: "10q",
          title: "How to Pick an ETF: Liquidity and Trading Volume",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 10,
        },
        {
          id: 11,
          title: "How to Pick an ETF: Diversification and Correlation with Other Investments",
          duration: "8 min",
          type: "content",
        },
        {
          id: "11q",
          title: "How to Pick an ETF: Diversification and Correlation with Other Investments",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 11,
        },
        {
          id: 12,
          title: "Putting it All Together",
          duration: "8 min",
          type: "content",
        },
        {
          id: "12q",
          title: "Putting it All Together",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 12,
        },
        {
          id: 13,
          title: "Tracking Your ETF",
          duration: "8 min",
          type: "content",
        },
        {
          id: "13q",
          title: "Tracking Your ETF",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 13,
        },
        {
          id: 14,
          title: "Recap: Test Your Skills",
          duration: "8 min",
          type: "content",
        },
        {
          id: "12q",
          title: "Recap: Test Your Skills",
          type: "quiz",
          quizType: "mixed",
          relatedModuleId: 14,
        },
      ],
    },
  ]

  // Check if a section is completed (all modules and quizzes completed)
  const isSectionCompleted = (sectionId) => {
    const section = steps.find((s) => s.id === sectionId)
    if (!section) return false

    // Check if all content modules in this section are completed
    const contentModules = section.modules.filter((m) => m.type === "content")
    const contentCompleted = contentModules.every((module) => completedModules[`${sectionId}.${module.id}`])

    // Check if all quizzes in this section are completed
    const quizModules = section.modules.filter((m) => m.type === "quiz")
    const quizzesCompleted = quizModules.every((module) => {
      const quizKey = `${sectionId}.${module.relatedModuleId}.${module.quizType || "mixed"}`
      return completedQuizzes[quizKey]
    })

    return contentCompleted && quizzesCompleted
  }

  // Check if a specific module is completed
  const isModuleCompleted = (sectionId, moduleId) => {
    return !!completedModules[`${sectionId}.${moduleId}`]
  }

  // Check if a specific quiz is completed
  const isQuizCompleted = (sectionId, moduleId, quizType = "mixed") => {
    const quizKey = `${sectionId}.${moduleId}.${quizType}`
    return !!completedQuizzes[quizKey]
  }

  // Add a new function to get quiz score if available
  const getQuizScore = (sectionId, moduleId, quizType = "mixed") => {
    const savedProgress = localStorage.getItem("courseProgress")
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      const quizKey = `${sectionId}.${moduleId}.${quizType}`
      if (progress.quizScores && progress.quizScores[quizKey]) {
        return progress.quizScores[quizKey]
      }
    }
    return null
  }

  const handleStepClick = (stepId, moduleId = 1) => {
    // Navigate to the course content page with step and module parameters
    navigate(`/course-content?step=${stepId}&module=${moduleId}`)
  }

  const handleSectionClick = (sectionId) => {
    // Logic to handle section click (e.g., expand section, navigate to first module)
    console.log(`Section ${sectionId} clicked`)
    setExpandedSection(sectionId)
    setCurrentStep(sectionId)
    setCurrentModuleIndex(0) // Reset module index when section is clicked
  }

  const handleModuleClick = (sectionId, moduleId, moduleType, relatedModuleId, quizType) => {
    // Logic to handle module click (e.g., navigate to module content)
    console.log(`Module ${moduleId} in Section ${sectionId} clicked`)
    setCurrentStep(sectionId)

    if (moduleType === "content") {
      setCurrentModule(moduleId)
      navigate(`/course-content?step=${sectionId}&module=${moduleId}&type=content`)
    } else if (moduleType === "quiz") {
      setCurrentModule(relatedModuleId)
      navigate(`/course-content?step=${sectionId}&module=${relatedModuleId}&type=quiz&quizType=${quizType || "mixed"}`)
    }
  }

  const handleQuizRetake = (sectionId, moduleId, quizType = "mixed") => {
    navigate(`/course-content?step=${sectionId}&module=${moduleId}&type=quiz&quizType=${quizType}&mode=retake`)
  }

  const toggleSectionExpand = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleSectionComplete = (sectionId) => {
    // Logic to handle section completion (e.g., mark as complete, move to next section)
    console.log(`Section ${sectionId} completed`)
    setCurrentStep(sectionId + 1)
    setCurrentModule(1)
    setExpandedSection(null) // Collapse the section after completion
    setCurrentModuleIndex(0) // Reset module index
  }

  // Get the current progress for a section (how many modules completed)
  const getSectionProgress = (sectionId) => {
    const section = steps.find((s) => s.id === sectionId)
    if (!section) return 0

    // Count completed content modules
    const contentModules = section.modules.filter((m) => m.type === "content")
    const completedContentCount = contentModules.filter(
      (module) => completedModules[`${sectionId}.${module.id}`],
    ).length

    // Count completed quizzes
    const quizModules = section.modules.filter((m) => m.type === "quiz")
    const completedQuizCount = quizModules.filter((module) => {
      const quizKey = `${sectionId}.${module.relatedModuleId}.${module.quizType || "mixed"}`
      return completedQuizzes[quizKey]
    }).length

    return completedContentCount + completedQuizCount
  }
  
  const isModuleUnlocked = () => true

  // Check if a module is unlocked (previous module and its quiz are completed)
  /*const isModuleUnlocked = (sectionId, moduleIndex) => {
    const section = steps.find((s) => s.id === sectionId)
    if (!section) return false

    // First module is always unlocked
    if (moduleIndex === 0) return true

    // For module 1.1 quiz (index 1 in section 1), check if module 1.1 content is completed
    if (sectionId === 1 && moduleIndex === 1) {
      return isModuleCompleted(1, 1)
    }

    // For module 1.2, check if module 1.1 and its quiz are completed with score >= 80%
    if (sectionId === 1 && moduleIndex === 2) {
      // Module 1.2
      const module1Completed = isModuleCompleted(1, 1)
      const quiz1Completed = isQuizCompleted(1, 1, "mixed")
      const quiz1Score = getQuizScore(1, 1, "mixed")
      return module1Completed && quiz1Completed && quiz1Score >= 80
    }

    // For module 1.2 recall quiz, check if module 1.2 is completed
    if (sectionId === 1 && moduleIndex === 3) {
      // Module 1.2 recall quiz
      return isModuleCompleted(1, 2)
    }

    // For module 1.2 application quiz, check if module 1.2 recall quiz is completed with score >= 80%
    if (sectionId === 1 && moduleIndex === 4) {
      // Module 1.2 application quiz
      const recallQuizCompleted = isQuizCompleted(1, 2, "recall")
      const recallQuizScore = getQuizScore(1, 2, "recall")
      return recallQuizCompleted && recallQuizScore >= 80
    }

    // Default behavior for other modules - check if previous module is completed
    const prevModule = section.modules[moduleIndex - 1]

    // If previous item is content, check if it's completed
    if (prevModule.type === "content") {
      return isModuleCompleted(sectionId, prevModule.id)
    }

    // If previous item is quiz, check if it's completed
    if (prevModule.type === "quiz") {
      //return isQuizCompleted(sectionId, prevModule.relatedModuleId, prevModule.quizType)
    }

    return false
  }
    */

  // Update the isNextStep function to correctly identify the next step in the learning path
  const isNextStep = (sectionId, moduleIndex) => {
    const section = steps.find((s) => s.id === sectionId)
    if (!section) return false

    // If this is the first module and it's not completed, it's the next step
    if (moduleIndex === 0 && !isModuleCompleted(sectionId, section.modules[0].id)) {
      return true
    }

    // For module 1.1 quiz (index 1 in section 1), check if module 1.1 content is completed but quiz isn't
    if (sectionId === 1 && moduleIndex === 1) {
      const module1Completed = isModuleCompleted(1, 1)
      const quiz1Completed = isQuizCompleted(1, 1, "mixed")
      return module1Completed && !quiz1Completed
    }

    // For module 1.2 (index 2 in section 1), check if module 1.1 and its quiz are completed with score >= 80%
    if (sectionId === 1 && moduleIndex === 2) {
      const module1Completed = isModuleCompleted(1, 1)
      const quiz1Completed = isQuizCompleted(1, 1, "mixed")
      const quiz1Score = getQuizScore(1, 1, "mixed")
      return module1Completed && quiz1Completed && quiz1Score >= 80 && !isModuleCompleted(1, 2)
    }

    // For module 1.2 recall quiz (index 3 in section 1), check if module 1.2 is completed but quiz isn't
    if (sectionId === 1 && moduleIndex === 3) {
      const module2Completed = isModuleCompleted(1, 2)
      const quiz2RecallCompleted = isQuizCompleted(1, 2, "recall")
      return module2Completed && !quiz2RecallCompleted
    }

    // For module 1.2 application quiz (index 4 in section 1), check if recall quiz is completed with score >= 80%
    if (sectionId === 1 && moduleIndex === 4) {
      const recallQuizCompleted = isQuizCompleted(1, 2, "recall")
      const recallQuizScore = getQuizScore(1, 2, "recall")
      const applicationQuizCompleted = isQuizCompleted(1, 2, "application")
      return recallQuizCompleted && recallQuizScore >= 80 && !applicationQuizCompleted
    }

    // For other sections, handle the same pattern
    if (sectionId > 1) {
      // For first content module in a section
      if (moduleIndex === 0) {
        return !isModuleCompleted(sectionId, section.modules[0].id)
      }

      // For quiz after content module
      if (moduleIndex % 2 === 1) {
        // Odd indices are quizzes in sections 2 and 3
        const relatedContentIndex = moduleIndex - 1
        const contentModule = section.modules[relatedContentIndex]
        if (contentModule && contentModule.type === "content") {
          const contentCompleted = isModuleCompleted(sectionId, contentModule.id)
          const quizCompleted = isQuizCompleted(
            sectionId,
            contentModule.id,
            section.modules[moduleIndex].quizType || "mixed",
          )
          return contentCompleted && !quizCompleted
        }
      }

      // For content module after quiz
      if (moduleIndex % 2 === 0 && moduleIndex > 0) {
        // Even indices > 0 are content modules in sections 2 and 3
        const prevQuizIndex = moduleIndex - 1
        const prevQuiz = section.modules[prevQuizIndex]
        if (prevQuiz && prevQuiz.type === "quiz") {
          const prevContentModule = section.modules[moduleIndex - 2]
          const quizCompleted = isQuizCompleted(sectionId, prevContentModule.id, prevQuiz.quizType || "mixed")
          const contentCompleted = isModuleCompleted(sectionId, section.modules[moduleIndex].id)
          return quizCompleted && !contentCompleted
        }
      }
    }

    return false
  }


  return (
    <div className="min-h-screen bg-[#f9f7f2] overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-[#5a7d53] opacity-5 animate-pulse"></div>
        <div
          className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-[#f0d878] opacity-5 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-[#85bb65] opacity-5 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="bg-[#5a7d53] text-white py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-white hover:text-[#f0d878] transition-colors transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">Investment Courses</h1>
          <div className="flex items-center space-x-4">
            <Hearts onHeartLost={handleHeartLost} onHeartGained={handleHeartGained} />
          </div>
        </div>
      </div>

      {/* Main content with two-column layout */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Course Sections */}
          <div className="lg:w-3/4">
            {steps.map((section, index) => {
              const sectionCompleted = isSectionCompleted(section.id)
              const progressCount = getSectionProgress(section.id)
              const progressPercent = (progressCount / section.modules.length) * 100

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-500 hover:shadow-xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#5a7d53]">
                        Section {section.id}: {section.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {section.modules.filter((m) => m.type === "content").length} modules •{" "}
                        {section.id === 1 ? "Beginner" : section.id === 2 ? "Intermediate" : "Advanced"}
                      </p>

                      {/* Progress bar */}
                      {progressCount > 0 && !sectionCompleted && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#85bb65] rounded-full"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-600">
                              {progressCount}/{section.modules.length}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {sectionCompleted && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </span>
                      )}
                      <button
                        onClick={() => handleSectionClick(section.id)}
                        className="bg-[#f0d878] hover:bg-[#e5c960] text-[#5a7d53] font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {sectionCompleted ? "Review" : progressCount > 0 ? "Continue" : "Start"}
                      </button>
                    </div>
                  </div>

                  {/* Show modules as a learning path when section is expanded */}
                  {expandedSection === section.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                      <h3 className="text-xl font-bold text-[#5a7d53] mb-6">Learning Path</h3>

                      <div className="relative py-8">
                        {/* Vertical path line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-200 transform -translate-x-1/2 rounded-full"></div>

                        {/* Progress overlay */}
                        <div
                          className="absolute left-1/2 top-0 w-2 bg-[#85bb65] transform -translate-x-1/2 rounded-full transition-all duration-700 ease-in-out"
                          style={{
                            height: `${Math.min(100, (progressCount / section.modules.length) * 100)}%`,
                          }}
                        ></div>

                        {/* Module steps */}
                        <div className="relative">
                          {section.modules.map((module, moduleIndex) => {
                            const isContent = module.type === "content"
                            const isQuiz = module.type === "quiz"

                            const moduleCompleted = isContent
                              ? isModuleCompleted(section.id, module.id)
                              : isQuizCompleted(section.id, module.relatedModuleId, module.quizType)

                            const isCurrentModule =
                              currentStep === section.id &&
                              (isContent ? currentModule === module.id : currentModule === module.relatedModuleId)

                            const isUnlocked = isModuleUnlocked(section.id, moduleIndex)
                            const isLocked = !isUnlocked && !moduleCompleted && !isCurrentModule
                            const isNext = isNextStep(section.id, moduleIndex)

                            // Get quiz score if it's a completed quiz
                            const quizScore =
                              isQuiz && moduleCompleted
                                ? getQuizScore(section.id, module.relatedModuleId, module.quizType)
                                : null

                            return (
                              <div
                                key={`${module.id}-${module.type}-${module.quizType || ""}`}
                                className="relative mb-16 flex justify-center"
                              >
                                {/* Module marker */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                                  <button
                                    onClick={() => {
                                      if (isQuiz && moduleCompleted) {
                                        handleQuizRetake(section.id, module.relatedModuleId, module.quizType)
                                      } else if (!isLocked) {
                                        handleModuleClick(
                                          section.id,
                                          module.id,
                                          module.type,
                                          module.relatedModuleId,
                                          module.quizType,
                                        )
                                      }
                                    }}
                                    disabled={isLocked}
                                    className={`flex items-center justify-center w-14 h-14 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                                      moduleCompleted
                                        ? isQuiz
                                          ? quizScore >= 80
                                            ? "bg-[#85bb65] text-white"
                                            : "bg-[#e07a5f] text-white"
                                          : "bg-[#85bb65] text-white"
                                        : isCurrentModule || isNext
                                          ? "bg-[#f0d878] text-[#5a7d53] animate-pulse"
                                          : "bg-white border-2 border-gray-200 text-gray-400"
                                    } ${isLocked ? "cursor-not-allowed" : "hover:scale-110"}`}
                                  >
                                    {moduleCompleted ? (
                                      isQuiz ? (
                                        quizScore >= 80 ? (
                                          <CheckCircle className="h-6 w-6" />
                                        ) : (
                                          <RotateCcw className="h-6 w-6" />
                                        )
                                      ) : (
                                        <CheckCircle className="h-6 w-6" />
                                      )
                                    ) : isLocked ? (
                                      <LockClosed className="h-6 w-6" />
                                    ) : isContent ? (
                                      <BookOpen className="h-6 w-6" />
                                    ) : (
                                      <FileText className="h-6 w-6" />
                                    )}
                                  </button>
                                </div>

                                {/* Module content card */}
                                <div className={`w-3/4 md:w-1/2 mt-8 ${moduleIndex % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                                  <div
                                    className={`bg-white p-4 rounded-xl shadow-md border-2 transition-all duration-300 ${
                                      isLocked
                                        ? "border-gray-200 opacity-60"
                                        : isCurrentModule || isNext
                                          ? "border-[#f0d878]"
                                          : moduleCompleted
                                            ? isQuiz && quizScore < 80
                                              ? "border-[#e07a5f]"
                                              : "border-[#85bb65]"
                                            : "border-gray-200"
                                    } ${isLocked ? "cursor-not-allowed" : "hover:shadow-lg"}`}
                                  >
                                    <div className="flex items-center mb-2">
                                      {isContent ? (
                                        <BookOpen className="h-5 w-5 text-[#5a7d53] mr-2" />
                                      ) : (
                                        <FileText className="h-5 w-5 text-[#5a7d53] mr-2" />
                                      )}
                                      <h4 className="font-bold text-lg text-[#5a7d53]">
                                        {isContent
                                          ? `Module ${section.id}.${module.id}: ${module.title}`
                                          : module.title}
                                      </h4>
                                    </div>

                                    {isContent && module.duration && (
                                      <p className="text-gray-600 text-sm mt-1">
                                        <span className="font-medium">{module.duration}</span>
                                      </p>
                                    )}

                                    {isQuiz && module.description && (
                                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                                    )}

                                    <p className="text-gray-600 text-sm mt-2">
                                      {moduleCompleted ? (
                                        <span className="flex items-center text-[#85bb65]">
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          {isQuiz && quizScore ? (
                                            <span>
                                              Completed! <span className="font-bold">Score: {quizScore}%</span>
                                              {quizScore >= 80 ? (
                                                <span className="ml-1 text-green-600">✓ Passed</span>
                                              ) : (
                                                <span className="ml-1 text-red-500">✗ Failed</span>
                                              )}
                                            </span>
                                          ) : (
                                            "Completed!"
                                          )}
                                        </span>
                                      ) : isCurrentModule ? (
                                        "You're currently on this step."
                                      ) : isLocked ? (
                                        "Complete previous steps to unlock."
                                      ) : (
                                        "Ready to start!"
                                      )}
                                    </p>

                                    {/* Add a visual score indicator for completed quizzes */}
                                    {isQuiz && moduleCompleted && quizScore && (
                                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                          className={`h-2.5 rounded-full ${quizScore >= 80 ? "bg-green-600" : "bg-red-500"}`}
                                          style={{ width: `${quizScore}%` }}
                                        ></div>
                                      </div>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {!isLocked && (
                                        <>
                                          {/* For content modules, show Start/Continue button */}
                                          {isContent && (
                                            <button
                                              onClick={() =>
                                                handleModuleClick(
                                                  section.id,
                                                  module.id,
                                                  module.type,
                                                  module.relatedModuleId,
                                                  module.quizType,
                                                )
                                              }
                                              className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                                                moduleCompleted
                                                  ? "bg-[#85bb65] text-white hover:bg-[#75a758]"
                                                  : "bg-[#f0d878] text-[#5a7d53] hover:bg-[#e5c960]"
                                              }`}
                                            >
                                              {moduleCompleted ? "Review" : isCurrentModule ? "Continue" : "Start"}
                                            </button>
                                          )}

                                          {/* For quizzes, only show Retake Quiz if completed */}
                                          {isQuiz && moduleCompleted && (
                                            <button
                                              onClick={() =>
                                                handleQuizRetake(section.id, module.relatedModuleId, module.quizType)
                                              }
                                              className="text-sm px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all duration-300 flex items-center"
                                            >
                                              <RotateCcw className="h-4 w-4 mr-1" /> Retake Quiz
                                            </button>
                                          )}

                                          {/* For quizzes that aren't completed, show Take Quiz button */}
                                          {isQuiz && !moduleCompleted && (
                                            <button
                                              onClick={() =>
                                                handleModuleClick(
                                                  section.id,
                                                  module.id,
                                                  module.type,
                                                  module.relatedModuleId,
                                                  module.quizType,
                                                )
                                              }
                                              className="text-sm px-4 py-2 rounded-lg bg-[#f0d878] text-[#5a7d53] hover:bg-[#e5c960] transition-all duration-300"
                                            >
                                              Take Quiz
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                          {/* Trophy at the end - only show if all modules are completed */}
                          {sectionCompleted && (
                            <div className="relative mb-16 flex justify-center">
                              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f0d878] text-[#5a7d53] border-4 border-white shadow-lg animate-bounce">
                                  <Award className="h-8 w-8" />
                                </div>
                              </div>
                              <div className="w-3/4 md:w-1/2 mt-8 mx-auto">
                                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-[#f0d878] text-center">
                                  <h4 className="font-bold text-lg text-[#5a7d53]">Section Completed!</h4>
                                  <p className="text-gray-600 text-sm mt-2">
                                    Congratulations! You've completed all modules and quizzes in this section.
                                  </p>
                                  {section.id < steps.length && (
                                    <button
                                      onClick={() => handleSectionComplete(section.id)}
                                      className="mt-3 bg-[#5a7d53] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4a6a45] transition-all duration-300"
                                    >
                                      Continue to Next Section
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle button to expand/collapse section details */}
                  <button
                    onClick={() => toggleSectionExpand(section.id)}
                    className="mt-2 text-[#5a7d53] font-medium flex items-center hover:underline"
                  >
                    {expandedSection === section.id ? "Hide Details" : "Show Details"}
                    {expandedSection === section.id ? (
                      <ChevronUp className="ml-1 h-5 w-5" />
                    ) : (
                      <ChevronDown className="ml-1 h-5 w-5" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Right column - Leaderboard */}
          <div className="lg:w-1/4 space-y-6">{isLoggedIn && <Leaderboard />}</div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Courses
