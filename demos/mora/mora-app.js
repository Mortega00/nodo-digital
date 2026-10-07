(() => {
    "use strict";

    const config = window.MORA_CONFIG || {};
    const products = Array.isArray(window.MORA_PRODUCTS) ? window.MORA_PRODUCTS : [];
    const categories = Array.isArray(window.MORA_CATEGORIES) ? window.MORA_CATEGORIES : [];
    const root = document.body.dataset.root || "./";
    const page = document.body.dataset.page || "home";
    const isFilePreview = window.location.protocol === "file:";
    const storageKey = config.storageKey || "nodo_mora_cart_v1";
    let memoryCart = [];

    const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;"
    })[character]);
    const route = path => `${root}${path}`;
    const catalogRoute = () => route(isFilePreview ? "catalogo/index.html" : "catalogo/");
    const productRoute = id => `${route(isFilePreview ? "producto/index.html" : "producto/")}?id=${encodeURIComponent(id)}`;
    const cartRoute = () => route(isFilePreview ? "carrito/index.html" : "carrito/");
    const categoryById = id => categories.find(category => category.id === id);
    const productById = id => products.find(product => product.id === id);
    const productImage = (product, variant = "") => product?.variantImages?.[variant] || product?.image || "";
    const formatPrice = amount => new Intl.NumberFormat("es-AR", {
        style: "currency", currency: config.currency || "ARS", maximumFractionDigits: 0
    }).format(amount);

    function announce(message) {
        const target = document.getElementById("mora-announcer");
        if (target) target.textContent = message;
    }

    function normalizeCart(value) {
        if (!Array.isArray(value)) return [];
        const items = new Map();
        value.forEach(entry => {
            if (!entry || typeof entry !== "object") return;
            const product = productById(String(entry.product || ""));
            if (!product) return;
            const variants = Array.isArray(product.variants) ? product.variants : [];
            const variant = variants.length ? (variants.includes(entry.variant) ? entry.variant : variants[0]) : "";
            const quantity = Math.max(1, Math.min(9, Number.parseInt(entry.quantity, 10) || 1));
            const key = `${product.id}::${variant}`;
            const existing = items.get(key);
            items.set(key, { product: product.id, variant, quantity: Math.min(9, quantity + (existing?.quantity || 0)) });
        });
        return [...items.values()];
    }

    function getCart() {
        try {
            const saved = window.localStorage.getItem(storageKey);
            if (saved === null) return normalizeCart(memoryCart);
            return normalizeCart(JSON.parse(saved));
        } catch {
            return normalizeCart(memoryCart);
        }
    }

    function saveCart(nextCart) {
        const cleanCart = normalizeCart(nextCart);
        memoryCart = cleanCart;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(cleanCart));
        } catch {
            // La demo sigue funcionando durante la sesión cuando el storage no está disponible.
        }
        updateCartBadge();
        return cleanCart;
    }

    function cartDetails() {
        return getCart().map(item => ({ ...item, details: productById(item.product) })).filter(item => item.details);
    }

    function itemCount() {
        return getCart().reduce((total, item) => total + item.quantity, 0);
    }

    function cartSubtotal() {
        return cartDetails().reduce((total, item) => total + item.details.price * item.quantity, 0);
    }

    function updateCartBadge() {
        const count = itemCount();
        document.querySelectorAll("[data-cart-count]").forEach(target => { target.textContent = String(count); });
        document.querySelectorAll("[data-cart-link]").forEach(link => {
            link.setAttribute("aria-label", `Ir al carrito, ${count} ${count === 1 ? "producto" : "productos"}`);
        });
    }

    function addToCart(productId, variant, quantity = 1) {
        const product = productById(productId);
        if (!product) return;
        const variants = Array.isArray(product.variants) ? product.variants : [];
        const selectedVariant = variants.length ? (variants.includes(variant) ? variant : variants[0]) : "";
        const key = `${product.id}::${selectedVariant}`;
        const next = getCart();
        const current = next.find(item => `${item.product}::${item.variant}` === key);
        if (current) current.quantity = Math.min(9, current.quantity + Math.max(1, quantity));
        else next.push({ product: product.id, variant: selectedVariant, quantity: Math.max(1, Math.min(9, quantity)) });
        saveCart(next);
        announce(`${product.name} se agregó al carrito.`);
    }

    function updateCartItem(productId, variant, nextQuantity) {
        const next = getCart().map(item => ({ ...item }));
        const item = next.find(entry => entry.product === productId && entry.variant === variant);
        if (!item) return;
        if (nextQuantity <= 0) {
            saveCart(next.filter(entry => entry !== item));
            announce("Producto eliminado del carrito.");
            return;
        }
        item.quantity = Math.min(9, Math.max(1, nextQuantity));
        saveCart(next);
        announce("Cantidad actualizada.");
    }

    function demoNoticeMarkup() {
        return `<div class="mora-demo-note"><div class="mora-container"><a href="/demos/">DEMO NODO</a><span>Experiencia demostrativa, sin compras ni pagos reales.</span></div></div>`;
    }

    function headerMarkup() {
        const isCatalog = page === "catalog";
        const isCart = page === "cart";
        return `${demoNoticeMarkup()}<header class="mora-header"><div class="mora-container mora-header-inner"><a class="mora-brand" href="${route("")}" aria-label="MORA Accesorios, ir al inicio"><span>MORA</span><small>ACCESORIOS</small></a><nav class="mora-nav" aria-label="Navegación principal"><a href="${catalogRoute()}"${isCatalog ? ' aria-current="page"' : ""}>Catálogo</a><a class="mora-cart-link" data-cart-link href="${cartRoute()}"${isCart ? ' aria-current="page"' : ""}>Carrito <span class="mora-cart-badge" data-cart-count>0</span></a></nav></div></header>`;
    }

    function footerMarkup() {
        return `<aside class="mora-nodo-cta" aria-labelledby="mora-nodo-title"><div class="mora-container"><p class="mora-kicker">DEMO NODO</p><h2 id="mora-nodo-title">¿Te gustaría una tienda así para tu negocio?</h2><p>Podemos adaptar esta experiencia a tu marca, contenido y forma de vender.</p><a class="mora-button mora-button-light" href="/contacto/">Adaptar a mi negocio <span aria-hidden="true">→</span></a></div></aside><footer class="mora-footer"><div class="mora-container mora-footer-grid"><div><a class="mora-brand mora-brand-footer" href="${route("")}" aria-label="MORA Accesorios, ir al inicio"><span>MORA</span><small>ACCESORIOS</small></a><p>Objetos, bolsos y detalles para todos los días.</p></div><nav aria-label="Navegación secundaria"><a href="${catalogRoute()}">Catálogo</a><a href="${cartRoute()}">Carrito</a><a href="/demos/">Volver a Industrias</a></nav><p class="mora-footer-demo">MORA es una tienda ficticia creada para demostrar una experiencia e-commerce de NODO.</p></div></footer>`;
    }

    function productCard(product, loading = "lazy") {
        const category = categoryById(product.category);
        return `<article class="mora-product-card"><a class="mora-product-image" href="${productRoute(product.id)}"><img src="${route(productImage(product))}" alt="${escapeHTML(product.alt)}" width="1200" height="1200" loading="${loading}" decoding="async"></a><div class="mora-product-card-copy"><p class="mora-product-category">${escapeHTML(category?.label || "MORA")}</p><h3><a href="${productRoute(product.id)}">${escapeHTML(product.name)}</a></h3><p>${escapeHTML(product.shortDescription)}</p><div class="mora-product-card-bottom"><strong>${formatPrice(product.price)}</strong><a class="mora-text-link" href="${productRoute(product.id)}">Ver detalle <span aria-hidden="true">→</span></a></div></div></article>`;
    }

    function renderHome() {
        const categoriesTarget = document.querySelector("[data-home-categories]");
        const productsTarget = document.querySelector("[data-home-products]");
        if (categoriesTarget) {
            categoriesTarget.innerHTML = categories.map(category => `<a class="mora-category-card" href="${catalogRoute()}?categoria=${encodeURIComponent(category.id)}"><span>${String(category.label).replace(" / regalos", "")}</span><small>${escapeHTML(category.description)}</small><b aria-hidden="true">→</b></a>`).join("");
        }
        if (productsTarget) {
            productsTarget.innerHTML = products.filter(product => product.featured).slice(0, 4).map((product, index) => productCard(product, index === 0 ? "eager" : "lazy")).join("");
        }
    }

    function catalogMarkup(selectedCategory, sort) {
        const activeCategory = categories.some(category => category.id === selectedCategory) ? selectedCategory : "all";
        const options = [{ id: "all", label: "Todo" }, ...categories];
        return `<section class="mora-page-intro"><div class="mora-container"><a class="mora-back-link" href="${route("")}"><span aria-hidden="true">←</span> Volver a MORA</a><p class="mora-kicker">CATÁLOGO</p><h1>Elegí lo que querés llevar cerca.</h1><p>Diez piezas demostrativas para recorrer una tienda online simple, visual y clara.</p></div></section><section class="mora-catalog-section"><div class="mora-container"><div class="mora-catalog-controls"><div class="mora-category-filter" aria-label="Filtrar por categoría">${options.map(category => `<button type="button" data-filter-category="${category.id}" aria-pressed="${activeCategory === category.id}">${escapeHTML(category.label)}</button>`).join("")}</div><label class="mora-sort-label">Ordenar<select data-catalog-sort aria-label="Ordenar catálogo"><option value="featured"${sort === "featured" ? " selected" : ""}>Destacados</option><option value="low"${sort === "low" ? " selected" : ""}>Menor precio</option><option value="high"${sort === "high" ? " selected" : ""}>Mayor precio</option></select></label></div><div class="mora-product-grid mora-catalog-grid" data-catalog-products></div></div></section>`;
    }

    function catalogProducts(selectedCategory, sort) {
        const filtered = products.filter(product => selectedCategory === "all" || product.category === selectedCategory).slice();
        if (sort === "low") filtered.sort((first, second) => first.price - second.price);
        if (sort === "high") filtered.sort((first, second) => second.price - first.price);
        if (sort === "featured") filtered.sort((first, second) => Number(second.featured) - Number(first.featured));
        return filtered;
    }

    function initCatalog() {
        const target = document.querySelector("[data-catalog-page]");
        if (!target) return;
        const params = new URLSearchParams(window.location.search);
        let category = categories.some(item => item.id === params.get("categoria")) ? params.get("categoria") : "all";
        let sort = ["featured", "low", "high"].includes(params.get("orden")) ? params.get("orden") : "featured";
        const render = () => {
            target.innerHTML = catalogMarkup(category, sort);
            const productsTarget = target.querySelector("[data-catalog-products]");
            const visible = catalogProducts(category, sort);
            productsTarget.innerHTML = visible.length ? visible.map(product => productCard(product)).join("") : `<p class="mora-empty-copy">No hay productos para este filtro.</p>`;
            target.querySelectorAll("[data-filter-category]").forEach(button => button.addEventListener("click", () => {
                category = button.dataset.filterCategory;
                syncCatalogUrl(category, sort);
                render();
            }));
            target.querySelector("[data-catalog-sort]")?.addEventListener("change", event => {
                sort = event.target.value;
                syncCatalogUrl(category, sort);
                render();
            });
        };
        render();
    }

    function syncCatalogUrl(category, sort) {
        const query = new URLSearchParams();
        if (category !== "all") query.set("categoria", category);
        if (sort !== "featured") query.set("orden", sort);
        const suffix = query.toString() ? `?${query}` : "";
        try {
            window.history.replaceState({}, "", `${window.location.pathname}${suffix}`);
        } catch {
            // La navegación y los filtros siguen funcionando si el navegador bloquea History API (por ejemplo, en file://).
        }
    }

    function quantityControl(quantity) {
        return `<div class="mora-quantity" aria-label="Cantidad"><button type="button" data-quantity-change="-1" aria-label="Reducir cantidad">−</button><output data-quantity-value>${quantity}</output><button type="button" data-quantity-change="1" aria-label="Aumentar cantidad">+</button></div>`;
    }

    function initProduct() {
        const target = document.querySelector("[data-product-page]");
        if (!target) return;
        const product = productById(new URLSearchParams(window.location.search).get("id")) || products[0];
        if (!product) return;
        const category = categoryById(product.category);
        const variants = Array.isArray(product.variants) ? product.variants : [];
        let selectedVariant = variants[0] || "";
        let quantity = 1;
        document.title = `${product.name} | MORA Accesorios · Demo NODO`;
        const description = document.querySelector('meta[name="description"]');
        if (description) description.content = `${product.name}. Ficha demostrativa de MORA Accesorios, creada por NODO.`;
        const render = () => {
            target.innerHTML = `<section class="mora-product-page"><div class="mora-container"><a class="mora-back-link" href="${catalogRoute()}"><span aria-hidden="true">←</span> Volver al catálogo</a><div class="mora-product-layout"><figure class="mora-product-visual"><img src="${route(productImage(product, selectedVariant))}" alt="${escapeHTML(product.alt)}" width="1200" height="1200"></figure><div class="mora-product-info"><p class="mora-product-category">${escapeHTML(category?.label || "MORA")}</p><h1>${escapeHTML(product.name)}</h1><p class="mora-product-price">${formatPrice(product.price)}</p><p class="mora-product-description">${escapeHTML(product.description)}</p>${variants.length ? `<fieldset class="mora-variant-field"><legend>Color</legend><div>${variants.map(variant => `<button type="button" class="mora-variant" data-variant="${escapeHTML(variant)}" aria-pressed="${variant === selectedVariant}">${escapeHTML(variant)}</button>`).join("")}</div></fieldset>` : ""}<div class="mora-buy-actions"><div><span class="mora-input-label">Cantidad</span>${quantityControl(quantity)}</div><button class="mora-button mora-button-primary" type="button" data-product-add>Agregar al carrito <span aria-hidden="true">→</span></button></div><p class="mora-product-demo-note">Producto y precio de demostración. No hay stock ni pago real.</p></div></div></div></section>`;
            target.querySelectorAll("[data-variant]").forEach(button => button.addEventListener("click", () => {
                selectedVariant = button.dataset.variant;
                render();
            }));
            target.querySelectorAll("[data-quantity-change]").forEach(button => button.addEventListener("click", () => {
                quantity = Math.max(1, Math.min(9, quantity + Number(button.dataset.quantityChange)));
                render();
            }));
            target.querySelector("[data-product-add]")?.addEventListener("click", () => addToCart(product.id, selectedVariant, quantity));
        };
        render();
    }

    function cartLine(item) {
        const { details: product, variant, quantity } = item;
        return `<li class="mora-cart-line"><img src="${route(productImage(product, variant))}" alt="${escapeHTML(product.alt)}" width="160" height="160"><div class="mora-cart-line-copy"><p class="mora-product-category">${escapeHTML(categoryById(product.category)?.label || "MORA")}</p><h2>${escapeHTML(product.name)}</h2>${variant ? `<p class="mora-cart-variant">Color: ${escapeHTML(variant)}</p>` : ""}<strong>${formatPrice(product.price)}</strong><div class="mora-cart-line-actions">${quantityControl(quantity).replaceAll("data-quantity-change", `data-cart-quantity data-product-id="${product.id}" data-variant="${escapeHTML(variant)}" data-quantity-change`)}<button type="button" class="mora-remove-button" data-cart-remove data-product-id="${product.id}" data-variant="${escapeHTML(variant)}">Quitar</button></div></div><p class="mora-line-total">${formatPrice(product.price * quantity)}</p></li>`;
    }

    function cartMarkup(items, delivery) {
        if (!items.length) {
            return `<section class="mora-cart-page"><div class="mora-container mora-empty-cart"><p class="mora-kicker">CARRITO</p><h1>Tu carrito está esperando una elección.</h1><p>Cuando agregues una pieza, va a aparecer acá para que puedas revisarla con calma.</p><a class="mora-button mora-button-primary" href="${catalogRoute()}">Ver catálogo <span aria-hidden="true">→</span></a></div></section>`;
        }
        return `<section class="mora-cart-page"><div class="mora-container"><div class="mora-cart-heading"><div><p class="mora-kicker">CARRITO</p><h1>Revisá tu selección.</h1></div><button type="button" class="mora-text-button" data-cart-clear>Vaciar carrito</button></div><div class="mora-cart-layout"><div><ul class="mora-cart-list">${items.map(cartLine).join("")}</ul><a class="mora-back-link mora-continue-link" href="${catalogRoute()}"><span aria-hidden="true">←</span> Continuar comprando</a></div><aside class="mora-cart-summary"><p class="mora-kicker">PEDIDO DE PRUEBA</p><div class="mora-summary-row"><span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong></div><fieldset class="mora-delivery-field"><legend>¿Cómo preferís recibirlo?</legend><label><input type="radio" name="delivery" value="retiro"${delivery === "retiro" ? " checked" : ""}> Retiro</label><label><input type="radio" name="delivery" value="envio"${delivery === "envio" ? " checked" : ""}> Envío a coordinar</label></fieldset><button class="mora-button mora-button-primary" type="button" data-whatsapp-order>Preparar pedido por WhatsApp <span aria-hidden="true">→</span></button><p>Esta acción arma un mensaje de prueba. No solicita datos personales ni procesa pagos.</p></aside></div></div></section>`;
    }

    function whatsappMessage(delivery) {
        const lines = ["Hola, estoy viendo la demo MORA de NODO.", "", "Mi pedido de prueba sería:"];
        cartDetails().forEach(item => lines.push(`- ${item.quantity} × ${item.details.name}${item.variant ? ` (${item.variant})` : ""}: ${formatPrice(item.details.price * item.quantity)}`));
        lines.push("", `Subtotal demo: ${formatPrice(cartSubtotal())}`, `Modalidad: ${delivery === "envio" ? "Envío a coordinar" : "Retiro"}`, "", "Entiendo que MORA es una demostración sin compra real.");
        return lines.join("\n");
    }

    function initCart() {
        const target = document.querySelector("[data-cart-page]");
        if (!target) return;
        let delivery = "retiro";
        const render = () => {
            const items = cartDetails();
            target.innerHTML = cartMarkup(items, delivery);
            target.querySelectorAll("[data-cart-quantity]").forEach(button => button.addEventListener("click", () => {
                const current = getCart().find(item => item.product === button.dataset.productId && item.variant === button.dataset.variant);
                if (current) updateCartItem(current.product, current.variant, current.quantity + Number(button.dataset.quantityChange));
                render();
            }));
            target.querySelectorAll("[data-cart-remove]").forEach(button => button.addEventListener("click", () => {
                updateCartItem(button.dataset.productId, button.dataset.variant, 0);
                render();
            }));
            target.querySelector("[data-cart-clear]")?.addEventListener("click", () => {
                saveCart([]);
                announce("Carrito vaciado.");
                render();
            });
            target.querySelectorAll('input[name="delivery"]').forEach(input => input.addEventListener("change", () => { delivery = input.value; }));
            target.querySelector("[data-whatsapp-order]")?.addEventListener("click", () => {
                const phone = String(config.whatsapp || "").replace(/\D/g, "");
                if (!phone) return;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage(delivery))}`, "_blank", "noopener,noreferrer");
            });
        };
        render();
    }

    function initChrome() {
        const header = document.querySelector("[data-mora-header]");
        const footer = document.querySelector("[data-mora-footer]");
        if (header) header.innerHTML = headerMarkup();
        if (footer) footer.innerHTML = footerMarkup();
        updateCartBadge();
    }

    initChrome();
    if (page === "home") renderHome();
    if (page === "catalog") initCatalog();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
})();
