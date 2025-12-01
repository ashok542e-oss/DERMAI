document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Scroll Animations (Reveal Features) ---
    const observerOptions = {
        threshold: 0.2 // Trigger when 20% visible
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

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });


    // --- 2. Testimonial Slider ---
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    if(testimonials.length > 0) {
        testimonials[0].classList.add('active');
    }

    function rotateTestimonials() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    setInterval(rotateTestimonials, 4000);


    // --- 3. Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});