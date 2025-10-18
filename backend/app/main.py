from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import test_results
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Запуск приложения...")  # выполнится при старте
    # Ensure DB tables are created before serving requests (dev convenience)
    try:
        init_db()
        print("Database initialized (tables created if missing).")
    except Exception as e:
        print("Database initialization failed:", e)
    yield
    print("Выключение приложения...")  # выполнится при остановке


app = FastAPI(lifespan=lifespan)

# Enable CORS for the frontend (adjust origins as needed)
# Allow only the frontend development origin(s). Using explicit origins
# avoids issues with credentials + wildcard origins and is safer for dev.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(test_results.router)


@app.get("/")
def read_root():
    return {"message": "Привет, это работает!"}