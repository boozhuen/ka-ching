"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Award,
  CheckCircle,
  XCircle,
  BookOpen,
  FileText,
  RotateCcw,
} from "lucide-react"
import confetti from "canvas-confetti"
import Hearts from "../components/Hearts"

const CourseContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [currentModule, setCurrentModule] = useState(1)
  const [contentType, setContentType] = useState("content") // "content" or "quiz"
  const [quizType, setQuizType] = useState("mixed") // "mixed", "recall", or "application"
  const [quizMode, setQuizMode] = useState("normal") // "normal" or "retake"
  const [completedSteps, setCompletedSteps] = useState([])
  const [completedModules, setCompletedModules] = useState({})
  const [completedQuizzes, setCompletedQuizzes] = useState({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [savedAnswers, setSavedAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const confettiRef = useRef(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [quickCheckAnswers, setQuickCheckAnswers] = useState({})
  const [quickCheckFeedback, setQuickCheckFeedback] = useState({})
  const [quizScores, setQuizScores] = useState({})
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [heartsSystem, setHeartsSystem] = useState(true)
  const heartsRef = useRef(null)

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const stepParam = params.get("step")
    const moduleParam = params.get("module")
    const typeParam = params.get("type") || "content"
    const quizTypeParam = params.get("quizType") || "mixed"
    const modeParam = params.get("mode") || "normal"

    if (stepParam) {
      setCurrentStep(Number.parseInt(stepParam))
    }

    if (moduleParam) {
      setCurrentModule(Number.parseInt(moduleParam))
    }

    setContentType(typeParam)
    setQuizType(quizTypeParam)
    setQuizMode(modeParam)
    setShowQuiz(typeParam === "quiz")
  }, [location.search])

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
        setCompletedSteps(progress.completedSteps || [])
        setCompletedModules(progress.completedModules || {})
        setCompletedQuizzes(progress.completedQuizzes || {})
        setQuizScores(progress.quizScores || {})
        setSavedAnswers(progress.quizAnswers || {})

        // Check if this quiz is already completed
        const quizKey = `${currentStep}.${currentModule}.${quizType}`
        if (contentType === "quiz" && progress.completedQuizzes && progress.completedQuizzes[quizKey]) {
          // If quiz is already completed and we're in retake mode, start fresh
          if (quizMode === "retake") {
            setSelectedAnswers({})
            setQuizCompleted(false)
            setQuizScore(0)
          }
          // If quiz is already completed and we're in normal mode, show the completion screen
          else if (quizMode === "normal") {
            setQuizCompleted(true)
            setQuizScore(progress.quizScores[quizKey] || 80)
          }
        }
      }
    }
  }, [navigate, contentType, currentStep, currentModule, quizType, quizMode])

  // Save progress when it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        "courseProgress",
        JSON.stringify({
          currentStep,
          completedSteps,
          completedModules,
          completedQuizzes,
          quizScores,
          quizAnswers: savedAnswers,
        }),
      )
    }
  }, [currentStep, completedSteps, completedModules, completedQuizzes, isLoggedIn, quizScores, savedAnswers])

  // Trigger confetti effect when quiz is passed
  useEffect(() => {
    if (quizCompleted && quizScore >= 80 && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#5a7d53", "#f0d878", "#85bb65", "#f8d231"],
      })
    }
  }, [quizCompleted, quizScore])

  const handleHeartLost = () => {
    console.log("Heart lost!")
  }

  // Handle heart gained event
  const handleHeartGained = () => {
    console.log("Heart gained!")
  }

  // Handle quick check answer selection
  const handleQuickCheckAnswer = (questionId, selectedOption) => {
    setQuickCheckAnswers({
      ...quickCheckAnswers,
      [questionId]: selectedOption,
    })

    // Check if answer is correct
    const isCorrect = quickCheckQuestions[questionId].correctAnswer === selectedOption

    setQuickCheckFeedback({
      ...quickCheckFeedback,
      [questionId]: isCorrect,
    })

    if (!isCorrect && heartsSystem) {
      // Use the heartsRef to lose a heart
      if (heartsRef.current && typeof heartsRef.current.loseHeart === "function") {
        heartsRef.current.loseHeart()
      }
    }

    // If correct, show a small confetti effect
    if (isCorrect) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#5a7d53", "#f0d878", "#85bb65"],
      })
    }
  }

  // Reset quick check answer
  const resetQuickCheck = (questionId) => {
    const newAnswers = { ...quickCheckAnswers }
    delete newAnswers[questionId]

    const newFeedback = { ...quickCheckFeedback }
    delete newFeedback[questionId]

    setQuickCheckAnswers(newAnswers)
    setQuickCheckFeedback(newFeedback)
  }

  // Quick check questions
  const quickCheckQuestions = {
    "common-stock-voting": {
      question: "Which stock type gives shareholders voting rights?",
      options: ["Common stock", "Preferred stock", "Both", "Neither"],
      correctAnswer: 0,
    },
    "preferred-stock-dividends": {
      question: "Preferred stockholders receive dividends…",
      options: [
        "After common stockholders",
        "Before common stockholders",
        "At the same time as common stockholders",
        "Only if the company performs well",
      ],
      correctAnswer: 1,
    },
    "market-cap-measure": {
      question: "What does market capitalization measure?",
      options: [
        "A company's total debt",
        "The total value of its outstanding shares",
        "Annual revenue",
        "The number of stocks issued",
      ],
      correctAnswer: 1,
    },
    "large-cap-risk": {
      question: "Which category is generally more stable and lower risk?",
      options: ["Small-cap", "Large-cap", "Mid-cap", "Growth stocks"],
      correctAnswer: 1,
    },
    "dividend-stock-income": {
      question: "Which stock type is best for investors looking for regular income?",
      options: ["Growth stock", "Value stock", "Dividend stock", "Small-cap stock"],
      correctAnswer: 2,
    },
  }

  // Content sections for each module
  const moduleContent = [
    // SECTION 1 MODULE 1
    [
      {
        title: "Start with your Why",
        type: "content",
        content: (
        <div className="space-y-4">
          <p className="mb-3">
            Beginners often focus on what to invest in, but first, identify why.
          </p>
          <p className="mb-3">
            Different goals have different time horizons.
          </p>
          <p className="mb-3">
           Time horizons affect risk tolerance: longer = more risk, shorter = less risk.
          </p>
          <p className="mb-3">
           Different goals also affect liquidity: longer = less liquid, shorter = more liquid
          </p>
        </div>
        ),
      },

      
    ],
    // SECTION 1 MODULE 2
    [
  
      {
        title: "What is a Stock?",
        type: "content",
        content: (
          <div className="space-y-4">
            <p className="mb-3">
              A <span title="Part ownership in a company" className="underline dotted cursor-help">stock</span> is a part ownership in a company.
            </p>
            <p className="mb-3">
              You can earn from stocks through <span title="When a stock increases in value" className="underline dotted cursor-help">capital appreciation</span> or <span title="Earnings paid to shareholders" className="underline dotted cursor-help">dividends</span>.
            </p>
            <p className="mb-3 font-semibold">
              Why do companies sell stock?
            </p>
            <p className="mb-3">
              To raise money and grow their business.
            </p>
            <p className="mb-3">
              Selling shares helps fund things like expansion, research, or paying off debt.
            </p>
          </div>
        ),
      },
      
    ],
    // SECTION 1 MODULE 3
    [
      {
        title: "Meet the Markets",
        type: "content",
        content:(
          <div className="space-y-4">
            <p className="mb-3">
              Stock markets, also known as stock exchanges, are like an auction house — matching buyers and sellers via online brokers.
            </p>
            <p className="mb-3">
              There are many stock exchanges around the world.
            </p>
            <p className="mb-3">
              The US exchanges <strong>NYSE</strong> and <strong>Nasdaq</strong> are the largest in the world.
            </p>
            <p className="mb-3">
              <strong>Nasdaq:</strong> Known for tech companies (e.g. Apple, Microsoft, and Tesla).
            </p>
            <p className="mb-3">
              <strong>NYSE:</strong> Known for mature, traditional, and industrial companies.
            </p>
            <p className="mb-3">
              <strong>SGX:</strong> Singapore Stock Exchange.
            </p>
          </div>
        ),
      },
      
    ],
    // SECTION 1 MODULE 4
    [
      {
        title: "Primary Market",
        type: "content",
        content:(
          <div className="space-y-4">
            <p className="mb-3 font-semibold">🟢 What Is It?</p>
            <p className="mb-3">
              The <strong>Primary Market</strong> is where new stocks are sold for the first time.
            </p>
        
            <p className="mb-3 font-semibold">💰 Who Gets the Money?</p>
            <p className="mb-3">
              When you buy a stock here, <strong>the company gets the money</strong>. You are investing directly into the business.
            </p>
        
            <p className="mb-3 font-semibold">🛍️ Two Ways to Sell Stocks</p>
            
            <p className="mb-2 font-medium">1. Public Offering</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Anyone (including you!) can buy the stock</li>
              <li>Comes with more regulation</li>
              <li>
                Requires an{" "}
                <span
                  title="Initial Public Offering: when a company sells shares to the public for the first time"
                  className="underline decoration-dotted cursor-help text-blue-600"
                >
                  IPO
                </span>
              </li>
            </ul>
        
            <p className="mb-2 font-medium">2. Private Offering</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Only for wealthy individuals or institutions</li>
              <li>Fewer rules, faster and cheaper</li>
            </ul>
          </div>
        ),
      },
      
    ],
    // SECTION 1 MODULE 5
    [
      {
        title: "Secondary Market",
        type: "content",
        content: (
          <div>
            <p><strong>🟢 What Is It?</strong></p>
            <p>
              The <strong>Secondary Market</strong> is where existing stocks are bought and sold between investors.
            </p>
            <p>🏢 The company doesn’t receive money in these trades.</p>
        
            <p><strong>🎟️ A Simple Example</strong></p>
            <p>
              Imagine you bought tickets to a concert and can’t go, so you sell them to a friend.
            </p>
            <p>
              That’s like a stock trade in the secondary market. You're not paying the artist again—just reselling the ticket.
            </p>
        
            <p><strong>🔍 Why It Matters</strong></p>
            <ul>
              <li>✅ You can buy or sell stocks anytime</li>
              <li>💲 Helps find the market price of a stock</li>
              <li>🔁 Keeps the market active and easy to trade in</li>
            </ul>
        
            <p><strong>🛍️ Two Types of Secondary Markets</strong></p>
        
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {/* Dealer Market */}
              <div style={{ flex: "1", minWidth: "250px", border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}>
                <h4>1. Dealer Market</h4>
                <ul>
                  <li>You trade through a middleman called a <strong>market maker</strong></li>
                  <li>They hold inventory and decide prices</li>
                  <li><strong>Example:</strong> NASDAQ</li>
                </ul>
              </div>
        
              {/* Auction Market */}
              <div style={{ flex: "1", minWidth: "250px", border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}>
                <h4>2. Auction Market</h4>
                <ul>
                  <li>Buyers and sellers trade directly</li>
                  <li>Prices are matched based on highest bid and lowest ask</li>
                  <li><strong>Example:</strong> NYSE</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      
    ],
    // SECTION 1 MODULE 6
    [
      {
        title: "Going Public with IPO",
        type: "content",
        content: (
          <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🚀 How Companies Sell Stocks</h3>
            <p style={{ marginBottom: "1rem" }}>
              To sell stocks, a company must go public via an <strong>IPO</strong> (Initial Public Offering). The process includes:
            </p>
            <ol style={{ paddingLeft: "1.2rem", listStyleType: "decimal", lineHeight: "1.6" }}>
              <li>🏢 A private company decides to go public to raise money.</li>
              <li>💼 It works with investment banks to set an initial stock price.</li>
              <li>🏦 The stock is offered to institutional investors first.</li>
              <li>📈 Once trading begins, anyone can buy shares on the open market.</li>
            </ol>
          </div>
        ),
      },
      
    ],

    //SECTION 1 MODULE 7

    [
      {
        title: "Common vs Preferred Stock",
        type: "content",
        content: (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Common Stock */}
            <div style={{ flex: "1", minWidth: "280px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📈 Common Stock</h3>
              <p><strong>What:</strong> The most typical stock</p>
              <p>
                <strong>🎯 Perks:</strong>{" "}
                <span title="Gives shareholders the ability to vote on major company decisions" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  Voting rights
                </span>{" "}
                and potential for{" "}
                <span title="When a stock increases in value over time" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  capital appreciation
                </span>.
              </p>
              <p><strong>👤 Best for:</strong></p>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>Long-term investors</li>
                <li>Those seeking <span title="Increase in the value of your investment over time" style={{ textDecoration: "underline dotted", cursor: "help" }}>capital appreciation</span></li>
                <li>
                  <span title="Comfortable with higher price swings and potential losses for long-term gain" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                    Risk-tolerant
                  </span>{" "}
                  investors
                </li>
              </ul>
            </div>
        
            {/* Preferred Stock */}
            <div style={{ flex: "1", minWidth: "280px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>💰 Preferred Stock</h3>
              <p><strong>What:</strong> A stock with more{" "}
                <span title="Regular income payments made to shareholders, like interest" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  yields
                </span>{" "}
                and fewer rights
              </p>
              <p>
                <strong>🎯 Perks:</strong> Priority when it comes to receiving dividends, but no{" "}
                <span title="No ability to vote on major company matters like mergers or board elections" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  voting rights
                </span>.
              </p>
              <p><strong>👤 Best for:</strong></p>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>Medium to long-term investors</li>
                <li>Those seeking stable income from dividends</li>
                <li>
                  <span title="Prefers steady returns with lower volatility and lower risk" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                    Risk-averse
                  </span>{" "}
                  individuals
                </li>
              </ul>
            </div>
          </div>
        )        
        ,
      },
      
    ],

    //SECTION 1 MODULE 8
    [
      {
        title: "Market Capitalization",
        type: "content",
        content: (
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {/* Large Cap */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>🏢 Large Cap</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>💰 USD 10 billion or more</li>
                <li>🏛️ Big, stable companies</li>
                <li>🛡️ Low risk, steady returns</li>
                <li>🏭 Typically in established industries</li>
              </ul>
            </div>
        
            {/* Mid Cap */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📈 Mid Cap</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>💵 USD 2 to 10 billion</li>
                <li>🏢 Medium-sized companies</li>
                <li>⚖️ Balanced risk and growth</li>
                <li>🌱 In growth-oriented industries</li>
              </ul>
            </div>
        
            {/* Small Cap */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>🌟 Small Cap</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>💸 USD 250 million – 2 billion</li>
                <li>🏗️ Smaller companies</li>
                <li>🎢 Higher risk, higher potential returns</li>
                <li>🧪 Often in niche or emerging sectors</li>
              </ul>
            </div>
          </div>
        )
        ,
      },
      
    ],

    //SECTION 1 MODULE 9
    [
      {
        title: "Market Cap Categories",
        type: "content",
        content: (
          <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🚀 How Companies Sell Stocks</h3>
            <p style={{ marginBottom: "1rem" }}>
              To sell stocks, a company must go public via an <strong>IPO</strong> (Initial Public Offering). The process includes:
            </p>
            <ol style={{ paddingLeft: "1.2rem", listStyleType: "decimal", lineHeight: "1.6" }}>
              <li>🏢 A private company decides to go public to raise money.</li>
              <li>💼 It works with investment banks to set an initial stock price.</li>
              <li>🏦 The stock is offered to institutional investors first.</li>
              <li>📈 Once trading begins, anyone can buy shares on the open market.</li>
            </ol>
          </div>
        ),
      },
      
    ],

    //SECTION 1 MODULE 10
    [
      {
        title: "Divdend, Value, Growth Stocks",
        type: "content",
        content: (
          <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🚀 How Companies Sell Stocks</h3>
            <p style={{ marginBottom: "1rem" }}>
              To sell stocks, a company must go public via an <strong>IPO</strong> (Initial Public Offering). The process includes:
            </p>
            <ol style={{ paddingLeft: "1.2rem", listStyleType: "decimal", lineHeight: "1.6" }}>
              <li>🏢 A private company decides to go public to raise money.</li>
              <li>💼 It works with investment banks to set an initial stock price.</li>
              <li>🏦 The stock is offered to institutional investors first.</li>
              <li>📈 Once trading begins, anyone can buy shares on the open market.</li>
            </ol>
          </div>
        ),
      },
      
    ],
  
    // SECTION 2 MODULE 1
    [
      {
        title: "Introduction to Fundamental Analysis I",
        type: "content",
        content: (
          <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "700px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔍 Fundamental Analysis</h3>
            <p style={{ marginBottom: "1rem" }}>
              Fundamental analysis looks at both the{" "}
              <span title="Financial data such as revenue, profits, and ratios" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                quantitative
              </span>{" "}
              (numbers) and{" "}
              <span title="Non-financial factors like brand strength, leadership, or market trends" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                qualitative
              </span>{" "}
              (story) aspects of a company to help investors determine the{" "}
              <span title="What the stock is actually worth based on its fundamentals, not market price" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                intrinsic value
              </span>{" "}
              of a stock — in other words, to decide if the company is worth more than its current price.
            </p>
            <p>
              This approach is best suited for investors with a{" "}
              <span title="A time horizon typically ranging from several months to years" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                mid-to-long-term
              </span>{" "}
              investment horizon.
            </p>
          </div>
        ),
      },
  
      
    ],
    //SECTION 2 MODULE 2
    [
      {
        title: "Introduction to Fundamental Analysis II",
        type: "content",
        content: (
          (
            <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "750px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🧥 Thrift Store Analogy: Understanding Value</h3>
          
              <p style={{ marginBottom: "1rem" }}>
                Think of <strong>Fundamental Analysis</strong> like shopping at a thrift store. You’re not just looking at the price tag—
                you’re evaluating the item’s <em>quality</em>, <em>brand</em>, and <em>condition</em> to decide if it’s worth more than what the price suggests.
              </p>
          
              <p style={{ marginBottom: "1rem" }}>
                For example, imagine a vintage leather jacket priced at <strong>$10</strong>. After inspecting it, you realize it’s a
                high-end brand, in excellent condition, and rare. You’d know this item is{" "}
                <span title="When something is selling for less than what it's truly worth" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  undervalued
                </span>{" "}
                and likely a great buy.
              </p>
          
              <p style={{ marginBottom: "1rem" }}>
                Similarly, in the stock market, if the{" "}
                <span title="What the stock is truly worth based on analysis" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  fair market value
                </span>{" "}
                (or{" "}
                <span title="Another term for fair market value based on financial fundamentals" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  intrinsic value
                </span>
                ) is higher than the{" "}
                <span title="The price you see on the stock exchange" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  market price
                </span>
                , the stock is undervalued — and analysts may issue a <strong>buy</strong> recommendation.
              </p>
          
              <p style={{ marginBottom: "1rem" }}>
                On the other hand, imagine spotting a worn-out t-shirt for <strong>$40</strong> with no brand and little appeal.
                You’d know it’s{" "}
                <span title="When something is priced higher than its actual worth" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  overvalued
                </span>{" "}
                and not worth the price. In investing, that would likely lead to a <strong>sell (short)</strong> recommendation.
              </p>
          
              <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "#555" }}>
                💡 Note: <strong>Fair market value</strong> is also known as{" "}
                <span title="The true value of a stock based on analysis of its business fundamentals" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                  intrinsic value
                </span>
                .
              </p>
            </div>
          )
          
        ),
      } 
    ],
    //Add more sections as needed

  ]
  
  // Quiz data matching quizKey format
  const quizData = {
    "1.1.mixed": [
      {
        
    question: "What investment strategy best fits a goal of retirement in 30 years?",
    options: [
      "Low risk, high liquidity",
      "Balanced risk, medium liquidity",
      "Higher risk tolerance, low liquidity",
      "Short-term savings account",
    ],
    correctAnswer: 2,
    feedback: [
      "This approach is more suitable for short-term goals. Retirement in 30 years allows for a longer time horizon and more investment risk.",
      "Balanced risk works well for mid-term goals like college savings, but for a 30-year retirement plan, you can typically afford to take on more risk.",
      "Correct! A long-term goal like retirement allows for higher risk tolerance and investments that may be less liquid but offer greater growth potential over time.",
      "A short-term savings account is useful for emergencies or near-future needs—not long-term growth like retirement.",
    ],
  },
  {
    question: "Which investment strategy fits best for someone buying a house next year?",
    options: [
      "Low risk, high liquidity",
      "Higher risk tolerance, low liquidity",
      "Balanced risk, medium liquidity",
      "Investing in real estate stocks",
    ],
    correctAnswer: 0,
    feedback: [
      "Correct! Since you're planning to use the money in a year, your investment should be easily accessible and low-risk to avoid potential losses.",
      "This approach is too risky for a short-term goal. There's not enough time to recover from market volatility.",
      "Balanced risk works better for goals 5–10 years away. In this case, it's safer to prioritize capital preservation.",
      "Investing in real estate stocks may seem related, but they can be volatile and don't provide the liquidity or safety needed for a short-term goal like buying a house next year.",
    ],
  },
  {
    question: "You’re saving for your child’s college fund in 10 years. What strategy fits best?",
    options: [
      "High risk, low liquidity",
      "Low risk, high liquidity",
      "Balanced risk, medium liquidity",
      "Short-term government bonds",
    ],
    correctAnswer: 2,
    feedback: [
      "Ten years gives some time to grow, but not enough for very high-risk investments that may fluctuate widely.",
      "This is better for very short-term or emergency goals. You have more time and can afford moderate risk.",
      "Correct! A 10-year time horizon allows for a balanced approach—some growth potential, some safety, and moderate liquidity.",
      "Short-term government bonds are generally lower risk and more appropriate for goals less than 5 years away.",
    ],
  },
  {
    question: "What strategy is most suitable for building an emergency fund?",
    options: [
      "Low risk, high liquidity",
      "High risk, low liquidity",
      "Balanced risk, medium liquidity",
      "Investing in long-term index funds",
    ],
    correctAnswer: 0,
    feedback: [
      "Correct! Emergency funds need to be safe and accessible, so low risk and high liquidity are key.",
      "This is too risky and doesn't provide quick access to cash—bad fit for emergencies.",
      "Balanced risk is still too risky for an emergency fund, which needs to be available immediately and reliably.",
      "Long-term index funds are great for retirement or wealth-building, but not suitable for emergencies when funds may be needed right away.",
    ],
      },
      /* Quiz questions for Investing Basics */
    ],
    "1.2.mixed": [
      { question: "Which of these is an example of capital appreciation?",
        options: [
          "Company pays you SGD 1 per share",
          "You sell a stock at a higher price than you bought it",
          "You receive a dividend from the company",
          "You hold the stock for over 5 years",
        ],
        correctAnswer: 1,
        feedback: [
          "This is a dividend, not capital appreciation. Capital appreciation happens when the price of your stock increases.",
          "Correct! Capital appreciation means the stock's value has increased since you bought it, and you gain by selling at a higher price.",
          "Dividends are payments from company profits, not appreciation of value.",
          "Holding for a long time doesn't guarantee capital appreciation. The stock has to increase in value.",
        ],
      },
      {
        question: "What does owning a stock represent?",
        options: [
          "You are lending money to the company",
          "You own a part of the company",
          "You’re entitled to guaranteed returns",
          "You work for the company",
        ],
        correctAnswer: 1,
        feedback: [
          "That describes a bond. Stocks represent ownership, not a loan.",
          "Correct! When you own a stock, you're a part-owner (shareholder) of the company.",
          "There are no guaranteed returns with stocks. Values can fluctuate.",
          "Owning stock does not mean you’re employed by the company—it just makes you a shareholder.",
        ],
      },
      {
        question: "What is a dividend?",
        options: [
          "A payment to stockholders from the company’s profits",
          "A type of loan you give to a company when buying stock",
          "The profit you earn from selling a stock",
          "A penalty for holding a stock too long",
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! A dividend is a portion of a company’s profits shared with shareholders, usually in cash or additional shares.",
          "Stocks are not loans—bonds are. Buying stock makes you a part-owner, not a lender.",
          "That’s capital appreciation, not a dividend.",
          "There are no penalties for long-term investing. This is incorrect.",
        ],
      },
      {
        question: "What is an example of capital appreciation?",
        options: [
          "You receive a cash payment from the company",
          "The value of your stock increases over time",
          "You receive a bonus stock dividend",
          "The company announces a share buyback",
        ],
        correctAnswer: 1,
        feedback: [
          "That’s a dividend, not appreciation.",
          "Correct! Capital appreciation is when the stock's price rises, increasing the value of your investment.",
          "Stock dividends are additional shares, not necessarily an increase in value.",
          "A share buyback can affect stock price, but it's not in itself capital appreciation.",
        ],
      },
      /* Quiz questions for what is a stock */
    ],
    "1.3.mixed": [
      {
        question: "What is the main function of a stock exchange?",
        options: [
          "To create new companies",
          "To match buyers and sellers of stocks via brokers",
          "To lend money to investors",
          "To manage company payroll",
        ],
        correctAnswer: 1,
        feedback: [
          "Stock exchanges don’t create companies—they provide a platform for trading shares of existing companies.",
          "Correct! Stock exchanges act like auction houses, matching buyers and sellers of stocks through online brokers.",
          "Stock exchanges don’t lend money. That’s a function of banks or lending institutions.",
          "Payroll is managed internally by companies, not by the exchange.",
        ],
      },
      {
        question: "Which of the following are the two largest stock exchanges in the world?",
        options: [
          "SGX and SSE",
          "Nasdaq and NYSE",
          "LSE and TSX",
          "ASX and BSE",
        ],
        correctAnswer: 1,
        feedback: [
          "SGX (Singapore) and SSE (Shanghai) are important, but not the largest globally.",
          "Correct! Nasdaq and NYSE are the two largest stock exchanges in the world, both based in the US.",
          "The London and Toronto exchanges are large, but not as large as NYSE and Nasdaq.",
          "ASX (Australia) and BSE (India) are regional leaders, not global ones.",
        ],
      },
      {
        question: "Which stock exchange is best known for tech companies like Apple, Microsoft, and Tesla?",
        options: [
          "NYSE",
          "Nasdaq",
          "SGX",
          "LSE",
        ],
        correctAnswer: 1,
        feedback: [
          "NYSE is known for more mature, traditional companies.",
          "Correct! Nasdaq is home to many major tech companies and is known for being tech-focused.",
          "SGX is Singapore’s exchange and doesn’t specialize in tech.",
          "LSE (London Stock Exchange) is a major international exchange but not known for tech dominance.",
        ],
      },
      {
        question: "What is the NYSE best known for?",
        options: [
          "Emerging tech startups",
          "Singapore-based companies",
          "Mature, traditional, and industrial companies",
          "Cryptocurrency trading",
        ],
        correctAnswer: 2,
        feedback: [
          "Tech startups are more commonly listed on Nasdaq.",
          "Singapore-based companies are typically listed on SGX.",
          "Correct! The NYSE is known for listing large, established companies in traditional industries.",
          "Cryptocurrency trading happens on separate crypto exchanges, not the NYSE.",
        ],
      },
      {
        question: "Which exchange is based in Singapore?",
        options: [
          "Nasdaq",
          "NYSE",
          "SGX",
          "SSE",
        ],
        correctAnswer: 2,
        feedback: [
          "Nasdaq is based in the United States.",
          "NYSE is also a US-based exchange.",
          "Correct! SGX stands for Singapore Exchange and is based in Singapore.",
          "SSE refers to the Shanghai Stock Exchange in China.",
        ],
      },
      /* Quiz questions for Market Cap */
    ],
    "1.4.mixed": [
      {
        question: "What is the Primary Market?",
        options: [
          "Where existing stocks are traded between investors",
          "Where new stocks are sold for the first time",
          "Where dividends are distributed"
        ],
        correctAnswer: 1,
        feedback: [
          "That's the Secondary Market, not the Primary Market.",
          "Correct! The Primary Market is where new stocks are issued and sold for the first time.",
          "Dividends are part of company profits, not how stocks are initially sold."
        ]
      },
      {
        question: "Who receives the money when you buy a stock in the Primary Market?",
        options: [
          "Another investor",
          "The government",
          "The company issuing the stock"
        ],
        correctAnswer: 2,
        feedback: [
          "That happens in the Secondary Market, not the Primary.",
          "Governments don’t receive stock sale proceeds unless it's a public enterprise IPO.",
          "Correct! In the Primary Market, the money goes directly to the company."
        ]
      },

      {
        question: "What does a public offering allow?",
        options: [
          "Only private investors can buy the stock",
          "Anyone can buy the stock",
          "Only institutions can trade the stock"
        ],
        correctAnswer: 1,
        feedback: [
          "You're thinking of a private offering — not public.",
          "Correct! Public offerings are open to everyone, including individual investors.",
          "This applies to private offerings, not public ones."
        ]
      },    
      {
        question: "What is one requirement for a public offering?",
        options: [
          "IPO (Initial Public Offering)",
          "SEC exemption",
          "Dividend declaration"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! A public offering requires an IPO to be launched.",
          "That's more typical of private offerings, which avoid some SEC steps.",
          "Dividends aren't required for stock offerings."
        ]
      },
      {
        question: "Which is true about private offerings?",
        options: [
          "Open to all investors",
          "Faster and has fewer rules",
          "Requires an IPO"
        ],
        correctAnswer: 1,
        feedback: [
          "That describes a public offering, not private.",
          "Correct! Private offerings are typically quicker and less regulated.",
          "Private offerings don't require IPOs — that's for public offerings."
        ]
      }
      
      
      
    ],
    "1.5.mixed": [
      {
        question: "What is the Secondary Market?",
        options: [
          "Where new stocks are issued for the first time",
          "Where stocks are bought and sold between investors",
          "Where companies raise money directly"
        ],
        correctAnswer: 1,
        feedback: [
          "That's the Primary Market, not the Secondary Market.",
          "Correct! The Secondary Market is where investors trade existing stocks with each other.",
          "In the Secondary Market, the company doesn't receive money — investors trade with one another."
        ]
      },
      {
        question: "Who receives the money when a stock is traded in the Secondary Market?",
        options: [
          "The company",
          "An investor selling the stock",
          "The stock exchange"
        ],
        correctAnswer: 1,
        feedback: [
          "That only happens in the Primary Market.",
          "Correct! In the Secondary Market, the seller — another investor — receives the money.",
          "Exchanges charge fees but do not receive the trade amount."
        ]
      },
      {
        question: "What is a key function of the Secondary Market?",
        options: [
          "Determining the stock’s market price",
          "Helping companies issue shares",
          "Providing dividend schedules"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! Ongoing trading helps determine what investors are willing to pay — the market price.",
          "That happens in the Primary Market during issuance.",
          "Dividends are decided by companies, not market structure."
        ]
      },
      {
        question: "How is an Auction Market different from a Dealer Market?",
        options: [
          "An aution market involves trading through a middleman",
          "In an auction market, buyers and sellers trade directly",
          "In an auction market, prices are set by the company"
        ],
        correctAnswer: 1,
        feedback: [
          "That's how Dealer Markets work (via market makers).",
          "Correct! In Auction Markets like the NYSE, buyers and sellers are matched directly.",
          "Prices are determined by the market — not the company."
        ]
      }           

      
    ],
    "1.6.mixed": [
      {
        question: "What does a company need to do to sell stocks?",
        options: [
          "Open a bank account",
          "Go public via an IPO",
          "Buy other companies"
        ],
        correctAnswer: 1,
        feedback: [
          "Opening a bank account is not part of the stock offering process.",
          "Correct! A company must go public through an IPO to sell its shares to the public.",
          "Buying other companies is unrelated to going public or selling shares."
        ]
      },
      {
        question: "What does a company need to do to sell stocks?",
        options: [
          "Open a bank account",
          "Go public via an IPO",
          "Buy other companies"
        ],
        correctAnswer: 1,
        feedback: [
          "Opening a bank account is not part of the stock offering process.",
          "Correct! A company must go public through an IPO to sell its shares to the public.",
          "Buying other companies is unrelated to going public or selling shares."
        ]
      },
      {
        question: "Who is offered the stock first during an IPO?",
        options: [
          "Anyone who wants to buy it",
          "Institutional investors",
          "Local government"
        ],
        correctAnswer: 1,
        feedback: [
          "Public investors can buy after trading opens, but institutional investors get first access.",
          "Correct! Institutional investors are typically offered shares first in an IPO.",
          "Local governments aren’t involved in the distribution of stock during an IPO."
        ]
      },
      {
        question: "What is the main reason a company decides to go public?",
        options: [
          "To make its products more popular",
          "To avoid paying taxes",
          "To raise money"
        ],
        correctAnswer: 2,
        feedback: [
          "Going public may increase visibility, but the main goal is funding.",
          "Companies still pay taxes after going public.",
          "Correct! The primary reason for going public is to raise capital for growth."
        ]
      }
        
    ],
    "1.7.mixed": [
      {
        question: "What is the key perk of Common Stock?",
        options: [
          "Priority dividends",
          "Voting rights and potential for growth",
          "Guaranteed fixed returns",
          "No voting rights"
        ],
        correctAnswer: 1,
        feedback: [
          "That’s a perk of Preferred Stock, not Common Stock.",
          "Correct! Common stockholders usually have voting rights and the potential for capital appreciation.",
          "Common Stock doesn't offer fixed returns — returns depend on performance.",
          "Incorrect. Common stock usually comes with voting rights."
        ]
      },
      {
        question: "Who is Preferred Stock best suited for?",
        options: [
          "Long-term investors looking for growth",
          "Investors seeking more stable income through dividends",
          "Those looking to vote on company decisions",
          "Short-term traders looking for quick profits"
        ],
        correctAnswer: 1,
        feedback: [
          "Preferred Stock is better for income than long-term growth.",
          "Correct! It offers steady dividend income and is ideal for stability-focused investors.",
          "Preferred Stock usually doesn’t come with voting rights.",
          "Preferred Stock is not meant for short-term trading or speculation."
        ]
      },
      {
        question: "What is the main difference between Common Stock and Preferred Stock?",
        options: [
          "Preferred Stock gives voting rights, Common Stock does not",
          "Preferred Stock offers priority in dividends, Common Stock does not",
          "Common Stock guarantees fixed income",
          "Preferred Stock is riskier than Common Stock"
        ],
        correctAnswer: 1,
        feedback: [
          "Common Stock has voting rights, not Preferred.",
          "Correct! Preferred shareholders receive dividends before Common shareholders.",
          "There’s no fixed income in Common Stock — it depends on company performance.",
          "Preferred Stock is typically less risky because of steady dividend payments."
        ]
      },
      {
        question: "Which of the following is true about the time horizon of Preferred Stock?",
        options: [
          "Preferred Stock is best for short-term investors",
          "Preferred Stock is best for medium to long-term investors seeking stability",
          "Preferred Stock is only for day traders",
          "Preferred Stock has no time horizon"
        ],
        correctAnswer: 1,
        feedback: [
          "Preferred Stock is not designed for short-term gains.",
          "Correct! It suits medium to long-term investors who value steady income and lower volatility.",
          "Preferred Stock is not used for day trading — it’s not volatile enough.",
          "All investments have a time horizon depending on the goal. This is too vague to be true."
        ]
      },
      {
        question: "Who would benefit most from investing in Common Stock?",
        options: [
          "Someone looking for immediate income",
          "Someone wanting to vote on company decisions and accept more risk for potential growth",
          "Someone avoiding risk and seeking stable returns",
          "Someone seeking fixed, regular payouts"
        ],
        correctAnswer: 1,
        feedback: [
          "Immediate income is more aligned with Preferred Stock.",
          "Correct! Common Stock appeals to investors willing to take on more risk in exchange for growth and voting rights.",
          "Common Stock is not for risk-averse investors — it’s more volatile.",
          "That’s the domain of Preferred Stock, not Common."
        ]
      }
      
    ],
    "1.8.mixed": [
      {
        question: "What does market capitalization measure?",
        options: [
          "The company's revenue",
          "The value of all outstanding shares",
          "The company's net income"
        ],
        correctAnswer: 1,
        feedback: [
          "Revenue is important, but market cap is based on share price and shares outstanding.",
          "Correct! Market cap is the total value of a company’s outstanding shares (share price × number of shares).",
          "Net income relates to company profitability, not its total market value."
        ]
      },
      {
        question: "If a company has 1 million shares at $50 each, what's its market cap?",
        options: [
          "$50 million",
          "$1 million",
          "$5 million"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! 1 million shares × $50 = $50 million market cap.",
          "That would be the case if shares were $1 each — not $50.",
          "That math doesn’t add up — double-check your multiplication."
        ]
      },
      {
        question: "Market capitalization helps investors understand:",
        options: [
          "Product quality",
          "Company size & risk",
          "Employee salaries"
        ],
        correctAnswer: 1,
        feedback: [
          "Product quality is subjective and not part of market cap calculation.",
          "Correct! Market cap indicates how big a company is, and larger firms are often seen as less risky.",
          "Salaries aren't related to a company's market cap directly."
        ]
      },
      {
        question: "A company’s stock price goes up. What happens to its market cap?",
        options: [
          "It depends on revenue",
          "It goes down",
          "It increases"
        ],
        correctAnswer: 2,
        feedback: [
          "Revenue doesn’t directly impact market cap — share price does.",
          "That’s the opposite — market cap rises when share price rises.",
          "Correct! Market cap increases because it’s calculated as share price × number of shares."
        ]
      },
      
    ],
    "1.9.mixed": [
      {
        question: "Small cap stocks are always safer.",
        options: [
          "True",
          "False"
        ],
        correctAnswer: 1,
        feedback: [
          "Small cap stocks are generally riskier due to higher volatility and less predictable performance.",
          "Correct! Small cap stocks often come with higher risk — they can grow fast, but also swing wildly in value."
        ]
      },
      {
        question: "Small cap has over USD 10 billion market cap.",
        options: [
          "True",
          "False"
        ],
        correctAnswer: 1,
        feedback: [
          "That describes large cap — not small cap. Small caps are typically under $2 billion.",
          "Correct! Small caps are usually between $250 million and $2 billion, not over $10 billion."
        ]
      },
      {
        question: "If you’re someone who avoids risk in investment, what category of stock might you pick?",
        options: [
          "Large cap stock",
          "Small cap stock"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! Large cap stocks are usually more stable and less volatile — great for risk-averse investors.",
          "Small caps tend to be riskier and more volatile, which doesn’t suit a conservative strategy."
        ]
      },
      {
        question: "Company A makes plant-based dog food and has a market cap of $500 million. What category of market capitalization does it fall into?",
        options: [
          "Small Cap",
          "Large Cap",
          "Mid Cap"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! $500 million falls in the small cap range ($250M–$2B).",
          "Large cap starts at $10 billion and above — this company is much smaller.",
          "Mid cap is typically $2–10 billion, which is still above this company's value."
        ]
      },
      {
        question: "If you’re someone who is seeking growth in value of stock and can accept volatility of stock prices, what category of stock might you pick?",
        options: [
          "Large cap",
          "Small Cap"
        ],
        correctAnswer: 1,
        feedback: [
          "Large cap stocks are stable but generally offer slower growth.",
          "Correct! Small caps are more volatile but can offer high growth potential."
        ]
      }
      
      
    ],
    "1.10.mixed": [
      {
        question: "Which stock type usually pays regular income?",
        options: [
          "Value",
          "Growth",
          "Dividend"
        ],
        correctAnswer: 2,
        feedback: [
          "Value stocks can sometimes pay dividends, but not always regularly.",
          "Growth stocks usually reinvest profits instead of paying income.",
          "Correct! Dividend stocks are known for providing regular income to shareholders."
        ]
      },
      {
        question: "Which stock type has the highest risk and growth potential?",
        options: [
          "Value",
          "Growth",
          "Dividend"
        ],
        correctAnswer: 1,
        feedback: [
          "Value stocks are considered more stable and less volatile.",
          "Correct! Growth stocks aim for rapid expansion and often carry higher risk.",
          "Dividend stocks prioritize income, not aggressive growth."
        ]
      },
      {
        question: "You want long-term bargains and are okay waiting. Choose:",
        options: [
          "Growth",
          "Dividend",
          "Value"
        ],
        correctAnswer: 2,
        feedback: [
          "Growth stocks are priced for potential, not for bargain-hunting.",
          "Dividend stocks focus on income, not undervalued opportunities.",
          "Correct! Value stocks are often undervalued and good for long-term investors willing to wait."
        ]
      },
      {
        question: "This stock reinvests earnings and skips dividends.",
        options: [
          "Growth",
          "Dividend",
          "Value"
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! Growth stocks typically reinvest profits to fuel expansion instead of paying dividends.",
          "Dividend stocks distribute profits rather than reinvesting them.",
          "Value stocks may pay dividends, but reinvestment isn’t their defining trait."
        ]
      },
      {
        question: "Which is best for someone needing steady income now?",
        options: [
          "Growth",
          "Dividend",
          "Value"
        ],
        correctAnswer: 1,
        feedback: [
          "Growth stocks don’t usually offer income — they’re about future potential.",
          "Correct! Dividend stocks provide regular payouts — ideal for income-focused investors.",
          "Value stocks might pay dividends, but income isn’t their core purpose."
        ]
      }      
      
    ],
    "2.1.mixed": [
      {
        question: "What does Fundamental Analysis consist of? (You may choose more than one option.)",
        options: [
          "Quantitative Analysis",
          "Qualitative Analysis",
          "Technical Analysis"
        ],
        correctAnswer: [0, 1],
        hint: (
          <span title="Fundamental analysis is like inspecting items at a thrift shop to decide their true worth. For stocks, it means scrutinizing a company's financial health, management quality, and market position to see if the stock price really reflects its value." style={{ textDecoration: "underline dotted", cursor: "help" }}>
            💡 Hint: Think of fundamental analysis like evaluating a hidden gem at a thrift store.
          </span>
        ),
        feedback: {
          correct: "Fundamental analysis includes both quantitative aspects, like financial statements and ratios, and qualitative aspects, such as management quality and industry position. This comprehensive approach provides a deeper understanding of a company's overall health and potential.",
          incorrect: [
            "While quantitative analysis of financial data is a crucial part of fundamental analysis, relying solely on this ignores the qualitative factors like management effectiveness and industry conditions, which are equally important.",
            "Qualitative analysis helps in understanding the company's strategic positioning, but without financial metrics like earnings and debt, the analysis is incomplete.",
            "Technical analysis is a separate discipline that focuses on price trends and trading volumes, not business fundamentals."
          ]
        }
      },

      {
        question: "What does Fundamental Analysis help you determine?",
        options: [
          "The popularity of the stock on social media",
          "The intrinsic value of a stock",
          "The short-term volatility of the stock",
          "The CEO's performance"
        ],
        correctAnswer: 1,
        hint: (
          <span title="Fundamental analysis helps you assess whether a stock’s price reflects its true business value." style={{ textDecoration: "underline dotted", cursor: "help" }}>
            💡 Hint: Think long-term value, not short-term hype.
          </span>
        ),
        feedback: [
          "The number of times a stock is mentioned on social media doesn’t reflect its financial worth or business fundamentals.",
          "Correct! Fundamental analysis helps determine a stock's intrinsic value — what it's actually worth based on company performance.",
          "Short-term volatility refers to quick price fluctuations, which is typically the focus of technical analysis, not fundamental.",
          "A CEO is important, but fundamental analysis goes far beyond one person — it covers earnings, debt, and overall company outlook."
        ]
      },

      {
        question: "If the fair market value exceeds the market price, is the stock undervalued or overvalued?",
        options: ["Undervalued", "Overvalued"],
        correctAnswer: 0,
        hint: (
          <span title="Fair market value is what a stock is actually worth. Market price is what it's selling for. If something is worth more than the price, it's undervalued." style={{ textDecoration: "underline dotted", cursor: "help" }}>
            💡 Hint: Think of a high-quality jacket at a low thrift price.
          </span>
        ),
        feedback: [
          "Correct! If a stock is priced lower than its fair market value, it's a good deal — it's undervalued.",
          "Overvalued would mean the stock costs more than it's worth. If the market price is lower than the fair value, it's actually undervalued."
        ]
      },

      {
        question: "If a stock is overvalued, should you exercise a buy or short decision?",
        options: ["Buy", "Short"],
        correctAnswer: 1,
        feedback: [
          "Buying an overvalued stock means paying more than it’s worth — it’s risky and may lead to losses when the price corrects.",
          "Correct! If a stock is overvalued, shorting may be profitable if you expect its price to fall to reflect its true value."
        ]
      }     
    ],
    "2.2.mixed": [
      {
        question: "If the market price exceeds the fair market value, is the stock undervalued or overvalued?",
        options: [
          "Undervalued",
          "Overvalued"
        ],
        correctAnswer: 1,
        hint: (
          <span title="Fair market value = what the item is usually worth. Market price = current selling price. Undervalued = priced below its real worth. Overvalued = priced above its real worth." style={{ textDecoration: "underline dotted", cursor: "help" }}>
            📌 Hint: Hover to review key definitions
          </span>
        ),
        feedback: [
          // Incorrect: User chooses "Undervalued"
          "Undervalued would mean that the stock is priced below its real value, which is not the case here. The term doesn't apply when the stock's price is higher than its intrinsic value, which indicates an overvaluation, not undervaluation.",
          // Correct: User chooses "Overvalued"
          "Correct! This option correctly states that the stock price is higher than what the company's financial health and market position justify. When investors pay more than the fair market value, they may not get a return that matches their investment."
        ]
      },
      {
        question: "If a stock is undervalued, should you exercise a buy or short decision?",
        options: [
          "Buy",
          "Short"
        ],
        correctAnswer: 0,
        feedback: [
          // Correct answer: Buy
          "Correct! Buying undervalued stocks is generally seen as a good investment because you’re purchasing something for less than its true value.",
          // Incorrect answer: Short
          "Shorting a stock is betting on its price decrease, but if a stock is undervalued, it means it's priced below its true value, suggesting it will likely increase. Shorting an undervalued stock risks losses if its price corrects upward to reflect its intrinsic value. Thus, shorting is not advisable for undervalued stocks."
        ]
      }
    ],
  }
  

  // Define quiz data with detailed feedback for each option
 /* const quizData = {
    // Module 1.1 Quiz
    "1.1": [
      {
        question: "What should be the first step in investment planning?",
        options: [
          "Choosing specific stocks to invest in",
          "Identifying your financial goals",
          "Opening a brokerage account",
          "Calculating potential returns",
        ],
        correctAnswer: 1,
        feedback: [
          "While selecting stocks is an important part of the investment process, it's not the first step. Before choosing specific stocks, you need to clarify your financial goals, risk tolerance, and investment strategy to ensure you're making informed decisions.",
          "Correct! The first step in investment planning is to identify your financial goals. Whether you're saving for retirement, buying a home, or building wealth, knowing your objectives will help shape your investment strategy. This step also helps determine your time horizon, risk tolerance, and the types of investments that align with your goals.",
          "Opening a brokerage account is an essential part of investing, but it comes after you have defined your financial goals. It's important to have a clear strategy before selecting a platform or account type for your investments.",
          "While it's important to understand the potential returns of an investment, this step comes after you've identified your goals and chosen an investment strategy. Estimating returns should be based on your specific financial objectives, not the first step in the planning process.",
        ],
      },
      {
        question:
          "How does a longer investment time horizon impact the likelihood of an investor experiencing a significant loss?",
        options: [
          "The likelihood of a significant loss increases",
          "The likelihood of a significant loss decreases because of time to recover",
          "It guarantees no losses at all",
          "The risk of loss remains constant regardless of time horizon",
        ],
        correctAnswer: 1,
        feedback: [
          "This is incorrect. Historically, markets tend to rise over longer periods, and short-term volatility has less impact on long-term performance. A longer time horizon actually reduces the risk of permanent losses.",
          "Correct! With a longer time horizon, investors have more time to recover from market downturns. Historical data shows that while markets experience short-term volatility, they tend to rise over longer periods. This means the risk of experiencing a permanent loss decreases with time.",
          "While a longer time horizon reduces risk, it never eliminates it completely. All investments carry some level of risk, and there are no guarantees in investing. Even with a long time horizon, significant market events can impact returns.",
          "This is incorrect. Time horizon is one of the most important factors in determining investment risk. The longer your time horizon, the more time you have to recover from market downturns, which reduces the likelihood of permanent losses.",
        ],
      },
      {
        question: "Which are the two primary ways to earn money from stocks?",
        options: [
          "Trading and borrowing",
          "Saving and lending",
          "Capital appreciation and dividends",
          "Consulting and analyzing",
        ],
        correctAnswer: 2,
        feedback: [
          "Trading is one way to potentially profit from stocks (through capital appreciation), but borrowing is not a method of earning money from stocks. Borrowing actually creates liabilities, not income.",
          "Saving and lending are general financial concepts but aren't specifically how investors earn money from stocks. Saving refers to setting money aside, while lending typically refers to bonds or loans, not stocks.",
          "Correct! Investors earn money from stocks in two primary ways: capital appreciation (when the stock price increases) and dividends (when companies distribute a portion of their profits to shareholders). These represent the growth and income components of stock investing, respectively.",
          "Consulting and analyzing are activities related to the investment process, but they aren't ways that investors earn money directly from their stock investments. These would be services provided to investors, not returns on investment.",
        ],
      },
      {
        question: "Who are institutional investors?",
        options: [
          "Individual small-scale investors",
          "Large firms managing billions of dollars",
          "Company founders",
          "Individual stock traders",
        ],
        correctAnswer: 1,
        feedback: [
          "This describes retail investors, not institutional investors. Retail investors are individuals who buy and sell securities for their personal accounts, typically in smaller amounts than institutional investors.",
          "Correct! Institutional investors are large organizations that invest substantial sums of money in securities and other assets. These include pension funds, mutual funds, insurance companies, endowments, and hedge funds. They often have significant influence in the markets due to the large volume of their trades.",
          "Company founders may be significant shareholders in their own companies, but they are not considered institutional investors. They are typically classified as insiders or individual investors with concentrated positions.",
          "Individual stock traders, like retail investors, trade securities for their personal accounts. They are not institutional investors, regardless of how frequently they trade or their level of sophistication.",
        ],
      },
      {
        question: "What does an Initial Public Offering (IPO) represent?",
        options: [
          "A company's internal audit",
          "A merger between two companies",
          "A private company going public to raise money",
          "A stock market regulation process",
        ],
        correctAnswer: 2,
        feedback: [
          "An internal audit is a company's examination of its own financial records and processes, which is unrelated to an IPO. Internal audits can happen at any time, whether a company is public or private.",
          "A merger is when two separate companies combine to form a single entity. This is different from an IPO, which involves a single company offering its shares to the public for the first time.",
          "Correct! An Initial Public Offering (IPO) is the process by which a private company offers shares to the public for the first time. This allows the company to raise capital from public investors and enables its shares to trade on stock exchanges. It's a significant milestone in a company's growth journey.",
          "While IPOs are regulated processes, they are not themselves regulatory processes. IPOs are subject to regulations set by bodies like the SEC, but the offering itself is a capital-raising event, not a regulatory one.",
        ],
      },
      {
        question: "Which US stock exchange is known for tech companies?",
        options: ["NYSE", "Dow Jones", "S&P 500", "Nasdaq"],
        correctAnswer: 3,
        feedback: [
          "The New York Stock Exchange (NYSE) is the world's largest stock exchange and hosts many large, established companies across various sectors. While some tech companies are listed on the NYSE, it's not specifically known for tech listings.",
          "The Dow Jones Industrial Average is a stock market index that measures the performance of 30 large companies listed on stock exchanges in the United States. It's not a stock exchange itself, but rather a benchmark index.",
          "The S&P 500 is an index of 500 large-cap U.S. companies, not a stock exchange. Like the Dow Jones, it's a benchmark used to measure market performance, not a place where stocks are traded.",
          "Correct! The Nasdaq is known for being home to many technology and growth-oriented companies. It was the world's first electronic stock market and has attracted many tech giants like Apple, Microsoft, Amazon, Google (Alphabet), and Facebook (Meta). It's particularly associated with the technology sector and innovative companies.",
        ],
      },
      {
        question: "What is the primary role of market makers?",
        options: [
          "To set stock prices",
          "To ensure smooth trading by matching buyers and sellers",
          "To regulate the stock market",
          "To create investment strategies",
        ],
        correctAnswer: 1,
        feedback: [
          "Market makers don't set stock prices arbitrarily. Prices are determined by supply and demand in the market. Market makers facilitate trading by providing liquidity and narrowing the bid-ask spread.",
          "Correct! Market makers ensure smooth and efficient trading by always being ready to buy or sell securities. They provide liquidity to the market by continuously quoting both buy (bid) and sell (ask) prices, which helps narrow the bid-ask spread and makes it easier for investors to execute trades at fair prices.",
          "Market regulation is the responsibility of government agencies like the Securities and Exchange Commission (SEC) and self-regulatory organizations like FINRA, not market makers. Market makers must follow regulations but don't create or enforce them.",
          "Creating investment strategies is typically the role of investment advisors, portfolio managers, or individual investors. Market makers focus on facilitating trades and providing liquidity, not on developing investment strategies for clients.",
        ],
      },
      {
        question: "How do financial goals influence investment choices?",
        options: [
          "They have no significant impact",
          "They determine account type, tax advantages, and risk allocation",
          "They only affect retirement planning",
          "They are relevant only for large investors",
        ],
        correctAnswer: 1,
        feedback: [
          "This is incorrect. Financial goals have a profound impact on investment choices. They help determine everything from asset allocation to account types and investment vehicles.",
          "Correct! Financial goals are the foundation of investment planning. They influence which account types are most appropriate (e.g., 401(k), IRA, taxable account), which tax advantages to pursue, how much risk is appropriate, and how to allocate assets. Different goals (retirement, education, home purchase) require different investment approaches.",
          "While financial goals are important for retirement planning, they impact all types of investing. Short-term goals like saving for a house down payment require different investment strategies than long-term goals like retirement or education funding.",
          "Financial goals are important for all investors, regardless of portfolio size. In fact, clear goals may be even more critical for smaller investors who have less room for error and need to maximize the efficiency of their investments.",
        ],
      },
      {
        question: 'What are "listing requirements" in stock exchanges?',
        options: [
          "Personal qualifications for investors",
          "Rules for which companies can be traded",
          "Minimum investment amounts",
          "Trading hour regulations",
        ],
        correctAnswer: 1,
        feedback: [
          "Stock exchanges don't impose personal qualifications on individual investors. While brokers may have account minimums or requirements, the exchanges themselves don't restrict who can buy listed securities.",
          "Correct! Listing requirements are the standards companies must meet to have their shares traded on a particular stock exchange. These typically include minimum market capitalization, share price, number of shareholders, corporate governance standards, and financial reporting requirements. They help ensure that listed companies meet certain quality and transparency standards.",
          "Stock exchanges don't set minimum investment amounts for investors. Minimum investment amounts might be set by brokers or investment funds, but they're not listing requirements for exchanges.",
          "Trading hours are set by exchanges but aren't considered listing requirements. Listing requirements refer specifically to the criteria companies must meet to be listed on an exchange, not the operational rules of the exchange itself.",
        ],
      },
      {
        question: "The primary responsibility of stock market regulators is to:",
        options: [
          "Maximize investor profits",
          "Control stock prices",
          "Keep markets fair and protect investors",
          "Manage individual investment portfolios",
        ],
        correctAnswer: 2,
        feedback: [
          "Regulators don't aim to maximize profits for investors. Their role is to ensure fair, orderly, and efficient markets, not to guarantee returns. Investment performance depends on many factors beyond regulation.",
          "Regulators don't control or set stock prices. In free markets, prices are determined by supply and demand. Regulators may intervene in cases of market manipulation, but they don't control normal price movements.",
          "Correct! The primary responsibility of market regulators like the SEC is to maintain fair, orderly, and efficient markets while protecting investors. They do this by enforcing securities laws, requiring disclosure of important information, and preventing fraud and market manipulation.",
          "Regulators don't manage individual portfolios. That's the role of investment advisors, portfolio managers, or individual investors themselves. Regulators oversee the markets as a whole, not individual investment decisions.",
        ],
      },
    ],
    // Module 1.2 Recall Quiz
    "1.2.recall": [
      {
        question: "What is the main advantage of preferred stock over common stock?",
        options: [
          "Higher capital growth potential",
          "Ability to vote in company decisions",
          "Priority in receiving dividends",
          "Higher risk and volatility",
        ],
        correctAnswer: 2,
        feedback: [
          "Common stock typically has higher growth potential than preferred stock. Preferred stock is more focused on providing steady income rather than capital appreciation.",
          "Voting rights are typically a feature of common stock, not preferred stock. Preferred stockholders usually don't have voting rights unless the company fails to pay dividends for a specified period.",
          "Correct! Preferred stockholders have priority over common stockholders when it comes to receiving dividends. This means that if a company decides to pay dividends, preferred stockholders must be paid before common stockholders receive anything. This priority makes preferred stock more attractive to income-focused investors who want more certainty in their dividend payments.",
          "Preferred stock typically has lower risk and volatility compared to common stock. It behaves more like a bond in many ways, with more stable prices and predictable income streams.",
        ],
      },
      {
        question: "Which type of stock is best for investors seeking steady income?",
        options: ["Common stock", "Growth stock", "Preferred stock", "Small-cap stock"],
        correctAnswer: 2,
        feedback: [
          "Common stock may provide dividends, but they're not guaranteed and can be reduced or eliminated at the company's discretion. Common stock is generally better for growth than for steady income.",
          "Growth stocks typically reinvest their profits back into the business rather than paying dividends. They focus on capital appreciation rather than providing current income, making them unsuitable for investors seeking steady income.",
          "Correct! Preferred stock is specifically designed to provide steady income through regular dividend payments. These dividends are typically fixed and must be paid before any dividends to common stockholders, making preferred stock ideal for income-focused investors like retirees.",
          "Small-cap stocks are defined by their market capitalization size, not their dividend policy. While some small-cap stocks may pay dividends, they're generally considered growth investments and often have more volatile returns, making them less suitable for those seeking steady income.",
        ],
      },
      {
        question: "What does market capitalization measure?",
        options: [
          "The amount of debt a company has",
          "The company's total annual revenue",
          "The total market value of a company's outstanding shares",
          "The number of shares issued by a company",
        ],
        correctAnswer: 2,
        feedback: [
          "A company's debt is tracked on its balance sheet and is unrelated to market capitalization. Debt is an important financial metric, but it's not what market cap measures.",
          "Annual revenue refers to the money a company generates from its business operations in a year. This is different from market capitalization, which reflects the company's overall value as determined by the stock market.",
          "Correct! Market capitalization (or 'market cap') is calculated by multiplying the current share price by the total number of outstanding shares. It represents the total market value of a company's equity and is a key indicator of a company's size and classification (large-cap, mid-cap, small-cap).",
          "While the number of shares is used to calculate market capitalization, the share count alone doesn't indicate a company's value. A company could have many shares at a low price or few shares at a high price, resulting in very different market caps.",
        ],
      },
      {
        question: "A company with a market capitalization of $15 billion would be classified as:",
        options: ["Small-cap", "Mid-cap", "Large-cap", "Growth stock"],
        correctAnswer: 2,
        feedback: [
          "Small-cap companies typically have market capitalizations between $250 million and $2 billion. At $15 billion, this company would be well above the small-cap range.",
          "Mid-cap companies typically have market capitalizations between $2 billion and $10 billion. At $15 billion, this company would exceed the mid-cap range.",
          "Correct! Large-cap companies are generally defined as having market capitalizations of $10 billion or more. With a market cap of $15 billion, this company falls into the large-cap category, indicating it's a well-established company with significant market presence.",
          "Growth stock is an investment style, not a market capitalization classification. A company can be both a large-cap and a growth stock, or it could be a large-cap value stock. Market cap and investment style are separate classifications.",
        ],
      },
      {
        question: "Which of the following is true about large-cap stocks?",
        options: [
          "They are riskier than small-cap stocks",
          "They typically belong to well-established companies",
          "They always pay dividends",
          "They have higher growth potential than small-cap stocks",
        ],
        correctAnswer: 1,
        feedback: [
          "Large-cap stocks are generally considered less risky than small-cap stocks, not more risky. Their established business models, diversified revenue streams, and greater financial resources typically make them more stable investments.",
          "Correct! Large-cap stocks represent well-established companies with proven business models, substantial market share, and significant financial resources. These companies have typically been in business for many years and have demonstrated their ability to navigate various economic conditions.",
          "While many large-cap companies do pay dividends, it's not a universal characteristic. Some large-cap companies, particularly in the technology sector (like Amazon for many years), reinvest their profits rather than paying dividends. Dividend policy is separate from market capitalization.",
          "Small-cap stocks generally have higher growth potential than large-cap stocks. Large companies have already achieved significant scale, making it harder for them to maintain the same percentage growth rates as smaller companies that are still in earlier stages of their development.",
        ],
      },
      {
        question: "Which market cap category is best known for stability and lower risk?",
        options: ["Small-cap", "Mid-cap", "Large-cap", "Micro-cap"],
        correctAnswer: 2,
        feedback: [
          "Small-cap stocks typically offer higher growth potential but come with higher volatility and risk. They're more sensitive to economic downturns and have fewer resources to weather difficult periods.",
          "Mid-cap stocks offer a balance between growth and stability, with moderate risk. They're less stable than large-caps but more stable than small-caps.",
          "Correct! Large-cap stocks are best known for stability and lower risk. These companies typically have established business models, diversified revenue streams, strong balance sheets, and the resources to withstand economic challenges. They tend to be less volatile than smaller companies.",
          "Micro-cap stocks (companies with market caps below $250 million) are the smallest publicly traded companies and typically carry the highest risk. They often have unproven business models, limited resources, and are highly sensitive to market conditions.",
        ],
      },
      {
        question: "Which company is most likely to be classified as large-cap?",
        options: [
          "A newly launched AI startup",
          "A local retail chain with a $500 million market cap",
          "A multinational company like Microsoft",
          "A biotech firm with a $1 billion valuation",
        ],
        correctAnswer: 2,
        feedback: [
          "Newly launched startups typically have small market capitalizations, often in the micro-cap or small-cap range. They haven't yet had time to grow to large-cap status, which usually takes years of successful business operations.",
          "A company with a $500 million market cap would be classified as a small-cap stock, not a large-cap. Large-cap companies have market capitalizations of at least $10 billion.",
          "Correct! Multinational companies like Microsoft are classic examples of large-cap stocks. Microsoft's market capitalization is well over $1 trillion, making it one of the largest companies in the world. Large-cap companies typically have global operations, established business models, and significant market presence.",
          "A biotech firm with a $1 billion valuation would be classified as a small-cap stock. While $1 billion is substantial, it falls below the $10 billion threshold typically used to define large-cap companies.",
        ],
      },
    ],
    // Module 1.2 Application Quiz
    "1.2.application": [
      {
        question:
          "Apple Inc. has a market capitalization of USD 3.34 trillion as of April 2025. Which category does it belong to?",
        options: ["Large Cap", "Small Cap", "Mid Cap", "Growth Stock"],
        correctAnswer: 0,
        feedback: [
          "Correct! With a market capitalization of $3.34 trillion, Apple is firmly in the large-cap category. Large-cap stocks are generally defined as having market capitalizations of $10 billion or more, and Apple far exceeds this threshold as one of the largest companies in the world.",
          "Small-cap companies typically have market capitalizations between $250 million and $2 billion. Apple's $3.34 trillion market cap is over 1,500 times larger than the upper limit for small-caps.",
          "Mid-cap companies typically have market capitalizations between $2 billion and $10 billion. Apple's $3.34 trillion market cap is over 330 times larger than the upper limit for mid-caps.",
          "Growth stock is an investment style, not a market capitalization classification. While Apple has shown growth characteristics over its history, the question specifically asks about its market cap category, which is large-cap. A company can be both a large-cap and a growth stock.",
        ],
      },
      {
        question:
          "A retiree is looking to invest in stocks that provide a steady stream of income through dividends. Which of the following stocks would be most suitable?",
        options: [
          "Tesla (which reinvests earnings for growth)",
          "Procter & Gamble (which has a long history of dividend payments)",
          "A small-cap biotech startup",
          "A technology ETF focused on high-growth companies",
        ],
        correctAnswer: 1,
        feedback: [
          "Tesla is a growth-oriented company that reinvests its earnings rather than paying dividends. It doesn't currently pay dividends, making it unsuitable for a retiree seeking income through dividends.",
          "Correct! Procter & Gamble (P&G) is an excellent choice for income-focused investors like retirees. P&G is a dividend aristocrat, having increased its dividend for over 60 consecutive years. It offers a stable business model, consistent cash flows, and a commitment to returning value to shareholders through dividends.",
          "Small-cap biotech startups typically don't pay dividends as they reinvest any earnings (if they have any) back into research and development. Many are pre-profit and focus on growth rather than providing shareholder income, making them unsuitable for retirees seeking dividend income.",
          "Technology ETFs focused on high-growth companies typically have low dividend yields, as growth companies tend to reinvest earnings rather than pay dividends. While these ETFs might offer capital appreciation, they're not designed to provide the steady income stream that the retiree is seeking.",
        ],
      },
      {
        question:
          "In 2025, a new startup in the AI industry launches an IPO with a market capitalization of $800 million. What classification does this stock fall under?",
        options: ["Large Cap", "Mid Cap", "Small Cap", "Dividend Stock"],
        correctAnswer: 2,
        feedback: [
          "Large-cap companies typically have market capitalizations of $10 billion or more. At $800 million, this AI startup falls well below the large-cap threshold.",
          "Mid-cap companies typically have market capitalizations between $2 billion and $10 billion. At $800 million, this AI startup falls below the mid-cap range.",
          "Correct! With a market capitalization of $800 million, this AI startup would be classified as a small-cap stock. Small-cap companies typically have market capitalizations between $250 million and $2 billion. Small-caps often offer higher growth potential but come with higher volatility and risk.",
          "Dividend stock is an investment style based on a company's dividend policy, not a market capitalization classification. As a newly public AI startup, this company is unlikely to pay dividends initially, as most tech startups reinvest earnings for growth rather than paying dividends.",
        ],
      },
      {
        question:
          "An investor buys shares of NVIDIA, a company known for its rapid innovation and high reinvestment in research and development. NVIDIA does not pay dividends but has seen significant stock price appreciation. What type of stock is this?",
        options: ["Growth Stock", "Value Stock", "Dividend Stock", "Preferred Stock"],
        correctAnswer: 0,
        feedback: [
          "Correct! NVIDIA is a classic example of a growth stock. Growth stocks are characterized by companies that reinvest earnings back into the business to fuel expansion, innovation, and market share gains rather than paying dividends. They typically show above-average revenue and earnings growth, and investors buy them primarily for capital appreciation rather than income.",
          "Value stocks are typically companies trading below what analysts believe is their intrinsic value, often with lower price-to-earnings ratios. NVIDIA, with its high valuation multiples and focus on growth rather than current profitability, doesn't fit the value stock profile.",
          "Dividend stocks are companies that regularly distribute a portion of their earnings to shareholders. Since NVIDIA doesn't pay dividends and instead reinvests in R&D, it's not a dividend stock.",
          "Preferred stock is a specific class of stock that typically pays fixed dividends and has priority over common stock for dividend payments and asset distribution. The question refers to NVIDIA's common stock, not a preferred stock offering.",
        ],
      },
      {
        question:
          "A cautious investor wants to invest in a stock with lower risk, steady dividends, and strong brand recognition. Which of the following would be the best choice?",
        options: [
          "Microsoft",
          "A newly listed e-commerce startup",
          "A high-growth cryptocurrency mining company",
          "A biotech company in clinical trial phases",
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! Microsoft is an excellent choice for a cautious investor seeking lower risk, steady dividends, and strong brand recognition. As a large-cap technology company with diverse revenue streams, strong cash flow, and a history of dividend payments, Microsoft offers stability while still providing growth potential. Its established market position and strong brand recognition further reduce risk.",
          "A newly listed e-commerce startup would be inappropriate for a cautious investor. New companies have unproven business models, no dividend history, and typically experience high volatility. They lack the brand recognition and stability the investor is seeking.",
          "High-growth cryptocurrency mining companies are highly speculative investments with extreme volatility. They typically don't pay dividends, have uncertain business models dependent on cryptocurrency prices, and would be completely unsuitable for a cautious investor seeking stability.",
          "Biotech companies in clinical trial phases are highly speculative investments. Their success depends on clinical outcomes that are difficult to predict, they typically don't pay dividends, and they can experience dramatic price swings based on trial results. This would be inappropriate for a cautious investor.",
        ],
      },
      {
        question:
          "Tesla's stock is highly volatile and has historically shown rapid price increases but does not pay dividends. Which type of investor would benefit the most from holding Tesla stock?",
        options: [
          "Someone looking for steady income",
          "A risk-tolerant investor seeking high growth",
          "A retiree looking for stability",
          "A bond investor",
        ],
        correctAnswer: 1,
        feedback: [
          "Investors seeking steady income typically look for stocks that pay regular dividends. Since Tesla doesn't pay dividends, it wouldn't meet the needs of income-focused investors.",
          "Correct! Tesla is best suited for risk-tolerant investors seeking high growth. Its volatile price movements, lack of dividends, and focus on reinvesting for future growth make it appropriate for investors who can tolerate significant price swings and have a long-term growth perspective. These investors prioritize capital appreciation over current income or stability.",
          "Retirees typically prioritize capital preservation, income generation, and lower volatility. Tesla's high volatility and lack of dividends make it poorly suited for most retirees looking for stability in their portfolios.",
          "Bond investors typically seek fixed income and capital preservation. Tesla stock, with its high volatility, growth orientation, and lack of income, has characteristics almost completely opposite to bonds. It would be inappropriate for a typical bond investor's objectives.",
        ],
      },
    ],
  }
    */
  // Get the current quiz based on module and quiz type
  const getCurrentQuiz = () => {
    const quizKey = `${currentStep}.${currentModule}.${quizType}`
    return quizData[quizKey] || []
  }

  const currentStepData = {
    id: currentStep,
    title: currentStep === 1 ? "Introduction to Stock Market Basics" : `Section ${currentStep}`,
    modules: [
      {
        id: currentModule,
        title:
          currentStep === 1 && currentModule === 1
            ? "What is the Stock Market?"
            : currentStep === 1 && currentModule === 2
              ? "Types of Stocks"
              : `Module ${currentStep}.${currentModule}`,
        contentSections: moduleContent[currentStep - 1] || moduleContent[0],
        quiz: getCurrentQuiz(),
      },
    ],
  }

  const currentModuleData = {
    ...currentStepData.modules[0],
    contentSections:
      currentStep === 1
        ? currentModule === 1
          ? moduleContent[0]
          : moduleContent[currentModule - 1]
        : moduleContent[currentStep - 1]
          ? moduleContent[currentStep - 1][currentModule - 1] || []
          : [],
  }

  // Get the content after defining currentModuleData
  const currentQuiz = currentModuleData.quiz
  const currentContent = Array.isArray(currentModuleData.contentSections) ? currentModuleData.contentSections : []

  // Check if a module is completed
  const isModuleCompleted = (sectionId, moduleId) => {
    return !!completedModules[`${sectionId}.${moduleId}`]
  }

  // Check if a quiz is completed
  const isQuizCompleted = (sectionId, moduleId, quizType = "mixed") => {
    const quizKey = `${sectionId}.${moduleId}.${quizType}`
    return !!completedQuizzes[quizKey]
  }

  const handleCompleteModule = () => {
    // Mark this module as completed in localStorage
    
    const savedProgress = localStorage.getItem("courseProgress")
    const progress = savedProgress
      ? JSON.parse(savedProgress)
      : {
          currentStep: 1,
          currentModule: 1,
          completedModules: {},
          completedQuizzes: {},
          quizScores: {},
          quizAnswers: {},
        }

    // Mark this module as completed
    if (contentType === "content") {
      progress.completedModules = {
        ...progress.completedModules,
        [`${currentStep}.${currentModule}`]: true,
      }

      // Update state
      setCompletedModules((prev) => ({
        ...prev,
        [`${currentStep}.${currentModule}`]: true,
      }))

      progress.completedModules[`${currentStep}.${currentModule}`] = true

      // Navigate to the quiz for this module
      navigate(`/course-content?step=${currentStep}&module=${currentModule}&type=quiz&quizType=${quizType}`)
    } else if (contentType === "quiz" && quizScore >= 80) {
      const quizKey = `${currentStep}.${currentModule}.${quizType}`
      const moduleKey = `${currentStep}.${currentModule}`
    
      progress.completedQuizzes = {
        ...progress.completedQuizzes,
        [quizKey]: true,
      }
    
      progress.completedModules = {
        ...progress.completedModules,
        [moduleKey]: true,
      }
    
      setCompletedQuizzes({
        ...completedQuizzes,
        [quizKey]: true,
      })
    
      setCompletedModules({
        ...completedModules,
        [moduleKey]: true,
      })
    
      // Navigate back to courses
      navigate(`/courses`)
    }
    

    // Save updated progress
    localStorage.setItem("courseProgress", JSON.stringify(progress))
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    })

    setAnswerSubmitted(true)
  }

  const calculateScore = () => {
    let correctAnswers = 0
    let incorrectAnswers = 0

    Object.entries(selectedAnswers).forEach(([questionIndex, answerIndex]) => {
      if (currentQuiz[Number.parseInt(questionIndex)].correctAnswer === Number.parseInt(answerIndex)) {
        correctAnswers++
      } else {
        incorrectAnswers++
      }
    })

    // If hearts system is enabled, lose a heart for each incorrect answer
    if (heartsSystem && incorrectAnswers > 0) {
      if (heartsRef.current && typeof heartsRef.current.loseHeart === "function") {
        for (let i = 0; i < incorrectAnswers; i++) {
          heartsRef.current.loseHeart()
        }
      }
    }

    const score = Math.round((correctAnswers / currentQuiz.length) * 100)
    setQuizScore(score)
    return score
  }

  // Update the handleCompleteQuiz function to mark the module as completed when the quiz is passed
  const handleCompleteQuiz = () => {
    const score = calculateScore()
    setQuizScore(score)
    setQuizCompleted(true)

    // Save the quiz answers
    const quizKey = `${currentStep}.${currentModule}.${quizType}`
    const newSavedAnswers = {
      ...savedAnswers,
      [quizKey]: selectedAnswers,
    }
    setSavedAnswers(newSavedAnswers)

    // If score is 80% or higher, mark this module as completed
    // Get existing progress
    const savedProgress = localStorage.getItem("courseProgress")
    const progress = savedProgress
      ? JSON.parse(savedProgress)
      : {
          currentStep: 1,
          currentModule: 1,
          completedModules: {},
          completedQuizzes: {},
          quizScores: {},
          quizAnswers: {},
        }

    // Mark this quiz as completed
    if (!progress.completedQuizzes) {
      progress.completedQuizzes = {}
    }

    progress.completedQuizzes[quizKey] = true

    // Always store the quiz score, regardless of pass/fail
    if (!progress.quizScores) {
      progress.quizScores = {}
    }
    progress.quizScores[quizKey] = score

    // Store the quiz answers
    if (!progress.quizAnswers) {
      progress.quizAnswers = {}
    }
    progress.quizAnswers[quizKey] = selectedAnswers

    // Update the state
    setCompletedQuizzes({
      ...completedQuizzes,
      [quizKey]: true,
    })

    // Update quiz scores state
    setQuizScores({
      ...quizScores,
      [quizKey]: score,
    })

    // Save updated progress
    localStorage.setItem("courseProgress", JSON.stringify(progress))
  }

  const resetQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setQuizScore(0)
    setAnswerSubmitted(false)
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index)
    // Keep answerSubmitted state if an answer was already selected for this question
    setAnswerSubmitted(selectedAnswers[index] !== undefined)
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(newIndex)
      setAnswerSubmitted(selectedAnswers[newIndex] !== undefined)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      const newIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(newIndex)
      setAnswerSubmitted(selectedAnswers[newIndex] !== undefined)
    }
  }

  const goToPreviousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
    }
  }

  const goToNextContent = () => {
    if (currentContentIndex < currentContent.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
    }
  }

  const goBackToCourses = () => {
    navigate("/courses")
  }

  const toggleSectionExpand = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleSectionClick = (sectionId) => {
    setCurrentStep(sectionId)
    setCurrentModule(1)
    setExpandedSection(sectionId)
    navigate(`/course-content?step=${sectionId}&module=1&type=content`)
  }

  const handleModuleClick = (sectionId, moduleId) => {
    setCurrentStep(sectionId)
    setCurrentModule(moduleId)
    setCurrentContentIndex(0)
    navigate(`/course-content?step=${sectionId}&module=${moduleId}&type=content`)
  }

  const handleSectionComplete = (sectionId) => {
    if (!completedSteps.includes(sectionId)) {
      setCompletedSteps([...completedSteps, sectionId])
    }

    // Move to next section if available
    if (sectionId < 3) {
      setCurrentStep(sectionId + 1)
      setCurrentModule(1)
      setExpandedSection(sectionId + 1)
      navigate(`/course-content?step=${sectionId + 1}&module=1&type=content`)
    }
  }

  const getQuizScore = (step, module, quizType = "mixed") => {
    const quizKey = `${step}.${module}.${quizType}`
    return quizScores[quizKey] || 0
  }

  // Get quiz title based on current module and quiz type
  const getQuizTitle = () => {
    if (currentStep === 1) {
      if (currentModule === 1) {
        return "Module 1.1: Quiz"
      } else if (currentModule === 2) {
        if (quizType === "recall") {
          return "Module 1.2: Recall Quiz"
        } else if (quizType === "application") {
          return "Module 1.2: Application Quiz"
        }
      }
    }
    return `Module ${currentStep}.${currentModule} Quiz`
  }

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const stepModuleCounts = {
  1: 6,
  2: 1,
 }

  const goToNextModule = () => {
    // Navigate to the next module or section
    const totalModules = stepModuleCounts[currentStep] || 0

    if (currentModule < totalModules) {
      navigate(`/course-content?step=${currentStep}&module=${currentModule + 1}&type=content`)
    } else if (currentStep < Object.keys(stepModuleCounts).length) {
      navigate(`/course-content?step=${currentStep + 1}&module=1&type=content`)
    } else {
      navigate("/courses")
    }
  }

  /*const handleGoToNext = () => {
    if (contentType === "content") {
      if (currentContentIndex < moduleContent[currentModuleIndex].length - 1) {
        setCurrentContentIndex(currentContentIndex + 1)
      } else {
        // Mark the current module as completed
        const moduleKey = `${currentStep}.${currentModule}`
        const updatedCompletedModules = {
          ...completedModules,
          [moduleKey]: true,
        }
        setCompletedModules(updatedCompletedModules)

        // Save to localStorage
        const savedProgress = localStorage.getItem("courseProgress")
        const progress = savedProgress ? JSON.parse(savedProgress) : {}
        progress.completedModules = updatedCompletedModules
        localStorage.setItem("courseProgress", JSON.stringify(progress))

        // Direct to the appropriate quiz based on the current module
        if (currentStep === 1 && currentModule === 1) {
          navigate(`/course-content?module=${currentModule}&step=${currentStep}&type=quiz&quizType=mixed&mode=normal`)
          setContentType("quiz")
          setShowQuiz(true)
          return
        } else if (currentStep === 1 && currentModule === 2) {
          navigate(`/course-content?module=${currentModule}&step=${currentStep}&type=quiz&quizType=recall&mode=normal`)
          setContentType("quiz")
          setShowQuiz(true)
        } else if (moduleContent[currentModuleIndex].length > 0) {
          navigate(`/course-content?module=${currentModule}&step=${currentStep}&type=quiz&quizType=mixed&mode=normal`)
          setContentType("quiz")
          setShowQuiz(true)
        } else {
          goToNextModule()
        }
      }
    } else if (contentType === "quiz") {
      // Handle quiz completion and navigation
      if (quizCompleted) {
        goToNextModule()
      }
    }
  }
  */
  const handleGoToNext = () => {
    if (contentType === "content") {
      const moduleKey = `${currentStep}.${currentModule}`
      const updatedCompletedModules = {
        ...completedModules,
        [moduleKey]: true,
      }
      setCompletedModules(updatedCompletedModules)
    
      const savedProgress = localStorage.getItem("courseProgress")
      const progress = savedProgress ? JSON.parse(savedProgress) : {}
      progress.completedModules = updatedCompletedModules
      localStorage.setItem("courseProgress", JSON.stringify(progress))
    
      goToNextModule()
    }
    
    

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
            onClick={goBackToCourses}
            className="flex items-center text-white hover:text-[#f0d878] transition-colors transform hover:scale-105"
          >
            <ChevronLeft className="mr-1" />
            Back to Courses
          </button>
          <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">Course Content</h1>
          <div className="flex items-center space-x-4">
            <Hearts onHeartLost={handleHeartLost} onHeartGained={handleHeartGained} ref={heartsRef} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-500 hover:shadow-xl">
          {/* Course Navigation Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>
              Section {currentStep}: {currentStepData.title}
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>
              Module {currentStep}.{currentModule}: {currentModuleData.title}
            </span>
            {contentType === "quiz" && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-[#5a7d53] font-medium">{getQuizTitle()}</span>
              </>
            )}
          </div>

          {/* Content Type Indicator */}
          <div className="mb-6 flex items-center space-x-2">
            {contentType === "content" ? (
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Learning Content</span>
              </div>
            ) : (
              <>
                <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{getQuizTitle()}</span>
                </div>
                {quizMode === "retake" && (
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    <span>Retake Mode</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Module Completion Status */}
          {contentType === "content" && isModuleCompleted(currentStep, currentModule) && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeInOnce">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-800">
                  <strong>Module Completed!</strong> You've already completed this module. Feel free to review the
                  content.
                </p>
              </div>
            </div>
          )}

          {/* Quiz Completion Status */}
          {contentType === "quiz" &&
            isQuizCompleted(currentStep, currentModule, quizType) &&
            !quizCompleted &&
            quizMode === "normal" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeInOnce">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-800">
                    <strong>Quiz Completed!</strong> You've already passed this quiz with a score of{" "}
                    {getQuizScore(currentStep, currentModule, quizType)}%. You can retake the quiz or continue to the
                    next module.
                  </p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => {
                      setQuizCompleted(true)
                      setQuizScore(getQuizScore(currentStep, currentModule, quizType) || 80)
                    }}
                    className="bg-[#5a7d53] text-white px-4 py-2 rounded-lg hover:bg-[#4a6a45] transition-colors"
                  >
                    View Results
                  </button>
                  <button
                    onClick={goBackToCourses}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Courses
                  </button>
                </div>
              </div>
            )}

          {showQuiz ? (
            <div className="max-w-3xl mx-auto animate-fadeInOnce">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                {quizCompleted ? (
                  <div className="text-center py-8" ref={confettiRef}>
                    <div
                      className={`w-24 h-24 ${quizScore >= 80 ? "bg-[#5a7d53]" : "bg-[#e07a5f]"} rounded-full flex items-center justify-center mx-auto mb-6 ${quizMode !== "review" ? "animate-bounce" : ""}`}
                    >
                      {quizScore >= 80 ? (
                        <Award className="w-12 h-12 text-white" />
                      ) : (
                        <AlertTriangle className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-[#5a7d53] mb-4">Quiz Completed!</h2>
                    <div className="mb-8">
                      <div className="w-48 h-48 mx-auto relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={quizScore >= 80 ? "#5a7d53" : "#e07a5f"}
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * quizScore) / 100}
                            transform="rotate(-90 50 50)"
                            className="animate-scoreReveal"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold animate-fadeIn">{quizScore}%</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-4 animate-fadeIn">
                        {quizScore >= 80
                          ? "Congratulations! You've mastered this module. Your score has been saved."
                          : "You need to score at least 80% to pass this quiz. Review the material and try again."}
                      </p>

                      {/* Add a summary of correct/incorrect answers */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
                        <p className="font-medium text-gray-700">
                          You answered{" "}
                          {
                            Object.keys(selectedAnswers).filter(
                              (questionIndex) =>
                                currentQuiz[Number.parseInt(questionIndex)].correctAnswer ===
                                Number.parseInt(selectedAnswers[questionIndex]),
                            ).length
                          }{" "}
                          out of {currentQuiz.length} questions correctly.
                        </p>
                      </div>

                      {/* Passing threshold indicator */}
                      <div className="mt-6 flex items-center justify-center space-x-2">
                        <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                          80%
                        </div>
                        <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Passing Threshold</p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetQuiz}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors transform hover:scale-105"
                      >
                        Retake Quiz
                      </button>

                      {quizScore >= 80 && (
                        <button
                          onClick={handleCompleteModule}
                          className="bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-colors transform hover:scale-105 hover:bg-[#4a6a45]"
                        >
                          Continue to Next Module
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#5a7d53]">{getQuizTitle()}</h2>
                      <span className="text-gray-500">
                        Question {currentQuestionIndex + 1} of {currentQuiz.length}
                      </span>
                    </div>

                    {/* Progress bar with animation */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                      <div
                        className="h-full bg-[#5a7d53] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Question navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentQuiz.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-300 transform ${
                            currentQuestionIndex === index
                              ? "bg-[#5a7d53] text-white scale-110"
                              : selectedAnswers[index] !== undefined
                                ? "bg-[#f0d878] text-[#5a7d53] hover:scale-110"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-110"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    {currentQuiz && currentQuiz.length > 0 ? (
                      <div className="bg-[#f0f9f4] p-6 rounded-lg mb-8 shadow-md">
                        <div className="flex items-start mb-6">
                          <HelpCircle className="w-6 h-6 text-[#5a7d53] mr-3 mt-1 flex-shrink-0" />
                          <h3 className="text-xl font-bold text-[#5a7d53]">
                            {currentQuiz[currentQuestionIndex]?.question || "Loading question..."}
                          </h3>
                        </div>

                        <div className="space-y-3 mt-6">
                          {currentQuiz[currentQuestionIndex]?.options.map((option, index) => {
                            const isSelected = selectedAnswers[currentQuestionIndex] === index
                            const isCorrect = currentQuiz[currentQuestionIndex]?.correctAnswer === index

                            return (
                              <div key={index} className="mb-4">
                                <button
                                  onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                                    isSelected
                                      ? isCorrect
                                        ? "border-green-500 bg-green-50"
                                        : "border-red-500 bg-red-50"
                                      : answerSubmitted
                                        ? "border-gray-200 opacity-70"
                                        : "border-gray-200 hover:border-[#5a7d53] hover:shadow-sm"
                                  }`}
                                  disabled={answerSubmitted}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-colors ${
                                        isSelected
                                          ? isCorrect
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                          : answerSubmitted && isCorrect
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + index)}
                                    </div>
                                    <span>{option}</span>
                                    {isSelected &&
                                      (isCorrect ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-500 ml-2" />
                                      ))}
                                    {!isSelected && answerSubmitted && isCorrect && (
                                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                                    )}
                                  </div>

                                  {/* Show feedback inline when an answer is submitted */}
                                  {answerSubmitted && currentQuiz[currentQuestionIndex]?.feedback && (
                                    <div className="mt-2 text-sm">
                                      <p
                                        className={`${
                                          isCorrect ? "text-green-700" : isSelected ? "text-red-700" : "text-gray-600"
                                        }`}
                                      >
                                        {currentQuiz[currentQuestionIndex].feedback[index]}
                                      </p>
                                    </div>
                                  )}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No quiz questions available for this module yet.</p>
                        <button
                          onClick={() =>
                            navigate(`/course-content?step=${currentStep}&module=${currentModule}&type=content`)
                          }
                          className="mt-4 bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#4a6a45] transform hover:scale-105"
                        >
                          Return to Content
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300 ${
                          currentQuestionIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-300 transform hover:scale-105"
                        }`}
                      >
                        <ArrowLeft className="mr-1" /> Previous
                      </button>

                      {currentQuestionIndex < currentQuiz.length - 1 ? (
                        <button
                          onClick={goToNextQuestion}
                          className="flex items-center bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#4a6a45] transform hover:scale-105"
                        >
                          Next <ArrowRight className="ml-1" />
                        </button>
                      ) : (
                        <button
                          onClick={handleCompleteQuiz}
                          className="flex items-center bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#4a6a45] transform hover:scale-105"
                        >
                          Complete Quiz <ChevronRight className="ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-fadeInOnce">
              <h2 className="text-2xl font-bold text-[#5a7d53] mb-6">
                Section {currentStep}: {currentStepData.title}
              </h2>
              <h3 className="text-xl font-bold text-[#5a7d53] mb-4">
                Module {currentStep}.{currentModule}: {currentModuleData.title}
              </h3>

              {currentContent.length > 0 && (
                <div className="mt-6">
                  {/* Content navigation */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#5a7d53]">{currentContent[currentContentIndex].title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">
                        Section {currentContentIndex + 1} of {currentContent.length}
                      </span>
                    </div>
                  </div>

                  {/* Content card with animation */}
                  <div className="bg-white border-2 border-[#5a7d53] rounded-xl shadow-lg p-6 mb-6 transition-all duration-500 transform animate-fadeSlideInOnce">
                    {currentContent[currentContentIndex].content}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={goToPreviousContent}
                      disabled={currentContentIndex === 0}
                      className={`flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-300 ${
                        currentContentIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-300 transform hover:scale-105"
                      }`}
                    >
                      <ArrowLeft className="mr-1" /> Previous
                    </button>

                    {/* Section navigation dots with hover effects */}
                    <div className="flex items-center space-x-2">
                      {currentContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentContentIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                            currentContentIndex === index ? "bg-[#5a7d53]" : "bg-gray-300 hover:bg-[#85bb65]"
                          }`}
                          aria-label={`Go to section ${index + 1}`}
                        />
                      ))}
                    </div>

                    {currentContentIndex < currentContent.length - 1 ? (
                      <button
                        onClick={goToNextContent}
                        className="flex items-center bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#4a6a45] transform hover:scale-105"
                      >
                        Next <ArrowRight className="ml-1" />
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        {isModuleCompleted(currentStep, currentModule) ? (
                          <button
                            onClick={() => {
                              // For module 1.1, go to the module 1.1 quiz
                              if (currentStep === 1 && currentModule === 1) {
                                navigate(
                                  `/course-content?step=${currentStep}&module=${currentModule}&type=quiz&quizType=mixed&mode=normal`,
                                )
                              }
                              // Otherwise, navigate to next module or next section
                              else if (currentModule < moduleContent[currentStep - 1].length) {
                                navigate(`/course-content?step=${currentStep}&module=${currentModule + 1}&type=content`)
                              } else if (currentStep < moduleContent.length) {
                                navigate(`/course-content?step=${currentStep + 1}&module=1&type=content`)
                              } else {
                                navigate(`/courses`)
                              }
                            }}
                            className="flex items-center bg-[#85bb65] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#75a758] transform hover:scale-105"
                          >
                            Next Step <ChevronRight className="ml-1" />
                          </button>
                        ) : (
                          <button
                            onClick={handleCompleteModule}
                            className="flex items-center bg-[#5a7d53] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#4a6a45] transform hover:scale-105 animate-pulse"
                          >
                            Complete Module <ChevronRight className="ml-1" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scoreReveal {
          from { stroke-dashoffset: 283; }
          to { stroke-dashoffset: ${283 - (283 * quizScore) / 100}; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInOnce {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeSlideInOnce {
          animation: fadeSlideIn 0.5s ease-out forwards;
        }
        
        .animate-scoreReveal {
          animation: scoreReveal 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default CourseContent
