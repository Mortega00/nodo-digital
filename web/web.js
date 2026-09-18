const plans = {
    presence: {
        name: "Presencia",
        price: "$180.000 ARS",
        delivery: "Entrega estimada: 2 a 5 días hábiles.",
        description: "Una presencia digital profesional, clara y lista para mostrar lo que hacés y recibir consultas.",
        benefits: [
            "Una landing profesional que se ve bien en celular y computadora.",
            "La información de tu negocio y tus servicios queda clara y ordenada.",
            "WhatsApp y formulario para facilitar las consultas.",
            "Google Maps cuando corresponde a tu proyecto.",
            "Una estructura SEO inicial para que los buscadores puedan entender la página."
        ],
        includes: [
            "Una landing profesional y responsive.",
            "Información de tu negocio, servicios principales y datos de contacto.",
            "Botones de WhatsApp y formulario de contacto.",
            "Google Maps cuando aplique.",
            "Una estructura SEO inicial y preparación para publicar.",
            "Acompañamiento para elegir, registrar y conectar un dominio a tu nombre."
        ]
    },
    local: {
        name: "Local",
        price: "$280.000 ARS",
        delivery: "Entrega estimada: 5 a 10 días hábiles.",
        description: "Para negocios que necesitan una buena web y mayor foco en búsquedas y presencia local.",
        benefits: [
            "Todo lo esencial para presentar tu negocio con claridad.",
            "Más profundidad para los servicios o productos importantes.",
            "Una estructura orientada a búsquedas y contexto local.",
            "Preparación para Search Console y Analytics cuando se configuren.",
            "Acompañamiento sobre el Perfil de Empresa de Google cuando aplique."
        ],
        includes: [
            "Una web profesional y responsive con información relevante de tu negocio.",
            "Mayor profundidad para servicios, productos, trabajos, ubicación o promociones.",
            "WhatsApp y formulario para facilitar las consultas.",
            "Estructura SEO orientada a búsquedas locales, sin prometer posiciones específicas.",
            "Preparación para conectar Search Console y Analytics cuando corresponda.",
            "Acompañamiento para optimizar el Perfil de Empresa de Google cuando aplique.",
            "Acompañamiento para elegir, registrar y conectar un dominio a tu nombre."
        ]
    },
    custom: {
        name: "Personalizado",
        price: "Presupuesto a medida",
        delivery: "Lo definimos según el proyecto.",
        description: "Para proyectos que necesitan más que una web estándar y requieren definir funciones a medida.",
        benefits: [
            "Partimos de la necesidad real de tu proyecto.",
            "Podemos contemplar catálogos, reservas, pagos, stock o usuarios según haga falta.",
            "También podemos trabajar integraciones, automatizaciones, paneles o lógica a medida.",
            "Definimos alcance y prioridades antes de construir.",
            "Te explicamos cada decisión de forma clara."
        ],
        includes: [
            "Una conversación para entender el alcance de tu idea.",
            "Una propuesta con alcance, funciones y prioridades definidas para tu proyecto.",
            "Funciones como catálogo avanzado, reservas, pagos, stock, usuarios o integraciones cuando hagan falta.",
            "Automatizaciones, paneles, sistemas o bases de datos cuando el proyecto lo requiera.",
            "Acompañamiento para ordenar prioridades.",
            "Una base que contemple lo que tu proyecto realmente necesita."
        ]
    }
};

const advisorSteps = [
    {
        id: "goals",
        question: "¿Qué te gustaría lograr con tu página?",
        help: "Elegí hasta 3 opciones.",
        selection: "multiple",
        min: 1,
        max: 3,
        options: [
            { id: "professional", label: "Que mi negocio se vea más profesional", text: "Quiero tener un lugar claro donde mostrar quién soy y qué hago." },
            { id: "messages", label: "Que más personas me escriban", text: "Quiero recibir consultas por WhatsApp o formulario." },
            { id: "services", label: "Mostrar mis servicios", text: "Quiero que puedan ver fácilmente qué ofrezco." },
            { id: "local-search", label: "Que me encuentren más fácil en Google", text: "Quiero mejorar mi presencia en búsquedas locales." },
            { id: "bookings", label: "Recibir reservas o turnos", text: "Quiero que puedan elegir un día u horario." },
            { id: "products", label: "Mostrar productos", text: "Quiero enseñar lo que vendo, aunque la compra no sea online." },
            { id: "sell", label: "Vender por internet", text: "Quiero recibir pedidos o pagos desde la web." },
            { id: "unsure", label: "Todavía no estoy seguro", text: "Prefiero que me orienten.", exclusive: true }
        ]
    },
    {
        id: "today",
        question: "¿Qué tenés hoy?",
        help: "No importa si estás empezando desde cero.",
        selection: "multiple",
        min: 1,
        options: [
            { id: "social", label: "Solo redes sociales" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "current-page", label: "Ya tengo una página", group: "page-state" },
            { id: "old-page", label: "Tengo una página vieja", group: "page-state" },
            { id: "starting", label: "Estoy empezando de cero", group: "page-state" },
            { id: "idea", label: "Estoy armando una idea" }
        ]
    },
    {
        id: "content",
        question: "¿Qué te gustaría mostrar?",
        help: "No hace falta tener todo preparado ahora.",
        selection: "multiple",
        min: 1,
        options: [
            { id: "business-info", label: "Información sobre mi negocio" },
            { id: "services", label: "Mis servicios" },
            { id: "photos", label: "Fotos o trabajos" },
            { id: "prices", label: "Precios" },
            { id: "location", label: "Mi ubicación" },
            { id: "products", label: "Productos" },
            { id: "promotions", label: "Promociones" },
            { id: "undefined", label: "Todavía no lo tengo definido", exclusive: true }
        ]
    },
    {
        id: "start",
        question: "¿Cómo te gustaría empezar?",
        help: "Elegí la opción que hoy te represente mejor.",
        selection: "single",
        min: 1,
        options: [
            { id: "simple", label: "Algo simple y rápido", text: "Quiero estar online y tener una presencia clara." },
            { id: "complete", label: "Una página más completa", text: "Necesito mostrar más información y distintas partes de mi negocio." },
            { id: "commerce", label: "Quiero vender o recibir pedidos", text: "Necesito una experiencia más orientada a productos o ventas." },
            { id: "recommend", label: "Prefiero que me recomienden", text: "No sé cuál me conviene." }
        ]
    }
];

const commerceNeedOptions = [
    { id: "commerce-basic", label: "Mostrar productos y recibir pedidos", text: "Quiero que vean lo que vendo y puedan hacerme un pedido o consulta." },
    { id: "payments", label: "Cobrar desde la página", text: "Quiero que una persona pueda pagar online." },
    { id: "stock", label: "Llevar control de stock", text: "Necesito controlar qué productos hay disponibles." },
    { id: "users", label: "Que cada cliente tenga su cuenta", text: "Necesito que algunas personas puedan ingresar con sus propios datos." },
    { id: "special", label: "Necesito algo más específico", text: "Mi idea tiene funciones particulares y prefiero explicarlas." },
    { id: "commerce-unsure", label: "Todavía no estoy seguro", text: "Prefiero que me orienten." }
];

