import ai
import neo
import os

import util

def load_cities(tx):
    result = tx.run("""
        MATCH (c:City)
        RETURN c.name as name
        """)
    return list(result)

def update_cities(tx, cities):
    for city in cities:
        name = city['name']
        response = ai.complete_json(f"Give me details of city {name}. Include latitude, longitude and country.")
        lat=util.extract_coordinate(util.get(response, "latitude"))
        lon=util.extract_coordinate(util.get(response, "longitude"))
        country=util.extract_country_name(util.get(response, "country", "country_name"))
        tx.run(
            "MERGE (c:City {name: $name}) "
            "MERGE (co:Country {name: $country}) "
            "MERGE (c)-[:IS_IN]->(co) "
            "SET c.latitude = $lat, c.longitude = $lon",
            name=name, lat=lat, lon=lon, country=country
        )

cities = neo.run_read_tx(load_cities)
neo.run_write_tx(update_cities, cities)
