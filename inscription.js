let password = document.getElementById("password");
let form = document.querySelector("form");
let submit = document.getElementById("submit");

// ffklA#1lundiVchatgpt5💶599
//submit.disabled = "true";

password.addEventListener("keyup", function() {
    validatePassword(this.value);
});


function moving() {
    const container = document.querySelector(".form");
    const containerRect = container.getBoundingClientRect();

    const btnWidth = submit.offsetWidth;
    const btnHeight = submit.offsetHeight;

    const others = Array.from(container.querySelectorAll("input, label")).filter(el => el !== submit);

    let newX, newY;
    let safe = false;

    while (!safe) {
        newX = Math.random() * (container.clientWidth - btnWidth);
        newY = Math.random() * (container.clientHeight - btnHeight);

        safe = true;
        for (let el of others) {
            const rect = el.getBoundingClientRect();

            const elX = rect.left - containerRect.left;
            const elY = rect.top - containerRect.top;
            const elW = rect.width;
            const elH = rect.height;

            const overlap = !(newX + btnWidth < elX || newX > elX + elW || newY + btnHeight < elY || newY > elY + elH);
            if (overlap) {
                safe = false;
                break;
            }
        }
    }
    submit.style.position = "absolute";
    submit.style.left = `${newX}px`;
    submit.style.top = `${newY}px`;
}

submit.addEventListener("mouseenter", moving);

function validatePassword(value) {

    const rules = {
        minLength: value.length >= 4,
        hasUppercase: /[A-Z]/.test(value),
        hasSpecialChar: /[^a-zA-Z0-9]/.test(value),
        hasDigit: /\d/.test(value),
        hasWeekday: /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i.test(value),
        hasRoman: containsRomanSymbol(value),
        hasAI: /(ChatGPT|Gemini|Claude|Llama|Copilot|LeChat)/i.test(value),
        divisibleBy5: /\d/.test(value) && [...value.matchAll(/\d+/g)].some(n => Number(n[0]) % 5 === 0),
        emojiEuro: value.includes("💶"),
        product2025: checkProduct2025(value)
    };

    displayRules(rules);
}

function containsRomanSymbol(str) {
    const symbols = "IVXLCDM"; // les lettres de chiffres romains
    for (let i = 0; i < str.length; i++) {
        if (symbols.includes(str[i])) {
            return true; // on a trouvé au moins un symbole
        }
    }
    return false; // aucun symbole trouvé
}

// Produit des chiffres = 2025
function checkProduct2025(value) {
    const digits = value.match(/\d/g);
    if (!digits) return false;

    let product = digits.reduce((acc, n) => acc * Number(n), 1);
    return product === 2025;
}

function displayRules(rules) {

    let success = false;
    let container = document.getElementById("rules");

    if (!container) {
        container = document.createElement("div");
        container.id = "rules";
        container.className = "rules";
        form.appendChild(container);
    }

    const ruleList = [
        { key: "minLength",       text: "Minimum 4 caractères" },
        { key: "hasUppercase",    text: "Contient une majuscule" },
        { key: "hasSpecialChar",  text: "Contient un caractère spécial" },
        { key: "hasDigit",        text: "Contient un chiffre" },
        { key: "hasWeekday",      text: "Contient un jour de la semaine" },
        { key: "hasRoman",        text: "Contient un chiffre romain" },
        { key: "hasAI",           text: "Contient le nom d'une IA connue" },
        { key: "divisibleBy5",    text: "Contient un chiffre divisible par 5" },
        { key: "emojiEuro",       text: "Contient l'émoji 💶" },
        { key: "product2025",     text: "Produit des chiffres = 2025" },
    ];


    let visibleRules = [];
    let allowNext = true;

    for (let rule of ruleList) {
        if (!allowNext) break;

        const ok = rules[rule.key];

        visibleRules.push({
            text: rule.text,
            ok: ok
        });

        if (!ok) allowNext = false;
    }

    visibleRules.reverse();

    container.innerHTML = visibleRules
        .map(r => `<p style="color:${r.ok ? "lightgreen" : "lightsalmon"}">${r.text}</p>`)
        .join("");

    const allValid = Object.values(rules).every(v => v === true);

    if (allValid) {
        submit.removeEventListener("mouseenter", moving);
    } else {
        submit.addEventListener("mouseenter", moving);
    }
}

