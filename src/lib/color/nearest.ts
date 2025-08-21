import { CSS_NAMED_COLORS, NamedColor } from "../color/cssColorMap";
import { rgb2lab, deltaE, Vec3 } from "../color/lab";


export function nearestNamedColors(palette: Vec3[], topK=2, distinct=true){
const labs = palette.map(rgb2lab);
const named = CSS_NAMED_COLORS.map(c=>({ name:c.name, lab: rgb2lab(c.rgb) }));
// 각 팔레트 점에 대해 최단 ΔE 색상 찾기
const candidates: {name:string, d:number}[] = [];
for(const L of labs){
let best={name:"", d:1e9};
for(const n of named){
const d = deltaE(L, n.lab);
if(d<best.d) best={name:n.name, d};
}
candidates.push(best);
}
// ΔE 오름차순 정렬 후 상위
candidates.sort((a,b)=>a.d-b.d);
const out:string[]=[];
for(const c of candidates){
if(!distinct || !out.includes(c.name)) out.push(c.name);
if(out.length>=topK) break;
}
return out;
}