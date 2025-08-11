/**
 * BarberShop Elite - Script principal
 * 
 * Contém a lógica para:
 * - Carrossel de serviços
 * - Animações de scroll
 * - Menu mobile
 * - Inicialização de componentes
 */

// Configurações globais
const CONFIG = {
  // Configurações do carrossel
  carousel: {
    slideDuration: 800, // ms
    contentFadeDuration: 600, // ms
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    parallaxIntensity: 30, // Quanto maior, menos intenso o movimento do mouse
  },
  
  // Configurações do menu mobile
  mobileMenu: {
    animationDuration: 300, // ms
  },
  
  // Configurações do observer
  observer: {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
};

// Dados dos serviços
const SERVICES_DATA = [
  {
    id: 1,
    title: "Corte Tradicional",
    price: "R$ 25",
    time: "30min",
    description: "Corte clássico com técnicas tradicionais para um visual impecável",
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Corte + Barba",
    price: "R$ 40",
    time: "45min",
    description: "Pacote completo com corte e barba para um visual renovado",
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Barba Completa",
    price: "R$ 20",
    time: "25min",
    description: "Aparo, modelagem e cuidados especiais para sua barba",
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Corte Premium",
    price: "R$ 35",
    time: "40min",
    description: "Corte com técnicas avançadas e produtos premium",
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Sobrancelha",
    price: "R$ 15",
    time: "15min",
    description: "Design profissional para realçar sua expressão",
    src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Tratamento Capilar",
    price: "R$ 30",
    time: "35min",
    description: "Hidratação e cuidados especiais para seu cabelo",
    src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    title: "Tratamento de Pele",
    price: "R$ 50",
    time: "60min",
    description: "Limpeza de pele e cuidados faciais especializados",
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    title: "Descolorir Cabelo",
    price: "R$ 80",
    time: "90min",
    description: "Descoloração profissional com produtos de qualidade",
    src: "https://images.unsplash.com/photo-1552904211-c0f0c5d5e698?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  }
];

/**
 * Classe Carousel - Controla o carrossel de serviços
 */
class Carousel {
  constructor() {
    this.currentIndex = 0;
    this.isAnimating = false;
    this.animationRequestId = null;
    this.slides = SERVICES_DATA;
    this.carouselList = document.getElementById("carousel-list");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.slideElements = [];
    this.animationFrames = [];
    this.mouseListeners = [];

    this.init();
  }

  /**
   * Inicializa o carrossel
   */
  init() {
    this.createSlides();
    this.bindEvents();
    this.updateCarousel(true); // Inicialização sem animação
    this.preloadImages();
  }

  /**
   * Cria os slides do carrossel
   */
  createSlides() {
    this.slides.forEach((slide, index) => {
      const slideElement = this.createSlideElement(slide, index);
      this.carouselList.appendChild(slideElement);
      this.slideElements.push(slideElement);
    });
  }

  /**
   * Cria um elemento de slide individual
   * @param {Object} slide - Dados do slide
   * @param {number} index - Índice do slide
   * @returns {HTMLElement} Elemento do slide
   */
  createSlideElement(slide, index) {
    const li = document.createElement("li");
    li.className = "flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 carousel-transition z-10";
    li.style.width = "70vmin";
    li.style.height = "70vmin";
    li.style.margin = "0 4vmin";
    li.style.willChange = "transform";
    li.setAttribute("data-service-id", slide.id);

    li.innerHTML = `
      <div class="perspective-container h-full w-full">
        <div class="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-sm overflow-hidden slide-container-transition slide-container" style="border-radius: 1%;">
          <img
            class="absolute inset-0 w-full h-full object-cover opacity-transition slide-image"
            style="width: 120%; height: 120%; opacity: 0.5;"
            alt="${slide.title}"
            src="${slide.src}"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black bg-opacity-30 bg-transition slide-overlay" style="opacity: 0;"></div>
        </div>

        <article class="relative p-8 opacity-transition slide-content" style="opacity: 0; visibility: hidden;">
          <h2 class="text-lg md:text-2xl lg:text-4xl font-semibold relative text-primary-light font-playfair">
            ${slide.title}
          </h2>
          <p class="text-primary-bronze text-2xl font-bold my-3 font-playfair">${slide.price}</p>
          <p class="text-primary-gray flex items-center justify-center">
            <i data-lucide="clock" class="w-4 h-4 mr-1"></i>
            ${slide.time}
          </p>
          <p class="text-primary-gray text-sm mt-2 hidden md:block">${slide.description}</p>
        </article>
      </div>
    `;

    this.setupMouseTracking(li, index);
    li.addEventListener("click", () => this.handleSlideClick(index));
    return li;
  }

  /**
   * Configura o efeito de parallax com movimento do mouse
   * @param {HTMLElement} slideElement - Elemento do slide
   * @param {number} index - Índice do slide
   */
  setupMouseTracking(slideElement, index) {
    let x = 0, y = 0;

    const handleMouseMove = (event) => {
      const rect = slideElement.getBoundingClientRect();
      x = (event.clientX - (rect.left + rect.width / 2)) / CONFIG.carousel.parallaxIntensity;
      y = (event.clientY - (rect.top + rect.height / 2)) / CONFIG.carousel.parallaxIntensity;
      slideElement.style.setProperty("--x", `${x}px`);
      slideElement.style.setProperty("--y", `${y}px`);
    };

    const handleMouseLeave = () => {
      x = 0;
      y = 0;
      slideElement.style.setProperty("--x", "0px");
      slideElement.style.setProperty("--y", "0px");
    };

    slideElement.addEventListener("mousemove", handleMouseMove);
    slideElement.addEventListener("mouseleave", handleMouseLeave);

    this.mouseListeners[index] = { handleMouseMove, handleMouseLeave };
  }

  /**
   * Pré-carrega as imagens para evitar flickering
   */
  preloadImages() {
    this.slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }

  /**
   * Adiciona event listeners aos controles do carrossel
   */
  bindEvents() {
    this.prevBtn.addEventListener("click", () => {
      if (!this.isAnimating) this.handlePreviousClick();
    });

    this.nextBtn.addEventListener("click", () => {
      if (!this.isAnimating) this.handleNextClick();
    });

    // Navegação por teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && !this.isAnimating) {
        this.handlePreviousClick();
      } else if (e.key === "ArrowRight" && !this.isAnimating) {
        this.handleNextClick();
      }
    });
  }

  /**
   * Manipula o clique no botão anterior
   */
  handlePreviousClick() {
    const previous = this.currentIndex - 1;
    this.currentIndex = previous < 0 ? this.slides.length - 1 : previous;
    this.updateCarousel();
  }

  /**
   * Manipula o clique no botão próximo
   */
  handleNextClick() {
    const next = this.currentIndex + 1;
    this.currentIndex = next === this.slides.length ? 0 : next;
    this.updateCarousel();
  }

  /**
   * Manipula o clique em um slide
   * @param {number} index - Índice do slide clicado
   */
  handleSlideClick(index) {
    if (!this.isAnimating && this.currentIndex !== index) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }

  /**
   * Atualiza a posição e estado do carrossel
   * @param {boolean} instant - Se deve atualizar sem animação
   */
  updateCarousel(instant = false) {
    if (this.isAnimating && !instant) return;

    this.isAnimating = true;

    // Atualizar posição da lista
    const translateX = -this.currentIndex * (100 / this.slides.length);

    if (instant) {
      this.carouselList.style.transition = "none";
      this.carouselList.style.transform = `translateX(${translateX}%)`;
      // Força o reflow para aplicar a transição 'none' imediatamente
      void this.carouselList.offsetHeight;
      // Reativa a transição após o reflow
      this.carouselList.style.transition = `transform ${CONFIG.carousel.slideDuration}ms ${CONFIG.carousel.easing}`;
    } else {
      this.carouselList.style.transform = `translateX(${translateX}%)`;
    }

    // Atualizar cada slide
    this.slideElements.forEach((slideElement, index) => {
      const isActive = index === this.currentIndex;
      const slideContainer = slideElement.querySelector(".slide-container");
      const slideImage = slideElement.querySelector(".slide-image");
      const slideContent = slideElement.querySelector(".slide-content");
      const slideOverlay = slideElement.querySelector(".slide-overlay");

      if (isActive) {
        slideElement.classList.add("slide-active");
        slideElement.classList.remove("slide-inactive");
        slideImage.style.opacity = "1";
        slideContent.style.opacity = "1";
        slideContent.style.visibility = "visible";
        slideOverlay.style.opacity = "0.3";
        slideContainer.classList.add("slide-transform");
      } else {
        slideElement.classList.add("slide-inactive");
        slideElement.classList.remove("slide-active");
        slideImage.style.opacity = "0.5";
        slideContent.style.opacity = "0";
        slideContent.style.visibility = "hidden";
        slideOverlay.style.opacity = "0";
        slideContainer.classList.remove("slide-transform");
      }
    });

    // Resetar flag de animação após o término
    setTimeout(() => {
      this.isAnimating = false;
    }, CONFIG.carousel.slideDuration);
  }

  /**
   * Limpa recursos e listeners do carrossel
   */
  destroy() {
    this.mouseListeners.forEach((listeners, index) => {
      const slideElement = this.slideElements[index];
      if (slideElement && listeners) {
        slideElement.removeEventListener("mousemove", listeners.handleMouseMove);
        slideElement.removeEventListener("mouseleave", listeners.handleMouseLeave);
      }
    });

    this.prevBtn.removeEventListener("click", this.handlePreviousClick);
    this.nextBtn.removeEventListener("click", this.handleNextClick);
  }
}

