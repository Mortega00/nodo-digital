const SUPABASE_URL = "https://pmrrudtwsgqyncstfdrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XhjenDP8bMVfuEUl02h6XA_ZkJLCnn_";
const NODO_PROPOSAL_URL = new URL("propuesta.html", window.location.href).href;
const DEFAULT_DRAFT_PAYMENT_TERMS = "50% para comenzar el proyecto.\n50% restante una vez aprobado el resultado final y antes de publicarlo.";
const PROPOSAL_PLAN_DEFAULTS = {
    presence: { priceAmount: 180000 },
    local: { priceAmount: 280000 },
    custom: { priceAmount: "" }
};

const supabaseClient = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storageKey: "nodo_admin_auth"
    }
});

const STATUS_OPTIONS = [
    { id: "new", label: "Nueva", filterLabel: "Nuevos", summaryLabel: "Nuevas" },
    { id: "reviewing", label: "En revisión", filterLabel: "En revisión", summaryLabel: "En revisión" },
    { id: "proposal_sent", label: "Propuesta enviada", filterLabel: "Propuesta enviada", summaryLabel: "Propuestas enviadas" },
    { id: "accepted", label: "Aceptada", filterLabel: "Aceptados", summaryLabel: "Aceptadas" },
    { id: "declined", label: "No avanza", filterLabel: "No avanzan", summaryLabel: "No avanzan" },
    { id: "in_project", label: "En proyecto", filterLabel: "En proyecto", summaryLabel: "En proyecto" }
];

const SUMMARY_STATUS_IDS = ["new", "reviewing", "proposal_sent", "accepted"];

// Mappings declarativos duplicados desde web/web.js. No se comparte lógica
// del asesor para mantener la web comercial completamente independiente.
const ADVISOR_LABELS = {
    goals: {
        professional: "Que mi negocio se vea más profesional",
        messages: "Que más personas me escriban",
        services: "Mostrar mis servicios",
        bookings: "Recibir reservas o turnos",
        products: "Mostrar productos",
        sell: "Vender por internet",
        unsure: "Todavía no estoy seguro"
    },
    today: {
        social: "Solo redes sociales",
        whatsapp: "WhatsApp",
        "current-page": "Ya tengo una página",
        "old-page": "Tengo una página vieja",
        starting: "Estoy empezando de cero",
        idea: "Estoy armando una idea"
    },
    content: {
        "business-info": "Información sobre mi negocio",
        services: "Mis servicios",
        photos: "Fotos o trabajos",
        prices: "Precios",
        location: "Mi ubicación",
        products: "Productos",
        promotions: "Promociones",
        undefined: "Todavía no lo tengo definido"
    },
    start: {
        simple: "Algo simple y rápido",
        complete: "Una página más completa",
        commerce: "Quiero vender o recibir pedidos",
        recommend: "Prefiero que me recomienden"
    },
    commerceNeed: {
        "commerce-basic": "Mostrar productos y recibir pedidos",
        payments: "Cobrar desde la página",
        stock: "Llevar control de stock",
        users: "Que cada cliente tenga su cuenta",
        special: "Necesito algo más específico",
        "commerce-unsure": "Todavía no estoy seguro"
    }
};

const app = document.getElementById("admin-app");

const state = {
    screen: "checking-session",
    session: null,
    user: null,
    leads: [],
    activeFilter: "all",
    search: "",
    selectedLeadId: null,
    draft: null,
    authMessage: "",
    loadError: false,
    isLoading: false,
    isSaving: false,
    isProposalSaving: false,
    isTerminatingSession: false,
    managementMessage: "",
    proposalDraft: null,
    proposalMessage: "",
    proposalPreviewOpen: false,
    proposalPreviewScroll: null
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
    if (handler) button.addEventListener("click", handler);
    return button;
}

function appendText(parent, tag, className, value) {
    parent.append(createElement(tag, className, value));
}

function clearPrivateState() {
    state.leads = [];
    state.selectedLeadId = null;
    state.draft = null;
    state.activeFilter = "all";
    state.search = "";
    state.loadError = false;
    state.isLoading = false;
    state.isSaving = false;
    state.isProposalSaving = false;
    state.managementMessage = "";
    state.proposalDraft = null;
    state.proposalMessage = "";
    state.proposalPreviewOpen = false;
    state.proposalPreviewScroll = null;
}

function statusDefinition(status) {
    return STATUS_OPTIONS.find(option => option.id === status) || STATUS_OPTIONS[0];
}

function operationalStatus(lead) {
    return lead.management?.lead_status || "new";
}

function internalNotes(lead) {
    return lead.management?.internal_notes || "";
}

function displayBusiness(lead) {
    if (lead.business_name) return lead.business_name;
    return lead.no_business_name ? "Todavía sin nombre" : "No informado";
}

function displayValue(value, fallback = "No informado") {
    if (value === null || value === undefined || value === "") return fallback;
    return String(value);
}

function formatDate(value) {
    if (!value || Number.isNaN(new Date(value).getTime())) return "Sin fecha";
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

function formatDateTime(value) {
    if (!value || Number.isNaN(new Date(value).getTime())) return "Sin actualizaciones";
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function normalizeSearch(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es-AR");
}

function recommendedProposalPlanKey(lead) {
    const key = String(lead?.recommended_plan_key || "").trim().toLowerCase();
    if (Object.hasOwn(PROPOSAL_PLAN_DEFAULTS, key)) return key;

    const name = normalizeSearch(lead?.recommended_plan_name);
    return {
        presencia: "presence",
        local: "local",
        personalizado: "custom"
    }[name] || "";
}

function selectedLead() {
    return state.leads.find(lead => lead.id === state.selectedLeadId) || null;
}

function valuesFromLead(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value !== "string" || !value) return [];

    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
        // Las columnas actuales normalmente llegan como arrays o strings simples.
    }

    return [value];
}

function currentProposal(lead) {
    return lead?.proposal || null;
}

function proposalStatusLabel(status) {
    return {
        draft: "Borrador",
        sent: "Propuesta enviada",
        accepted: "Aceptada",
        declined: "No avanza"
    }[status] || "Sin estado";
}

function proposalListText(value) {
    return valuesFromLead(value)
        .map(item => String(item).trim())
        .filter(Boolean)
        .join("\n");
}

function proposalLines(value) {
    return String(value || "")
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(Boolean);
}

function dateForInput(value) {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function proposalDraftFromRow(lead, proposal) {
    if (!proposal || proposal.status !== "draft") return null;

    return {
        leadId: lead.id,
        proposalId: proposal.id,
        clientName: proposal.client_name || lead.name || "",
        businessName: proposal.business_name || lead.business_name || "",
        title: proposal.title || "",
        objective: proposal.objective || "",
        proposedSolution: proposal.proposed_solution || "",
        scope: proposalListText(proposal.scope),
        deliverables: proposalListText(proposal.deliverables),
        included: proposalListText(proposal.included),
        excluded: proposalListText(proposal.excluded),
        priceAmount: proposal.price_amount ?? "",
        currency: proposal.currency === "USD" ? "USD" : "ARS",
        paymentTerms: proposal.payment_terms || "",
        depositAmount: proposal.deposit_amount ?? "",
        balanceAmount: proposal.balance_amount ?? "",
        estimatedTimeline: proposal.estimated_timeline || "",
        revisionCount: proposal.revision_count ?? "",
        validUntil: dateForInput(proposal.valid_until),
        conditions: proposal.conditions || "",
        nextStep: proposal.next_step || "",
        paymentAmountsAuto: false,
        dirty: false
    };
}

function defaultPaymentSplit(priceValue) {
    if (priceValue === null || priceValue === undefined || String(priceValue).trim() === "") return "";

    const price = Number(priceValue);
    if (!Number.isFinite(price) || price < 0) return "";

    const decimalPart = String(priceValue).trim().match(/\.(\d+)/)?.[1] || "";
    const factor = 10 ** Math.min(decimalPart.length, 6);
    const totalUnits = Math.round(price * factor);
    const initialUnits = Math.floor(totalUnits / 2);
    return {
        depositAmount: initialUnits / factor,
        balanceAmount: (totalUnits - initialUnits) / factor
    };
}

function applyAutomaticPaymentSplit(draft) {
    if (!draft) return;

    const split = defaultPaymentSplit(draft.priceAmount);
    draft.depositAmount = split ? split.depositAmount : "";
    draft.balanceAmount = split ? split.balanceAmount : "";
}

function applyNewDraftCommercialDefaults(draft, lead) {
    if (!draft) return;

    const planKey = recommendedProposalPlanKey(lead);
    if (planKey) draft.priceAmount = PROPOSAL_PLAN_DEFAULTS[planKey].priceAmount;
    draft.paymentTerms = DEFAULT_DRAFT_PAYMENT_TERMS;
    draft.validUntil = "";
    draft.paymentAmountsAuto = true;
    applyAutomaticPaymentSplit(draft);
    draft.dirty = true;
}

function proposalPublicUrl(proposal) {
    if (!proposal?.public_token) return "";
    const url = new URL(NODO_PROPOSAL_URL);
    url.searchParams.set("t", proposal.public_token);
    return url.href;
}

function formatProposalPrice(proposal) {
    if (proposal?.price_amount === null || proposal?.price_amount === undefined || proposal.price_amount === "") return "A definir";
    const amount = Number(proposal?.price_amount);
    if (!Number.isFinite(amount)) return "A definir";

    try {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: proposal.currency === "USD" ? "USD" : "ARS",
            maximumFractionDigits: 2
        }).format(amount);
    } catch {
        return String(amount) + " " + (proposal?.currency || "ARS");
    }
}

