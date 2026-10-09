(() => {
  "use strict";

  const app = document.getElementById("qarta-app");
  const dialog = document.getElementById("qarta-dialog");
  const announcer = document.getElementById("qarta-announcer");
  const config = window.QARTA_CONFIG || {};
  const staticRestaurants = window.QARTA_RESTAURANTS || {};
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const requestedSlug = new URLSearchParams(window.location.search).get("r");
  const previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
  const builderStorageKey = config.builderStorageKey || "nodo_qarta_builder_v1";
  const builderPreviewStorageKey = config.builderPreviewStorageKey || "nodo_qarta_builder_preview_v1";

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const formatMoney = (value) => money.format(Number(value) || 0);
  const cssVariableName = (name) => String(name).replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
  const presentationOptions = {
    skin: new Set(["sushi-editorial", "direct", "press"]),
    heroLayout: new Set(["plate", "stacked", "cover"]),
    cardLayout: new Set(["image-led", "compact", "bulletin"]),
    density: new Set(["airy", "compact"]),
  };
  const colorKeys = new Set(["ink", "paper", "paperStrong", "accent", "accentDeep", "warm", "line"]);
  const safeColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim() : "";
  const safeUrl = (value = "") => {
    const source = String(value).trim();
    if (!source || /^(?:javascript|data|vbscript):/i.test(source)) return "";
    try {
      const parsed = new URL(source, window.location.href);
      return ["http:", "https:"].includes(parsed.protocol) ? source : "";
    } catch {
      return "";
    }
  };
  const toDate = (value) => (value ? new Date(`${value}T00:00:00`) : null);
  const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const isValidSlug = (value) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  const runtimeText = (value, max = 500) => typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
  const runtimePrice = (value) => {
    const price = Number(value);
    return Number.isFinite(price) && price >= 0 ? price : 0;
  };
  const safeAnchor = (value) => /^#[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(String(value || "").trim()) ? String(value).trim() : "";
  const normalizeEditorialItem = (source) => {
    if (!isRecord(source)) return null;
    return {
      ...source,
      id: runtimeText(source.id, 60),
      number: runtimeText(source.number, 20),
      eyebrow: runtimeText(source.eyebrow, 90),
      title: runtimeText(source.title, 160),
      copy: runtimeText(source.copy, 360),
      image: runtimeText(source.image, 500),
      imageAlt: runtimeText(source.imageAlt, 180),
    };
  };
  const normalizeEditorial = (source) => {
    if (!isRecord(source)) return null;
    const editionToday = normalizeEditorialItem(source.editionToday);
    const place = normalizeEditorialItem(source.place);
    const readings = Array.isArray(source.readings)
      ? source.readings.map(normalizeEditorialItem).filter((item) => item?.title).slice(0, 6)
      : [];
    const edition = isRecord(source.edition) ? {
      city: runtimeText(source.edition.city, 70),
      issue: runtimeText(source.edition.issue, 70),
    } : null;
    return (edition || editionToday?.title || place?.title || readings.length) ? { edition, editionToday, readings, place } : null;
  };

  function normalizeRuntimeRestaurant(source) {
    if (!isRecord(source)
      || !isValidSlug(source.slug)
      || !isRecord(source.brand)
      || !isRecord(source.presentation)
      || !isRecord(source.contact)
      || !isRecord(source.hero)
      || !isRecord(source.copy)
      || !Array.isArray(source.categories)
      || !Array.isArray(source.products)
      || !Array.isArray(source.promotions)
      || !Array.isArray(source.schedule)) return null;

    return {
      ...source,
      slug: source.slug,
      brand: {
        ...source.brand,
        name: runtimeText(source.brand.name, 80),
        shortName: runtimeText(source.brand.shortName, 12),
        descriptor: runtimeText(source.brand.descriptor, 100),
        tagline: runtimeText(source.brand.tagline, 160),
        description: runtimeText(source.brand.description, 360),
      },
      presentation: {
        ...source.presentation,
        colors: isRecord(source.presentation.colors) ? source.presentation.colors : {},
      },
      contact: {
        ...source.contact,
        whatsapp: runtimeText(source.contact.whatsapp, 24),
        locationLabel: runtimeText(source.contact.locationLabel, 140),
        pickupLabel: runtimeText(source.contact.pickupLabel, 140),
        publicUrl: runtimeText(source.contact.publicUrl, 500),
        instagramUrl: runtimeText(source.contact.instagramUrl, 500),
      },
      hero: {
        ...source.hero,
        eyebrow: runtimeText(source.hero.eyebrow, 90),
        title: runtimeText(source.hero.title, 160),
        copy: runtimeText(source.hero.copy, 360),
        image: runtimeText(source.hero.image, 500),
        imageAlt: runtimeText(source.hero.imageAlt, 180),
        primaryCta: runtimeText(source.hero.primaryCta, 70),
        secondaryCta: runtimeText(source.hero.secondaryCta, 70),
        secondaryTarget: safeAnchor(source.hero.secondaryTarget),
      },
      copy: source.copy,
      categories: source.categories.filter(isRecord).map((category) => ({
        ...category,
        id: runtimeText(category.id, 60),
        label: runtimeText(category.label, 80),
        description: runtimeText(category.description, 160),
      })),
      products: source.products.filter(isRecord).map((product) => ({
        ...product,
        id: runtimeText(product.id, 60),
        name: runtimeText(product.name, 100),
        description: runtimeText(product.description, 360),
        category: runtimeText(product.category, 60),
        price: runtimePrice(product.price),
        image: runtimeText(product.image, 500),
        imageAlt: runtimeText(product.imageAlt, 180),
        tags: Array.isArray(product.tags) ? product.tags.map((tag) => runtimeText(tag, 40)).filter(Boolean).slice(0, 10) : [],
        variants: Array.isArray(product.variants) ? product.variants.filter(isRecord).map((variant) => ({
          ...variant,
          id: runtimeText(variant.id, 60),
          label: runtimeText(variant.label, 90),
          priceDelta: runtimePrice(variant.priceDelta),
        })) : [],
        extras: Array.isArray(product.extras) ? product.extras.filter(isRecord).map((extra) => ({
          ...extra,
          id: runtimeText(extra.id, 60),
          label: runtimeText(extra.label, 90),
          price: runtimePrice(extra.price),
        })) : [],
      })),
      promotions: source.promotions.filter(isRecord).map((promotion) => ({
        ...promotion,
        id: runtimeText(promotion.id, 60),
        eyebrow: runtimeText(promotion.eyebrow, 90),
        title: runtimeText(promotion.title, 160),
        copy: runtimeText(promotion.copy, 360),
        note: runtimeText(promotion.note, 220),
        image: runtimeText(promotion.image, 500),
        imageAlt: runtimeText(promotion.imageAlt, 180),
      })),
      schedule: source.schedule.filter(isRecord).map((entry) => ({
        ...entry,
        days: runtimeText(entry.days, 70),
        hours: runtimeText(entry.hours, 70),
      })),
      editorial: normalizeEditorial(source.editorial),
      meta: isRecord(source.meta) ? source.meta : {},
      qr: isRecord(source.qr) ? source.qr : {},
    };
  }

  const staticSlugs = new Set(Object.keys(staticRestaurants));
  const readStoredRestaurants = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(builderStorageKey) || "{}");
      const items = Array.isArray(parsed) ? parsed : parsed?.restaurants;
      if (!Array.isArray(items)) return {};
      return items.reduce((collection, item) => {
        const restaurant = normalizeRuntimeRestaurant(item);
        if (!restaurant || staticSlugs.has(restaurant.slug) || collection[restaurant.slug]) return collection;
        collection[restaurant.slug] = restaurant;
        return collection;
      }, {});
    } catch {
      return {};
    }
  };
  const readPreviewRestaurant = () => {
    try {
      return normalizeRuntimeRestaurant(JSON.parse(window.sessionStorage.getItem(builderPreviewStorageKey) || "null"));
    } catch {
      return null;
    }
  };
  const selectedSlug = requestedSlug || config.defaultRestaurantSlug;
  const fallbackRestaurant = staticRestaurants[config.defaultRestaurantSlug] || Object.values(staticRestaurants)[0] || null;
  const builderRestaurants = readStoredRestaurants();
  const previewRestaurant = previewMode ? readPreviewRestaurant() : null;
  const previewRecovered = previewMode && !previewRestaurant;
  const restaurant = previewMode
    ? (previewRestaurant || fallbackRestaurant)
    : (staticRestaurants[selectedSlug] || builderRestaurants[selectedSlug]);
  const DEFAULT_COPY = {
    heroCaption: "Carta de la semana",
    navigation: {
      menu: "Carta",
      promotions: "Promociones",
      how: "Cómo pedir",
      local: "Información",
    },
    categories: {
      eyebrow: "EXPLORÁ LA CARTA",
      title: "Elegí lo que querés pedir.",
    },
    menu: {
      eyebrow: "LA CARTA",
      title: "Todo para tu pedido.",
      searchPlaceholder: "Buscar en la carta",
      emptySearch: "No encontramos productos con esa búsqueda.",
      clearSearch: "Limpiar búsqueda",
      productCta: "Ver opciones",
    },
    how: {
      eyebrow: "CÓMO PEDIR",
      title: "Tu pedido, en tres pasos.",
      steps: [
        { title: "Explorá la carta.", copy: "Filtrá, buscá y revisá cada opción con calma." },
        { title: "Armá tu pedido.", copy: "Elegí variantes y extras antes de sumarlo." },
        { title: "Continuamos por WhatsApp.", copy: "Definís retiro o envío y recibís el resumen listo para consultar." },
      ],
    },
    local: {
      eyebrow: "CERCA, A TU RITMO",
      copy: "Podés coordinar retiro o consultar por envío al cerrar el pedido. Los datos son demostrativos.",
      scheduleTitle: "Horarios de referencia",
      qrMissingNote: "QR local preparado para incorporar cuando esté disponible.",
    },
    product: {
      variantsLegend: "Elegí una opción",
      extrasLegend: "¿Querés sumar algo?",
      addCta: "Agregar",
      unavailable: "No disponible",
      featured: "Destacado",
    },
    cart: {
      eyebrow: "TU PEDIDO",
      title: "Tu pedido está en camino.",
      clearCta: "Vaciar",
      subtotalLabel: "Subtotal",
      emptyTitle: "Todavía no elegiste nada.",
      emptyCopy: "La carta está lista para que armes un pedido a tu ritmo.",
      browseCta: "Ver la carta",
    },
  };
  const announce = (message) => {
    if (!announcer) return;
    announcer.textContent = "";
    window.setTimeout(() => { announcer.textContent = message; }, 30);
  };

  if (!app) return;

  if (!restaurant) {
    app.innerHTML = `
      <main class="qarta-recovery shell">
        <p class="qarta-kicker">QARTA · DEMO</p>
        <h1>Esta carta no está disponible.</h1>
        <p>La demo solicitada no existe o todavía no fue configurada.</p>
        <a class="qarta-button qarta-button--dark" href="?r=${encodeURIComponent(config.defaultRestaurantSlug || "")}">Abrir la demo disponible</a>
      </main>`;
    return;
  }

  const copyValue = (path) => {
    const resolve = (source) => path.reduce((value, key) => value?.[key], source);
    const configured = resolve(restaurant.copy);
    const fallback = resolve(DEFAULT_COPY);
    return typeof configured === "string" && configured.trim() ? configured : fallback;
  };
  const copySteps = () => DEFAULT_COPY.how.steps.map((fallback, index) => {
    const configured = restaurant.copy?.how?.steps?.[index];
    return {
      title: typeof configured?.title === "string" && configured.title.trim() ? configured.title : fallback.title,
      copy: typeof configured?.copy === "string" && configured.copy.trim() ? configured.copy : fallback.copy,
    };
  });

  const products = Array.isArray(restaurant.products) ? restaurant.products.filter((item) => item?.id && item?.name) : [];
  const categories = Array.isArray(restaurant.categories) ? restaurant.categories : [];
  const productById = new Map(products.map((item) => [item.id, item]));
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const storageKey = `${config.storagePrefix || "qarta_cart_v1"}:${restaurant.slug}`;
  const state = {
    activeCategory: "all",
    search: "",
    navOpen: false,
    cart: [],
    cartNotice: "",
    activeProduct: null,
    lastTrigger: null,
  };

  function applyPresentation() {
    const colors = restaurant.presentation?.colors || {};
    Object.entries(presentationOptions).forEach(([key, options]) => {
      document.body.dataset[`qarta${key[0].toUpperCase()}${key.slice(1)}`] = options.has(restaurant.presentation?.[key]) ? restaurant.presentation[key] : "default";
    });
    Object.entries(colors).forEach(([name, value]) => {
      const color = colorKeys.has(name) ? safeColor(value) : "";
      if (color) document.documentElement.style.setProperty(`--qarta-${cssVariableName(name)}`, color);
    });
  }

  function applyMetadata() {
    const meta = restaurant.meta || {};
    const title = meta.title || `${restaurant.brand?.name || "QARTA"} · Demo gastronómica | NODO`;
    const description = meta.description || "Una experiencia demostrativa de carta digital, pedidos y checkout por WhatsApp.";
    const publicUrl = restaurant.contact?.publicUrl || window.location.href;
    const image = meta.image ? new URL(meta.image, window.location.href).href : "";
    document.title = title;
    const setContent = (selector, content) => {
      const element = document.querySelector(selector);
      if (element && content) element.setAttribute("content", content);
    };
    setContent('meta[name="description"]', description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
    setContent('meta[property="og:url"]', publicUrl);
    setContent('meta[name="twitter:title"]', title);
    setContent('meta[name="twitter:description"]', description);
    if (image) {
      setContent('meta[property="og:image"]', image);
      setContent('meta[name="twitter:image"]', image);
    }
  }

  function normalizeCart(input, onDiscard) {
    if (!Array.isArray(input)) return [];
    return input.reduce((valid, item) => {
      const product = productById.get(item?.productId);
      if (!product || product.available === false) {
        onDiscard?.(item, product);
        return valid;
      }
      const variants = Array.isArray(product.variants) ? product.variants : [];
      const extras = Array.isArray(product.extras) ? product.extras : [];
      const variantId = variants.some((choice) => choice.id === item.variantId) ? item.variantId : (variants[0]?.id || "");
      const extraIds = [...new Set(Array.isArray(item.extraIds) ? item.extraIds.filter((id) => extras.some((choice) => choice.id === id)) : [])].sort();
      const quantity = Math.min(20, Math.max(1, Number.parseInt(item.quantity, 10) || 1));
      valid.push({ productId: product.id, variantId, extraIds, quantity });
      return valid;
    }, []);
  }

  function readCart() {
    if (previewMode) return [];
    try {
      let discarded = false;
      const cart = normalizeCart(JSON.parse(window.localStorage.getItem(storageKey) || "[]"), () => { discarded = true; });
      if (discarded) state.cartNotice = "Actualizamos tu pedido: algunos productos ya no están disponibles.";
      return cart;
    } catch {
      return [];
    }
  }

  function pruneCart() {
    let discarded = false;
    const normalized = normalizeCart(state.cart, () => { discarded = true; });
    if (!discarded) return false;
    state.cart = normalized;
    state.cartNotice = "Actualizamos tu pedido: algunos productos ya no están disponibles.";
    persistCart();
    updateCartBadge();
    return true;
  }

  function persistCart() {
    if (previewMode) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state.cart));
    } catch {
      // El pedido puede continuar en memoria si el navegador impide localStorage.
    }
  }

  function findVariant(product, variantId) {
    return (product.variants || []).find((item) => item.id === variantId) || null;
  }

  function findExtras(product, extraIds) {
    return (product.extras || []).filter((item) => extraIds.includes(item.id));
  }

  function itemKey(item) {
    return `${item.productId}:${item.variantId || "base"}:${[...item.extraIds].sort().join(".")}`;
  }

  function itemUnitPrice(item) {
    const product = productById.get(item.productId);
    if (!product) return 0;
    const variant = findVariant(product, item.variantId);
    const extras = findExtras(product, item.extraIds || []);
    return product.price + (variant?.priceDelta || 0) + extras.reduce((total, extra) => total + extra.price, 0);
  }

  function cartCount() {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  function cartTotal() {
    return state.cart.reduce((total, item) => total + itemUnitPrice(item) * item.quantity, 0);
  }

  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((element) => {
      element.textContent = cartCount();
      element.hidden = cartCount() === 0;
    });
    document.querySelectorAll("[data-cart-total]").forEach((element) => { element.textContent = formatMoney(cartTotal()); });
  }

  function addToCart(item) {
    const normalized = normalizeCart([{ ...item, quantity: Math.max(1, Number(item.quantity) || 1) }])[0];
    if (!normalized) return;
    const key = itemKey(normalized);
    const existing = state.cart.find((entry) => itemKey(entry) === key);
    if (existing) existing.quantity = Math.min(20, existing.quantity + normalized.quantity);
    else state.cart.push(normalized);
    persistCart();
    updateCartBadge();
    announce(`${productById.get(normalized.productId).name} se agregó al pedido.`);
  }

  function updateItemQuantity(index, amount, focusControl) {
    const item = state.cart[index];
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) state.cart.splice(index, 1);
    persistCart();
    updateCartBadge();
    renderCartDialog(focusControl);
  }

  function removeCartItem(index, focusControl) {
    const item = state.cart[index];
    if (!item) return;
    state.cart.splice(index, 1);
    persistCart();
    updateCartBadge();
    renderCartDialog(focusControl);
    announce("Producto eliminado del pedido.");
  }

  function media(src, alt, className = "", eager = false) {
    const source = safeUrl(src);
    return `<div class="qarta-media ${className}">
      ${source ? `<img src="${escapeHtml(source)}" alt="${escapeHtml(alt || "")}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" data-qarta-image>` : ""}
      <span class="qarta-media__fallback" aria-hidden="true">Imagen próximamente</span>
    </div>`;
  }

  function editionTodaySection(editorial) {
    const edition = editorial?.editionToday;
    if (!edition?.title) return "";
    return `<section class="qarta-section qarta-section--edition" id="edicion" aria-labelledby="qarta-edition-title">
      <div class="shell qarta-edition-today">
        <div class="qarta-edition-today__image">${media(edition.image, edition.imageAlt, "qarta-media--edition")}</div>
        <div class="qarta-edition-today__copy"><p class="qarta-kicker">${escapeHtml(edition.eyebrow || "LA EDICIÓN DE HOY")}</p><h2 id="qarta-edition-title">${escapeHtml(edition.title)}</h2><p>${escapeHtml(edition.copy || "")}</p><a class="qarta-text-button" href="#carta">Ver la carta <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>`;
  }

  function readingsSection(editorial) {
    const readings = editorial?.readings || [];
    if (!readings.length) return "";
    return `<section class="qarta-section qarta-section--readings" id="lecturas" aria-labelledby="qarta-readings-title">
      <div class="shell"><div class="qarta-section-heading qarta-section-heading--compact"><p class="qarta-kicker">LECTURAS</p><h2 id="qarta-readings-title">Una pausa también puede ser una página.</h2></div>
        <div class="qarta-readings-grid">${readings.map((reading, index) => `<article class="qarta-reading"><div class="qarta-reading__media">${media(reading.image, reading.imageAlt, "qarta-media--reading")}</div><div class="qarta-reading__body"><span>${escapeHtml(reading.number || String(index + 1).padStart(2, "0"))}</span><h3>${escapeHtml(reading.title)}</h3><p>${escapeHtml(reading.copy || "")}</p></div></article>`).join("")}</div>
      </div>
    </section>`;
  }

  function placeSection(editorial) {
    const place = editorial?.place;
    if (!place?.title) return "";
    return `<section class="qarta-section qarta-section--place" id="puesto" aria-labelledby="qarta-place-title">
      <div class="shell qarta-place"><div class="qarta-place__copy"><p class="qarta-kicker">${escapeHtml(place.eyebrow || "EL PUESTO")}</p><h2 id="qarta-place-title">${escapeHtml(place.title)}</h2><p>${escapeHtml(place.copy || "")}</p></div><div class="qarta-place__image">${media(place.image, place.imageAlt, "qarta-media--place")}</div></div>
    </section>`;
  }

  function productCard(product) {
    const category = categoryById.get(product.category);
    const unavailable = product.available === false;
    return `<article class="qarta-product-card${unavailable ? " qarta-product-card--unavailable" : ""}">
      <button class="qarta-product-card__media" type="button" ${unavailable ? "disabled aria-disabled=\"true\"" : `data-action="open-product" data-product-id="${escapeHtml(product.id)}"`} aria-label="${unavailable ? `${escapeHtml(product.name)}: ${escapeHtml(copyValue(["product", "unavailable"]))}` : `Ver ${escapeHtml(product.name)}`} ">
        ${media(product.image, product.imageAlt || product.name, "qarta-media--product")}
        ${unavailable ? `<span class="qarta-product-card__flag qarta-product-card__flag--unavailable">${escapeHtml(copyValue(["product", "unavailable"]))}</span>` : (product.featured ? `<span class="qarta-product-card__flag">${escapeHtml(copyValue(["product", "featured"]))}</span>` : "")}
      </button>
      <div class="qarta-product-card__body">
        <p class="qarta-product-card__category">${escapeHtml(category?.label || "Carta")}</p>
        <div class="qarta-product-card__title-row">
          <h3>${escapeHtml(product.name)}</h3>
          <strong>${formatMoney(product.price)}</strong>
        </div>
        <p>${escapeHtml(product.description)}</p>
        ${product.tags?.length ? `<ul class="qarta-tags">${product.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
        ${unavailable ? `<span class="qarta-product-card__availability">${escapeHtml(copyValue(["product", "unavailable"]))}</span>` : `<button class="qarta-text-button" type="button" data-action="open-product" data-product-id="${escapeHtml(product.id)}">${escapeHtml(copyValue(["menu", "productCta"]))} <span aria-hidden="true">↗</span></button>`}
      </div>
    </article>`;
  }

  function filteredProducts() {
    const query = state.search.trim().toLocaleLowerCase("es-AR");
    return products.filter((product) => {
      const categoryMatch = state.activeCategory === "all" || product.category === state.activeCategory;
      const text = `${product.name} ${product.description} ${(product.tags || []).join(" ")} ${categoryById.get(product.category)?.label || ""}`.toLocaleLowerCase("es-AR");
      return categoryMatch && (!query || text.includes(query));
    });
  }

  function menuResults() {
    const visibleProducts = filteredProducts();
    if (!visibleProducts.length) {
      return `<div class="qarta-empty-state"><p>${escapeHtml(copyValue(["menu", "emptySearch"]))}</p><button type="button" class="qarta-text-button" data-action="clear-search">${escapeHtml(copyValue(["menu", "clearSearch"]))}</button></div>`;
    }
    return `<div class="qarta-product-grid">${visibleProducts.map(productCard).join("")}</div>`;
  }

  function syncMenu() {
    const resultSlot = document.querySelector("[data-menu-results]");
    if (resultSlot) resultSlot.innerHTML = menuResults();
    document.querySelectorAll("[data-category-id]").forEach((button) => {
      const selected = button.dataset.categoryId === state.activeCategory;
      button.setAttribute("aria-pressed", String(selected));
    });
    const clear = document.querySelector("[data-search-clear]");
    if (clear) clear.hidden = !state.search;
  }

  function activePromotions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (restaurant.promotions || []).filter((promotion) => {
      if (!promotion?.active) return false;
      const start = toDate(promotion.startsAt);
      const end = toDate(promotion.endsAt);
      return (!start || start <= today) && (!end || end >= today);
    });
  }

  function renderPage() {
    const featured = products.filter((product) => product.featured).slice(0, 4);
    const promotions = activePromotions();
    const howSteps = copySteps();
    const editorial = restaurant.editorial;
    const hasEditorial = Boolean(editorial);
    const secondaryTarget = safeAnchor(restaurant.hero.secondaryTarget) || "#como-pedir";
    app.innerHTML = `
      <div class="qarta-demo-strip" role="note">
        <div class="shell">${previewRecovered ? "La vista previa no está disponible; mostramos la carta base de forma segura." : "Demo gastronómica de NODO · Marca, carta, precios y horarios ficticios."}</div>
      </div>
      <header class="qarta-header" data-nav-open="false">
        <div class="shell qarta-header__inner">
          <a class="qarta-brand" href="#inicio" aria-label="${escapeHtml(restaurant.brand.name)}, inicio">
            <span class="qarta-brand__mark" aria-hidden="true">${escapeHtml(restaurant.brand.shortName || restaurant.brand.name.slice(0, 2))}</span>
            <span><strong>${escapeHtml(restaurant.brand.name)}</strong><small>${escapeHtml(restaurant.brand.descriptor || "")}</small></span>
          </a>
          <button class="qarta-menu-toggle" type="button" data-action="toggle-nav" aria-expanded="false" aria-controls="qarta-navigation"><span></span><span></span><span></span><span class="sr-only">Abrir navegación</span></button>
          <nav class="qarta-navigation" id="qarta-navigation" aria-label="Navegación principal">
            ${hasEditorial ? `<a href="#inicio" data-action="close-nav">${escapeHtml(copyValue(["navigation", "cover"]) || "Portada")}</a>` : ""}
            <a href="#carta" data-action="close-nav">${escapeHtml(copyValue(["navigation", "menu"]))}</a>
            ${hasEditorial && editorial.readings?.length ? `<a href="#lecturas" data-action="close-nav">${escapeHtml(copyValue(["navigation", "readings"]) || "Lecturas")}</a>` : ""}
            ${hasEditorial && editorial.place?.title ? `<a href="#puesto" data-action="close-nav">${escapeHtml(copyValue(["navigation", "place"]) || "El puesto")}</a>` : ""}
            ${!hasEditorial && promotions.length ? `<a href="#promos" data-action="close-nav">${escapeHtml(copyValue(["navigation", "promotions"]))}</a>` : ""}
            ${!hasEditorial ? `<a href="#como-pedir" data-action="close-nav">${escapeHtml(copyValue(["navigation", "how"]))}</a>` : ""}
            <a href="#local" data-action="close-nav">${escapeHtml(copyValue(["navigation", "local"]))}</a>
          </nav>
          <button class="qarta-cart-button" type="button" data-action="open-cart" aria-label="Abrir pedido, ${cartCount()} productos">
            <span>Pedido</span><span class="qarta-cart-button__count" data-cart-count ${cartCount() ? "" : "hidden"}>${cartCount()}</span>
          </button>
        </div>
      </header>
      <main>
        <section class="qarta-hero${hasEditorial ? " qarta-hero--editorial" : ""}" id="inicio">
          <div class="shell qarta-hero__grid">
            <div class="qarta-hero__copy">
              ${hasEditorial ? `<p class="qarta-hero__masthead">${escapeHtml(restaurant.brand.name)}</p>${editorial.edition ? `<p class="qarta-hero__issue"><span>${escapeHtml(editorial.edition.city || "")}</span><span>${escapeHtml(editorial.edition.issue || "")}</span></p>` : ""}` : ""}
              <p class="qarta-kicker">${escapeHtml(restaurant.hero.eyebrow || "")}</p>
              <h1>${escapeHtml(restaurant.hero.title || restaurant.brand.tagline)}</h1>
              <p class="qarta-hero__lead">${escapeHtml(restaurant.hero.copy || restaurant.brand.description || "")}</p>
              <div class="qarta-hero__actions">
                <a class="qarta-button qarta-button--dark" href="#carta">${escapeHtml(restaurant.hero.primaryCta || "Ver carta")} <span aria-hidden="true">↓</span></a>
                <a class="qarta-button qarta-button--quiet" href="${escapeHtml(secondaryTarget)}">${escapeHtml(restaurant.hero.secondaryCta || "Cómo pedir")}</a>
              </div>
              <p class="qarta-hero__location">${escapeHtml(restaurant.contact.pickupLabel || restaurant.contact.locationLabel || "")}</p>
            </div>
             <div class="qarta-hero__visual">
               ${media(restaurant.hero.image, restaurant.hero.imageAlt, "qarta-media--hero", true)}
               <span class="qarta-hero__caption">${escapeHtml(copyValue(["heroCaption"]))}</span>
             </div>
          </div>
        </section>
        ${editionTodaySection(editorial)}
        <section class="qarta-section qarta-section--categories" aria-labelledby="qarta-categories-title">
          <div class="shell">
             <div class="qarta-section-heading qarta-section-heading--compact">
               <p class="qarta-kicker">${escapeHtml(copyValue(["categories", "eyebrow"]))}</p>
               <h2 id="qarta-categories-title">${escapeHtml(copyValue(["categories", "title"]))}</h2>
            </div>
            <div class="qarta-category-rail" role="list">
              ${categories.map((category) => `<a role="listitem" class="qarta-category-link" href="#carta" data-action="choose-category" data-category-id="${escapeHtml(category.id)}"><strong>${escapeHtml(category.label)}</strong><span>${escapeHtml(category.description || "")}</span><i aria-hidden="true">↘</i></a>`).join("")}
            </div>
          </div>
        </section>
        <section class="qarta-section qarta-section--menu" id="carta" aria-labelledby="qarta-menu-title">
          <div class="shell">
            <div class="qarta-menu-head">
               <div class="qarta-section-heading">
                 <p class="qarta-kicker">${escapeHtml(copyValue(["menu", "eyebrow"]))}</p>
                 <h2 id="qarta-menu-title">${escapeHtml(copyValue(["menu", "title"]))}</h2>
              </div>
              <label class="qarta-search">
                <span class="sr-only">Buscar en la carta</span>
                 <span aria-hidden="true">⌕</span><input type="search" data-menu-search placeholder="${escapeHtml(copyValue(["menu", "searchPlaceholder"]))}" autocomplete="off"><button type="button" data-action="clear-search" data-search-clear hidden aria-label="${escapeHtml(copyValue(["menu", "clearSearch"]))}">×</button>
              </label>
            </div>
            <div class="qarta-filter-row" aria-label="Filtrar carta por categoría">
              <button type="button" class="qarta-filter" data-action="choose-category" data-category-id="all" aria-pressed="true">Todo</button>
              ${categories.map((category) => `<button type="button" class="qarta-filter" data-action="choose-category" data-category-id="${escapeHtml(category.id)}" aria-pressed="false">${escapeHtml(category.label)}</button>`).join("")}
            </div>
            <div data-menu-results>${menuResults()}</div>
          </div>
        </section>
        ${promotions.length ? `<section class="qarta-section qarta-section--promo" id="promos" aria-labelledby="qarta-promo-title">
          <div class="shell">${promotions.map((promotion) => `<article class="qarta-promo">
            <div class="qarta-promo__copy"><p class="qarta-kicker">${escapeHtml(promotion.eyebrow || "PROMOCIÓN")}</p><h2 id="qarta-promo-title">${escapeHtml(promotion.title)}</h2><p>${escapeHtml(promotion.copy)}</p><small>${escapeHtml(promotion.note || "")}</small></div>
            ${media(promotion.image, promotion.imageAlt, "qarta-media--promo")}
          </article>`).join("")}</div>
        </section>` : ""}
        ${readingsSection(editorial)}
        ${placeSection(editorial)}
        <section class="qarta-section qarta-section--how" id="como-pedir" aria-labelledby="qarta-how-title">
           <div class="shell">
             <div class="qarta-section-heading"><p class="qarta-kicker">${escapeHtml(copyValue(["how", "eyebrow"]))}</p><h2 id="qarta-how-title">${escapeHtml(copyValue(["how", "title"]))}</h2></div>
             <ol class="qarta-steps">
               ${howSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.copy)}</p></li>`).join("")}
             </ol>
          </div>
        </section>
        <section class="qarta-section qarta-section--local" id="local" aria-labelledby="qarta-local-title">
           <div class="shell qarta-local">
             <div><p class="qarta-kicker">${escapeHtml(copyValue(["local", "eyebrow"]))}</p><h2 id="qarta-local-title">${escapeHtml(restaurant.contact.locationLabel || "Nuestro local")}</h2><p>${escapeHtml(copyValue(["local", "copy"]))}</p></div>
             <div class="qarta-local__details"><div><strong>${escapeHtml(copyValue(["local", "scheduleTitle"]))}</strong>${(restaurant.schedule || []).map((entry) => `<span>${escapeHtml(entry.days)} <b>${escapeHtml(entry.hours)}</b></span>`).join("")}</div>
               <div class="qarta-qr-slot">${safeUrl(restaurant.qr?.asset) ? `<img src="${escapeHtml(safeUrl(restaurant.qr.asset))}" alt="Código QR para abrir la carta" loading="lazy">` : `<p><strong>${escapeHtml(restaurant.qr?.label || "Link de la carta")}</strong><a href="${escapeHtml(safeUrl(restaurant.qr?.target || restaurant.contact.publicUrl) || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(restaurant.qr?.target || restaurant.contact.publicUrl || "")}</a><small>${escapeHtml(copyValue(["local", "qrMissingNote"]))}</small></p>`}</div>
            </div>
          </div>
        </section>
      </main>
      <footer class="qarta-footer"><div class="shell"><div><strong>${escapeHtml(restaurant.brand.name)}</strong><span>${escapeHtml(restaurant.brand.descriptor || "")}</span></div><p>Demo conceptual de NODO. No representa un comercio real ni recibe pedidos reales.</p><a href="/demos/">Ver otras demos de NODO <span aria-hidden="true">↗</span></a></div></footer>`;
    updateCartBadge();
  }

  function showDialog(markup, trigger) {
    if (!dialog) return;
    state.lastTrigger = trigger || document.activeElement;
    dialog.innerHTML = markup;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.hidden = false;
      dialog.setAttribute("open", "");
    }
  }

  function rememberDialogControl(element) {
    if (!element?.matches?.("[data-action]")) return null;
    return ["action", "variantId", "extraId", "amount", "cartIndex"].reduce((control, key) => {
      if (element.dataset[key] !== undefined) control[key] = element.dataset[key];
      return control;
    }, {});
  }

  function restoreDialogFocus(control) {
    if (!control || !dialog?.open) return;
    window.setTimeout(() => {
      const target = [...dialog.querySelectorAll("[data-action]")].find((element) => Object.entries(control).every(([key, value]) => element.dataset[key] === value));
      (target || dialog.querySelector("[data-action='close-dialog']"))?.focus();
    }, 0);
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else {
      dialog.removeAttribute("open");
      dialog.hidden = true;
    }
    const focusTarget = state.lastTrigger;
    window.setTimeout(() => focusTarget?.focus?.(), 0);
  }

  function productDialogMarkup(product) {
    const current = state.activeProduct;
    const selectedVariant = findVariant(product, current.variantId);
    const selectedExtras = findExtras(product, current.extraIds);
    const unit = product.price + (selectedVariant?.priceDelta || 0) + selectedExtras.reduce((total, extra) => total + extra.price, 0);
    return `<article class="qarta-dialog__panel qarta-product-dialog">
      <button class="qarta-dialog__close" type="button" data-action="close-dialog" aria-label="Cerrar detalle">×</button>
      <div class="qarta-product-dialog__media">${media(product.image, product.imageAlt || product.name, "qarta-media--dialog", true)}</div>
      <div class="qarta-product-dialog__content">
        <p class="qarta-kicker">${escapeHtml(categoryById.get(product.category)?.label || "Carta")}</p>
        <h2 id="qarta-dialog-title">${escapeHtml(product.name)}</h2>
        <p>${escapeHtml(product.description)}</p>
        ${product.variants?.length ? `<fieldset class="qarta-choice-group"><legend>${escapeHtml(copyValue(["product", "variantsLegend"]))}</legend><div class="qarta-choice-row">${product.variants.map((choice) => `<button type="button" class="qarta-choice ${choice.id === current.variantId ? "is-selected" : ""}" data-action="product-variant" data-variant-id="${escapeHtml(choice.id)}" aria-pressed="${choice.id === current.variantId}"><span>${escapeHtml(choice.label)}</span>${choice.priceDelta ? `<small>+${formatMoney(choice.priceDelta)}</small>` : ""}</button>`).join("")}</div></fieldset>` : ""}
        ${product.extras?.length ? `<fieldset class="qarta-choice-group"><legend>${escapeHtml(copyValue(["product", "extrasLegend"]))}</legend><div class="qarta-extras">${product.extras.map((choice) => `<label class="qarta-extra"><input type="checkbox" data-action="product-extra" data-extra-id="${escapeHtml(choice.id)}" ${current.extraIds.includes(choice.id) ? "checked" : ""}><span>${escapeHtml(choice.label)}</span><small>+${formatMoney(choice.price)}</small></label>`).join("")}</div></fieldset>` : ""}
        <div class="qarta-dialog__footer"><div class="qarta-quantity" aria-label="Cantidad"><button type="button" data-action="product-quantity" data-amount="-1" aria-label="Restar una unidad">−</button><output>${current.quantity}</output><button type="button" data-action="product-quantity" data-amount="1" aria-label="Sumar una unidad">+</button></div><button type="button" class="qarta-button qarta-button--dark" data-action="add-product">${escapeHtml(copyValue(["product", "addCta"]))} · ${formatMoney(unit * current.quantity)}</button></div>
      </div>
    </article>`;
  }

  function openProduct(productId, trigger) {
    const product = productById.get(productId);
    if (!product || product.available === false) return;
    state.activeProduct = { productId: product.id, variantId: product.variants?.[0]?.id || "", extraIds: [], quantity: 1 };
    showDialog(productDialogMarkup(product), trigger);
  }

  function renderProductDialog(focusControl) {
    const product = productById.get(state.activeProduct?.productId);
    if (product && dialog?.open) {
      dialog.innerHTML = productDialogMarkup(product);
      restoreDialogFocus(focusControl);
    }
  }

  function cartLine(item, index) {
    const product = productById.get(item.productId);
    if (!product) return "";
    const variant = findVariant(product, item.variantId);
    const extras = findExtras(product, item.extraIds);
    const details = [variant?.label, ...extras.map((extra) => extra.label)].filter(Boolean).join(" · ");
    return `<li class="qarta-cart-line"><div><strong>${escapeHtml(product.name)}</strong>${details ? `<small>${escapeHtml(details)}</small>` : ""}<button type="button" data-action="cart-remove" data-cart-index="${index}">Quitar</button></div><div><span>${formatMoney(itemUnitPrice(item) * item.quantity)}</span><div class="qarta-quantity qarta-quantity--small"><button type="button" data-action="cart-quantity" data-cart-index="${index}" data-amount="-1" aria-label="Restar una unidad de ${escapeHtml(product.name)}">−</button><output>${item.quantity}</output><button type="button" data-action="cart-quantity" data-cart-index="${index}" data-amount="1" aria-label="Sumar una unidad de ${escapeHtml(product.name)}">+</button></div></div></li>`;
  }

  function cartDialogMarkup() {
    const notice = state.cartNotice ? `<p class="qarta-cart-notice" role="status">${escapeHtml(state.cartNotice)}</p>` : "";
    if (!state.cart.length) {
      return `<article class="qarta-dialog__panel qarta-cart-dialog qarta-cart-dialog--empty"><button class="qarta-dialog__close" type="button" data-action="close-dialog" aria-label="Cerrar pedido">×</button><p class="qarta-kicker">${escapeHtml(copyValue(["cart", "eyebrow"]))}</p><h2 id="qarta-dialog-title">${escapeHtml(copyValue(["cart", "emptyTitle"]))}</h2>${notice}<p>${escapeHtml(copyValue(["cart", "emptyCopy"]))}</p><button class="qarta-button qarta-button--dark" type="button" data-action="close-and-menu">${escapeHtml(copyValue(["cart", "browseCta"]))}</button></article>`;
    }
    return `<article class="qarta-dialog__panel qarta-cart-dialog"><button class="qarta-dialog__close" type="button" data-action="close-dialog" aria-label="Cerrar pedido">×</button><div class="qarta-cart-dialog__head"><div><p class="qarta-kicker">${escapeHtml(copyValue(["cart", "eyebrow"]))}</p><h2 id="qarta-dialog-title">${escapeHtml(copyValue(["cart", "title"]))}</h2></div><button type="button" class="qarta-text-button" data-action="clear-cart">${escapeHtml(copyValue(["cart", "clearCta"]))}</button></div>${notice}<ul class="qarta-cart-list">${state.cart.map(cartLine).join("")}</ul><div class="qarta-cart-total"><span>${escapeHtml(copyValue(["cart", "subtotalLabel"]))}</span><strong data-cart-total>${formatMoney(cartTotal())}</strong></div><form class="qarta-checkout" data-checkout-form novalidate><fieldset><legend>¿Cómo lo querés recibir?</legend><div class="qarta-delivery-options"><label><input type="radio" name="deliveryMode" value="pickup" checked> <span>Retiro</span><small>${escapeHtml(restaurant.contact.pickupLabel || "Retiro en el local")}</small></label><label><input type="radio" name="deliveryMode" value="delivery"> <span>Envío</span><small>A coordinar por WhatsApp</small></label></div></fieldset><label>Tu nombre<input name="customerName" required autocomplete="name" maxlength="80" placeholder="Cómo te llamás"></label><div data-delivery-fields hidden><label>Dirección<input name="address" autocomplete="street-address" maxlength="160" placeholder="Calle y altura"></label><label>Barrio<input name="neighborhood" maxlength="80" placeholder="Barrio o zona"></label></div><label>Notas para el pedido <span>(opcional)</span><textarea name="notes" rows="2" maxlength="300" placeholder="Aclaraciones para consultar"></textarea></label><fieldset><legend>Forma de pago <span>(informativa)</span></legend><select name="payment"><option value="A coordinar">A coordinar</option><option value="Efectivo">Efectivo</option><option value="Transferencia">Transferencia</option></select></fieldset><p class="qarta-checkout__privacy">Tus datos se usan sólo para preparar este mensaje. No se guardan en esta demo.</p><button type="submit" class="qarta-button qarta-button--dark qarta-button--wide">Continuar por WhatsApp <span aria-hidden="true">↗</span></button></form></article>`;
  }

  function openCart(trigger) {
    pruneCart();
    showDialog(cartDialogMarkup(), trigger);
  }
  function renderCartDialog(focusControl) {
    if (dialog?.open) {
      dialog.innerHTML = cartDialogMarkup();
      restoreDialogFocus(focusControl);
    }
  }

  function handleCheckout(form) {
    if (previewMode) {
      announce("Vista previa: el pedido no se envía desde el Builder.");
      return;
    }
    if (pruneCart() || !state.cart.length) {
      renderCartDialog();
      announce(state.cartNotice || "Tu pedido está vacío.");
      return;
    }
    const values = new FormData(form);
    const name = String(values.get("customerName") || "").trim();
    const deliveryMode = String(values.get("deliveryMode") || "pickup");
    const address = String(values.get("address") || "").trim();
    const neighborhood = String(values.get("neighborhood") || "").trim();
    const notes = String(values.get("notes") || "").trim();
    const payment = String(values.get("payment") || "A coordinar");
    const addressInput = form.elements.address;
    const neighborhoodInput = form.elements.neighborhood;
    if (addressInput) addressInput.required = deliveryMode === "delivery";
    if (neighborhoodInput) neighborhoodInput.required = deliveryMode === "delivery";
    if (!form.reportValidity()) return;

    const lines = state.cart.map((item) => {
      const product = productById.get(item.productId);
      const variant = findVariant(product, item.variantId);
      const extras = findExtras(product, item.extraIds).map((extra) => extra.label);
      const detail = [variant?.label, ...extras].filter(Boolean).join(", ");
      return `• ${item.quantity} × ${product.name}${detail ? ` (${detail})` : ""} — ${formatMoney(itemUnitPrice(item) * item.quantity)}`;
    });
    const delivery = deliveryMode === "delivery"
      ? `Envío a ${address}${neighborhood ? `, ${neighborhood}` : ""}`
      : `Retiro · ${restaurant.contact.pickupLabel || restaurant.contact.locationLabel || "a coordinar"}`;
    const message = [
      "Hola, estoy probando la demo gastronómica de NODO y quería consultarles por este pedido.",
      "Esta es una prueba/demo gastronómica; no es un pedido real.",
      "",
      "Pedido:",
      ...lines,
      "",
      `Subtotal de referencia: ${formatMoney(cartTotal())}`,
      `Entrega: ${delivery}`,
      `Nombre: ${name}`,
      `Pago: ${payment}`,
      ...(notes ? [`Notas: ${notes}`] : []),
    ].join("\n");
    const number = String(restaurant.contact?.whatsapp || "").replace(/\D/g, "");
    if (!number) {
      announce("No hay un destino de WhatsApp configurado para esta demo.");
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (popup) popup.opener = null;
  }

  function setNav(open) {
    state.navOpen = open;
    const header = document.querySelector(".qarta-header");
    const toggle = document.querySelector(".qarta-menu-toggle");
    header?.setAttribute("data-nav-open", String(open));
    toggle?.setAttribute("aria-expanded", String(open));
  }

  function scrollToMenu() {
    closeDialog();
    document.getElementById("carta")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function resolveInitialHash() {
    const hash = safeAnchor(window.location.hash);
    if (!hash) return;
    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  function chooseCategory(id) {
    state.activeCategory = id === "all" || categoryById.has(id) ? id : "all";
    syncMenu();
    setNav(false);
  }

  function updateDeliveryFields(form) {
    const isDelivery = form.elements.deliveryMode?.value === "delivery";
    const fields = form.querySelector("[data-delivery-fields]");
    if (fields) fields.hidden = !isDelivery;
    [form.elements.address, form.elements.neighborhood].forEach((input) => {
      if (input) input.required = isDelivery;
    });
  }

  document.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    if (action === "open-product") { event.preventDefault(); openProduct(actionElement.dataset.productId, actionElement); }
    if (action === "open-cart") { event.preventDefault(); openCart(actionElement); }
    if (action === "close-dialog") { event.preventDefault(); closeDialog(); }
    if (action === "close-and-menu") { event.preventDefault(); scrollToMenu(); }
    if (action === "toggle-nav") { event.preventDefault(); setNav(!state.navOpen); }
    if (action === "close-nav") setNav(false);
    if (action === "choose-category") {
      event.preventDefault();
      chooseCategory(actionElement.dataset.categoryId);
      if (actionElement.tagName === "A") document.getElementById("carta")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
    if (action === "clear-search") {
      event.preventDefault();
      state.search = "";
      const input = document.querySelector("[data-menu-search]");
      if (input) { input.value = ""; input.focus(); }
      syncMenu();
    }
    if (action === "product-variant") {
      event.preventDefault();
      state.activeProduct.variantId = actionElement.dataset.variantId || "";
      renderProductDialog(rememberDialogControl(actionElement));
    }
    if (action === "product-quantity") {
      event.preventDefault();
      state.activeProduct.quantity = Math.min(20, Math.max(1, state.activeProduct.quantity + Number(actionElement.dataset.amount || 0)));
      renderProductDialog(rememberDialogControl(actionElement));
    }
    if (action === "add-product") {
      event.preventDefault();
      addToCart(state.activeProduct);
      closeDialog();
    }
    if (action === "cart-quantity") { event.preventDefault(); updateItemQuantity(Number(actionElement.dataset.cartIndex), Number(actionElement.dataset.amount || 0), rememberDialogControl(actionElement)); }
    if (action === "cart-remove") { event.preventDefault(); removeCartItem(Number(actionElement.dataset.cartIndex), rememberDialogControl(actionElement)); }
    if (action === "clear-cart") {
      event.preventDefault();
      state.cart = [];
      state.cartNotice = "";
      persistCart();
      updateCartBadge();
      renderCartDialog(rememberDialogControl(actionElement));
      announce("Pedido vaciado.");
    }
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-menu-search]")) return;
    state.search = event.target.value || "";
    syncMenu();
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-action='product-extra']") && state.activeProduct) {
      const selected = new Set(state.activeProduct.extraIds);
      if (event.target.checked) selected.add(event.target.dataset.extraId);
      else selected.delete(event.target.dataset.extraId);
      state.activeProduct.extraIds = [...selected];
      renderProductDialog(rememberDialogControl(event.target));
      return;
    }
    if (event.target.matches("[data-checkout-form] input[name=deliveryMode]")) updateDeliveryFields(event.target.form);
  });

  document.addEventListener("submit", (event) => {
    if (!event.target.matches("[data-checkout-form]")) return;
    event.preventDefault();
    handleCheckout(event.target);
  });

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener("close", () => { state.activeProduct = null; });
  document.addEventListener("error", (event) => {
    if (!event.target.matches?.("[data-qarta-image]")) return;
    event.target.hidden = true;
    event.target.parentElement?.classList.add("qarta-media--missing");
  }, true);

  state.cart = readCart();
  if (state.cartNotice) persistCart();
  applyPresentation();
  applyMetadata();
  renderPage();
  resolveInitialHash();
})();
