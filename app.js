const WHATSAPP_NUMBER = "5491130700900";
const NATIVA_ESTETICA_URL = "https://mortega00.github.io/estetica-natalia/#inicio";

const projects = [
    // TODO NODO: revisar manualmente estados públicos de Planner, MyLuna y extensiones START antes del lanzamiento.
    { id: "nativa-estetica", title: "Nativa Estética", category: "Landing Pages", description: "Landing page diseñada para ordenar servicios de estética y facilitar consultas o reservas.", status: "available", statusLabel: "Disponible", url: NATIVA_ESTETICA_URL, tags: ["Responsive", "Reservas", "WhatsApp"], context: "NATIVA necesitaba una presencia digital que acompañara una experiencia de atención presencial.", challenge: "Ordenar tratamientos y transmitir confianza sin sumar fricción entre una visita y una consulta.", solution: "Diseñamos una landing clara, responsive y orientada al contacto directo.", objective: "Hacer más simple entender los servicios y dar el siguiente paso hacia una reserva.", technologies: ["Landing page", "Responsive", "WhatsApp"] },
    { id: "start-program", title: "START", category: "Training", description: "Sistema de entrenamiento estructurado para progresar semana a semana.", status: "available", statusLabel: "Disponible", url: "#", tags: ["Training", "Método", "Progreso"], context: "START reúne una forma de planificar el entrenamiento sin depender de la improvisación.", challenge: "Convertir una rutina dispersa en un recorrido simple de seguir.", solution: "Estructuramos bloques de progresión y una experiencia fácil de consultar.", objective: "Ayudar a entrenar con un método sostenido en el tiempo.", technologies: ["Producto digital", "Planificación", "UX"] },
    { id: "start-app", title: "START App", category: "Training", description: "Aplicación para seguimiento de cargas, descansos y métricas de rendimiento.", status: "development", statusLabel: "En desarrollo", url: "#", tags: ["App", "Métricas", "Training"], context: "Una extensión natural de START para acompañar el seguimiento diario.", challenge: "Reunir datos de entrenamiento sin volver compleja la experiencia.", solution: "Definimos una herramienta enfocada en registrar lo importante.", objective: "Dar visibilidad al progreso y facilitar los ajustes.", technologies: ["Aplicación", "Métricas", "Producto"] },
    { id: "start-nutrition", title: "START Nutrition", category: "Training", description: "Herramientas para acompañar hábitos nutricionales y entrenamiento.", status: "coming-soon", statusLabel: "Próximamente", url: "#", tags: ["Nutrición", "Hábitos", "Training"], context: "Un área futura dentro del ecosistema START.", challenge: "Conectar hábitos y entrenamiento con información simple de usar.", solution: "Estamos definiendo el alcance de las herramientas necesarias.", objective: "Acompañar el entrenamiento desde una mirada integral.", technologies: ["Producto", "Hábitos", "Planning"] },
    { id: "qarta", title: "QARTA", category: "Gastronomía", description: "Propuesta para ordenar cartas, promociones y comunicación en gastronomía.", status: "development", statusLabel: "En desarrollo", url: "#", tags: ["QR", "Menú", "Producto"], context: "QARTA nace alrededor de las necesidades cotidianas de comunicación en comercios gastronómicos.", challenge: "Actualizar la información de carta sin depender de soportes estáticos.", solution: "Estamos diseñando una experiencia de menú y comunicación pensada para cada comercio.", objective: "Hacer más clara la elección del cliente y más ágil la gestión del negocio.", technologies: ["QR", "Producto digital", "UX"] },
    { id: "bloc", title: "BLOC", category: "Sistemas", description: "Sistema para organizar información y procesos de trabajo.", status: "development", statusLabel: "En desarrollo", url: "#", tags: ["Sistema", "Organización", "Procesos"], context: "Un producto propio orientado a ordenar el trabajo alrededor de información accionable.", challenge: "Evitar que tareas y decisiones queden repartidas entre herramientas inconexas.", solution: "Definimos una base de sistema clara, enfocada en el flujo de trabajo.", objective: "Centralizar lo necesario para seguir procesos con contexto.", technologies: ["Sistema", "Flujos", "UX"] },
    { id: "planner", title: "Planner", category: "Sistemas", description: "Herramienta para planificar proyectos, tareas y entregables.", status: "coming-soon", statusLabel: "Próximamente", url: "#", tags: ["Planificación", "Proyectos", "Sistema"], context: "Una exploración de NODO alrededor de la organización de proyectos.", challenge: "Convertir una planificación dispersa en una vista útil para actuar.", solution: "Estamos definiendo un sistema visual simple para prioridades y entregables.", objective: "Hacer más fácil planificar sin perder contexto.", technologies: ["Sistema", "Planning", "Producto"] },
    { id: "myluna", title: "MyLuna", category: "Aplicaciones", description: "Aplicación propia en exploración para resolver una necesidad concreta.", status: "development", statusLabel: "En desarrollo", url: "#", tags: ["Aplicación", "Producto", "UX"], context: "MyLuna forma parte de las aplicaciones que NODO construye y prueba internamente.", challenge: "Convertir una necesidad cotidiana en una herramienta clara y cercana.", solution: "Estamos validando la experiencia y las funciones esenciales del producto.", objective: "Crear una aplicación útil, simple y lista para evolucionar.", technologies: ["Aplicación", "Producto", "UX"] },
    { id: "automation-whatsapp", title: "Automatización de WhatsApp", category: "Automatización", description: "Flujos para ordenar consultas, respuestas y seguimiento sin trabajo manual repetitivo.", status: "development", statusLabel: "En desarrollo", url: "#", tags: ["WhatsApp", "Flujos", "Procesos"], context: "Una línea de soluciones aplicable a necesidades distintas, no un caso de cliente específico.", challenge: "Dar respuestas consistentes y mantener el seguimiento de las consultas.", solution: "Diseñamos flujos que conectan los pasos operativos necesarios.", objective: "Reducir tareas repetitivas y mejorar el recorrido de atención.", technologies: ["Automatización", "WhatsApp", "Integraciones"] }
];

