import { useEffect } from 'react';

export const useScrollEffects = () => {
  useEffect(() => {
    // Intersection Observer for scroll reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe all elements with section-reveal class
    const revealElements = document.querySelectorAll('.section-reveal');
    revealElements.forEach(element => observer.observe(element));

    // Parallax effect for backgrounds
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach(element => {
        const speed = 0.05;
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });

      // Navbar scroll effect
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};