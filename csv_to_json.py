import csv
import json

eleves = []

with open("eleves.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter=";")

    for row in reader:
        row["description"] = ""
        eleves.append(row)

with open("eleves.json", "w", encoding="utf-8") as f:
    json.dump(
        eleves,
        f,
        ensure_ascii=False,
        indent=4
    )

print(f"{len(eleves)} élèves exportés vers eleves.json")