const showcaseProjects = [
    {
        id: "nativa",
        eyebrow: "PROYECTO REAL",
        type: "Landing / presencia digital",
        name: "NATIVA Estética",
        subtitle: "Remedios de Escalada, Buenos Aires",
        description: "Creamos una presencia digital clara para NATIVA Estética, organizando servicios, información del espacio y contacto en una experiencia simple, rápida y adaptable a celular.",
        tags: ["Responsive", "Servicios claros", "Contacto directo"],
        image: "assets/nativa-case-cover.png",
        imageAlt: "Portada publicada de Nativa Estética: salud, belleza y bienestar para tu piel",
        imageWidth: 1440,
        imageHeight: 760,
        url: "https://nativaestetica.netlify.app/",
        linkLabel: "Ver proyecto",
        status: "Publicado"
    },
    {
        id: "bloc",
        eyebrow: "SISTEMA / GESTIÓN",
        name: "BLOC",
        subtitle: "Control y seguimiento para equipos y operaciones.",
        description: "Sistema modular para registrar actividad, organizar el trabajo diario y separar experiencias según el rol de cada usuario.",
        tags: ["Gestión", "Roles", "Seguimiento"],
        image: "assets/bloc-case-cover.png",
        imageAlt: "Panel de Supervisión de BLOC, sistema de control y seguimiento.",
        url: "https://bloc-ar.netlify.app/",
        linkLabel: "Ver proyecto",
        status: "En desarrollo"
    }
];

const state = {
    screen: "start",
    currentStep: 0,
    answers: {},
    message: "",
    contact: {
        name: "",
        email: "",
        whatsapp: "",
        business: "",
        noBusinessName: false,
        comment: "",
        marketingEmailConsent: false
    },
    contactMessage: "",
    isSubmitting: false,
    submitError: false,
    emailConfirmationSent: null
};

const advisor = document.getElementById("advisor");

const SUPABASE_URL = "https://pmrrudtwsgqyncstfdrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XhjenDP8bMVfuEUl02h6XA_ZkJLCnn_";

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
}

function createButton(label, className, action) {
    const button = createElement("button", className, label);
    button.type = "button";
    button.addEventListener("click", action);
    return button;
}

function selectedFor(step) {
    return state.answers[step.id] || [];
}

function goalSelectionStatus(selectedCount, max) {
    if (!selectedCount) return { count: "Podés elegir hasta " + max, note: "" };
    if (selectedCount === max) return { count: "Elegiste " + selectedCount + " de " + max, note: "Ya elegiste " + max + ". Podés quitar una si querés cambiarla." };
    return { count: "Elegiste " + selectedCount + " de " + max, note: "" };
}

function labelFor(stepId, optionId) {
    const step = advisorSteps.find(item => item.id === stepId);
    return step?.options.find(option => option.id === optionId)?.label || "";
}

function toggleOption(step, option) {
    const current = [...selectedFor(step)];
    const isSelected = current.includes(option.id);

    if (step.selection === "single") {
        state.answers[step.id] = isSelected ? [] : [option.id];
        if (step.id === "start" && (isSelected || option.id !== "commerce")) delete state.answers.commerceNeeds;
    } else if (option.exclusive) {
        state.answers[step.id] = isSelected ? [] : [option.id];
    } else {
        let next = current.filter(id => !step.options.find(item => item.id === id)?.exclusive);
        if (option.group) next = next.filter(id => step.options.find(item => item.id === id)?.group !== option.group);
        if (isSelected) {
            next = next.filter(id => id !== option.id);
        } else if (step.max && next.length >= step.max) {
            state.message = "";
            renderAdvisor();
            return;
        } else {
            next.push(option.id);
        }
        state.answers[step.id] = next;
    }

    state.message = "";
    renderAdvisor();
}

function selectedCommerceNeed() {
    return state.answers.commerceNeeds || "";
}

function toggleCommerceNeed(option) {
    const selected = selectedCommerceNeed();
    if (selected === option.id) delete state.answers.commerceNeeds;
    else state.answers.commerceNeeds = option.id;
    state.message = "";
    renderAdvisor();
}

function hasValidAnswer(step) {
    return selectedFor(step).length >= step.min;
}

function goNext() {
    const step = advisorSteps[state.currentStep];
    const needsCommerceAnswer = step.id === "start" && selectedFor(step)[0] === "commerce" && !selectedCommerceNeed();
    if (!hasValidAnswer(step) || needsCommerceAnswer) {
        state.message = needsCommerceAnswer ? "Elegí una opción para que podamos orientarte mejor." : "Elegí al menos una opción para seguir.";
        renderAdvisor();
        return;
    }
    state.message = "";
    if (state.currentStep === advisorSteps.length - 1) {
        state.screen = "result";
    } else {
        state.currentStep += 1;
    }
    renderAdvisor();
    resetAdvisorScroll();
}

function resetAdvisorScroll() {
    const card = advisor.closest(".advisor-card");
    if (!card?.scrollTo) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    card.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

function scrollToAdvisor() {
    const section = document.getElementById("asesor");
    if (!section) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function scrollSuccessIntoView() {
    const success = advisor.querySelector(".advisor-success");
    if (!success) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
        const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
        const successTop = window.scrollY + success.getBoundingClientRect().top - headerHeight - 16;
        window.scrollTo({ top: Math.max(0, successTop), behavior: reduceMotion ? "auto" : "smooth" });
    });
}

function getRecommendation(answers) {
    const goals = new Set(answers.goals || []);
    const today = new Set(answers.today || []);
    const content = new Set(answers.content || []);
    const start = (answers.start || [])[0];
    const commerceNeed = answers.commerceNeeds || "";

    const customSignals = ["payments", "stock", "users", "special"];
    const relevantContent = ["business-info", "services", "photos", "prices", "location", "products", "promotions"];
    const relevantContentCount = relevantContent.filter(item => content.has(item)).length;
    const hasServiceDepth = goals.has("services") && content.has("services")
        && (content.has("location") || content.has("promotions") || relevantContentCount >= 4);
    const hasContentDepth = (start === "complete" || today.has("current-page") || today.has("old-page"))
        && content.has("services")
        && (content.has("location") || content.has("promotions") || relevantContentCount >= 4);

    if (customSignals.includes(commerceNeed)) return "custom";
    if (goals.has("local-search") || hasServiceDepth || hasContentDepth) return "local";
    return "presence";
}

