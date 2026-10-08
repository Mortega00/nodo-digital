(() => {
  "use strict";

  const config = window.QARTA_CONFIG || {};
  const staticRestaurants = window.QARTA_RESTAURANTS || {};
  const staticSlugs = new Set(Object.keys(staticRestaurants));
  const storageKey = config.builderStorageKey || "nodo_qarta_builder_v1";
  const previewStorageKey = config.builderPreviewStorageKey || "nodo_qarta_builder_preview_v1";
  const library = document.getElementById("qarta-builder-library");
  const form = document.getElementById("qarta-builder-form");
  const notice = document.getElementById("qarta-builder-notice");
  const preview = document.getElementById("qarta-builder-preview");
  const importInput = document.getElementById("qarta-builder-import");
  const shareDialog = document.getElementById("qarta-builder-share");

  if (!library || !form || !notice || !preview || !importInput || !shareDialog) return;

  const EXPORT_FORMAT = "qarta";
  const EXPORT_VERSION = 1;
  const MAX_IMPORT_BYTES = 1024 * 1024;

  const DEFAULT_COLORS = {
    ink: "#202522",
    paper: "#f4f0e8",
    paperStrong: "#e8e2d5",
    accent: "#65735f",
    accentDeep: "#384837",
    warm: "#bf8b58",
    line: "#d4cdbd",
  };
  const PRESENTATION_OPTIONS = {
    skin: ["sushi-editorial", "direct"],
    heroLayout: ["plate", "stacked"],
    cardLayout: ["image-led", "compact"],
    density: ["airy", "compact"],
  };
  const COLOR_LABELS = {
    ink: "Tinta",
    paper: "Fondo",
    paperStrong: "Fondo secundario",
    accent: "Acento",
    accentDeep: "Acento profundo",
    warm: "Detalle cálido",
    line: "Líneas",
  };

  let savedRestaurants = [];
  let draft;
  let editingSlug = "";
  let previewTimer = 0;
  let feedback = { type: "", message: "", errors: [] };
  let openSections = new Set(["builder-identity"]);
  let sectionsInitialized = false;
  let activeShareRestaurant = null;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const cleanText = (value, max = 260) => String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  const slugify = (value) => cleanText(value, 70)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const cleanId = (value, fallback) => slugify(value) || fallback;
  const normalizedPrice = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.round(number)) : fallback;
  };
  const numberInputValue = (value) => {
    const source = String(value).trim();
    if (!source) return "";
    const number = Number(source);
    return Number.isFinite(number) ? Math.round(number) : Number.NaN;
  };
  const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const isStoredRestaurantShape = (value) => isRecord(value)
    && typeof value.slug === "string"
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
    && isRecord(value.brand)
    && isRecord(value.presentation)
    && isRecord(value.contact)
    && isRecord(value.hero)
    && isRecord(value.copy)
    && Array.isArray(value.categories)
    && Array.isArray(value.products)
    && Array.isArray(value.promotions)
    && Array.isArray(value.schedule);
  const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim() : fallback;
  const safeUrl = (value) => {
    const source = String(value || "").trim();
    if (!source || /^(?:javascript|data|vbscript):/i.test(source)) return "";
    try {
      const parsed = new URL(source, window.location.href);
      return ["http:", "https:"].includes(parsed.protocol) ? source.slice(0, 500) : "";
    } catch {
      return "";
    }
  };
  const safeLocalAsset = (value) => {
    const source = typeof value === "string" ? value.trim() : "";
    if (!source || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(source)) return "";
    return safeUrl(source);
  };
  const safeWhatsApp = (value) => String(value || "").replace(/\D/g, "").slice(0, 18);
  const tagsFromValue = (value) => String(value || "")
    .split(",")
    .map((item) => cleanText(item, 40))
    .filter(Boolean)
    .slice(0, 10);
  const createRestaurantId = () => {
    const uuid = window.crypto?.randomUUID?.();
    return uuid ? `qarta-${uuid}` : `qarta-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  };
  const generatedPublicUrl = (slug) => {
    const url = new URL("index.html", window.location.href);
    url.searchParams.set("r", slug);
    return url.href;
  };
  const publicUrlFor = (restaurant) => {
    const configured = safeUrl(restaurant?.contact?.publicUrl);
    if (configured) {
      const parsed = new URL(configured, window.location.href);
      if (parsed.searchParams.get("r") === restaurant?.slug) return parsed.href;
    }
    return generatedPublicUrl(restaurant?.slug || "");
  };
  const appendSlug = (base, suffix) => `${base.slice(0, Math.max(1, 60 - suffix.length - 1))}-${suffix}`;
  const slugIsAvailable = (slug, excludedSlug = "") => !staticSlugs.has(slug)
    && !savedRestaurants.some((restaurant) => restaurant.slug === slug && restaurant.slug !== excludedSlug);
  const nextAvailableSlug = (value, mode = "import") => {
    const base = slugify(value) || "qarta";
    const initial = mode === "copy" ? appendSlug(base, "copia") : base;
    if (slugIsAvailable(initial)) return initial;
    for (let index = 2; index < 1000; index += 1) {
      const candidate = appendSlug(initial, String(index));
      if (slugIsAvailable(candidate)) return candidate;
    }
    return appendSlug(base, Date.now().toString(36).slice(-6));
  };
  const statusLabel = (status) => ({ draft: "Borrador", active: "Activo", inactive: "Inactivo" })[status] || "Borrador";
  const selectOptions = (items, selected) => items.map((item) => `<option value="${escapeHtml(item)}" ${item === selected ? "selected" : ""}>${escapeHtml(item)}</option>`).join("");
  const fieldId = (path) => `qarta-builder-${path.replace(/[^a-z0-9]+/gi, "-")}`;

  function copyDefaults() {
    return {
      heroCaption: "Carta de la semana",
      categories: { eyebrow: "EXPLORÁ LA CARTA", title: "Elegí lo que querés pedir." },
      menu: {
        eyebrow: "LA CARTA",
        title: "Todo para tu pedido.",
        searchPlaceholder: "Buscar en la carta",
        emptySearch: "No encontramos productos con esa búsqueda.",
        productCta: "Ver opciones",
      },
      how: { eyebrow: "CÓMO PEDIR", title: "Tu pedido, en tres pasos." },
      local: { eyebrow: "CERCA, A TU RITMO", copy: "Podés coordinar retiro o consultar por envío al cerrar el pedido." },
      product: { featured: "Destacado", addCta: "Agregar" },
    };
  }

  function createRestaurant() {
    return {
      id: createRestaurantId(),
      slug: "nuevo-comercio",
      status: "draft",
      isDemo: true,
      brand: {
        name: "",
        shortName: "QC",
        descriptor: "",
        tagline: "",
        description: "",
      },
      meta: { title: "", description: "", image: "" },
      presentation: {
        skin: "sushi-editorial",
        heroLayout: "plate",
        cardLayout: "image-led",
        density: "airy",
        colors: clone(DEFAULT_COLORS),
      },
      contact: { whatsapp: "", locationLabel: "", pickupLabel: "", publicUrl: "", instagramUrl: "" },
      schedule: [],
      hero: { eyebrow: "CARTA DIGITAL", title: "", copy: "", image: "", imageAlt: "", primaryCta: "Ver la carta", secondaryCta: "Cómo pedir" },
      copy: copyDefaults(),
      categories: [],
      promotions: [],
      qr: { asset: "", target: "", label: "Link de la carta" },
      products: [],
    };
  }

  function normalizeRestaurant(source) {
    const base = createRestaurant();
    const input = source && typeof source === "object" ? source : {};
    const name = cleanText(input.brand?.name, 80);
    const slug = slugify(input.slug) || "nuevo-comercio";
    const normalized = {
      ...base,
      id: cleanText(input.id, 80) || base.id,
      slug,
      status: ["draft", "active", "inactive"].includes(input.status) ? input.status : "draft",
      brand: {
        name,
        shortName: cleanText(input.brand?.shortName, 6) || (name ? name.slice(0, 2).toUpperCase() : "QC"),
        descriptor: cleanText(input.brand?.descriptor, 100),
        tagline: cleanText(input.brand?.tagline, 160),
        description: cleanText(input.brand?.description, 360),
      },
      presentation: {
        skin: PRESENTATION_OPTIONS.skin.includes(input.presentation?.skin) ? input.presentation.skin : base.presentation.skin,
        heroLayout: PRESENTATION_OPTIONS.heroLayout.includes(input.presentation?.heroLayout) ? input.presentation.heroLayout : base.presentation.heroLayout,
        cardLayout: PRESENTATION_OPTIONS.cardLayout.includes(input.presentation?.cardLayout) ? input.presentation.cardLayout : base.presentation.cardLayout,
        density: PRESENTATION_OPTIONS.density.includes(input.presentation?.density) ? input.presentation.density : base.presentation.density,
        colors: Object.fromEntries(Object.keys(DEFAULT_COLORS).map((key) => [key, safeColor(input.presentation?.colors?.[key], DEFAULT_COLORS[key])])),
      },
      contact: {
        whatsapp: safeWhatsApp(input.contact?.whatsapp),
        locationLabel: cleanText(input.contact?.locationLabel, 140),
        pickupLabel: cleanText(input.contact?.pickupLabel, 140),
        publicUrl: safeUrl(input.contact?.publicUrl),
        instagramUrl: safeUrl(input.contact?.instagramUrl),
      },
      schedule: Array.isArray(input.schedule) ? input.schedule.map((entry) => ({ days: cleanText(entry?.days, 70), hours: cleanText(entry?.hours, 70) })).filter((entry) => entry.days || entry.hours).slice(0, 14) : [],
      hero: {
        eyebrow: cleanText(input.hero?.eyebrow, 90),
        title: cleanText(input.hero?.title, 160),
        copy: cleanText(input.hero?.copy, 360),
        image: safeUrl(input.hero?.image),
        imageAlt: cleanText(input.hero?.imageAlt, 180),
        primaryCta: cleanText(input.hero?.primaryCta, 70) || base.hero.primaryCta,
        secondaryCta: cleanText(input.hero?.secondaryCta, 70) || base.hero.secondaryCta,
      },
      copy: {
        heroCaption: cleanText(input.copy?.heroCaption, 90),
        categories: {
          eyebrow: cleanText(input.copy?.categories?.eyebrow, 90),
          title: cleanText(input.copy?.categories?.title, 160),
        },
        menu: {
          eyebrow: cleanText(input.copy?.menu?.eyebrow, 90),
          title: cleanText(input.copy?.menu?.title, 160),
          searchPlaceholder: cleanText(input.copy?.menu?.searchPlaceholder, 120),
          emptySearch: cleanText(input.copy?.menu?.emptySearch, 180),
          productCta: cleanText(input.copy?.menu?.productCta, 70),
        },
        how: { eyebrow: cleanText(input.copy?.how?.eyebrow, 90), title: cleanText(input.copy?.how?.title, 160) },
        local: { eyebrow: cleanText(input.copy?.local?.eyebrow, 90), copy: cleanText(input.copy?.local?.copy, 360) },
        product: { featured: cleanText(input.copy?.product?.featured, 70), addCta: cleanText(input.copy?.product?.addCta, 70) },
      },
      categories: Array.isArray(input.categories) ? input.categories.map((item, index) => ({
        id: cleanId(item?.id, `categoria-${index + 1}`),
        label: cleanText(item?.label, 80),
        description: cleanText(item?.description, 160),
      })).slice(0, 40) : [],
      promotions: Array.isArray(input.promotions) ? input.promotions.map((item, index) => ({
        id: cleanId(item?.id, `promo-${index + 1}`),
        active: item?.active !== false,
        startsAt: /^\d{4}-\d{2}-\d{2}$/.test(String(item?.startsAt || "")) ? item.startsAt : "",
        endsAt: /^\d{4}-\d{2}-\d{2}$/.test(String(item?.endsAt || "")) ? item.endsAt : "",
        eyebrow: cleanText(item?.eyebrow, 90),
        title: cleanText(item?.title, 160),
        copy: cleanText(item?.copy, 360),
        note: cleanText(item?.note, 220),
        image: safeUrl(item?.image),
        imageAlt: cleanText(item?.imageAlt, 180),
      })).slice(0, 20) : [],
      qr: { asset: safeLocalAsset(input.qr?.asset), target: safeUrl(input.qr?.target), label: cleanText(input.qr?.label, 70) || base.qr.label },
      products: Array.isArray(input.products) ? input.products.map((item, index) => ({
        id: cleanId(item?.id, `producto-${index + 1}`),
        name: cleanText(item?.name, 100),
        description: cleanText(item?.description, 360),
        category: cleanId(item?.category, ""),
        price: normalizedPrice(item?.price),
        image: safeUrl(item?.image),
        imageAlt: cleanText(item?.imageAlt, 180),
        available: item?.available !== false,
        featured: item?.featured === true,
        tags: Array.isArray(item?.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 10) : [],
        variants: Array.isArray(item?.variants) ? item.variants.map((choice, variantIndex) => ({
          id: cleanId(choice?.id, `variante-${variantIndex + 1}`),
          label: cleanText(choice?.label, 90),
          priceDelta: normalizedPrice(choice?.priceDelta),
        })).slice(0, 20) : [],
        extras: Array.isArray(item?.extras) ? item.extras.map((choice, extraIndex) => ({
          id: cleanId(choice?.id, `extra-${extraIndex + 1}`),
          label: cleanText(choice?.label, 90),
          price: normalizedPrice(choice?.price),
        })).slice(0, 20) : [],
      })).slice(0, 200) : [],
    };
    normalized.meta = {
      title: cleanText(input.meta?.title, 160) || `${normalized.brand.name || "QARTA"} · Carta digital | NODO`,
      description: cleanText(input.meta?.description, 240) || normalized.brand.description,
      image: safeUrl(input.meta?.image) || normalized.hero.image,
    };
    normalized.contact.publicUrl = publicUrlFor(normalized);
    normalized.qr.target = normalized.qr.target || normalized.contact.publicUrl;
    return normalized;
  }

  function readStoredRestaurants() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
      const items = Array.isArray(parsed) ? parsed : parsed?.restaurants;
      if (!Array.isArray(items)) return [];
      const used = new Set();
      return items.reduce((collection, item) => {
        if (!isStoredRestaurantShape(item)) return collection;
        const restaurant = normalizeRestaurant(item);
        if (staticSlugs.has(restaurant.slug) || used.has(restaurant.slug)) return collection;
        used.add(restaurant.slug);
        collection.push(restaurant);
        return collection;
      }, []);
    } catch {
      return [];
    }
  }

  savedRestaurants = readStoredRestaurants();
  draft = createRestaurant();

  function persistRestaurants() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, restaurants: savedRestaurants }));
      return true;
    } catch {
      setFeedback("error", "No pudimos guardar esta QARTA en este navegador.");
      return false;
    }
  }

  function inputField(label, path, value, options = {}) {
    const id = fieldId(path);
    const type = options.type || "text";
    const hint = options.hint ? `<small>${escapeHtml(options.hint)}</small>` : "";
    const maxAttribute = options.max === undefined ? "" : (type === "number" || type === "date" ? `max="${options.max}"` : `maxlength="${options.max}"`);
    const attributes = `${options.required ? "required" : ""} ${options.min !== undefined ? `min="${options.min}"` : ""} ${maxAttribute} ${options.step ? `step="${options.step}"` : ""} ${options.valueType ? `data-value-type="${options.valueType}"` : ""}`;
    if (type === "textarea") return `<label class="qarta-builder-field qarta-builder-field--wide" for="${id}"><span>${escapeHtml(label)}</span><textarea id="${id}" rows="${options.rows || 3}" data-field="${escapeHtml(path)}" ${attributes}>${escapeHtml(value)}</textarea>${hint}</label>`;
    if (type === "checkbox") return `<label class="qarta-builder-toggle" for="${id}"><input id="${id}" type="checkbox" data-field="${escapeHtml(path)}" ${value ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
    if (type === "select") return `<label class="qarta-builder-field" for="${id}"><span>${escapeHtml(label)}</span><select id="${id}" data-field="${escapeHtml(path)}" ${attributes}>${options.options || ""}</select>${hint}</label>`;
    return `<label class="qarta-builder-field" for="${id}"><span>${escapeHtml(label)}</span><input id="${id}" type="${type}" value="${escapeHtml(value)}" data-field="${escapeHtml(path)}" ${attributes}>${hint}</label>`;
  }

  function section(id, title, description, content, open = false) {
    const isOpen = sectionsInitialized ? openSections.has(id) : open;
    return `<details class="qarta-builder-section" ${isOpen ? "open" : ""}><summary><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></span><i aria-hidden="true">+</i></summary><div class="qarta-builder-section__body" id="${id}">${content}</div></details>`;
  }

  function actionButton(label, action, attributes = "", kind = "quiet") {
    return `<button class="qarta-builder-inline-button qarta-builder-inline-button--${kind}" type="button" data-builder-action="${action}" ${attributes}>${escapeHtml(label)}</button>`;
  }

  function renderLibrary() {
    const list = savedRestaurants.length
      ? `<ul class="qarta-builder-library__list">${savedRestaurants.map((restaurant) => `<li><div><strong>${escapeHtml(restaurant.brand.name || "Sin nombre")}</strong><span>${escapeHtml(restaurant.slug)} · ${escapeHtml(statusLabel(restaurant.status))}</span></div><div class="qarta-builder-library__actions">${actionButton("Ver", "view", `data-slug="${escapeHtml(restaurant.slug)}"`)}${actionButton("Editar", "edit", `data-slug="${escapeHtml(restaurant.slug)}"`)}${actionButton("Duplicar", "duplicate", `data-slug="${escapeHtml(restaurant.slug)}"`)}${actionButton("Compartir", "share", `data-slug="${escapeHtml(restaurant.slug)}"`)}${actionButton("Exportar", "export", `data-slug="${escapeHtml(restaurant.slug)}"`)}${actionButton("Eliminar", "delete", `data-slug="${escapeHtml(restaurant.slug)}"`, "danger")}</div></li>`).join("")}</ul>`
      : `<p class="qarta-builder-empty">Todavía no creaste ninguna QARTA en este navegador.</p>`;
    library.innerHTML = `<section class="qarta-builder-library"><div class="qarta-builder-library__head"><div><p>MIS QARTAS</p><h1>Comercios locales</h1></div>${actionButton("Nuevo comercio", "new", "", "dark")}</div>${list}</section>`;
  }

  function renderIdentity() {
    return section("builder-identity", "Información", "Nombre, slug y estado local.", `<div class="qarta-builder-fields">
      ${inputField("Nombre", "brand.name", draft.brand.name, { required: true, max: 80 })}
      ${inputField("Slug", "slug", draft.slug, { required: true, max: 60, hint: "Sólo minúsculas, números y guiones.", valueType: "slug" })}
      ${inputField("Estado", "status", draft.status, { type: "select", options: selectOptions(["draft", "active", "inactive"], draft.status) })}
      ${inputField("Descriptor", "brand.descriptor", draft.brand.descriptor, { max: 100 })}
      ${inputField("Tagline", "brand.tagline", draft.brand.tagline, { max: 160 })}
      ${inputField("Descripción", "brand.description", draft.brand.description, { type: "textarea", rows: 3, max: 360 })}
    </div>`, true);
  }

  function renderPresentation() {
    const colors = Object.entries(COLOR_LABELS).map(([key, label]) => inputField(label, `presentation.colors.${key}`, draft.presentation.colors[key], { type: "color", valueType: "color" })).join("");
    return section("builder-presentation", "Presentación", "Opciones seguras que entiende QARTA.", `<div class="qarta-builder-fields">
      ${inputField("Skin", "presentation.skin", draft.presentation.skin, { type: "select", options: selectOptions(PRESENTATION_OPTIONS.skin, draft.presentation.skin) })}
      ${inputField("Hero", "presentation.heroLayout", draft.presentation.heroLayout, { type: "select", options: selectOptions(PRESENTATION_OPTIONS.heroLayout, draft.presentation.heroLayout) })}
      ${inputField("Cards", "presentation.cardLayout", draft.presentation.cardLayout, { type: "select", options: selectOptions(PRESENTATION_OPTIONS.cardLayout, draft.presentation.cardLayout) })}
      ${inputField("Densidad", "presentation.density", draft.presentation.density, { type: "select", options: selectOptions(PRESENTATION_OPTIONS.density, draft.presentation.density) })}
    </div><div class="qarta-builder-color-grid">${colors}</div>`, false);
  }

  function renderHeroAndCopy() {
    return section("builder-hero", "Hero y copy", "Los textos principales de la carta pública.", `<div class="qarta-builder-subheading">Hero</div><div class="qarta-builder-fields">
      ${inputField("Eyebrow", "hero.eyebrow", draft.hero.eyebrow, { max: 90 })}
      ${inputField("Título", "hero.title", draft.hero.title, { max: 160 })}
      ${inputField("Copy", "hero.copy", draft.hero.copy, { type: "textarea", rows: 3, max: 360 })}
      ${inputField("Imagen (ruta o URL)", "hero.image", draft.hero.image, { max: 500, valueType: "url" })}
      ${inputField("Texto alternativo", "hero.imageAlt", draft.hero.imageAlt, { max: 180 })}
      ${inputField("CTA principal", "hero.primaryCta", draft.hero.primaryCta, { max: 70 })}
      ${inputField("CTA secundario", "hero.secondaryCta", draft.hero.secondaryCta, { max: 70 })}
    </div><div class="qarta-builder-subheading">Copy de la carta</div><div class="qarta-builder-fields">
      ${inputField("Caption del hero", "copy.heroCaption", draft.copy.heroCaption, { max: 90 })}
      ${inputField("Eyebrow categorías", "copy.categories.eyebrow", draft.copy.categories.eyebrow, { max: 90 })}
      ${inputField("Título categorías", "copy.categories.title", draft.copy.categories.title, { max: 160 })}
      ${inputField("Eyebrow menú", "copy.menu.eyebrow", draft.copy.menu.eyebrow, { max: 90 })}
      ${inputField("Título menú", "copy.menu.title", draft.copy.menu.title, { max: 160 })}
      ${inputField("Placeholder buscador", "copy.menu.searchPlaceholder", draft.copy.menu.searchPlaceholder, { max: 120 })}
      ${inputField("Sin resultados", "copy.menu.emptySearch", draft.copy.menu.emptySearch, { max: 180 })}
      ${inputField("CTA producto", "copy.menu.productCta", draft.copy.menu.productCta, { max: 70 })}
      ${inputField("Etiqueta destacado", "copy.product.featured", draft.copy.product.featured, { max: 70 })}
      ${inputField("CTA agregar", "copy.product.addCta", draft.copy.product.addCta, { max: 70 })}
      ${inputField("Eyebrow cómo pedir", "copy.how.eyebrow", draft.copy.how.eyebrow, { max: 90 })}
      ${inputField("Título cómo pedir", "copy.how.title", draft.copy.how.title, { max: 160 })}
      ${inputField("Eyebrow local", "copy.local.eyebrow", draft.copy.local.eyebrow, { max: 90 })}
      ${inputField("Copy local", "copy.local.copy", draft.copy.local.copy, { type: "textarea", rows: 3, max: 360 })}
    </div>`, false);
  }

  function renderContact() {
    const schedule = draft.schedule.length ? draft.schedule.map((entry, index) => `<div class="qarta-builder-row"><div class="qarta-builder-fields qarta-builder-fields--row">${inputField("Días", `schedule.${index}.days`, entry.days, { max: 70 })}${inputField("Horario", `schedule.${index}.hours`, entry.hours, { max: 70 })}</div>${actionButton("Quitar", "remove-schedule", `data-index="${index}"`, "danger")}</div>`).join("") : `<p class="qarta-builder-empty">Todavía no agregaste horarios.</p>`;
    return section("builder-contact", "Contacto y horarios", "Datos públicos que usa checkout y el bloque local.", `<div class="qarta-builder-fields">
      ${inputField("WhatsApp", "contact.whatsapp", draft.contact.whatsapp, { type: "tel", max: 18, valueType: "whatsapp", hint: "Sólo números con código de país." })}
      ${inputField("Ubicación", "contact.locationLabel", draft.contact.locationLabel, { max: 140 })}
      ${inputField("Etiqueta de retiro", "contact.pickupLabel", draft.contact.pickupLabel, { max: 140 })}
      ${inputField("URL pública", "contact.publicUrl", draft.contact.publicUrl, { type: "url", max: 500, valueType: "url" })}
      ${inputField("Instagram", "contact.instagramUrl", draft.contact.instagramUrl, { type: "url", max: 500, valueType: "url" })}
    </div><div class="qarta-builder-subheading">QR local</div><div class="qarta-builder-fields">
      ${inputField("Asset QR local", "qr.asset", draft.qr.asset, { max: 500, valueType: "local-asset", hint: "No se generan ni cargan QR remotos desde QARTA." })}
      ${inputField("URL del QR", "qr.target", draft.qr.target, { type: "url", max: 500, valueType: "url" })}
      ${inputField("Etiqueta QR", "qr.label", draft.qr.label, { max: 70 })}
    </div><div class="qarta-builder-list-head"><strong>Horarios</strong>${actionButton("Agregar horario", "add-schedule")}</div><div class="qarta-builder-repeat-list">${schedule}</div>`, false);
  }

  function renderCategories() {
    const items = draft.categories.length ? draft.categories.map((category, index) => `<article class="qarta-builder-item"><div class="qarta-builder-item__head"><strong>Categoría ${index + 1}</strong>${actionButton("Eliminar", "remove-category", `data-index="${index}"`, "danger")}</div><div class="qarta-builder-fields">${inputField("ID", `categories.${index}.id`, category.id, { max: 60, valueType: "id", hint: "No cambia productos asociados automáticamente." })}${inputField("Etiqueta", `categories.${index}.label`, category.label, { max: 80 })}${inputField("Descripción", `categories.${index}.description`, category.description, { type: "textarea", rows: 2, max: 160 })}</div></article>`).join("") : `<p class="qarta-builder-empty">Agregá categorías antes de cargar productos.</p>`;
    return section("builder-categories", "Categorías", "Estructura de navegación y asociación de productos.", `<div class="qarta-builder-list-head"><span>${draft.categories.length} categoría${draft.categories.length === 1 ? "" : "s"}</span>${actionButton("Agregar categoría", "add-category")}</div><div class="qarta-builder-repeat-list">${items}</div>`, false);
  }

  function variantFields(product, productIndex) {
    const variants = product.variants.length ? product.variants.map((variant, variantIndex) => `<div class="qarta-builder-row"><div class="qarta-builder-fields qarta-builder-fields--triple">${inputField("ID", `products.${productIndex}.variants.${variantIndex}.id`, variant.id, { max: 60, valueType: "id" })}${inputField("Etiqueta", `products.${productIndex}.variants.${variantIndex}.label`, variant.label, { max: 90 })}${inputField("Diferencia", `products.${productIndex}.variants.${variantIndex}.priceDelta`, variant.priceDelta, { type: "number", min: 0, step: 1, valueType: "number" })}</div>${actionButton("Quitar", "remove-variant", `data-product-index="${productIndex}" data-index="${variantIndex}"`, "danger")}</div>`).join("") : `<p class="qarta-builder-empty">Este producto no tiene variantes.</p>`;
    return `<div class="qarta-builder-nested"><div class="qarta-builder-list-head"><strong>Variantes</strong>${actionButton("Agregar variante", "add-variant", `data-product-index="${productIndex}"`)}</div>${variants}</div>`;
  }

  function extraFields(product, productIndex) {
    const extras = product.extras.length ? product.extras.map((extra, extraIndex) => `<div class="qarta-builder-row"><div class="qarta-builder-fields qarta-builder-fields--triple">${inputField("ID", `products.${productIndex}.extras.${extraIndex}.id`, extra.id, { max: 60, valueType: "id" })}${inputField("Etiqueta", `products.${productIndex}.extras.${extraIndex}.label`, extra.label, { max: 90 })}${inputField("Precio", `products.${productIndex}.extras.${extraIndex}.price`, extra.price, { type: "number", min: 0, step: 1, valueType: "number" })}</div>${actionButton("Quitar", "remove-extra", `data-product-index="${productIndex}" data-index="${extraIndex}"`, "danger")}</div>`).join("") : `<p class="qarta-builder-empty">Este producto no tiene extras.</p>`;
    return `<div class="qarta-builder-nested"><div class="qarta-builder-list-head"><strong>Extras</strong>${actionButton("Agregar extra", "add-extra", `data-product-index="${productIndex}"`)}</div>${extras}</div>`;
  }

  function renderProducts() {
    const categoryOptions = `<option value="">Elegí una categoría</option>${draft.categories.map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.label || category.id)}</option>`).join("")}`;
    const items = draft.products.length ? draft.products.map((product, index) => `<article class="qarta-builder-item qarta-builder-product"><div class="qarta-builder-item__head"><strong>${escapeHtml(product.name || `Producto ${index + 1}`)}</strong>${actionButton("Eliminar", "remove-product", `data-index="${index}"`, "danger")}</div><div class="qarta-builder-fields">
      ${inputField("ID", `products.${index}.id`, product.id, { max: 60, valueType: "id" })}
      ${inputField("Nombre", `products.${index}.name`, product.name, { max: 100 })}
      ${inputField("Categoría", `products.${index}.category`, product.category, { type: "select", options: categoryOptions.replace(`value="${escapeHtml(product.category)}"`, `value="${escapeHtml(product.category)}" selected`) })}
      ${inputField("Precio", `products.${index}.price`, product.price, { type: "number", min: 0, step: 1, valueType: "number" })}
      ${inputField("Imagen (ruta o URL)", `products.${index}.image`, product.image, { max: 500, valueType: "url" })}
      ${inputField("Texto alternativo", `products.${index}.imageAlt`, product.imageAlt, { max: 180 })}
      ${inputField("Tags separados por coma", `products.${index}.tags`, product.tags.join(", "), { max: 300, valueType: "tags" })}
      ${inputField("Descripción", `products.${index}.description`, product.description, { type: "textarea", rows: 3, max: 360 })}
      ${inputField("Disponible", `products.${index}.available`, product.available, { type: "checkbox" })}
      ${inputField("Destacado", `products.${index}.featured`, product.featured, { type: "checkbox" })}
    </div>${variantFields(product, index)}${extraFields(product, index)}</article>`).join("") : `<p class="qarta-builder-empty">Todavía no agregaste productos.</p>`;
    return section("builder-products", "Productos", "Cada producto usa el mismo modelo de datos del motor público.", `<div class="qarta-builder-list-head"><span>${draft.products.length} producto${draft.products.length === 1 ? "" : "s"}</span>${actionButton("Agregar producto", "add-product")}</div><div class="qarta-builder-repeat-list">${items}</div>`, false);
  }

  function renderPromotions() {
    const items = draft.promotions.length ? draft.promotions.map((promotion, index) => `<article class="qarta-builder-item"><div class="qarta-builder-item__head"><strong>${escapeHtml(promotion.title || `Promoción ${index + 1}`)}</strong>${actionButton("Eliminar", "remove-promotion", `data-index="${index}"`, "danger")}</div><div class="qarta-builder-fields">
      ${inputField("ID", `promotions.${index}.id`, promotion.id, { max: 60, valueType: "id" })}
      ${inputField("Activa", `promotions.${index}.active`, promotion.active, { type: "checkbox" })}
      ${inputField("Desde", `promotions.${index}.startsAt`, promotion.startsAt, { type: "date" })}
      ${inputField("Hasta", `promotions.${index}.endsAt`, promotion.endsAt, { type: "date" })}
      ${inputField("Eyebrow", `promotions.${index}.eyebrow`, promotion.eyebrow, { max: 90 })}
      ${inputField("Título", `promotions.${index}.title`, promotion.title, { max: 160 })}
      ${inputField("Copy", `promotions.${index}.copy`, promotion.copy, { type: "textarea", rows: 3, max: 360 })}
      ${inputField("Nota", `promotions.${index}.note`, promotion.note, { type: "textarea", rows: 2, max: 220 })}
      ${inputField("Imagen (ruta o URL)", `promotions.${index}.image`, promotion.image, { max: 500, valueType: "url" })}
      ${inputField("Texto alternativo", `promotions.${index}.imageAlt`, promotion.imageAlt, { max: 180 })}
    </div></article>`).join("") : `<p class="qarta-builder-empty">No hay promociones configuradas.</p>`;
    return section("builder-promotions", "Promociones", "El motor sólo renderiza las promociones activas dentro de sus fechas.", `<div class="qarta-builder-list-head"><span>${draft.promotions.length} promoción${draft.promotions.length === 1 ? "" : "es"}</span>${actionButton("Agregar promoción", "add-promotion")}</div><div class="qarta-builder-repeat-list">${items}</div>`, false);
  }

  function renderForm() {
    form.innerHTML = `<div class="qarta-builder-form__heading"><p>${editingSlug ? "EDITANDO QARTA" : "NUEVA QARTA"}</p><h2>${escapeHtml(draft.brand.name || "Configurá un comercio")}</h2><span>Los cambios actualizan la preview sin guardar.</span></div>${renderIdentity()}${renderPresentation()}${renderHeroAndCopy()}${renderContact()}${renderCategories()}${renderProducts()}${renderPromotions()}<div class="qarta-builder-savebar"><span>Los cambios se guardan sólo en este navegador.</span>${actionButton("Guardar QARTA", "save", "", "dark")}</div>`;
  }

  function renderNotice() {
    if (!feedback.message && !feedback.errors.length) {
      notice.hidden = true;
      notice.innerHTML = "";
      return;
    }
    notice.hidden = false;
    notice.dataset.type = feedback.type || "info";
    notice.innerHTML = `${feedback.message ? `<p>${escapeHtml(feedback.message)}</p>` : ""}${feedback.errors.length ? `<ul>${feedback.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>` : ""}`;
  }

  function render() {
    const sections = form.querySelectorAll?.(".qarta-builder-section");
    if (sections?.length) {
      openSections = new Set([...sections].filter((section) => section.open).map((section) => section.querySelector(".qarta-builder-section__body")?.id).filter(Boolean));
      sectionsInitialized = true;
    }
    renderLibrary();
    renderNotice();
    renderForm();
  }

  function setFeedback(type, message, errors = []) {
    feedback = { type, message, errors };
    renderNotice();
  }

  function setAtPath(target, path, value) {
    const keys = path.split(".");
    const finalKey = keys.pop();
    const container = keys.reduce((current, key) => current?.[key], target);
    if (container && finalKey) container[finalKey] = value;
  }

  function valueFromControl(control) {
    if (control.type === "checkbox") return control.checked;
    if (control.dataset.valueType === "slug" || control.dataset.valueType === "id") return slugify(control.value);
    if (control.dataset.valueType === "number") return numberInputValue(control.value);
    if (control.dataset.valueType === "tags") return tagsFromValue(control.value);
    if (control.dataset.valueType === "url") return safeUrl(control.value);
    if (control.dataset.valueType === "local-asset") return safeLocalAsset(control.value);
    if (control.dataset.valueType === "whatsapp") return safeWhatsApp(control.value);
    if (control.dataset.valueType === "color") return safeColor(control.value, "#000000");
    return control.value;
  }

  function controlFeedback(control) {
    const value = String(control.value || "").trim();
    if (control.required && !value) return "Completá este campo requerido antes de guardar.";
    if (control.dataset.valueType === "number" && (value === "" || !Number.isFinite(Number(value)) || Number(value) < 0)) return "Ingresá un precio válido: cero o un número positivo.";
    if (control.dataset.valueType === "url" && value && !safeUrl(value)) return "La URL no es segura o no tiene un formato válido.";
    if (control.dataset.valueType === "local-asset" && value && !safeLocalAsset(value)) return "El QR debe usar una ruta local segura, no una URL remota.";
    if (control.dataset.valueType === "color" && value && !safeColor(value, "")) return "El color no tiene un formato hexadecimal válido.";
    if (control.dataset.valueType === "whatsapp" && value && safeWhatsApp(value) !== value) return "El WhatsApp se guardará sólo con números y código de país.";
    return "";
  }

  function schedulePreview(immediate = false) {
    window.clearTimeout(previewTimer);
    const update = () => {
      try {
        window.sessionStorage.setItem(previewStorageKey, JSON.stringify(normalizeRestaurant(draft)));
        preview.src = `index.html?preview=1&v=${Date.now()}`;
      } catch {
        setFeedback("error", "No pudimos actualizar la vista previa en este navegador.");
      }
    };
    if (immediate) update();
    else previewTimer = window.setTimeout(update, 280);
  }

  function validationErrors(candidate = draft, { checkSlugAvailability = true, excludedSlug = editingSlug } = {}) {
    const errors = [];
    const slug = slugify(candidate.slug);
    if (!cleanText(candidate.brand.name, 80)) errors.push("Ingresá el nombre del comercio.");
    if (!slug) errors.push("Ingresá un slug válido.");
    if (checkSlugAvailability && slug && staticSlugs.has(slug)) errors.push("Ese slug pertenece a un comercio estático de QARTA.");
    if (checkSlugAvailability && slug && savedRestaurants.some((restaurant) => restaurant.slug === slug && restaurant.slug !== excludedSlug)) errors.push("Ese slug ya está usado por otra QARTA del Builder.");
    const categoryIds = new Set();
    candidate.categories.forEach((category, index) => {
      const id = slugify(category.id);
      if (!id || !cleanText(category.label, 80)) errors.push(`Completá ID y etiqueta de la categoría ${index + 1}.`);
      if (id && categoryIds.has(id)) errors.push(`La categoría ${index + 1} repite el ID “${id}”.`);
      categoryIds.add(id);
    });
    const productIds = new Set();
    candidate.products.forEach((product, index) => {
      const label = `producto ${index + 1}`;
      const id = slugify(product.id);
      if (!id || !cleanText(product.name, 100)) errors.push(`Completá ID y nombre del ${label}.`);
      if (id && productIds.has(id)) errors.push(`El ${label} repite el ID “${id}”.`);
      productIds.add(id);
      if (!categoryIds.has(slugify(product.category))) errors.push(`Elegí una categoría existente para el ${label}.`);
      if (product.price === "" || !Number.isFinite(Number(product.price)) || Number(product.price) < 0) errors.push(`Ingresá un precio válido para el ${label}.`);
      const variantIds = new Set();
      (product.variants || []).forEach((variant, variantIndex) => {
        const variantId = slugify(variant.id);
        if (!variantId || !cleanText(variant.label, 90) || variant.priceDelta === "" || !Number.isFinite(Number(variant.priceDelta)) || Number(variant.priceDelta) < 0) errors.push(`Revisá la variante ${variantIndex + 1} del ${label}.`);
        if (variantId && variantIds.has(variantId)) errors.push(`Hay una variante repetida en el ${label}.`);
        variantIds.add(variantId);
      });
      const extraIds = new Set();
      (product.extras || []).forEach((extra, extraIndex) => {
        const extraId = slugify(extra.id);
        if (!extraId || !cleanText(extra.label, 90) || extra.price === "" || !Number.isFinite(Number(extra.price)) || Number(extra.price) < 0) errors.push(`Revisá el extra ${extraIndex + 1} del ${label}.`);
        if (extraId && extraIds.has(extraId)) errors.push(`Hay un extra repetido en el ${label}.`);
        extraIds.add(extraId);
      });
    });
    const promotionIds = new Set();
    candidate.promotions.forEach((promotion, index) => {
      const id = slugify(promotion.id);
      if (!id || !cleanText(promotion.title, 160)) errors.push(`Completá ID y título de la promoción ${index + 1}.`);
      if (id && promotionIds.has(id)) errors.push(`La promoción ${index + 1} repite el ID “${id}”.`);
      promotionIds.add(id);
      if (promotion.startsAt && promotion.endsAt && promotion.startsAt > promotion.endsAt) errors.push(`La promoción ${index + 1} termina antes de empezar.`);
    });
    return errors;
  }

  function isSafeOptionalUrl(value) {
    return value === undefined || value === null || value === "" || (typeof value === "string" && Boolean(safeUrl(value)));
  }

  function containsMarkup(value) {
    if (typeof value === "string") return /<\s*\/?[a-z!][^>]*>/i.test(value);
    if (Array.isArray(value)) return value.some(containsMarkup);
    if (isRecord(value)) return Object.values(value).some(containsMarkup);
    return false;
  }

  function importValidationErrors(payload) {
    const errors = [];
    if (!isRecord(payload) || payload.format !== EXPORT_FORMAT) return ["El archivo no usa el formato QARTA reconocido."];
    if (payload.version !== EXPORT_VERSION) return [`La versión ${String(payload.version || "sin versión")} no es compatible con este Builder.`];
    const restaurant = payload.restaurant;
    if (!isStoredRestaurantShape(restaurant)) return ["El comercio importado no tiene la estructura mínima esperada."];
    if (!restaurant.categories.every(isRecord)
      || !restaurant.products.every((product) => isRecord(product) && Array.isArray(product.variants) && Array.isArray(product.extras) && Array.isArray(product.tags) && product.variants.every(isRecord) && product.extras.every(isRecord))
      || !restaurant.promotions.every(isRecord)
      || !restaurant.schedule.every(isRecord)) return ["El archivo contiene elementos internos con un formato no válido."];
    if (restaurant.categories.length > 40 || restaurant.products.length > 200 || restaurant.promotions.length > 20 || restaurant.schedule.length > 14) errors.push("El archivo supera los límites razonables de categorías, productos, promociones u horarios.");
    restaurant.products.forEach((product, index) => {
      if (!isRecord(product) || (Array.isArray(product.variants) && product.variants.length > 20) || (Array.isArray(product.extras) && product.extras.length > 20) || (Array.isArray(product.tags) && product.tags.length > 10)) errors.push(`El producto ${index + 1} supera un límite permitido o no tiene un formato válido.`);
    });
    Object.entries(PRESENTATION_OPTIONS).forEach(([key, options]) => {
      if (restaurant.presentation[key] && !options.includes(restaurant.presentation[key])) errors.push(`La opción de presentación “${key}” no es válida.`);
    });
    if (restaurant.presentation.colors !== undefined) {
      if (!isRecord(restaurant.presentation.colors)) errors.push("Los colores de presentación no tienen un formato válido.");
      else Object.entries(restaurant.presentation.colors).forEach(([key, value]) => {
        if (!Object.hasOwn(DEFAULT_COLORS, key) || typeof value !== "string" || !safeColor(value, "")) errors.push(`El color “${key}” no es válido.`);
      });
    }
    const urls = [restaurant.hero.image, restaurant.meta?.image, restaurant.contact.publicUrl, restaurant.contact.instagramUrl, restaurant.qr?.target];
    restaurant.products.forEach((product) => urls.push(product?.image));
    restaurant.promotions.forEach((promotion) => urls.push(promotion?.image));
    if (urls.some((url) => !isSafeOptionalUrl(url))) errors.push("El archivo contiene una URL no permitida.");
    if (restaurant.qr?.asset && !safeLocalAsset(restaurant.qr.asset)) errors.push("El asset QR debe ser una ruta local segura.");
    if (containsMarkup(restaurant)) errors.push("El archivo contiene HTML no permitido.");
    return [...errors, ...validationErrors(restaurant, { checkSlugAvailability: false, excludedSlug: "" })];
  }

  function saveRestaurant() {
    const errors = validationErrors();
    if (errors.length) {
      setFeedback("error", "Revisá estos datos antes de guardar.", errors);
      return;
    }
    const restaurant = normalizeRestaurant(draft);
    const previousIndex = savedRestaurants.findIndex((item) => item.slug === editingSlug);
    if (previousIndex >= 0) savedRestaurants.splice(previousIndex, 1, restaurant);
    else savedRestaurants.push(restaurant);
    if (!persistRestaurants()) return;
    editingSlug = restaurant.slug;
    draft = clone(restaurant);
    setFeedback("success", `“${restaurant.brand.name}” quedó guardada en este navegador.`);
    render();
    schedulePreview(true);
  }

  function downloadFile(filename, contents, type) {
    if (!window.Blob || !window.URL?.createObjectURL) {
      setFeedback("error", "Este navegador no permite descargar archivos desde el Builder.");
      return false;
    }
    const url = window.URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
    return true;
  }

  function exportRestaurant(restaurant) {
    if (!restaurant) return;
    const payload = {
      format: EXPORT_FORMAT,
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      restaurant: clone(restaurant),
    };
    if (downloadFile(`${restaurant.slug}.qarta.json`, JSON.stringify(payload, null, 2), "application/json")) {
      setFeedback("success", `“${restaurant.brand.name}” se exportó como JSON.`);
    }
  }

  function duplicateRestaurant(source) {
    if (!source) return;
    const duplicate = clone(source);
    duplicate.id = createRestaurantId();
    duplicate.slug = nextAvailableSlug(source.slug, "copy");
    duplicate.brand.name = cleanText(`${source.brand.name || source.slug} — Copia`, 80);
    duplicate.contact.publicUrl = generatedPublicUrl(duplicate.slug);
    duplicate.qr = { ...duplicate.qr, target: duplicate.contact.publicUrl };
    const normalized = normalizeRestaurant(duplicate);
    savedRestaurants.push(normalized);
    if (!persistRestaurants()) {
      savedRestaurants = savedRestaurants.filter((restaurant) => restaurant.id !== normalized.id);
      return;
    }
    editingSlug = normalized.slug;
    draft = clone(normalized);
    setFeedback("success", `Se creó “${normalized.brand.name}” para que la edites.`);
    render();
    schedulePreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function shareStatus(message, type = "success") {
    const status = shareDialog.querySelector("[data-qarta-share-status]");
    if (!status) return;
    status.dataset.type = type;
    status.textContent = message;
  }

  function qrAssetFor(restaurant) {
    return safeLocalAsset(restaurant?.qr?.asset);
  }

  function renderShareDialog(view = "share") {
    if (!activeShareRestaurant) return;
    const restaurant = activeShareRestaurant;
    const url = publicUrlFor(restaurant);
    const qrAsset = qrAssetFor(restaurant);
    const localQr = Boolean(qrAsset);
    const title = view === "qr" ? "Código QR" : "Compartir QARTA";
    const content = view === "qr"
      ? `<div class="qarta-builder-modal__qr">${qrAsset ? `<img src="${escapeHtml(qrAsset)}" alt="Código QR de ${escapeHtml(restaurant.brand.name)}">` : `<p>No hay un asset QR local configurado todavía para esta QARTA.</p>`}</div>
         <p class="qarta-builder-modal__url">${escapeHtml(url)}</p>
         <div class="qarta-builder-modal__actions">${actionButton("Copiar enlace", "copy-link", "", "dark")}${localQr ? actionButton("Descargar QR", "download-qr") : ""}${actionButton("Volver", "open-share")}</div>`
      : `<p>Compartí la carta pública de <strong>${escapeHtml(restaurant.brand.name)}</strong>.</p>
         <p class="qarta-builder-modal__url">${escapeHtml(url)}</p>
         <div class="qarta-builder-modal__actions">${actionButton("Copiar enlace", "copy-link", "", "dark")}${actionButton("WhatsApp", "share-whatsapp")}${actionButton("Ver QR", "open-qr")}</div>`;
    shareDialog.innerHTML = `<article class="qarta-builder-modal__panel"><div class="qarta-builder-modal__head"><div><p>QARTA COMPARTIR</p><h2 id="qarta-builder-modal-title">${title}</h2></div>${actionButton("Cerrar", "close-share")}</div>${content}<p class="qarta-builder-modal__status" data-qarta-share-status role="status" aria-live="polite"></p></article>`;
  }

  function openShareDialog(restaurant) {
    if (!restaurant) return;
    activeShareRestaurant = restaurant;
    renderShareDialog();
    if (typeof shareDialog.showModal === "function") shareDialog.showModal();
    else shareDialog.setAttribute("open", "");
  }

  function closeShareDialog() {
    if (typeof shareDialog.close === "function" && shareDialog.open) shareDialog.close();
    else shareDialog.removeAttribute("open");
    activeShareRestaurant = null;
  }

  async function copyShareLink() {
    if (!activeShareRestaurant) return;
    const url = publicUrlFor(activeShareRestaurant);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const helper = document.createElement("textarea");
        helper.value = url;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.append(helper);
        helper.select();
        const copied = document.execCommand?.("copy");
        helper.remove();
        if (!copied) throw new Error("clipboard-unavailable");
      }
      shareStatus("Enlace copiado.");
    } catch {
      shareStatus("No pudimos copiar el enlace. Podés seleccionarlo manualmente.", "error");
    }
  }

  function shareWithWhatsApp() {
    if (!activeShareRestaurant) return;
    const url = publicUrlFor(activeShareRestaurant);
    const message = `Mirá la carta de ${activeShareRestaurant.brand.name}:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function downloadQrAsset() {
    if (!activeShareRestaurant) return;
    const asset = qrAssetFor(activeShareRestaurant);
    if (!asset) {
      shareStatus("La descarga sólo está disponible para un asset QR local.", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = asset;
    link.download = `${activeShareRestaurant.slug}-qr`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
  }

  async function importRestaurant(file) {
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setFeedback("error", "El archivo supera el límite de 1 MB para una QARTA.");
      return;
    }
    if (file.type && !["application/json", "text/json"].includes(file.type) && !/\.json$/i.test(file.name)) {
      setFeedback("error", "Elegí un archivo JSON de QARTA.");
      return;
    }
    try {
      const payload = JSON.parse(await file.text());
      const errors = importValidationErrors(payload);
      if (errors.length) {
        setFeedback("error", "No pudimos importar esta QARTA.", errors);
        return;
      }
      const imported = normalizeRestaurant(payload.restaurant);
      const originalSlug = imported.slug;
      imported.id = createRestaurantId();
      imported.slug = nextAvailableSlug(originalSlug);
      if (imported.slug !== originalSlug) imported.contact.publicUrl = generatedPublicUrl(imported.slug);
      imported.qr.target = imported.qr.target || imported.contact.publicUrl;
      draft = clone(imported);
      editingSlug = "";
      setFeedback("success", imported.slug === originalSlug ? "La QARTA se cargó para revisión. Guardala cuando esté lista." : `La QARTA se cargó con el slug disponible “${imported.slug}”. Revisala y guardala.`);
      render();
      schedulePreview(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFeedback("error", "No pudimos leer ese archivo JSON.");
    } finally {
      importInput.value = "";
    }
  }

  function addCategory() {
    const index = draft.categories.length + 1;
    draft.categories.push({ id: `categoria-${index}`, label: "Nueva categoría", description: "" });
  }

  function addProduct() {
    const index = draft.products.length + 1;
    draft.products.push({ id: `producto-${index}`, name: "Nuevo producto", description: "", category: draft.categories[0]?.id || "", price: 0, image: "", imageAlt: "", available: true, featured: false, tags: [], variants: [], extras: [] });
  }

  function addPromotion() {
    const index = draft.promotions.length + 1;
    draft.promotions.push({ id: `promo-${index}`, active: true, startsAt: "", endsAt: "", eyebrow: "PROMOCIÓN", title: "Nueva promoción", copy: "", note: "", image: "", imageAlt: "" });
  }

  function handleAction(button) {
    const action = button.dataset.builderAction;
    const index = Number(button.dataset.index);
    const productIndex = Number(button.dataset.productIndex);
    if (action === "import") {
      importInput.click();
      return;
    }
    if (action === "new") {
      draft = createRestaurant();
      editingSlug = "";
      setFeedback("", "");
      render();
      schedulePreview(true);
      return;
    }
    if (action === "edit") {
      const restaurant = savedRestaurants.find((item) => item.slug === button.dataset.slug);
      if (!restaurant) return;
      draft = clone(restaurant);
      editingSlug = restaurant.slug;
      setFeedback("", "");
      render();
      schedulePreview(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (action === "view") {
      const slug = button.dataset.slug;
      if (slug) window.open(`index.html?r=${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (action === "duplicate") {
      duplicateRestaurant(savedRestaurants.find((item) => item.slug === button.dataset.slug));
      return;
    }
    if (action === "share") {
      openShareDialog(savedRestaurants.find((item) => item.slug === button.dataset.slug));
      return;
    }
    if (action === "export") {
      exportRestaurant(savedRestaurants.find((item) => item.slug === button.dataset.slug));
      return;
    }
    if (action === "close-share") { closeShareDialog(); return; }
    if (action === "open-share") { renderShareDialog(); return; }
    if (action === "open-qr") { renderShareDialog("qr"); return; }
    if (action === "copy-link") { copyShareLink(); return; }
    if (action === "share-whatsapp") { shareWithWhatsApp(); return; }
    if (action === "download-qr") { downloadQrAsset(); return; }
    if (action === "delete") {
      const restaurant = savedRestaurants.find((item) => item.slug === button.dataset.slug);
      if (!restaurant || !window.confirm(`¿Eliminar “${restaurant.brand.name || restaurant.slug}”? Esta acción sólo borra su configuración local.`)) return;
      savedRestaurants = savedRestaurants.filter((item) => item.slug !== restaurant.slug);
      if (!persistRestaurants()) return;
      if (editingSlug === restaurant.slug) {
        draft = createRestaurant();
        editingSlug = "";
      }
      setFeedback("success", "La QARTA local fue eliminada.");
      render();
      schedulePreview(true);
      return;
    }
    if (action === "save") { saveRestaurant(); return; }
    if (action === "add-schedule") draft.schedule.push({ days: "", hours: "" });
    if (action === "remove-schedule") draft.schedule.splice(index, 1);
    if (action === "add-category") addCategory();
    if (action === "remove-category") draft.categories.splice(index, 1);
    if (action === "add-product") addProduct();
    if (action === "remove-product") draft.products.splice(index, 1);
    if (action === "add-variant") draft.products[productIndex]?.variants.push({ id: `variante-${draft.products[productIndex].variants.length + 1}`, label: "Nueva variante", priceDelta: 0 });
    if (action === "remove-variant") draft.products[productIndex]?.variants.splice(index, 1);
    if (action === "add-extra") draft.products[productIndex]?.extras.push({ id: `extra-${draft.products[productIndex].extras.length + 1}`, label: "Nuevo extra", price: 0 });
    if (action === "remove-extra") draft.products[productIndex]?.extras.splice(index, 1);
    if (action === "add-promotion") addPromotion();
    if (action === "remove-promotion") draft.promotions.splice(index, 1);
    setFeedback("", "");
    render();
    schedulePreview(true);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-action]");
    if (!button) return;
    event.preventDefault();
    handleAction(button);
  });

  form.addEventListener("input", (event) => {
    const control = event.target.closest("[data-field]");
    if (!control) return;
    setAtPath(draft, control.dataset.field, valueFromControl(control));
    const message = controlFeedback(control);
    if (message) setFeedback("error", message);
    else setFeedback("", "");
    schedulePreview();
  });
  form.addEventListener("change", (event) => {
    const control = event.target.closest("[data-field]");
    if (!control) return;
    setAtPath(draft, control.dataset.field, valueFromControl(control));
    const message = controlFeedback(control);
    if (message) setFeedback("error", message);
    else setFeedback("", "");
    schedulePreview();
  });

  importInput.addEventListener("change", () => { importRestaurant(importInput.files?.[0]); });
  shareDialog.addEventListener("click", (event) => {
    if (event.target === shareDialog) closeShareDialog();
  });

  render();
  schedulePreview(true);
})();
