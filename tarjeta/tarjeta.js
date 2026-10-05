(() => {
    const themeStorageKey = "nodo_web_theme";
    const card = document.getElementById("tarjeta-card");
    const toggle = document.getElementById("theme-toggle");
    const instruction = document.getElementById("tarjeta-instruction");
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let introductionTimer = null;

    const preferredTheme = () => {
        try {
            const savedTheme = window.localStorage.getItem(themeStorageKey);
            if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
        } catch {
            // El tema claro definido en el documento sigue siendo el fallback seguro.
        }

        return "light";
    };

    const applyTheme = (theme, persist = false) => {
        const nextTheme = theme === "light" ? "light" : "dark";
        const isLight = nextTheme === "light";
        document.documentElement.dataset.theme = nextTheme;
        toggle?.setAttribute("aria-pressed", String(isLight));
        toggle?.setAttribute("aria-label", isLight ? "Activar modo oscuro" : "Activar modo claro");
        if (toggle) {
            toggle.title = isLight ? "Activar modo oscuro" : "Activar modo claro";
            toggle.querySelector(".theme-toggle-icon").textContent = isLight ? "☾" : "☀";
        }

        if (!persist) return;
        try {
            window.localStorage.setItem(themeStorageKey, nextTheme);
        } catch {
            // La interacción conserva el tema actual aunque no se pueda guardar.
        }
    };

    applyTheme(preferredTheme());

    toggle?.addEventListener("click", () => {
        applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
    });

    window.addEventListener("storage", event => {
        if (event.key === themeStorageKey && (event.newValue === "light" || event.newValue === "dark")) applyTheme(event.newValue);
    });

    if (!card) return;

    const syncCardLabel = () => {
        const isFlipped = card.classList.contains("is-flipped");
        card.setAttribute("aria-pressed", String(isFlipped));
        card.setAttribute("aria-label", isFlipped ? "Ver frente de la tarjeta de NODO" : "Ver dorso de la tarjeta de NODO");
        if (instruction) instruction.textContent = isFlipped ? "Tocá la tarjeta para volver al frente." : "Tocá la tarjeta para verla de ambos lados.";
    };

    const finishIntroduction = () => {
        card.classList.remove("is-introducing");
        if (introductionTimer) window.clearTimeout(introductionTimer);
        introductionTimer = null;
    };

    const flipCard = () => {
        finishIntroduction();
        card.classList.toggle("is-flipped");
        card.style.setProperty("--tarjeta-tilt-x", "0deg");
        card.style.setProperty("--tarjeta-tilt-y", "0deg");
        syncCardLabel();
    };

    card.addEventListener("click", flipCard);

    if (!reducedMotion && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
        card.addEventListener("pointermove", event => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            card.style.setProperty("--tarjeta-tilt-x", `${(-y * 3).toFixed(2)}deg`);
            card.style.setProperty("--tarjeta-tilt-y", `${(x * 4).toFixed(2)}deg`);
        });
        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tarjeta-tilt-x", "0deg");
            card.style.setProperty("--tarjeta-tilt-y", "0deg");
        });
    }

    if (!reducedMotion) {
        card.classList.add("is-introducing");
        introductionTimer = window.setTimeout(finishIntroduction, 1150);
    }
})();
