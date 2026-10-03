/*
 * Fuente única de contenido demo.
 * Al conectar un CRM/API, reemplazar este archivo por el adaptador de datos
 * correspondiente sin cambiar los componentes de la interfaz.
 */
window.RAICES_CONFIG = {
  whatsapp: "5491100000000",
  whatsappLabel: "11 0000-0000",
  imageNotice: "Fotografías temporales de referencia"
};

const tempImage = (id, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

/* Imágenes temporales centralizadas: reemplazar exclusivamente estas URLs al contar con material definitivo. */
window.RAICES_IMAGES = {
  hero: tempImage("photo-1600585154363-67eb9e2e2099", 1800),
  palermo: [
    tempImage("photo-1600210492486-724fe5c67fb0"),
    tempImage("photo-1600566753086-00f18fb6b3ea"),
    tempImage("photo-1600585154526-990dced4db0d"),
    tempImage("photo-1600607688969-a5bfcd646154"),
    tempImage("photo-1600047509807-ba8f99d2cdde")
  ],
  belgrano: [
    tempImage("photo-1600607687939-ce8a6c25118c"),
    tempImage("photo-1600566753190-17f0baa2a6c3"),
    tempImage("photo-1600585154340-be6161a56a0c"),
    tempImage("photo-1600607687920-4e2a09cf159d"),
    tempImage("photo-1600607688969-a5bfcd646154")
  ],
  caballito: [
    tempImage("photo-1600566752355-35792bedcfea"),
    tempImage("photo-1600585154363-67eb9e2e2099"),
    tempImage("photo-1600210491892-03d54c0aaf87"),
    tempImage("photo-1600566753190-17f0baa2a6c3"),
    tempImage("photo-1600607688960-e095ff83135c")
  ],
  villaUrquiza: [
    tempImage("photo-1600585154340-be6161a56a0c"),
    tempImage("photo-1600607687920-4e2a09cf159d"),
    tempImage("photo-1600210491892-03d54c0aaf87"),
    tempImage("photo-1600607688969-a5bfcd646154"),
    tempImage("photo-1600585154526-990dced4db0d")
  ],
  adrogue: [
    tempImage("photo-1600585154363-67eb9e2e2099"),
    tempImage("photo-1600607687939-ce8a6c25118c"),
    tempImage("photo-1600566753086-00f18fb6b3ea"),
    tempImage("photo-1600210492486-724fe5c67fb0"),
    tempImage("photo-1600607688960-e095ff83135c")
  ],
  lomas: [
    tempImage("photo-1600607687920-4e2a09cf159d"),
    tempImage("photo-1600566752355-35792bedcfea"),
    tempImage("photo-1600210491892-03d54c0aaf87"),
    tempImage("photo-1600607688969-a5bfcd646154"),
    tempImage("photo-1600047509807-ba8f99d2cdde")
  ],
  banfield: [
    tempImage("photo-1600607688960-e095ff83135c"),
    tempImage("photo-1600210492486-724fe5c67fb0"),
    tempImage("photo-1600566753086-00f18fb6b3ea"),
    tempImage("photo-1600585154363-67eb9e2e2099"),
    tempImage("photo-1600047509807-ba8f99d2cdde")
  ],
  canning: [
    tempImage("photo-1600607687939-ce8a6c25118c"),
    tempImage("photo-1600607688960-e095ff83135c"),
    tempImage("photo-1600585154340-be6161a56a0c"),
    tempImage("photo-1600566753190-17f0baa2a6c3"),
    tempImage("photo-1600047509807-ba8f99d2cdde")
  ],
  zones: {
    caba: tempImage("photo-1519501025264-65ba15a82390"),
    adrogue: tempImage("photo-1600585154363-67eb9e2e2099"),
    lomas: tempImage("photo-1600607687920-4e2a09cf159d"),
    banfield: tempImage("photo-1600607688960-e095ff83135c"),
    canning: tempImage("photo-1600607687939-ce8a6c25118c")
  }
};

window.RAICES_PROPERTIES = [
  {
    id: "RU-001", operation: "venta", propertyType: "departamento", neighborhood: "Palermo", region: "CABA",
    price: 148000, currency: "USD", expenses: "USD 110 aprox. / equivalente referencial", rooms: 2, bedrooms: 1, bathrooms: 1,
    parking: false, coveredArea: 47, totalArea: 54, featured: true, imageSet: "palermo",
    title: "Departamento luminoso con balcón en Palermo",
    description: "Departamento de 2 ambientes con excelente entrada de luz natural y una distribución simple y funcional. El living-comedor se conecta con un balcón cómodo que amplía el espacio social y aporta una relación directa con el exterior. Cuenta con cocina integrada, dormitorio independiente con buen espacio de guardado y baño completo. Una opción pensada para quienes buscan vivir en CABA con fácil acceso a servicios, gastronomía y propuestas urbanas.",
    amenities: ["Balcón", "Cocina integrada", "Excelente luz natural", "Aire acondicionado", "Placard", "Baño completo", "Apto profesional", "Edificio moderno"]
  },
  {
    id: "RU-002", operation: "venta", propertyType: "departamento", neighborhood: "Belgrano", region: "CABA",
    price: 245000, currency: "USD", expenses: "USD 190 aprox. / equivalente referencial", rooms: 3, bedrooms: 2, bathrooms: 2,
    parking: true, coveredArea: 78, totalArea: 89, featured: true, imageSet: "belgrano",
    title: "Tres ambientes con balcón y cochera en Belgrano",
    description: "Departamento contemporáneo de tres ambientes con espacios amplios, buena iluminación y terminaciones sobrias. El área social integra living y comedor con salida a un balcón de buenas dimensiones. Dispone de dormitorio principal, segundo dormitorio o escritorio, dos baños y cocina equipada. La cochera completa una propuesta cómoda para quienes buscan una propiedad moderna en uno de los sectores residenciales más consolidados de CABA.",
    amenities: ["Balcón amplio", "Cochera", "2 dormitorios", "2 baños", "Cocina equipada", "Grandes ventanales", "Placares", "Calefacción", "Edificio contemporáneo"]
  },
  {
    id: "RU-003", operation: "alquiler", propertyType: "departamento", neighborhood: "Caballito", region: "CABA",
    price: 1150000, currency: "ARS", expenses: "ARS 185.000 aprox.", rooms: 3, bedrooms: 2, bathrooms: 1,
    parking: false, coveredArea: 66, totalArea: 72, featured: false, imageSet: "caballito",
    title: "Tres ambientes funcionales y luminosos en Caballito",
    description: "Departamento de tres ambientes con una distribución cómoda para uso residencial. Cuenta con living-comedor, cocina independiente, dos dormitorios, baño completo y balcón. Los ambientes mantienen buena iluminación natural y una estética neutra que permite adaptar fácilmente el espacio. Una alternativa práctica para quienes buscan vivir en una zona conectada de la ciudad.",
    amenities: ["Balcón", "2 dormitorios", "Cocina independiente", "Baño completo", "Buena iluminación", "Placares", "Living-comedor amplio", "Excelente conectividad"]
  },
  {
    id: "RU-004", operation: "venta", propertyType: "ph", neighborhood: "Villa Urquiza", region: "CABA",
    price: 192000, currency: "USD", expenses: "Sin expensas", rooms: 3, bedrooms: 2, bathrooms: 2,
    parking: false, coveredArea: 76, totalArea: 103, featured: true, imageSet: "villaUrquiza",
    title: "PH reciclado con patio y terraza en Villa Urquiza",
    description: "PH de tres ambientes renovado con una combinación de espacios interiores luminosos y sectores exteriores de uso propio. El living se integra con una cocina moderna y conecta con un patio privado. Cuenta con dos dormitorios, dos baños y una terraza que amplía considerablemente las posibilidades de uso. Ideal para quienes buscan independencia y espacios exteriores sin alejarse de CABA.",
    amenities: ["Sin expensas", "Patio", "Terraza", "Cocina integrada", "2 dormitorios", "2 baños", "Reciclado", "Buena luz natural", "Espacios exteriores privados"]
  },
  {
    id: "RU-005", operation: "venta", propertyType: "casa", neighborhood: "Adrogué", region: "Zona Sur",
    price: 285000, currency: "USD", expenses: "Sin expensas", rooms: 4, bedrooms: 3, bathrooms: 2,
    parking: true, coveredArea: 168, totalArea: 410, featured: true, imageSet: "adrogue",
    title: "Casa luminosa con jardín en Adrogué",
    description: "Casa familiar de cuatro ambientes desarrollada sobre un lote amplio, con una fuerte relación entre los espacios interiores y el jardín. La planta principal cuenta con living-comedor, cocina funcional y salida directa al exterior. Dispone de tres dormitorios, dos baños y cochera. El jardín ofrece espacio suficiente para reuniones, descanso y futuras mejoras. Una propuesta residencial pensada para quienes priorizan tranquilidad, verde y buena conexión con el centro de Adrogué.",
    amenities: ["Jardín", "Cochera", "3 dormitorios", "2 baños", "Living-comedor", "Cocina amplia", "Parrilla", "Lavadero", "Excelente luz natural", "Lote propio"]
  },
  {
    id: "RU-006", operation: "alquiler", propertyType: "departamento", neighborhood: "Lomas de Zamora", region: "Zona Sur",
    price: 790000, currency: "ARS", expenses: "ARS 135.000 aprox.", rooms: 2, bedrooms: 1, bathrooms: 1,
    parking: true, coveredArea: 49, totalArea: 56, featured: false, imageSet: "lomas",
    title: "Dos ambientes moderno con cochera en Lomas",
    description: "Departamento de dos ambientes con estética contemporánea, ambientes bien aprovechados y buena iluminación. Cuenta con living-comedor con salida al balcón, cocina integrada, dormitorio independiente y baño completo. Incluye cochera. Una opción práctica para quienes buscan cercanía con el centro de Lomas de Zamora y una vivienda moderna de fácil mantenimiento.",
    amenities: ["Balcón", "Cochera", "Cocina integrada", "Dormitorio con placard", "Baño completo", "Aire acondicionado", "Excelente ubicación", "Edificio moderno"]
  },
  {
    id: "RU-007", operation: "venta", propertyType: "ph", neighborhood: "Banfield", region: "Zona Sur",
    price: 135000, currency: "USD", expenses: "Sin expensas", rooms: 3, bedrooms: 2, bathrooms: 1,
    parking: false, coveredArea: 72, totalArea: 101, featured: false, imageSet: "banfield",
    title: "PH con patio propio en Banfield",
    description: "PH de tres ambientes con distribución funcional y patio de uso exclusivo. El living-comedor mantiene una conexión directa con el exterior, generando un espacio cómodo para el uso cotidiano. Cuenta con cocina independiente, dos dormitorios y baño completo. Una propiedad simple y versátil para quienes buscan mayor independencia y espacios exteriores dentro de una zona residencial de Banfield.",
    amenities: ["Sin expensas", "Patio propio", "2 dormitorios", "Cocina independiente", "Baño completo", "Lavadero", "Parrilla", "Entrada independiente"]
  },
  {
    id: "RU-008", operation: "venta", propertyType: "casa", neighborhood: "Canning", region: "Zona Sur",
    price: 365000, currency: "USD", expenses: "Sin expensas", rooms: 5, bedrooms: 4, bathrooms: 3,
    parking: true, parkingLabel: "Cochera para 2 autos", coveredArea: 228, totalArea: 690, featured: true, imageSet: "canning",
    title: "Casa contemporánea con jardín y pileta en Canning",
    description: "Casa de cinco ambientes diseñada para combinar amplitud interior, iluminación natural y vida exterior. El sector social integra living, comedor y cocina con grandes aberturas hacia el jardín. Cuenta con cuatro dormitorios, tres baños y espacios flexibles para home office o habitación de huéspedes. En el exterior se desarrolla un jardín amplio con galería, parrilla y pileta. Una propiedad pensada para quienes buscan más espacio, privacidad y una dinámica residencial vinculada al verde.",
    amenities: ["Pileta", "Jardín amplio", "Galería", "Parrilla", "4 dormitorios", "3 baños", "Cochera para 2 autos", "Cocina integrada", "Grandes ventanales", "Lavadero", "Espacio para home office"]
  }
];
