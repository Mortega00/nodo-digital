const NODO_DEMOS = [
    {
        id: "raices-urbanas",
        name: "RAÍCES URBANAS",
        type: "DEMO · INMOBILIARIAS",
        description: "Una experiencia inmobiliaria pensada para presentar propiedades, facilitar la búsqueda y ordenar las consultas.",
        href: "/demos/raices-urbanas/",
        cta: "Ver demo",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=86",
        alt: "Fachada residencial utilizada como preview de la demo Raíces Urbanas",
        imagePosition: "center 54%"
    },
    {
        id: "movia",
        name: "MOVIA",
        type: "DEMO · ORTOPEDIA",
        description: "Una propuesta digital para ordenar productos, necesidades frecuentes y contacto en una ortopedia.",
        href: "/demos/ortopedia/",
        cta: "Ver demo",
        image: "/assets/projects/movia-hero.png",
        alt: "Hero de la demo MOVIA con una propuesta digital para ortopedia",
        imagePosition: "center 24%"
    }
];

let activeDemo = 0;

function escapeDemoHTML(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function demoLinkAttributes(demo) {
    return demo.external ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function demoArrow(demo) {
    return demo.external ? '<span class="visually-hidden"> (abre en una nueva pestaña)</span><span aria-hidden="true">↗</span>' : '<span aria-hidden="true">→</span>';
}

function renderActiveDemo(target) {
    const demo = NODO_DEMOS[activeDemo];
    target.innerHTML = `<article class="demos-active-panel" id="active-demo-panel" aria-live="polite">
        <div class="demos-active-copy"><p class="demos-active-type">${escapeDemoHTML(demo.type)}</p><h3>${escapeDemoHTML(demo.name)}</h3><p>${escapeDemoHTML(demo.description)}</p></div>
        <a class="demos-active-visual" href="${escapeDemoHTML(demo.href)}"${demoLinkAttributes(demo)} aria-label="${escapeDemoHTML(demo.cta)}: ${escapeDemoHTML(demo.name)}"><img src="${escapeDemoHTML(demo.image)}" alt="${escapeDemoHTML(demo.alt)}" width="1600" height="900" style="object-position: ${escapeDemoHTML(demo.imagePosition)}" decoding="async"></a>
        <a class="text-link demos-active-link" href="${escapeDemoHTML(demo.href)}"${demoLinkAttributes(demo)}>${escapeDemoHTML(demo.cta)} ${demoArrow(demo)}</a>
    </article>`;
}

function renderDemosHub() {
    const target = document.getElementById("demos-list");
    if (!target) return;

    target.innerHTML = `<div class="demos-selector" role="group" aria-label="Elegir una experiencia">${NODO_DEMOS.map((demo, index) => `<button class="demos-selector-option${index === activeDemo ? " is-active" : ""}" type="button" data-demo-index="${index}" aria-pressed="${index === activeDemo}"><span class="demos-selector-name">${escapeDemoHTML(demo.name)} <i aria-hidden="true">${demo.external ? "↗" : "→"}</i></span><span class="demos-selector-type">${escapeDemoHTML(demo.type)}</span></button>`).join("")}</div><div class="demos-active" data-active-demo></div>`;
    const activeTarget = target.querySelector("[data-active-demo]");
    renderActiveDemo(activeTarget);

    target.querySelectorAll("[data-demo-index]").forEach(button => {
        button.addEventListener("click", () => {
            activeDemo = Number(button.dataset.demoIndex);
            renderDemosHub();
        });
        button.addEventListener("keydown", event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
            activeDemo = event.key === 'Home' ? 0 : event.key === 'End' ? NODO_DEMOS.length - 1 : (activeDemo + direction + NODO_DEMOS.length) % NODO_DEMOS.length;
            renderDemosHub();
            target.querySelector(`[data-demo-index="${activeDemo}"]`)?.focus();
        });
    });
}

function renderHomeDemos() {
    const target = document.getElementById("home-demos-list");
    if (!target) return;
    target.innerHTML = NODO_DEMOS.map(demo => `<a class="demo-home-link" href="${escapeDemoHTML(demo.href)}"${demoLinkAttributes(demo)}><span class="demo-home-preview"><img src="${escapeDemoHTML(demo.image)}" alt="" width="640" height="360" loading="lazy" decoding="async" style="object-position: ${escapeDemoHTML(demo.imagePosition)}"></span><span class="demo-home-type">${escapeDemoHTML(demo.type)}</span><strong>${escapeDemoHTML(demo.name)}</strong><em>${escapeDemoHTML(demo.cta)} ${demoArrow(demo)}</em></a>`).join("");
}

renderDemosHub();
renderHomeDemos();
