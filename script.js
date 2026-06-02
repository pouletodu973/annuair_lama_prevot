let eleves = JSON.parse(localStorage.getItem("eleves")) || [];
let classeActuelle = "toutes";
let adminMode = false;
let currentEleve = null;

/* ---------------- INIT ---------------- */

fetch("eleves.json")
    .then(r => r.json())
    .then(data => {
        if (eleves.length === 0) eleves = data;

        afficherClasses();
        afficherEleves();

        initPhotoUpload(); // IMPORTANT
    });

/* ---------------- CLASSES ---------------- */

function afficherClasses() {
    const container = document.getElementById("classes");

    const classes = ["toutes", ...new Set(eleves.map(e => e.classe))];

    container.innerHTML = "";

    classes.forEach(c => {
        const btn = document.createElement("div");
        btn.className = "classe-btn";
        btn.textContent = c;

        btn.onclick = () => {
            classeActuelle = c;
            afficherEleves();
        };

        container.appendChild(btn);
    });
}

/* ---------------- LISTE ---------------- */

function afficherEleves() {
    const container = document.getElementById("annuaire");
    container.innerHTML = "";

    let liste = eleves;

    if (classeActuelle !== "toutes") {
        liste = liste.filter(e => e.classe === classeActuelle);
    }

    const search = document.getElementById("search").value.toLowerCase();

    if (search) {
        liste = liste.filter(e =>
            (e.nom + " " + e.prenom).toLowerCase().includes(search)
        );
    }

    liste.forEach(e => {
        const div = document.createElement("div");
        div.className = "eleve";
        div.textContent = e.prenom + " " + e.nom;

        div.onclick = () => afficherFiche(e);

        container.appendChild(div);
    });
}

/* ---------------- FICHE ---------------- */

function afficherFiche(eleve) {
    currentEleve = eleve;

    document.getElementById("fiche").classList.remove("hidden");
    document.getElementById("backBtn").classList.remove("hidden");

    document.getElementById("nomComplet").textContent =
        eleve.prenom + " " + eleve.nom;

    document.getElementById("classe").textContent = eleve.classe;
    document.getElementById("email").textContent = eleve.email || "-";
    document.getElementById("telephone").textContent = eleve.telephone || "-";
    document.getElementById("session").textContent = eleve.session || "-";

    const photo = document.getElementById("photo");
    photo.src = eleve.photo || "https://via.placeholder.com/120";

    const desc = document.getElementById("description");
    desc.value = eleve.description || "";

    desc.oninput = () => {
        eleve.description = desc.value;
        save();
    };

    updateAdminUI(eleve);
}

/* ---------------- PHOTO UPLOAD (FIX PROPRE) ---------------- */

function initPhotoUpload() {

    const photo = document.getElementById("photo");
    const input = document.getElementById("photoInput");

    if (!photo || !input) {
        console.error("Photo elements manquants");
        return;
    }

    // click photo → ouvrir file picker
    photo.addEventListener("click", () => {

        if (!currentEleve) {
            alert("Clique d'abord sur un élève");
            return;
        }

        input.click();
    });

    // changement fichier
    input.addEventListener("change", () => {

        const file = input.files[0];
        if (!file || !currentEleve) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            currentEleve.photo = e.target.result;

            document.getElementById("photo").src = currentEleve.photo;

            save();

            showFeedback("📸 Photo ajoutée !");
        };

        reader.readAsDataURL(file);

        input.value = "";
    });
}

/* ---------------- ADMIN ---------------- */

function updateAdminUI(eleve) {
    const del = document.getElementById("deleteBtn");

    if (adminMode) {
        del.style.display = "block";
        del.onclick = () => supprimerEleve(eleve);
    } else {
        del.style.display = "none";
    }
}

/* ---------------- RETOUR ---------------- */

document.getElementById("backBtn").onclick = () => {
    document.getElementById("fiche").classList.add("hidden");
    document.getElementById("backBtn").classList.add("hidden");
    currentEleve = null;
};

/* ---------------- SEARCH ---------------- */

document.getElementById("search").addEventListener("input", afficherEleves);

/* ---------------- DARK MODE ---------------- */

document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

/* ---------------- SAVE ---------------- */

function save() {
    localStorage.setItem("eleves", JSON.stringify(eleves));
}

/* ---------------- FEEDBACK SIMPLE ---------------- */

function showFeedback(msg) {
    const f = document.getElementById("feedback");

    f.textContent = msg;
    f.classList.remove("hidden");

    setTimeout(() => {
        f.classList.add("hidden");
    }, 2000);
}

/* ---------------- KONAMI ADMIN ---------------- */

let konami = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a"
];

let index = 0;

document.addEventListener("keydown", (e) => {

    if (e.key === konami[index]) index++;
    else index = 0;

    if (index === konami.length) {

        adminMode = !adminMode;

        document.getElementById("adminPanel")
            .classList.toggle("hidden");

        showFeedback(adminMode ? "🔐 Admin ON" : "🔓 Admin OFF");

        index = 0;
    }
});
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("PWA activée"))
        .catch(err => console.log("Erreur SW", err));
}