const partnerBrands = [
    // Cuando exista el asset, reemplazar null por "assets/brands/nativa.png".
    { name: "NATIVA Estética", logo: null, url: NATIVA_ESTETICA_URL }
];

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function setupLogo360() {
    const links = document.querySelectorAll("a.logo");
    if (!links.length) return;
    links.forEach(link => link.addEventListener("click", event => {
        const image = link.querySelector("img");
        if (!image || image.classList.contains("spin-360")) return;
        const isModule = window.location.pathname.includes("/modules/");
        event.preventDefault();
        image.classList.add("spin-360");
        window.setTimeout(() => {
            if (isModule) window.location.href = link.href;
            else window.scrollTo({ top: 0, behavior: "smooth" });
        }, isModule ? 450 : 300);
        window.setTimeout(() => {
            image.classList.remove("spin-360");
            if (!isModule && window.location.hash) history.replaceState(null, "", window.location.pathname);
        }, 850);
    }));
}

function setupNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    const update = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
}

function setupNavigationPanel() {
    const toggle = document.getElementById("mobile-toggle");
    const panel = document.getElementById("nodo-panel");
    if (!toggle || !panel) return;
    const setOpen = open => {
        toggle.classList.toggle("is-active", open);
        panel.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Cerrar menú NODO" : "Abrir menú NODO");
        panel.setAttribute("aria-hidden", String(!open));
    };
    toggle.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));
    panel.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("click", event => {
        if (panel.classList.contains("is-open") && !panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && panel.classList.contains("is-open")) {
            setOpen(false);
            toggle.focus();
        }
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) setOpen(false);
    });
}

