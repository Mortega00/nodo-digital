(() => {
  "use strict";

  const properties = window.RAICES_PROPERTIES || [];
  const config = window.RAICES_CONFIG || {};
  const images = window.RAICES_IMAGES || {};
  const root = document.body.dataset.root || "./";
  const page = document.body.dataset.page || "home";
  const isFilePreview = window.location.protocol === "file:";

  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;"
  })[character]);
  const textValue = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const route = path => `${root}${path}`;
  const propertiesRoute = () => route(isFilePreview ? "propiedades/index.html" : "propiedades/");
  const propertyRoute = id => `${route(isFilePreview ? "propiedad/index.html" : "propiedad/")}?id=${encodeURIComponent(id)}`;
  const formatNumber = value => new Intl.NumberFormat("es-AR").format(value);
  const formatPrice = property => `${property.currency} ${formatNumber(property.price)}${property.operation === "alquiler" ? " / mes" : ""}`;
  const operationLabel = operation => operation === "alquiler" ? "Alquiler" : "Venta";
  const propertyTypeLabel = type => ({ departamento: "Departamento", casa: "Casa", ph: "PH", terreno: "Terreno" })[type] || type;
  const propertyImages = property => images[property.imageSet] || [];
  const brandMark = `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M6 7v12a6 6 0 0 0 6 6h14"></path><path d="M26 7v5a5 5 0 0 1-5 5H11"></path><circle cx="16" cy="17" r="2.7"></circle></svg></span>`;

  function headerMarkup() {
    const active = page === "properties" || page === "property" ? "properties" : page;
    const navigation = [
      ["home", route(""), "Inicio"],
      ["properties", propertiesRoute(), "Propiedades"],
      ["zones", route("#zonas"), "Zonas"],
      ["about", route("#nosotros"), "Nosotros"],
      ["valuation", route("#tasacion"), "Tasá tu propiedad"]
    ];
    const navLinks = navigation.map(([id, href, label]) => `<a href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`).join("");
    return `
      <header class="site-header" data-site-header>
        <div class="container header-inner">
          <a class="brand" href="${route("")}" aria-label="Raíces Urbanas, ir al inicio">
            ${brandMark}
            <span class="brand-name"><strong>RAÍCES URBANAS</strong><small>INMOBILIARIA</small></span>
          </a>
          <nav class="desktop-nav" aria-label="Navegación principal">${navLinks}</nav>
          <div class="header-actions">
            <a class="button button-primary header-cta" href="${route("#contacto")}">Contactar</a>
            <button class="menu-toggle" type="button" aria-label="Abrir menú" aria-controls="ru-mobile-menu" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
        </div>
        <div class="mobile-menu" id="ru-mobile-menu" hidden><nav class="container" aria-label="Navegación móvil">${navLinks}<a href="${route("#contacto")}">Contactar</a></nav></div>
      </header>`;
  }

  function footerMarkup() {
    return `<footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand" href="${route("")}" aria-label="Raíces Urbanas, ir al inicio">${brandMark}<span class="brand-name"><strong>RAÍCES URBANAS</strong><small>INMOBILIARIA</small></span></a>
          <p>Una experiencia inmobiliaria clara para explorar propiedades en CABA y Zona Sur.</p>
        </div>
        <nav class="footer-nav" aria-label="Navegación secundaria"><a href="${propertiesRoute()}">Propiedades</a><a href="${route("#zonas")}">Zonas</a><a href="${route("#tasacion")}">Tasá tu propiedad</a></nav>
        <nav class="footer-nav" aria-label="Contacto"><a href="${whatsAppLink("Quiero hacer una consulta sobre una propiedad.")}" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="${route("#contacto")}">Contactar</a><a href="${route("#nosotros")}">Nosotros</a></nav>
      </div>
      <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Raíces Urbanas</span><span>Demo desarrollada por NODO · Datos, precios e imágenes de referencia.</span></div>
    </footer>`;
  }

  function whatsAppLink(message) {
    const phone = String(config.whatsapp || "").replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function initChrome() {
    const headerTarget = document.querySelector("[data-header]");
    const footerTarget = document.querySelector("[data-footer]");
    if (headerTarget) headerTarget.innerHTML = headerMarkup();
    if (footerTarget) footerTarget.innerHTML = footerMarkup();
    document.querySelectorAll("[data-properties-link]").forEach(link => { link.href = propertiesRoute(); });

    const header = document.querySelector("[data-site-header]");
    if (header) {
      const updateHeader = () => header.classList.toggle("is-compact", window.scrollY > 14);
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
    }

    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("ru-mobile-menu");
    if (!toggle || !menu) return;
    const setMenu = open => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menu.hidden = !open;
      document.body.classList.toggle("ru-menu-open", open);
      if (open) menu.querySelector("a")?.focus();
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1059 && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  function priceOptions(operation, selected = "") {
    const isRent = operation === "alquiler";
    const labels = isRent
      ? [["", "Cualquier precio"], ["low", "Hasta ARS 800.000"], ["middle", "ARS 800.000 a 1.100.000"], ["high", "Más de ARS 1.100.000"]]
      : [["", "Cualquier precio"], ["low", "Hasta USD 150.000"], ["middle", "USD 150.000 a 250.000"], ["high", "Más de USD 250.000"]];
    return labels.map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join("");
  }

  function basicFilterFields(prefix, filters = {}, options = {}) {
    const { includeSubmit = true, isAdvanced = false } = options;
    const operation = filters.operation || "venta";
    return `<div class="field"><label for="${prefix}-location">Ubicación</label><input id="${prefix}-location" name="location" type="search" value="${escapeHTML(filters.location || "")}" placeholder="Barrio, localidad o zona"></div>
      <div class="field"><label for="${prefix}-type">Tipo</label><select id="${prefix}-type" name="propertyType"><option value="">Todos</option><option value="departamento"${filters.propertyType === "departamento" ? " selected" : ""}>Departamento</option><option value="casa"${filters.propertyType === "casa" ? " selected" : ""}>Casa</option><option value="ph"${filters.propertyType === "ph" ? " selected" : ""}>PH</option><option value="terreno"${filters.propertyType === "terreno" ? " selected" : ""}>Terreno</option></select></div>
      <div class="field"><label for="${prefix}-rooms">Ambientes</label><select id="${prefix}-rooms" name="rooms"><option value="">Todos</option><option value="1"${filters.rooms === "1" ? " selected" : ""}>1</option><option value="2"${filters.rooms === "2" ? " selected" : ""}>2</option><option value="3"${filters.rooms === "3" ? " selected" : ""}>3</option><option value="4"${filters.rooms === "4" ? " selected" : ""}>4+</option></select></div>
      <div class="field"><label for="${prefix}-price">Precio</label><select id="${prefix}-price" name="price">${priceOptions(operation, filters.price || "")}</select></div>
      ${includeSubmit ? '<button class="button button-primary search-submit" type="submit">Buscar propiedades <span aria-hidden="true">→</span></button>' : ""}
      ${isAdvanced ? advancedFilterFields(prefix, filters) : ""}`;
  }

  function advancedFilterFields(prefix, filters = {}) {
    const checked = name => filters[name] ? " checked" : "";
    return `<div class="field"><label for="${prefix}-bedrooms">Dormitorios</label><select id="${prefix}-bedrooms" name="bedrooms"><option value="">Cualquiera</option><option value="1"${filters.bedrooms === "1" ? " selected" : ""}>1+</option><option value="2"${filters.bedrooms === "2" ? " selected" : ""}>2+</option><option value="3"${filters.bedrooms === "3" ? " selected" : ""}>3+</option></select></div>
      <div class="field"><label for="${prefix}-bathrooms">Baños</label><select id="${prefix}-bathrooms" name="bathrooms"><option value="">Cualquiera</option><option value="1"${filters.bathrooms === "1" ? " selected" : ""}>1+</option><option value="2"${filters.bathrooms === "2" ? " selected" : ""}>2+</option><option value="3"${filters.bathrooms === "3" ? " selected" : ""}>3+</option></select></div>
      <div class="field"><label for="${prefix}-min-area">Sup. mínima</label><input id="${prefix}-min-area" name="minArea" inputmode="numeric" value="${escapeHTML(filters.minArea || "")}" placeholder="m²"></div>
      <div class="field"><label for="${prefix}-max-area">Sup. máxima</label><input id="${prefix}-max-area" name="maxArea" inputmode="numeric" value="${escapeHTML(filters.maxArea || "")}" placeholder="m²"></div>
      <div class="check-fields" aria-label="Características adicionales">
        <label class="check-field"><input type="checkbox" name="parking"${checked("parking")}> Cochera</label>
        <label class="check-field"><input type="checkbox" name="patio"${checked("patio")}> Patio</label>
        <label class="check-field"><input type="checkbox" name="garden"${checked("garden")}> Jardín</label>
        <label class="check-field"><input type="checkbox" name="balcony"${checked("balcony")}> Balcón</label>
        <label class="check-field"><input type="checkbox" name="terrace"${checked("terrace")}> Terraza</label>
        <label class="check-field"><input type="checkbox" name="pool"${checked("pool")}> Pileta</label>
      </div>`;
  }

  function homeSearchMarkup() {
    return `<form class="search-panel" data-home-search>
      <div class="search-panel-top"><div class="operation-tabs" role="tablist" aria-label="Tipo de operación"><button class="operation-tab" type="button" role="tab" aria-selected="true" data-operation="venta">Comprar</button><button class="operation-tab" type="button" role="tab" aria-selected="false" data-operation="alquiler">Alquilar</button></div><a class="sell-link" href="#tasacion">Quiero vender <span aria-hidden="true">→</span></a></div>
      <input name="operation" type="hidden" value="venta">
      <div class="search-fields">${basicFilterFields("home", { operation: "venta" })}</div>
      <button class="more-filters-toggle" type="button" aria-controls="home-advanced" aria-expanded="false">Más filtros <span aria-hidden="true">+</span></button>
      <div class="advanced-filters" id="home-advanced" hidden>${advancedFilterFields("home", { operation: "venta" })}</div>
    </form>`;
  }

  function propertyCard(property, loading = "lazy") {
    const cardImages = propertyImages(property);
    const image = cardImages[0] || "";
    const detailURL = propertyRoute(property.id);
    const metadata = [`${property.rooms} amb.`, `${property.bedrooms} dorm.`, `${property.totalArea} m²`];
    if (property.parking) metadata.push("Coch.");
    return `<a class="property-card" href="${detailURL}" aria-label="Ver ${escapeHTML(property.title)}">
      <div class="property-card-media"><img src="${image}" alt="Imagen temporal de referencia para ${escapeHTML(property.title)}" width="800" height="590" loading="${loading}" decoding="async"><span class="property-tag">${operationLabel(property.operation).toUpperCase()}</span>${property.featured ? '<span class="property-featured">DESTACADA</span>' : ""}</div>
      <div class="property-card-body"><p class="property-price">${formatPrice(property)}</p><h3>${escapeHTML(property.title)}</h3><p class="property-place">${escapeHTML(property.neighborhood)} · ${escapeHTML(property.region)}</p><p class="property-meta">${metadata.join(" · ")}</p></div>
    </a>`;
  }

  function initHome() {
    document.querySelectorAll("[data-properties-location]").forEach(link => {
      link.href = `${propertiesRoute()}?location=${encodeURIComponent(link.dataset.propertiesLocation)}`;
    });
    document.querySelectorAll("[data-ru-image]").forEach(image => {
      image.src = images[image.dataset.ruImage] || "";
    });
    document.querySelectorAll("[data-ru-zone-image]").forEach(image => {
      image.src = images.zones?.[image.dataset.ruZoneImage] || "";
    });
    const searchSlot = document.querySelector("[data-home-search-slot]");
    if (searchSlot) searchSlot.innerHTML = homeSearchMarkup();
    const featuredTarget = document.querySelector("[data-featured-properties]");
    if (featuredTarget) {
      const order = ["RU-005", "RU-001", "RU-008", "RU-002"];
      featuredTarget.innerHTML = order.map(id => properties.find(property => property.id === id)).filter(Boolean).map((property, index) => propertyCard(property, index === 0 ? "eager" : "lazy")).join("");
    }
    const searchForm = document.querySelector("[data-home-search]");
    if (searchForm) {
      const operationInput = searchForm.elements.operation;
      const price = searchForm.elements.price;
      searchForm.querySelectorAll("[data-operation]").forEach(tab => {
        tab.addEventListener("click", () => {
          const operation = tab.dataset.operation;
          operationInput.value = operation;
          searchForm.querySelectorAll("[data-operation]").forEach(item => item.setAttribute("aria-selected", String(item === tab)));
          price.innerHTML = priceOptions(operation);
        });
      });
      const moreToggle = searchForm.querySelector(".more-filters-toggle");
      const advanced = searchForm.querySelector("#home-advanced");
      moreToggle?.addEventListener("click", () => {
        const nextOpen = advanced.hidden;
        advanced.hidden = !nextOpen;
        moreToggle.setAttribute("aria-expanded", String(nextOpen));
        moreToggle.innerHTML = `Más filtros <span aria-hidden="true">${nextOpen ? "−" : "+"}</span>`;
      });
      searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const filters = readForm(searchForm);
        window.location.href = `${propertiesRoute()}${serializeFilters(filters)}`;
      });
    }
    initValuationForm();
  }

  function readFilters() {
    const params = new URLSearchParams(window.location.search);
    const names = ["operation", "location", "propertyType", "rooms", "price", "bedrooms", "bathrooms", "minArea", "maxArea", "parking", "patio", "garden", "balcony", "terrace", "pool"];
    return names.reduce((filterSet, name) => {
      const value = params.get(name);
      if (value) filterSet[name] = value;
      return filterSet;
    }, {});
  }

  function readForm(form) {
    const formData = new FormData(form);
    const names = ["operation", "location", "propertyType", "rooms", "price", "bedrooms", "bathrooms", "minArea", "maxArea", "parking", "patio", "garden", "balcony", "terrace", "pool"];
    return names.reduce((filterSet, name) => {
      const value = formData.get(name);
      if (value && String(value).trim()) filterSet[name] = String(value).trim();
      return filterSet;
    }, {});
  }

  function serializeFilters(filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const result = params.toString();
    return result ? `?${result}` : "";
  }

  function matchesFeature(property, feature) {
    const aliases = { garden: "jardin", balcony: "balcon", terrace: "terraza", pool: "pileta", patio: "patio" };
    const needle = aliases[feature];
    return property.amenities.some(amenity => textValue(amenity).includes(needle));
  }

  function matchesPrice(property, tier) {
    if (!tier) return true;
    const thresholds = property.currency === "ARS" ? [800000, 1100000] : [150000, 250000];
    if (tier === "low") return property.price <= thresholds[0];
    if (tier === "middle") return property.price > thresholds[0] && property.price <= thresholds[1];
    return property.price > thresholds[1];
  }

  function filterProperties(filters) {
    return properties.filter(property => {
      if (filters.operation && property.operation !== filters.operation) return false;
      if (filters.location) {
        const search = textValue(filters.location);
        if (!textValue(`${property.neighborhood} ${property.region}`).includes(search)) return false;
      }
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.rooms && (filters.rooms === "4" ? property.rooms < 4 : property.rooms !== Number(filters.rooms))) return false;
      if (!matchesPrice(property, filters.price)) return false;
      if (filters.bedrooms && property.bedrooms < Number(filters.bedrooms)) return false;
      if (filters.bathrooms && property.bathrooms < Number(filters.bathrooms)) return false;
      if (filters.minArea && property.totalArea < Number(filters.minArea)) return false;
      if (filters.maxArea && property.totalArea > Number(filters.maxArea)) return false;
      if (filters.parking && !property.parking) return false;
      return ["patio", "garden", "balcony", "terrace", "pool"].every(feature => !filters[feature] || matchesFeature(property, feature));
    });
  }

  function sortProperties(list, mode) {
    const values = [...list];
    if (mode === "price-low") return values.sort((a, b) => a.price - b.price);
    if (mode === "price-high") return values.sort((a, b) => b.price - a.price);
    if (mode === "area") return values.sort((a, b) => b.totalArea - a.totalArea);
    return values.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id));
  }

  function filterPanelMarkup(filters) {
    const selectedOperation = filters.operation || "";
    return `<aside class="filter-panel" data-filter-panel aria-label="Filtros de propiedades">
      <button class="filter-close" type="button" data-close-filters>Cerrar</button><h2>Filtrar propiedades</h2>
      <form class="filter-form" data-results-filter>
        <div class="field"><label for="results-operation">Operación</label><select id="results-operation" name="operation"><option value="">Comprar o alquilar</option><option value="venta"${selectedOperation === "venta" ? " selected" : ""}>Comprar</option><option value="alquiler"${selectedOperation === "alquiler" ? " selected" : ""}>Alquilar</option></select></div>
        ${basicFilterFields("results", { ...filters, operation: selectedOperation || "venta" }, { includeSubmit: false, isAdvanced: true })}
        <div class="filter-actions"><button class="button button-primary" type="submit">Aplicar filtros</button><button class="button-quiet" type="button" data-clear-filters>Limpiar filtros</button></div>
      </form>
    </aside>`;
  }

  function resultsHeading(filters) {
    if (filters.location) return `Propiedades en ${escapeHTML(filters.location)}`;
    if (filters.operation === "venta") return "Propiedades en venta";
    if (filters.operation === "alquiler") return "Propiedades en alquiler";
    return "Todas las propiedades";
  }

  function activeFilterChips(filters) {
    const priceLabels = filters.operation === "alquiler"
      ? { low: "Hasta ARS 800.000", middle: "ARS 800.000 a 1.100.000", high: "Más de ARS 1.100.000" }
      : { low: "Hasta USD 150.000", middle: "USD 150.000 a 250.000", high: "Más de USD 250.000" };
    const labels = {
      operation: filters.operation ? (filters.operation === "venta" ? "Comprar" : "Alquilar") : "",
      location: filters.location,
      propertyType: filters.propertyType ? propertyTypeLabel(filters.propertyType) : "",
      rooms: filters.rooms ? `${filters.rooms}${filters.rooms === "4" ? "+" : ""} amb.` : "",
      price: filters.price ? priceLabels[filters.price] : "",
      bedrooms: filters.bedrooms ? `${filters.bedrooms}+ dorm.` : "",
      bathrooms: filters.bathrooms ? `${filters.bathrooms}+ baños` : "",
      minArea: filters.minArea ? `Desde ${filters.minArea} m²` : "",
      maxArea: filters.maxArea ? `Hasta ${filters.maxArea} m²` : "",
      parking: filters.parking ? "Cochera" : "",
      patio: filters.patio ? "Patio" : "",
      garden: filters.garden ? "Jardín" : "",
      balcony: filters.balcony ? "Balcón" : "",
      terrace: filters.terrace ? "Terraza" : "",
      pool: filters.pool ? "Pileta" : ""
    };
    return Object.entries(labels).filter(([, label]) => label).map(([key, label]) => ({ key, label }));
  }

  function activeFiltersMarkup(filters) {
    const chips = activeFilterChips(filters);
    if (!chips.length) return "";
    return `<div class="active-filter-summary" aria-label="Filtros activos"><span>Filtros activos</span>${chips.map(({ key, label }) => `<button type="button" data-remove-filter="${key}" aria-label="Quitar filtro ${escapeHTML(label)}">${escapeHTML(label)} <b aria-hidden="true">×</b></button>`).join("")}</div>`;
  }

  function updateResultsUrl(filters) {
    const url = `${propertiesRoute()}${serializeFilters(filters)}`;
      if (isFilePreview) {
      window.location.assign(url);
      return true;
    }
    window.history.replaceState({}, "", url);
    return false;
  }

  function initResults() {
    const target = document.querySelector("[data-results-page]");
    if (!target) return;
    let filters = readFilters();
    let sortMode = "recent";
    target.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-filter]");
      if (!button || !target.contains(button)) return;
      event.preventDefault();
      const nextFilters = { ...filters };
      delete nextFilters[button.dataset.removeFilter];
      filters = nextFilters;
      if (!updateResultsUrl(filters)) render();
    });
    const render = () => {
      const canSortByPrice = Boolean(filters.operation);
      if (!canSortByPrice && ["price-low", "price-high"].includes(sortMode)) sortMode = "recent";
      const results = sortProperties(filterProperties(filters), sortMode);
      document.title = `${resultsHeading(filters).replace(/<[^>]*>/g, "")} | Raíces Urbanas · Demo NODO`;
    target.innerHTML = `<section class="page-intro"><div class="container"><div class="breadcrumb"><a href="${route("")}">Inicio</a><span aria-hidden="true">/</span><span>Propiedades</span></div><h1>${resultsHeading(filters)}</h1><p>Explorá opciones seleccionadas en CABA y Zona Sur. Los datos son parte de esta demostración.</p></div></section>
        <section class="section"><div class="container results-layout">${filterPanelMarkup(filters)}<div><div class="results-toolbar"><div><button class="button button-secondary mobile-filter-trigger" type="button" data-open-filters>Filtros</button><h2>${results.length} ${results.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}</h2><p>${filters.operation ? `Mostrando opciones para ${operationLabel(filters.operation).toLowerCase()}.` : "Usá los filtros para encontrar una opción."}</p></div><div class="sort-field"><label for="sort-properties">Ordenar por</label><select id="sort-properties" data-sort><option value="recent"${sortMode === "recent" ? " selected" : ""}>Más recientes</option><option value="price-low"${sortMode === "price-low" ? " selected" : ""}${canSortByPrice ? "" : " disabled"}>Menor precio${canSortByPrice ? "" : " · elegí operación"}</option><option value="price-high"${sortMode === "price-high" ? " selected" : ""}${canSortByPrice ? "" : " disabled"}>Mayor precio${canSortByPrice ? "" : " · elegí operación"}</option><option value="area"${sortMode === "area" ? " selected" : ""}>Mayor superficie</option></select>${canSortByPrice ? "" : '<p class="sort-hint">Elegí Comprar o Alquilar para ordenar por precio.</p>'}</div></div>${activeFiltersMarkup(filters)}
          ${results.length ? `<div class="property-grid">${results.map(property => propertyCard(property)).join("")}</div>` : `<div class="empty-state"><div><p class="eyebrow">SIN COINCIDENCIAS</p><h3>No encontramos propiedades con esos criterios.</h3><p>Probá ampliando tu búsqueda o quitando algunos filtros.</p><button class="button button-primary" type="button" data-clear-filters>Limpiar filtros</button></div></div>`}
        </div></div></section>`;
      bindResultsEvents();
    };
    const updatePriceSelect = form => {
      const operation = form.elements.operation.value || "venta";
      const price = form.elements.price;
      const current = price.value;
      price.innerHTML = priceOptions(operation, current);
    };
    const bindResultsEvents = () => {
      const form = target.querySelector("[data-results-filter]");
      const panel = target.querySelector("[data-filter-panel]");
      form?.addEventListener("submit", event => {
        event.preventDefault();
        filters = readForm(form);
        const navigating = updateResultsUrl(filters);
        if (!navigating) render();
        panel?.classList.remove("is-open");
        document.body.classList.remove("ru-menu-open");
      });
      form?.elements.operation.addEventListener("change", () => updatePriceSelect(form));
      target.querySelectorAll("[data-clear-filters]").forEach(button => button.addEventListener("click", () => {
        filters = {};
        if (!updateResultsUrl(filters)) render();
      }));
      target.querySelector("[data-sort]")?.addEventListener("change", event => { sortMode = event.target.value; render(); });
      target.querySelector("[data-open-filters]")?.addEventListener("click", () => {
        panel?.classList.add("is-open");
        document.body.classList.add("ru-menu-open");
        panel?.querySelector("select, input")?.focus();
      });
      target.querySelector("[data-close-filters]")?.addEventListener("click", () => {
        panel?.classList.remove("is-open");
        document.body.classList.remove("ru-menu-open");
      });
    };
    render();
  }

  function initProperty() {
    const target = document.querySelector("[data-property-page]");
    if (!target) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const property = properties.find(item => item.id === id) || properties[0];
    if (!property) return;
    document.title = `${property.title} | Raíces Urbanas · Demo NODO`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${property.title}. Ficha demostrativa de Raíces Urbanas.`;
    const gallery = propertyImages(property);
    const facts = [
      [`${property.rooms} ambientes`, "Ambientes"], [`${property.bedrooms} dormitorios`, "Dormitorios"], [`${property.bathrooms} baños`, "Baños"],
      [property.parking ? (property.parkingLabel || "Cochera") : "Sin cochera", "Cochera"], [`${property.coveredArea} m²`, "Cubiertos"], [`${property.totalArea} m²`, "Totales"]
    ];
    const message = `Hola, estoy interesado/a en la propiedad ${property.id} — ${property.title}. Quisiera recibir más información.`;
    const visitMessage = `Hola, quiero coordinar una visita por la propiedad ${property.id} — ${property.title}.`;
    target.innerHTML = `<section class="detail-intro"><div class="container"><div class="breadcrumb"><a href="${route("")}">Inicio</a><span aria-hidden="true">/</span><a href="${propertiesRoute()}">Propiedades</a><span aria-hidden="true">/</span><span>${property.id}</span></div><div class="detail-heading"><div><div class="detail-label"><span>${property.id}</span><span>${operationLabel(property.operation).toUpperCase()}</span></div><h1>${escapeHTML(property.title)}</h1><p>${escapeHTML(property.neighborhood)} · ${escapeHTML(property.region)}</p></div><div><p class="detail-price">${formatPrice(property)}</p><p class="detail-expenses">${escapeHTML(property.expenses)}</p></div></div></div></section>
      <section aria-label="Galería de la propiedad"><div class="container"><div class="gallery">${gallery.slice(0, 3).map((image, index) => `<button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="Ver foto ${index + 1} de ${gallery.length}"><img src="${image}" alt="Imagen temporal de referencia de ${escapeHTML(property.title)}, foto ${index + 1}" width="1200" height="800"${index ? ' loading="lazy"' : ""}></button>`).join("")}<button class="gallery-all" type="button" data-open-gallery>Ver todas las fotos <span aria-hidden="true">→</span></button></div></div></section>
      <section class="section"><div class="container detail-layout"><div class="detail-content"><ul class="property-facts">${facts.map(([value, label]) => `<li><strong>${escapeHTML(value)}</strong><span>${label}</span></li>`).join("")}</ul><div class="detail-copy"><h2>Descripción</h2><p>${escapeHTML(property.description)}</p></div><div class="amenities"><h2>Características</h2><ul class="amenity-list">${property.amenities.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div><div class="location-card"><p class="eyebrow">UBICACIÓN</p><h2>${escapeHTML(property.neighborhood)} · ${escapeHTML(property.region)}</h2><p>La ubicación se presenta por barrio o localidad para esta demo. Una integración real podría sumar mapa, radio de búsqueda y puntos de interés.</p></div></div><aside class="contact-box"><p class="eyebrow">CONSULTA DIRECTA</p><h2>¿Te interesa esta propiedad?</h2><p>Escribinos y recibí información para avanzar con claridad.</p><a class="button button-light" href="${whatsAppLink(message)}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">→</span></a><a class="button button-secondary" href="${whatsAppLink(visitMessage)}" target="_blank" rel="noopener noreferrer">Coordinar una visita</a></aside></div></section>
      <dialog class="gallery-dialog" data-gallery-dialog aria-label="Galería de ${escapeHTML(property.title)}"><div class="dialog-inner"><div class="dialog-header"><strong>${escapeHTML(property.title)}</strong><button class="dialog-close" type="button" data-close-gallery aria-label="Cerrar galería">×</button></div><div class="dialog-stage"><img data-dialog-image src="${gallery[0]}" alt=""></div><div class="dialog-footer"><button class="dialog-nav" type="button" data-gallery-prev aria-label="Foto anterior">←</button><span data-gallery-count>1 / ${gallery.length}</span><button class="dialog-nav" type="button" data-gallery-next aria-label="Foto siguiente">→</button></div></div></dialog>`;
    bindGallery(gallery, property.title);
  }

  function bindGallery(gallery, title) {
    const dialog = document.querySelector("[data-gallery-dialog]");
    if (!dialog || !gallery.length) return;
    let active = 0;
    const update = () => {
      const image = dialog.querySelector("[data-dialog-image]");
      image.src = gallery[active];
      image.alt = `Imagen temporal de referencia de ${title}, foto ${active + 1}`;
      dialog.querySelector("[data-gallery-count]").textContent = `${active + 1} / ${gallery.length}`;
    };
    const open = index => {
      active = index;
      update();
      if (typeof dialog.showModal === "function") dialog.showModal();
      document.body.classList.add("ru-dialog-open");
      dialog.querySelector("[data-close-gallery]")?.focus();
    };
    document.querySelectorAll("[data-gallery-index]").forEach(button => button.addEventListener("click", () => open(Number(button.dataset.galleryIndex))));
    document.querySelector("[data-open-gallery]")?.addEventListener("click", () => open(0));
    dialog.querySelector("[data-close-gallery]")?.addEventListener("click", () => dialog.close());
    dialog.querySelector("[data-gallery-prev]")?.addEventListener("click", () => { active = (active - 1 + gallery.length) % gallery.length; update(); });
    dialog.querySelector("[data-gallery-next]")?.addEventListener("click", () => { active = (active + 1) % gallery.length; update(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => document.body.classList.remove("ru-dialog-open"));
  }

  function initValuationForm() {
    const form = document.querySelector("[data-valuation-form]");
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      const message = `Hola, quisiera solicitar una tasación.\n\nTipo: ${values.propertyType}\nUbicación: ${values.location}\nAmbientes: ${values.rooms}\nSuperficie aproximada: ${values.area} m²\nNombre: ${values.name}\nWhatsApp: ${values.phone}`;
      window.open(whatsAppLink(message), "_blank", "noopener,noreferrer");
    });
  }

  initChrome();
  if (page === "home") initHome();
  if (page === "properties") initResults();
  if (page === "property") initProperty();
})();
