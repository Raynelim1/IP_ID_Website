export const ANIMATION_PATHS = {
    login: "https://assets2.lottiefiles.com/packages/lf20_j1adxtyb.json",
    leaderboard: "https://assets9.lottiefiles.com/packages/lf20_usmfx6bp.json",
    lightMode: "https://assets4.lottiefiles.com/packages/lf20_kdx6cani.json",
    darkMode: "https://assets10.lottiefiles.com/packages/lf20_n4yafac5.json"
};

const animationInstances = new Map();

function safeDestroy(id) {
    const instance = animationInstances.get(id);
    if (instance) {
        instance.destroy();
        animationInstances.delete(id);
    }
}

function mountLottie(container, path, loop = true) {
    if (!window.lottie || !container) return false;

    const instance = window.lottie.loadAnimation({
        container,
        renderer: "svg",
        loop,
        autoplay: true,
        path
    });

    return instance;
}

export function showLottieLoader({
    id = "lottie-loader-overlay",
    message = "Loading...",
    animationPath = ANIMATION_PATHS.login
} = {}) {
    let overlay = document.getElementById(id);

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = id;
        overlay.className = "lottie-overlay";
        overlay.innerHTML = `
            <div class="lottie-loader-card">
                <div class="lottie-loader-animation" id="${id}-anim"></div>
                <p class="lottie-loader-text"></p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const textEl = overlay.querySelector(".lottie-loader-text");
    const animationEl = overlay.querySelector(`#${id}-anim`);
    if (textEl) textEl.textContent = message;

    safeDestroy(id);
    const instance = mountLottie(animationEl, animationPath, true);

    if (instance) {
        animationInstances.set(id, instance);
        overlay.classList.remove("lottie-fallback");
    } else {
        overlay.classList.add("lottie-fallback");
    }
}

export function hideLottieLoader(id = "lottie-loader-overlay") {
    safeDestroy(id);
    const overlay = document.getElementById(id);
    if (overlay) {
        overlay.remove();
    }
}

export function showThemeToggleLottie({
    mode = "light",
    animationPath
} = {}) {
    const id = "theme-lottie-flash";
    let flash = document.getElementById(id);

    if (!flash) {
        flash = document.createElement("div");
        flash.id = id;
        flash.className = "lottie-theme-flash";
        flash.innerHTML = `
            <div class="lottie-theme-animation" id="${id}-anim"></div>
            <span class="lottie-theme-label"></span>
        `;
        document.body.appendChild(flash);
    }

    const chosenPath =
        animationPath || (mode === "dark" ? ANIMATION_PATHS.darkMode : ANIMATION_PATHS.lightMode);

    const label = flash.querySelector(".lottie-theme-label");
    if (label) {
        label.textContent = mode === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled";
    }

    safeDestroy(id);
    const instance = mountLottie(flash.querySelector(`#${id}-anim`), chosenPath, false);
    if (instance) {
        animationInstances.set(id, instance);
        flash.classList.remove("lottie-fallback");
    } else {
        flash.classList.add("lottie-fallback");
    }

    flash.classList.add("show");
    setTimeout(() => {
        flash.classList.remove("show");
        safeDestroy(id);
    }, 1100);
}
