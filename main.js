// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Mobile submenu toggle
document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('open');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.querySelectorAll('.has-submenu').forEach(item => {
            item.classList.remove('open');
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popupOverlay")
  const closeBtn = document.getElementById("closeBtn")
  const trialForm = document.getElementById("trialForm")
  const successPopup = document.getElementById("successPopup")
  const successCloseBtn = document.getElementById("successCloseBtn")

  // Form validation patterns
  const validationPatterns = {
    userName: /^[a-zA-Z\s]{2,50}$/,
    userEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    userPhone: /^[+]?[1-9][\d]{0,15}$/,
    userMessage: /^.{10,500}$/,
  }

  // Error messages
  const errorMessages = {
    userName: "Please enter a valid name (2-50 characters, letters only)",
    userEmail: "Please enter a valid email address",
    userPhone: "Please enter a valid phone number",
    userMessage: "Please enter a message (10-500 characters)",
  }

  // Check if popup was already shown in this session
  const popupShown = sessionStorage.getItem("trialPopupShown")

  // Show popup after 3 seconds if not already shown
  if (!popupShown) {
    setTimeout(() => {
      showPopup()
      sessionStorage.setItem("trialPopupShown", "true")
    }, 3000)
  }

  // Show popup function
  function showPopup() {
    popupOverlay.classList.add("active")
    document.body.style.overflow = "hidden"

    // Focus trap
    const focusableElements = popupOverlay.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])')
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (firstElement) {
      setTimeout(() => firstElement.focus(), 100)
    }

    // Handle tab key for focus trap
    popupOverlay.addEventListener("keydown", handleTabKey)

    function handleTabKey(e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }
  }

  // Close popup function
  function closePopup() {
    popupOverlay.classList.remove("active")
    document.body.style.overflow = ""
    resetForm()
  }

  // Show success popup
  function showSuccessPopup() {
    successPopup.classList.add("active")
    setTimeout(() => {
      successPopup.classList.remove("active")
      closePopup()
    }, 3000) // Auto close after 3 seconds
  }

  // Event listeners
  closeBtn.addEventListener("click", closePopup)
  successCloseBtn.addEventListener("click", () => {
    successPopup.classList.remove("active")
    closePopup()
  })

  // Close on overlay click
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      closePopup()
    }
  })

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupOverlay.classList.contains("active")) {
      closePopup()
    }
  })

  // Form validation functions
  function validateField(fieldName, value) {
    const pattern = validationPatterns[fieldName]
    if (!pattern) return true
    return pattern.test(value.trim())
  }

  function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + "Error")
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.add("show")
    }
  }

  function hideError(fieldName) {
    const errorElement = document.getElementById(fieldName + "Error")
    if (errorElement) {
      errorElement.classList.remove("show")
    }
  }

  // Real-time validation
  const formFields = ["userName", "userEmail", "userPhone", "userMessage"]

  formFields.forEach((fieldName) => {
    const field = document.getElementById(fieldName)
    if (field) {
      field.addEventListener("blur", function () {
        const value = this.value.trim()
        if (value && !validateField(fieldName, value)) {
          showError(fieldName, errorMessages[fieldName])
        } else {
          hideError(fieldName)
        }
      })

      field.addEventListener("input", () => {
        hideError(fieldName)
      })
    }
  })

  // Form submission
  trialForm.addEventListener("submit", function (e) {
    e.preventDefault()

    let isValid = true
    const formData = new FormData(this)

    // Validate all required fields
    formFields.forEach((fieldName) => {
      const value = formData.get(fieldName)
      if (!value || !value.trim()) {
        showError(
          fieldName,
          `${fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`,
        )
        isValid = false
      } else if (!validateField(fieldName, value)) {
        showError(fieldName, errorMessages[fieldName])
        isValid = false
      }
    })

    if (isValid) {
      // Disable submit button
      const submitBtn = this.querySelector(".submit-btn")
      const originalText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML = "<span>SUBMITTING...</span>"

      // Simulate form submission
      setTimeout(() => {
        showSuccessPopup()
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      }, 1500)
    }
  })

  // Reset form
  function resetForm() {
    trialForm.reset()
    formFields.forEach((fieldName) => {
      hideError(fieldName)
    })
  }

  // Phone number formatting
  const phoneInput = document.getElementById("userPhone")
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 0 && !value.startsWith("91") && value.length <= 10) {
        value = "91" + value
      }
      if (value.length > 12) {
        value = value.slice(0, 12)
      }
      e.target.value = value
    })
  }

  // Email validation enhancement
  const emailInput = document.getElementById("userEmail")
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim().toLowerCase()
      this.value = email
    })
  }

  // Name input enhancement
  const nameInput = document.getElementById("userName")
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      // Capitalize first letter of each word
      let value = e.target.value
      value = value.replace(/\b\w/g, (l) => l.toUpperCase())
      e.target.value = value
    })
  }

  // Auto-resize textarea
  const messageTextarea = document.getElementById("userMessage")
  if (messageTextarea) {
    messageTextarea.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = Math.min(this.scrollHeight, 200) + "px"
    })
  }

  // Prevent form submission on Enter key in input fields
  const inputs = trialForm.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        const nextInput =
          this.parentElement.nextElementSibling?.querySelector("input, textarea") ||
          this.parentElement.parentElement.nextElementSibling?.querySelector("input, textarea")
        if (nextInput) {
          nextInput.focus()
        } else {
          trialForm.querySelector(".submit-btn").click()
        }
      }
    })
  })


})
