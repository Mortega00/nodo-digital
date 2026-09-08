const WHATSAPP_NUMBER = "5491130700900";
const NATIVA_ESTETICA_URL = "https://mortega00.github.io/estetica-natalia/#inicio";

const solutionGuides = {
    web: {
        title: "Web / Landing Pages",
        shortDefinition: "Una presencia digital pensada para explicar lo que hacés y llevar a una acción.",
        whatIsIt: "Una landing page es una página enfocada en un objetivo concreto. Puede servir para presentar un servicio, conseguir consultas, recibir reservas o promocionar una propuesta sin obligar a la persona a recorrer un sitio enorme.",
        usefulFor: ["Presentar un negocio o servicio", "Conseguir consultas", "Mostrar una promoción", "Recibir reservas", "Llevar personas a WhatsApp", "Validar una idea rápidamente"],
        goodFit: ["Querés presentar mejor tu negocio", "Necesitás consultas o reservas", "Tenés una oferta concreta para comunicar"],
        notFit: ["Ya tenés una web que cumple ese objetivo", "Lo que necesitás es gestionar procesos internos"],
        whenItMakesSense: "Cuando necesitás comunicar algo de forma clara y no hace falta construir un sitio grande o un sistema completo.",
        examples: ["NATIVA: una landing que organiza tratamientos y facilita consultas y reservas."],
        relatedModule: "modules/landing-pages.html",
        ctaLabel: "Explorar Landing Pages"
    },
    systems: {
        title: "Sistemas / Aplicaciones",
        shortDefinition: "Una herramienta para organizar información, personas o procesos.",
        whatIsIt: "Un sistema digital permite registrar, consultar y gestionar información que antes podía estar repartida entre planillas, WhatsApp, papeles o distintas herramientas.",
        usefulFor: ["Pedidos", "Clientes", "Cobranzas", "Inventario", "Turnos", "Tareas", "Roles de empleados", "Reportes y seguimientos"],
        goodFit: ["La información hoy está repartida", "Varias personas necesitan trabajar con los mismos datos", "Un proceso manual ya es difícil de seguir"],
        notFit: ["Una planilla bien organizada todavía alcanza", "La necesidad principal es solo comunicar una propuesta"],
        whenItMakesSense: "Cuando un proceso empieza a ser difícil de manejar manualmente o cuando necesitás que varias personas trabajen con la misma información.",
        examples: ["BLOC y Planner: productos del ecosistema orientados a organizar procesos y trabajo."],
        relatedModule: "modules/sistemas.html",
        ctaLabel: "Explorar Sistemas"
    },
    automation: {
        title: "Automatizaciones",
        shortDefinition: "Hacer que tareas repetitivas sucedan automáticamente.",
        whatIsIt: "Una automatización conecta acciones que normalmente harías de forma manual. Por ejemplo: recibir un formulario, guardar los datos, enviar una confirmación y avisar a una persona.",
        usefulFor: ["Confirmaciones", "Seguimientos", "Recordatorios", "Formularios", "WhatsApp y emails", "Carga de datos", "Integración entre herramientas"],
        goodFit: ["Repetís una misma tarea muchas veces", "El proceso ya tiene una lógica clara", "Necesitás conectar herramientas"],
        notFit: ["El proceso cambia constantemente", "Todavía no está claro cómo debería funcionar"],
        whenItMakesSense: "Cuando repetís una misma tarea muchas veces y existe una lógica clara que puede ejecutarse automáticamente.",
        examples: ["Un formulario que registra un contacto, confirma la consulta y avisa al equipo."],
        relatedModule: "modules/automatizaciones.html",
        ctaLabel: "Explorar Automatizaciones"
    },
    products: {
        title: "Apps / Productos digitales",
        shortDefinition: "Una herramienta creada alrededor de una necesidad concreta.",
        whatIsIt: "Una aplicación es una herramienta digital con funciones específicas que una persona utiliza para registrar, consultar, calcular, organizar, comprar, reservar o gestionar.",
        usefulFor: ["Resolver una necesidad específica", "Crear un producto propio", "Digitalizar una experiencia", "Llevar una idea a una herramienta utilizable"],
        goodFit: ["Necesitás funciones propias", "Querés crear una experiencia de uso específica", "Una necesidad concreta merece una herramienta"],
        notFit: ["Una web simple ya puede resolverlo", "Existe una herramienta disponible que cubre la necesidad"],
        whenItMakesSense: "Cuando la solución necesita funciones propias y una experiencia pensada para que alguien haga una tarea concreta.",
        examples: ["START, QARTA, MyLuna y otros productos del ecosistema NODO."],
        relatedModule: "modules/aplicaciones.html",
        ctaLabel: "Explorar Aplicaciones"
    }
};

