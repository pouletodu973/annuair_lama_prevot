fetch("eleves.json")
.then(r => r.json())
.then(eleves => {

    const container = document.getElementById("annuaire");

    const classes = {};

    eleves.forEach(eleve => {

        if (!classes[eleve.classe]) {
            classes[eleve.classe] = [];
        }

        classes[eleve.classe].push(eleve);
    });

    Object.keys(classes).sort().forEach(classe => {

        const titre = document.createElement("h2");
        titre.textContent = classe;

        container.appendChild(titre);

        classes[classe].forEach(eleve => {

            const div = document.createElement("div");

            div.className = "eleve";

            div.textContent =
                eleve.prenom + " " + eleve.nom;

            div.onclick = () => {

                document
                    .getElementById("fiche")
                    .classList
                    .remove("hidden");

                document
                    .getElementById("nomComplet")
                    .textContent =
                    eleve.prenom + " " + eleve.nom;

                document
                    .getElementById("classe")
                    .textContent =
                    eleve.classe;

                document
                    .getElementById("description")
                    .value =
                    eleve.description || "";
            };

            container.appendChild(div);
        });
    });
});