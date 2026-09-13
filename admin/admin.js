const SUPABASE_URL = "https://pmrrudtwsgqyncstfdrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XhjenDP8bMVfuEUl02h6XA_ZkJLCnn_";

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
    isTerminatingSession: false,
    managementMessage: ""
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
    state.managementMessage = "";
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
    if (state.isLoading || state.isSaving) return;

    state.isLoading = true;
    state.loadError = false;
    if (!refresh) state.screen = "loading-leads";
    renderApp();

    try {
        const { data: leads, error: leadsError } = await supabaseClient
            .from("leads")
            .select("id, created_at, name, email, whatsapp, business_name, no_business_name, comment, advisor_goals, advisor_today, advisor_content, advisor_start, advisor_commerce_need, recommended_plan_name, recommended_price, marketing_email_consent")
            .order("created_at", { ascending: false })
            .limit(100);

        if (leadsError) throw leadsError;

        const leadIds = (leads || []).map(lead => lead.id);
        let managementRows = [];

        if (leadIds.length) {
            const { data, error } = await supabaseClient
                .from("lead_management")
                .select("lead_id, lead_status, internal_notes, created_at, updated_at")
                .in("lead_id", leadIds);

            if (error) throw error;
            managementRows = data || [];
        }

        const managementByLeadId = new Map(managementRows.map(row => [row.lead_id, row]));
        state.leads = (leads || []).map(lead => ({
            ...lead,
            management: managementByLeadId.get(lead.id) || null
        }));
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
    refresh.disabled = state.isLoading || state.isSaving;
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
    logout.disabled = state.isLoading || state.isSaving || state.isTerminatingSession;
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
    if (state.selectedLeadId && state.selectedLeadId !== leadId && state.draft?.dirty) {
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
    renderApp();
    document.querySelector(".detail-close")?.focus();
}

function requestCloseDetail() {
    if (!state.selectedLeadId) return;
    if (state.isSaving) return;

    if (state.draft?.dirty) {
        const discard = window.confirm("Tenés cambios sin guardar. ¿Querés descartarlos?");
        if (!discard) return;
    }

    state.selectedLeadId = null;
    state.draft = null;
    state.managementMessage = "";
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

    const detail = createElement("aside", "lead-detail");
    detail.setAttribute("aria-label", "Detalle de consulta");
    detail.tabIndex = -1;

    const header = createElement("header", "detail-header");
    const title = createElement("div", "");
    title.append(createElement("h2", "", displayValue(lead.name, "Consulta")));
    title.append(createElement("p", "", formatDate(lead.created_at)));
    const close = createButton("×", "detail-close", requestCloseDetail);
    close.setAttribute("aria-label", "Cerrar detalle de consulta");
    close.disabled = state.isSaving;
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

function renderManagementSection(lead) {
    const section = createDetailSection("Gestión NODO");

    const statusField = createElement("label", "field");
    statusField.append(createElement("span", "", "Estado"));
    const select = document.createElement("select");
    select.name = "lead_status";
    STATUS_OPTIONS.forEach(option => {
        const choice = document.createElement("option");
        choice.value = option.id;
        choice.textContent = option.label;
        select.append(choice);
    });
    select.value = state.draft.leadStatus;
    select.disabled = state.isSaving;
    select.addEventListener("change", () => {
        state.draft.leadStatus = select.value;
        state.draft.dirty = true;
        state.managementMessage = "";
        syncManagementControls();
    });
    statusField.append(select);

    const noteField = createElement("label", "field");
    noteField.style.marginTop = "15px";
    noteField.append(createElement("span", "", "Nota interna"));
    const notes = document.createElement("textarea");
    notes.name = "internal_notes";
    notes.placeholder = "Ej.: pidió que lo contactemos después de las 18…";
    notes.value = state.draft.internalNotes;
    notes.disabled = state.isSaving;
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
    save.disabled = state.isSaving || !state.draft.dirty;

    section.append(statusField, noteField, updated, message, save);
    return section;
}

function syncManagementControls() {
    const save = document.getElementById("save-management");
    if (save) save.disabled = state.isSaving || !state.draft?.dirty;
    const message = document.getElementById("management-message");
    if (message) {
        message.textContent = state.managementMessage;
        message.classList.toggle("is-error", state.managementMessage.startsWith("No pudimos"));
    }
}

async function saveManagement() {
    const lead = selectedLead();
    if (!lead || !state.draft || state.isSaving) return;

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

function createWhatsAppUrl(whatsapp, name) {
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

    const greeting = "Hola " + displayValue(name, "" , "") + ", soy Maxi de NODO. Estuve revisando la consulta que nos enviaste…";
    return "https://wa.me/" + destination + "?text=" + encodeURIComponent(greeting);
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
