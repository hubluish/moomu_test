# export_clip_image_encoder.py
import torch, open_clip, os

MODEL_NAME   = "ViT-B-32"
PRETRAIN_TAG = "openai"     # (laion2b_s34b_b79k 등도 가능) 이미지/텍스트 둘 다 동일 태그로 유지
OUT_ONNX     = "clip-vitb32-image-encoder.onnx"
OPSET        = 17

# 1) 모델 로드
model, _, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAIN_TAG)
model.eval()

# 2) 이미지 인코더만 꺼내기
# open_clip 모델은 model.encode_image 로 이미지 임베딩을 출력
dummy = torch.randn(1, 3, 224, 224)  # CLIP 표준 입력 크기
with torch.no_grad():
    _ = model.encode_image(dummy)

# 3) ONNX 내보내기
torch.onnx.export(
    model,                                   # 전체 모델에서 encode_image를 지정하려면 아래 scripted 사용
    (dummy,),                                # 입력
    OUT_ONNX,
    input_names=["pixel_values"],
    output_names=["image_embeds"],
    opset_version=OPSET,
    do_constant_folding=True,
    dynamic_axes={"pixel_values": {0: "batch"}, "image_embeds": {0: "batch"}},
    verbose=False,
    export_params=True
)
print("saved:", OUT_ONNX)

# ⚠️ 일부 환경에서 전체 model로 export하면 encode_image가 그래프에 포함되지 않는 경우가 있어요.
# 그런 경우엔 TorchScript로 래핑해서 export:
# class ImgEnc(torch.nn.Module):
#     def __init__(self, core): super().__init__(); self.core = core
#     def forward(self, x): return self.core.encode_image(x)
# traced = torch.jit.trace(ImgEnc(model), (dummy,))
# torch.onnx.export(traced, (dummy,), OUT_ONNX, input_names=[...], output_names=[...], ...)