function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;
    links.forEach(link => link.addEventListener("click", event => {
        const selector = link.getAttribute("href");
        if (!selector || selector === "#") return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
        history.replaceState(null, "", selector);
    }));
}

function setupRevealAnimations() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("active"));
        return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach(item => observer.observe(item));
}

function setupProjectModal() {
    const cards = document.querySelectorAll("[data-project-id]");
    const modal = document.getElementById("project-modal");
    if (!cards.length || !modal) return;
    const dialog = modal.querySelector(".project-modal-dialog");
    const elements = {
        category: document.getElementById("project-modal-category"),
        status: document.getElementById("project-modal-status"),
        title: document.getElementById("project-modal-title"),
        description: document.getElementById("project-modal-description"),
        context: document.getElementById("project-modal-context"),
        challenge: document.getElementById("project-modal-challenge"),
        solution: document.getElementById("project-modal-solution"),
        objective: document.getElementById("project-modal-objective"),
        tags: document.getElementById("project-modal-tags"),
        link: document.getElementById("project-modal-link")
    };
    if (!dialog || Object.values(elements).some(element => !element)) return;
    let lastFocus = null;
    const close = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        if (lastFocus) lastFocus.focus();
    };
    const open = card => {
        const project = projects.find(item => item.id === card.dataset.projectId);
        if (!project) return;
        lastFocus = card;
        elements.category.textContent = project.category;
        elements.status.textContent = project.statusLabel;
        elements.status.className = "status-badge status-" + project.status;
        elements.title.textContent = project.title;
        elements.description.textContent = project.description;
        elements.context.textContent = project.context;
        elements.challenge.textContent = project.challenge;
        elements.solution.textContent = project.solution;
        elements.objective.textContent = project.objective;
        elements.tags.replaceChildren();
        project.technologies.forEach(technology => {
            const tag = document.createElement("li");
            tag.textContent = technology;
            elements.tags.appendChild(tag);
        });
        const hasUrl = project.url && project.url !== "#";
        elements.link.hidden = !hasUrl;
        if (hasUrl) elements.link.href = project.url;
        modal.hidden = false;
        document.body.classList.add("modal-open");
        dialog.focus();
    };
    cards.forEach(card => {
        card.addEventListener("click", event => {
            if (!event.target.closest("a, button")) open(card);
        });
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open(card);
            }
        });
    });
    modal.querySelectorAll("[data-modal-close]").forEach(control => control.addEventListener("click", close));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) close();
    });
}

function setupBrandMarquee() {
    const marquee = document.getElementById("brand-marquee");
    const track = marquee?.querySelector("[data-brand-track]");
    if (!marquee || !track) return;
    const createItem = (brand, duplicate) => {
        const item = document.createElement("a");
        item.className = "brand-item";
        item.href = brand.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
        item.textContent = brand.name;
        if (duplicate) {
            item.setAttribute("aria-hidden", "true");
            item.tabIndex = -1;
        }
        if (brand.logo) {
            const image = document.createElement("img");
            image.src = brand.logo;
            image.alt = brand.name;
            image.addEventListener("error", () => image.remove());
            item.replaceChildren(image);
        }
        return item;
    };
    const useMarquee = partnerBrands.length >= 3;
    marquee.classList.toggle("is-static", !useMarquee);
    track.replaceChildren();
    partnerBrands.forEach(brand => track.appendChild(createItem(brand, false)));
    if (useMarquee) {
        partnerBrands.forEach(brand => track.appendChild(createItem(brand, true)));
    }
}

function setupVideo() {
    const shell = document.getElementById("video-shell");
    const placeholder = document.getElementById("video-placeholder");
    if (!shell || !placeholder) return;
    const video = document.createElement("video");
    const showVideo = () => {
        placeholder.hidden = true;
        video.hidden = false;
    };

    video.controls = true;
    video.hidden = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = "assets/nodo-showreel.mp4";
    video.setAttribute("aria-label", "Showreel de NODO");
    video.addEventListener("loadedmetadata", showVideo, { once: true });
    video.addEventListener("canplay", showVideo, { once: true });
    video.addEventListener("error", () => {
        video.hidden = true;
        placeholder.hidden = false;
    }, { once: true });
    shell.appendChild(video);
}