function getReasons(planKey) {
    const goals = new Set(state.answers.goals || []);
    const today = new Set(state.answers.today || []);
    const content = new Set(state.answers.content || []);
    const start = (state.answers.start || [])[0];
    const commerceNeed = state.answers.commerceNeeds || "";
    const relevantContent = ["business-info", "services", "photos", "prices", "location", "products", "promotions"];
    const relevantContentCount = relevantContent.filter(item => content.has(item)).length;
    const customReasons = {
        payments: "Necesitás que las personas puedan pagar desde la página.",
        stock: "También necesitás controlar la disponibilidad de productos.",
        users: "Tu idea necesita que cada cliente pueda ingresar con sus propios datos.",
        special: "Nos contaste que necesitás funciones particulares."
    };

    if (planKey === "custom") {
        return [customReasons[commerceNeed] || "Tu idea necesita funciones que van más allá de una web estándar.", "Por eso tiene sentido plantearla como un proyecto personalizado."];
    }

    const reasons = [];

    if (planKey === "local") {
        if (goals.has("local-search")) reasons.push("Te interesa que puedan encontrarte con más facilidad en búsquedas locales.");
        if (goals.has("services") || content.has("services")) reasons.push("Querés mostrar tus servicios importantes con más profundidad.");
        if (content.has("location") && (goals.has("services") || content.has("services"))) reasons.push("También necesitás ordenar mejor la información local de tu negocio.");
        if (relevantContentCount >= 4 || start === "complete") reasons.push("Necesitás una estructura más profunda para ordenar información importante.");
        if (today.has("current-page") || today.has("old-page")) reasons.push("Ya tenés una web y querés mejorar la forma en que presenta tu negocio.");
        if (!reasons.length) reasons.push("Por lo que nos contaste, necesitás una presencia con mayor foco en búsquedas y contexto local.");
        return [...reasons.slice(0, 2), "Por eso tiene sentido trabajar una web con mayor foco en búsquedas y presencia local."];
    }

    if (goals.has("bookings")) reasons.push("Querés facilitar reservas o turnos sin sumar funciones que hoy no necesitás.");
    if (goals.has("messages") || today.has("whatsapp")) reasons.push("Querés que las personas puedan contactarte con facilidad.");
    if (goals.has("services") || content.has("services")) reasons.push("Querés mostrar tus servicios de una forma clara.");
    if (goals.has("products") || content.has("products")) reasons.push("Querés mostrar tus productos de una forma clara y ordenada.");
    if (commerceNeed === "commerce-basic") reasons.push("Querés mostrar lo que vendés y facilitar pedidos o consultas, sin requerir pagos ni stock.");
    if (start === "simple" || today.has("starting")) reasons.push("Querés empezar con una presencia clara y sin sumar cosas que hoy no necesitás.");
    if (!reasons.length && goals.has("professional")) reasons.push("Querés que tu negocio se vea más profesional y sea fácil de entender.");
    if (!reasons.length && start === "recommend") reasons.push("Preferís recibir una guía clara para elegir por dónde empezar.");

    return [...reasons.slice(0, 2), "Por eso una web Presencia puede ser un buen punto de partida."];
}

function joinNeeds(needs) {
    if (needs.length < 2) return needs[0] || "empezar con una presencia clara";
    if (needs.length === 2) return needs.join(" y ");
    return needs.slice(0, -1).join(", ") + " y " + needs.at(-1);
}

function getRecommendationSummary(planKey) {
    const goals = new Set(state.answers.goals || []);
    const today = new Set(state.answers.today || []);
    const content = new Set(state.answers.content || []);
    const start = (state.answers.start || [])[0];
    const commerceNeed = state.answers.commerceNeeds || "";
    const relevantContent = ["business-info", "services", "photos", "prices", "location", "products", "promotions"];
    const relevantContentCount = relevantContent.filter(item => content.has(item)).length;

    if (planKey === "custom") return "Tu idea necesita algunas funciones que van más allá de una web estándar. Lo mejor es plantearla como un proyecto personalizado.";

    if (planKey === "local") {
        const needs = [];
        if (goals.has("local-search")) needs.push("que puedan encontrarte mejor en búsquedas locales");
        if (goals.has("services") || content.has("services")) needs.push("mostrar mejor tus servicios");
        if (content.has("location")) needs.push("ordenar la información local de tu negocio");
        if (today.has("current-page") || today.has("old-page") || start === "complete") needs.push("darle más profundidad a tu presencia digital");
        if (relevantContentCount >= 4 || content.has("promotions")) needs.push("organizar información importante para quienes te buscan");
        return "Querés " + joinNeeds(needs) + ". Por eso tiene sentido trabajar una web con mayor foco en búsquedas y presencia local.";
    }

    if (commerceNeed === "commerce-basic") return "Querés mostrar lo que vendés y facilitar pedidos o consultas, sin necesitar pagos ni control de stock.";

    if (today.has("starting")) {
        return goals.has("messages") || today.has("whatsapp")
            ? "Estás empezando y necesitás una presencia clara para mostrar tu negocio y recibir consultas."
            : "Estás empezando y necesitás una presencia clara para mostrar tu negocio.";
    }

    const needs = [];
    if (goals.has("professional")) needs.push("mostrar tu negocio con claridad");
    if (goals.has("messages") || today.has("whatsapp")) needs.push("recibir consultas");
    if (goals.has("services")) needs.push("explicar lo que ofrecés");
    return "Querés " + joinNeeds(needs) + ". Esta opción te permite empezar de forma simple y clara.";
}

const NODO_WHATSAPP = "5491130700900";

function whatsappUrl(lines) {
    return "https://wa.me/" + NODO_WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
}

const staticWhatsAppMessages = {
    help: [
        "Hola NODO! Necesito ayuda para saber qué tipo de página puede servirle a mi negocio.",
        "",
        "Me gustaría que me orienten para empezar.",
        "",
        "Origen: Ayuda NODO Web"
    ],
    hero: [
        "Hola NODO! Me gustaría que me orienten para comenzar a realizar mi página web.",
        "",
        "Todavía no completé el asesor y prefiero contarles directamente qué necesito.",
        "",
        "Origen: Inicio NODO Web"
    ],
    final: [
        "Hola NODO! Todavía no tengo claro qué tipo de página necesito.",
        "",
        "Me gustaría contarles qué quiero hacer para que me orienten.",
        "",
        "Origen: Ayuda final NODO Web"
    ],
    business: [
        "Hola NODO! Quiero consultarles por un proyecto de mayor alcance.",
        "",
        "Me gustaría contarles lo que necesitamos y conversar una propuesta personalizada.",
        "",
        "Origen: Empresas NODO Web"
    ]
};

function consultationMessage(plan) {
    if (plan === plans.custom) {
        return whatsappUrl([
            "Hola NODO! Completé el asesor y mi proyecto quedó como Personalizado.",
            "",
            "Me gustaría contarles mejor la idea para que podamos definir qué necesito y recibir una propuesta.",
            "",
            "Origen: Recomendación NODO Web"
        ]);
    }

    return whatsappUrl([
        "Hola NODO! Completé el asesor y antes de avanzar me gustaría hablar con ustedes.",
        "",
        "Me recomendaron:",
        plan.name,
        "",
        "Valor orientativo:",
        plan.price,
        "",
        "Quisiera consultarles algunas cosas antes de seguir.",
        "",
        "Origen: Recomendación NODO Web"
    ]);
}

function projectMessage(plan) {
    const contact = state.contact;
    const business = contact.noBusinessName ? "Todavía sin nombre" : contact.business.trim();
    const lines = [
        "Hola NODO! Completé el asesor y quiero avanzar con mi página web.",
        "",
        "DATOS",
        "Nombre: " + contact.name.trim(),
        "WhatsApp: " + contact.whatsapp.trim(),
        "Negocio / marca: " + business,
        "",
        "RECOMENDACIÓN",
        "Plan: " + plan.name,
        "Valor orientativo: " + plan.price
    ];

    if (contact.comment.trim()) lines.push("", "COMENTARIO", contact.comment.trim());
    lines.push("", "Origen: Asesor NODO Web");
    return whatsappUrl(lines);
}

