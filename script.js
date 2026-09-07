const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const revealElements = document.querySelectorAll(".reveal");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function closeNav() {
  if (!nav || !navToggle || !header) return;
  nav.classList.remove("open");
  header.classList.remove("nav-active");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    header.classList.toggle("nav-active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 740) {
    closeNav();
  }
});
updateHeader();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

window.addEventListener("load", () => {
  document.body.classList.add("hero-loaded");
});

/* ---------- Contact form ----------
   The form ships hidden. It is only revealed when data-endpoint holds a real URL, because a
   form that posts nowhere would swallow client enquiries without anyone noticing. */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const endpoint = (contactForm.dataset.endpoint || "").trim();
  const status = contactForm.querySelector(".form-status");

  if (endpoint) {
    contactForm.hidden = false;

    const clearError = (input) => {
      input.removeAttribute("aria-invalid");
      const existing = input.parentElement.querySelector(".error");
      if (existing) existing.remove();
    };

    const showError = (input, message) => {
      clearError(input);
      input.setAttribute("aria-invalid", "true");
      const note = document.createElement("span");
      note.className = "error";
      note.textContent = message;
      input.parentElement.appendChild(note);
    };

    const validate = () => {
      const problems = [];
      const checks = [
        ["cf-name", (v) => v.trim().length > 0, "Please enter your name."],
        ["cf-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Please enter a valid email address."],
        ["cf-message", (v) => v.trim().length > 0, "Please tell us how we can help."],
      ];
      checks.forEach(([id, ok, message]) => {
        const input = document.getElementById(id);
        if (!input) return;
        if (ok(input.value)) clearError(input);
        else { showError(input, message); problems.push(input); }
      });

      const ack = document.getElementById("cf-ack");
      if (ack && !ack.checked) { showError(ack, "Please confirm you have read the notice."); problems.push(ack); }
      else if (ack) clearError(ack);

      return problems;
    };

    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => clearError(input));
      input.addEventListener("change", () => clearError(input));
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      const problems = validate();
      if (problems.length) {
        problems[0].focus();
        status.textContent = "Please correct the highlighted fields.";
        status.className = "form-status bad";
        return;
      }

      const button = contactForm.querySelector('button[type="submit"]');
      const original = button.textContent;
      button.disabled = true;
      button.textContent = "Sending…";
      status.textContent = "Sending your message…";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm),
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        contactForm.reset();
        status.textContent =
          "Thank you. Your message has been sent and we will respond as soon as possible.";
        status.className = "form-status ok";
      } catch (error) {
        status.innerHTML =
          'Sorry, that did not send. Please call <a href="tel:+15732768656">573-276-8656</a> or email <a href="mailto:inquiries@butlerlegalservice.com">inquiries@butlerlegalservice.com</a>.';
        status.className = "form-status bad";
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  }
}
