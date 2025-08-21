export function kMeansPalette(imgData: ImageData, k=6, maxIter=20, sample=65536): Vec3[] {
// 무작위 샘플링 후 k-means
const {data,width,height} = imgData;
const N = Math.min(sample, width*height);
const idxs = new Uint32Array(N);
for (let i=0;i<N;i++) idxs[i] = (Math.random()*width*height)|0;
const pts: number[][] = [];
for (let i=0;i<N;i++) {
const p = idxs[i]; const o=4*p;
pts.push([data[o], data[o+1], data[o+2]]);
}
// init centers
const centers: number[][] = pts.slice(0,k).map(x=>x.slice());
const assign = new Int32Array(N);
for (let it=0; it<maxIter; it++){
// assignment
for (let i=0;i<N;i++){
let best=-1,bd=1e9;
const [r,g,b]=pts[i];
for(let c=0;c<k;c++){
const [cr,cg,cb]=centers[c];
const d=(r-cr)*(r-cr)+(g-cg)*(g-cg)+(b-cb)*(b-cb);
if(d<bd){bd=d;best=c;}
}
assign[i]=best;
}
// update
const sum=Array.from({length:k},()=>[0,0,0,0]);
for(let i=0;i<N;i++){ const c=assign[i]; const p=pts[i]; sum[c][0]+=p[0]; sum[c][1]+=p[1]; sum[c][2]+=p[2]; sum[c][3]++; }
for(let c=0;c<k;c++){
if(sum[c][3]>0){ centers[c][0]=sum[c][0]/sum[c][3]; centers[c][1]=sum[c][1]/sum[c][3]; centers[c][2]=sum[c][2]/sum[c][3]; }
}
}
return centers.map(v=>[v[0],v[1],v[2]] as Vec3);
}