const glossaryTerms = {
    seo: { title: "SEO", definition: "Ajustes que ayudan a que Google entienda de qué trata tu página y pueda mostrarla cuando alguien busca algo relacionado." },
    responsive: { title: "Responsive", definition: "Significa que la web se adapta correctamente a celular, tablet y computadora." },
    dominio: { title: "Dominio", definition: "Es la dirección de tu web.", optionalExample: "Ejemplo: tunegocio.com." },
    hosting: { title: "Hosting", definition: "Es el servicio donde se alojan los archivos de una web para que pueda estar disponible en Internet." },
    integracion: { title: "Integración", definition: "Es conectar una solución con otra herramienta, por ejemplo WhatsApp, Google Maps, una agenda o un formulario." },
    analytics: { title: "Analytics", definition: "Son datos que permiten entender cuántas personas entran a una web y cómo la utilizan." },
    automatizacion: { title: "Automatización", definition: "Es una serie de acciones que se ejecutan automáticamente siguiendo reglas definidas." },
    "landing-page": { title: "Landing Page", definition: "Es una página enfocada en un objetivo concreto, como conseguir consultas, reservas o ventas." },
    sistema: { title: "Sistema", definition: "Es una herramienta digital para registrar, organizar y gestionar información o procesos." },
    aplicacion: { title: "Aplicación", definition: "Es una herramienta digital creada para que una persona pueda realizar acciones concretas." },
    formulario: { title: "Formulario", definition: "Es un espacio para que una persona deje sus datos o cuente qué necesita de forma ordenada." },
    maps: { title: "Maps", definition: "Permite mostrar una ubicación o indicar cómo llegar a un negocio desde una página." },
    animaciones: { title: "Animaciones", definition: "Son movimientos visuales sutiles que ayudan a guiar la atención sin dificultar la lectura." },
    agenda: { title: "Agenda", definition: "Es una herramienta para consultar disponibilidad y organizar turnos o reservas." },
    "web-profesional": { title: "Web profesional", definition: "Un sitio más amplio que una landing, pensado para presentar varias áreas de un negocio, servicios, información y contacto." },
    reservas: { title: "Reservas / agenda", definition: "Una herramienta para que una persona pueda consultar disponibilidad y solicitar o confirmar un turno." }
};

