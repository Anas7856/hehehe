// --------------------------------------------- //
// GSAP Plugin Setup
// --------------------------------------------- //
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------- //
// SplitType Text Reveal Animations
// --------------------------------------------- //
const splitTypes = document.querySelectorAll(".reveal-type");
splitTypes.forEach((char, i) => {
  const text = new SplitType(char, { types: 'words, chars' });
  gsap.from(text.chars, {
    scrollTrigger: {
      trigger: char,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
      markers: false
    },
    opacity: 0.2,
    stagger: 0.1
  });
});

const animInUp = document.querySelectorAll(".reveal-in-up");
animInUp.forEach((char, i) => {
  const text = new SplitType(char);
  gsap.from(text.chars, {
    scrollTrigger: {
      trigger: char,
      start: 'top 90%',
      end: 'top 20%',
      scrub: true,
    },
    transformOrigin: "top left",
    y: 10,
    stagger: 0.2,
    delay: 0.2,
    duration: 2,
  });
});

// --------------------------------------------- //
// Generic Scroll Reveal for Anim Up Elements
// --------------------------------------------- //
const animateInUp = document.querySelectorAll(".anim-uni-in-up");
animateInUp.forEach((element) => {
  gsap.fromTo(element, {
    opacity: 0,
    y: 50,
    ease: 'sine',
  }, {
    y: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: element,
      toggleActions: 'play none none reverse',
    }
  });
});


// --------------------------------------------- //
// ScrollTrigger Pin Fix for Jerbs Section
// --------------------------------------------- //
window.addEventListener("DOMContentLoaded", () => {
  const staticCol = document.querySelector(".pinned-universal-static");
  const scrollCol = document.querySelector(".pinned-universal-scroll");

  if (!staticCol || !scrollCol) {
    console.warn("Missing pinned-universal elements");
    return;
  }

  // Pin the left column only for as long as the right column scrolls
  ScrollTrigger.create({
    trigger: staticCol,
    start: "top top",
    endTrigger: scrollCol,
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
    scrub: false,
    anticipatePin: 1,
    // markers: true // Uncomment for debug
  });

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 1000);
});
