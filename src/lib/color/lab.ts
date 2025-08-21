export type Vec3 = [number,number,number];


function pivot(n: number) { return n > 0.008856 ? Math.cbrt(n) : (7.787*n + 16/116); }
export function rgb2lab([r,g,b]: Vec3): Vec3 {
// sRGB -> XYZ -> LAB (D65)
const srgb = [r,g,b].map(v => v/255).map(v => v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
const [R,G,B] = srgb;
const X = (0.4124*R + 0.3576*G + 0.1805*B) / 0.95047;
const Y = (0.2126*R + 0.7152*G + 0.0722*B) / 1.00000;
const Z = (0.0193*R + 0.1192*G + 0.9505*B) / 1.08883;
const fx = pivot(X), fy = pivot(Y), fz = pivot(Z);
const L = 116*fy - 16;
const a = 500*(fx - fy);
const b2 = 200*(fy - fz);
return [L,a,b2];
}


export function deltaE(lab1: Vec3, lab2: Vec3): number {
const [L1,a1,b1] = lab1, [L2,a2,b2] = lab2;
const dL = L1-L2, da=a1-a2, db=b1-b2;
return Math.sqrt(dL*dL + da*da + db*db); // CIE76(간단)
}