function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function detailScrollContainer() {
    return document.querySelector(".lead-detail");
}

function captureProposalScroll() {
    const detail = detailScrollContainer();
    const detailCanScroll = detail && detail.scrollHeight > detail.clientHeight + 1;
    return {
        detailScrollTop: detailCanScroll ? detail.scrollTop : null,
        windowScrollY: window.scrollY
    };
}

function restoreProposalScroll(position) {
    if (!position) return;

    requestAnimationFrame(() => {
        const detail = detailScrollContainer();
        const detailCanScroll = detail && detail.scrollHeight > detail.clientHeight + 1;
        if (detailCanScroll && position.detailScrollTop !== null) {
            detail.scrollTop = position.detailScrollTop;
            return;
        }

        window.scrollTo({ top: position.windowScrollY, behavior: "auto" });
    });
}

function scrollToProposalSection() {
    requestAnimationFrame(() => {
        const detail = detailScrollContainer();
        const proposal = document.getElementById("proposal-section");
        if (!proposal) return;

        const behavior = prefersReducedMotion() ? "auto" : "smooth";
        const detailCanScroll = detail && detail.scrollHeight > detail.clientHeight + 1;
        if (detailCanScroll) {
            const header = detail.querySelector(".detail-header");
            const offset = (header?.getBoundingClientRect().height || 0) + 12;
            const target = detail.scrollTop
                + proposal.getBoundingClientRect().top
                - detail.getBoundingClientRect().top
                - offset;
            detail.scrollTo({ top: Math.max(0, target), behavior });
            return;
        }

        const target = window.scrollY + proposal.getBoundingClientRect().top - 16;
        window.scrollTo({ top: Math.max(0, target), behavior });
    });
}

function humanLabels(group, value) {
    const labels = ADVISOR_LABELS[group] || {};
    return valuesFromLead(value)
        .map(id => labels[id])
        .filter(Boolean);
}

function isSessionError(error) {
    const message = String(error?.message || "").toLowerCase();
    return error?.status === 401 || error?.status === 403 || message.includes("jwt") || message.includes("session");
}

function renderApp() {
    app.replaceChildren();

    if (state.screen === "checking-session" || state.screen === "loading-leads") {
        app.append(renderLoading(state.screen === "loading-leads" ? "Cargando consultas…" : "Verificando acceso…"));
        return;
    }

    if (state.screen === "login") {
        app.append(renderLogin());
        return;
    }

    app.append(renderDashboard());
}

function renderLoading(message) {
    const section = createElement("section", "admin-loading");
    const card = createElement("div", "loading-card");
    card.append(createElement("div", "loading-spinner"));
    card.append(createElement("p", "", message));
    section.append(card);
    return section;
}

function createBrand() {
    const brand = createElement("div", "brand-lockup");
    const logo = document.createElement("img");
    logo.src = "assets/logo.png";
    logo.alt = "NODO";
    brand.append(logo, createElement("span", "", "NODO"));
    return brand;
}

function renderLogin() {
    const section = createElement("section", "admin-login");
    const card = createElement("div", "login-card");
    card.append(createBrand());
    card.append(createElement("h1", "", "Panel de gestión"));
    card.append(createElement("p", "login-subtitle", "Ingresá con tu cuenta autorizada de NODO."));

    const form = createElement("form", "login-form");
    form.noValidate = true;

    const emailField = createElement("label", "field");
    emailField.append(createElement("span", "", "Email"));
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.autocomplete = "email";
    emailInput.required = true;
    emailInput.disabled = state.isLoading || !supabaseClient;
    emailField.append(emailInput);

    const passwordField = createElement("label", "field");
    passwordField.append(createElement("span", "", "Contraseña"));
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.autocomplete = "current-password";
    passwordInput.required = true;
    passwordInput.disabled = state.isLoading || !supabaseClient;
    passwordField.append(passwordInput);

    const message = createElement("p", "form-message", state.authMessage);
    message.setAttribute("role", "status");

    const submit = createButton(state.isLoading ? "Ingresando…" : "Ingresar", "button button-primary");
    submit.type = "submit";
    submit.disabled = state.isLoading || !supabaseClient;

    form.append(emailField, passwordField, message, submit);
    form.addEventListener("submit", event => handleLogin(event, emailInput, passwordInput));
    card.append(form);
    section.append(card);
    return section;
}

async function handleLogin(event, emailInput, passwordInput) {
    event.preventDefault();
    if (state.isLoading) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        state.authMessage = "Completá email y contraseña para ingresar.";
        renderApp();
        return;
    }

    state.isLoading = true;
    state.authMessage = "";
    renderApp();

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        console.warn("No se pudo iniciar sesión en el panel NODO.", error);
        state.isLoading = false;
        state.authMessage = "Credenciales incorrectas. Revisá tus datos e intentá nuevamente.";
        renderApp();
        return;
    }

    state.isLoading = false;
    await authorizeSession(data.session);
}

async function authorizeSession(session) {
    clearPrivateState();
    state.screen = "checking-session";
    state.session = session;
    state.authMessage = "";
    renderApp();

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
        console.warn("La sesión del panel no pudo validarse.", userError);
        await terminateSession("Tu sesión venció. Ingresá nuevamente.");
        return;
    }

    state.user = userData.user;

    const { data: membership, error: membershipError } = await supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

    if (membershipError) {
        console.warn("No se pudo verificar la autorización del panel.", membershipError);
        state.session = null;
        state.user = null;
        state.screen = "login";
        state.authMessage = "No pudimos verificar tu acceso. Intentá nuevamente.";
        renderApp();
        return;
    }

    if (!membership) {
        await terminateSession("Acceso no autorizado.");
        return;
    }

    await loadLeads();
}

