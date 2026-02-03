(() => {
  // ======================
  // Helpers
  // ======================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const rafThrottle = (fn) => {
    let rafId = 0;
    return (...args) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        fn(...args);
      });
    };
  };

  const createScrollLock = (lenis) => {
    const locks = new Set();

    const apply = () => {
      if (locks.size) {
        document.body.classList.add("no-scroll");
        lenis?.stop?.();
      } else {
        document.body.classList.remove("no-scroll");
        lenis?.start?.();
      }
    };

    return {
      lock: (key) => {
        if (!key) return;
        locks.add(key);
        apply();
      },
      unlock: (key) => {
        if (!key) return;
        locks.delete(key);
        apply();
      },
      reset: () => {
        locks.clear();
        apply();
      },
      has: (key) => locks.has(key),
    };
  };

  // ======================
  // Lenis
  // ======================
  const initLenis = () => {
    if (typeof Lenis === "undefined") return null;
    const lenis = new Lenis({ autoRaf: true });
    window.lenis = lenis;
    return lenis;
  };

  // ======================
  // Multiplier / s()
  // ======================
  const state = {
    multiplier: 1,
    swipers: {},
  };

  const getWidthMultiplier = () => {
    const w = window.innerWidth;

    if (w <= 767) return Math.min(window.innerWidth, window.innerHeight) / 375;
    if (w <= 1024) return Math.min(window.innerWidth, window.innerHeight) / 768;

    return window.innerWidth / 1920;
  };

  const updateMultiplier = () => {
    state.multiplier = getWidthMultiplier();
  };

  const s = (value) => value * state.multiplier;

  // ======================
  // Header
  // ======================
  const initHeader = ({ scrollLock }) => {
    const header = $("header");
    const sectionTops = $$(".section-top");

    const burger = $(".header__burger");
    const mobileNav = $(".header__nav");

    const catalogBtn = $(".header__catalog");
    const megaMenu = $(".header__mega");

    const isMegaReady = !!(header && catalogBtn && megaMenu);

    const setPadTop = () => {
      if (!header || !sectionTops.length) return;
      const headerHeight = header.offsetHeight;
      sectionTops.forEach((section) => {
        section.style.marginTop = `${headerHeight}px`;
      });
    };

    const setHeaderScrolled = () => {
      if (!header) return;
      header.classList.toggle("scroll", window.scrollY > 50);
    };

    const isMobileOpen = () => !!(mobileNav && mobileNav.classList.contains("open"));
    const isMegaOpen = () => !!(header && header.classList.contains("mega-open"));

    const syncBurgerState = () => {
      if (!burger) return;
      burger.classList.toggle("active", isMobileOpen() || isMegaOpen());
    };

    // ---------- Mobile helpers ----------
    const closeMobile = () => {
      if (!mobileNav) return;
      mobileNav.classList.remove("open");
      scrollLock.unlock("mobile");
      syncBurgerState();
    };

    const openMobile = () => {
      if (!mobileNav) return;
      mobileNav.classList.add("open");
      scrollLock.lock("mobile");
      syncBurgerState();
    };

    // ---------- Mega menu ----------
    const closeMega = () => {
      if (!isMegaReady) return;
      header.classList.remove("mega-open");
      catalogBtn.classList.remove("is-active");
      catalogBtn.setAttribute("aria-expanded", "false");
      megaMenu.setAttribute("aria-hidden", "true");
      scrollLock.unlock("mega");
      syncBurgerState();
    };

    const openMega = () => {
      if (!isMegaReady) return;
      header.classList.add("mega-open");
      catalogBtn.classList.add("is-active");
      catalogBtn.setAttribute("aria-expanded", "true");
      megaMenu.setAttribute("aria-hidden", "false");
      scrollLock.lock("mega");
      syncBurgerState();
    };

    const closeAllMenus = () => {
      closeMega();
      closeMobile();
      syncBurgerState();
    };

    const isAnyMenuOpen = () => isMegaOpen() || isMobileOpen();

    const toggleMega = (e) => {
      e.preventDefault();
      e.stopPropagation();

      closeMobile();
      isMegaOpen() ? closeMega() : openMega();
      syncBurgerState();
    };

    if (isMegaReady) {
      catalogBtn.setAttribute("aria-expanded", isMegaOpen() ? "true" : "false");
      megaMenu.setAttribute("aria-hidden", isMegaOpen() ? "false" : "true");

      catalogBtn.addEventListener("click", toggleMega);
      megaMenu.addEventListener("click", (e) => e.stopPropagation());

      $$(".mega-menu__item").forEach((item) => {
        const list = $(".mega-menu__list", item);
        const moreBtn = $(".mega-menu__more", item);
        if (!list || !moreBtn) return;

        const li = $$(":scope > li", list);
        if (li.length <= 3) {
          moreBtn.style.display = "none";
          return;
        }

        const textMore = moreBtn.dataset.textMore || "Показать еще";
        const textLess = moreBtn.dataset.textLess || "Свернуть";

        moreBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const expanded = item.classList.toggle("is-expanded");
          moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
          moreBtn.textContent = expanded ? textLess : textMore;
        });
      });

      document.addEventListener("click", (e) => {
        if (!isMegaOpen()) return;
        if (!header.contains(e.target)) {
          closeMega();
          syncBurgerState();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeMega();
          syncBurgerState();
        }
      });
    }

    // ---------- Mobile menu ----------
    if (burger && mobileNav) {
      burger.addEventListener("click", (e) => {
        e.stopPropagation();

        if (isAnyMenuOpen()) {
          closeAllMenus();
          return;
        }

        openMobile();
      });

      window.addEventListener(
        "scroll",
        () => {
          if (!isMobileOpen()) return;
          closeMobile();
        },
        { passive: true }
      );

      document.addEventListener("click", (e) => {
        if (!isMobileOpen()) return;

        const isInsideMenu = e.target.closest(".header__nav");
        const isOnBurger = e.target.closest(".header__burger");
        if (isInsideMenu || isOnBurger) return;

        closeMobile();
      });
    }

    setPadTop();
    setHeaderScrolled();
    syncBurgerState();

    return {
      header,
      setPadTop,
      setHeaderScrolled,
      closeMega,
      closeAllMenus,
    };
  };

  // ======================
  // Swipers
  // ======================
  const initSwipers = () => {
    if (typeof Swiper === "undefined") return;

    state.swipers.hero = new Swiper(".heroSwiper", {
      spaceBetween: s(16),
      pagination: { el: ".hero-pagination" },
    });

    state.swipers.catalog = new Swiper(".catalogSwiper", {
      slidesPerView: 1.05,
      spaceBetween: s(16),
      breakpoints: {
        768: { slidesPerView: 1.5, spaceBetween: s(20) },
        1025: { slidesPerView: 3, spaceBetween: s(20) },
      },
    });

    state.swipers.products = new Swiper(".productsSwiper", {
      slidesPerView: 1.05,
      spaceBetween: s(16),
      navigation: { nextEl: ".products-next", prevEl: ".products-prev" },
      breakpoints: {
        768: { slidesPerView: 1.8, spaceBetween: s(20) },
        1025: { slidesPerView: 4, spaceBetween: s(20) },
      },
    });

    state.swipers.review = new Swiper(".reviewSwiper", {
      slidesPerView: 1.05,
      spaceBetween: s(16),
      loop: true,
      navigation: { nextEl: ".review-next", prevEl: ".review-prev" },
      breakpoints: {
        768: { slidesPerView: 2.2, spaceBetween: s(20) },
      },
    });

    const thumbs = new Swiper(".productSwiper", {
      spaceBetween: s(8),
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: { 768: { spaceBetween: s(20) } },
    });

    state.swipers.productMain = new Swiper(".productSwiper2", {
      spaceBetween: s(8),
      navigation: { nextEl: ".product-next", prevEl: ".product-prev" },
      thumbs: { swiper: thumbs },
      breakpoints: { 768: { spaceBetween: s(20) } },
    });
  };

  // ======================
  // Accordion
  // ======================
  const initAccordion = () => {
    const items = $$(".accordion__item");
    if (!items.length) return;

    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((el) => {
          if (el === item) return;
          el.classList.remove("active");
          const body = $(".accordion__body", el);
          if (body) body.style.maxHeight = null;
        });

        item.classList.toggle("active");
        const body = $(".accordion__body", item);
        if (!body) return;

        body.style.maxHeight = item.classList.contains("active")
          ? `${body.scrollHeight}px`
          : null;
      });
    });
  };

  // ======================
  // Tabby
  // ======================
  const initTabby = () => {
    if (typeof Tabby === "undefined") return;
    if (!document.querySelector("[data-tabs]")) return;
    new Tabby("[data-tabs]");
  };

  // ======================
  // Phone mask
  // ======================
  const initPhoneMask = () => {
    const inputs = $$('input[type="tel"]');
    if (!inputs.length) return;

    const matrix = "+7 (___) ___ ____";

    const mask = function (event) {
      let keyCode = event.keyCode || event.which;
      const pos = this.selectionStart;

      if (pos < 3) event.preventDefault();

      const def = matrix.replace(/\D/g, "");
      const val = this.value.replace(/\D/g, "");

      let i = 0;
      let newValue = matrix.replace(/[_\d]/g, (a) =>
        i < val.length ? val.charAt(i++) || def.charAt(i) : a
      );

      i = newValue.indexOf("_");
      if (i !== -1) {
        if (i < 5) i = 3;
        newValue = newValue.slice(0, i);
      }

      let reg = matrix
        .substring(0, this.value.length)
        .replace(/_+/g, (a) => `\\d{1,${a.length}}`)
        .replace(/[+()]/g, "\\$&");

      reg = new RegExp(`^${reg}$`);

      if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58)) {
        this.value = newValue;
      }

      if (event.type === "blur" && this.value.length < 5) this.value = "";
    };

    inputs.forEach((input) => {
      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    });
  };

  // ======================
  // Modals
  // ======================
  const initModals = ({ scrollLock }) => {
    const wrapper = $(".modals");
    if (!wrapper) return;

    const modals = $$(".modal", wrapper);

    const getModalByType = (type) => wrapper.querySelector(`.modal[data-type="${type}"]`);

    const showWrapper = () => {
      wrapper.style.opacity = 1;
      wrapper.style.pointerEvents = "all";
      scrollLock.lock("modal");
    };

    const hideWrapper = () => {
      wrapper.style.opacity = 0;
      wrapper.style.pointerEvents = "none";
      scrollLock.unlock("modal");
    };

    const openModal = (type) => {
      modals.forEach((m) => {
        m.style.display = "none";
        m.style.removeProperty("transform");
      });

      const modal = getModalByType(type);
      if (!modal) return;

      modal.style.display = "block";
      showWrapper();

      if (window.gsap) {
        gsap.fromTo(modal, { y: "-100%" }, { y: "0%", duration: 0.5, ease: "power3.out" });
      }
    };

    const closeCurrentModal = () => {
      const current = modals.find((m) => getComputedStyle(m).display !== "none");

      const finish = () => {
        if (current) current.style.display = "none";
        hideWrapper();
      };

      if (current && window.gsap) {
        gsap.to(current, {
          y: "-100%",
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            current.style.removeProperty("transform");
            finish();
          },
        });
      } else {
        finish();
      }
    };

    $$(".modal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (!type) return;
        openModal(type);
      });
    });

    wrapper.addEventListener("click", (e) => {
      if (e.target === wrapper || e.target.closest(".modal__close")) closeCurrentModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (wrapper.style.pointerEvents === "all") closeCurrentModal();
    });
  };

  // ======================
  // Boot
  // ======================
  window.addEventListener("load", () => {
    const lenis = initLenis();
    updateMultiplier();

    const scrollLock = createScrollLock(lenis);

    const headerApi = initHeader({ scrollLock });
    initSwipers();
    initAccordion();
    initTabby();
    initPhoneMask();
    initModals({ scrollLock });

    window.addEventListener(
      "resize",
      rafThrottle(() => {
        updateMultiplier();
        headerApi?.setPadTop?.();

        Object.values(state.swipers).forEach((sw) => sw?.update?.());
      }),
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      rafThrottle(() => {
        headerApi?.setHeaderScrolled?.();
      }),
      { passive: true }
    );
  });
})();