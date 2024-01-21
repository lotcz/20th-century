import neo

def deleter(tx):
    tx.run("MATCH (n) DETACH DELETE n")

neo.run_write_tx(deleter)
