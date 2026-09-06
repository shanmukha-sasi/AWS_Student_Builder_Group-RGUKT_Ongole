/* =========================================================
   AWS STUDENT BUILDER GROUP
   Vanilla JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       CURRENT YEAR
       ----------------------------------------------------- */

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach((element) => {
        element.textContent =
            new Date().getFullYear();
    });


    /* -----------------------------------------------------
       ACTIVE NAVIGATION
       ----------------------------------------------------- */

    const navLinks =
        document.querySelectorAll(".main-nav a");

    const currentFile =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    let currentPage = currentFile
        .replace(".html", "");

    if (
        currentPage === "" ||
        currentPage === "index"
    ) {
        currentPage = "index";
    }


    navLinks.forEach((link) => {

        const page =
            link.dataset.page;

        if (page === currentPage) {
            link.classList.add("active");
            link.setAttribute(
                "aria-current",
                "page"
            );
        }

    });


    /* -----------------------------------------------------
       HACKATHON CAROUSEL
       ----------------------------------------------------- */

    const carousel =
        document.querySelector(".carousel");

    if (carousel) {

        const track =
            carousel.querySelector(".carousel-track");

        const slides =
            Array.from(
                carousel.querySelectorAll(".carousel-slide")
            );

        const previousButton =
            carousel.querySelector(".carousel-prev");

        const nextButton =
            carousel.querySelector(".carousel-next");

        if (
            track &&
            slides.length > 0
        ) {

            let currentIndex = 0;

            let autoPlayTimer;


            function showSlide(index) {

                if (index < 0) {
                    currentIndex =
                        slides.length - 1;
                }
                else if (
                    index >= slides.length
                ) {
                    currentIndex = 0;
                }
                else {
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


            function startAutoPlay() {

                stopAutoPlay();

                autoPlayTimer =
                    setInterval(
                        nextSlide,
                        4500
                    );

            }


            function stopAutoPlay() {

                if (autoPlayTimer) {
                    clearInterval(
                        autoPlayTimer
                    );
                }

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


            /* Touch swipe */

            let touchStartX = 0;
            let touchEndX = 0;


            carousel.addEventListener(
                "touchstart",
                (event) => {

                    touchStartX =
                        event.changedTouches[0].screenX;

                },
                { passive: true }
            );


            carousel.addEventListener(
                "touchend",
                (event) => {

                    touchEndX =
                        event.changedTouches[0].screenX;

                    const distance =
                        touchEndX - touchStartX;


                    if (Math.abs(distance) > 50) {

                        if (distance < 0) {
                            nextSlide();
                        }
                        else {
                            previousSlide();
                        }

                        startAutoPlay();

                    }

                },
                { passive: true }
            );


            showSlide(0);

            startAutoPlay();

        }

    }


    /* -----------------------------------------------------
       VIDEO AUTOPLAY FALLBACK
       ----------------------------------------------------- */

    const video =
        document.querySelector(".hackathon-video");

    const fallback =
        document.querySelector(".video-fallback");

    const playButton =
        document.querySelector(".video-play-button");


    if (video) {

        function showVideoFallback() {

            if (fallback) {
                fallback.classList.add("visible");
            }

        }


        function hideVideoFallback() {

            if (fallback) {
                fallback.classList.remove("visible");
            }

        }


        video.addEventListener(
            "error",
            showVideoFallback
        );


        video.addEventListener(
            "loadeddata",
            () => {

                video.play()
                    .then(() => {
                        hideVideoFallback();
                    })
                    .catch(() => {
                        showVideoFallback();
                    });

            }
        );


        /* Try autoplay immediately */

        const playPromise =
            video.play();


        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    hideVideoFallback();

                })
                .catch(() => {

                    showVideoFallback();

                });

        }


        /* Manual fallback button */

        if (playButton) {

            playButton.addEventListener(
                "click",
                () => {

                    video.play()
                        .then(() => {

                            hideVideoFallback();

                        })
                        .catch(() => {

                            showVideoFallback();

                        });

                }
            );

        }

    }

});