async function loadLeads({ refresh = false } = {}) {
    if (state.isLoading || state.isSaving || state.isProposalSaving) return;

    state.isLoading = true;
    state.loadError = false;
    if (!refresh) state.screen = "loading-leads";
    renderApp();

    try {
        const { data: leads, error: leadsError } = await supabaseClient
            .from("leads")
            .select("id, created_at, name, email, whatsapp, business_name, no_business_name, comment, advisor_goals, advisor_today, advisor_content, advisor_start, advisor_commerce_need, recommended_plan_key, recommended_plan_name, recommended_price, marketing_email_consent")
            .order("created_at", { ascending: false })
            .limit(100);

        if (leadsError) throw leadsError;

        const leadIds = (leads || []).map(lead => lead.id);
        let managementRows = [];
        let proposalRows = [];

        if (leadIds.length) {
            const { data, error } = await supabaseClient
                .from("lead_management")
                .select("lead_id, lead_status, internal_notes, created_at, updated_at")
                .in("lead_id", leadIds);

            if (error) throw error;
            managementRows = data || [];

            const { data: proposals, error: proposalsError } = await supabaseClient
                .from("proposals")
                .select("id, lead_id, version, is_current, status, client_name, business_name, title, objective, proposed_solution, scope, deliverables, included, excluded, price_amount, currency, payment_terms, deposit_amount, balance_amount, estimated_timeline, revision_count, valid_until, conditions, next_step, public_token, created_at, updated_at, sent_at, accepted_at, declined_at")
                .in("lead_id", leadIds)
                .eq("is_current", true);

            if (proposalsError) throw proposalsError;
            proposalRows = proposals || [];
        }

        const managementByLeadId = new Map(managementRows.map(row => [row.lead_id, row]));
        const proposalByLeadId = new Map(proposalRows.map(row => [row.lead_id, row]));
        state.leads = (leads || []).map(lead => ({
            ...lead,
            management: managementByLeadId.get(lead.id) || null,
            proposal: proposalByLeadId.get(lead.id) || null
        }));

        const refreshedLead = selectedLead();
        if (refreshedLead && !state.draft?.dirty && !state.proposalDraft?.dirty) {
            state.draft = {
                leadId: refreshedLead.id,
                leadStatus: operationalStatus(refreshedLead),
                internalNotes: internalNotes(refreshedLead),
                dirty: false
            };
            state.proposalDraft = proposalDraftFromRow(refreshedLead, currentProposal(refreshedLead));
        }
        state.loadError = false;
        state.screen = "dashboard";
    } catch (error) {
        console.error("No se pudieron cargar las consultas del panel NODO.", error);
        if (isSessionError(error)) {
            await terminateSession("Tu sesión venció. Ingresá nuevamente.");
            return;
        }

        state.leads = [];
        state.selectedLeadId = null;
        state.draft = null;
        state.loadError = true;
        state.screen = "dashboard";
    } finally {
        state.isLoading = false;
        if (state.screen === "dashboard") renderApp();
    }
}

function renderDashboard() {
    const layout = createElement("div", "admin-layout");
    layout.append(renderSidebar());

    const workspace = createElement("main", "workspace");
    workspace.id = "consultas";

    const header = createElement("header", "workspace-header");
    const titleGroup = createElement("div", "");
    titleGroup.append(createElement("p", "workspace-eyebrow", "PANEL NODO"));
    titleGroup.append(createElement("h1", "", "Consultas"));
    const refresh = createButton(state.isLoading ? "Actualizando…" : "Actualizar", "button button-secondary", () => loadLeads({ refresh: true }));
    refresh.disabled = state.isLoading || state.isSaving || state.isProposalSaving;
    header.append(titleGroup, refresh);
    workspace.append(header);

    if (state.loadError) {
        workspace.append(renderLoadError());
        layout.append(workspace);
        return layout;
    }

    workspace.append(renderSummary());

    const grid = createElement("div", "dashboard-grid" + (selectedLead() ? " has-detail" : ""));
    grid.append(renderListShell());
    const detail = selectedLead();
    if (detail) grid.append(renderLeadDetail(detail));
    workspace.append(grid);
    layout.append(workspace);
    return layout;
}

function renderSidebar() {
    const sidebar = createElement("aside", "sidebar");
    sidebar.append(createBrand());

    const nav = createElement("nav", "sidebar-nav");
    nav.setAttribute("aria-label", "Navegación del panel");
    nav.append(createElement("span", "sidebar-link", "Consultas"));
    sidebar.append(nav);

    const footer = createElement("div", "sidebar-footer");
    footer.append(createElement("span", "sidebar-user", displayValue(state.user?.email, "Sesión activa")));
    const logout = createButton("Cerrar sesión", "button button-quiet", handleLogout);
    logout.disabled = state.isLoading || state.isSaving || state.isProposalSaving || state.isTerminatingSession;
    footer.append(logout);
    sidebar.append(footer);
    return sidebar;
}

function renderLoadError() {
    const error = createElement("section", "load-error");
    error.setAttribute("role", "status");
    error.append(createElement("p", "", "No pudimos cargar las consultas."));
    const retry = createButton("Reintentar", "button button-secondary", () => loadLeads());
    retry.disabled = state.isLoading;
    error.append(retry);
    return error;
}

function renderSummary() {
    const summary = createElement("section", "summary-grid");
    summary.setAttribute("aria-label", "Resumen de consultas");

    SUMMARY_STATUS_IDS.forEach(status => {
        const definition = statusDefinition(status);
        const count = state.leads.filter(lead => operationalStatus(lead) === status).length;
        const button = createButton("", "summary-card", () => {
            state.activeFilter = status;
            renderApp();
        });
        button.setAttribute("aria-pressed", String(state.activeFilter === status));
        button.setAttribute("aria-label", definition.summaryLabel + ": " + count);
        button.append(createElement("span", "summary-label", definition.summaryLabel));
        button.append(createElement("span", "summary-count", String(count)));
        summary.append(button);
    });

    return summary;
}

function renderListShell() {
    const shell = createElement("section", "list-shell");
    shell.setAttribute("aria-label", "Listado de consultas");

    const controls = createElement("div", "list-controls");
    const filters = createElement("div", "filter-row");
    filters.setAttribute("aria-label", "Filtros por estado");

    [{ id: "all", label: "Todos" }, ...STATUS_OPTIONS.map(option => ({ id: option.id, label: option.filterLabel }))]
        .forEach(filter => {
            const button = createButton(filter.label, "filter-button", () => {
                state.activeFilter = filter.id;
                renderApp();
            });
            button.setAttribute("aria-pressed", String(state.activeFilter === filter.id));
            filters.append(button);
        });

    const searchWrap = createElement("label", "search-wrap");
    searchWrap.append(createElement("span", "sr-only", "Buscar consultas"));
    const search = document.createElement("input");
    search.type = "search";
    search.className = "search-input";
    search.placeholder = "Buscar por nombre, negocio…";
    search.value = state.search;
    search.autocomplete = "off";
    search.addEventListener("input", () => {
        state.search = search.value;
        renderLeadResults(results);
    });
    searchWrap.append(search);
    controls.append(filters, searchWrap);

    const results = createElement("div", "lead-results");
    renderLeadResults(results);
    shell.append(controls, results);
    return shell;
}

function filteredLeads() {
    const search = normalizeSearch(state.search.trim());
    return state.leads.filter(lead => {
        if (state.activeFilter !== "all" && operationalStatus(lead) !== state.activeFilter) return false;
        if (!search) return true;

        const searchable = [lead.name, lead.email, lead.business_name, lead.whatsapp]
            .map(normalizeSearch)
            .join(" ");
        return searchable.includes(search);
    });
}

function renderLeadResults(container) {
    container.replaceChildren();
    const leads = filteredLeads();

    if (!leads.length) {
        const empty = createElement("div", "empty-state");
        empty.append(createElement("p", "", state.search || state.activeFilter !== "all" ? "No encontramos resultados." : "No hay consultas nuevas."));
        container.append(empty);
        return;
    }

    const tableWrap = createElement("div", "lead-table-wrapper");
    const table = createElement("table", "lead-table");
    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Fecha", "Nombre", "Negocio", "Plan", "Estado"].forEach(label => headerRow.append(createElement("th", "", label)));
    head.append(headerRow);
    const body = document.createElement("tbody");

    leads.forEach(lead => {
        const row = document.createElement("tr");
        row.tabIndex = 0;
        row.setAttribute("role", "button");
        row.setAttribute("aria-label", "Abrir consulta de " + displayValue(lead.name, "cliente"));
        row.addEventListener("click", () => openLead(lead.id));
        row.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLead(lead.id);
            }
        });

        row.append(createElement("td", "lead-business", formatDate(lead.created_at)));
        const nameCell = document.createElement("td");
        nameCell.append(createElement("span", "lead-name", displayValue(lead.name)));
        row.append(nameCell);
        row.append(createElement("td", "lead-business", displayBusiness(lead)));
        row.append(createElement("td", "lead-plan", displayValue(lead.recommended_plan_name)));
        const statusCell = document.createElement("td");
        statusCell.append(createStatusBadge(operationalStatus(lead)));
        row.append(statusCell);
        body.append(row);
    });

    table.append(head, body);
    tableWrap.append(table);
    container.append(tableWrap);

    const cards = createElement("div", "lead-cards");
    leads.forEach(lead => cards.append(createLeadCard(lead)));
    container.append(cards);
}

