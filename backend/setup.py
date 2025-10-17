from setuptools import setup, find_packages

setup(
    name="app",
    version="0.1.0",
    packages=find_packages(),  # автоматически находит все пакеты
    install_requires=[
        # список зависимостей, если нужно
        # 'fastapi',
        # 'pandas',
    ],
    python_requires=">=3.12",
)