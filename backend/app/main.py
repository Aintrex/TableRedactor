from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Запуск приложения...")  # выполнится при старте
    yield
    print("Выключение приложения...")  # выполнится при остановке

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Привет, это работает!"}