function setupBriefForm() {
    const form = document.getElementById("brief-form");
    if (!form) return;
    const steps = [...form.querySelectorAll(".brief-step")];
    const previous = document.getElementById("brief-previous");
    const next = document.getElementById("brief-next");
    const submit = document.getElementById("brief-submit");
    const status = document.getElementById("brief-status");
    const label = document.getElementById("brief-step-label");
    const progress = document.getElementById("brief-progress-value");
    if (!previous || !next || !submit || !status || !label || !progress) return;
    let currentStep = 1;
    const choice = name => form.querySelector('[name="' + name + '"]:checked')?.value || "No indicado";
    const choices = name => [...form.querySelectorAll('[name="' + name + '"]:checked')].map(input => input.value).join(", ") || "No indicado";
    const updateSummary = () => {
        const values = { name: form.elements.name.value.trim() || "No indicado", business: form.elements.business.value.trim() || "No indicado", objective: choice("objective"), current: choices("current"), need: choice("need") };
        Object.entries(values).forEach(([key, value]) => {
            const output = form.querySelector('[data-summary="' + key + '"]');
            if (output) output.textContent = value;
        });
    };
    const showStep = step => {
        currentStep = step;
        steps.forEach(item => item.hidden = Number(item.dataset.step) !== currentStep);
        label.textContent = "Paso " + currentStep + " de " + steps.length;
        progress.style.width = (currentStep / steps.length) * 100 + "%";
        previous.hidden = currentStep === 1;
        next.hidden = currentStep === steps.length;
        submit.hidden = currentStep !== steps.length;
        status.textContent = "";
        if (currentStep === steps.length) updateSummary();
    };
    const validate = () => {
        const fields = [...steps[currentStep - 1].querySelectorAll("input, textarea")];
        const invalid = fields.find(field => !field.checkValidity());
        if (!invalid) return true;
        status.textContent = "Completá los campos requeridos para continuar.";
        invalid.reportValidity();
        return false;
    };
    next.addEventListener("click", () => {
        if (validate()) showStep(currentStep + 1);
    });
    previous.addEventListener("click", () => showStep(currentStep - 1));
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validate()) return;
        const message = [
            "Hola! Quiero hablar sobre un proyecto para NODO.", "",
            "Nombre: " + form.elements.name.value.trim(),
            "Negocio: " + (form.elements.business.value.trim() || "No indicado"),
            "WhatsApp: " + form.elements.whatsapp.value.trim(),
            "Email: " + (form.elements.email.value.trim() || "No indicado"), "",
            "Objetivo: " + choice("objective"),
            "Actualmente tengo: " + choices("current"),
            "Creo que necesito: " + choice("need"), "",
            "Detalles: " + (form.elements.details.value.trim() || "No indicado"),
            "Fecha ideal: " + (form.elements.date.value.trim() || "No indicada"), "",
            "Origen: Formulario NODO"
        ].join("\\n");
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
    showStep(currentStep);
}

function setupFaq() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;
    items.forEach(item => item.addEventListener("toggle", () => {
        if (item.open) items.forEach(other => {
            if (other !== item) other.open = false;
        });
    }));
}

function setupCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(target => target.textContent = String(new Date().getFullYear()));
}

document.addEventListener("DOMContentLoaded", () => {
    setupLogo360();
    setupNavbar();
    setupNavigationPanel();
    setupSmoothScroll();
    setupRevealAnimations();
    setupProjectModal();
    setupBrandMarquee();
    setupVideo();
    setupBriefForm();
    setupFaq();
    setupCurrentYear();
});