function createContactField(labelText, id, value, options = {}) {
    const field = createElement("label", "contact-field");
    const label = createElement("span", "contact-label", labelText);
    const control = document.createElement(options.multiline ? "textarea" : "input");
    control.className = "contact-control";
    control.id = id;
    control.name = id;
    control.value = value;
    control.required = Boolean(options.required);
    control.disabled = Boolean(options.disabled);
    if (!options.multiline) control.type = options.type || "text";
    if (options.placeholder) control.placeholder = options.placeholder;
    if (options.autocomplete) control.autocomplete = options.autocomplete;
    if (options.multiline) control.rows = 4;
    control.addEventListener("input", () => {
        state.contact[id] = control.value;
        state.contactMessage = "";
        state.submitError = false;
    });
    field.append(label, control);
    return field;
}

function createContactHoneypot() {
    const field = createElement("label", "contact-honeypot");
    field.setAttribute("aria-hidden", "true");
    const control = document.createElement("input");
    control.type = "text";
    control.name = "website";
    control.autocomplete = "off";
    control.tabIndex = -1;
    field.append(createElement("span", "", "No completar"), control);
    return field;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContact() {
    const contact = state.contact;
    const missing = [];
    if (!contact.name.trim()) missing.push("tu nombre");
    if (!contact.email.trim()) missing.push("tu email");
    if (!contact.whatsapp.trim()) missing.push("tu WhatsApp");
    if (!contact.noBusinessName && !contact.business.trim()) missing.push("el nombre de tu negocio, marca o idea");
    if (missing.length) {
        state.contactMessage = "Completá " + missing.join(", ") + " para enviar la consulta.";
        return false;
    }
    if (!isValidEmail(contact.email.trim())) {
        state.contactMessage = "Ingresá un email válido para continuar.";
        return false;
    }
    return true;
}

function buildLeadPayload(planKey, plan) {
    const contact = state.contact;
    const marketingEmailConsent = Boolean(contact.marketingEmailConsent);

    return {
        name: contact.name.trim(),
        email: contact.email.trim().toLowerCase(),
        whatsapp: contact.whatsapp.trim(),
        business_name: contact.noBusinessName ? null : contact.business.trim(),
        no_business_name: Boolean(contact.noBusinessName),
        comment: contact.comment.trim() || null,
        advisor_goals: state.answers.goals || [],
        advisor_today: state.answers.today || [],
        advisor_content: state.answers.content || [],
        advisor_start: (state.answers.start || [])[0],
        advisor_commerce_need: state.answers.commerceNeeds || null,
        recommended_plan_key: planKey,
        recommended_plan_name: plan.name,
        recommended_price: plan.price,
        marketing_email_consent: marketingEmailConsent,
        marketing_consent_at: marketingEmailConsent ? new Date().toISOString() : null
    };
}

async function submitLeadToSupabase(payload) {
    const response = await fetch(SUPABASE_URL + "/rest/v1/leads", {
        method: "POST",
        headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) return;

    let errorBody = {};
    try {
        errorBody = await response.json();
    } catch {
        // El detalle puede no estar disponible en respuestas no JSON.
    }

    console.error("NODO lead submission failed", {
        status: response.status,
        code: errorBody.code || "",
        message: errorBody.message || "",
        details: errorBody.details || "",
        hint: errorBody.hint || ""
    });

    const error = new Error("LEAD_INSERT_FAILED");
    error.status = response.status;
    error.code = errorBody.code || "";
    error.details = errorBody.message || errorBody.details || "";
    throw error;
}

function buildLeadConfirmationEmailPayload(planKey, plan) {
    const contact = state.contact;
    return {
        name: contact.name.trim(),
        email: contact.email.trim().toLowerCase(),
        businessName: contact.noBusinessName ? null : contact.business.trim(),
        planName: plan.name,
        planPrice: plan.price,
        planKey
    };
}

async function sendLeadConfirmationEmail(payload) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 9000);

    try {
        const response = await fetch(SUPABASE_URL + "/functions/v1/send-lead-confirmation", {
            method: "POST",
            headers: {
                apikey: SUPABASE_PUBLISHABLE_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        if (!response.ok) throw new Error("EMAIL_CONFIRMATION_FAILED");

        let body;
        try {
            body = await response.json();
        } catch {
            throw new Error("EMAIL_CONFIRMATION_INVALID_RESPONSE");
        }

        if (body?.ok !== true) throw new Error("EMAIL_CONFIRMATION_FAILED");
    } finally {
        window.clearTimeout(timeoutId);
    }
}

async function submitContactLead(planKey, plan, honeypotValue) {
    if (state.isSubmitting || honeypotValue.trim()) return;

    if (!validateContact()) {
        state.submitError = false;
        renderAdvisor();
        return;
    }

    state.isSubmitting = true;
    state.submitError = false;
    state.contactMessage = "";
    state.emailConfirmationSent = null;
    renderAdvisor();

    try {
        await submitLeadToSupabase(buildLeadPayload(planKey, plan));
    } catch {
        state.isSubmitting = false;
        state.submitError = true;
        state.contactMessage = "No pudimos enviar tu consulta en este momento.";
        renderAdvisor();
        return;
    }

    try {
        await sendLeadConfirmationEmail(buildLeadConfirmationEmailPayload(planKey, plan));
        state.emailConfirmationSent = true;
    } catch {
        state.emailConfirmationSent = false;
    }

    state.isSubmitting = false;
    state.submitError = false;
    state.contactMessage = "";
    state.screen = "success";
    renderAdvisor();
    resetAdvisorScroll();
    scrollSuccessIntoView();
}

function renderStart() {
    const view = createElement("div", "advisor-view advisor-start");
    view.append(createElement("p", "eyebrow", "EMPEZAMOS CUANDO QUIERAS"));
    view.append(createElement("h3", "", "Vamos a encontrar una opción para vos."));
    view.append(createElement("p", "", "Son cuatro preguntas simples. Elegí lo que más se parezca a tu caso."));
    view.append(createButton("Empezar", "button button-primary", () => {
        state.screen = "steps";
        state.currentStep = 0;
        renderAdvisor();
    }));
    return view;
}

function renderCommerceNeeds() {
    const section = createElement("section", "commerce-needs");
    section.append(createElement("h4", "commerce-needs-title", "¿Qué necesitás que pueda hacer la página?"));
    section.append(createElement("p", "commerce-needs-help", "Elegí lo que más se parezca a tu idea."));

    const choices = createElement("div", "choice-grid commerce-needs-grid");
    choices.setAttribute("role", "radiogroup");
    choices.setAttribute("aria-label", "¿Qué necesitás que pueda hacer la página?");
    const selected = selectedCommerceNeed();

    commerceNeedOptions.forEach(option => {
        const isSelected = selected === option.id;
        const choiceClass = "choice-card choice-card-detailed" + (isSelected ? " is-selected" : "");
        const choice = createButton("", choiceClass, () => toggleCommerceNeed(option));
        choice.setAttribute("aria-pressed", String(isSelected));
        choice.append(createElement("strong", "", option.label));
        choice.append(createElement("span", "", option.text));
        choice.append(createElement("span", "choice-indicator", "✓"));
        choices.append(choice);
    });

    section.append(choices);
    return section;
}

function renderStep() {
    const step = advisorSteps[state.currentStep];
    const view = createElement("div", "advisor-view");
    const meta = createElement("div", "advisor-meta");
    meta.setAttribute("aria-live", "polite");
    meta.append(createElement("span", "", "Paso " + (state.currentStep + 1) + " de " + advisorSteps.length));
    view.append(meta);

    const progress = createElement("div", "progress-track");
    progress.setAttribute("aria-hidden", "true");
    const progressBar = createElement("div", "progress-bar");
    progressBar.style.width = ((state.currentStep + 1) / advisorSteps.length * 100) + "%";
    progress.append(progressBar);
    view.append(progress);
    view.append(createElement("h3", "question-title", step.question));
    view.append(createElement("p", "question-help", step.help));

    const choices = createElement("div", "choice-grid");
    choices.setAttribute("role", step.selection === "single" ? "radiogroup" : "group");
    choices.setAttribute("aria-label", step.question);
    const selected = selectedFor(step);
    const isGoalStep = step.id === "goals";
    const isAtGoalLimit = isGoalStep && selected.length >= step.max;

    if (isGoalStep) {
        const selectionStatus = goalSelectionStatus(selected.length, step.max);
        const status = createElement("div", "advisor-selection-status");
        status.id = "goal-selection-status";
        status.setAttribute("aria-live", "polite");
        status.append(createElement("span", "advisor-selection-count", selectionStatus.count));
        status.append(createElement("span", "advisor-selection-note", selectionStatus.note));
        view.append(status);
        choices.setAttribute("aria-describedby", status.id);
    }

    step.options.forEach(option => {
        const isSelected = selected.includes(option.id);
        const isUnavailable = isAtGoalLimit && !isSelected;
        const choiceClass = "choice-card" + (option.text ? " choice-card-detailed" : " choice-card-compact") + (isSelected ? " is-selected" : "") + (isUnavailable ? " is-unavailable" : "");
        const choice = createButton("", choiceClass, () => toggleOption(step, option));
        choice.setAttribute("aria-pressed", String(isSelected));
        const label = createElement("strong", "", option.label);
        choice.append(label);
        if (option.text) choice.append(createElement("span", "", option.text));
        choice.append(createElement("span", "choice-indicator", "✓"));
        choices.append(choice);
    });
    view.append(choices);
    if (step.id === "start" && selected.includes("commerce")) view.append(renderCommerceNeeds());
    view.append(createElement("p", "advisor-message", state.message));

    const nav = createElement("div", "advisor-nav");
    const previous = createButton("Anterior", "button button-text", () => {
        state.message = "";
        if (state.currentStep === 0) state.screen = "start";
        else state.currentStep -= 1;
        renderAdvisor();
        resetAdvisorScroll();
    });
    const next = createButton(state.currentStep === advisorSteps.length - 1 ? "Ver mi opción" : "Continuar", "button button-primary advisor-next", goNext);
    if (isGoalStep && !hasValidAnswer(step)) {
        next.disabled = true;
        next.setAttribute("aria-disabled", "true");
    }
    nav.append(previous, next);
    view.append(nav);
    return view;
}

function renderDetails(title, content) {
    const details = createElement("details", "");
    details.append(createElement("summary", "", title));
    const body = createElement("div", "");
    if (Array.isArray(content)) {
        const list = createElement("ul", "");
        content.forEach(item => list.append(createElement("li", "", item)));
        body.append(list);
    } else {
        body.append(createElement("p", "", content));
    }
    details.append(body);
    return details;
}

function setupDetailsAccordion(container) {
    const items = [...container.querySelectorAll("details")];
    items.forEach(item => item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach(other => {
            if (other !== item && other.open) other.open = false;
        });
    }));
}

function renderResult() {
    const key = getRecommendation(state.answers);
    const plan = plans[key];
    const isCustomPlan = key === "custom";
    const view = createElement("div", "advisor-view");
    view.setAttribute("aria-live", "polite");
    view.append(createElement("p", "result-eyebrow", "UNA OPCIÓN PARA VOS"));
    view.append(createElement("h3", "result-title", "Por lo que nos contaste, empezaríamos por:"));

    const card = createElement("article", "plan-result");
    card.append(createElement("h3", "", plan.name));
    card.append(createElement("p", "plan-summary", getRecommendationSummary(key)));
    card.append(createElement("p", "plan-price", plan.price));
    card.append(createElement("p", "plan-price-context", isCustomPlan ? "Valor inicial según el alcance" : "Valor estimado inicial"));
    card.append(createElement("p", "plan-price-note", isCustomPlan ? "El valor final depende de las funciones y el alcance que definamos juntos." : "El valor final se confirma cuando definimos juntos el contenido y las funciones necesarias."));
    card.append(createElement("p", "plan-time", plan.delivery));
    if (plan.note) card.append(createElement("p", "plan-note", plan.note));
    const benefits = createElement("ul", "plan-facts");
    plan.benefits.slice(0, 5).forEach(item => benefits.append(createElement("li", "", item)));
    card.append(benefits);
    view.append(card);

    const details = createElement("div", "result-details");
    details.append(renderDetails("¿Por qué te recomendamos esta opción?", getReasons(key)));
    details.append(renderDetails("Ver qué incluye", plan.includes));
    details.append(renderDetails("¿De qué depende el tiempo?", "El tiempo puede variar según el alcance y qué tan rápido tengamos textos, imágenes y la información necesaria."));
    view.append(details);
    setupDetailsAccordion(details);

    const actions = createElement("div", "result-actions");
    const proceed = createButton(isCustomPlan ? "Contarnos el proyecto" : "Quiero avanzar", "button button-primary", () => {
        state.screen = "contact";
        state.contactMessage = "";
        renderAdvisor();
        resetAdvisorScroll();
    });
    const talk = createElement("a", "button button-secondary", isCustomPlan ? "Hablar con NODO ↗" : "Quiero hablarlo primero ↗");
    talk.href = consultationMessage(plan);
    talk.target = "_blank";
    talk.rel = "noopener noreferrer";
    const reset = createButton("Empezar de nuevo", "button button-text", () => {
        state.screen = "start";
        state.currentStep = 0;
        state.answers = {};
        state.message = "";
        state.contact = { name: "", email: "", whatsapp: "", business: "", noBusinessName: false, comment: "", marketingEmailConsent: false };
        state.contactMessage = "";
        state.isSubmitting = false;
        state.submitError = false;
        state.emailConfirmationSent = null;
        renderAdvisor();
        resetAdvisorScroll();
        scrollToAdvisor();
    });
    actions.append(proceed, talk, reset);
    view.append(actions);
    return view;
}

function renderContact() {
    const key = getRecommendation(state.answers);
    const plan = plans[key];
    const contact = state.contact;
    const view = createElement("div", "advisor-view advisor-contact");
    view.setAttribute("aria-live", "polite");

    const recommendation = createElement("div", "contact-recommendation");
    recommendation.append(createElement("p", "contact-recommendation-label", "Tu recomendación"));
    recommendation.append(createElement("p", "contact-recommendation-plan", plan.name));
    recommendation.append(createElement("p", "contact-recommendation-price", plan.price));
    view.append(recommendation);

    view.append(createElement("h3", "contact-title", "Perfecto. Sigamos desde acá."));
    view.append(createElement("p", "contact-intro", "Ya sabemos qué opción puede tener más sentido para vos. Ahora necesitamos unos datos básicos para poder orientarte mejor."));

    const form = createElement("form", "contact-form");
    form.noValidate = true;
    form.setAttribute("aria-busy", String(state.isSubmitting));
    form.append(createContactHoneypot());
    form.append(createContactField("Nombre *", "name", contact.name, { required: true, autocomplete: "name" }));
    form.append(createContactField("Email *", "email", contact.email, { required: true, type: "email", autocomplete: "email" }));
    form.append(createContactField("WhatsApp *", "whatsapp", contact.whatsapp, { required: true, type: "tel", autocomplete: "tel" }));
    form.append(createContactField(contact.noBusinessName ? "Nombre de tu negocio, marca o idea" : "Nombre de tu negocio, marca o idea *", "business", contact.business, { required: !contact.noBusinessName, disabled: contact.noBusinessName }));

    const noBusinessLabel = createElement("label", "contact-checkbox");
    const noBusiness = document.createElement("input");
    noBusiness.type = "checkbox";
    noBusiness.checked = contact.noBusinessName;
    noBusiness.addEventListener("change", () => {
        state.contact.noBusinessName = noBusiness.checked;
        state.contactMessage = "";
        state.submitError = false;
        renderAdvisor();
    });
    noBusinessLabel.append(noBusiness, createElement("span", "", "Todavía no tiene nombre"));
    form.append(noBusinessLabel);

    form.append(createContactField("¿Querés contarnos algo más?", "comment", contact.comment, {
        multiline: true,
        placeholder: "Por ejemplo: qué hacés, qué te gustaría mostrar o alguna idea que ya tengas."
    }));

    const marketingConsentLabel = createElement("label", "contact-checkbox contact-marketing-consent");
    const marketingConsent = document.createElement("input");
    marketingConsent.type = "checkbox";
    marketingConsent.checked = contact.marketingEmailConsent;
    marketingConsent.addEventListener("change", () => {
        state.contact.marketingEmailConsent = marketingConsent.checked;
    });
    marketingConsentLabel.append(marketingConsent, createElement("span", "", "Quiero recibir novedades, recursos y propuestas de NODO por email."));
    form.append(marketingConsentLabel);

    const validation = createElement("p", "contact-validation", state.contactMessage);
    validation.setAttribute("role", "status");
    validation.setAttribute("aria-live", "polite");
    form.append(validation);

    const actions = createElement("div", "contact-actions");
    const submitLabel = state.isSubmitting ? "Enviando…" : state.submitError ? "Reintentar" : "Enviar consulta";
    const submit = createButton(submitLabel, "button button-primary", () => {});
    submit.type = "submit";
    submit.disabled = state.isSubmitting;
    submit.setAttribute("aria-disabled", String(state.isSubmitting));
    const back = createButton("Volver a mi recomendación", "button button-text", () => {
        if (state.isSubmitting) return;
        state.screen = "result";
        state.contactMessage = "";
        state.submitError = false;
        renderAdvisor();
        resetAdvisorScroll();
    });
    if (state.submitError) {
        const fallback = document.createElement("a");
        fallback.className = "button button-secondary";
        fallback.href = projectMessage(plan);
        fallback.target = "_blank";
        fallback.rel = "noopener noreferrer";
        fallback.textContent = "Escribirnos por WhatsApp ↗";
        actions.append(submit, fallback, back);
    } else {
        actions.append(submit, back);
    }
    form.append(actions);
    form.addEventListener("submit", event => {
        event.preventDefault();
        submitContactLead(key, plan, form.elements.website?.value || "");
    });
    view.append(form);
    return view;
}

function renderSuccess() {
    const plan = plans[getRecommendation(state.answers)];
    const view = createElement("div", "advisor-view advisor-success");
    view.setAttribute("role", "status");
    view.setAttribute("aria-live", "polite");
    view.append(createElement("p", "result-eyebrow", "CONSULTA RECIBIDA"));
    view.append(createElement("h3", "contact-title", "Listo, recibimos tu consulta."));
    view.append(createElement("p", "success-copy", "Perfecto. Ya tenemos la información inicial de tu proyecto. Vamos a revisarla y nos vamos a contactar con vos usando los datos que nos dejaste."));
    if (state.emailConfirmationSent === true) {
        view.append(createElement("p", "success-email", "Te enviamos una confirmación a " + state.contact.email.trim().toLowerCase() + "."));
        view.append(createElement("p", "success-copy", "Si no la encontrás, revisá también Spam o Promociones."));
    } else if (state.emailConfirmationSent === false) {
        view.append(createElement("p", "success-email", "Tu consulta quedó registrada correctamente. No pudimos enviar el correo de confirmación en este momento, pero no necesitás completar nada de nuevo. Vamos a contactarte con los datos que nos dejaste."));
    }

    const process = createElement("ol", "success-process");
    [
        ["✓", "Información recibida", "is-complete"],
        ["●", "Revisión de NODO", "is-current"],
        ["○", "Propuesta", ""],
        ["○", "Inicio", ""]
    ].forEach(([mark, label, stateClass]) => {
        const item = createElement("li", "success-step " + stateClass);
        const icon = createElement("span", "success-step-mark", mark);
        icon.setAttribute("aria-hidden", "true");
        item.append(icon, createElement("span", "", label));
        process.append(item);
    });
    view.append(process);

    const actions = createElement("div", "success-actions");
    const talk = document.createElement("a");
    talk.className = "button button-secondary";
    talk.href = projectMessage(plan);
    talk.target = "_blank";
    talk.rel = "noopener noreferrer";
    talk.textContent = "También quiero escribirles por WhatsApp ↗";
    const reset = createButton("Empezar de nuevo", "button button-text", () => {
        state.screen = "start";
        state.currentStep = 0;
        state.answers = {};
        state.message = "";
        state.contact = { name: "", email: "", whatsapp: "", business: "", noBusinessName: false, comment: "", marketingEmailConsent: false };
        state.contactMessage = "";
        state.isSubmitting = false;
        state.submitError = false;
        state.emailConfirmationSent = null;
        renderAdvisor();
        resetAdvisorScroll();
    });
    actions.append(talk, reset);
    view.append(actions);
    return view;
}

function renderAdvisor() {
    advisor.replaceChildren();
    const card = advisor.closest(".advisor-card");
    card?.classList.toggle("advisor-card-expanded", state.screen === "result" || state.screen === "contact" || state.screen === "success");
    if (state.screen === "start") advisor.append(renderStart());
    else if (state.screen === "result") advisor.append(renderResult());
    else if (state.screen === "contact") advisor.append(renderContact());
    else if (state.screen === "success") advisor.append(renderSuccess());
    else advisor.append(renderStep());
}

function setupPageChrome() {
    const header = document.querySelector(".site-header");
    const start = document.getElementById("inicio");
    const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollToStart = () => start?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    const spinMark = mark => {
        if (prefersReducedMotion()) return;
        mark.classList.remove("is-spinning");
        void mark.offsetWidth;
        mark.classList.add("is-spinning");
    };
    const updateHeader = () => header?.classList.toggle("header--scrolled", window.scrollY > 20);

    document.querySelectorAll("[data-scroll-top]").forEach(link => link.addEventListener("click", event => {
        event.preventDefault();
        const mark = event.target.closest(".brand-mark");
        if (mark) spinMark(mark);
        scrollToStart();
    }));
    document.querySelectorAll(".brand-mark").forEach(mark => mark.addEventListener("animationend", () => mark.classList.remove("is-spinning")));
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    setupMobileNavigation();
}

function setupMobileNavigation() {
    const menu = document.getElementById("mobile-navigation");
    const toggle = document.getElementById("mobile-menu-toggle");
    const panel = menu?.querySelector(".mobile-navigation-panel");
    if (!menu || !toggle || !panel) return;

    const focusable = () => [...panel.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")]
        .filter(element => !element.hidden && element.getClientRects().length > 0);
    const closeMenu = (restoreFocus = true) => {
        if (menu.hidden) return;
        menu.hidden = true;
        menu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("mobile-navigation-open");
        if (restoreFocus) toggle.focus({ preventScroll: true });
    };
    const openMenu = () => {
        menu.hidden = false;
        menu.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("mobile-navigation-open");
        window.requestAnimationFrame(() => focusable()[0]?.focus({ preventScroll: true }));
    };

    toggle.addEventListener("click", () => menu.hidden ? openMenu() : closeMenu());
    menu.querySelectorAll("[data-mobile-menu-close]").forEach(control => control.addEventListener("click", () => closeMenu()));
    menu.querySelectorAll(".mobile-navigation-links a").forEach(link => link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        closeMenu(false);
        window.history.pushState(null, "", link.hash);
        target.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }));
    menu.querySelector(".mobile-navigation-help")?.addEventListener("click", () => closeMenu(false));
    document.addEventListener("keydown", event => {
        if (menu.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
            return;
        }
        if (event.key !== "Tab") return;
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    const desktopMedia = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = event => {
        if (event.matches) closeMenu(false);
    };
    desktopMedia.addEventListener?.("change", closeOnDesktop);
}

function setupProjectShowcase() {
    const showcase = document.getElementById("project-showcase");
    const viewport = showcase?.querySelector("[data-showcase-viewport]");
    const track = showcase?.querySelector("[data-showcase-track]");
    const dots = showcase?.querySelector("[data-showcase-dots]");
    const tabs = showcase?.querySelector("[data-showcase-tabs]");
    const previous = showcase?.querySelector("[data-showcase-prev]");
    const next = showcase?.querySelector("[data-showcase-next]");
    const status = showcase?.querySelector("[data-showcase-status]");
    if (!showcase || !viewport || !track || !dots || !tabs || !previous || !next || !status || !showcaseProjects.length) return;

    const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const makeProjectCard = project => {
        const card = createElement("article", "showcase-card" + (project.pending ? " showcase-card-pending" : ""));
        const titleId = "showcase-title-" + project.id;
        card.id = "showcase-project-" + project.id;
        card.setAttribute("aria-labelledby", titleId);

        const preview = createElement("figure", "showcase-preview");
        const showImageFallback = () => {
            preview.classList.add("showcase-preview-placeholder");
            preview.setAttribute("role", "img");
            preview.setAttribute("aria-label", "Captura pública no disponible para " + project.name);
            preview.replaceChildren(
                createElement("span", "showcase-placeholder-name", project.name),
                createElement("span", "showcase-placeholder-note", "Captura pendiente")
            );
        };
        if (project.image) {
            const image = document.createElement("img");
            image.src = project.image;
            image.alt = project.imageAlt;
            image.width = project.imageWidth || 1440;
            image.height = project.imageHeight || 900;
            image.loading = "lazy";
            image.decoding = "async";
            image.addEventListener("error", showImageFallback, { once: true });
            preview.append(image);
        } else {
            showImageFallback();
        }

        const content = createElement("div", "showcase-content");
        if (project.eyebrow) content.append(createElement("p", "eyebrow", project.eyebrow));
        if (project.type) content.append(createElement("p", "showcase-type", project.type));
        const title = createElement("h3", "", project.name);
        title.id = titleId;
        content.append(title);
        if (project.subtitle) content.append(createElement("p", "showcase-subtitle", project.subtitle));
        if (project.status) content.append(createElement("p", "showcase-status-badge", project.status));
        if (project.pending) content.append(createElement("p", "showcase-pending-copy", "Información pública pendiente de incorporar."));
        if (project.description) content.append(createElement("p", "showcase-description", project.description));
        if (project.tags?.length) {
            const tags = createElement("ul", "showcase-tags");
            tags.setAttribute("aria-label", "Características de " + project.name);
            project.tags.forEach(tag => tags.append(createElement("li", "", tag)));
            content.append(tags);
        }
        if (project.url) {
            const link = createElement("a", "text-link showcase-link", project.linkLabel || "Ver proyecto");
            link.href = project.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            const arrow = createElement("span", "", "→");
            arrow.setAttribute("aria-hidden", "true");
            link.append(" ", arrow);
            content.append(link);
        }
        card.append(preview, content);
        return card;
    };

    const cards = showcaseProjects.map(makeProjectCard);
    track.replaceChildren(...cards);

    let activeIndex = 0;
    const selectorButtons = [];
    const makeSelector = (project, index, className, label) => {
        const button = createButton(className === "showcase-dot" ? "" : project.name, className, () => moveTo(index));
        button.setAttribute("aria-label", label + project.name);
        button.dataset.showcaseIndex = String(index);
        selectorButtons.push(button);
        return button;
    };
    showcaseProjects.forEach((project, index) => {
        dots.append(makeSelector(project, index, "showcase-dot", "Ver proyecto: "));
        tabs.append(makeSelector(project, index, "showcase-tab", "Ver proyecto: "));
    });

    const updateActive = index => {
        activeIndex = index;
        cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
        selectorButtons.forEach(button => {
            const selected = Number(button.dataset.showcaseIndex) === index;
            button.classList.toggle("is-active", selected);
            button.setAttribute("aria-current", selected ? "true" : "false");
        });
        status.textContent = "Mostrando " + showcaseProjects[index].name + ". Proyecto " + (index + 1) + " de " + showcaseProjects.length + ".";
    };
    const moveTo = index => {
        const targetIndex = (index + cards.length) % cards.length;
        viewport.scrollTo({ left: cards[targetIndex].offsetLeft, behavior: reducedMotion() ? "auto" : "smooth" });
        updateActive(targetIndex);
    };
    previous.addEventListener("click", () => moveTo(activeIndex - 1));
    next.addEventListener("click", () => moveTo(activeIndex + 1));
    viewport.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveTo(activeIndex - 1);
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveTo(activeIndex + 1);
        }
    });

    let scrollFrame = 0;
    viewport.addEventListener("scroll", () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            scrollFrame = 0;
            const center = viewport.scrollLeft + viewport.clientWidth / 2;
            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(cardCenter - center);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            updateActive(closestIndex);
        });
    }, { passive: true });
    updateActive(0);
}