function createLeadCard(lead) {
    const card = createButton("", "lead-card", () => openLead(lead.id));
    card.setAttribute("aria-label", "Abrir consulta de " + displayValue(lead.name, "cliente"));
    const top = createElement("div", "lead-card-top");
    top.append(createElement("span", "lead-card-name", displayValue(lead.name)));
    top.append(createStatusBadge(operationalStatus(lead)));
    const middle = createElement("div", "lead-card-meta", displayBusiness(lead));
    const bottom = createElement("div", "lead-card-bottom");
    bottom.append(createElement("span", "lead-card-meta", displayValue(lead.recommended_plan_name)));
    bottom.append(createElement("span", "lead-card-meta", formatDate(lead.created_at)));
    card.append(top, middle, bottom);
    return card;
}

function createStatusBadge(status) {
    const definition = statusDefinition(status);
    return createElement("span", "status-badge status-" + definition.id, definition.label);
}

function openLead(leadId) {
    if (state.selectedLeadId && state.selectedLeadId !== leadId && (state.draft?.dirty || state.proposalDraft?.dirty)) {
        const discard = window.confirm("Tenés cambios sin guardar. ¿Querés descartarlos y abrir otra consulta?");
        if (!discard) return;
    }

    const lead = state.leads.find(item => item.id === leadId);
    if (!lead) return;

    state.selectedLeadId = leadId;
    state.draft = {
        leadId,
        leadStatus: operationalStatus(lead),
        internalNotes: internalNotes(lead),
        dirty: false
    };
    state.managementMessage = "";
    state.proposalDraft = proposalDraftFromRow(lead, currentProposal(lead));
    state.proposalMessage = "";
    state.proposalPreviewOpen = false;
    state.proposalPreviewScroll = null;
    renderApp();
    document.querySelector(".detail-close")?.focus();
}

function requestCloseDetail() {
    if (!state.selectedLeadId) return;
    if (state.isSaving || state.isProposalSaving) return;

    if (state.draft?.dirty || state.proposalDraft?.dirty) {
        const discard = window.confirm("Tenés cambios sin guardar. ¿Querés descartarlos?");
        if (!discard) return;
    }

    state.selectedLeadId = null;
    state.draft = null;
    state.managementMessage = "";
    state.proposalDraft = null;
    state.proposalMessage = "";
    state.proposalPreviewOpen = false;
    state.proposalPreviewScroll = null;
    renderApp();
}

function renderLeadDetail(lead) {
    if (!state.draft || state.draft.leadId !== lead.id) {
        state.draft = {
            leadId: lead.id,
            leadStatus: operationalStatus(lead),
            internalNotes: internalNotes(lead),
            dirty: false
        };
    }

    if (!state.proposalDraft || state.proposalDraft.leadId !== lead.id
        || state.proposalDraft.proposalId !== currentProposal(lead)?.id) {
        state.proposalDraft = proposalDraftFromRow(lead, currentProposal(lead));
        state.proposalPreviewOpen = false;
        state.proposalPreviewScroll = null;
    }

    const detail = createElement("aside", "lead-detail");
    detail.setAttribute("aria-label", "Detalle de consulta");
    detail.tabIndex = -1;

    const header = createElement("header", "detail-header");
    const title = createElement("div", "");
    title.append(createElement("h2", "", displayValue(lead.name, "Consulta")));
    title.append(createElement("p", "", formatDate(lead.created_at)));
    const close = createButton("×", "detail-close", requestCloseDetail);
    close.setAttribute("aria-label", "Cerrar detalle de consulta");
    close.disabled = state.isSaving || state.isProposalSaving;
    header.append(title, close);
    detail.append(header);

    const clientSection = createDetailSection("Datos del cliente");
    const clientData = createElement("div", "detail-data");
    appendDetailRow(clientData, "Nombre", displayValue(lead.name));
    appendDetailRow(clientData, "Email", displayValue(lead.email));
    appendDetailRow(clientData, "WhatsApp", displayValue(lead.whatsapp));
    appendDetailRow(clientData, "Negocio", displayBusiness(lead));
    appendDetailRow(clientData, "Fecha", formatDateTime(lead.created_at));
    clientSection.append(clientData);

    const contactActions = createElement("div", "detail-actions");
    const whatsappUrl = createWhatsAppUrl(lead.whatsapp, lead.name);
    if (whatsappUrl) {
        const whatsapp = document.createElement("a");
        whatsapp.className = "button button-secondary";
        whatsapp.href = whatsappUrl;
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
        whatsapp.textContent = "Abrir WhatsApp ↗";
        contactActions.append(whatsapp);
    }
    if (lead.email) {
        const email = document.createElement("a");
        email.className = "button button-secondary";
        email.href = "mailto:" + encodeURIComponent(lead.email);
        email.textContent = "Abrir email";
        contactActions.append(email);
    }
    if (contactActions.childElementCount) clientSection.append(contactActions);
    detail.append(clientSection);

    const diagnostic = createDetailSection("Diagnóstico");
    diagnostic.append(createDiagnosticGroup("Objetivos", "goals", lead.advisor_goals));
    diagnostic.append(createDiagnosticGroup("Situación actual", "today", lead.advisor_today));
    diagnostic.append(createDiagnosticGroup("Contenido", "content", lead.advisor_content));
    diagnostic.append(createDiagnosticGroup("Tipo de inicio", "start", lead.advisor_start));
    if (lead.advisor_commerce_need) diagnostic.append(createDiagnosticGroup("Necesidad de comercio", "commerceNeed", lead.advisor_commerce_need));
    detail.append(diagnostic);

    const recommendation = createDetailSection("Recomendación");
    const recommendationData = createElement("div", "detail-data");
    appendDetailRow(recommendationData, "Plan", displayValue(lead.recommended_plan_name));
    appendDetailRow(recommendationData, "Precio snapshot", displayValue(lead.recommended_price));
    recommendation.append(recommendationData);
    detail.append(recommendation);

    detail.append(renderProposalSection(lead));

    const comment = createDetailSection("Comentario");
    const commentData = createElement("div", "detail-data");
    appendDetailRow(commentData, "Comentario del cliente", displayValue(lead.comment, "Sin comentario"), true);
    comment.append(commentData);
    detail.append(comment);

    const marketing = createDetailSection("Marketing");
    const marketingData = createElement("div", "detail-data");
    const marketingLabel = lead.marketing_email_consent === true ? "Sí" : lead.marketing_email_consent === false ? "No" : "No informado";
    appendDetailRow(marketingData, "Consentimiento de email", marketingLabel);
    marketing.append(marketingData);
    detail.append(marketing);

    detail.append(renderManagementSection(lead));
    return detail;
}

function renderProposalSection(lead) {
    const section = createDetailSection("Propuesta");
    section.classList.add("proposal-section");
    section.id = "proposal-section";
    const proposal = currentProposal(lead);

    if (!proposal) {
        const message = operationalStatus(lead) === "reviewing"
            ? "Este lead está en revisión y puede pasar a propuesta."
            : "Podrás preparar una propuesta cuando el lead esté en revisión.";
        section.append(createElement("p", "proposal-empty", message));

        if (operationalStatus(lead) === "reviewing") {
            const prepare = createButton(state.isProposalSaving ? "Preparando…" : "Preparar propuesta", "button button-primary", prepareProposalDraft);
            prepare.disabled = state.isProposalSaving || state.isSaving || state.draft?.dirty;
            section.append(prepare);
        }

        section.append(renderProposalMessage());
        return section;
    }

    const heading = createElement("div", "proposal-heading");
    const status = createElement("span", "proposal-status proposal-status-" + proposal.status, proposalStatusLabel(proposal.status));
    heading.append(status, createElement("span", "proposal-version", "Versión " + displayValue(proposal.version, "1")));
    section.append(heading);

    if (proposal.status === "draft") {
        section.append(createElement("p", "proposal-empty", "Completá los datos y revisalos antes de enviar esta versión."));
        section.append(renderProposalEditor(lead, proposal));
    } else if (proposal.status === "sent") {
        section.append(createElement("p", "proposal-meta", "Enviada: " + formatDateTime(proposal.sent_at)));
        section.append(renderPublicProposalActions(proposal));
        section.append(renderSentProposalActions(lead, proposal));
    } else if (proposal.status === "accepted") {
        section.append(createElement("p", "proposal-meta", "Aceptada: " + formatDateTime(proposal.accepted_at)));
        section.append(renderPublicProposalActions(proposal));
    } else if (proposal.status === "declined") {
        section.append(createElement("p", "proposal-meta", "Marcada como no avanza: " + formatDateTime(proposal.declined_at)));
        section.append(renderPublicProposalActions(proposal));
    }

    section.append(renderProposalMessage());
    return section;
}

