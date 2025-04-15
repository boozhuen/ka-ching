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
            const hasAnswers = progress.quizAnswers && progress.quizAnswers[quizKey] //to be double triple sure
            //setQuizScore(progress.quizScores[quizKey] || 80) maybe this is the error
            const storedScore = progress.quizScores[quizKey]
            if (storedScore !== undefined && hasAnswers) {
              setQuizCompleted(true)
              setQuizScore(storedScore)
            }
            else if (storedScore !== undefined) {
              setQuizScore(storedScore)
            }
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
//Section 1
    [
    
    // SECTION 1 MODULE 1
    [
      {
        title: "Start with your Why",
        type: "content",
        content:(<div className="space-y-6 text-base leading-relaxed">
          <p className="text-sm text-gray-600 italic">
            💡 Hover over the <span className="text-blue-600"> blue </span> terms for quick explanations.
            </p>
            <div>
    <h3 className="text-lg font-semibold">🎯 Start with Why</h3>
    <p>
      Don’t start with what to invest in—start with <strong>why</strong>. Is it for a house? Retirement? An emergency?
      Your goal shapes everything else.
    </p>
  </div>

  <div>
    <h3 className="text-lg font-semibold">⏳ Time Affects Strategy</h3>
    <p>
      Short-term vs. long-term goals need different plans. A 30-year goal lets you take more 
          <span className="text-blue-600 tooltip-wrapper">
            risk
            <div className="tooltip-box">
              <p className="tooltip-text font-medium mb-1">Risk = chance you lose money.</p>
              <ul className="list-none pl-4 m-0 space-y-1">
                <li>Buying from a thrift shop:A branded tee for $5? Might be real (win!) or fake (loss)."</li>
                <li>It’s a gamble 🎲—you could score big 💰 or waste your cash 💸</li>
                <li>That’s risk. The bigger the deal, the bigger the risk.</li>
              </ul>
            </div>
          </span>
          
          A 1-year goal? Keep it stable and {" "}
          <span className="text-blue-600 tooltip-wrapper">
            liquid
            <div className="tooltip-box">
              <p className="tooltip-text font-medium mb-1">Liquidity = how fast you can sell for cash.</p>
              <ul className="list-none pl-4 m-0 space-y-1">
                <li>💸 Cash? Instant</li>
                <li>🎮 Console? Takes a bit</li>
                <li>🎨 Art? Might take a looooong while</li>
              </ul>
            </div>
          </span>
          
    </p>
  </div>

  <div>
    <h3 className="text-lg font-semibold">⚠️ Risk Over Time</h3>
    <p>
      The longer you invest, the more ups and downs your money can handle. <span title="Risk = chance you lose money. Buying from a thrift shop:A branded tee for $5? Might be real (win!) or fake (loss). It’s a gamble 🎲—you could score big 💰 or waste your cash 💸 That’s risk. The bigger the deal, the bigger the risk." className="text-blue-600 tooltip">Risk</span> evens out over time—so don’t fear it if you’re in for the long haul.
    </p>
  </div>

  <div>
    <h3 className="text-lg font-semibold">💧 Liquidity = Access</h3>
    <p>
    <span title="Liquidity = how fast you can sell for cash. Cash? Instant 💸 Console? Takes a bit 🎮 Art? Might take a looooong while 🎨" className="text-blue-600 tooltip"> Liquidity</span> means how fast you can turn your investment into cash.
      If you need the money soon, choose something easy to access. 
    </p>
  </div>
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
              A{" "}
              <span title="A stock is a tiny slice of ownership in a company. Owning stock means you're a part-owner and share in its profits (or losses)! 📈" className="text-blue-600 tooltip">
                stock
              </span>{" "}
              is a part ownership in a company.
            </p>
            <p className="mb-3">
              You can earn from stocks through{" "}
              <span title="Capital appreciation is when your investment grows in value over time—basically, buying low, selling high, and pocketing the difference! 🚀" className="text-blue-600 tooltip">
                capital appreciation
              </span>{" "}
              or{" "}
              <span title="Dividends are like little bonus payments companies give shareholders as a 'thank you' for owning their stock! 💸" className="text-blue-600 tooltip">
                dividends
              </span>
              .
            </p>
            <p className="mb-3 font-semibold">Why do companies sell stock?</p>
            <p className="mb-3">To raise money and grow their business.</p>
            <p className="mb-3">Selling <span title="Shares are units of stock. Imagine a pizza: the pizza is the stock, and each slice is a share. The more slices (shares) you have, the bigger your piece of the company! 🍕" className="text-blue-600 tooltip">shares</span> helps fund things like expansion, research, or paying off debt.</p>
          </div>
        ),
      },
    ],
    // SECTION 1 MODULE 3
    [
      {
        title: "Meet the Markets",
        type: "content",
        content: (
          <div className="space-y-4">
            <p className="mb-3">
              Stock markets, also known as stock exchanges, are like an auction house — matching buyers and sellers via
              online brokers.
            </p>
            <p className="mb-3">There are many stock exchanges around the world.</p>
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
        content: (
          <div className="space-y-4">
            <p className="mb-3 font-semibold">🟢 What Is It?</p>
            <p className="mb-3">
              The <strong>Primary Market</strong> is where new stocks are sold for the first time.
            </p>

            <p className="mb-3 font-semibold">💰 Who Gets the Money?</p>
            <p className="mb-3">
              When you buy a stock here, <strong>the company gets the money</strong>. You are investing directly into
              the business.
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
            <p>
              <strong>🟢 What Is It?</strong>
            </p>
            <p>
              The <strong>Secondary Market</strong> is where existing stocks are bought and sold between investors.
            </p>
            <p>🏢 The company doesn't receive money in these trades.</p>

            <p>
              <strong>🎟️ A Simple Example</strong>
            </p>
            <p>Imagine you bought tickets to a concert and can't go, so you sell them to a friend.</p>
            <p>
              That's like a stock trade in the secondary market. You're not paying the artist again—just reselling the
              ticket.
            </p>

            <p>
              <strong>🔍 Why It Matters</strong>
            </p>
            <ul>
              <li>✅ You can buy or sell stocks anytime</li>
              <li>💲 Helps find the market price of a stock</li>
              <li>🔁 Keeps the market active and easy to trade in</li>
            </ul>

            <p>
              <strong>🛍️ Two Types of Secondary Markets</strong>
            </p>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {/* Dealer Market */}
              <div
                style={{ flex: "1", minWidth: "250px", border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}
              >
                <h4>1. Dealer Market</h4>
                <ul>
                  <li>
                    You trade through a middleman called a <strong>market maker</strong>
                  </li>
                  <li>They hold inventory and decide prices</li>
                  <li>
                    <strong>Example:</strong> NASDAQ
                  </li>
                </ul>
              </div>

              {/* Auction Market */}
              <div
                style={{ flex: "1", minWidth: "250px", border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}
              >
                <h4>2. Auction Market</h4>
                <ul>
                  <li>Buyers and sellers trade directly</li>
                  <li>Prices are matched based on highest bid and lowest ask</li>
                  <li>
                    <strong>Example:</strong> NYSE
                  </li>
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
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
              🚀 How Companies Sell Stocks
            </h3>
            <p style={{ marginBottom: "1rem" }}>
              To sell stocks, a company must go public via an <strong>IPO</strong> (Initial Public Offering). The
              process includes:
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
            <div
              style={{ flex: "1", minWidth: "280px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📈 Common Stock</h3>
              <p>
                <strong>What:</strong> The most typical stock
              </p>
              <p>
                <strong>🎯 Perks:</strong>{" "}
                <span
                  title="Gives shareholders the ability to vote on major company decisions"
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                >
                  Voting rights
                </span>{" "}
                and potential for{" "}
                <span
                  title="When a stock increases in value over time"
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                >
                  capital appreciation
                </span>
                .
              </p>
              <p>
                <strong>👤 Best for:</strong>
              </p>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>Long-term investors</li>
                <li>
                  Those seeking{" "}
                  <span
                    title="Increase in the value of your investment over time"
                    style={{ textDecoration: "underline dotted", cursor: "help" }}
                  >
                    capital appreciation
                  </span>
                </li>
                <li>
                  <span
                    title="Comfortable with higher price swings and potential losses for long-term gain"
                    style={{ textDecoration: "underline dotted", cursor: "help" }}
                  >
                    Risk-tolerant
                  </span>{" "}
                  investors
                </li>
              </ul>
            </div>

            {/* Preferred Stock */}
            <div
              style={{ flex: "1", minWidth: "280px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>💰 Preferred Stock</h3>
              <p>
                <strong>What:</strong> A stock with more{" "}
                <span
                  title="Regular income payments made to shareholders, like interest"
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                >
                  yields
                </span>{" "}
                and fewer rights
              </p>
              <p>
                <strong>🎯 Perks:</strong> Priority when it comes to receiving dividends, but no{" "}
                <span
                  title="No ability to vote on major company matters like mergers or board elections"
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                >
                  voting rights
                </span>
                .
              </p>
              <p>
                <strong>👤 Best for:</strong>
              </p>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>Medium to long-term investors</li>
                <li>Those seeking stable income from dividends</li>
                <li>
                  <span
                    title="Prefers steady returns with lower volatility and lower risk"
                    style={{ textDecoration: "underline dotted", cursor: "help" }}
                  >
                    Risk-averse
                  </span>{" "}
                  individuals
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],

    //SECTION 1 MODULE 8
    [
      {
        title: "Market Capitalization",
        type: "content",
        content: (
          <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1.5rem", maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📊 Market Capitalization</h3>
            <p>
              Market Capitalization is another way stocks are categorised. <br />
              <strong>Market Capitalization = Total value of a company’s shares held by investors</strong> <br />
              (Owned by investors: retail, institutional, or insiders)
            </p>
          </div>
        ),
      },
    ],


    //SECTION 1 MODULE 9
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
                <li>🏛️ Big, stable company</li>
                <li>🛡️ Low risk, low and stable return</li>
                <li>🏭 Established industry</li>
              </ul>
            </div>

            {/* Mid Cap */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📈 Mid Cap</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>💵 USD 2 billion to 10 billion</li>
                <li>🏢 Medium sized</li>
                <li>⚖️ Balance of growth and stability</li>
                <li>🌱 In an industry expected to experience growth</li>
              </ul>
            </div>

            {/* Small Cap */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>🌟 Small Cap</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>💸 USD 250 million – 2 billion</li>
                <li>🏗️ Smaller company</li>
                <li>🎢 Higher risk, volatile, high returns</li>
                <li>🧪 In small niche industry</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],


    //SECTION 1 MODULE 10
    [
      {
        title: "How Companies Use Profits",
        type: "content",
        content: (
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {/* Dividend Stocks */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>💵 Dividend Stocks</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>📬 Pay regular income</li>
                <li>🕒 Best for: Short to long term</li>
                <li>🛡️ Risk: Low</li>
                <li>💰 Payout regular dividends</li>
              </ul>
            </div>

            {/* Value Stocks */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📉 Value Stocks</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>📉 Undervalued now, grow slowly over time</li>
                <li>🕒 Best for: Long term</li>
                <li>⚖️ Risk: Low to medium</li>
                <li>💵 Occasional dividends</li>
              </ul>
            </div>

            {/* Growth Stocks */}
            <div style={{ flex: "1", minWidth: "240px", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>🚀 Growth Stocks</h4>
              <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li>⚡ Fast-growing, reinvest profits</li>
                <li>🕒 Best for: Long term</li>
                <li>🔥 Risk: High</li>
                <li>📈 No dividends, only capital appreciation</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
  ],
          
    //Section 2
    
    [ 
    // SECTION 2 MODULE 1
    [
      {
        title: "Introduction to Fundamental Analysis I",
        type: "content",
        content: (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔍 Fundamental Analysis</h3>
            <p style={{ marginBottom: "1rem" }}>
              Fundamental analysis looks at both the{" "}
              <span
                title="Financial data such as revenue, profits, and ratios"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                quantitative
              </span>{" "}
              (numbers) and{" "}
              <span
                title="Non-financial factors like brand strength, leadership, or market trends"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                qualitative
              </span>{" "}
              (story) aspects of a company to help investors determine the{" "}
              <span
                title="What the stock is actually worth based on its fundamentals, not market price"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                intrinsic value
              </span>{" "}
              of a stock — in other words, to decide if the company is worth more than its current price.
            </p>
            <p>
              This approach is best suited for investors with a{" "}
              <span
                title="A time horizon typically ranging from several months to years"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                mid-to-long-term
              </span>{" "}
              investment horizon.
            </p>
            <div style={{ marginTop: "2rem"}}>
              <img
                src="/Module-2-1.png"
                style={{
                  maxWidth: "500px",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  display: "block",
                  marginTop: "2rem",
                  marginLeft: 0
                }}
              />
            </div>
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
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
              🧥 Thrift Store Analogy: Understanding Value
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              Think of <strong>Fundamental Analysis</strong> like shopping at a thrift store. You're not just looking at
              the price tag— you're evaluating the item's <em>quality</em>, <em>brand</em>, and <em>condition</em> to
              decide if it's worth more than what the price suggests.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              For example, imagine a vintage leather jacket priced at <strong>$10</strong>. After inspecting it, you
              realize it's a high-end brand, in excellent condition, and rare. You'd know this item is{" "}
              <span
                title="When something is selling for less than what it's truly worth"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                undervalued
              </span>{" "}
              and likely a great buy.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              Similarly, in the stock market, if the{" "}
              <span
                title="What the stock is truly worth based on analysis"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                fair market value
              </span>{" "}
              (or{" "}
              <span
                title="Another term for fair market value based on financial fundamentals"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                intrinsic value
              </span>
              ) is higher than the{" "}
              <span
                title="The price you see on the stock exchange"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                market price
              </span>
              , the stock is undervalued — and analysts may issue a <strong>buy</strong> recommendation.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              On the other hand, imagine spotting a worn-out t-shirt for <strong>$40</strong> with no brand and little
              appeal. You'd know it's{" "}
              <span
                title="When something is priced higher than its actual worth"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                overvalued
              </span>{" "}
              and not worth the price. In investing, that would likely lead to a <strong>sell (short)</strong>{" "}
              recommendation.
            </p>

            <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "#555" }}>
              💡 Note: <strong>Fair market value</strong> is also known as{" "}
              <span
                title="The true value of a stock based on analysis of its business fundamentals"
                style={{ textDecoration: "underline dotted", cursor: "help" }}
              >
                intrinsic value
              </span>
              .
            </p>
            <div style={{ marginTop: "2rem"}}>
              <img
                src="/Module-2-2.png"
                style={{
                  maxWidth: "500px",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  display: "block",
                  marginTop: "2rem",
                  marginLeft: 0
                }}
              />
            </div>
          </div>
        ),
      },
    ],
    //Add more sections as needed
  ]
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
        question: "You're saving for your child's college fund in 10 years. What strategy fits best?",
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
      {
        question: "Which of these is an example of capital appreciation?",
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
          "You're entitled to guaranteed returns",
          "You work for the company",
        ],
        correctAnswer: 1,
        feedback: [
          "That describes a bond. Stocks represent ownership, not a loan.",
          "Correct! When you own a stock, you're a part-owner (shareholder) of the company.",
          "There are no guaranteed returns with stocks. Values can fluctuate.",
          "Owning stock does not mean you're employed by the company—it just makes you a shareholder.",
        ],
      },
      {
        question: "What is a dividend?",
        options: [
          "A payment to stockholders from the company's profits",
          "A type of loan you give to a company when buying stock",
          "The profit you earn from selling a stock",
          "A penalty for holding a stock too long",
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! A dividend is a portion of a company's profits shared with shareholders, usually in cash or additional shares.",
          "Stocks are not loans—bonds are. Buying stock makes you a part-owner, not a lender.",
          "That's capital appreciation, not a dividend.",
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
          "That's a dividend, not appreciation.",
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
          "Stock exchanges don't create companies—they provide a platform for trading shares of existing companies.",
          "Correct! Stock exchanges act like auction houses, matching buyers and sellers of stocks through online brokers.",
          "Stock exchanges don't lend money. That's a function of banks or lending institutions.",
          "Payroll is managed internally by companies, not by the exchange.",
        ],
      },
      {
        question: "Which of the following are the two largest stock exchanges in the world?",
        options: ["SGX and SSE", "Nasdaq and NYSE", "LSE and TSX", "ASX and BSE"],
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
        options: ["NYSE", "Nasdaq", "SGX", "LSE"],
        correctAnswer: 1,
        feedback: [
          "NYSE is known for more mature, traditional companies.",
          "Correct! Nasdaq is home to many major tech companies and is known for being tech-focused.",
          "SGX is Singapore's exchange and doesn't specialize in tech.",
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
        options: ["Nasdaq", "NYSE", "SGX", "SSE"],
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
          "Where dividends are distributed",
        ],
        correctAnswer: 1,
        feedback: [
          "That's the Secondary Market, not the Primary Market.",
          "Correct! The Primary Market is where new stocks are issued and sold for the first time.",
          "Dividends are part of company profits, not how stocks are initially sold.",
        ],
      },
      {
        question: "Who receives the money when you buy a stock in the Primary Market?",
        options: ["Another investor", "The government", "The company issuing the stock"],
        correctAnswer: 2,
        feedback: [
          "That happens in the Secondary Market, not the Primary.",
          "Governments don't receive stock sale proceeds unless it's a public enterprise IPO.",
          "Correct! In the Primary Market, the money goes directly to the company.",
        ],
      },

      {
        question: "What does a public offering allow?",
        options: [
          "Only private investors can buy the stock",
          "Anyone can buy the stock",
          "Only institutions can trade the stock",
        ],
        correctAnswer: 1,
        feedback: [
          "You're thinking of a private offering — not public.",
          "Correct! Public offerings are open to everyone, including individual investors.",
          "This applies to private offerings, not public ones.",
        ],
      },
      {
        question: "What is one requirement for a public offering?",
        options: ["IPO (Initial Public Offering)", "SEC exemption", "Dividend declaration"],
        correctAnswer: 0,
        feedback: [
          "Correct! A public offering requires an IPO to be launched.",
          "That's more typical of private offerings, which avoid some SEC steps.",
          "Dividends aren't required for stock offerings.",
        ],
      },
      {
        question: "Which is true about private offerings?",
        options: ["Open to all investors", "Faster and has fewer rules", "Requires an IPO"],
        correctAnswer: 1,
        feedback: [
          "That describes a public offering, not private.",
          "Correct! Private offerings are typically quicker and less regulated.",
          "Private offerings don't require IPOs — that's for public offerings.",
        ],
      },
    ],
    "1.5.mixed": [
      {
        question: "What is the Secondary Market?",
        options: [
          "Where new stocks are issued for the first time",
          "Where stocks are bought and sold between investors",
          "Where companies raise money directly",
        ],
        correctAnswer: 1,
        feedback: [
          "That's the Primary Market, not the Secondary Market.",
          "Correct! The Secondary Market is where investors trade existing stocks with each other.",
          "In the Secondary Market, the company doesn't receive money — investors trade with one another.",
        ],
      },
      {
        question: "Who receives the money when a stock is traded in the Secondary Market?",
        options: ["The company", "An investor selling the stock", "The stock exchange"],
        correctAnswer: 1,
        feedback: [
          "That only happens in the Primary Market.",
          "Correct! In the Secondary Market, the seller — another investor — receives the money.",
          "Exchanges charge fees but do not receive the trade amount.",
        ],
      },
      {
        question: "What is a key function of the Secondary Market?",
        options: [
          "Determining the stock's market price",
          "Helping companies issue shares",
          "Providing dividend schedules",
        ],
        correctAnswer: 0,
        feedback: [
          "Correct! Ongoing trading helps determine what investors are willing to pay — the market price.",
          "That happens in the Primary Market during issuance.",
          "Dividends are decided by companies, not market structure.",
        ],
      },
      {
        question: "How is an Auction Market different from a Dealer Market?",
        options: [
          "An aution market involves trading through a middleman",
          "In an auction market, buyers and sellers trade directly",
          "In an auction market, prices are set by the company",
        ],
        correctAnswer: 1,
        feedback: [
          "That's how Dealer Markets work (via market makers).",
          "Correct! In Auction Markets like the NYSE, buyers and sellers are matched directly.",
          "Prices are determined by the market — not the company.",
        ],
      },
    ],
    "1.6.mixed": [
      {
        question: "What does a company need to do to sell stocks?",
        options: ["Open a bank account", "Go public via an IPO", "Buy other companies"],
        correctAnswer: 1,
        feedback: [
          "Opening a bank account is not part of the stock offering process.",
          "Correct! A company must go public through an IPO to sell its shares to the public.",
          "Buying other companies is unrelated to going public or selling shares.",
        ],
      },
      {
        question: "What does a company need to do to sell stocks?",
        options: ["Open a bank account", "Go public via an IPO", "Buy other companies"],
        correctAnswer: 1,
        feedback: [
          "Opening a bank account is not part of the stock offering process.",
          "Correct! A company must go public through an IPO to sell its shares to the public.",
          "Buying other companies is unrelated to going public or selling shares.",
        ],
      },
      {
        question: "Who is offered the stock first during an IPO?",
        options: ["Anyone who wants to buy it", "Institutional investors", "Local government"],
        correctAnswer: 1,
        feedback: [
          "Public investors can buy after trading opens, but institutional investors get first access.",
          "Correct! Institutional investors are typically offered shares first in an IPO.",
          "Local governments aren't involved in the distribution of stock during an IPO.",
        ],
      },
      {
        question: "What is the main reason a company decides to go public?",
        options: ["To make its products more popular", "To avoid paying taxes", "To raise money"],
        correctAnswer: 2,
        feedback: [
          "Going public may increase visibility, but the main goal is funding.",
          "Companies still pay taxes after going public.",
          "Correct! The primary reason for going public is to raise capital for growth.",
        ],
      },
    ],
    "1.7.mixed": [
      {
        question: "What is the key perk of Common Stock?",
        options: [
          "Priority dividends",
          "Voting rights and potential for growth",
          "Guaranteed fixed returns",
          "No voting rights",
        ],
        correctAnswer: 1,
        feedback: [
          "That's a perk of Preferred Stock, not Common Stock.",
          "Correct! Common stockholders usually have voting rights and the potential for capital appreciation.",
          "Common Stock doesn't offer fixed returns — returns depend on performance.",
          "Incorrect. Common stock usually comes with voting rights.",
        ],
      },
      {
        question: "Who is Preferred Stock best suited for?",
        options: [
          "Long-term investors looking for growth",
          "Investors seeking more stable income through dividends",
          "Those looking to vote on company decisions",
          "Short-term traders looking for quick profits",
        ],
        correctAnswer: 1,
        feedback: [
          "Preferred Stock is better for income than long-term growth.",
          "Correct! It offers steady dividend income and is ideal for stability-focused investors.",
          "Preferred Stock usually doesn't come with voting rights.",
          "Preferred Stock is not meant for short-term trading or speculation.",
        ],
      },
      {
        question: "What is the main difference between Common Stock and Preferred Stock?",
        options: [
          "Preferred Stock gives voting rights, Common Stock does not",
          "Preferred Stock offers priority in dividends, Common Stock does not",
          "Common Stock guarantees fixed income",
          "Preferred Stock is riskier than Common Stock",
        ],
        correctAnswer: 1,
        feedback: [
          "Common Stock has voting rights, not Preferred.",
          "Correct! Preferred shareholders receive dividends before Common shareholders.",
          "There's no fixed income in Common Stock — it depends on company performance.",
          "Preferred Stock is typically less risky because of steady dividend payments.",
        ],
      },
      {
        question: "Which of the following is true about the time horizon of Preferred Stock?",
        options: [
          "Preferred Stock is best for short-term investors",
          "Preferred Stock is best for medium to long-term investors seeking stability",
          "Preferred Stock is only for day traders",
          "Preferred Stock has no time horizon",
        ],
        correctAnswer: 1,
        feedback: [
          "Preferred Stock is not designed for short-term gains.",
          "Correct! It suits medium to long-term investors who value steady income and lower volatility.",
          "Preferred Stock is not used for day trading — it's not volatile enough.",
          "All investments have a time horizon depending on the goal. This is too vague to be true.",
        ],
      },
      {
        question: "Who would benefit most from investing in Common Stock?",
        options: [
          "Someone looking for immediate income",
          "Someone wanting to vote on company decisions and accept more risk for potential growth",
          "Someone avoiding risk and seeking stable returns",
          "Someone seeking fixed, regular payouts",
        ],
        correctAnswer: 1,
        feedback: [
          "Someone looking for immediate income is more aligned with Preferred Stock.",
          "Correct! Common Stock appeals to investors willing to take on more risk in exchange for growth and voting rights.",
          "Common Stock is not for risk-averse investors — it's more volatile.",
          "That's the domain of Preferred Stock, not Common.",
        ],
      },
    ],
    "1.8.mixed": [
      {
        question: "What does market capitalization measure?",
        options: ["The company's revenue", "The value of all outstanding shares", "The company's net income"],
        correctAnswer: 1,
        feedback: [
          "Revenue is important, but market cap is based on share price and shares outstanding.",
          "Correct! Market cap is the total value of a company's outstanding shares (share price × number of shares).",
          "Net income relates to company profitability, not its total market value.",
        ],
      },
      {
        question: "If a company has 1 million shares at $50 each, what's its market cap?",
        options: ["$50 million", "$1 million", "$5 million"],
        correctAnswer: 0,
        feedback: [
          "Correct! 1 million shares × $50 = $50 million market cap.",
          "That would be the case if shares were $1 each — not $50.",
          "That math doesn't add up — double-check your multiplication.",
        ],
      },
      {
        question: "Market capitalization helps investors understand:",
        options: ["Product quality", "Company size & risk", "Employee salaries"],
        correctAnswer: 1,
        feedback: [
          "Product quality is subjective and not part of market cap calculation.",
          "Correct! Market cap indicates how big a company is, and larger firms are often seen as less risky.",
          "Salaries aren't related to a company's market cap directly.",
        ],
      },
      {
        question: "A company's stock price goes up. What happens to its market cap?",
        options: ["It depends on revenue", "It goes down", "It increases"],
        correctAnswer: 2,
        feedback: [
          "Revenue doesn't directly impact market cap — share price does.",
          "That's the opposite — market cap rises when share price rises.",
          "Correct! Market cap increases because it's calculated as share price × number of shares.",
        ],
      },
    ],
    "1.9.mixed": [
      {
        question: "Small cap stocks are always safer.",
        options: ["True", "False"],
        correctAnswer: 1,
        feedback: [
          "Small cap stocks are generally riskier due to higher volatility and less predictable performance.",
          "Correct! Small cap stocks often come with higher risk — they can grow fast, but also swing wildly in value.",
        ],
      },
      {
        question: "Small cap has over USD 10 billion market cap.",
        options: ["True", "False"],
        correctAnswer: 1,
        feedback: [
          "That describes large cap — not small cap. Small caps are typically under $2 billion.",
          "Correct! Small caps are usually between $250 million and $2 billion, not over $10 billion.",
        ],
      },
      {
        question: "If you're someone who avoids risk in investment, what category of stock might you pick?",
        options: ["Large cap stock", "Small cap stock"],
        correctAnswer: 0,
        feedback: [
          "Correct! Large cap stocks are usually more stable and less volatile — great for risk-averse investors.",
          "Small caps tend to be riskier and more volatile, which doesn't suit a conservative strategy.",
        ],
      },
      {
        question:
          "Company A makes plant-based dog food and has a market cap of $500 million. What category of market capitalization does it fall into?",
        options: ["Small Cap", "Large Cap", "Mid Cap"],
        correctAnswer: 0,
        feedback: [
          "Correct! $500 million falls in the small cap range ($250M–$2B).",
          "Large cap starts at $10 billion and above — this company is much smaller.",
          "Mid cap is typically $2–10 billion, which is still above this company's value.",
        ],
      },
      {
        question:
          "If you're someone who is seeking growth in value of stock and can accept volatility of stock prices, what category of stock might you pick?",
        options: ["Large cap", "Small Cap"],
        correctAnswer: 1,
        feedback: [
          "Large cap stocks are stable but generally offer slower growth.",
          "Correct! Small caps are more volatile but can offer high growth potential.",
        ],
      },
    ],
    "1.10.mixed": [
      {
        question: "Which stock type usually pays regular income?",
        options: ["Value", "Growth", "Dividend"],
        correctAnswer: 2,
        feedback: [
          "Value stocks can sometimes pay dividends, but not always regularly.",
          "Growth stocks usually reinvest profits instead of paying income.",
          "Correct! Dividend stocks are known for providing regular income to shareholders.",
        ],
      },
      {
        question: "Which stock type has the highest risk and growth potential?",
        options: ["Value", "Growth", "Dividend"],
        correctAnswer: 1,
        feedback: [
          "Value stocks are considered more stable and less volatile.",
          "Correct! Growth stocks aim for rapid expansion and often carry higher risk.",
          "Dividend stocks prioritize income, not aggressive growth.",
        ],
      },
      {
        question: "You want long-term bargains and are okay waiting. Choose:",
        options: ["Growth", "Dividend", "Value"],
        correctAnswer: 2,
        feedback: [
          "Growth stocks are priced for potential, not for bargain-hunting.",
          "Dividend stocks focus on income, not undervalued opportunities.",
          "Correct! Value stocks are often undervalued and good for long-term investors willing to wait.",
        ],
      },
      {
        question: "This stock reinvests earnings and skips dividends.",
        options: ["Growth", "Dividend", "Value"],
        correctAnswer: 0,
        feedback: [
          "Correct! Growth stocks typically reinvest profits to fuel expansion instead of paying dividends.",
          "Dividend stocks distribute profits rather than reinvesting them.",
          "Value stocks may pay dividends, but reinvestment isn't their defining trait.",
        ],
      },
      {
        question: "Which is best for someone needing steady income now?",
        options: ["Growth", "Dividend", "Value"],
        correctAnswer: 1,
        feedback: [
          "Growth stocks don't usually offer income — they're about future potential.",
          "Correct! Dividend stocks provide regular payouts — ideal for income-focused investors.",
          "Value stocks might pay dividends, but income isn't their core purpose.",
        ],
      },
    ],
    "2.1.mixed": [
      {
        question: "What does Fundamental Analysis consist of? (You may choose more than one option.)",
        options: ["Quantitative Analysis", "Qualitative Analysis", "Technical Analysis"],
        correctAnswer: [0, 1],
        hint: (
          <span
            title="Fundamental analysis is like inspecting items at a thrift shop to decide their true worth. For stocks, it means scrutinizing a company's financial health, management quality, and market position to see if the stock price really reflects its value."
            style={{ textDecoration: "underline dotted", cursor: "help" }}
          >
            💡 Hint: Think of fundamental analysis like evaluating a hidden gem at a thrift store.
          </span>
        ),
        feedback: {
          correct:
            "Fundamental analysis includes both quantitative aspects, like financial statements and ratios, and qualitative aspects, such as management quality and industry position. This comprehensive approach provides a deeper understanding of a company's overall health and potential.",
          incorrect: [
            "While quantitative analysis of financial data is a crucial part of fundamental analysis, relying solely on this ignores the qualitative factors like management effectiveness and industry conditions, which are equally important.",
            "Qualitative analysis helps in understanding the company's strategic positioning, but without financial metrics like earnings and debt, the analysis is incomplete.",
            "Technical analysis is a separate discipline that focuses on price trends and trading volumes, not business fundamentals.",
          ],
        },
      },

      {
        question: "What does Fundamental Analysis help you determine?",
        options: [
          "The popularity of the stock on social media",
          "The intrinsic value of a stock",
          "The short-term volatility of the stock",
          "The CEO's performance",
        ],
        correctAnswer: 1,
        hint: (
          <span
            title="Fundamental analysis helps you assess whether a stock's price reflects its true business value."
            style={{ textDecoration: "underline dotted", cursor: "help" }}
          >
            💡 Hint: Think long-term value, not short-term hype.
          </span>
        ),
        feedback: [
          "The number of times a stock is mentioned on social media doesn't reflect its financial worth or business fundamentals.",
          "Correct! Fundamental analysis helps determine a stock's intrinsic value — what it's actually worth based on company performance.",
          "Short-term volatility refers to quick price fluctuations, which is typically the focus of technical analysis, not fundamental.",
          "A CEO is important, but fundamental analysis goes far beyond one person — it covers earnings, debt, and overall company outlook.",
        ],
      },

      {
        question: "If the fair market value exceeds the market price, is the stock undervalued or overvalued?",
        options: ["Undervalued", "Overvalued"],
        correctAnswer: 0,
        hint: (
          <span
            title="Fair market value is what a stock is actually worth. Market price is what it's selling for. If something is worth more than the price, it's undervalued."
            style={{ textDecoration: "underline dotted", cursor: "help" }}
          >
            💡 Hint: Think of a high-quality jacket at a low thrift price.
          </span>
        ),
        feedback: [
          "Correct! If a stock is priced lower than its fair market value, it's a good deal — it's undervalued.",
          "Overvalued would mean that the stock costs more than it's worth. If the market price is lower than the fair value, it's actually undervalued.",
        ],
      },

      {
        question: "If a stock is overvalued, should you exercise a buy or short decision?",
        options: ["Buy", "Short"],
        correctAnswer: 1,
        feedback: [
          "Buying an overvalued stock means paying more than it's worth — it's risky and may lead to losses when the price corrects.",
          "Correct! If a stock is overvalued, shorting may be profitable if you expect its price to fall to reflect its true value.",
        ],
      },
    ],
    "2.2.mixed": [
      {
        question: "If the market price exceeds the fair market value, is the stock undervalued or overvalued?",
        options: ["Undervalued", "Overvalued"],
        correctAnswer: 1,
        hint: (
          <span
            title="Fair market value = what the item is usually worth. Market price = current selling price. Undervalued = priced below its real worth. Overvalued = priced above its real worth."
            style={{ textDecoration: "underline dotted", cursor: "help" }}
          >
            📌 Hint: Hover to review key definitions
          </span>
        ),
        feedback: [
          // Incorrect: User chooses "Undervalued"
          "Undervalued would mean that the stock is priced below its real value, which is not the case here. The term doesn't apply when the stock's price is higher than its intrinsic value, which indicates an overvaluation, not undervaluation.",
          // Correct: User chooses "Overvalued"
          "Correct! This option correctly states that the stock price is higher than what the company's financial health and market position justify. When investors pay more than the fair market value, they may not get a return that matches their investment.",
        ],
      },
      {
        question: "If a stock is undervalued, should you exercise a buy or short decision?",
        options: ["Buy", "Short"],
        correctAnswer: 0,
        feedback: [
          // Correct answer: Buy
          "Correct! Buying undervalued stocks is generally seen as a good investment because you're purchasing something for less than its true value.",
          // Incorrect answer: Short
          "Shorting a stock is betting on its price decrease, but if a stock is undervalued, it means it's priced below its true value, suggesting it will likely increase. Shorting an undervalued stock risks losses if its price corrects upward to reflect its intrinsic value. Thus, shorting is not advisable for undervalued stocks.",
        ],
      },
    ],
  }

  // Get the current quiz based on module and quiz type
  const getCurrentQuiz = () => {
    const quizKey = `${currentStep}.${currentModule}.${quizType}`
    return quizData[quizKey] || []
  }

  const currentStepData = {
    id: currentStep,
    title: currentStep === 1 ? "Introduction to Stock Market Basics" : `Section ${currentStep}`, //The linkage problem is here cos 1 and 2 are hard coded but 3 onwards is dynamic and it doesnt work
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

  


  /*const currentModuleData = {
    ...currentStepData.modules[0],
    contentSections:
      currentStep === 1
        ? currentModule === 1
          ? moduleContent[0]
          : moduleContent[currentModule - 1]
        : moduleContent[currentStep - 1]
          ? moduleContent[currentStep - 1][currentModule - 1] || []
          : [],
  } */ // this is the old one, chat says this might be causing problems

/* const currentModuleData = {
  ...currentStepData.modules[0],
  contentSections:
    currentStep === 1
      ? moduleContent[currentModule - 1] || []
      : [moduleContent[currentStep - 1][currentModule - 1]] || [],
} */ //made module data appear in 2.1 but 1.2 was appearing in 2.1

const currentModuleData = {
  ...currentStepData.modules[0],
  contentSections:
    moduleContent[currentStep - 1]?.[currentModule - 1] || [],
} //updated

console.log("=== Current Step and Module ===")
console.log("Step:", currentStep)
console.log("Module:", currentModule)

console.log("=== Selected Content ===")
console.log("moduleContent[step-1][module-1]:", moduleContent[currentStep - 1]?.[currentModule - 1])

console.log("=== Full currentModuleData ===")
console.log(currentModuleData)

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
    } else if (contentType === "quiz") {
      const quizKey = `${currentStep}.${currentModule}.${quizType}`
      const moduleKey = `${currentStep}.${currentModule}`

      // Only mark as completed if the score is 80% or higher
      if (quizScore >= 80) {
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

        // Navigate to the next module
        const nextModule = currentModule + 1
        if (nextModule <= stepModuleCounts[currentStep]) {
          navigate(`/course-content?step=${currentStep}&module=${nextModule}&type=content`)
        } else if (currentStep < Object.keys(stepModuleCounts).length) {
          navigate(`/course-content?step=${currentStep + 1}&module=1&type=content`)
        } else {
          navigate("/courses")
        }
      } else {
        // If score is less than 80%, don't mark as completed and stay on the quiz
        resetQuiz()
      }
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
    const totalQuestions = currentQuiz.length

    // Make sure we have answers for all questions
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      return 0 // Return 0 if not all questions are answered
    }

    Object.entries(selectedAnswers).forEach(([questionIndex, answerIndex]) => {
      if (currentQuiz[Number.parseInt(questionIndex)].correctAnswer === Number.parseInt(answerIndex)) {
        correctAnswers++
      }
    })

    // Calculate percentage score
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    return score
  }

  // Update the handleCompleteQuiz function to mark the module as completed when the quiz is passed
  const handleCompleteQuiz = () => {
    // Make sure all questions are answered
    if (Object.keys(selectedAnswers).length < currentQuiz.length) {
      alert("Please answer all questions before submitting the quiz.")
      return
    }

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

    // Only mark quiz as completed if score is 80% or higher
    if (score >= 80) {
      if (!progress.completedQuizzes) {
        progress.completedQuizzes = {}
      }
      progress.completedQuizzes[quizKey] = true

      // Update the state
      setCompletedQuizzes({
        ...completedQuizzes,
        [quizKey]: true,
      })
    }

    // Update quiz scores state
    setQuizScores({
      ...quizScores,
      [quizKey]: score,
    })

    // Save updated progress
    localStorage.setItem("courseProgress", JSON.stringify(progress))

    // If score is 80% or higher, trigger confetti
    if (score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5a7d53", "#f0d878", "#85bb65", "#f8d231"],
      })
    }
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
    1: 10, // Updated to match the actual number of modules in section 1
    2: 2, // Updated to match the actual number of modules in section 2
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
                              /*else if (currentModule < moduleContent[currentStep - 1].length) {
                                navigate(`/course-content?step=${currentStep}&module=${currentModule + 1}&type=content`)
                              } */ // commenting out this might have been the one to cause issues
                              else if (currentModule < stepModuleCounts[currentStep]) {
                                navigate(`/course-content?step=${currentStep}&module=${currentModule + 1}&type=content`)
                              } //added this based on chatgpt suggestion
                              else if (currentStep < moduleContent.length) {
                                navigate(`/course-content?step=${currentStep + 1}&module=1&type=content`)
                              } else {
                                navigate(`/courses`)
                              }
                            }}
                            className="flex items-center bg-[#85bb65] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#75a758] transform hover:scale-105"
                          >
                            Complete Module <ChevronRight className="ml-1" />
                          </button>
                        ) : (
                          <button
                            onClick={handleCompleteModule}
                            className="flex items-center bg-[#85bb65] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#75a758] transform hover:scale-105"
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
