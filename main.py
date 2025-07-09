from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import re
import json
import os

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 2. API 키 구성 (앱 시작 시 1회만)
genai.configure(api_key=API_KEY)

# 3. FastAPI 앱 초기화
app = FastAPI()

# CORS 허용 설정 (Next.js ~발용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ["http://localhost:3000"] 처럼 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/gemini")
async def call_gemini(req: Request):
    body = await req.json()
    color = body.get("color")
    font = body.get("font")
    image = body.get("image")

    prompt = f"""
    색상: {color}
    폰트: {font}
    이미지: {image}
    (여기에 전체 프롬프트 넣기)
    
    [요청사항]
    키워드 기반으로 총 3세트를 json 파일로 응답할 것

    각 세트는 아래 항목 포함 (순서: 색상 → 이미지 → 폰트 → 문장)

    색상 관련  
    - 색상 키워드 (입력과 유사한 3개 선택)  
    Pastel, Vintage, Retro, Neon, Gold, Light, Dark, Warm, Cold, Summer, Fall, Winter, Spring, Happy, Nature, Earth, Night, Space, Rainbow, Gradient, Sunset, Sky, Sea, Kids, Skin, Food, Cream, Coffee, Wedding, Christmas, Halloween, Blue, Teal, Mint, Green, Sage, Yellow, Beige, Brown, Orange, Peach, Red, Maroon, Pink, Purple, Navy, Black, Grey, White

    이미지 관련  
    - 이미지 키워드 (입력 키워드를 구체화한 문장 1줄)

    폰트 관련  
    - 폰트 키워드 (제공 리스트 중 입력 키워드와 유사한 단어 1개 선택)

    선택 가능한 폰트 키워드 리스트:  
    붓글씨, 캘리그라피, 삐뚤빼뚤, 어른 손글씨, 손글씨 바탕, 각진 손글씨, 둥근 손글씨, 장식 손글씨, 감성적인, 크레파스, 장식체, 아이 손글씨, 색연필, 필기체, 마카, 네모 폰트, 캐릭터, 별모양, 구름, 복실복실, 분필

    무드 문장  
    - 각 세트당 3개, 15자 이내 구체적이고 직관적인 제목 가능 문장

    기존 프롬프트 구조(3세트, JSON 파일로 출력) 반드시 유지  
    결과 외 다른 말 절대 출력 금지
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text

        match = re.search(r"```json\s*([\s\S]+?)\s*```", text) or re.search(r"```([\s\S]+?)```", text)
        json_str = match.group(1) if match else text

        return json.loads(json_str)
    except Exception as e:
        return { "error": str(e) }
