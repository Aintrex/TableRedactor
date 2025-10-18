"""
Models package initializer. Import model modules here so they are registered
with SQLAlchemy's declarative Base when the package is imported.
"""
from . import table  # noqa: F401
from . import test_table  # noqa: F401
