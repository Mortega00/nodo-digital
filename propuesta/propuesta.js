const SUPABASE_URL = "https://pmrrudtwsgqyncstfdrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XhjenDP8bMVfuEUl02h6XA_ZkJLCnn_";
const NODO_WHATSAPP = "5491130700900";
const TOKEN_PATTERN = /^[0-9a-f]{64}$/i;

const app = document.getElementById("proposal-app");
const page = document.getElementById("proposal-page");
const acceptModal = document.getElementById("accept-modal");
const acceptCheck = document.getElementById("accept-check");
const acceptConfirm = document.getElementById("accept-confirm");
const acceptCancel = document.getElementById("accept-cancel");
const acceptMessage = document.getElementById("accept-modal-message");

const state = {
    screen: "loading",
    token: "",
    proposalData: null,
    accepting: false,
    acceptTrigger: null
};

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
}

function createButton(label, className, handler) {
    const button = createElement("button", className, label);
    button.type = "button";
    button.addEventListener("click", handler);
    return button;
}

function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
    return typeof value === "string" ? value.trim() : "";
}

function list(value) {
    return Array.isArray(value)
        ? value.filter(item => typeof item === "string" && item.trim()).map(item => item.trim())
        : [];
}

function formatDate(value) {
    if (!value) return "";
    const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(value + "T12:00:00")
        : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatMoney(amount, currency) {
    if (amount === null || amount === undefined || amount === "") return "";
    const number = Number(amount);
    if (!Number.isFinite(number)) return "";
    const formatted = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
        maximumFractionDigits: 2
    }).format(number);
    return currency === "USD" ? "USD " + formatted : "$ " + formatted + " ARS";
}

function whatsappUrl(businessName) {
    const business = text(businessName) || "tu negocio";
    const message = "Hola Maxi, estoy viendo la propuesta de NODO para " + business + " y tengo una consulta.";
    return "https://wa.me/" + NODO_WHATSAPP + "?text=" + encodeURIComponent(message);
}

function createWhatsAppLink(businessName, label = "Tengo una consulta") {
    const link = document.createElement("a");
    link.className = "proposal-button proposal-button-secondary";
    link.href = whatsappUrl(businessName);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label + " ↗";
    return link;
}

function render() {
    app.replaceChildren();
    if (state.screen === "loading") app.append(renderLoading());
    else if (state.screen === "proposal") app.append(renderProposal());
    else if (state.screen === "replaced") app.append(renderState({
        mark: "↺",
        title: "Esta propuesta fue actualizada.",
        copy: "Existe una versión más reciente. Contactanos para acceder a la propuesta vigente.",
        businessName: ""
    }));
    else if (state.screen === "technical-error") app.append(renderState({
        mark: "!",
        title: "No pudimos cargar la propuesta en este momento.",
        copy: "Puede ser un problema temporal. Probá nuevamente en unos instantes.",
        retry: true
    }));
    else app.append(renderState({
        mark: "—",
        title: "Esta propuesta no está disponible.",
        copy: "Si recibiste este enlace de NODO, podés escribirnos para que lo revisemos.",
        businessName: ""
    }));
}

function renderLoading() {
    const shell = createElement("div", "proposal-shell");
    const stateCard = createElement("section", "proposal-state");
    stateCard.setAttribute("aria-busy", "true");
    stateCard.append(createElement("div", "state-mark", "·"));
    stateCard.append(createElement("h1", "", "Estamos preparando tu propuesta…"));
    stateCard.append(createElement("p", "", "Un momento, por favor."));
    shell.append(stateCard);
    return shell;
}

function renderState({ mark, title, copy, retry = false, businessName = "" }) {
    const shell = createElement("div", "proposal-shell");
    const stateCard = createElement("section", "proposal-state");
    stateCard.append(createElement("div", "state-mark", mark));
    stateCard.append(createElement("h1", "", title));
    stateCard.append(createElement("p", "", copy));
    const actions = createElement("div", "proposal-actions");
    if (retry) actions.append(createButton("Reintentar", "proposal-button proposal-button-primary", loadProposal));
    else actions.append(createWhatsAppLink(businessName, "Hablar con NODO"));
    stateCard.append(actions);
    shell.append(stateCard);
    return shell;
}