function renderProposalMessage() {
    const isError = /^(No pudimos|Tu sesión|Acceso|Los datos)/.test(state.proposalMessage);
    const message = createElement("p", "proposal-message" + (isError ? " is-error" : ""), state.proposalMessage);
    message.id = "proposal-message";
    message.setAttribute("role", "status");
    return message;
}

function renderPublicProposalActions(proposal) {
    const actions = createElement("div", "detail-actions proposal-actions");
    const link = proposalPublicUrl(proposal);

    if (!link) {
        actions.append(createElement("span", "detail-data-value is-muted", "El enlace todavía no está disponible."));
        return actions;
    }

    const open = document.createElement("a");
    open.className = "button button-secondary";
    open.href = link;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.textContent = "Abrir propuesta ↗";
    actions.append(open);

    const copy = createButton("Copiar enlace", "button button-secondary", () => copyProposalLink(proposal));
    copy.disabled = state.isProposalSaving;
    actions.append(copy);
    return actions;
}

function renderSentProposalActions(lead, proposal) {
    const actions = createElement("div", "detail-actions proposal-actions");
    const whatsappUrl = createProposalWhatsAppUrl(lead, proposal);
    if (whatsappUrl) {
        const whatsapp = document.createElement("a");
        whatsapp.className = "button button-secondary";
        whatsapp.href = whatsappUrl;
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
        whatsapp.textContent = "Compartir por WhatsApp ↗";
        actions.append(whatsapp);
    }
    const revision = createButton(state.isProposalSaving ? "Creando…" : "Crear nueva versión", "button button-secondary", () => createProposalRevision(proposal));
    const decline = createButton("Marcar como no avanza", "button button-danger", () => declineProposal(proposal));
    revision.disabled = state.isProposalSaving || state.isSaving || state.draft?.dirty;
    decline.disabled = state.isProposalSaving || state.isSaving || state.draft?.dirty;
    actions.append(revision, decline);
    return actions;
}

function renderProposalEditor(lead, proposal) {
    const draft = state.proposalDraft || proposalDraftFromRow(lead, proposal);
    if (!draft) return createElement("p", "proposal-empty", "No pudimos preparar el formulario de propuesta.");

    const form = createElement("form", "proposal-form");
    form.noValidate = true;
    const mainGrid = createElement("div", "proposal-grid");
    const validity = createProposalField("Vigencia", "validUntil", draft, { type: "date" });
    validity.append(createElement("small", "proposal-field-note", "Si no elegís una fecha, la propuesta será válida durante 7 días desde el envío."));
    mainGrid.append(
        createProposalField("Cliente *", "clientName", draft),
        createProposalField("Negocio *", "businessName", draft),
        createProposalField("Título", "title", draft, { wide: true }),
        createProposalField("Objetivo", "objective", draft, { multiline: true, wide: true }),
        createProposalField("Solución propuesta", "proposedSolution", draft, { multiline: true, wide: true }),
        createProposalField("Alcance", "scope", draft, { multiline: true, list: true, wide: true }),
        createProposalField("Entregables", "deliverables", draft, { multiline: true, list: true, wide: true }),
        createProposalField("Incluye", "included", draft, { multiline: true, list: true, wide: true }),
        createProposalField("No incluye", "excluded", draft, { multiline: true, list: true, wide: true }),
        createProposalField("Precio", "priceAmount", draft, { type: "number", min: "0", step: "any" }),
        createProposalCurrencyField(draft),
        createProposalField("Forma de pago", "paymentTerms", draft, { multiline: true, wide: true }),
        createProposalField("Pago inicial", "depositAmount", draft, { type: "number", min: "0", step: "any" }),
        createProposalField("Saldo antes de publicar", "balanceAmount", draft, { type: "number", min: "0", step: "any" }),
        createProposalField("Tiempo estimado", "estimatedTimeline", draft),
        createProposalField("Cantidad de revisiones", "revisionCount", draft, { type: "number", min: "0", step: "1" }),
        validity,
        createProposalField("Condiciones / aclaraciones", "conditions", draft, { multiline: true, wide: true }),
        createProposalField("Próximo paso", "nextStep", draft, { multiline: true, wide: true })
    );
    form.append(mainGrid);

    const actions = createElement("div", "detail-actions proposal-actions proposal-editor-actions");
    const preview = createButton(state.proposalPreviewOpen ? "Ocultar vista previa" : "Vista previa", "button button-secondary", () => {
        const scrollPosition = state.proposalPreviewOpen
            ? state.proposalPreviewScroll || captureProposalScroll()
            : captureProposalScroll();
        state.proposalPreviewOpen = !state.proposalPreviewOpen;
        state.proposalPreviewScroll = state.proposalPreviewOpen ? scrollPosition : null;
        renderApp();
        restoreProposalScroll(scrollPosition);
    });
    preview.setAttribute("aria-expanded", String(state.proposalPreviewOpen));
    preview.disabled = state.isProposalSaving;

    const resetPayment = createButton("Restablecer 50/50", "button button-secondary", resetProposalPaymentSplit);
    resetPayment.id = "reset-proposal-payment-split";
    resetPayment.disabled = state.isProposalSaving || state.isSaving || !defaultPaymentSplit(draft.priceAmount);

    const save = createButton(state.isProposalSaving ? "Guardando…" : "Guardar borrador", "button button-primary", saveProposalDraft);
    save.id = "save-proposal-draft";
    save.disabled = state.isProposalSaving || state.isSaving || !draft.dirty;

    const send = createButton("Enviar propuesta", "button button-secondary", () => sendProposal(proposal));
    send.disabled = state.isProposalSaving || state.isSaving || draft.dirty || state.draft?.dirty;
    actions.append(preview, resetPayment, save, send);
    form.append(actions);
    form.addEventListener("submit", event => {
        event.preventDefault();
        saveProposalDraft();
    });

    if (state.proposalPreviewOpen) form.append(renderProposalPreview(draft));
    return form;
}

function createProposalField(labelText, key, draft, options = {}) {
    const field = createElement("label", "field proposal-field" + (options.wide ? " proposal-field-wide" : ""));
    field.append(createElement("span", "", labelText));
    const control = document.createElement(options.multiline ? "textarea" : "input");
    control.name = key;
    control.value = draft[key] ?? "";
    control.disabled = state.isProposalSaving;

    if (options.multiline) {
        control.rows = options.list ? 4 : 4;
        if (options.list) {
            control.placeholder = "Un ítem por línea";
            control.classList.add("proposal-list-control");
        }
    } else {
        control.type = options.type || "text";
        if (options.min) control.min = options.min;
        if (options.step) control.step = options.step;
    }

    control.addEventListener("input", () => updateProposalDraftField(key, control.value));
    control.addEventListener("change", () => updateProposalDraftField(key, control.value));
    field.append(control);
    return field;
}

function createProposalCurrencyField(draft) {
    const field = createElement("label", "field proposal-field");
    field.append(createElement("span", "", "Moneda"));
    const select = document.createElement("select");
    ["ARS", "USD"].forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        select.append(option);
    });
    select.value = draft.currency === "USD" ? "USD" : "ARS";
    select.disabled = state.isProposalSaving;
    select.addEventListener("change", () => updateProposalDraftField("currency", select.value));
    field.append(select);
    return field;
}

