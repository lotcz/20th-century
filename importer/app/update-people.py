import ai
import neo
import os

import util

def clean_people(tx):
    tx.run("""
        MATCH (p:Person)
        WHERE p.name IS NULL
        DETACH DELETE p
        """)

def load_people(tx):
    result = tx.run("""
        MATCH (p:Person)
        RETURN p.name as name
        """)
    return list(result)

def update_people(tx, people):
    for person in people:
        name = person['name']
        response = ai.complete_json(f"Give me details of famous 20th century personality of {name}. Include year of birth, year of death, occupation, achievements, cities lived in.")
        if "personality" in response and type(response["personality"]) is dict:
            response = response["personality"]
        if "details" in response and type(response["details"]) is dict:
            response = response["details"]
        birth = util.extract_year(util.get(response, "year_of_birth", "yearOfBirth", "birth", "born"))
        death = util.extract_year(util.get(response, "year_of_death", "yearOfDeath", "death", "died"))
        occupation = util.extract_occupation_name(util.get(response, "occupation"))
        achievements = util.get(response, "achievements")
        cities = util.get(response, "cities_lived_in", "citiesLivedIn", "cities", "livedIn", "lived_in")
        tx.run(
            "MERGE (p:Person {name: $name}) "
            "MERGE (o:Occupation {name: $occupation}) "
            "MERGE (p)-[:WAS_A]->(o) ",
            name=name, occupation=occupation
        )
        if birth is not None:
            tx.run(
                "MERGE (p:Person {name: $name}) "
                "MERGE (y:Year {name: $year}) "
                "MERGE (p)-[:BORN_IN]->(y) ",
                name=name, year=birth
            )
        else:
            birth = 1900
        if death is not None:
            tx.run(
                "MERGE (p:Person {name: $name}) "
                "MERGE (y:Year {name: $year}) "
                "MERGE (p)-[:DIED_IN]->(y) ",
                name=name, year=death
            )
        else:
            death = 2000

        """
        print(f"Born: {birth}, Died:{death}")

        for year in range(birth, death + 1):
            print(year)
            tx.run(
                "MERGE (p:Person {name: $name}) "
                "MERGE (y:Year {name: $year}) "
                "MERGE (p)-[:LIVED_IN]->(y) ",
                name=name, year=year
            )
        """

        if type(cities) is dict:
            for city in cities:
                city_name = util.extract_city_name(city)
                if city_name is not None:
                    tx.run(
                        "MERGE (p:Person {name: $name}) "
                        "MERGE (c:City {name: $city}) "
                        "MERGE (p)-[:LIVED_AT]->(c)",
                        name=name, city=city_name
                    )
        if type(achievements) is str:
            tx.run(
                "MERGE (p:Person {name: $name}) "
                "MERGE (a:Achievement {name: $achievement}) "
                "MERGE (p)-[:ACHIEVED]->(a)",
                name=name, achievement=achievements
            )
        elif type(achievements) is list:
            for achievement in achievements:
                achievement_name = achievement
                if achievement_name is not None:
                    tx.run(
                        "MERGE (p:Person {name: $name}) "
                        "MERGE (a:Achievement {name: $achievement}) "
                        "MERGE (p)-[:ACHIEVED]->(a)",
                        name=name, achievement=achievement_name
                    )

people = neo.run_read_tx(load_people)
neo.run_write_tx(update_people, people)
