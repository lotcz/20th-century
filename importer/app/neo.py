import os
from neo4j import GraphDatabase

def run_tx(write, func, *args):
    uri = os.getenv('NEO4J_URI')
    username = os.getenv('NEO4J_USER')
    password = os.getenv('NEO4J_PASSWORD')

    with GraphDatabase.driver(uri, auth=(username, password)) as driver:
        driver.verify_connectivity()

        with driver.session() as session:
            if write:
                return session.execute_write(func, *args)
            else:
                return session.execute_read(func, *args)

def run_write_tx(func, *args):
    return run_tx(True, func, *args)

def run_read_tx(func, *args):
    return run_tx(False, func, *args)
