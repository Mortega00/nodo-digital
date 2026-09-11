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
            { id: "messages", label: "Que más personas me escriban", text: "Quiero recibir consultas por WhatsApp o formulario." },
            { id: "services", label: "Mostrar mis servicios", text: "Quiero que puedan ver fácilmente qué ofrezco." },
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

const state = {
    screen: "start",
    currentStep: 0,
    answers: {},
    message: "",
    contact: {
        name: "",
        whatsapp: "",
        business: "",
        noBusinessName: false,
        comment: ""
    },
    contactMessage: ""
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

function getRecommendation(answers) {
    const goals = new Set(answers.goals || []);
    const today = new Set(answers.today || []);
    const content = new Set(answers.content || []);
    const start = (answers.start || [])[0];
    const commerceNeed = answers.commerceNeeds || "";

    const customSignals = ["payments", "stock", "users", "special"];
    const commercialNeeds = ["commerce-basic", "commerce-unsure"];
    const relevantContent = ["business-info", "services", "photos", "prices", "location", "products", "promotions"];
    const relevantContentCount = relevantContent.filter(item => content.has(item)).length;
    const hasCommercialIntent = goals.has("sell") || (start === "commerce" && commercialNeeds.includes(commerceNeed));
    const hasCatalog = goals.has("products") && content.has("products");

    if (customSignals.includes(commerceNeed)) return "custom";
    if (hasCommercialIntent) return "conversion";
    if (goals.has("bookings") || hasCatalog || start === "complete" || today.has("current-page") || today.has("old-page") || content.has("location") || content.has("promotions") || relevantContentCount >= 4) return "positioning";
    return "launch";
}

function getReasons(planKey) {
    const goals = new Set(state.answers.goals || []);
    const today = new Set(state.answers.today || []);
    const content = new Set(state.answers.content || []);
    const start = (state.answers.start || [])[0];
    const commerceNeed = state.answers.commerceNeeds || "";
    const relevantContent = ["business-info", "services", "photos", "prices", "location", "products", "promotions"];
    const relevantContentCount = relevantContent.filter(item => content.has(item)).length;
    const hasCommercialIntent = goals.has("sell") || (start === "commerce" && ["commerce-basic", "commerce-unsure"].includes(commerceNeed));
    const customReasons = {
        payments: "Necesitás que las personas puedan pagar desde la página.",
        stock: "También necesitás controlar la disponibilidad de productos.",
        users: "Tu idea necesita que cada cliente pueda ingresar con sus propios datos.",
        special: "Nos contaste que necesitás funciones particulares."
    };

    if (planKey === "custom") {
        return [customReasons[commerceNeed] || "Tu idea necesita funciones más específicas antes de definir una propuesta.", "Por eso primero necesitamos definir el alcance antes de presupuestar."];
    }

    const reasons = [];

    if (goals.has("bookings")) reasons.push("Querés que las personas puedan reservar o elegir un turno.");
    if (goals.has("messages") || today.has("whatsapp")) reasons.push("Nos dijiste que querés facilitar que las personas te contacten.");
    if (goals.has("services") || content.has("services")) reasons.push("También querés mostrar tus servicios de una forma clara.");
    if (goals.has("products") || content.has("products")) reasons.push("Querés mostrar tus productos de una forma clara y ordenada.");
    if (commerceNeed === "commerce-basic") reasons.push("Querés mostrar lo que vendés y facilitar que una persona haga un pedido o consulta.");
    else if (hasCommercialIntent) reasons.push("Buscás una página que acompañe pedidos, compras o consultas.");
    if (today.has("current-page") || today.has("old-page")) reasons.push("Nos contaste que ya tenés una página y querés mejorar lo que mostrás.");
    if (relevantContentCount >= 4 || content.has("location") || content.has("promotions") || start === "complete") reasons.push("Necesitás más espacio para ordenar información importante de tu negocio.");
    if (start === "simple" || today.has("starting")) reasons.push("Querés empezar con una presencia clara y sin sumar cosas que hoy no necesitás.");
    if (!reasons.length && goals.has("professional")) reasons.push("Querés que tu negocio se vea más profesional y sea fácil de entender.");
    if (!reasons.length && start === "recommend") reasons.push("Preferís recibir una guía clara para elegir por dónde empezar.");

    const closing = {
        launch: "Por eso una presencia simple y clara tiene sentido para empezar.",
        positioning: "Por eso una web más completa tiene más sentido que una página básica.",
        conversion: "Por eso conviene priorizar un recorrido claro hacia consultas, pedidos o compras.",
        custom: "Por eso primero necesitamos definir el alcance antes de presupuestar."
    };
    return [...reasons.slice(0, 2), closing[planKey]];
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

    if (planKey === "custom") return "Tu necesidad requiere algo más específico. Primero entendemos bien el alcance y después te presentamos una propuesta.";
    if (planKey === "conversion" && commerceNeed === "commerce-basic") return "Querés mostrar lo que vendés y facilitar que una persona haga un pedido o consulta.";
    if (planKey === "conversion" && goals.has("sell")) return "Querés hacer más fácil que una persona avance hacia una compra o pedido.";
    if (planKey === "conversion") return "Querés explorar una forma clara de recibir pedidos o consultas desde tu página.";

    if (planKey === "positioning") {
        const needs = [];
        if (goals.has("bookings")) needs.push("recibir reservas o turnos");
        if (goals.has("services") || content.has("services")) needs.push("mostrar mejor tus servicios");
        if (goals.has("messages") || today.has("whatsapp")) needs.push("facilitar que te contacten");
        if (goals.has("products") && content.has("products")) needs.push("mostrar tus productos de forma clara y darles más espacio dentro de tu web");
        if (today.has("current-page") || today.has("old-page") || start === "complete") needs.push("ordenar la información de tu negocio");
        if (relevantContentCount >= 4 || content.has("location") || content.has("promotions")) needs.push("dar lugar a información importante");
        return "Querés " + joinNeeds(needs) + ". Esta opción cubre eso sin sumar cosas que hoy no necesitás.";
    }

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
            "Hola NODO! Completé el asesor y mi proyecto quedó como NODO Personalizado.",
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
    });
    field.append(label, control);
    return field;
}

