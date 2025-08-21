export interface TextBank { labels: string[]; embs: Float32Array[]; }


export async function loadTextBank(labelsUrl: string, embUrl: string): Promise<TextBank> {
const [labelsRes, embRes] = await Promise.all([fetch(labelsUrl), fetch(embUrl)]);
const labels: string[] = await labelsRes.json();
const raw: number[][] = await embRes.json(); // [[d], [d], ...]
const embs = raw.map(v=>{
const f32 = new Float32Array(v);
// L2 정규화 가정(오프라인 시 이미 정규화해 두면 스킵 가능)
let n=0; for(let i=0;i<f32.length;i++) n+=f32[i]*f32[i]; n=Math.sqrt(n);
if(n>0) for(let i=0;i<f32.length;i++) f32[i]/=n;
return f32;
});
return { labels, embs };
}


export function cosineSim(a: Float32Array, b: Float32Array){
let s=0; for(let i=0;i<a.length;i++) s += a[i]*b[i]; return s;
}


export function topKDistinct(bank: TextBank, query: Float32Array, k: number, minGap=0.02){
const scores = bank.embs.map((e,i)=>({i, s: cosineSim(query,e)}));
scores.sort((x,y)=>y.s - x.s);
const pick: string[] = [];
for(const it of scores){
const cand = bank.labels[it.i];
if(!pick.includes(cand)) pick.push(cand);
if(pick.length>=k) break;
// minGap 로직은 단순화(원하면 인접의미 제거용 NMS 추가)
}
return pick;
}