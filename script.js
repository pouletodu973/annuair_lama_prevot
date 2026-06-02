let eleves = JSON.parse(localStorage.getItem("eleves")) || [];
let classeActuelle = "toutes";
let adminMode = false;

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

/* ---------------- ELEVES ---------------- */

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
    document.getElementById("fiche").classList.remove("hidden");
    document.getElementById("backBtn").classList.remove("hidden");

    document.getElementById("nomComplet").textContent =
        eleve.prenom + " " + eleve.nom;

    document.getElementById("classe").textContent = eleve.classe;

    const desc = document.getElementById("description");

    desc.value = eleve.description || "";

    desc.oninput = () => {
        eleve.description = desc.value;
        localStorage.setItem("eleves", JSON.stringify(eleves));
    };
}

/* ---------------- RETOUR ---------------- */

document.getElementById("backBtn").onclick = () => {
    document.getElementById("fiche").classList.add("hidden");
    document.getElementById("backBtn").classList.add("hidden");
};

/* ---------------- RECHERCHE ---------------- */

document.getElementById("search").addEventListener("input", afficherEleves);

/* ---------------- DARK MODE ---------------- */

document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

/* ---------------- AJOUT ELEVE ---------------- */

function ajouterEleve() {
    const prenom = document.getElementById("newPrenom").value;
    const nom = document.getElementById("newNom").value;
    const classe = document.getElementById("newClasse").value;
    const desc = document.getElementById("newDesc").value;

    eleves.push({ prenom, nom, classe, description: desc });

    localStorage.setItem("eleves", JSON.stringify(eleves));

    afficherClasses();
    afficherEleves();
}

/* ---------------- KONAMI CODE (ADMIN) ---------------- */

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
        adminMode = !adminMode;

        document.getElementById("adminPanel")
            .classList.toggle("hidden");

        alert("Mode admin activé !");
        index = 0;
    }
});
