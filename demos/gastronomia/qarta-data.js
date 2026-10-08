/*
 * Configuración de comercios para QARTA.
 * El motor no depende de la marca, categorías ni productos de esta demo.
 */
(() => {
  const extra = (id, label, price) => ({ id, label, price });
  const variant = (id, label, priceDelta = 0) => ({ id, label, priceDelta });
  const product = (details) => ({ available: true, featured: false, tags: [], variants: [], extras: [], ...details });

  const sushiDemo = {
    slug: "sushi-demo",
    isDemo: true,
    brand: {
      name: "Nori Lenta",
      shortName: "NL",
      descriptor: "Sushi de estación",
      tagline: "Sushi hecho con tiempo, para comer sin apuro.",
      description: "Una selección de rolls, piezas y combinaciones pensada para compartir o disfrutar de a poco.",
    },
    meta: {
      title: "Nori Lenta · Demo gastronómica | NODO",
      description: "Una experiencia demostrativa de carta digital, pedidos y checkout por WhatsApp.",
      image: "assets/restaurants/sushi-demo/hero-sushi.jpg",
    },
    presentation: {
      skin: "sushi-editorial",
      heroLayout: "plate",
      cardLayout: "image-led",
      density: "airy",
      colors: {
        ink: "#202522",
        paper: "#f4f0e8",
        paperStrong: "#e8e2d5",
        accent: "#65735f",
        accentDeep: "#384837",
        warm: "#bf8b58",
        line: "#d4cdbd",
      },
    },
    contact: {
      whatsapp: "5491130700900",
      locationLabel: "Belgrano · Ciudad de Buenos Aires",
      pickupLabel: "Retiro por Belgrano",
      publicUrl: "https://nododigital.com.ar/demos/gastronomia/?r=sushi-demo",
      instagramUrl: "",
    },
    schedule: [
      { days: "Martes a jueves", hours: "18:30 a 23:00" },
      { days: "Viernes y sábado", hours: "18:30 a 23:30" },
      { days: "Domingo", hours: "18:30 a 22:30" },
    ],
    hero: {
      eyebrow: "CARTA DIGITAL · DEMO",
      title: "Piezas simples, sabores que se quedan.",
      copy: "Una carta clara para elegir con calma, armar tu pedido y continuarlo por WhatsApp.",
      image: "assets/restaurants/sushi-demo/hero-sushi.jpg",
      imageAlt: "Selección de sushi sobre una mesa clara",
      primaryCta: "Ver la carta",
      secondaryCta: "Cómo pedir",
    },
    copy: {
      heroCaption: "Selección de la semana",
      navigation: {
        menu: "Carta",
        promotions: "Para compartir",
        how: "Cómo pedir",
        local: "El local",
      },
      categories: {
        eyebrow: "PARA EMPEZAR",
        title: "Elegí por antojo, no por apuro.",
      },
      menu: {
        eyebrow: "LA CARTA",
        title: "Todo lo que querés pedir.",
        searchPlaceholder: "Buscar una pieza",
        emptySearch: "No encontramos piezas con esa búsqueda.",
        clearSearch: "Limpiar búsqueda",
        productCta: "Elegir",
      },
      how: {
        eyebrow: "SIN COMPLICARLO",
        title: "Tu pedido, en tres pasos.",
        steps: [
          { title: "Elegí lo que te gusta.", copy: "Filtrá, buscá y revisá cada pieza con calma." },
          { title: "Armá tu pedido.", copy: "Elegí variantes y extras antes de sumarlo." },
          { title: "Lo seguimos por WhatsApp.", copy: "Definís retiro o envío y recibís el resumen listo para consultar." },
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
        featured: "Elegido",
      },
      cart: {
        eyebrow: "TU PEDIDO",
        title: "Una mesa en camino.",
        clearCta: "Vaciar",
        subtotalLabel: "Subtotal",
        emptyTitle: "Todavía no elegiste nada.",
        emptyCopy: "La carta está lista para que armes un pedido a tu ritmo.",
        browseCta: "Ver la carta",
      },
    },
    categories: [
      { id: "combos", label: "Combos", description: "Para elegir y compartir." },
      { id: "rolls", label: "Rolls", description: "Clásicos de la casa." },
      { id: "nigiris", label: "Nigiris", description: "Piezas sin vueltas." },
      { id: "geishas", label: "Geishas", description: "Suaves y frescas." },
      { id: "entradas", label: "Entradas", description: "Para abrir el pedido." },
      { id: "veggie", label: "Veggie", description: "Opciones vegetales." },
      { id: "bebidas", label: "Bebidas", description: "Para acompañar." },
    ],
    promotions: [
      {
        id: "mitad-de-semana",
        active: true,
        startsAt: "2026-01-01",
        endsAt: "2027-01-01",
        eyebrow: "PARA COMPARTIR",
        title: "Dos combinaciones, una mesa más larga.",
        copy: "Pedí dos combos de 24 piezas y sumá una limonada de jengibre sin cargo.",
        note: "Promoción demostrativa. Aplicación a coordinar por WhatsApp.",
        image: "assets/restaurants/sushi-demo/products-combos.jpg",
        imageAlt: "Combinación de sushi servida para compartir",
      },
    ],
    qr: {
      asset: "",
      target: "https://nododigital.com.ar/demos/gastronomia/?r=sushi-demo",
      label: "Link de la carta",
    },
    products: [
      product({ id: "combo-casa", name: "Combo casa", description: "32 piezas para probar rolls frescos y piezas de salmón.", category: "combos", price: 38800, image: "assets/restaurants/sushi-demo/products-combos.jpg", imageAlt: "Combo de sushi variado", featured: true, tags: ["32 piezas", "Para compartir"], variants: [variant("clasico", "Selección clásica"), variant("sin-crudos", "Sin crudos", 1200)], extras: [extra("salsa-teriyaki", "Salsa teriyaki", 700), extra("wasabi", "Wasabi extra", 450)] }),
      product({ id: "combo-dos-orillas", name: "Dos orillas", description: "24 piezas de rolls, geishas y nigiris para una mesa de dos.", category: "combos", price: 30400, image: "assets/restaurants/sushi-demo/products-combos.jpg", imageAlt: "Tabla de sushi para dos personas", featured: true, tags: ["24 piezas", "Para dos"], variants: [variant("clasico", "Selección clásica"), variant("veggie-mixto", "Mitad veggie", 0)], extras: [extra("soja", "Salsa de soja extra", 450), extra("jengibre", "Jengibre extra", 450)] }),
      product({ id: "combo-lento", name: "Combo lento", description: "48 piezas variadas para quedarse un rato más.", category: "combos", price: 56400, image: "assets/restaurants/sushi-demo/products-combos.jpg", imageAlt: "Gran selección de sushi", tags: ["48 piezas", "Para compartir"], variants: [variant("clasico", "Selección clásica"), variant("sin-crudos", "Sin crudos", 1800)], extras: [extra("palitos", "Juego de palitos extra", 250), extra("salsa-teriyaki", "Salsa teriyaki", 700)] }),
      product({ id: "roll-philadelphia", name: "Philadelphia", description: "Salmón, queso crema y palta, envuelto en sésamo.", category: "rolls", price: 12400, image: "assets/restaurants/sushi-demo/products-rolls.jpg", imageAlt: "Roll de salmón y palta", featured: true, tags: ["8 piezas"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 5200)], extras: [extra("soja", "Salsa de soja extra", 450), extra("wasabi", "Wasabi extra", 450)] }),
      product({ id: "roll-acevichado", name: "Acevichado", description: "Langostino crocante, palta y una salsa cítrica suave.", category: "rolls", price: 13900, image: "assets/restaurants/sushi-demo/products-rolls.jpg", imageAlt: "Roll de sushi acevichado", featured: true, tags: ["8 piezas", "Crocante"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 5800)], extras: [extra("salsa-citrica", "Salsa cítrica extra", 650), extra("jengibre", "Jengibre extra", 450)] }),
      product({ id: "roll-spicy-salmon", name: "Spicy salmón", description: "Salmón, verdeo y toque de ají suave.", category: "rolls", price: 13200, image: "assets/restaurants/sushi-demo/products-rolls.jpg", imageAlt: "Roll de salmón con cobertura", tags: ["8 piezas"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 5500)], extras: [extra("spicy", "Salsa spicy extra", 650), extra("soja", "Salsa de soja extra", 450)] }),
      product({ id: "roll-langostino", name: "Langostino crocante", description: "Langostino tempura, pepino y palta.", category: "rolls", price: 13700, image: "assets/restaurants/sushi-demo/products-rolls.jpg", imageAlt: "Roll crocante de langostino", tags: ["8 piezas", "Tempura"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 5700)], extras: [extra("teriyaki", "Salsa teriyaki", 700), extra("salsa-citrica", "Salsa cítrica extra", 650)] }),
      product({ id: "nigiri-salmon", name: "Nigiri de salmón", description: "Salmón fresco sobre arroz tibio.", category: "nigiris", price: 7200, image: "assets/restaurants/sushi-demo/products-nigiris.jpg", imageAlt: "Nigiris de salmón", tags: ["4 piezas"], variants: [variant("4", "4 piezas"), variant("8", "8 piezas", 6800)], extras: [extra("wasabi", "Wasabi extra", 450), extra("jengibre", "Jengibre extra", 450)] }),
      product({ id: "nigiri-pesca-blanca", name: "Nigiri de pesca blanca", description: "Piezas suaves con un toque de lima.", category: "nigiris", price: 6900, image: "assets/restaurants/sushi-demo/products-nigiris.jpg", imageAlt: "Nigiris de pescado blanco", tags: ["4 piezas"], variants: [variant("4", "4 piezas"), variant("8", "8 piezas", 6500)], extras: [extra("ponzu", "Ponzu cítrico", 600), extra("wasabi", "Wasabi extra", 450)] }),
      product({ id: "nigiri-langostino", name: "Nigiri de langostino", description: "Langostino cocido, arroz y sésamo tostado.", category: "nigiris", price: 7400, image: "assets/restaurants/sushi-demo/products-nigiris.jpg", imageAlt: "Nigiris de langostino", tags: ["4 piezas"], variants: [variant("4", "4 piezas"), variant("8", "8 piezas", 7000)], extras: [extra("soja", "Salsa de soja extra", 450)] }),
      product({ id: "geisha-salmon", name: "Geisha de salmón", description: "Salmón, palta y queso crema, con un hilo de teriyaki.", category: "geishas", price: 10800, image: "assets/restaurants/sushi-demo/products-geishas.jpg", imageAlt: "Geishas de salmón", featured: true, tags: ["8 piezas"], variants: [variant("8", "8 piezas")], extras: [extra("teriyaki", "Salsa teriyaki", 700), extra("sesamo", "Sésamo tostado", 350)] }),
      product({ id: "geisha-mango", name: "Geisha de mango", description: "Mango, palta y pepino con una nota cítrica.", category: "geishas", price: 10100, image: "assets/restaurants/sushi-demo/products-geishas.jpg", imageAlt: "Geishas con mango", tags: ["8 piezas", "Vegetariano"], variants: [variant("8", "8 piezas")], extras: [extra("ponzu", "Ponzu cítrico", 600)] }),
      product({ id: "gyozas-verduras", name: "Gyozas de verduras", description: "Seis piezas doradas, servidas con salsa de la casa.", category: "entradas", price: 7900, image: "assets/restaurants/sushi-demo/products-gyozas.jpg", imageAlt: "Gyozas doradas", tags: ["6 piezas", "Vegetariano"], variants: [variant("6", "6 piezas"), variant("10", "10 piezas", 4400)], extras: [extra("salsa-gyoza", "Salsa de la casa", 600)] }),
      product({ id: "ebi-tempura", name: "Ebi tempura", description: "Langostinos crocantes con salsa cítrica.", category: "entradas", price: 8900, image: "assets/restaurants/sushi-demo/products-gyozas.jpg", imageAlt: "Langostinos tempura", tags: ["6 piezas"], variants: [variant("6", "6 piezas")], extras: [extra("salsa-citrica", "Salsa cítrica extra", 650)] }),
      product({ id: "edamame", name: "Edamame", description: "Vainas tibias con sal marina y limón.", category: "entradas", price: 5600, image: "assets/restaurants/sushi-demo/products-gyozas.jpg", imageAlt: "Edamame servido con limón", tags: ["Para compartir"], extras: [extra("picante", "Toque picante", 350)] }),
      product({ id: "veggie-verde", name: "Roll verde", description: "Palta, pepino, zanahoria y sésamo tostado.", category: "veggie", price: 9800, image: "assets/restaurants/sushi-demo/products-veggie.jpg", imageAlt: "Roll vegetariano con palta", tags: ["8 piezas", "Vegetariano"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 4100)], extras: [extra("ponzu", "Ponzu cítrico", 600), extra("sesamo", "Sésamo tostado", 350)] }),
      product({ id: "veggie-hongo", name: "Roll de hongo", description: "Hongos salteados, palta y verdeo fresco.", category: "veggie", price: 10300, image: "assets/restaurants/sushi-demo/products-veggie.jpg", imageAlt: "Roll vegetariano con hongos", tags: ["8 piezas", "Vegetariano"], variants: [variant("8", "8 piezas"), variant("12", "12 piezas", 4300)], extras: [extra("teriyaki", "Salsa teriyaki", 700)] }),
      product({ id: "veggie-inari", name: "Inari vegetal", description: "Tofu frito relleno de arroz, pepino y sésamo.", category: "veggie", price: 8200, image: "assets/restaurants/sushi-demo/products-veggie.jpg", imageAlt: "Inari vegetariano", tags: ["4 piezas", "Vegetariano"], variants: [variant("4", "4 piezas"), variant("8", "8 piezas", 7600)], extras: [extra("ponzu", "Ponzu cítrico", 600)] }),
      product({ id: "limonada-jengibre", name: "Limonada de jengibre", description: "Limonada suave, jengibre y menta.", category: "bebidas", price: 3900, image: "assets/restaurants/sushi-demo/products-bebidas.jpg", imageAlt: "Limonada con jengibre", tags: ["Sin alcohol"], variants: [variant("vaso", "Vaso 500 ml"), variant("jarra", "Jarra para compartir", 4100)] }),
      product({ id: "te-frio", name: "Té verde frío", description: "Té verde, cítricos y un toque de miel.", category: "bebidas", price: 3500, image: "assets/restaurants/sushi-demo/products-bebidas.jpg", imageAlt: "Té verde frío servido con hielo", tags: ["Sin alcohol"], variants: [variant("vaso", "Vaso 500 ml")] }),
      product({ id: "agua-sin-gas", name: "Agua sin gas", description: "Agua mineral fría.", category: "bebidas", price: 2600, image: "assets/restaurants/sushi-demo/products-bebidas.jpg", imageAlt: "Botella de agua", tags: ["500 ml"], variants: [variant("500", "500 ml"), variant("1500", "1,5 L", 1700)] }),
    ],
  };

  window.QARTA_CONFIG = {
    defaultRestaurantSlug: "sushi-demo",
    storagePrefix: "nodo_qarta_cart_v1",
  };
  window.QARTA_RESTAURANTS = {
    [sushiDemo.slug]: sushiDemo,
  };
})();
