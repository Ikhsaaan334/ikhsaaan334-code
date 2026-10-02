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

  let cursorActive = false;
  document.addEventListener("mousemove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    // Tampilkan cursor dot & glow hanya setelah mouse benar-benar bergerak,
    // supaya tidak muncul sebagai blob di tengah layar saat halaman dibuka.
    if (!cursorActive) {
      cursorActive = true;
      document.body.classList.add("cursor-active");
    }
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

  // Mobile nav toggle (hamburger)
  const topNav = document.querySelector(".top-nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (topNav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = topNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi",
      );
    });
    topNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        topNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Foto profil: jika file foto-diri.jpg tersedia, tampilkan fotonya;
  // jika belum, placeholder tetap tampil (lihat style .has-photo).
  const profilePhoto = document.querySelector(".profile-photo-wrapper img");
  if (profilePhoto) {
    const wrapper = profilePhoto.closest(".profile-photo-wrapper");
    const markLoaded = () => wrapper.classList.add("has-photo");
    profilePhoto.addEventListener("load", markLoaded);
    profilePhoto.addEventListener("error", () =>
      wrapper.classList.remove("has-photo"),
    );
    if (profilePhoto.complete && profilePhoto.naturalWidth > 0) markLoaded();
  }

  // Draggable Nodes & Connection Canvas
  const canvas = document.getElementById("network-canvas");
  const ctx = canvas.getContext("2d");
  const nodes = Array.from(document.querySelectorAll(".interactive-node"));
  const centerTarget = document.querySelector(".hero-title"); // Points will connect here
  const heroSection = document.querySelector(".hero-section");

  let width, height;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener("resize", () => {
    resize();
    syncNodePositions();
    clampNodes();
  });
  resize();

  // Posisi default node mengikuti inline style di HTML (diatur agar tidak
  // menutupi judul). JS hanya menyimpan posisinya supaya bisa di-drag
  // dan tetap berada di dalam area hero saat window di-resize.
  const nodeData = nodes.map((node) => ({ el: node, x: 0, y: 0 }));

  function syncNodePositions() {
    const base = heroSection.getBoundingClientRect();
    nodeData.forEach((data) => {
      // Node disembunyikan via CSS di layar kecil; posisinya dibiarkan
      // mengikuti inline style agar benar ketika layar diperbesar kembali.
      if (data.el.offsetParent === null) return;
      const rect = data.el.getBoundingClientRect();
      data.x = rect.left - base.left;
      data.y = rect.top - base.top;
      data.el.style.left = data.x + "px";
      data.el.style.top = data.y + "px";
    });
  }

  function clampNodes() {
    const maxX = Math.max(0, heroSection.clientWidth);
    const maxY = Math.max(0, heroSection.clientHeight);
    nodeData.forEach((data) => {
      if (data.el.offsetParent === null) return;
      data.x = Math.min(Math.max(data.x, 0), maxX - data.el.offsetWidth);
      data.y = Math.min(Math.max(data.y, 0), maxY - data.el.offsetHeight);
      data.el.style.left = data.x + "px";
      data.el.style.top = data.y + "px";
    });
  }

  syncNodePositions();
  clampNodes();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncNodePositions();
      clampNodes();
    });
  }

  nodeData.forEach((data) => makeDraggable(data.el, data));

  function makeDraggable(el, data) {
    let isDown = false;
    let startX, startY, initialX, initialY;

    el.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = data.x;
      initialY = data.y;
      el.style.transition = "none"; // Disable hover transition during drag
      el.style.zIndex = 20;
    });

    document.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      data.x = initialX + dx;
      data.y = initialY + dy;
      el.style.left = data.x + "px";
      el.style.top = data.y + "px";
    });

    document.addEventListener("pointerup", () => {
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
      if (node.el.offsetParent === null) return; // hidden on small screens
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
        if (otherNode.el.offsetParent === null) return;
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