function renderProposal() {
    const dto = state.proposalData;
    const proposal = dto.proposal;
    const status = dto.status;
    const expired = dto.is_expired === true;
    const businessName = text(proposal.business_name) || "tu negocio";
    const clientName = text(proposal.client_name) || "";

    const shell = createElement("div", "proposal-shell");
    const card = createElement("article", "proposal-card");

    const hero = createElement("section", "proposal-hero");
    const headingRow = createElement("div", "proposal-heading-row");
    headingRow.append(createElement("p", "proposal-eyebrow", "PROPUESTA NODO"));
    headingRow.append(createElement("span", "proposal-status proposal-status-" + status, status === "accepted" ? "Aceptada" : "Propuesta comercial"));
    hero.append(headingRow);
    hero.append(createElement("h1", "", "Propuesta para " + businessName));
    if (clientName) hero.append(createElement("p", "proposal-client", "Preparada para " + clientName));
    if (text(proposal.title)) hero.append(createElement("h2", "proposal-title", proposal.title));

    const dates = createElement("div", "proposal-dates");
    const sentAt = formatDate(proposal.sent_at);
    const validUntil = formatDate(proposal.valid_until);
    if (sentAt) dates.append(createDateItem("Enviada", sentAt));
    if (validUntil && !expired) dates.append(createDateItem("Válida hasta", validUntil));
    if (dates.childElementCount) hero.append(dates);
    if (expired) {
        const notice = createElement("div", "proposal-expired");
        notice.append(createElement("strong", "", "Esta propuesta venció."));
        notice.append(document.createTextNode("Escribinos y la actualizamos para vos."));
        hero.append(notice);
    }
    card.append(hero);

    const body = createElement("div", "proposal-body");
    appendTextSection(body, "OBJETIVO", "Objetivo", proposal.objective);
    appendTextSection(body, "SOLUCIÓN PROPUESTA", "Solución propuesta", proposal.proposed_solution);
    appendListSection(body, "ALCANCE", "Alcance", proposal.scope);
    appendListSection(body, "ENTREGABLES", "Entregables", proposal.deliverables);
    appendIncludedSections(body, proposal.included, proposal.excluded);
    appendTimeSection(body, proposal);
    appendInvestmentSection(body, proposal);
    appendPaymentSection(body, proposal);
    appendTextSection(body, "CONDICIONES", "Condiciones", proposal.conditions);
    appendTextSection(body, "PRÓXIMO PASO", "Próximo paso", proposal.next_step);
    card.append(body);

    card.append(renderFinalCta({ status, expired, proposal, businessName, clientName, acceptedAt: proposal.accepted_at }));
    shell.append(card);
    return shell;
}

function createDateItem(label, value) {
    const item = createElement("span", "");
    item.append(createElement("strong", "", label + ": "));
    item.append(document.createTextNode(value));
    return item;
}

function appendTextSection(parent, eyebrow, title, value) {
    const content = text(value);
    if (!content) return;
    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", eyebrow));
    section.append(createElement("h2", "", title));
    section.append(createElement("p", "", content));
    parent.append(section);
}

function appendListSection(parent, eyebrow, title, value) {
    const items = list(value);
    if (!items.length) return;
    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", eyebrow));
    section.append(createElement("h2", "", title));
    section.append(createTextList(items));
    parent.append(section);
}

function appendIncludedSections(parent, includedValue, excludedValue) {
    const included = list(includedValue);
    const excluded = list(excludedValue);
    if (!included.length && !excluded.length) return;

    const wrapper = createElement("div", "proposal-duo");
    if (!included.length || !excluded.length) wrapper.classList.add("proposal-duo-single");
    if (included.length) wrapper.append(createListSection("INCLUYE", "Incluye", included));
    if (excluded.length) wrapper.append(createListSection("NO INCLUYE", "No incluye", excluded));
    parent.append(wrapper);
}

function createListSection(eyebrow, title, items) {
    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", eyebrow));
    section.append(createElement("h2", "", title));
    section.append(createTextList(items));
    return section;
}

function createTextList(items) {
    const element = createElement("ul", "proposal-list");
    items.forEach(item => element.append(createElement("li", "", item)));
    return element;
}

function appendTimeSection(parent, proposal) {
    const timeline = text(proposal.estimated_timeline);
    const revisionCount = proposal.revision_count;
    const hasRevisionCount = revisionCount !== null && revisionCount !== undefined && revisionCount !== "";
    if (!timeline && !hasRevisionCount) return;

    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", "TIEMPOS Y REVISIONES"));
    section.append(createElement("h2", "", "Una hoja de ruta clara"));
    const facts = createElement("div", "proposal-facts");
    if (timeline) facts.append(createFact("Tiempo estimado", timeline));
    if (hasRevisionCount) facts.append(createFact("Revisiones incluidas", String(revisionCount)));
    section.append(facts);
    parent.append(section);
}

