// Enhanced interactivity for the EzSoftwares diagram
document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card")
  const centralCircle = document.querySelector(".central-circle")
  const ezText = document.querySelector(".ez-text")

  class EzSoftwaresDashboard {
    constructor() {
      this.products = [
        {
          id: 1,
          name: "EzAttendancePro",
          subtitle: "Attendance & Leave Management",
          description:
            "Comprehensive attendance tracking and leave management solution with biometric integration and advanced reporting capabilities.",
          features: [
            "Biometric Integration",
            "Leave Management",
            "Real-time Reporting",
            "Mobile App Support",
            "Automated Notifications",
          ],
        },
        {
          id: 2,
          name: "EzPayroll",
          subtitle: "Payroll Management System",
          description:
            "Complete payroll processing system with tax calculations, employee benefits management, and compliance reporting.",
          features: [
            "Automated Payroll Processing",
            "Tax Calculations",
            "Benefits Management",
            "Compliance Reporting",
            "Direct Deposit",
          ],
        },
        {
          id: 3,
          name: "EzVMS",
          subtitle: "Visitor Management System",
          description:
            "Advanced visitor management with pre-registration, badge printing, and security integration for enhanced facility security.",
          features: [
            "Pre-registration Portal",
            "Badge Printing",
            "Security Integration",
            "Visitor Analytics",
            "Emergency Evacuation",
          ],
        },
        {
          id: 4,
          name: "EzAccess",
          subtitle: "Mobile Access Control",
          description:
            "Mobile-first access control solution with QR codes, remote management, and real-time monitoring capabilities.",
          features: [
            "Mobile App Access",
            "QR Code Integration",
            "Remote Management",
            "Real-time Monitoring",
            "Multi-location Support",
          ],
        },
        {
          id: 5,
          name: "EzClub",
          subtitle: "Club Management System",
          description:
            "Complete club management solution for member registration, event planning, billing, and facility booking.",
          features: [
            "Member Management",
            "Event Planning",
            "Billing System",
            "Facility Booking",
            "Communication Tools",
          ],
        },
        {
          id: 6,
          name: "EzSocietyPro",
          subtitle: "Society Management",
          description:
            "Comprehensive society management with resident portal, maintenance tracking, and community communication features.",
          features: [
            "Resident Portal",
            "Maintenance Tracking",
            "Community Communication",
            "Billing Management",
            "Visitor Management",
          ],
        },
        {
          id: 7,
          name: "EzCanteen",
          subtitle: "Canteen Management",
          description:
            "Digital canteen management with menu planning, order processing, inventory control, and cashless payments.",
          features: [
            "Menu Management",
            "Order Processing",
            "Inventory Control",
            "Cashless Payments",
            "Nutritional Tracking",
          ],
        },
        {
          id: 8,
          name: "EzGuard",
          subtitle: "Security Management",
          description:
            "Comprehensive security management with guard patrolling, incident reporting, and real-time tracking capabilities.",
          features: [
            "Guard Patrolling",
            "Incident Reporting",
            "Real-time Tracking",
            "Route Planning",
            "Emergency Response",
          ],
        },
        {
          id: 9,
          name: "EzMeeting",
          subtitle: "Meeting Room Management",
          description:
            "Smart meeting room booking system with resource management, calendar integration, and usage analytics.",
          features: [
            "Room Booking",
            "Resource Management",
            "Calendar Integration",
            "Usage Analytics",
            "Automated Setup",
          ],
        },
        {
          id: 10,
          name: "EzCRM",
          subtitle: "Customer Relationship",
          description:
            "Advanced CRM system for lead management, sales pipeline tracking, and comprehensive customer support.",
          features: [
            "Lead Management",
            "Sales Pipeline",
            "Customer Support",
            "Analytics Dashboard",
            "Integration APIs",
          ],
        },
      ]

      this.init()
    }

    init() {
      this.positionProducts()
      this.createConnectionLines()
      this.setupEventListeners()
      this.handleResize()
    }

    getResponsiveCardSize() {
      const screenWidth = window.innerWidth

      if (screenWidth <= 480) {
        return { width: 180, height: 60 }
      } else if (screenWidth <= 768) {
        return { width: 200, height: 65 }
      } else if (screenWidth <= 900) {
        return { width: 220, height: 70 }
      } else if (screenWidth <= 1200) {
        return { width: 250, height: 75 }
      } else {
        return { width: 280, height: 80 }
      }
    }

    positionProducts() {
      const productCards = document.querySelectorAll(".product-card")
      const container = document.querySelector(".dashboard-container")

      if (!container || !productCards.length) return

      const containerRect = container.getBoundingClientRect()
      const centerX = containerRect.width / 2
      const centerY = containerRect.height / 2

      // Get responsive card dimensions
      const cardSize = this.getResponsiveCardSize()
      const cardWidth = cardSize.width
      const cardHeight = cardSize.height
      const numCards = productCards.length

      // Calculate minimum radius needed to prevent overlapping
      const angleStep = (2 * Math.PI) / numCards
      const minChordLength = cardWidth * 1.15 // Closer spacing - only 15% buffer
      const minRadius = minChordLength / (2 * Math.sin(angleStep / 2))

      // Calculate maximum possible radius
      const containerPadding = 40 // Reduced padding for closer positioning
      const maxRadius = Math.min(centerX, centerY) - Math.max(cardWidth, cardHeight) / 2 - containerPadding

      // Use tighter radius calculation for closer positioning
      const radius = Math.max(minRadius, Math.min(maxRadius, maxRadius * 0.85))

      productCards.forEach((card, index) => {
        // Update card size
        card.style.width = cardWidth + "px"
        card.style.height = cardHeight + "px"

        // Calculate angle for perfect radial distribution
        const angle = index * angleStep - Math.PI / 2

        // Calculate position using polar coordinates
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        // Position the card centered on the calculated point
        const finalX = x - cardWidth / 2
        const finalY = y - cardHeight / 2

        // Apply position
        card.style.position = "absolute"
        card.style.left = finalX + "px"
        card.style.top = finalY + "px"
        card.style.transform = "none"

        // Store position data
        card.dataset.x = x
        card.dataset.y = y
        card.dataset.angle = angle
      })
    }

    createConnectionLines() {
      const svg = document.querySelector(".connection-lines")
      const productCards = document.querySelectorAll(".product-card")
      const centralLogo = document.querySelector(".central-logo")

      if (!svg || !productCards.length || !centralLogo) return

      // Clear existing lines
      svg.innerHTML = svg.querySelector("defs").outerHTML

      const container = document.querySelector(".dashboard-container")
      const containerRect = container.getBoundingClientRect()

      // Use container center directly since the EZ logo is centered in the container
      // Move the line starting point slightly to the left
      const ezCenterX = containerRect.width / 2 - 110 
      const ezCenterY = containerRect.height / 2 - 130

      productCards.forEach((card, index) => {
        const x = Number.parseFloat(card.dataset.x)
        const y = Number.parseFloat(card.dataset.y)

        // Create connection line from EZ logo center to card center
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", ezCenterX)
        line.setAttribute("y1", ezCenterY)
        line.setAttribute("x2", x)
        line.setAttribute("y2", y)
        line.setAttribute("stroke", "url(#lineGradient)")
        line.setAttribute("stroke-width", "2")
        line.setAttribute("opacity", "0.6")
        line.style.animation = `fadeIn 0.8s ease ${index * 0.1}s both`

        svg.appendChild(line)
      })
    }

    setupEventListeners() {
      // Product card clicks
      document.querySelectorAll(".product-card").forEach((card, index) => {
        card.addEventListener("click", () => this.showProductModal(index))

        // Enhanced hover effects
        card.addEventListener("mouseenter", () => {
          this.pauseAnimations()
          card.style.zIndex = "100"
        })

        card.addEventListener("mouseleave", () => {
          this.resumeAnimations()
          card.style.zIndex = "50"
        })
      })

      // Central logo click
      document.querySelector(".central-logo").addEventListener("click", () => {
        this.showSuiteOverview()
      })

      // Modal close handlers
      const modal = document.getElementById("productModal")
      const closeBtn = modal.querySelector(".modal-close")

      closeBtn.addEventListener("click", () => this.closeModal())
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal()
      })

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeModal()
        if (e.key >= "1" && e.key <= "9") {
          this.showProductModal(Number.parseInt(e.key) - 1)
        }
        if (e.key === "0") {
          this.showProductModal(9)
        }
      })

      // Mobile menu toggle
      const mobileToggle = document.querySelector(".mobile-menu-toggle")
      const navMenu = document.querySelector(".nav-menu")

      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
          navMenu.classList.toggle("active")
          mobileToggle.classList.toggle("active")
        })
      }
    }

    showProductModal(index) {
      const product = this.products[index]
      if (!product) return

      const modal = document.getElementById("productModal")
      const modalNumber = modal.querySelector(".modal-number")
      const modalTitle = modal.querySelector(".modal-title")
      const modalDescription = modal.querySelector(".modal-description")
      const featuresList = modal.querySelector(".features-list")

      modalNumber.textContent = String(product.id).padStart(2, "0")
      modalTitle.textContent = product.name
      modalDescription.textContent = product.description

      // Populate features
      featuresList.innerHTML = ""
      product.features.forEach((feature) => {
        const li = document.createElement("li")
        li.textContent = feature
        featuresList.appendChild(li)
      })

      modal.classList.add("active")
      document.body.style.overflow = "hidden"
    }

    showSuiteOverview() {
      const modal = document.getElementById("productModal")
      const modalNumber = modal.querySelector(".modal-number")
      const modalTitle = modal.querySelector(".modal-title")
      const modalDescription = modal.querySelector(".modal-description")
      const featuresList = modal.querySelector(".features-list")

      modalNumber.textContent = "EZ"
      modalTitle.textContent = "EzSoftwares Suite"
      modalDescription.textContent =
        "Complete business management solutions designed to streamline operations, enhance productivity, and drive digital transformation across all aspects of your organization."

      // Show all products as features
      featuresList.innerHTML = ""
      this.products.forEach((product) => {
        const li = document.createElement("li")
        li.textContent = `${product.name} - ${product.subtitle}`
        featuresList.appendChild(li)
      })

      modal.classList.add("active")
      document.body.style.overflow = "hidden"
    }

    closeModal() {
      const modal = document.getElementById("productModal")
      modal.classList.remove("active")
      document.body.style.overflow = ""
    }

    pauseAnimations() {
      const animatedElements = document.querySelectorAll(".central-logo, .ring")
      animatedElements.forEach((el) => {
        el.style.animationPlayState = "paused"
      })
    }

    resumeAnimations() {
      const animatedElements = document.querySelectorAll(".central-logo, .ring")
      animatedElements.forEach((el) => {
        el.style.animationPlayState = "running"
      })
    }

    handleResize() {
      let resizeTimeout

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          this.positionProducts()
          this.createConnectionLines()
        }, 150)
      })

      window.addEventListener("orientationchange", () => {
        setTimeout(() => {
          this.positionProducts()
          this.createConnectionLines()
        }, 300)
      })
    }
  }

  // Initialize dashboard when DOM is loaded
  new EzSoftwaresDashboard()

  // Add CSS animation for fade in effect
  const style = document.createElement("style")
  style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .product-card {
            animation: fadeIn 0.8s ease both;
        }

        .products-orbit {
          position: relative;
          width: 100%;
          height: 100%;
          /* Ensure container has proper positioning context */
        }
        
        .product-card {
          position: absolute;
          width: 280px;
          height: 80px;
          /* Remove any transform-origin that might interfere */
          transform-origin: center;
          /* Ensure proper stacking */
          z-index: 50;
        }
    `
  document.head.appendChild(style)
})
