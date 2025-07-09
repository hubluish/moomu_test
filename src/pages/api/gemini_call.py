import json
import re
from google import genai

# API 키
API_KEY = "AIzaSyCe_p56c-jMkewOpwCi0UFmnnRjsirWn-g"

def get_user_input():
    color = input("색상 키워드(예: 파스텔): ")
    font = input("폰트 키워드(예: 손글씨): ")
    image = input("이미지/감정 키워드(예: 사람, 감성적인): ")
    return color, font, image

color, font, image = get_user_input()

prompt = f"""
당신은 최신 디자인 트렌드와 색채 심리학에 정통하며, ColorHunt, Pinterest, Noonnu 데이터베이스에서 실제 검색 가능한 키워드를 기반으로 감성 무드보드를 기획하는 전문 컨설턴트입니다.

[입력]
색상: {color}
폰트: {font}
이미지/감정: {image}

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

client = genai.Client(api_key=API_KEY)
model = "gemini-2.0-flash"

response = client.models.generate_content(
    model=model,
    contents=prompt,
)

# 코드블록에서 JSON만 추출
match = re.search(r"```json\s*([\s\S]+?)\s*```", response.text)
if match:
    json_str = match.group(1)
else:
    json_str = response.text

# 파싱
try:
    output_json = json.loads(json_str)
except Exception:
    print("JSON 파싱 실패, 원본 저장")
    output_json = json_str

with open("gemini_output.json", "w", encoding="utf-8") as f:
    json.dump(output_json, f, ensure_ascii=False, indent=2)

print("gemini_output.json 파일로 저장 완료!")
