const header = document.querySelector("header");
const sectionTops = document.querySelectorAll(".section-top");

window.addEventListener("load", function () {
  const burger = document.querySelector(".header__burger");
  const mobileNav  = document.querySelector(".header__nav");

  const catalogBtn = document.querySelector(".header__catalog");
  const megaMenu = document.querySelector(".header__mega");

  const isMegaReady = header && catalogBtn && megaMenu;

  function closeMega() {
    if (!isMegaReady) return;
    header.classList.remove("mega-open");
    catalogBtn.classList.remove("is-active");
    catalogBtn.setAttribute("aria-expanded", "false");
    megaMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function openMega() {
    if (!isMegaReady) return;
    header.classList.add("mega-open");
    catalogBtn.classList.add("is-active");
    catalogBtn.setAttribute("aria-expanded", "true");
    megaMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function toggleMega(e) {
    e.preventDefault();
    e.stopPropagation();

    if (mobileNav && mobileNav.classList.contains("open")) {
      mobileNav.classList.remove("open");
      burger && burger.classList.remove("active");
    }

    if (header.classList.contains("mega-open")) closeMega();
    else openMega();
  }

  if (isMegaReady) {
    catalogBtn.addEventListener("click", toggleMega);

    megaMenu.addEventListener("click", (e) => e.stopPropagation());

    document.querySelectorAll(".mega-menu__item").forEach((item) => {
      const list = item.querySelector(".mega-menu__list");
      const moreBtn = item.querySelector(".mega-menu__more");

      if (!list || !moreBtn) return;

      const li = Array.from(list.querySelectorAll(":scope > li"));

      if (li.length <= 3) {
        moreBtn.style.display = "none";
        return;
      }

      moreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const expanded = item.classList.toggle("is-expanded");
        moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
        moreBtn.textContent = expanded ? "Свернуть" : "Показать еще";
      });
    });

    document.addEventListener("click", (e) => {
      if (!header.classList.contains("mega-open")) return;
      const insideHeader = e.target.closest(".header__container");
      if (!insideHeader) closeMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMega();
    });
  }

  if (burger && mobileNav ) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();

      closeMega();

      burger.classList.toggle("active");
      mobileNav.classList.toggle("open");
    });

    window.addEventListener("scroll", () => {
      if (mobileNav.classList.contains("open")) {
        burger.classList.remove("active");
        mobileNav.classList.remove("open");
      }
    });

    document.addEventListener("click", (e) => {
      const isClickInsideMenu = e.target.closest(".header__nav");
      const isClickOnBurger = e.target.closest(".header__burger");

      if (!isClickInsideMenu && !isClickOnBurger) {
        burger.classList.remove("active");
        mobileNav.classList.remove("open");
      }
    });
  }

  function addPadTop(headerEl, sections) {
    if (!headerEl || !sections?.length) return;
    const headerHeight = headerEl.offsetHeight;
    sections.forEach((section) => {
      section.style.marginTop = `${headerHeight}px`;
    });
  }

  if (sectionTops && header) {
    addPadTop(header, sectionTops);
  }

  function handleScroll() {
    let scroll = window.scrollY;
    if (scroll > 50) {
      header.classList.add("scroll");
    } else {
      header.classList.remove("scroll");
    }
  }

  handleScroll();

  // ====== Lenis ======

  const lenis = new Lenis({
    autoRaf: true,
  });

  window.lenis = lenis;

  // ====== Size / Multiplier ======

  function getWidthMultiplier() {
    const w = window.innerWidth;

    if (w <= 767) {
      return Math.min(window.innerWidth, window.innerHeight) / 375;
    }

    if (w <= 1024) {
      return Math.min(window.innerWidth, window.innerHeight) / 768;
    }

    return window.innerWidth / 1920;
  }

  let _multiplier = getWidthMultiplier();

  function s(value) {
    return value * _multiplier;
  }

  // ====== Swiper ======

  var heroSwiper = new Swiper(".heroSwiper", {
    spaceBetween: s(16),
    pagination: {
      el: ".hero-pagination",
    },
  });

  var catalogSwiper = new Swiper(".catalogSwiper", {
    slidesPerView: 1.05,
    spaceBetween: s(16),
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    breakpoints: {
      768: {
        slidesPerView: 1.5,
        spaceBetween: s(20),
      },
      1025: {
        slidesPerView: 3,
        spaceBetween: s(20),
      },
    },
  });

  var productsSwiper = new Swiper(".productsSwiper", {
    slidesPerView: 1.05,
    spaceBetween: s(16),
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".products-next",
      prevEl: ".products-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 1.8,
        spaceBetween: s(20),
      },
      1025: {
        slidesPerView: 4,
        spaceBetween: s(20),
      },
    },
  });

  const partnersSwiper = new Swiper(".partnersSwiper", {
    slidesPerView: "auto",
    spaceBetween: s(80),
    loop: true,

    speed: 4000,
    freeMode: true,
    freeModeMomentum: false,

    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },

    allowTouchMove: false,
  });

  var reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: 1.05,
    spaceBetween: s(16),
    loop: true,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".review-next",
      prevEl: ".review-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: s(20),
      },
    },
  });

  var productSwiper = new Swiper(".productSwiper", {
    spaceBetween: s(8),
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      768: {
        spaceBetween: s(20),
      },
    },
  });
  var productSwiper2 = new Swiper(".productSwiper2", {
    spaceBetween: s(8),
    navigation: {
      nextEl: ".product-next",
      prevEl: ".product-prev",
    },
    thumbs: {
      swiper: productSwiper,
    },
    breakpoints: {
      768: {
        spaceBetween: s(20),
      },
    },
  });

  // ====== Accordion ======

  const AccItems = document.querySelectorAll(".accordion__item");

  AccItems.forEach((item) => {
    item.addEventListener("click", function () {
      AccItems.forEach((el) => {
        if (el !== item) {
          el.classList.remove("active");
          const body = el.querySelector(".accordion__body");
          if (body) body.style.maxHeight = null;
        }
      });

      this.classList.toggle("active");
      const accBody = this.querySelector(".accordion__body");

      if (this.classList.contains("active") && accBody) {
        accBody.style.maxHeight = accBody.scrollHeight + "px";
      } else if (accBody) {
        accBody.style.maxHeight = null;
      }
    });
  });

  // ====== Tabby ======

  if (typeof Tabby !== 'undefined' && document.querySelector('[data-tabs]')) {
    new Tabby('[data-tabs]');
  }

  // ====== Mask for phone ======

  [].forEach.call( document.querySelectorAll('input[type="tel"]'), function(input) {
    var keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substring(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });

  // ====== Modals ======
  const modalWrapper = document.querySelector('.modals');

  if (modalWrapper) {
    const modals = Array.from(modalWrapper.querySelectorAll('.modal'));

    const getModalByType = (type) =>
      modalWrapper.querySelector(`.modal[data-type="${type}"]`);

    const showWrapper = () => {
      modalWrapper.style.opacity = 1;
      modalWrapper.style.pointerEvents = 'all';
      if (window.lenis) window.lenis.stop();
    };

    const hideWrapper = () => {
      modalWrapper.style.opacity = 0;
      modalWrapper.style.pointerEvents = 'none';
      if (window.lenis) window.lenis.start();
    };

    const openModal = (type, btn = null) => {
      modals.forEach((m) => {
        m.style.display = 'none';
        m.style.removeProperty('transform');
      });

      const modal = getModalByType(type);
      if (!modal) return;

      modal.style.display = 'block';
      showWrapper();

      if (window.gsap) {
        gsap.fromTo(modal, { y: '-100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' });
      }
    };

    const closeCurrentModal = () => {
      const current = modals.find((m) => getComputedStyle(m).display !== 'none');

      const finishClose = () => {
        if (current) current.style.display = 'none';
        hideWrapper();
      };

      if (current && window.gsap) {
        gsap.to(current, {
          y: '-100%',
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            current.style.removeProperty('transform');
            finishClose();
          },
        });
      } else {
        finishClose();
      }
    };

    document.querySelectorAll('.modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const type = btn.dataset.type;
        if (!type) return;

        openModal(type, btn);
      });
    });

    modalWrapper.addEventListener('click', (e) => {
      if (e.target === modalWrapper || e.target.closest('.modal__close')) {
        closeCurrentModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalWrapper.style.pointerEvents === 'all') {
        closeCurrentModal();
      }
    });
  }

  // ====== Resize ======

  window.addEventListener("resize", () => {
    if (sectionTops && header) {
      addPadTop(header, sectionTops);
    }
  });

  // ====== Scroll ======

  window.addEventListener('scroll', function() {
    handleScroll();
  });
});