function updateProposalDraftField(key, value) {
    if (!state.proposalDraft) return;
    state.proposalDraft[key] = value;
    if (key === "priceAmount" && state.proposalDraft.paymentAmountsAuto) {
        applyAutomaticPaymentSplit(state.proposalDraft);
        syncProposalPaymentAmountFields();
    } else if (["depositAmount", "balanceAmount"].includes(key)) {
        state.proposalDraft.paymentAmountsAuto = false;
    }
    state.proposalDraft.dirty = true;
    state.proposalMessage = "";
    syncProposalControls();
}

function syncProposalPaymentAmountFields() {
    if (!state.proposalDraft) return;
    ["depositAmount", "balanceAmount"].forEach(key => {
        const control = document.querySelector(".proposal-form [name=\"" + key + "\"]");
        if (control) control.value = state.proposalDraft[key] ?? "";
    });
}

function resetProposalPaymentSplit() {
    const draft = state.proposalDraft;
    if (!draft || !defaultPaymentSplit(draft.priceAmount)) {
        state.proposalMessage = "Ingresá un precio válido para restablecer el pago 50/50.";
        syncProposalControls();
        return;
    }

    draft.paymentAmountsAuto = true;
    applyAutomaticPaymentSplit(draft);
    draft.dirty = true;
    state.proposalMessage = "Pago inicial y saldo restablecidos al 50/50.";
    syncProposalPaymentAmountFields();
    syncProposalControls();
}

function syncProposalControls() {
    const save = document.getElementById("save-proposal-draft");
    if (save) save.disabled = state.isProposalSaving || state.isSaving || !state.proposalDraft?.dirty;
    const resetPayment = document.getElementById("reset-proposal-payment-split");
    if (resetPayment) resetPayment.disabled = state.isProposalSaving || state.isSaving || !defaultPaymentSplit(state.proposalDraft?.priceAmount);
    const message = document.getElementById("proposal-message");
    if (message) {
        message.textContent = state.proposalMessage;
        message.classList.toggle("is-error", /^(No pudimos|Tu sesión|Acceso|Los datos)/.test(state.proposalMessage));
    }
}

function renderProposalPreview(draft) {
    const preview = createElement("section", "proposal-preview");
    preview.append(createElement("p", "proposal-preview-eyebrow", "VISTA PREVIA LOCAL"));
    preview.append(createElement("h4", "", "NODO · Propuesta para " + displayValue(draft.businessName, "tu negocio")));
    preview.append(createElement("p", "proposal-preview-client", "Preparada para " + displayValue(draft.clientName, "cliente")));
    appendPreviewText(preview, "Objetivo", draft.objective);
    appendPreviewText(preview, "Solución propuesta", draft.proposedSolution);
    appendPreviewList(preview, "Alcance", proposalLines(draft.scope));
    appendPreviewList(preview, "Entregables", proposalLines(draft.deliverables));
    appendPreviewList(preview, "Incluye", proposalLines(draft.included));
    appendPreviewList(preview, "No incluye", proposalLines(draft.excluded));
    appendPreviewText(preview, "Tiempo estimado", draft.estimatedTimeline);
    appendPreviewText(preview, "Cantidad de revisiones", draft.revisionCount);
    appendPreviewText(preview, "Inversión", formatProposalPrice({ price_amount: draft.priceAmount, currency: draft.currency }));
    appendPreviewText(preview, "Pago inicial", draft.depositAmount);
    appendPreviewText(preview, "Saldo antes de publicar", draft.balanceAmount);
    appendPreviewText(preview, "Forma de pago", draft.paymentTerms);
    appendPreviewText(preview, "Vigencia", draft.validUntil ? formatDate(draft.validUntil) : "7 días desde el envío");
    appendPreviewText(preview, "Condiciones", draft.conditions);
    appendPreviewText(preview, "Próximo paso", draft.nextStep);
    return preview;
}

function appendPreviewText(container, label, value) {
    const block = createElement("section", "proposal-preview-block");
    block.append(createElement("h5", "", label));
    block.append(createElement("p", "", displayValue(value, "Sin definir")));
    container.append(block);
}

function appendPreviewList(container, label, items) {
    const block = createElement("section", "proposal-preview-block");
    block.append(createElement("h5", "", label));
    if (!items.length) {
        block.append(createElement("p", "", "Sin definir"));
    } else {
        const list = document.createElement("ul");
        items.forEach(item => list.append(createElement("li", "", item)));
        block.append(list);
    }
    container.append(block);
}

function optionalNonNegative(value, label, { integer = false } = {}) {
    const normalized = String(value ?? "").trim();
    if (!normalized) return { value: null };

    const number = Number(normalized);
    if (!Number.isFinite(number) || number < 0 || (integer && !Number.isSafeInteger(number))) {
        return { error: label + " debe ser un número " + (integer ? "entero " : "") + "igual o mayor a cero." };
    }

    return { value: number };
}

function proposalUpdatePayload() {
    const draft = state.proposalDraft;
    if (!draft) return { error: "No pudimos preparar los datos de la propuesta." };

    const clientName = String(draft.clientName || "").trim();
    const businessName = String(draft.businessName || "").trim();
    if (!clientName || !businessName) {
        return { error: "Los datos inválidos: cliente y negocio son obligatorios." };
    }

    const priceAmount = optionalNonNegative(draft.priceAmount, "El precio");
    const depositAmount = optionalNonNegative(draft.depositAmount, "El pago inicial");
    const balanceAmount = optionalNonNegative(draft.balanceAmount, "El saldo antes de publicar");
    const revisionCount = optionalNonNegative(draft.revisionCount, "La cantidad de revisiones", { integer: true });
    const currency = draft.currency === "USD" ? "USD" : draft.currency === "ARS" ? "ARS" : "";

    if (priceAmount.error || depositAmount.error || balanceAmount.error || revisionCount.error || !currency) {
        return { error: priceAmount.error || depositAmount.error || balanceAmount.error || revisionCount.error || "Los datos inválidos: elegí ARS o USD." };
    }

    return {
        proposal: {
            clientName,
            businessName,
            title: String(draft.title || "").trim(),
            objective: String(draft.objective || "").trim(),
            proposedSolution: String(draft.proposedSolution || "").trim(),
            scope: proposalLines(draft.scope),
            deliverables: proposalLines(draft.deliverables),
            included: proposalLines(draft.included),
            excluded: proposalLines(draft.excluded),
            priceAmount: priceAmount.value,
            currency,
            paymentTerms: String(draft.paymentTerms || "").trim(),
            depositAmount: depositAmount.value,
            balanceAmount: balanceAmount.value,
            estimatedTimeline: String(draft.estimatedTimeline || "").trim(),
            revisionCount: revisionCount.value,
            validUntil: draft.validUntil || null,
            conditions: String(draft.conditions || "").trim(),
            nextStep: String(draft.nextStep || "").trim()
        }
    };
}

