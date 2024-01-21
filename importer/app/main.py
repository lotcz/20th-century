import os
import click
import importlib

@click.command()
@click.argument('name')
def run_command(name):
    click.echo("Running: " + name)
    click.echo("Magnitude: " + os.getenv('PROJECT_MAGNITUDE'))

    if name == 'reload':
        for m in ['clean', 'seed-cities', 'seed-people', 'seed-events', 'update-people', 'update-cities']:
            importlib.import_module(m)
    else:
        importlib.import_module(name)


if __name__ == '__main__':
    run_command()
