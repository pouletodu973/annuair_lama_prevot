import re

with open("eleves.txt", "r", encoding="utf-8") as f:
    contenu = f.read()

# Séparation des fiches élèves
blocs = re.split(r'givenname\s+\{', contenu)[1:]

eleves = []

for bloc in blocs:

    prenom_match = re.match(r'([^}]*)', bloc)

    nom_match = re.search(r'sn\s+\{([^}]*)\}', bloc)

    classe_match = re.search(
        r'CN=Classe_([^,}]*)',
        bloc
    )

    if prenom_match and nom_match:

        prenom = prenom_match.group(1).strip()
        nom = nom_match.group(1).strip()

        classe = (
            classe_match.group(1).strip()
            if classe_match else "INCONNUE"
        )

        eleves.append({
            "prenom": prenom,
            "nom": nom,
            "classe": classe
        })

print(f"{len(eleves)} élèves trouvés")

for e in eleves:
    print(e)

import csv

with open(
    "eleves.csv",
    "w",
    newline="",
    encoding="utf-8"
) as f:

    writer = csv.DictWriter(
        f,
        fieldnames=["nom", "prenom", "classe"],
        delimiter=";"
    )

    writer.writeheader()
    writer.writerows(eleves)