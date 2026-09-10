const plans = {
    launch: {
        name: "NODO Lanzamiento",
        price: "Desde $65.000 ARS",
        delivery: "Entrega estimada: 2 a 5 días hábiles.",
        description: "Una página simple y clara para presentar tu negocio, mostrar lo importante y facilitar que te contacten.",
        benefits: [
            "Se ve bien en celular y computadora.",
            "La información importante queda ordenada.",
            "Botones para que puedan escribirte directo.",
            "Preparamos la página para que Google pueda entenderla mejor.",
            "Incluye una instancia para revisar detalles."
        ],
        includes: [
            "Una página con lo esencial de tu negocio.",
            "Secciones para contar qué hacés, mostrar servicios y dejar tus datos.",
            "Botones que abren una conversación directa con vos.",
            "Una estructura clara para que Google pueda interpretar mejor tu página.",
            "Una instancia para revisar detalles antes de publicar."
        ]
    },
    positioning: {
        name: "NODO Posicionamiento",
        price: "Desde $95.000 ARS",
        delivery: "Entrega estimada: 5 a 10 días hábiles.",
        description: "Una web más completa para presentar mejor tu negocio, organizar la información y tener una presencia preparada para crecer.",
        benefits: [
            "Se ve bien en celular y computadora.",
            "Información y servicios organizados con claridad.",
            "Botones para que puedan escribirte directo.",
            "Preparamos la web para que Google pueda entenderla mejor.",
            "Incluye instancias para revisar detalles."
        ],
        includes: [
            "Una estructura más completa para contar sobre tu negocio.",
            "Espacio para servicios, trabajos, ubicación, precios o promociones.",
            "Formas claras para que una persona pueda escribirte o dejarte un mensaje.",
            "Una organización preparada para sumar información con el tiempo.",
            "Instancias para revisar la propuesta juntos."
        ]
    },
    conversion: {
        name: "NODO Conversión",
        price: "Desde $150.000 ARS",
        delivery: "Entrega estimada: 7 a 15 días hábiles.",
        description: "Una web pensada para mostrar productos o servicios y hacer más fácil que una persona avance hacia una compra, pedido o consulta.",
        note: "Tiendas con pagos, stock, envíos o funciones especiales pueden requerir una propuesta personalizada.",
        benefits: [
            "Productos o servicios fáciles de recorrer.",
            "Más de una forma clara de avanzar a un pedido o consulta.",
            "Se ve bien en celular y computadora.",
            "La información queda ordenada para facilitar decisiones.",
            "Preparamos la web para que Google pueda entenderla mejor."
        ],
        includes: [
            "Una propuesta pensada para mostrar productos, servicios o un catálogo.",
            "Recorridos claros para que una persona pueda pedir, consultar o comprar.",
            "Botones de contacto ubicados donde hacen falta.",
            "Espacio para preguntas frecuentes y la información que ayuda a decidir.",
            "Una base ordenada para seguir mejorando."
        ]
    },
    custom: {
        name: "NODO Personalizado",
        price: "Presupuesto a medida",
        delivery: "Lo definimos según el proyecto.",
        description: "Tu idea necesita algo más específico. Primero entendemos el alcance y después te presentamos una propuesta.",
        benefits: [
            "Partimos de lo que necesitás resolver.",
            "Definimos juntos qué hace falta para empezar.",
            "Priorizamos lo importante antes de construir.",
            "La propuesta acompaña el alcance real de tu idea.",
            "Te explicamos cada decisión de forma clara."
        ],
        includes: [
            "Una conversación para entender el alcance de tu idea.",
            "Una propuesta clara antes de avanzar.",
            "Un recorrido pensado según las necesidades particulares del proyecto.",
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
            { id: "messages", label: "Que más personas me escriban", text: "Quiero recibir consultas por WhatsApp, formulario o redes." },
            { id: "services", label: "Mostrar mis servicios", text: "Quiero explicar de forma simple qué ofrezco." },
            { id: "bookings", label: "Recibir reservas o turnos", text: "Quiero que puedan elegir un día u horario." },
            { id: "products", label: "Mostrar productos", text: "Quiero que puedan ver lo que vendo." },
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
            { id: "starting", label: "Estoy empezando de cero", exclusive: true },
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

const state = {
    screen: "start",
    currentStep: 0,
    answers: {},
    message: ""
};

const advisor = document.getElementById("advisor");

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

function labelFor(stepId, optionId) {
    const step = advisorSteps.find(item => item.id === stepId);
    return step?.options.find(option => option.id === optionId)?.label || "";
}

function toggleOption(step, option) {
    const current = [...selectedFor(step)];
    const isSelected = current.includes(option.id);

    if (step.selection === "single") {
        state.answers[step.id] = isSelected ? [] : [option.id];
    } else if (option.exclusive) {
        state.answers[step.id] = isSelected ? [] : [option.id];
    } else {
        let next = current.filter(id => !step.options.find(item => item.id === id)?.exclusive);
        if (option.group) next = next.filter(id => step.options.find(item => item.id === id)?.group !== option.group);
        if (isSelected) {
            next = next.filter(id => id !== option.id);
        } else if (step.max && next.length >= step.max) {
            state.message = "Podés elegir hasta " + step.max + " opciones. Si querés, cambiá una de las que ya marcaste.";
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

function hasValidAnswer(step) {
    return selectedFor(step).length >= step.min;
}

function goNext() {
    const step = advisorSteps[state.currentStep];
    if (!hasValidAnswer(step)) {
        state.message = "Elegí al menos una opción para seguir.";
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
}

function getRecommendation(answers) {
    const goals = new Set(answers.goals || []);
    const today = new Set(answers.today || []);
    const content = new Set(answers.content || []);
    const start = (answers.start || [])[0];

    const customSignals = ["payments", "stock", "users", "system", "application", "automation", "special"].some(signal => goals.has(signal) || today.has(signal) || content.has(signal));
    if (customSignals) return "custom";
    if (start === "commerce" || goals.has("sell") || (goals.has("products") && content.has("products"))) return "conversion";
    if (start === "complete" || today.has("current-page") || today.has("old-page") || content.has("location") || content.has("promotions") || (goals.has("services") && content.size >= 3)) return "positioning";
    return "launch";
}

function getReasons(planKey) {
    const goals = new Set(state.answers.goals || []);
    const today = new Set(state.answers.today || []);
    const content = new Set(state.answers.content || []);
    const start = (state.answers.start || [])[0];
    const reasons = [];

    if (goals.has("messages")) reasons.push("Nos dijiste que querés facilitar que más personas te escriban.");
    if (goals.has("services")) reasons.push("También querés mostrar lo que ofrecés de una forma clara.");
    if (goals.has("products") || content.has("products")) reasons.push("Querés que las personas puedan recorrer productos con tranquilidad.");
    if (goals.has("sell") || start === "commerce") reasons.push("Buscás una página que acompañe pedidos, compras o consultas.");
    if (today.has("current-page") || today.has("old-page")) reasons.push("Nos contaste que ya tenés una página y querés mejorar lo que mostrás.");
    if (content.has("location") || content.has("promotions") || start === "complete") reasons.push("Necesitás más espacio para ordenar información importante de tu negocio.");
    if (start === "simple" || today.has("starting")) reasons.push("Querés empezar con una presencia clara y sin sumar cosas que hoy no necesitás.");

    const closing = {
        launch: "NODO Lanzamiento cubre ese primer paso con claridad.",
        positioning: "NODO Posicionamiento reúne esas necesidades sin sumar complejidad innecesaria.",
        conversion: "NODO Conversión ayuda a ordenar ese recorrido de compra, pedido o consulta.",
        custom: "Una propuesta personalizada nos permite definir primero qué necesita tu idea."
    };
    reasons.push(closing[planKey]);
    return reasons.slice(0, 3);
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

function renderStep() {
    const step = advisorSteps[state.currentStep];
    const view = createElement("div", "advisor-view");
    const meta = createElement("div", "advisor-meta");
    meta.setAttribute("aria-live", "polite");
    meta.append(createElement("span", "", "Paso " + (state.currentStep + 1) + " de " + advisorSteps.length));
    meta.append(createElement("span", "", "Tu ritmo"));
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
    step.options.forEach(option => {
        const choice = createButton("", "choice-card" + (selected.includes(option.id) ? " is-selected" : ""), () => toggleOption(step, option));
        choice.setAttribute("aria-pressed", String(selected.includes(option.id)));
        const label = createElement("strong", "", option.label);
        choice.append(label);
        if (option.text) choice.append(createElement("span", "", option.text));
        choices.append(choice);
    });
    view.append(choices);
    view.append(createElement("p", "advisor-message", state.message));

    const nav = createElement("div", "advisor-nav");
    const previous = createButton("Anterior", "button button-text", () => {
        state.message = "";
        if (state.currentStep === 0) state.screen = "start";
        else state.currentStep -= 1;
        renderAdvisor();
    });
    const next = createButton(state.currentStep === advisorSteps.length - 1 ? "Ver mi opción" : "Continuar", "button button-primary", goNext);
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

function renderResult() {
    const key = getRecommendation(state.answers);
    const plan = plans[key];
    const view = createElement("div", "advisor-view");
    view.setAttribute("aria-live", "polite");
    view.append(createElement("p", "result-eyebrow", "UNA OPCIÓN PARA VOS"));
    view.append(createElement("h3", "result-title", "Por lo que nos contaste, empezaríamos por:"));

    const card = createElement("article", "plan-result");
    card.append(createElement("h3", "", plan.name));
    card.append(createElement("p", "", plan.description));
    card.append(createElement("p", "plan-price", plan.price));
    card.append(createElement("p", "plan-time", plan.delivery));
    if (plan.note) card.append(createElement("p", "plan-note", plan.note));
    const benefits = createElement("ul", "plan-facts");
    plan.benefits.slice(0, 5).forEach(item => benefits.append(createElement("li", "", item)));
    card.append(benefits);
    view.append(card);

    const details = createElement("div", "result-details");
    details.append(renderDetails("¿Por qué te recomendamos esta opción?", getReasons(key)));
    details.append(renderDetails("Ver qué incluye", plan.includes));
    details.append(renderDetails("Sobre la entrega estimada", "Los tiempos pueden variar según el alcance del proyecto y la disponibilidad de textos, imágenes y datos necesarios."));
    view.append(details);

    const actions = createElement("div", "result-actions");
    const proceed = createElement("a", "button button-primary", "Quiero avanzar →");
    proceed.href = "index.html?recommended_plan=" + encodeURIComponent(plan.name) + "#brief";
    const talk = createElement("a", "button button-secondary", "Quiero hablarlo primero ↗");
    talk.href = "https://wa.me/5491130700900";
    talk.target = "_blank";
    talk.rel = "noopener noreferrer";
    const reset = createButton("Empezar de nuevo", "button button-text", () => {
        state.screen = "start";
        state.currentStep = 0;
        state.answers = {};
        state.message = "";
        renderAdvisor();
    });
    actions.append(proceed, talk, reset);
    view.append(actions);
    return view;
}

function renderAdvisor() {
    advisor.replaceChildren();
    if (state.screen === "start") advisor.append(renderStart());
    else if (state.screen === "result") advisor.append(renderResult());
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
}

window.NodoWebAdvisor = { plans, getRecommendation };
renderAdvisor();
setupPageChrome();
