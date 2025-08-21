import * as ort from "onnxruntime-web";


export interface ClipImageEncoder {
session: ort.InferenceSession;
}


export async function loadClipImageEncoder(modelUrl: string): Promise<ClipImageEncoder> {
const session = await ort.InferenceSession.create(modelUrl, {
executionProviders: ["webgpu","wasm"],
graphOptimizationLevel: "all"
});
return { session };
}


function preprocessToCHWFloat32(img: HTMLCanvasElement | OffscreenCanvas): {data: Float32Array, dims: number[]} {
// CLIP 표준: 224x224, mean/std 정규화
const ctx = (img as HTMLCanvasElement).getContext("2d")!;
const W=224,H=224;
const imageData = ctx.getImageData(0,0,W,H).data;
const out = new Float32Array(3*H*W);
// mean/std (OpenCLIP)
const mean=[0.48145466, 0.4578275, 0.40821073];
const std =[0.26862954, 0.26130258, 0.27577711];
for(let y=0;y<H;y++){
for(let x=0;x<W;x++){
const o=4*(y*W+x);
const r=imageData[o]/255, g=imageData[o+1]/255, b=imageData[o+2]/255;
const i=y*W+x; // NHWC → NCHW
out[0*H*W + i] = (r-mean[0])/std[0];
out[1*H*W + i] = (g-mean[1])/std[1];
out[2*H*W + i] = (b-mean[2])/std[2];
}
}
return { data: out, dims: [1,3,H,W] };
}


export async function encodeImage(encoder: ClipImageEncoder, canvas224: HTMLCanvasElement): Promise<Float32Array> {
const {data,dims} = preprocessToCHWFloat32(canvas224);
const tensor = new ort.Tensor("float32", data, dims);
const feeds: Record<string, ort.Tensor> = {};
// 입력명은 모델에 따라 다를 수 있음("input"/"pixel_values" 등). 사전 확인 필요.
feeds[encoder.session.inputNames[0]] = tensor;
const out = await encoder.session.run(feeds);
const first = out[encoder.session.outputNames[0]] as ort.Tensor;
// shape: [1, 512] 또는 [1, 768]
const v = first.data as Float32Array;
// L2 정규화
let norm=0; for(let i=0;i<v.length;i++) norm+=v[i]*v[i]; norm=Math.sqrt(norm);
const outVec = new Float32Array(v.length);
for(let i=0;i<v.length;i++) outVec[i]=v[i]/(norm||1);
return outVec;
}