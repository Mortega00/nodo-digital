// DEMO NODO: reemplazar estos datos por los comprobables del cliente real antes de publicar.
const CONFIG = {
    businessName: "MOVIA Ortopedia",
    whatsapp: "549110000000",
    phone: "+54 11 0000-0000",
    address: "Lomas de Zamora, Buenos Aires",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Lomas%20de%20Zamora%2C%20Buenos%20Aires",
    googleReviewsUrl: "https://www.google.com/search?q=ortopedia+Lomas+de+Zamora",
    nodoUrl: "https://nododigital.com.ar/"
};

function trackEvent(eventName, data = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, data);
    }
}

function normaliseWhatsApp(value) {
    return String(value || "").replace(/\D/g, "");
}

function whatsappMessage(context, product) {
    if (product) return "Hola, quería consultar disponibilidad de " + product + ".";

    const messages = {
        disponibilidad: "Hola, quería consultar disponibilidad de productos ortopédicos.",
        urgencia: "Hola, necesito consultar disponibilidad de productos ortopédicos para hoy.",
        "compra-alquiler": "Hola, quería consultar qué me conviene: comprar o alquilar un equipo ortopédico.",
        ubicacion: "Hola, quería consultar por la ubicación y atención de la ortopedia.",
        general: "Hola, quería hacer una consulta sobre productos ortopédicos."
    };

    return messages[context] || messages.general;
}

function whatsappUrl(context, product) {
    const destination = normaliseWhatsApp(CONFIG.whatsapp);
    if (!destination) return "#contacto";
    return "https://wa.me/" + destination + "?text=" + encodeURIComponent(whatsappMessage(context, product));
}

function phoneUrl() {
    const destination = String(CONFIG.phone || "").replace(/[^\d+]/g, "");
    return destination ? "tel:" + destination : "#contacto";
}

function setupContactLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach(link => {
        const context = link.dataset.whatsapp || "general";
        const product = link.dataset.product || "";
        link.href = whatsappUrl(context, product);
    });

    document.querySelectorAll("[data-phone]").forEach(link => {
        link.href = phoneUrl();
        link.setAttribute("aria-label", "Llamar a " + CONFIG.businessName);
    });

    document.querySelectorAll("[data-map]").forEach(link => {
        link.href = CONFIG.googleMapsUrl;
    });

    document.querySelectorAll("[data-reviews]").forEach(link => {
        link.href = CONFIG.googleReviewsUrl;
    });

    document.querySelectorAll("[data-business-name]").forEach(element => {
        element.textContent = CONFIG.businessName;
    });

    document.querySelectorAll("[data-nodo-link]").forEach(link => {
        link.href = CONFIG.nodoUrl;
    });
}

function setupTracking() {
    document.querySelectorAll("[data-track]").forEach(element => {
        element.addEventListener("click", () => {
            const eventName = element.dataset.track;
            if (!eventName) return;
            trackEvent(eventName, {
                section: element.closest("section")?.id || "page",
                product: element.dataset.product || undefined
            });
        });
    });
}

function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    const setMenu = (isOpen, restoreFocus = false) => {
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        menu.hidden = !isOpen;
        document.body.classList.toggle("menu-open", isOpen);

        if (isOpen) {
            window.requestAnimationFrame(() => menu.querySelector("a")?.focus());
        } else if (restoreFocus) {
            toggle.focus();
        }
    };

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") !== "true";
        setMenu(isOpen);
        if (isOpen) trackEvent("menu_mobile", { action: "open" });
    });

    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", event => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            setMenu(false, true);
            return;
        }

        if (event.key === "Tab" && isOpen) {
            const focusable = [toggle, ...menu.querySelectorAll("a")];
            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        }
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 1050px)").matches) setMenu(false);
    });
}

function setupHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const updateHeader = () => header.classList.toggle("is-compact", window.scrollY > 14);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupFaq() {
    const items = [...document.querySelectorAll(".faq-list details")];
    items.forEach(item => item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach(other => {
            if (other !== item) other.open = false;
        });
    }));
}

function setupMediaLoading() {
    const mediaItems = [...document.querySelectorAll("[data-media-image]")];

    const loadMedia = element => {
        const source = element.dataset.mediaImage;
        if (!source || element.dataset.mediaLoaded) return;
        element.dataset.mediaLoaded = "true";

        const image = new Image();
        image.decoding = "async";
        image.addEventListener("load", () => {
            element.style.setProperty("--media-image", 'url("' + source.replace(/"/g, "%22") + '")');
            element.classList.add("has-media-image");
        }, { once: true });
        image.src = source;
    };

    const deferredItems = mediaItems.filter(element => !element.hasAttribute("data-media-priority"));
    mediaItems.filter(element => element.hasAttribute("data-media-priority")).forEach(loadMedia);

    if (!("IntersectionObserver" in window)) {
        deferredItems.forEach(loadMedia);
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            loadMedia(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "240px 0px" });

    deferredItems.forEach(item => observer.observe(item));
}

setupContactLinks();
setupTracking();
setupMobileMenu();
setupHeader();
setupFaq();
setupMediaLoading();
