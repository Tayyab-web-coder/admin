document.addEventListener("DOMContentLoaded", function() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });
    
    tl.to("header nav .logo", { 
      opacity: 1, 
      y: 0 
    })
    .to("header nav ul li", { 
      opacity: 1, 
      y: 0, 
      stagger: 0.2 
    }, "-=0.5") // Overlap with the logo animation
    .to("header nav .buttons button", { 
      opacity: 1, 
      y: 0, 
      stagger: 0.2 
    }, "-=0.3"); // Overlap slightly with the list items
  });