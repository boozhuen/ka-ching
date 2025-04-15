"use client"

import { useEffect, useState, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronRight, TrendingUp, LineChart, BarChart, PieChart } from "lucide-react"
import TypewriterComponent from "./components/typewriter"
import "./styles.css"
import Login from "./pages/login.js"
import Signup from "./pages/signup.js"
import Contact from "./pages/contactus.js"
import Courses from "./pages/Courses.js"
import CourseContent from "./pages/coursecontent.js"
import UserProfile from "./components/userprofile.js"
import Terms from "./pages/terms.js"
import Privacy from "./pages/privacy.js"
import Pricing from "./pages/pricing.js"
import Community from "./pages/community.js"
import Practice from "./pages/practice.js"
import "./styles.css"

// Update the Routes section to use our components

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-content" element={<CourseContent />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/community" element={<Community />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </Router>
  )
}

function Home() {
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("learn")
  const aboutSectionRef = useRef(null)
  const teamMembersRef = useRef(null)
  const challengeCardsRef = useRef(null)
  const taglineRef = useRef(null)
  const featuresRef = useRef(null)
  const location = useLocation()
  const scrollProgressRef = useRef(null)
  const navigate = useNavigate()

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("kaChingCurrentUser")
      setIsLoggedIn(!!user)
    }

    checkLoginStatus()
    // Set up event listener for storage changes
    window.addEventListener("storage", checkLoginStatus)

    const handleLogoutEvent = () => {
      checkLoginStatus()
    }
    window.addEventListener("user-logout", handleLogoutEvent)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("user-logout", handleLogoutEvent)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("kaChingCurrentUser")
    setIsLoggedIn(false)
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  // Scroll to about section if hash is #about
  useEffect(() => {
    if (location.hash === "#about" && aboutSectionRef.current) {
      setTimeout(() => {
        aboutSectionRef.current.scrollIntoView({ behavior: "smooth" })
      }, 500)
    }
  }, [location, aboutSectionRef])

  useEffect(() => {
    setMounted(true)

    // Set loaded state after a small delay for initial animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Animation for paragraphs on scroll
    const animateParagraphs = () => {
      const paragraphs = document.querySelectorAll(".about-us p")

      paragraphs.forEach((paragraph) => {
        const paragraphPosition = paragraph.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (paragraphPosition < screenPosition) {
          paragraph.classList.add("animate")
        }
      })
    }

    // Animation for team members on scroll with staggered effect
    const animateTeamMembers = () => {
      const teamMembers = document.querySelectorAll(".team-member")

      teamMembers.forEach((member, index) => {
        const memberPosition = member.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.3

        if (memberPosition < screenPosition) {
          setTimeout(() => {
            member.classList.add("animate")
          }, index * 150) // Staggered animation
        }
      })
    }

    // Animation for challenge cards with staggered effect
    const animateChallengeCards = () => {
      const cards = document.querySelectorAll(".challenge-card")

      cards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (cardPosition < screenPosition) {
          setTimeout(() => {
            card.classList.add("animate")
          }, index * 150) // Staggered animation
        }
      })
    }

    // Animation for feature cards with staggered effect
    const animateFeatureCards = () => {
      const cards = document.querySelectorAll(".feature-card")

      cards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (cardPosition < screenPosition) {
          setTimeout(() => {
            card.classList.add("animate")
          }, index * 150) // Staggered animation
        }
      })
    }

    // Animation for tagline
    const animateTagline = () => {
      const tagline = document.querySelector(".tagline")
      if (tagline) {
        const taglinePosition = tagline.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (taglinePosition < screenPosition) {
          tagline.classList.add("animate")
        }
      }
    }

    // Add background elements
    const addBackgroundElements = () => {
      const aboutUs = document.querySelector(".about-us")

      if (aboutUs) {
        const bgElement1 = document.createElement("div")
        bgElement1.classList.add("bg-element", "bg-element-1")

        const bgElement2 = document.createElement("div")
        bgElement2.classList.add("bg-element", "bg-element-2")

        aboutUs.appendChild(bgElement1)
        aboutUs.appendChild(bgElement2)
      }
    }

    // Add section dividers
    const addSectionDividers = () => {
      const headers = document.querySelectorAll(".about-header")

      headers.forEach((header, index) => {
        if (index > 0) {
          const divider = document.createElement("div")
          divider.classList.add("section-divider")
          header.parentNode?.insertBefore(divider, header)
        }
      })
    }

    // Add highlight spans to specific words
    const addHighlights = () => {
      const paragraphs = document.querySelectorAll(".about-us p")
      const highlightWords = ["investing", "adventure", "fun", "accessible", "interactive", "journey", "grow", "thrive"]

      paragraphs.forEach((paragraph) => {
        highlightWords.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi")
          paragraph.innerHTML = paragraph.innerHTML.replace(regex, (match) => `<span class="highlight">${match}</span>`)
        })
      })
    }

    // Add highlight spans to headline words
    const addHeadlineHighlights = () => {
      const headlines = document.querySelectorAll(".headline, .tagline h2")
      const highlightWords = ["REMOTE", "HYBRID", "ON-SITE", "DAILY", "SMOOTHER", "ALL IN ONE"]

      headlines.forEach((headline) => {
        highlightWords.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi")
          headline.innerHTML = headline.innerHTML.replace(regex, (match) => `<span class="highlight">${match}</span>`)
        })
      })
    }

    // Interactive team member effects
    const addTeamInteractions = () => {
      const teamMembers = document.querySelectorAll(".team-member")

      teamMembers.forEach((member) => {
        // Random rotation on hover
        member.addEventListener("mouseenter", () => {
          const randomRotation = Math.random() * 3 - 1.5 // Between -1.5 and 1.5 degrees
          const element = member
          element.style.transform = `translateY(-15px) scale(1.03) rotate(${randomRotation}deg)`
        })

        member.addEventListener("mouseleave", () => {
          const element = member
          element.style.transform = ""
        })
      })
    }

    // Parallax scroll effect
    const handleParallaxScroll = () => {
      const parallaxElements = document.querySelectorAll(".parallax")

      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-speed") || 0.5
        const yPos = -(window.scrollY * speed)
        element.style.transform = `translateY(${yPos}px)`
      })
    }

    // Header scroll effect
    const handleScroll = () => {
      const header = document.querySelector("header")
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled")
        } else {
          header.classList.remove("scrolled")
        }
      }

      // Run all animations on scroll
      animateParagraphs()
      animateTeamMembers()
      animateChallengeCards()
      animateFeatureCards()
      animateTagline()
      handleParallaxScroll()

      // Animate count-up numbers
      const countElements = document.querySelectorAll(".count-up")
      countElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.2

        if (elementPosition < screenPosition && !element.classList.contains("counted")) {
          element.classList.add("counted")
          const target = Number.parseInt(element.getAttribute("data-target") || "0")
          const duration = 2000 // ms
          const start = Number.parseInt(element.textContent || "0")
          const increment = target / (duration / 16)
          let current = start

          const updateCount = () => {
            current += increment
            if (current < target) {
              element.textContent = Math.floor(current).toString()
              requestAnimationFrame(updateCount)
            } else {
              element.textContent = target.toString()
            }
          }

          updateCount()
        }
      })
    }

    // Initialize everything
    addBackgroundElements()
    addSectionDividers()
    addHighlights()
    addHeadlineHighlights()
    addTeamInteractions()

    // Run once on load
    animateParagraphs()
    animateTeamMembers()
    animateChallengeCards()
    animateFeatureCards()
    animateTagline()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Initialize and update the trading chart
  useEffect(() => {
    if (isLoaded) {
      initTradingChart()
    }
  }, [isLoaded, activeTab])

  const initTradingChart = () => {
    const chartCanvas = document.getElementById("tradingChart")
    if (!chartCanvas) return

    const ctx = chartCanvas.getContext("2d")
    if (!ctx) return

    // Clear previous chart
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height)

    // Chart dimensions
    const width = chartCanvas.width
    const height = chartCanvas.height
    const padding = 40

    // Generate random data
    const dataPoints = 50
    const data = []
    let value = 100

    for (let i = 0; i < dataPoints; i++) {
      value += Math.random() * 10 - 5
      value = Math.max(50, Math.min(150, value)) // Keep within bounds
      data.push(value)
    }

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#5a7d53"
    ctx.lineWidth = 2

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "#5a7d53"
    ctx.font = "12px Arial"

    // X-axis labels
    for (let i = 0; i < 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 4
      ctx.fillText(`Day ${i * 10}`, x, height - padding + 20)
    }

    // Y-axis labels
    for (let i = 0; i < 5; i++) {
      const y = height - padding - (i * (height - 2 * padding)) / 4
      ctx.fillText(`$${50 + i * 25}`, padding - 30, y)
    }

    // Draw data line
    ctx.beginPath()
    ctx.strokeStyle = "#06D6A0"
    ctx.lineWidth = 3

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (dataPoints - 1)
      const y = height - padding - ((data[i] - 50) * (height - 2 * padding)) / 100

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Add gradient under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(6, 214, 160, 0.3)")
    gradient.addColorStop(1, "rgba(6, 214, 160, 0)")

    ctx.beginPath()
    ctx.fillStyle = gradient

    // Start at the bottom left
    ctx.moveTo(padding, height - padding)

    // Draw the line again
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (dataPoints - 1)
      const y = height - padding - ((data[i] - 50) * (height - 2 * padding)) / 100
      ctx.lineTo(x, y)
    }

    // Complete the path to the bottom right
    ctx.lineTo(width - padding, height - padding)
    ctx.closePath()
    ctx.fill()

    // Make chart interactive
    let isDragging = false
    let lastX = 0
    let lastY = 0

    chartCanvas.addEventListener("mousedown", (e) => {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
      chartCanvas.style.cursor = "grabbing"
    })

    window.addEventListener("mouseup", () => {
      isDragging = false
      chartCanvas.style.cursor = "grab"
    })

    chartCanvas.addEventListener("mousemove", (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - lastX
      const deltaY = e.clientY - lastY

      // Update the chart based on drag (simplified for demo)
      // In a real app, you'd adjust the data range or zoom level

      // For demo, we'll just shift the data slightly
      if (Math.abs(deltaX) > 5) {
        data.shift()
        value += deltaX > 0 ? 2 : -2
        value = Math.max(50, Math.min(150, value))
        data.push(value)

        // Redraw the chart
        initTradingChart()
      }

      lastX = e.clientX
      lastY = e.clientY
    })
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f0]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#e6e6d8] shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2">
              <div className="w-10 h-10 rounded-full bg-[#f0d878] flex items-center justify-center">
                <span className="text-[#5a7d53] font-bold">^_^</span>
              </div>
            </div>
            <Link to="/" className="font-silkscreen text-xl font-bold text-[#5a7d53]">
              KA-CHING
            </Link>
          </div>

          <div className="hidden md:flex space-x-1">
            <NavLink to="/" label="Home" active={location.pathname === "/" && !location.hash} />
            <NavLink to="/#about" label="About Us" active={location.hash === "#about"} />
            {isLoggedIn && <NavLink to="/courses" label="Courses" active={location.pathname === "/courses"} />}
            <NavLink to="/pricing" label="Pricing" active={location.pathname === "/pricing"} />
            {isLoggedIn && <NavLink to="/community" label="Community" active={location.pathname === "/community"} />}
            <NavLink to="/contact" label="Contact Us" active={location.pathname === "/contact"} />

          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <Link
                to="/login"
                className="bg-[#5a7d53] hover:bg-transparent hover:text-[#5a7d53] text-white font-sarala font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 border-2 border-[#5a7d53]"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex flex-col gap-1.5 cursor-pointer">
            <span className="w-7 h-0.5 bg-[#333333] transition-all duration-300"></span>
            <span className="w-7 h-0.5 bg-[#333333] transition-all duration-300"></span>
            <span className="w-7 h-0.5 bg-[#333333] transition-all duration-300"></span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 md:pr-12">
          <h1 className="font-silkscreen text-4xl md:text-6xl font-bold leading-tight mb-4">
            <span className="text-[#5a7d53]">KA-</span>
            <span className="text-[#f0d878] drop-shadow-md">CHING</span>
          </h1>
          <h2 className="font-sarala text-xl md:text-2xl text-[#5a7d53] font-bold mb-4">
            Your All-In-One
            <div className="h-16 md:h-20">
              <TypewriterComponent
                phrases={[
                  "Investment Solution.",
                  "Learning Platform.",
                  "Financial Guide.",
                  "Wealth Builder.",
                  "Investment Companion.",
                ]}
              />
            </div>
          </h2>
          <p
            className="font-sarala text-lg text-gray-600 mb-8 transform translate-y-8 opacity-0 transition-all duration-700 ease-out"
            style={{ transform: isLoaded ? "translateY(0)" : "translateY(20px)", opacity: isLoaded ? 1 : 0 }}
          >
            Make investing feel like an adventure! Our platform offers interactive lessons, placement tests, and
            resources to guide you through your investment journey.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-[#06D6A0] hover:bg-transparent hover:text-[#06D6A0] text-white font-sarala font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-[#06D6A0] relative overflow-hidden"
          >
            <span className="relative z-10">GET STARTED</span>
            <ChevronRight className="ml-2 h-5 w-5 relative z-10" />
            <span
              className="absolute top-0 left-[-100%] w-full h-full bg-white/20 transition-all duration-700 ease-in-out"
              style={{ transform: "skewX(-15deg)" }}
              onMouseEnter={(e) => {
                const target = e.target
                target.style.left = "100%"
              }}
            ></span>
          </Link>
        </div>
        <div className="w-full md:w-1/2 mb-10 md:mb-0 mt-10 md:mt-0">
          <div className="relative parallax" data-speed="0.1" style={{ animation: "float 6s ease-in-out infinite" }}>
            <img
              src={require("./investment-pic-1.png")}
              alt="Investment Illustration"
              width={600}
              height={500}
              className="rounded-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Headline Section */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#f0d878] opacity-10 parallax"
          data-speed="0.2"
        ></div>
        <div
          className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#5a7d53] opacity-10 parallax"
          data-speed="0.3"
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-silkscreen text-3xl md:text-4xl text-center font-bold text-[#333333] mb-16 leading-tight headline">
            BEGINNERS JUGGLING STOCKS, BONDS, AND CRYPTO FACE <span className="text-[#B5A642]">DAILY</span> CHALLENGES:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" ref={challengeCardsRef}>
            <div className="challenge-card bg-[#f9f9f0] p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8">
              <div className="text-4xl mb-4 text-[#B5A642]">📊</div>
              <h3 className="font-silkscreen text-lg font-bold">COMPLEXITY</h3>
            </div>
            <div className="challenge-card bg-[#f9f9f0] p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8">
              <div className="text-4xl mb-4 text-[#B5A642]">💸</div>
              <h3 className="font-silkscreen text-lg font-bold">RISK FEAR</h3>
            </div>
            <div className="challenge-card bg-[#f9f9f0] p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8">
              <div className="text-4xl mb-4 text-[#B5A642]">🔍</div>
              <h3 className="font-silkscreen text-lg font-bold">INFORMATION</h3>
            </div>
            <div className="challenge-card bg-[#f9f9f0] p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8">
              <div className="text-4xl mb-4 text-[#B5A642]">⏱️</div>
              <h3 className="font-silkscreen text-lg font-bold">TIME</h3>
            </div>
          </div>

          <div
            className="tagline text-center opacity-0 transform translate-y-8 transition-all duration-700 ease-out"
            ref={taglineRef}
          >
            <h2 className="font-silkscreen text-2xl md:text-3xl font-bold text-[#333333] max-w-3xl mx-auto">
              IMAGINE IF INVESTING COULD BE <span className="text-[#B5A642]">SMOOTHER</span> -{" "}
              <span className="text-[#B5A642]">ALL IN ONE</span> PLATFORM.
            </h2>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <div
        id="about"
        className={`about-us container mx-auto px-4 py-16 md:py-24 ${isLoaded ? "loaded" : ""}`}
        ref={aboutSectionRef}
      >
        <div className="about-header text-center mb-12">
          <div className="accent-line mx-auto"></div>
          <h1 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53]">WHO WE ARE</h1>
        </div>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          Welcome to Ka-Ching, where we make investing feel like an adventure!
        </p>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          We're a passionate team of four NUS students, united by one mission: to demystify investing and make it
          simple, fun, and accessible for everyone. Our platform offers interactive lessons, placement tests, and
          resources to guide you through your investment journey.
        </p>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          Get started by signing up or logging in!
        </p>

        <div className="about-header text-center mb-12">
          <div className="accent-line mx-auto"></div>
          <h1 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53]">
            OUR <span className="highlight">MISSION</span>
          </h1>
        </div>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          At Ka-Ching, we're all about making investing fun, easy, and accessible for everyone!
        </p>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          Our mission is to break down the intimidating world of stocks and finance and turn it into an exciting journey
          where you get to learn, grow, and thrive. No more confusing jargon—just simple, interactive lessons that help
          you master the art of investing at your own pace.
        </p>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          We believe that anyone can be a savvy investor, and we're here to show you how. Whether you're just starting
          out or you're ready to take your knowledge to the next level, Ka-Ching is your go-to place for all things
          investment. Let's make your money work for you, the fun way!
        </p>

        <div className="about-header text-center mb-12">
          <div className="accent-line mx-auto"></div>
          <h1 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53]">
            MEET THE <span className="highlight">TEAM</span>
          </h1>
        </div>
        <p
          className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-6 opacity-0 transform translate-y-5"
          text-lg
        >
          Ka-Ching is not just a group of individuals — we're a collaborative force with a shared goal.
        </p>

        <div className="team grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" ref={teamMembersRef}>
          <div className="team-member bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878]">
            <div className="member-image w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-3 border-[#5a7d53] p-1">
              <img
                src={require("./ananya.png")}
                alt="Ananya Agarwal"
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <h3 className="font-sarala font-bold text-xl mb-1">Ananya Agarwal</h3>
            <p className="font-sarala text-gray-600 mb-4">NUS Mechanical Engineering</p>
            <a
              href="https://www.linkedin.com/in/ananya-agarwal-nus"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link inline-block"
            >
              <img
                src={require("./linkedin-logo.png")}
                alt="LinkedIn"
                width={40}
                height={40}
                className="linkedin-logo transition-all duration-300 hover:scale-110"
              />
            </a>
          </div>

          <div className="team-member bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878]">
            <div className="member-image w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-3 border-[#5a7d53] p-1">
              <img
                src={require("./zhuen.png")}
                alt="Boo Zhu En"
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <h3 className="font-sarala font-bold text-xl mb-1">Boo Zhu En</h3>
            <p className="font-sarala text-gray-600 mb-4">NUS Industrial and Systems Engineering</p>
            <a
              href="https://www.linkedin.com/in/boo-zhu-en"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link inline-block"
            >
              <img
                src={require("./linkedin-logo.png")}
                alt="LinkedIn"
                width={40}
                height={40}
                className="linkedin-logo transition-all duration-300 hover:scale-110"
              />
            </a>
          </div>

          <div className="team-member bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878]">
            <div className="member-image w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-3 border-[#5a7d53] p-1">
              <img
                src={require("./daphne.png")}
                alt="Daphne Wong"
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <h3 className="font-sarala font-bold text-xl mb-1">Daphne Wong</h3>
            <p className="font-sarala text-gray-600 mb-4">NUS Data Science and Analytics</p>
            <a
              href="https://www.linkedin.com/in/daphne-wong-0474361a8"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link inline-block"
            >
              <img
                src={require("./linkedin-logo.png")}
                alt="LinkedIn"
                width={40}
                height={40}
                className="linkedin-logo transition-all duration-300 hover:scale-110"
              />
            </a>
          </div>

          <div className="team-member bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878]">
            <div className="member-image w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-3 border-[#5a7d53] p-1">
              <img
                src={require("./kenta.png")}
                alt="Kenta Takayama"
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <h3 className="font-sarala font-bold text-xl mb-1">Kenta Takayama</h3>
            <p className="font-sarala text-gray-600 mb-4">NUS Chemical Engineering</p>
            <a
              href="https://www.linkedin.com/in/kenta-takayama-099231320"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link inline-block"
            >
              <img
                src={require("./linkedin-logo.png")}
                width={40}
                height={40}
                className="linkedin-logo transition-all duration-300 hover:scale-110"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="about-header text-center mb-4 mt-8">
        <div className="accent-line mx-auto"></div>
        <h1 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53]">
          WHAT OUR <span className="highlight">USERS</span> SAY
        </h1>
      </div>
      <p className="sarala-regular text-gray-800 text-center max-w-3xl mx-auto mb-12 opacity-0 transform translate-y-5" text-lg>
        Hear from our community about their experience with Ka-Ching
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        <div className="team-member bg-white p-4 rounded-xl shadow-md transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878] max-w-xs mx-auto text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-[#5a7d53]">
              <img
                src={require("./user3.png")}
                alt="Goh Kai Feng"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-sarala font-bold text-lg">Goh Kai Feng</h4>
              <p className="font-sarala text-gray-600 text-sm">25 years old</p>
            </div>
          </div>
          <p className="font-sarala text-gray-700 italic text-sm">
            "Ka-Ching made investing feel accessible, something I always found intimidating. Thanks to the clear,
            beginner-friendly lessons, I now feel confident enough to open my first trading account!"
          </p>
        </div>

        <div className="team-member bg-white p-4 rounded-xl shadow-md transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878] max-w-xs mx-auto text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-[#5a7d53]">
              <img src={require("./user2.png")} alt="blank" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-sarala font-bold text-lg">Aleisya Fuad</h4>
              <p className="font-sarala text-gray-600 text-sm">23 years old</p>
            </div>
          </div>
          <p className="font-sarala text-gray-700 italic text-sm">
            "As a young trader, I always wanted to learn both fundamental and technical analysis but was overwhelmed by
            the jargon. Ka-Ching broke it down in a way I could understand, and now I feel much more confident in my
            knowledge."
          </p>
        </div>

        <div className="team-member bg-white p-4 rounded-xl shadow-md transform transition-all duration-500 opacity-0 translate-y-8 border-2 border-transparent hover:border-[#f0d878] max-w-xs mx-auto text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-[#5a7d53]">
              <img
                src={require("./user1.png")}
                alt="blank"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-sarala font-bold text-lg">Rachel Ong</h4>
              <p className="font-sarala text-gray-600 text-sm">27 years old</p>
            </div>
          </div>
          <p className="font-sarala text-gray-700 italic text-sm">
            "I love how Ka-Ching breaks down investing into easy-to-digest lessons. The quizzes made it even more
            engaging and helped me truly grasp the basics."
          </p>
        </div>
      </div>



      {/* Features Section */}
      <section className="container mx-auto px-4 py-6 md:py-16 relative" ref={featuresRef}>
        {/* Decorative elements */}
        <div
          className="absolute top-[20%] right-[5%] w-[150px] h-[150px] rounded-full bg-[#f0d878] opacity-10 parallax"
          data-speed="0.15"
        ></div>
        <div
          className="absolute bottom-[10%] left-[5%] w-[200px] h-[200px] rounded-full bg-[#5a7d53] opacity-10 parallax"
          data-speed="0.25"
        ></div>

        <div className="text-center mb-12">
          <div className="accent-line mx-auto"></div>
          <h2 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53] mb-4">MEET KA-CHING!</h2>
          <p className="font-sarala text-lg text-gray-600 max-w-3xl mx-auto">
            Your personal assistant to help improve your relationship with investing, whether you're a complete beginner
            or looking to level up.
          </p>
        </div>

        <div className="mt-12">
          {/* Feature cards instead of buttons */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div
              className={`feature-card bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer ${activeTab === "learn" ? "border-2 border-[#5a7d53]" : "border border-gray-200 hover:border-[#5a7d53] hover:shadow-lg hover:translate-y-0 hover:opacity-100"}`}
              onClick={() => setActiveTab("learn")}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-[#5a7d53]" />
                </div>
              </div>
              <h3 className="font-silkscreen text-lg font-bold text-center text-[#5a7d53] mb-2">Learn</h3>
              <p className="text-gray-600 text-center text-sm">
                Interactive courses designed to make investing concepts easy to understand
              </p>
            </div>

            <div
              className={`feature-card bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer ${activeTab === "practice" ? "border-2 border-[#5a7d53]" : "border border-gray-200 hover:border-[#5a7d53] hover:shadow-lg hover:translate-y-0 hover:opacity-100"}`}
              onClick={() => setActiveTab("practice")}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#5a7d53]" />
                </div>
              </div>
              <h3 className="font-silkscreen text-lg font-bold text-center text-[#5a7d53] mb-2">Practice</h3>
              <p className="text-gray-600 text-center text-sm">
                Risk-free simulations to apply what you've learned in real-world scenarios
              </p>
            </div>

            <div
              className={`feature-card bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer ${activeTab === "track" ? "border-2 border-[#5a7d53]" : "border border-gray-200 hover:border-[#5a7d53] hover:shadow-lg hover:translate-y-0 hover:opacity-100"}`}
              onClick={() => setActiveTab("track")}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-[#5a7d53]" />
                </div>
              </div>
              <h3 className="font-silkscreen text-lg font-bold text-center text-[#5a7d53] mb-2">Track</h3>
              <p className="text-gray-600 text-center text-sm">
                Monitor your progress and portfolio performance with intuitive tools
              </p>
            </div>

            <div
              className={`feature-card bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer ${activeTab === "community" ? "border-2 border-[#5a7d53]" : "border border-gray-200 hover:border-[#5a7d53] hover:shadow-lg hover:translate-y-0 hover:opacity-100"}`}
              onClick={() => setActiveTab("community")}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-[#5a7d53]" />
                </div>
              </div>
              <h3 className="font-silkscreen text-lg font-bold text-center text-[#5a7d53] mb-2">Community</h3>
              <p className="text-gray-600 text-center text-sm">
                Connect with fellow investors to share insights and learn together
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="tab-pane active p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <h3 className="font-sarala text-2xl font-bold text-[#5a7d53] mb-4">Interactive Learning Paths</h3>
                  <p className="font-sarala text-lg text-gray-600 mb-6">
                    Our step-by-step courses break down complex investing concepts into bite-sized, engaging lessons
                    that anyone can understand.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#06D6A0] mr-2">✓</span>
                      <span>Personalized learning paths based on your goals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#06D6A0] mr-2">✓</span>
                      <span>Visual explanations of complex concepts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#06D6A0] mr-2">✓</span>
                      <span>Quizzes to reinforce your knowledge</span>
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  {/* Interactive trading chart */}
                  <div className="relative bg-white rounded-xl shadow-md p-4 overflow-hidden">
                    <h4 className="text-lg font-bold text-[#5a7d53] mb-2">Interactive Stock Chart</h4>
                    <div className="chart-container" style={{ cursor: "grab" }}>
                      <canvas id="tradingChart" width="500" height="300" className="w-full h-auto"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#f9f9f0] to-[#f0f9f4] py-16 md:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute w-full h-full top-0 left-0 overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-[100px] h-[100px] rounded-full bg-[#5a7d53] opacity-10 animate-float"></div>
          <div
            className="absolute top-[30%] right-[10%] w-[150px] h-[150px] rounded-full bg-[#f0d878] opacity-10 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-[20%] left-[20%] w-[120px] h-[120px] rounded-full bg-[#06D6A0] opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-silkscreen text-3xl md:text-4xl font-bold text-[#5a7d53] mb-6">
            START YOUR INVESTMENT JOURNEY TODAY
          </h2>
          <p className="font-sarala text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are mastering investing the fun way!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/signup"
              className="bg-[#06D6A0] hover:bg-transparent hover:text-[#06D6A0] text-white font-sarala font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-[#06D6A0]"
            >
              GET STARTED FOR FREE
            </Link>
            <Link
              to="/demo"
              className="bg-transparent text-[#5a7d53] hover:bg-[#5a7d53] hover:text-white font-sarala font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 border-2 border-[#5a7d53]"
            >
              WATCH DEMO
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <span
                className="block text-4xl md:text-5xl font-silkscreen font-bold text-[#5a7d53] mb-2 count-up"
                data-target="10000"
              >
                7
              </span>
              <span className="font-sarala text-gray-600">Active Users</span>
            </div>
            <div className="text-center">
              <span
                className="block text-4xl md:text-5xl font-silkscreen font-bold text-[#5a7d53] mb-2 count-up"
                data-target="50"
              >
                3
              </span>
              <span className="font-sarala text-gray-600">Lessons</span>
            </div>
            <div className="text-center">
              <span
                className="block text-4xl md:text-5xl font-silkscreen font-bold text-[#5a7d53] mb-2 count-up"
                data-target="95"
              >
                100
              </span>
              <span className="font-sarala text-gray-600">Satisfaction Rate</span>
              <span className="text-3xl font-silkscreen text-[#5a7d53]">%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5a7d53] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#f0d878] flex items-center justify-center mr-2">
                  <span className="text-[#5a7d53] font-bold">^_^</span>
                </div>
                <span className="font-silkscreen text-xl">KA-CHING</span>
              </div>
              <p className="font-sarala max-w-xs">Making investing fun, easy, and accessible for everyone.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-silkscreen text-lg mb-4 text-[#f0d878]">Navigation</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="hover:text-[#f0d878] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/#about" className="hover:text-[#f0d878] transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className="hover:text-[#f0d878] transition-colors">
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#f0d878] transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-silkscreen text-lg mb-4 text-[#f0d878]">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/terms" className="hover:text-[#f0d878] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-[#f0d878] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-silkscreen text-lg mb-4 text-[#f0d878]">Contact</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:ask.kaching@gmail.com" className="hover:text-[#f0d878] transition-colors">
                      ask.kaching@gmail.com
                    </a>
                  </li>
                  <li>
                    <span>NUS, Singapore</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p>&copy; {new Date().getFullYear()} Ka-Ching. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, label, active = false }) {

  const handleClick = (e) => {
    if (to === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      // Still update the URL to "/" without the hash
      window.history.pushState({}, "", "/")
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`font-sarala font-bold px-4 py-2 rounded-md transition-all duration-300 ${
        active ? "text-[#5a7d53] bg-[#f0f9f4]" : "text-gray-600 hover:text-[#5a7d53] hover:bg-[#f0f9f4]"
      }`}
    >
      {label}
    </Link>
  )
}

export default App
