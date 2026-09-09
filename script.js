document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Copyright Year
    document.querySelectorAll(".current-year").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // Active Navigation Highlighting
    const navLinks = document.querySelectorAll(".main-nav a");
    const currentFile = window.location.pathname.split("/").pop().toLowerCase();
    let currentPage = currentFile.replace(".html", "");
    if (currentPage === "" || currentPage === "index") {
        currentPage = "index";
    }

    navLinks.forEach((link) => {
        if (link.dataset.page === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    // Sticky Header Scroll Effect
    const header = document.querySelector(".site-header");
    function updateHeader() {
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }

    // Carousel Logic for Hackathon
    const carousel = document.querySelector(".carousel");
    if (carousel) {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const prevBtn = carousel.querySelector(".carousel-prev");
        const nextBtn = carousel.querySelector(".carousel-next");

        if (track && slides.length > 0) {
            let currentIndex = 0;
            let autoPlayTimer = null;

            function showSlide(index) {
                if (index < 0) currentIndex = slides.length - 1;
                else if (index >= slides.length) currentIndex = 0;
                else currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            function nextSlide() { showSlide(currentIndex + 1); }
            function prevSlide() { showSlide(currentIndex - 1); }
            
            function startAutoPlay() {
                if (autoPlayTimer) clearInterval(autoPlayTimer);
                autoPlayTimer = setInterval(nextSlide, 4500);
            }

            if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAutoPlay(); });
            if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAutoPlay(); });

            carousel.addEventListener("mouseenter", () => clearInterval(autoPlayTimer));
            carousel.addEventListener("mouseleave", startAutoPlay);
            
            showSlide(0);
            startAutoPlay();
        }
    }
});