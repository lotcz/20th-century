import ai
import neo
import os

import util

response = ai.complete_json(f"Create a list of {os.getenv('PROJECT_MAGNITUDE')} biggest and most famous cities that existed in 20th century. Include latitude, longitude and country.")

cities = util.get(response)

def insert_cities(tx):
    for city in cities:
        name=util.extract_city_name(util.get(city, "name", "city_name"))
        if (name is None):
            continue
        tx.run(
            "MERGE (c:City {name: $name}) ",
            name=name
        )

neo.run_write_tx(insert_cities)
