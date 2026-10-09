(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu-principal");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var mobileQuery = window.matchMedia("(max-width: 900px)");

  /* ---------- Menu móvel ---------- */
  function setMenu(open) {
    // Posiciona o menu logo abaixo do cabeçalho (a barra de demonstração pode estar visível)
    if (open) doc.style.setProperty("--menu-top", header.getBoundingClientRect().bottom + "px");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  mobileQuery.addEventListener("change", function (event) {
    if (!event.matches) setMenu(false);
  });

  /* ---------- Sombra do cabeçalho ao rolar ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Link ativo conforme a seção visível ---------- */
  // "Diferenciais" não está no menu principal; destaca "Serviços" nessa área
  var sectionToLink = { diferenciais: "servicos" };
  var sections = document.querySelectorAll("main section[id]");

  function setActive(id) {
    var target = "#" + (sectionToLink[id] || id);
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === target;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });

    /* ---------- Animação de entrada ---------- */
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.classList.contains("reveal");
      });
      el.style.setProperty("--delay", Math.min(siblings.indexOf(el), 5) * 90 + "ms");
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Ano atual no rodapé ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
