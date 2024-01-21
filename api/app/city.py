import neo

def load_cities_tx(tx):
    result = tx.run("""
        MATCH (c:City)-[:IS_IN]->(co:Country)
        RETURN
            id(c) as id,
            c.name as name,
            c.latitude as latitude,
            c.longitude as longitude,
            co.name as country
        """)
    return result.data()

def load_cities():
    return neo.run_read_tx(load_cities_tx)
