document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Scroll Animations (Reveal Features) ---
    const observerOptions = {
        threshold: 0.2 // Trigger when 20% of card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach(card => observer.observe(card));

    // --- 2. Testimonial Slider ---
    const testimonials = document.querySelectorAll(".testimonial-card");
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        testimonials[0].classList.add("active");
    }

    function rotateTestimonials() {
        if (testimonials.length <= 1) return;
        testimonials[currentTestimonial].classList.remove("active");
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add("active");
    }

    if (testimonials.length > 1) {
        setInterval(rotateTestimonials, 4000);
    }

    // --- 3. Smooth Scroll for in-page links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
});
