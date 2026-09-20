document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const lenis = !prefersReducedMotion && typeof Lenis !== "undefined"
    ? new Lenis({
        duration: 1.1,
        smoothWheel: true,
        anchors: true,
      })
    : null;

  // Cursor glow follow
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  document.body.appendChild(glow);

  const cursorDot = document.createElement("div");
  cursorDot.id = "cursor-dot";
  document.body.appendChild(cursorDot);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let cursorX = pointerX;
  let cursorY = pointerY;
  let glowX = pointerX;
  let glowY = pointerY;

  cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
  glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

  document.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
  });

  function animateGlow() {
    cursorX += (pointerX - cursorX) * 0.16;
    cursorY += (pointerY - cursorY) * 0.16;
    glowX += (pointerX - glowX) * 0.08;
    glowY += (pointerY - glowY) * 0.08;
    cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Draggable Nodes & Connection Canvas
  const canvas = document.getElementById("network-canvas");
  const ctx = canvas.getContext("2d");
  const nodes = document.querySelectorAll(".interactive-node");
  const centerTarget = document.querySelector(".hero-title"); // Points will connect here

  let width, height;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener("resize", resize);
  resize();

  // Init positions for nodes
  const nodeData = [];
  nodes.forEach((node, i) => {
    // Random position around the center
    const angle = (i / nodes.length) * Math.PI * 2;
    const radius = Math.min(width, height) * 0.35 + Math.random() * 50;

    let x = width / 2 + Math.cos(angle) * radius;
    let y = height / 2 + Math.sin(angle) * radius;

    node.style.left = x + "px";
    node.style.top = y + "px";

    nodeData.push({ el: node, x, y });

    // Make draggable
    makeDraggable(node, nodeData[i]);
  });

  function makeDraggable(el, data) {
    let isDown = false;
    let startX, startY, initialX, initialY;

    el.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = data.x;
      initialY = data.y;
      el.style.transition = "none"; // Disable hover transition during drag
      el.style.zIndex = 20;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      data.x = initialX + dx;
      data.y = initialY + dy;
      el.style.left = data.x + "px";
      el.style.top = data.y + "px";
    });

    document.addEventListener("mouseup", () => {
      if (isDown) {
        isDown = false;
        el.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";
        el.style.zIndex = 10;
      }
    });
  }

  // Animation Loop for drawing connections
  function animate(time) {
    if (lenis) {
      lenis.raf(time);
    }

    ctx.clearRect(0, 0, width, height);

    const rect = centerTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    ctx.lineWidth = 1;

    nodeData.forEach((node) => {
      // Get current node center
      const nRect = node.el.getBoundingClientRect();
      const nx = nRect.left + nRect.width / 2;
      const ny = nRect.top + nRect.height / 2;

      // Draw line to center
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.lineTo(centerX, centerY);

      // Gradient line
      const grad = ctx.createLinearGradient(nx, ny, centerX, centerY);
      grad.addColorStop(0, "rgba(255,255,255,0.15)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = grad;
      ctx.stroke();

      // Also draw lines between close nodes
      nodeData.forEach((otherNode) => {
        if (node === otherNode) return;
        const oRect = otherNode.el.getBoundingClientRect();
        const ox = oRect.left + oRect.width / 2;
        const oy = oRect.top + oRect.height / 2;

        const dist = Math.hypot(nx - ox, ny - oy);
        if (dist < 300) {
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(ox, oy);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - (dist / 300) * 0.1})`;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Observe sections for active nav
  const sections = document.querySelectorAll("section, header");
  const navLinks = document.querySelectorAll(
    '.top-nav a:not([target="_blank"])',
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${entry.target.id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((sec) => {
    if (sec.id) observer.observe(sec);
  });

  // Reveal content smoothly as it enters the viewport
  const revealObserver = new IntersectionObserver(
    (entries, revealObserverInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserverInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".section-container, .glass-card, .arsenal-logo")
    .forEach((element) => {
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });

  // Typewriter effect for Hero Title
  const textTitle = "Muhammad Ikhsan\nNur Rafid";
  const typewriterSpan = document.getElementById("typewriter");
  let typeIndex = 0;
  let isDeleting = false;

  function typeAction() {
    // Ambil substring teks berdasarkan posisi index
    let currentText = textTitle.substring(0, typeIndex);
    // Ubah \n menjadi <br/> untuk render baris baru
    typewriterSpan.innerHTML = currentText.replace(/\n/g, "<br/>");

    // Atur kecepatan ketik (cepat saat menghapus, normal saat mengetik)
    let typingSpeed = isDeleting ? 40 : Math.random() * 50 + 80;

    if (!isDeleting && typeIndex === textTitle.length) {
      // Jeda 3 detik setelah selesai mengetik sebelum mulai menghapus
      typingSpeed = 3000;
      isDeleting = true;
    } else if (isDeleting && typeIndex === 0) {
      // Jeda sejenak sebelum teks kembali diketik
      isDeleting = false;
      typingSpeed = 800;
    }

    if (isDeleting) {
      typeIndex--;
    } else {
      typeIndex++;
    }

    setTimeout(typeAction, typingSpeed);
  }

  // Start after a slight delay
  setTimeout(typeAction, 600);
});