/**
 * Controla o menu mobile
 */
class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById("mobileMenuButton");
    this.mobileMenu = document.createElement("div");
    this.isOpen = false;

    this.init();
  }

  /**
   * Inicializa o menu mobile
   */
  init() {
    this.createMobileMenu();
    this.bindEvents();
  }

  /**
   * Cria a estrutura do menu mobile
   */
  createMobileMenu() {
    this.mobileMenu.id = "mobileMenu";
    this.mobileMenu.className = "fixed inset-0 bg-primary-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center opacity-0 invisible transition-all duration-300";
    
    const nav = document.createElement("nav");
    nav.className = "flex flex-col items-center space-y-8 p-8";
    
    // Criar links do menu
    const links = [
      { href: "#inicio", text: "Início" },
      { href: "#servicos", text: "Serviços" },
      { href: "#galeria", text: "Galeria" },
      { href: "#contato", text: "Contato" }
    ];
    
    links.forEach(link => {
      const a = document.createElement("a");
      a.href = link.href;
      a.className = "text-2xl text-primary-light hover:text-primary-bronze transition-colors duration-300";
      a.textContent = link.text;
      a.addEventListener("click", () => this.closeMenu());
      nav.appendChild(a);
    });
    
    // Botão de fechar
    const closeButton = document.createElement("button");
    closeButton.className = "absolute top-6 right-6 text-primary-light hover:text-primary-bronze transition-colors duration-300";
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeButton.addEventListener("click", () => this.closeMenu());
    closeButton.setAttribute("aria-label", "Fechar menu");
    
    this.mobileMenu.appendChild(nav);
    this.mobileMenu.appendChild(closeButton);
    document.body.appendChild(this.mobileMenu);
  }

  /**
   * Adiciona event listeners
   */
  bindEvents() {
    this.menuButton.addEventListener("click", () => this.toggleMenu());
    
    // Fechar menu ao pressionar ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });

    // Fechar menu ao clicar fora
    this.mobileMenu.addEventListener("click", (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });
  }

  /**
   * Alterna o estado do menu
   */
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Abre o menu mobile
   */
  openMenu() {
    this.isOpen = true;
    this.mobileMenu.classList.remove("invisible", "opacity-0");
    this.mobileMenu.classList.add("opacity-100");
    document.body.style.overflow = "hidden";
  }

  /**
   * Fecha o menu mobile
   */
  closeMenu() {
    this.isOpen = false;
    this.mobileMenu.classList.remove("opacity-100");
    this.mobileMenu.classList.add("opacity-0");
    
    setTimeout(() => {
      this.mobileMenu.classList.add("invisible");
      document.body.style.overflow = "";
    }, CONFIG.mobileMenu.animationDuration);
  }
}

