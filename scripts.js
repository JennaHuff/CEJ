const activities = {
    conduite: 0,
    benevolat: 0,
    loisir: 0,
    sport: 0,
    "recherche d'emploi": 0,
};

const getHoursRemaining = () =>
    20 - Object.values(activities).reduce((a, b) => a + b, 0);

const hoursRemainingEl = document.getElementById("hours-remaining");

const renderHoursRemaining = () =>
    (hoursRemainingEl.innerText = `${getHoursRemaining()} heures de plus à justifier`);

const activitiesUl = document.getElementById("activitiesUl");

function renderActivitiesUl() {
    activitiesUl.innerHTML = null;
    for (const [key, _] of Object.entries(activities)) {
        const child = document.createElement("li");
        const txt = document.createElement("span");
        txt.innerText = `${key}: ${activities[key]}`;

        const buttonPrev = document.createElement("button");
        buttonPrev.onclick = () => {
            if (activities[key] > 0) activities[key]--;
            txt.innerText = `${key}: ${activities[key]}`;
            renderHoursRemaining();
        };
        buttonPrev.innerHTML = "-";

        const buttonNext = document.createElement("button");
        buttonNext.onclick = () => {
            if (getHoursRemaining() > 0) activities[key]++;
            txt.innerText = `${key}: ${activities[key]}`;
            renderHoursRemaining();
        };
        buttonNext.innerHTML = "+";

        child.appendChild(buttonPrev);
        child.appendChild(buttonNext);
        child.appendChild(txt);

        activitiesUl.appendChild(child);
    }
}

renderHoursRemaining();
renderActivitiesUl();

const mailTextAreaEl = document.getElementById("mailTextArea");
mailTextAreaEl.value = `
Bonjour,

Nous sommes vendredi, voici donc le récap de mes activités de la semaine:

{liste}

Bien à vous,

`;

const newActivityFormEl = document.getElementById("newActivityForm");
newActivityFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    activities[e.target.newOption.value] = 0;
    renderActivitiesUl();
});

const mailFormEl = document.getElementById("mailForm");
mailFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const mail = e.target.mail.value;

    const arr = [];
    for (const [key, value] of Object.entries(activities)) {
        if (value > 0)
            arr.push(`- ${key.trim()}: ${value} heure${value > 1 ? "s" : ""}`);
    }

    const prettyMail = mail.replace("{liste}", arr.join("\n"));

    navigator.clipboard.writeText(prettyMail).then(() => {
        const defaultStyles = e.target[1].style;
        const defaultText = e.target[1].innerText;

        e.target[1].style.backgroundColor = "#3CB043";
        e.target[1].style.border = "none";
        e.target[1].innerText = "Copié!";

        setTimeout(() => {
            e.target[1].style = defaultStyles;
            e.target[1].innerText = defaultText;
        }, 3000);
    });
});