function setupFaqAccordion() {
    const items = [...document.querySelectorAll(".faq-list details")];
    items.forEach(item => item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach(other => {
            if (other !== item && other.open) other.open = false;
        });
    }));
}

function setupStaticWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-context]").forEach(link => {
        const lines = staticWhatsAppMessages[link.dataset.whatsappContext];
        if (lines) link.href = whatsappUrl(lines);
    });
}

function setupAdvisorScrollLinks() {
    document.querySelectorAll("[data-scroll-advisor]").forEach(link => link.addEventListener("click", event => {
        event.preventDefault();
        scrollToAdvisor();
    }));
}

function setupTeamModals() {
    const triggers = [...document.querySelectorAll("[data-team-modal]")];
    const modals = [...document.querySelectorAll(".team-modal")];
    const photoViewer = document.getElementById("team-photo-viewer");
    const photoViewerImage = document.getElementById("team-photo-viewer-image");
    let activeModal = null;
    let triggerBeforeOpen = null;
    let photoViewerTrigger = null;
    let photoViewerParentDialog = null;
    let photoRequestId = 0;

    const isPhotoViewerOpen = () => Boolean(photoViewer && !photoViewer.hidden);

    const getFocusable = container => [...container.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex=\"-1\"])")]
        .filter(element => !element.hidden);

    const trapFocus = (container, event) => {
        const focusable = getFocusable(container);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const closePhotoViewer = (restoreFocus = true) => {
        if (!isPhotoViewerOpen()) return;
        photoRequestId += 1;
        photoViewer.hidden = true;
        document.body.classList.remove("team-photo-viewer-open");
        if (photoViewerImage) {
            photoViewerImage.removeAttribute("src");
            photoViewerImage.alt = "";
        }
        if (photoViewerParentDialog) {
            photoViewerParentDialog.removeAttribute("aria-hidden");
            photoViewerParentDialog.setAttribute("aria-modal", "true");
            photoViewerParentDialog.inert = false;
        }
        const focusTarget = photoViewerTrigger;
        photoViewerTrigger = null;
        photoViewerParentDialog = null;
        if (restoreFocus) focusTarget?.focus();
    };

    const openPhotoViewer = trigger => {
        const thumbnail = trigger.querySelector(".team-modal-photo");
        if (!photoViewer || !photoViewerImage || !thumbnail) return;

        const thumbnailSrc = thumbnail.currentSrc || thumbnail.src;
        if (!thumbnailSrc) return;

        const fullSrc = trigger.dataset.teamPhotoFull || thumbnailSrc;
        const requestId = ++photoRequestId;
        photoViewerTrigger = trigger;
        photoViewerParentDialog = trigger.closest(".team-modal-dialog");
        if (photoViewerParentDialog) {
            photoViewerParentDialog.setAttribute("aria-hidden", "true");
            photoViewerParentDialog.setAttribute("aria-modal", "false");
            photoViewerParentDialog.inert = true;
        }
        photoViewerImage.alt = thumbnail.alt;
        photoViewerImage.src = thumbnailSrc;
        photoViewer.hidden = false;
        document.body.classList.add("team-photo-viewer-open");
        photoViewer.querySelector("button[data-team-photo-viewer-close]")?.focus();

        if (fullSrc === thumbnailSrc) return;
        const fullImage = new Image();
        fullImage.addEventListener("load", () => {
            if (requestId === photoRequestId && isPhotoViewerOpen()) photoViewerImage.src = fullSrc;
        }, { once: true });
        fullImage.addEventListener("error", () => {
            if (requestId === photoRequestId && isPhotoViewerOpen()) photoViewerImage.src = thumbnailSrc;
        }, { once: true });
        fullImage.src = fullSrc;
    };

    const closeModal = (modal, restoreFocus = true) => {
        if (!modal || modal.hidden) return;
        if (isPhotoViewerOpen()) closePhotoViewer(false);
        modal.hidden = true;
        document.body.classList.remove("team-modal-open");
        if (activeModal === modal) activeModal = null;
        const focusTarget = triggerBeforeOpen;
        triggerBeforeOpen = null;
        if (restoreFocus) focusTarget?.focus();
    };

    const openModal = (modal, trigger) => {
        if (!modal) return;
        if (activeModal && activeModal !== modal) closeModal(activeModal, false);
        activeModal = modal;
        triggerBeforeOpen = trigger;
        modal.hidden = false;
        document.body.classList.add("team-modal-open");
        modal.querySelector("button[data-team-modal-close]")?.focus();
    };

    triggers.forEach(trigger => trigger.addEventListener("click", () => {
        openModal(document.getElementById(trigger.dataset.teamModal), trigger);
    }));

    modals.forEach(modal => {
        modal.querySelectorAll("[data-team-modal-close]").forEach(control => control.addEventListener("click", () => closeModal(modal)));
        modal.querySelectorAll(".team-modal-photo").forEach(photo => {
            const button = photo.closest(".team-photo-button");
            const showPhoto = () => button?.classList.add("has-photo");
            if (photo.complete && photo.naturalWidth > 0) showPhoto();
            else photo.addEventListener("load", showPhoto, { once: true });
        });
        modal.querySelectorAll("[data-team-photo-viewer]").forEach(button => button.addEventListener("click", () => openPhotoViewer(button)));
    });

    photoViewer?.querySelectorAll("[data-team-photo-viewer-close]").forEach(control => control.addEventListener("click", () => closePhotoViewer()));

    document.addEventListener("keydown", event => {
        const focusContainer = isPhotoViewerOpen() ? photoViewer : activeModal;
        if (!focusContainer) return;
        if (event.key === "Escape") {
            event.preventDefault();
            if (isPhotoViewerOpen()) closePhotoViewer();
            else closeModal(activeModal);
            return;
        }
        if (event.key !== "Tab") return;
        trapFocus(focusContainer, event);
    });
}