/**
 * Inicializa observador de interseção para animações
 */
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Adiciona classe de animação apenas se ainda não tiver
        if (
          !entry.target.classList.contains("animate-fade-in-up") &&
          !entry.target.classList.contains("animate-fade-in-down") &&
          !entry.target.classList.contains("animate-slide-in-left") &&
          !entry.target.classList.contains("animate-slide-in-right")
        ) {
          // Verifica se o elemento tem um data-animation personalizado
          const animationType = entry.target.dataset.animation || "fade-in-up";
          entry.target.classList.add(`animate-${animationType}`);
        }
      }
    });
  }, CONFIG.observer);

  // Observa todas as seções e elementos com data-observe
  document.querySelectorAll("section, [data-observe]").forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
function initApp() {
  // Inicializar ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Inicializar carrossel
  const carousel = new Carousel();
  window.carousel = carousel; // Para acesso global se necessário

  // Inicializar menu mobile
  const mobileMenu = new MobileMenu();
  window.mobileMenu = mobileMenu;

  // Inicializar observador de interseção
  initIntersectionObserver();

  // Limpar recursos ao sair da página
  window.addEventListener("beforeunload", () => {
    if (window.carousel) {
      window.carousel.destroy();
    }
  });
}

// Inicializa a aplicação quando o DOM estiver carregado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}