const projects = [
    // TODO NODO: revisar manualmente estados públicos de Planner, MyLuna y extensiones START antes del lanzamiento.
    { id: "nativa-estetica", title: "Nativa Estética", category: "Landing Pages", description: "Landing page diseñada para ordenar servicios de estética y facilitar consultas o reservas.", status: "available", statusLabel: "Disponible", url: NATIVA_ESTETICA_URL, tags: ["Responsive", "Reservas", "WhatsApp"], context: "NATIVA necesitaba una presencia digital que acompañara una experiencia de atención presencial.", challenge: "Ordenar tratamientos y transmitir confianza sin sumar fricción entre una visita y una consulta.", solution: "Diseñamos una landing clara, responsive y orientada al contacto directo.", objective: "Hacer más simple entender los servicios y dar el siguiente paso hacia una reserva.", technologies: ["Landing page", "Responsive", "WhatsApp"] },
    { id: "start-program", title: "START", category: "Training", description: "Sistema de entrenamiento estructurado para progresar semana a semana.", status: "available", statusLabel: "Disponible", url: "https://mortega00.github.io/start/", tags: ["Training", "Método", "Progreso"], context: "START reúne una forma de planificar el entrenamiento sin depender de la improvisación.", challenge: "Convertir una rutina dispersa en un recorrido simple de seguir.", solution: "Estructuramos bloques de progresión y una experiencia fácil de consultar.", objective: "Ayudar a entrenar con un método sostenido en el tiempo.", technologies: ["Producto digital", "Planificación", "UX"] },
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

function syncModalOpenState() {
    const hasOpenModal = Boolean(document.querySelector(".project-modal:not([hidden]), .educational-modal:not([hidden])"));
    document.body.classList.toggle("modal-open", hasOpenModal);
}

function hideOtherModals(activeModal) {
    document.querySelectorAll(".project-modal, .educational-modal").forEach(modal => {
        if (modal !== activeModal) modal.hidden = true;
    });
    syncModalOpenState();
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
        syncModalOpenState();
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
        hideOtherModals(modal);
        modal.hidden = false;
        syncModalOpenState();
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

function setupSolutionGuides() {
    const triggers = document.querySelectorAll("[data-solution-guide]");
    const modal = document.getElementById("solution-guide-modal");
    if (!triggers.length || !modal) return;

    const dialog = modal.querySelector(".solution-guide-dialog");
    const title = document.getElementById("solution-guide-title");
    const shortDefinition = document.getElementById("solution-guide-short");
    const whatIsIt = document.getElementById("solution-guide-what");
    const usefulFor = document.getElementById("solution-guide-useful-for");
    const goodFit = document.getElementById("solution-guide-good-fit");
    const notFit = document.getElementById("solution-guide-not-fit");
    const whenItMakesSense = document.getElementById("solution-guide-when");
    const examples = document.getElementById("solution-guide-examples");
    const moduleLink = document.getElementById("solution-guide-module");
    const briefLink = document.getElementById("solution-guide-brief");
    if (!dialog || !title || !shortDefinition || !whatIsIt || !usefulFor || !goodFit || !notFit || !whenItMakesSense || !examples || !moduleLink || !briefLink) return;

    let lastFocus = null;
    const fillList = (target, items) => {
        target.replaceChildren();
        items.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            target.appendChild(listItem);
        });
    };
    const close = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        syncModalOpenState();
        if (lastFocus) lastFocus.focus();
    };
    const open = trigger => {
        const guide = solutionGuides[trigger.dataset.solutionGuide];
        if (!guide) return;

        lastFocus = trigger;
        title.textContent = guide.title;
        shortDefinition.textContent = guide.shortDefinition;
        whatIsIt.textContent = guide.whatIsIt;
        whenItMakesSense.textContent = guide.whenItMakesSense;
        moduleLink.href = guide.relatedModule;
        moduleLink.textContent = guide.ctaLabel;
        fillList(usefulFor, guide.usefulFor);
        fillList(goodFit, guide.goodFit);
        fillList(notFit, guide.notFit);
        fillList(examples, guide.examples);
        hideOtherModals(modal);
        modal.hidden = false;
        syncModalOpenState();
        dialog.focus();
    };

    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => open(trigger));
        trigger.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open(trigger);
            }
        });
    });
    modal.querySelectorAll("[data-solution-guide-close]").forEach(control => control.addEventListener("click", close));
    briefLink.addEventListener("click", close);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) close();
    });
}

