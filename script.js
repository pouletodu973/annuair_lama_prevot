let eleves = [];
let classeActuelle = "toutes";

fetch("eleves.json")
    .then(res => res.json())
    .then(data => {
        eleves = data;
        afficherClasses();
        afficherEleves();
    });

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

function afficherEleves() {
    const container = document.getElementById("annuaire");
    container.innerHTML = "";

    let filtres = eleves;

    if (classeActuelle !== "toutes") {
        filtres = eleves.filter(e => e.classe === classeActuelle);
    }

    const search = document.getElementById("search").value.toLowerCase();
    if (search) {
        filtres = filtres.filter(e =>
            (e.nom + " " + e.prenom).toLowerCase().includes(search)
        );
    }

    filtres.forEach(eleve => {
        const div = document.createElement("div");
        div.className = "eleve";
        div.textContent = eleve.prenom + " " + eleve.nom;

        div.onclick = () => afficherFiche(eleve);

        container.appendChild(div);
    });
}

function afficherFiche(eleve) {
    document.getElementById("fiche").classList.remove("hidden");

    document.getElementById("nomComplet").textContent =
        eleve.prenom + " " + eleve.nom;

    document.getElementById("classe").textContent = eleve.classe;

    document.getElementById("description").value = eleve.description || "";
}

document.getElementById("search").addEventListener("input", afficherEleves);