function validateContact() {
    const contact = state.contact;
    const missing = [];
    if (!contact.name.trim()) missing.push("tu nombre");
    if (!contact.whatsapp.trim()) missing.push("tu WhatsApp");
    if (!contact.noBusinessName && !contact.business.trim()) missing.push("el nombre de tu negocio, marca o idea");
    if (!missing.length) return true;
    state.contactMessage = "Completá " + missing.join(", ") + " para enviar la consulta.";
    return false;
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
    card.append(createElement("p", "plan-price-context", isCustomPlan ? "Valor definido según el alcance" : "Valor estimado inicial"));
    card.append(createElement("p", "plan-price-note", isCustomPlan ? "Primero definimos juntos el contenido y las funciones necesarias." : "El valor final se confirma cuando definimos juntos el contenido y las funciones necesarias."));
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
        state.contact = { name: "", whatsapp: "", business: "", noBusinessName: false, comment: "" };
        state.contactMessage = "";
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
    form.append(createContactField("Nombre *", "name", contact.name, { required: true, autocomplete: "name" }));
    form.append(createContactField("WhatsApp *", "whatsapp", contact.whatsapp, { required: true, type: "tel", autocomplete: "tel" }));
    form.append(createContactField(contact.noBusinessName ? "Nombre de tu negocio, marca o idea" : "Nombre de tu negocio, marca o idea *", "business", contact.business, { required: !contact.noBusinessName, disabled: contact.noBusinessName }));

    const noBusinessLabel = createElement("label", "contact-checkbox");
    const noBusiness = document.createElement("input");
    noBusiness.type = "checkbox";
    noBusiness.checked = contact.noBusinessName;
    noBusiness.addEventListener("change", () => {
        state.contact.noBusinessName = noBusiness.checked;
        state.contactMessage = "";
        renderAdvisor();
    });
    noBusinessLabel.append(noBusiness, createElement("span", "", "Todavía no tiene nombre"));
    form.append(noBusinessLabel);

    form.append(createContactField("¿Querés contarnos algo más?", "comment", contact.comment, {
        multiline: true,
        placeholder: "Por ejemplo: qué hacés, qué te gustaría mostrar o alguna idea que ya tengas."
    }));

    const validation = createElement("p", "contact-validation", state.contactMessage);
    validation.setAttribute("role", "status");
    form.append(validation);

    const actions = createElement("div", "contact-actions");
    const submit = createButton("Enviar consulta", "button button-primary", () => {});
    submit.type = "submit";
    const back = createButton("Volver a mi recomendación", "button button-text", () => {
        state.screen = "result";
        state.contactMessage = "";
        renderAdvisor();
        resetAdvisorScroll();
    });
    actions.append(submit, back);
    form.append(actions);
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validateContact()) {
            renderAdvisor();
            return;
        }
        window.open(projectMessage(plan), "_blank", "noopener,noreferrer");
    });
    view.append(form);
    return view;
}

function renderAdvisor() {
    advisor.replaceChildren();
    const card = advisor.closest(".advisor-card");
    card?.classList.toggle("advisor-card-expanded", state.screen === "result" || state.screen === "contact");
    if (state.screen === "start") advisor.append(renderStart());
    else if (state.screen === "result") advisor.append(renderResult());
    else if (state.screen === "contact") advisor.append(renderContact());
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
setupTeamModals();