function setupGlossary() {
    const triggers = document.querySelectorAll("[data-glossary]");
    const modal = document.getElementById("glossary-modal");
    if (!triggers.length || !modal) return;

    const dialog = modal.querySelector(".glossary-dialog");
    const title = document.getElementById("glossary-title");
    const definition = document.getElementById("glossary-definition");
    const example = document.getElementById("glossary-example");
    if (!dialog || !title || !definition || !example) return;

    let lastFocus = null;
    const close = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        syncModalOpenState();
        if (lastFocus) lastFocus.focus();
    };
    const open = trigger => {
        const term = glossaryTerms[trigger.dataset.glossary];
        if (!term) return;

        lastFocus = trigger;
        title.textContent = term.title;
        definition.textContent = term.definition;
        example.textContent = term.optionalExample || "";
        example.hidden = !term.optionalExample;
        hideOtherModals(modal);
        modal.hidden = false;
        syncModalOpenState();
        dialog.focus();
    };

    triggers.forEach(trigger => trigger.addEventListener("click", () => open(trigger)));
    modal.querySelectorAll("[data-glossary-close]").forEach(control => control.addEventListener("click", close));
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
    const objectiveCount = document.getElementById("objective-count");
    const objectiveLimitMessage = document.getElementById("objective-limit-message");
    const unnamedNote = document.getElementById("brief-unnamed-note");
    const businessRequiredMarker = form.querySelector("[data-business-required-marker]");
    if (!steps.length || !previous || !next || !submit || !status || !label || !progress || !objectiveCount || !objectiveLimitMessage || !unnamedNote || !businessRequiredMarker) return;
    if (form.dataset.briefInitialized === "true") return;
    form.dataset.briefInitialized = "true";

    let currentStep = 1;
    let navigationLocked = false;
    const conditionalTimers = new WeakMap();
    const objectives = [...form.querySelectorAll('[name="objective"]')];
    const choice = name => form.querySelector('[name="' + name + '"]:checked')?.value || "";
    const choices = name => [...form.querySelectorAll('[name="' + name + '"]:checked')].map(input => input.value).join(", ");
    const value = name => typeof form.elements[name]?.value === "string" ? form.elements[name].value.trim() : "";
    const projectIsUnnamed = () => Boolean(form.elements.project_unnamed?.checked);
    const businessValue = () => projectIsUnnamed() ? "Todavía sin nombre" : value("business");
    const isConditionalNameActive = name => {
        const container = form.querySelector('[name="' + name + '"]')?.closest(".conditional-field");
        return !container || container.dataset.active === "true";
    };
    const conditionalValue = name => isConditionalNameActive(name) ? value(name) : "";
    const conditionalChoice = name => isConditionalNameActive(name) ? choice(name) : "";
    const conditionalChoices = name => isConditionalNameActive(name) ? choices(name) : "";
    const isConditionalActive = element => {
        const container = element.closest(".conditional-field");
        return !container || container.dataset.active === "true";
    };
    const isVisibleField = element => !element.closest("[hidden]") && isConditionalActive(element);
    const setConditionalVisibility = (container, visible) => {
        const wasActive = container.dataset.active === "true";
        const pendingTimer = conditionalTimers.get(container);
        if (pendingTimer) window.clearTimeout(pendingTimer);

        if (visible) {
            container.dataset.active = "true";
            container.hidden = false;
            container.inert = false;
            window.requestAnimationFrame(() => {
                if (container.dataset.active === "true") container.classList.add("is-visible");
            });
            return;
        }

        if (!wasActive && container.hidden) return;
        delete container.dataset.active;
        container.inert = true;
        container.classList.remove("is-visible");
        conditionalTimers.set(container, window.setTimeout(() => {
            if (container.dataset.active !== "true") container.hidden = true;
        }, 220));
    };
    const updateConditionalRequirements = () => {
        form.querySelectorAll(".conditional-field").forEach(container => {
            const active = container.dataset.active === "true";
            container.querySelectorAll("input, textarea").forEach(field => field.disabled = !active);
            container.querySelectorAll("[data-conditional-required]").forEach(field => field.required = active);
        });
    };
    const updateProjectNameState = () => {
        const business = form.elements.business;
        const unnamed = projectIsUnnamed();
        business.required = !unnamed;
        businessRequiredMarker.hidden = unnamed;
        unnamedNote.hidden = !unnamed;
    };
    const updateObjectiveSelection = () => {
        const selectedCount = objectives.filter(input => input.checked).length;
        const atLimit = selectedCount >= 3;
        objectives.forEach(input => input.disabled = atLimit && !input.checked);
        objectiveCount.textContent = selectedCount + " de 3 seleccionadas";
        objectiveLimitMessage.hidden = !atLimit;
    };
    const updateConditionalFields = () => {
        const currentValues = new Set([...form.querySelectorAll('[name="current"]:checked')].map(input => input.value));
        const selectedNeed = choice("need");
        form.querySelectorAll("[data-current-field]").forEach(container => {
            setConditionalVisibility(container, currentValues.has(container.dataset.currentField));
        });
        form.querySelectorAll("[data-need-field]").forEach(container => {
            setConditionalVisibility(container, selectedNeed === container.dataset.needField);
        });
        updateConditionalRequirements();
    };
    const updateSummary = () => {
        const values = {
            name: value("name"),
            business: businessValue(),
            whatsapp: value("whatsapp"),
            email: value("email"),
            objective: choices("objective"),
            current: choices("current"),
            current_social: conditionalValue("current_social"),
            current_website: conditionalValue("current_website"),
            old_website: conditionalValue("old_website"),
            current_system: conditionalValue("current_system"),
            current_other: conditionalValue("current_other"),
            need: choice("need"),
            landing_goal: conditionalChoice("landing_goal"),
            website_sections: conditionalChoices("website_sections"),
            booking_type: conditionalChoice("booking_type"),
            automation_task: conditionalValue("automation_task"),
            system_needs: conditionalChoices("system_needs"),
            app_actions: conditionalValue("app_actions"),
            details: value("details"),
            date: value("date"),
            budget: choice("budget")
        };
        Object.entries(values).forEach(([key, fieldValue]) => {
            const output = form.querySelector('[data-summary="' + key + '"]');
            const row = form.querySelector('[data-summary-row="' + key + '"]');
            if (output) output.textContent = fieldValue;
            if (row) row.hidden = !fieldValue;
        });
    };
    const keepFormHeaderVisible = () => {
        const navbarHeight = document.getElementById("navbar")?.getBoundingClientRect().height || 0;
        const formBounds = form.getBoundingClientRect();
        const topOffset = navbarHeight + 16;
        if (formBounds.top < topOffset || formBounds.top > window.innerHeight - 96) {
            window.scrollTo({ top: Math.max(0, window.scrollY + formBounds.top - topOffset), behavior: "smooth" });
        }
    };
    const renderStep = () => {
        updateConditionalFields();
        steps.forEach(item => item.hidden = Number(item.dataset.step) !== currentStep);
        label.textContent = "Paso " + currentStep + " de " + steps.length;
        progress.style.width = (currentStep / steps.length) * 100 + "%";
        previous.hidden = currentStep === 1;
        next.hidden = currentStep === steps.length;
        submit.hidden = currentStep !== steps.length;
        previous.disabled = navigationLocked || currentStep === 1;
        next.disabled = navigationLocked || currentStep === steps.length;
        submit.disabled = navigationLocked || currentStep !== steps.length;
        status.textContent = "";
        if (currentStep === steps.length) updateSummary();
    };
    const goToStep = (nextStep, keepVisible = false) => {
        if (navigationLocked) return false;
        navigationLocked = true;
        const requestedStep = Number(nextStep);
        const normalizedStep = Math.max(1, Math.min(steps.length, Number.isFinite(requestedStep) ? Math.trunc(requestedStep) : currentStep));
        currentStep = normalizedStep;
        renderStep();
        if (keepVisible) window.requestAnimationFrame(keepFormHeaderVisible);
        window.requestAnimationFrame(() => {
            navigationLocked = false;
            renderStep();
        });
        return true;
    };
    const showMissingData = (field, message = "Nos falta este dato para seguir.") => {
        status.textContent = message;
        if (!field) return false;
        field.reportValidity();
        field.focus({ preventScroll: true });
        return false;
    };
    const validateCurrentStep = () => {
        updateProjectNameState();
        updateConditionalRequirements();
        updateObjectiveSelection();
        const step = steps[currentStep - 1];
        if (currentStep === 2 && !objectives.some(input => input.checked)) {
            return showMissingData(objectives[0], "Elegí al menos un objetivo para poder entender qué buscás.");
        }
        if (currentStep === 3 && !form.querySelector('[name="current"]:checked')) {
            return showMissingData(form.querySelector('[name="current"]'), "Elegí al menos una opción. Si todavía no tenés nada, podés marcar “Nada todavía”.");
        }
        const fields = [...step.querySelectorAll("input, textarea")].filter(isVisibleField);
        const invalid = fields.find(field => !field.checkValidity());
        if (invalid) return showMissingData(invalid);
        return true;
    };
    const validate = () => {
        if (!validateCurrentStep()) return false;
        const step = steps[currentStep - 1];
        const missingGroup = [...step.querySelectorAll("[data-required-group]")].find(group => group.dataset.active === "true" && !group.querySelector("input:checked"));
        if (!missingGroup) return true;
        return showMissingData(missingGroup.querySelector("input"), "Elegí al menos una opción para continuar.");
    };
    next.addEventListener("click", () => {
        if (currentStep >= steps.length || navigationLocked || !validate()) return;
        goToStep(currentStep + 1, true);
    });
    previous.addEventListener("click", () => {
        if (currentStep <= 1 || navigationLocked) return;
        goToStep(currentStep - 1, true);
    });
    form.addEventListener("change", event => {
        if (event.target.name === "project_unnamed") updateProjectNameState();
        if (event.target.name === "objective") {
            const selectedCount = objectives.filter(input => input.checked).length;
            if (selectedCount > 3) event.target.checked = false;
            updateObjectiveSelection();
        }
        if (event.target.name === "current") {
            const nothing = form.querySelector('[name="current"][value="Nada todavía"]');
            if (event.target === nothing && nothing.checked) {
                form.querySelectorAll('[name="current"]').forEach(input => {
                    if (input !== nothing) input.checked = false;
                });
            } else if (event.target.checked && nothing) {
                nothing.checked = false;
            }
        }
        updateConditionalFields();
        if (currentStep === steps.length) updateSummary();
    });
    form.addEventListener("input", () => {
        if (currentStep === steps.length) updateSummary();
    });
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (currentStep !== steps.length || navigationLocked || !validate()) return;
        const current = choices("current");
        const conditionalCurrent = [
            ["Redes", conditionalValue("current_social")],
            ["Web actual", conditionalValue("current_website")],
            ["Web vieja", conditionalValue("old_website")],
            ["Sistema actual", conditionalValue("current_system")],
            ["Otro", conditionalValue("current_other")]
        ];
        const conditionalNeed = [
            ["Acción principal", conditionalChoice("landing_goal")],
            ["Secciones web", conditionalChoices("website_sections")],
            ["Tipo de reserva", conditionalChoice("booking_type")],
            ["Tarea a automatizar", conditionalValue("automation_task")],
            ["Necesidades del sistema", conditionalChoices("system_needs")],
            ["Acciones de la app", conditionalValue("app_actions")]
        ];
        const addOptionalLines = (lines, entries) => entries.forEach(([fieldLabel, fieldValue]) => {
            if (fieldValue) lines.push(fieldLabel + ": " + fieldValue);
        });
        const message = [
            "Hola! Quiero hablar sobre un proyecto para NODO.", "",
            "DATOS",
            "Nombre: " + value("name"),
            "Negocio / marca / idea: " + businessValue(),
            "WhatsApp: " + value("whatsapp"),
            "Email: " + value("email"), "",
            "OBJETIVO",
            "Objetivos: " + choices("objective"), "",
            "ACTUALMENTE TENGO",
            "Actualmente tengo: " + current
        ];
        addOptionalLines(message, conditionalCurrent);
        message.push("", "CREO QUE NECESITO", "Necesito: " + choice("need"));
        addOptionalLines(message, conditionalNeed);
        message.push("", "SOBRE EL PROYECTO", "Detalles: " + value("details"), "Fecha ideal: " + value("date"), "Presupuesto: " + choice("budget"), "", "Origen: Formulario NODO");
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
    updateProjectNameState();
    updateObjectiveSelection();
    goToStep(currentStep);
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
    setupSolutionGuides();
    setupGlossary();
    setupBrandMarquee();
    setupVideo();
    setupBriefForm();
    setupFaq();
    setupCurrentYear();
});