function appendInvestmentSection(parent, proposal) {
    const price = formatMoney(proposal.price_amount, proposal.currency);
    if (!price) return;
    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", "INVERSIÓN"));
    section.append(createElement("h2", "", "La inversión para avanzar"));
    const investment = createElement("div", "investment-card");
    investment.append(createElement("p", "investment-price", price));
    section.append(investment);
    parent.append(section);
}

function appendPaymentSection(parent, proposal) {
    const terms = text(proposal.payment_terms);
    const deposit = formatMoney(proposal.deposit_amount, proposal.currency);
    const balance = formatMoney(proposal.balance_amount, proposal.currency);
    if (!terms && !deposit && !balance) return;
    const section = createElement("section", "proposal-section");
    section.append(createElement("p", "section-eyebrow", "FORMA DE PAGO"));
    section.append(createElement("h2", "", "Cómo lo organizamos"));
    if (terms) section.append(createElement("p", "payment-copy", terms));
    const facts = createElement("div", "proposal-facts");
    if (deposit) facts.append(createFact("Seña", deposit));
    if (balance) facts.append(createFact("Saldo", balance));
    if (facts.childElementCount) section.append(facts);
    parent.append(section);
}

function createFact(label, value) {
    const fact = createElement("div", "proposal-fact");
    fact.append(createElement("span", "proposal-fact-label", label));
    fact.append(createElement("span", "proposal-fact-value", value));
    return fact;
}

function renderFinalCta({ status, expired, proposal, businessName, clientName, acceptedAt }) {
    const section = createElement("section", "proposal-cta");
    if (status === "accepted") {
        section.append(createElement("p", "section-eyebrow", "CONFIRMACIÓN RECIBIDA"));
        section.append(createElement("h2", "", "✓ Propuesta aceptada"));
        const accepted = createElement("div", "proposal-accepted");
        accepted.append(createElement("strong", "", "Gracias" + (clientName ? ", " + clientName : "") + "."));
        accepted.append(createElement("p", "", "Recibimos tu confirmación. Nos vamos a poner en contacto para continuar con los próximos pasos."));
        const date = formatDate(acceptedAt);
        if (date) accepted.append(createElement("p", "", "Aceptada el " + date + "."));
        section.append(accepted);
        const actions = createElement("div", "proposal-actions");
        actions.append(createWhatsAppLink(businessName, "Hablar con NODO"));
        section.append(actions);
        return section;
    }

    if (status === "sent" && !expired) {
        section.append(createElement("p", "section-eyebrow", "PRÓXIMO PASO"));
        section.append(createElement("h2", "", "¿Te gustaría avanzar?"));
        section.append(createElement("p", "", "Podés confirmar esta propuesta o escribirnos si querés conversar algún detalle."));
        const actions = createElement("div", "proposal-actions");
        const accept = createButton("Quiero avanzar", "proposal-button proposal-button-primary", event => openAcceptModal(event.currentTarget));
        actions.append(accept, createWhatsAppLink(businessName));
        section.append(actions);
        return section;
    }

    section.append(createElement("p", "section-eyebrow", expired ? "PROPUESTA VENCIDA" : "HABLEMOS"));
    section.append(createElement("h2", "", expired ? "La actualizamos juntos." : "Estamos para ayudarte."));
    section.append(createElement("p", "", expired ? "Escribinos y revisamos una propuesta actualizada para tu proyecto." : "Si tenés una consulta, escribinos y lo vemos juntos."));
    const actions = createElement("div", "proposal-actions");
    actions.append(createWhatsAppLink(businessName, "Tengo una consulta"));
    section.append(actions);
    return section;
}

function responseIsReplaced(responseBody) {
    const values = [
        responseBody?.error,
        responseBody?.reason,
        responseBody?.data?.reason,
        responseBody?.data?.error
    ];
    return values.some(value => value === "replaced" || value === "proposal_replaced");
}

function unavailableFromResponse(response, responseBody) {
    if (responseIsReplaced(responseBody)) return "replaced";
    if (response.status === 404 || responseBody?.error === "proposal_unavailable") return "unavailable";
    return "technical-error";
}