async function proposalAdminRequest(payload) {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (sessionError || !accessToken) throw { status: 401 };

    state.session = sessionData.session;
    const response = await fetch(SUPABASE_URL + "/functions/v1/proposal-admin", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "apikey": SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    let responseBody = null;
    try {
        responseBody = await response.json();
    } catch {
        // La respuesta se normaliza abajo sin mostrar información interna.
    }

    if (!response.ok || responseBody?.ok !== true) {
        throw { status: response.status, code: responseBody?.error };
    }

    return {
        data: responseBody.data,
        notification: responseBody.notification || null
    };
}

async function refreshSelectedLeadProposal() {
    const lead = selectedLead();
    if (!lead) return;

    const [managementResult, proposalResult] = await Promise.all([
        supabaseClient
            .from("lead_management")
            .select("lead_id, lead_status, internal_notes, created_at, updated_at")
            .eq("lead_id", lead.id)
            .maybeSingle(),
        supabaseClient
            .from("proposals")
            .select("id, lead_id, version, is_current, status, client_name, business_name, title, objective, proposed_solution, scope, deliverables, included, excluded, price_amount, currency, payment_terms, deposit_amount, balance_amount, estimated_timeline, revision_count, valid_until, conditions, next_step, public_token, created_at, updated_at, sent_at, accepted_at, declined_at")
            .eq("lead_id", lead.id)
            .eq("is_current", true)
            .maybeSingle()
    ]);

    if (managementResult.error) throw managementResult.error;
    if (proposalResult.error) throw proposalResult.error;

    lead.management = managementResult.data || null;
    lead.proposal = proposalResult.data || null;
    state.draft = {
        leadId: lead.id,
        leadStatus: operationalStatus(lead),
        internalNotes: internalNotes(lead),
        dirty: false
    };
    state.proposalDraft = proposalDraftFromRow(lead, currentProposal(lead));
    state.proposalPreviewOpen = false;
    state.proposalPreviewScroll = null;
}

async function handleProposalFailure(error, action) {
    const status = error?.status;
    if (status === 401 || isSessionError(error)) {
        await terminateSession("Tu sesión venció. Ingresá nuevamente.");
        return;
    }

    if (status === 403) state.proposalMessage = "Acceso no autorizado para gestionar esta propuesta.";
    else if (status === 400) state.proposalMessage = "Los datos de la propuesta son inválidos. Revisalos e intentá nuevamente.";
    else if (action === "send") state.proposalMessage = "La propuesta no se pudo enviar todavía. Revisá título, precio, vigencia futura y que el lead siga en revisión.";
    else state.proposalMessage = "No pudimos procesar la propuesta. Intentá nuevamente.";
}

function proposalSendSuccessMessage(result, lead) {
    const notification = result?.notification;
    if (notification?.sent === true) {
        const email = typeof lead?.email === "string" ? lead.email.trim() : "";
        return email
            ? "Propuesta enviada correctamente. También enviamos el enlace por email a " + email + "."
            : "Propuesta enviada correctamente. También enviamos el enlace por email.";
    }

    if (notification?.reason === "recipient_unavailable") {
        return "Propuesta enviada correctamente. No enviamos el email porque no hay una dirección válida; podés compartir el enlace.";
    }

    return "Propuesta enviada correctamente, pero no pudimos entregar el email. Podés compartir el enlace.";
}

async function runProposalAction(payload, successMessage, { preserveScroll = false, pendingMessage = "Procesando…" } = {}) {
    if (state.isProposalSaving || state.isSaving) return false;

    const scrollPosition = captureProposalScroll();
    let succeeded = false;
    state.isProposalSaving = true;
    state.proposalMessage = pendingMessage;
    renderApp();
    restoreProposalScroll(scrollPosition);

    try {
        const actionResult = await proposalAdminRequest(payload);
        await refreshSelectedLeadProposal();
        state.proposalMessage = typeof successMessage === "function" ? successMessage(actionResult) : successMessage;
        succeeded = true;
        return true;
    } catch (error) {
        console.error("No se pudo procesar una acción de propuesta.", error);
        await handleProposalFailure(error, payload.action);
        return false;
    } finally {
        state.isProposalSaving = false;
        if (state.screen === "dashboard") {
            renderApp();
            if (succeeded && !preserveScroll) scrollToProposalSection();
            else restoreProposalScroll(scrollPosition);
        }
    }
}

async function prepareProposalDraft() {
    const lead = selectedLead();
    if (!lead || currentProposal(lead) || operationalStatus(lead) !== "reviewing") return;
    if (state.draft?.dirty) {
        state.proposalMessage = "Guardá primero los cambios pendientes de gestión.";
        syncProposalControls();
        return;
    }

    const created = await runProposalAction({ action: "create_draft", leadId: lead.id }, "Borrador creado. Ya podés completar la propuesta.");
    if (!created || !state.proposalDraft) return;

    applyNewDraftCommercialDefaults(state.proposalDraft, lead);
    const planKey = recommendedProposalPlanKey(lead);
    const defaultPrice = planKey ? PROPOSAL_PLAN_DEFAULTS[planKey].priceAmount : "";
    state.proposalMessage = defaultPrice === ""
        ? "Borrador creado. Ingresá el total acordado y se calculará el pago inicial y el saldo."
        : "Borrador creado con el precio sugerido. Podés editarlo; el pago inicial y el saldo se calculan al 50/50.";
    const scrollPosition = captureProposalScroll();
    renderApp();
    restoreProposalScroll(scrollPosition);
}

async function saveProposalDraft() {
    const proposal = currentProposal(selectedLead());
    if (!proposal || proposal.status !== "draft" || state.isProposalSaving) return;

    const payload = proposalUpdatePayload();
    if (payload.error) {
        state.proposalMessage = payload.error;
        syncProposalControls();
        return;
    }

    const paymentAmountsAuto = state.proposalDraft?.paymentAmountsAuto === true;
    const saved = await runProposalAction({
        action: "update_draft",
        proposalId: proposal.id,
        proposal: payload.proposal
    }, "Borrador guardado correctamente.", { preserveScroll: true });
    if (saved && state.proposalDraft) state.proposalDraft.paymentAmountsAuto = paymentAmountsAuto;
}

async function sendProposal(proposal) {
    if (!proposal || proposal.status !== "draft" || state.isProposalSaving) return;
    if (state.proposalDraft?.dirty) {
        state.proposalMessage = "Guardá el borrador antes de enviar la propuesta.";
        syncProposalControls();
        return;
    }
    if (state.draft?.dirty) {
        state.proposalMessage = "Guardá primero los cambios pendientes de gestión.";
        syncProposalControls();
        return;
    }

    const confirmed = window.confirm("Una vez enviada, esta versión no podrá editarse. Si el cliente pide cambios, deberás crear una nueva versión. ¿Enviar propuesta?");
    if (!confirmed) return;
    const lead = selectedLead();
    await runProposalAction(
        { action: "send", proposalId: proposal.id },
        result => proposalSendSuccessMessage(result, lead),
        { pendingMessage: "Enviando propuesta…" }
    );
}

async function createProposalRevision(proposal) {
    if (!proposal || proposal.status !== "sent" || state.isProposalSaving) return;
    const confirmed = window.confirm("Se creará una nueva versión editable. El enlace anterior dejará de estar vigente. ¿Continuar?");
    if (!confirmed) return;
    await runProposalAction({ action: "create_revision", proposalId: proposal.id }, "Nueva versión creada. Ya podés editar el borrador.");
}

async function declineProposal(proposal) {
    if (!proposal || proposal.status !== "sent" || state.isProposalSaving) return;
    const confirmed = window.confirm("La propuesta se marcará como no avanza. Esta acción no elimina información. ¿Continuar?");
    if (!confirmed) return;
    await runProposalAction({ action: "decline", proposalId: proposal.id }, "Propuesta marcada como no avanza.");
}

async function copyProposalLink(proposal) {
    const link = proposalPublicUrl(proposal);
    if (!link) return;

    try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            await navigator.clipboard.writeText(link);
        } else if (!copyTextFallback(link)) {
            throw new Error("clipboard_unavailable");
        }
        state.proposalMessage = "Enlace copiado.";
    } catch {
        state.proposalMessage = "No pudimos copiar el enlace. Podés abrirlo y copiarlo desde la nueva pestaña.";
    }
    syncProposalControls();
}

function copyTextFallback(text) {
    const control = document.createElement("textarea");
    control.value = text;
    control.setAttribute("readonly", "");
    control.style.position = "fixed";
    control.style.opacity = "0";
    document.body.append(control);
    control.select();
    const copied = document.execCommand("copy");
    control.remove();
    return copied;
}

function createDetailSection(title) {
    const section = createElement("section", "detail-section");
    section.append(createElement("h3", "", title));
    return section;
}

function appendDetailRow(container, label, value, preserveWhitespace = false) {
    const row = createElement("div", "detail-data-row");
    row.append(createElement("span", "detail-data-label", label));
    const valueElement = createElement("span", "detail-data-value" + (value === "No informado" || value === "Sin comentario" ? " is-muted" : ""), value);
    if (preserveWhitespace) valueElement.style.whiteSpace = "pre-wrap";
    row.append(valueElement);
    container.append(row);
}

function createDiagnosticGroup(label, group, value) {
    const section = createElement("section", "diagnostic-group");
    section.append(createElement("span", "diagnostic-label", label));
    const labels = humanLabels(group, value);

    if (!labels.length) {
        section.append(createElement("span", "detail-data-value is-muted", "No informado"));
        return section;
    }

    const list = createElement("ul", "diagnostic-list");
    labels.forEach(item => list.append(createElement("li", "", item)));
    section.append(list);
    return section;
}

