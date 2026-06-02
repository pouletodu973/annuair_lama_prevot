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
    });

/* ---------------- CLASSES ---------------- */

function afficherClasses() {
    const container = document.getElementById("classes");

    const classes = ["toutes", ...new Set(eleves.map(e => e.classe))];

    container.innerHTML = "";

    classes.forEach(classe => {
        const btn = document.createElement("div");
        btn.className = "classe-btn";
        btn.textContent = classe;

        btn.onclick = () => {
            classeActuelle = classe;
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

    liste.forEach(eleve => {
        const div = document.createElement("div");
        div.className = "eleve";
        div.textContent = eleve.prenom + " " + eleve.nom;

        div.onclick = () => afficherFiche(eleve);

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

    document.getElementById("photo").src =
        eleve.photo || "https://via.placeholder.com/120";

    const desc = document.getElementById("description");

    desc.value = eleve.description || "";

    desc.oninput = () => {
        eleve.description = desc.value;
        save();
    };

    updateAdminUI(eleve);
}

/* ---------------- ADMIN UI ---------------- */

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
};

/* ---------------- SEARCH ---------------- */

document.getElementById("search").addEventListener("input", afficherEleves);

/* ---------------- DARK MODE ---------------- */

document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

/* ---------------- AJOUT ---------------- */

function ajouterEleve() {
    const eleve = {
        prenom: newPrenom.value,
        nom: newNom.value,
        classe: newClasse.value,
        description: newDesc.value,
        email: "",
        telephone: "",
        session: "2025-2026",
        photo: ""
    };

    eleves.push(eleve);
    save();

    afficherClasses();
    afficherEleves();

    showFeedback("✔ Élève ajouté !");
}

/* ---------------- SUPPRESSION ---------------- */

function supprimerEleve(eleve) {
    if (!confirm("Supprimer cet élève ?")) return;

    eleves = eleves.filter(e =>
        !(e.nom === eleve.nom && e.prenom === eleve.prenom)
    );

    save();
    afficherClasses();
    afficherEleves();

    document.getElementById("fiche").classList.add("hidden");

    showFeedback("🗑 Élève supprimé");
}

/* ---------------- SAVE ---------------- */

function save() {
    localStorage.setItem("eleves", JSON.stringify(eleves));
}

/* ---------------- FEEDBACK + CONFETTI ---------------- */

function showFeedback(msg) {
    const f = document.getElementById("feedback");

    f.textContent = msg;
    f.classList.remove("hidden");

    document.body.style.transition = "0.3s";
    document.body.style.background = "#2ecc71";

    let t = 3;

    const interval = setInterval(() => {
        f.textContent = msg + " (" + t + ")";
        t--;

        if (t < 0) {
            clearInterval(interval);
            f.classList.add("hidden");
            document.body.style.background = "";
        }
    }, 1000);

    launchConfetti();
}

function launchConfetti() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 10
        });
    }

    let frame = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.y += 2;
            p.x += Math.sin(p.d);
        });

        frame++;
        if (frame < 60) requestAnimationFrame(animate);
    }

    animate();
}

/* ---------------- PHOTO UPLOAD ---------------- */

document.getElementById("photo").onclick = () => {
    document.getElementById("photoInput").click();
};

document.getElementById("photoInput").addEventListener("change", function () {

    const file = this.files[0];
    if (!file || !currentEleve) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        currentEleve.photo = e.target.result;

        document.getElementById("photo").src = currentEleve.photo;

        save();

        showFeedback("📸 Photo mise à jour !");
    };

    reader.readAsDataURL(file);
});

/* ---------------- KONAMI ADMIN ---------------- */

function toggleAdmin() {
    adminMode = !adminMode;

    const panel = document.getElementById("adminPanel");

    if (adminMode) {
        panel.classList.remove("hidden");
        showFeedback("🔐 Mode admin activé");
    } else {
        panel.classList.add("hidden");
        showFeedback("🔓 Mode admin désactivé");
    }

    if (currentEleve) {
        updateAdminUI(currentEleve);
    }
}

let konami = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a"
];

let index = 0;

document.addEventListener("keydown", (e) => {

    if (e.key === konami[index]) {
        index++;
    } else {
        index = 0;
    }

    if (index === konami.length) {
        toggleAdmin();
        index = 0;
    }
});
