/* =========================================================
   AWS STUDENT BUILDER GROUP
   PREMIUM VANILLA JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll(".current-year")
        .forEach((element) => {

            element.textContent =
                new Date().getFullYear();

        });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(".main-nav a");

    const currentFile =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    let currentPage =
        currentFile.replace(".html", "");

    if (
        currentPage === "" ||
        currentPage === "index"
    ) {

        currentPage = "index";

    }


    navLinks.forEach((link) => {

        if (
            link.dataset.page === currentPage
        ) {

            link.classList.add("active");

            link.setAttribute(
                "aria-current",
                "page"
            );

        }

    });


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");


    function updateHeader() {

        if (!header) {
            return;
        }

        if (
            window.scrollY > 30
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.classList.add(
                            "visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach((element) => {

            observer.observe(
                element
            );

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* =====================================================
       HERO PARALLAX
       ===================================================== */

    const hero =
        document.querySelector(".hero");

    const codeCard =
        document.querySelector(
            ".hero-code-card"
        );


    if (
        hero &&
        codeCard &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        hero.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    hero.getBoundingClientRect();


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width -
                    0.5;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height -
                    0.5;


                codeCard.style.transform =
                    `translate(${x * 8}px, ${y * 8}px) rotate(2deg)`;

            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                codeCard.style.transform =
                    "translate(0, 0) rotate(2deg)";

            }
        );

    }


    /* =====================================================
       BUILDER CARD TILT
       ===================================================== */

    const builderCards =
        document.querySelectorAll(
            ".builder-card"
        );


    if (
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        builderCards.forEach((card) => {


            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const rotateX =
                        (
                            y /
                            rect.height -
                            0.5
                        ) * -3;


                    const rotateY =
                        (
                            x /
                            rect.width -
                            0.5
                        ) * 3;


                    card.style.transform =
                        `translateY(-10px)
                         perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       BUTTON RIPPLE EFFECT
       ===================================================== */

    document
        .querySelectorAll(".btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    button.style.transform =
                        "translateY(-1px)";

                    setTimeout(() => {

                        button.style.transform =
                            "";

                    }, 120);

                }
            );

        });


    /* =====================================================
       HACKATHON CAROUSEL
       Keeps existing carousel functionality
       ===================================================== */

    const carousel =
        document.querySelector(".carousel");


    if (carousel) {

        const track =
            carousel.querySelector(
                ".carousel-track"
            );


        const slides =
            Array.from(
                carousel.querySelectorAll(
                    ".carousel-slide"
                )
            );


        const previousButton =
            carousel.querySelector(
                ".carousel-prev"
            );


        const nextButton =
            carousel.querySelector(
                ".carousel-next"
            );


        if (
            track &&
            slides.length > 0
        ) {

            let currentIndex = 0;

            let autoPlayTimer = null;


            function showSlide(index) {

                if (
                    index < 0
                ) {

                    currentIndex =
                        slides.length - 1;

                } else if (
                    index >= slides.length
                ) {

                    currentIndex = 0;

                } else {

                    currentIndex = index;

                }


                track.style.transform =
                    `translateX(-${currentIndex * 100}%)`;

            }


            function nextSlide() {

                showSlide(
                    currentIndex + 1
                );

            }


            function previousSlide() {

                showSlide(
                    currentIndex - 1
                );

            }


            function stopAutoPlay() {

                if (
                    autoPlayTimer !== null
                ) {

                    clearInterval(
                        autoPlayTimer
                    );

                    autoPlayTimer = null;

                }

            }


            function startAutoPlay() {

                stopAutoPlay();

                autoPlayTimer =
                    setInterval(
                        nextSlide,
                        4500
                    );

            }


            if (nextButton) {

                nextButton.addEventListener(
                    "click",
                    () => {

                        nextSlide();

                        startAutoPlay();

                    }
                );

            }


            if (previousButton) {

                previousButton.addEventListener(
                    "click",
                    () => {

                        previousSlide();

                        startAutoPlay();

                    }
                );

            }


            carousel.addEventListener(
                "mouseenter",
                stopAutoPlay
            );


            carousel.addEventListener(
                "mouseleave",
                startAutoPlay
            );


            carousel.addEventListener(
                "focusin",
                stopAutoPlay
            );


            carousel.addEventListener(
                "focusout",
                startAutoPlay
            );


            let touchStartX = 0;


            carousel.addEventListener(
                "touchstart",
                (event) => {

                    if (
                        event.changedTouches.length
                    ) {

                        touchStartX =
                            event.changedTouches[0]
                                .screenX;

                    }

                },
                {
                    passive: true
                }
            );


            carousel.addEventListener(
                "touchend",
                (event) => {

                    if (
                        !event.changedTouches.length
                    ) {

                        return;

                    }


                    const touchEndX =
                        event.changedTouches[0]
                            .screenX;


                    const distance =
                        touchEndX -
                        touchStartX;


                    if (
                        Math.abs(distance) > 50
                    ) {

                        if (
                            distance < 0
                        ) {

                            nextSlide();

                        } else {

                            previousSlide();

                        }


                        startAutoPlay();

                    }

                },
                {
                    passive: true
                }
            );


            showSlide(0);

            startAutoPlay();

        }

    }


    /* =====================================================
       VIDEO FALLBACK
       ===================================================== */

    const video =
        document.querySelector(
            ".hackathon-video"
        );


    const fallback =
        document.querySelector(
            ".video-fallback"
        );


    const playButton =
        document.querySelector(
            ".video-play-button"
        );


    if (video) {

        function showFallback() {

            if (fallback) {

                fallback.classList.add(
                    "visible"
                );

            }

        }


        function hideFallback() {

            if (fallback) {

                fallback.classList.remove(
                    "visible"
                );

            }

        }


        video.addEventListener(
            "error",
            showFallback
        );


        video.addEventListener(
            "loadeddata",
            () => {

                video.play()
                    .then(
                        hideFallback
                    )
                    .catch(
                        showFallback
                    );

            }
        );


        const playPromise =
            video.play();


        if (
            playPromise !== undefined
        ) {

            playPromise
                .then(
                    hideFallback
                )
                .catch(
                    showFallback
                );

        }


        if (playButton) {

            playButton.addEventListener(
                "click",
                () => {

                    video.play()
                        .then(
                            hideFallback
                        )
                        .catch(
                            showFallback
                        );

                }
            );

        }

    }


    /* =====================================================
       PAGE LOADED
       ===================================================== */

    document.body.classList.add(
        "page-loaded"
    );

});