async function loadProposal() {
    if (!state.token) return;
    state.screen = "loading";
    render();

    try {
        const response = await fetch(SUPABASE_URL + "/functions/v1/get-public-proposal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({ token: state.token })
        });
        let responseBody = null;
        try {
            responseBody = await response.json();
        } catch {
            // El error se normaliza en una vista segura abajo.
        }

        if (!response.ok || responseBody?.ok !== true) {
            state.screen = unavailableFromResponse(response, responseBody);
            render();
            return;
        }

        const dto = responseBody.data;
        if (!isRecord(dto)) {
            state.screen = "technical-error";
            render();
            return;
        }
        if (dto.available === false || dto.ok === false) {
            state.screen = responseIsReplaced(dto) ? "replaced" : "unavailable";
            render();
            return;
        }
        if (!isRecord(dto.proposal) || (dto.status !== "sent" && dto.status !== "accepted")) {
            state.screen = "unavailable";
            render();
            return;
        }

        state.proposalData = {
            status: dto.status,
            is_expired: dto.is_expired === true,
            proposal: dto.proposal
        };
        state.screen = "proposal";
        render();
    } catch {
        state.screen = "technical-error";
        render();
    }
}

function updateAcceptModal() {
    acceptConfirm.disabled = state.accepting || !acceptCheck.checked;
    acceptConfirm.textContent = state.accepting ? "Confirmando…" : "Confirmar aceptación";
    acceptCancel.disabled = state.accepting;
    acceptCheck.disabled = state.accepting;
}

function openAcceptModal(trigger) {
    if (state.accepting || state.screen !== "proposal") return;
    state.acceptTrigger = trigger;
    acceptCheck.checked = false;
    acceptMessage.textContent = "";
    acceptModal.hidden = false;
    page.inert = true;
    updateAcceptModal();
    requestAnimationFrame(() => acceptCheck.focus());
}

function closeAcceptModal({ restoreFocus = true } = {}) {
    if (state.accepting || acceptModal.hidden) return;
    acceptModal.hidden = true;
    page.inert = false;
    acceptMessage.textContent = "";
    if (restoreFocus) state.acceptTrigger?.focus();
    state.acceptTrigger = null;
}

async function acceptProposal() {
    if (state.accepting || !acceptCheck.checked || !state.token) return;
    state.accepting = true;
    acceptMessage.textContent = "";
    updateAcceptModal();

    try {
        const response = await fetch(SUPABASE_URL + "/functions/v1/accept-public-proposal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({ token: state.token })
        });
        let responseBody = null;
        try {
            responseBody = await response.json();
        } catch {
            // Nunca se muestra una respuesta técnica al cliente.
        }

        if (response.ok && responseBody?.ok === true) {
            state.proposalData = {
                ...state.proposalData,
                status: "accepted",
                is_expired: false,
                proposal: { ...state.proposalData.proposal }
            };
            state.accepting = false;
            closeAcceptModal({ restoreFocus: false });
            render();
            return;
        }

        state.accepting = false;
        if (responseBody?.error === "proposal_expired") {
            closeAcceptModal({ restoreFocus: false });
            state.proposalData = { ...state.proposalData, is_expired: true };
            render();
            return;
        }
        if (responseIsReplaced(responseBody)) {
            closeAcceptModal({ restoreFocus: false });
            state.screen = "replaced";
            render();
            return;
        }
        acceptMessage.textContent = "No pudimos confirmar la aceptación en este momento. Intentá nuevamente o escribinos.";
        updateAcceptModal();
    } catch {
        state.accepting = false;
        acceptMessage.textContent = "No pudimos confirmar la aceptación en este momento. Intentá nuevamente o escribinos.";
        updateAcceptModal();
    }
}

function focusableModalControls() {
    return [...acceptModal.querySelectorAll("button:not([disabled]), input:not([disabled])")];
}

function setupAcceptModal() {
    acceptCheck.addEventListener("change", updateAcceptModal);
    acceptConfirm.addEventListener("click", acceptProposal);
    acceptCancel.addEventListener("click", () => closeAcceptModal());
    acceptModal.querySelectorAll("[data-accept-close]").forEach(control => {
        control.addEventListener("click", () => closeAcceptModal());
    });

    document.addEventListener("keydown", event => {
        if (acceptModal.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeAcceptModal();
            return;
        }
        if (event.key !== "Tab") return;

        const controls = focusableModalControls();
        if (!controls.length) return;
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

function boot() {
    const token = new URLSearchParams(window.location.search).get("t")?.trim() || "";
    if (!TOKEN_PATTERN.test(token)) {
        state.screen = "unavailable";
        render();
        return;
    }

    state.token = token;
    setupAcceptModal();
    loadProposal();
}

boot();
