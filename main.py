import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import models
from api.routes import individualPortfolioValue

app = FastAPI(debug=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Web3.0 API where you can actually see words not just numbers"
    }


app.include_router(individualPortfolioValue.portfolio_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host=models.HOST, port=models.PORT, reload=True, debug=True)
