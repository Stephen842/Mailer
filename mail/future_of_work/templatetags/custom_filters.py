import json
from django import template

register = template.Library()

@register.filter
def pluck(values, key):
    """Return a JSON-safe array from list of dicts/objects."""
    result = []
    for v in values:
        if isinstance(v, dict):
            result.append(v.get(key))
        else:
            result.append(getattr(v, key, None))
    return json.dumps(result)  # convert to JSON string