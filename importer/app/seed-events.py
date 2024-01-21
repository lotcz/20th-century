import ai
import neo
import os

import util

response = ai.complete_json(f"Create a list of {os.getenv('PROJECT_MAGNITUDE')} most important events that happened in 20th century. Include year, list of cities it occurred in and list of people involved.")

events = util.get(response)

def insert_events(tx):
    for event in events:
        name = util.extract_event_name(util.get(event, "name", "event", "description", "event_name"))
        if name is None:
            continue
        year = util.extract_year(util.get(event, "year"))
        cities = util.get(event, "cities")
        people = util.get(event, "people", "people_involved", "peopleInvolved")

        if year is not None:
            tx.run(
                "MERGE (e:Event {name: $event}) "
                "MERGE (y:Year {name: $year}) "
                "MERGE (e)-[:HAPPENED_IN]->(y)",
                event=name, year=year
            )

        for city in cities:
            city_name = util.extract_city_name(city)
            if city_name is not None:
                tx.run(
                    "MERGE (e:Event {name: $event}) "
                    "MERGE (c:City {name: $city}) "
                    "MERGE (e)-[:OCCURRED_AT]->(c)",
                    event=name, city=city_name
                )

        for person in people:
            person_name = util.extract_person_name(person)
            if person_name is not None:
                tx.run(
                    "MERGE (e:Event {name: $event})"
                    "MERGE (p:Person {name: $person}) "
                    "MERGE (p)-[:INVOLVED_IN]->(e)",
                    event=name, person=person_name
                )

neo.run_write_tx(insert_events)