const introStorageKey = "nodo_intro_seen";

function setupNodoIntro() {
    const intro = document.getElementById("nodo-intro");
    if (!intro) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let hasSeenIntro = false;
    try {
        hasSeenIntro = window.sessionStorage.getItem(introStorageKey) === "true";
    } catch {
        // La intro sigue siendo opcional si el navegador bloquea sessionStorage.
    }

    if (hasSeenIntro || reduceMotion) {
        intro.remove();
        return;
    }

    try {
        window.sessionStorage.setItem(introStorageKey, "true");
    } catch {
        // Si no se puede persistir, la página sigue siendo usable.
    }

    document.documentElement.classList.add("nodo-intro-active");
    window.setTimeout(() => {
        document.documentElement.classList.remove("nodo-intro-active");
        intro.remove();
    }, 1650);
}

const themeStorageKey = "nodo_web_theme";

function preferredTheme() {
    try {
        const savedTheme = window.localStorage.getItem(themeStorageKey);
        if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    } catch {
        // La página sigue funcionando aunque el navegador bloquee localStorage.
    }

    return "light";
}

function applyTheme(theme, persist = false) {
    const nextTheme = theme === "light" ? "light" : "dark";
    const toggle = document.getElementById("theme-toggle");
    document.documentElement.dataset.theme = nextTheme;

    if (toggle) {
        const isLight = nextTheme === "light";
        toggle.setAttribute("aria-pressed", String(isLight));
        toggle.setAttribute("aria-label", isLight ? "Activar modo oscuro" : "Activar modo claro");
        toggle.title = isLight ? "Activar modo oscuro" : "Activar modo claro";
        toggle.querySelector(".theme-toggle-icon").textContent = isLight ? "☾" : "☀";
    }

    if (persist) {
        try {
            window.localStorage.setItem(themeStorageKey, nextTheme);
        } catch {
            // La preferencia visual es opcional si el navegador bloquea almacenamiento.
        }
    }
}

function setupThemeToggle() {
    applyTheme(preferredTheme());
    const toggle = document.getElementById("theme-toggle");
    toggle?.addEventListener("click", () => {
        applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
    });
}

window.NodoWebAdvisor = { plans, getRecommendation };
setupThemeToggle();
setupNodoIntro();
renderAdvisor();
setupPageChrome();
setupFaqAccordion();
setupStaticWhatsAppLinks();
setupAdvisorScrollLinks();
setupProjectShowcase();
setupTeamModals();