function allowedManualStatuses(lead) {
    const proposal = currentProposal(lead);
    if (!proposal) return null;
    if (proposal.status === "draft") return ["reviewing"];
    if (proposal.status === "sent") return ["proposal_sent"];
    if (proposal.status === "declined") return ["declined"];
    if (proposal.status === "accepted") {
        return operationalStatus(lead) === "in_project" ? ["in_project"] : ["accepted", "in_project"];
    }
    return null;
}

function renderManagementSection(lead) {
    const section = createDetailSection("Gestión NODO");
    const permittedStatuses = allowedManualStatuses(lead);

    const statusField = createElement("label", "field");
    statusField.append(createElement("span", "", "Estado"));
    const select = document.createElement("select");
    select.name = "lead_status";
    STATUS_OPTIONS.forEach(option => {
        const choice = document.createElement("option");
        choice.value = option.id;
        choice.textContent = option.label;
        choice.disabled = Boolean(permittedStatuses && !permittedStatuses.includes(option.id));
        select.append(choice);
    });
    select.value = state.draft.leadStatus;
    select.disabled = state.isSaving || state.isProposalSaving || permittedStatuses?.length === 1;
    select.addEventListener("change", () => {
        state.draft.leadStatus = select.value;
        state.draft.dirty = true;
        state.managementMessage = "";
        syncManagementControls();
    });
    statusField.append(select);

    if (permittedStatuses) {
        const explanation = createElement("p", "management-lock-note", "Este estado se gestiona desde la propuesta.");
        if (currentProposal(lead)?.status === "accepted" && permittedStatuses.length > 1) {
            explanation.textContent = "La propuesta gestiona la aceptación. Cuando comience el trabajo, podés pasar el lead a En proyecto.";
        }
        statusField.append(explanation);
    }

    const noteField = createElement("label", "field");
    noteField.style.marginTop = "15px";
    noteField.append(createElement("span", "", "Nota interna"));
    const notes = document.createElement("textarea");
    notes.name = "internal_notes";
    notes.placeholder = "Ej.: pidió que lo contactemos después de las 18…";
    notes.value = state.draft.internalNotes;
    notes.disabled = state.isSaving || state.isProposalSaving;
    notes.addEventListener("input", () => {
        state.draft.internalNotes = notes.value;
        state.draft.dirty = true;
        state.managementMessage = "";
        syncManagementControls();
    });
    noteField.append(notes);

    const updated = createElement("p", "management-message", lead.management?.updated_at ? "Última actualización: " + formatDateTime(lead.management.updated_at) : "Todavía no hay gestión interna guardada.");
    updated.style.color = "var(--admin-muted)";

    const message = createElement("p", "management-message" + (state.managementMessage.startsWith("No pudimos") ? " is-error" : ""), state.managementMessage);
    message.id = "management-message";
    message.setAttribute("role", "status");

    const save = createButton(state.isSaving ? "Guardando…" : "Guardar cambios", "button button-primary detail-save", saveManagement);
    save.id = "save-management";
    save.disabled = state.isSaving || state.isProposalSaving || !state.draft.dirty;

    section.append(statusField, noteField, updated, message, save);
    return section;
}

function syncManagementControls() {
    const save = document.getElementById("save-management");
    if (save) save.disabled = state.isSaving || state.isProposalSaving || !state.draft?.dirty;
    const message = document.getElementById("management-message");
    if (message) {
        message.textContent = state.managementMessage;
        message.classList.toggle("is-error", state.managementMessage.startsWith("No pudimos"));
    }
}

async function saveManagement() {
    const lead = selectedLead();
    if (!lead || !state.draft || state.isSaving || state.isProposalSaving) return;

    state.isSaving = true;
    state.managementMessage = "";
    renderApp();

    const payload = {
        lead_id: lead.id,
        lead_status: state.draft.leadStatus,
        internal_notes: state.draft.internalNotes
    };

    try {
        const { data, error } = await supabaseClient
            .from("lead_management")
            .upsert(payload, { onConflict: "lead_id" })
            .select("lead_id, lead_status, internal_notes, created_at, updated_at")
            .single();

        if (error) throw error;

        lead.management = data;
        state.draft = {
            leadId: lead.id,
            leadStatus: data.lead_status,
            internalNotes: data.internal_notes || "",
            dirty: false
        };
        state.managementMessage = "Cambios guardados.";
    } catch (error) {
        console.error("No se pudieron guardar los cambios de gestión.", error);
        if (isSessionError(error)) {
            await terminateSession("Tu sesión venció. Ingresá nuevamente.");
            return;
        }
        state.managementMessage = "No pudimos guardar los cambios. Intentá nuevamente.";
    } finally {
        state.isSaving = false;
        if (state.screen === "dashboard") renderApp();
    }
}

function whatsappDestination(whatsapp) {
    const digits = String(whatsapp || "").replace(/\D/g, "");
    if (!digits) return "";

    let destination = digits;
    if (digits.startsWith("549")) {
        destination = digits;
    } else if (/^11\d{8}$/.test(digits)) {
        destination = "549" + digits;
    } else if (/^0?11(?:15)?\d{8}$/.test(digits)) {
        const local = digits.replace(/^0/, "").replace(/^11(?:15)?/, "11");
        destination = "549" + local;
    } else if (digits.length < 10 || digits.length > 15) {
        return "";
    }

    return destination;
}

function createWhatsAppUrl(whatsapp, name) {
    const destination = whatsappDestination(whatsapp);
    if (!destination) return "";

    const greeting = "Hola " + displayValue(name, "" , "") + ", soy Maxi de NODO. Estuve revisando la consulta que nos enviaste…";
    return "https://wa.me/" + destination + "?text=" + encodeURIComponent(greeting);
}

function createProposalWhatsAppUrl(lead, proposal) {
    const destination = whatsappDestination(lead?.whatsapp);
    const proposalUrl = proposalPublicUrl(proposal);
    if (!destination || !proposalUrl) return "";

    const name = typeof lead?.name === "string" && lead.name.trim() ? lead.name.trim() : "";
    const greeting = name ? "Hola " + name + " 👋" : "Hola 👋";
    const message = [
        greeting,
        "",
        "Ya preparamos la propuesta para tu proyecto en NODO.",
        "",
        "Podés revisarla acá:",
        proposalUrl,
        "",
        "Si querés conversar algún detalle, escribinos."
    ].join("\n");
    return "https://wa.me/" + destination + "?text=" + encodeURIComponent(message);
}

async function handleLogout() {
    if (state.isTerminatingSession) return;
    await terminateSession("");
}

async function terminateSession(message) {
    if (state.isTerminatingSession) return;

    state.isTerminatingSession = true;
    clearPrivateState();
    state.session = null;
    state.user = null;
    state.screen = "checking-session";
    renderApp();

    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.warn("No se pudo cerrar la sesión del panel.", error);
    } finally {
        state.isTerminatingSession = false;
        state.authMessage = message;
        state.screen = "login";
        renderApp();
    }
}

function setupSessionListener() {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "TOKEN_REFRESHED") {
            state.session = session;
            return;
        }

        if (event !== "SIGNED_OUT" || state.isTerminatingSession) return;

        clearPrivateState();
        state.session = null;
        state.user = null;
        state.authMessage = "Tu sesión venció. Ingresá nuevamente.";
        state.screen = "login";
        renderApp();
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && state.selectedLeadId) {
            event.preventDefault();
            requestCloseDetail();
        }
    });
}

async function boot() {
    renderApp();
    if (!supabaseClient) {
        state.screen = "login";
        state.authMessage = "No pudimos iniciar el panel. Intentá actualizar la página.";
        renderApp();
        return;
    }

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.warn("No se pudo comprobar la sesión del panel.", error);
        state.screen = "login";
        state.authMessage = "No pudimos comprobar la sesión. Intentá nuevamente.";
        renderApp();
        return;
    }

    if (!data.session) {
        state.screen = "login";
        renderApp();
        return;
    }

    await authorizeSession(data.session);
}

if (supabaseClient) setupSessionListener();
setupKeyboardShortcuts();
boot();
