import ai
import neo
import os

import util

response = ai.complete_json(f"Create a list of {os.getenv('PROJECT_MAGNITUDE')} most famous people that lived in 20th century with their occupation and city.")

people = util.get(response)

def insert_people(tx):
    for person in people:
        person_name = util.extract_person_name(util.get(person, "name"))
        city = util.extract_city_name(util.get(person, "city"))
        if person_name is None:
            continue
        tx.run(
            "MERGE (p:Person {name: $person}) "
            "MERGE (c:City {name: $city}) "
            "MERGE (p)-[:LIVED_AT]->(c)",
            person=person_name,
            city=city
        )

neo.run_write_tx(insert_people)

