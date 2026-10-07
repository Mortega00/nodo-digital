/* Fuente única de contenido para la demo MORA. */
window.MORA_CONFIG = {
    brand: "MORA Accesorios",
    storageKey: "nodo_mora_cart_v1",
    whatsapp: "5491130700900",
    currency: "ARS"
};

window.MORA_CATEGORIES = [
    { id: "bolsos", label: "Bolsos", description: "Para llevar lo que acompaña todos los días." },
    { id: "billeteras", label: "Billeteras", description: "Pequeños formatos para organizar lo esencial." },
    { id: "accesorios", label: "Accesorios", description: "Detalles simples para usar, regalar o guardar." },
    { id: "objetos", label: "Objetos / regalos", description: "Piezas elegidas para hacer lugar a lo cotidiano." }
];

window.MORA_PRODUCTS = [
    {
        id: "mora-001", slug: "tote-alma", category: "bolsos", name: "Tote Alma", price: 48000, featured: true,
        image: "assets/mora-001-tote-alma.jpg", alt: "Tote de lona de MORA sobre fondo marfil.",
        shortDescription: "Un bolso amplio y suave para acompañar el ritmo de todos los días.",
        description: "Tote de lona estructurada con asas cortas y espacio cómodo para llevar lo esencial, una libreta o una compra pequeña.",
        variants: ["Bordó", "Arena"],
        variantImages: {
            "Bordó": "assets/mora-001-tote-alma.jpg",
            "Arena": "assets/mora-001-tote-alma-arena.jpg"
        }
    },
    {
        id: "mora-002", slug: "bandolera-nora", category: "bolsos", name: "Bandolera Nora", price: 62500, featured: true,
        image: "assets/mora-002-bandolera-nora.jpg", alt: "Bandolera compacta color carbón sobre fondo marfil.",
        shortDescription: "Formato compacto, correa regulable y lugar para lo importante.",
        description: "Bandolera de silueta redondeada con correa regulable. Una opción simple para llevar cerca lo que necesitás durante el día.",
        variants: ["Carbón", "Bordó"]
    },
    {
        id: "mora-003", slug: "bolso-vera", category: "bolsos", name: "Bolso Vera", price: 71500, featured: false,
        image: "assets/mora-003-bolso-vera.jpg", alt: "Bolso de hombro verde oliva sobre fondo marfil.",
        shortDescription: "Una pieza de hombro de líneas blandas y uso diario.",
        description: "Bolso de hombro con asa curva y proporción amplia. Pensado para una salida, un día de trabajo o un plan que se estira.",
        variants: ["Oliva", "Hueso"]
    },
    {
        id: "mora-004", slug: "billetera-clara", category: "billeteras", name: "Billetera Clara", price: 36500, featured: true,
        image: "assets/mora-004-billetera-clara.jpg", alt: "Billetera de cuero de MORA sobre fondo marfil.",
        shortDescription: "Una billetera compacta para ordenar tarjetas y efectivo.",
        description: "Billetera plegable de formato simple, con espacio para tarjetas y billetes. Hecha para usar sin ocupar de más.",
        variants: ["Bordó", "Arena"],
        variantImages: {
            "Bordó": "assets/mora-004-billetera-clara.jpg",
            "Arena": "assets/mora-004-billetera-clara-arena.jpg"
        }
    },
    {
        id: "mora-005", slug: "tarjetero-mini", category: "billeteras", name: "Tarjetero Mini", price: 19800, featured: false,
        image: "assets/mora-005-tarjetero-mini.jpg", alt: "Tarjetero de cuero coral sobre fondo marfil.",
        shortDescription: "Un formato chico para llevar sólo lo necesario.",
        description: "Tarjetero liviano con ranuras visibles y una construcción simple. Ideal para usar solo o dentro de otro bolso.",
        variants: ["Coral", "Arena"]
    },
    {
        id: "mora-006", slug: "panuelo-lazo", category: "accesorios", name: "Pañuelo Lazo", price: 22500, featured: true,
        image: "assets/mora-006-panuelo-lazo.jpg", alt: "Pañuelo estampado coral y arena sobre fondo marfil.",
        shortDescription: "Un detalle suave para el cuello, el pelo o una cartera.",
        description: "Pañuelo de tacto suave con una trama geométrica discreta. Puede acompañar distintos usos y sumar color sin exceso.",
        variants: ["Coral", "Azul tinta"]
    },
    {
        id: "mora-007", slug: "neceser-nido", category: "accesorios", name: "Necesér Nido", price: 27800, featured: false,
        image: "assets/mora-007-neceser-nido.jpg", alt: "Necesér de lona oliva sobre fondo marfil.",
        shortDescription: "Para guardar lo que preferís tener a mano.",
        description: "Necesér cilíndrico de lona con cierre superior. Una forma ordenada de reunir objetos chicos en un solo lugar.",
        variants: ["Oliva", "Bordó"]
    },
    {
        id: "mora-008", slug: "llavero-trama", category: "accesorios", name: "Llavero Trama", price: 12400, featured: false,
        image: "assets/mora-008-llavero-trama.jpg", alt: "Llavero trenzado bordó y arena sobre fondo marfil.",
        shortDescription: "Un gesto pequeño para encontrar las llaves más fácil.",
        description: "Llavero trenzado con aro metálico y tira suave. Un accesorio mínimo pensado para el uso cotidiano.",
        variants: ["Bordó", "Arena"]
    },
    {
        id: "mora-009", slug: "vela-tarde", category: "objetos", name: "Vela Tarde", price: 18400, featured: true,
        image: "assets/mora-009-vela-tarde.jpg", alt: "Vela en contenedor de cerámica terracota sobre fondo marfil.",
        shortDescription: "Una pieza simple para una pausa en casa.",
        description: "Vela de cera vegetal en un contenedor de cerámica reutilizable. Una presencia cálida para mesas, estantes o momentos tranquilos.",
        variants: ["Terracota", "Crudo"]
    },
    {
        id: "mora-010", slug: "postales-casa", category: "objetos", name: "Postales Casa", price: 14600, featured: false,
        image: "assets/mora-010-postales-casa.jpg", alt: "Set de postales abstractas en coral, oliva y bordó sobre fondo marfil.",
        shortDescription: "Seis postales para regalar, enmarcar o dejar cerca.",
        description: "Set de seis postales con formas abstractas y tonos suaves. Una pieza pequeña para sumar color a un rincón o acompañar un regalo.",
        variants: []
    }
];
