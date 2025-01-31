import fastapi
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware

import langChain

app = fastapi.FastAPI()

langChain.init_chatbot()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/chatbot")
def chatbot(request: Request):
    print(request)
    return langChain.chatbot(request.json().get("message"))

if __name__ == "__main__":
    app.run()