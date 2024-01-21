import re

def get(d: dict, *keys):
    if type(d) is not dict:
        return None
    m = len(keys)
    if m == 0:
        k = next(iter(d))
        if k in d:
            return d[k]
    i = 0
    while i < m:
        k = keys[i]
        if k in d:
            return d[k]
        i += 1
    return None

def contains_str(haystack: str, *needles: str):
    m = len(needles)
    if type(haystack) is not str or m == 0:
        return False
    haystack = haystack.lower()
    i = 0
    while i < m:
        needle = needles[i]
        if needle.lower() in haystack:
            return True
        i += 1
    return False

def represents_multiple(text: str):
    return contains_str(text, "various", "multiple")

def extract_number(number):
    if type(number) is int:
        return number
    if type(number) is not str:
        return None
    numbers = [int(word) for word in number.split() if word.isdigit()]
    if len(numbers) > 0:
        return numbers[0]
    return None

def extract_float(number):
    if type(number) is int or type(number) is float:
        return number
    if type(number) is not str:
        return None
    numbers = re.findall(r"[-+]?\d*\.\d+|\d+", number)
    if len(numbers) > 0:
        return float(numbers[0])
    return None

def extract_coordinate(number):
    if type(number) is int or type(number) is float:
        return number
    if type(number) is not str:
        return None
    number = number.replace("°", "")
    n = extract_float(number)
    if type(n) is float and (contains_str(number, "S") or contains_str(number, "W")):
        return -abs(n)
    return n

# YEARS

def represents_multiple_years(text: str):
    return represents_multiple(text) or contains_str(text, "years")

def extract_year(year):
    if year is None:
        return None
    if represents_multiple_years(year):
        return None
    return extract_number(year)

# PEOPLE

def represents_multiple_people(text: str):
    return represents_multiple(text) or contains_str(text, "leaders", "officials")

def extract_person_name(text: str):
    if represents_multiple_people(text):
        return None
    return text

# CITIES

def is_continent(text: str):
    return text in ["Europe", "Africa", "America", "Asia"]

def represents_multiple_cities(text: str):
    return represents_multiple(text) or contains_str(text, "cities")

def extract_city_name(text: str):
    if represents_multiple_cities(text) or is_continent(text):
        return None
    if contains_str(text, "World"):
        return "World"
    if contains_str(text, ","):
        return text[:text.index(",")]
    return text

def extract_country_name(text: str):
    return text

# EVENTS

def represents_multiple_events(text: str):
    return represents_multiple(text)

def extract_event_name(text: str):
    if represents_multiple_events(text):
        return None
    return text

# OCCUPATIONS

def represents_multiple_occupations(text: str):
    return represents_multiple(text)

def extract_occupation_name(text: str):
    if represents_multiple_occupations(text):
        return None
    return text
