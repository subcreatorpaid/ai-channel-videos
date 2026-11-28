// Cel-shaded 3D establishing shots for the lore style ("land3d" shot type): low-poly scenes built in code, toon shading
// (3 hard light bands), dark-brown inverted-hull outlines, animated on twos, drawn over the 2D sky so both looks match.
// scene: 'wall' (a stone wall snaking over hills, milecastles, turrets), 'fort' (square fort, towers, barracks),
// 'sea' (a ship crossing a grey sea), 'camp' (rows of leather tents inside a ditch), 'road' (a straight road over hills).
import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {W, H, INK, hash} from './kit';

const grad = (() => { const d = new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (c) => new THREE.MeshToonMaterial({color: c, gradientMap: grad});
const inkMat = new THREE.MeshBasicMaterial({color: INK, side: THREE.BackSide});

// a mesh plus its outline shell (inverted hull, pushed out along the normals)
const Ink = ({geo, color, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], line = 0.16}) => {
  const shell = useMemo(() => { const g = geo.clone(); g.computeVertexNormals(); const p = g.attributes.position, n = g.attributes.normal;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * line / scale[0], p.getY(i) + n.getY(i) * line / scale[1], p.getZ(i) + n.getZ(i) * line / scale[2]); return g; }, [geo, line, scale[0], scale[1], scale[2]]);
  const mat = useMemo(() => toon(color), [color]);
  return (<group position={pos} rotation={rot} scale={scale}><mesh geometry={geo} material={mat} /><mesh geometry={shell} material={inkMat} /></group>);
};

// terrain: rolling hills, height function shared with everything that stands on it
const hill = (x, z, seed = 1) => Math.sin(x * 0.08 + seed) * 2.2 + Math.cos(z * 0.06 + seed * 2) * 2.6 + Math.sin((x + z) * 0.03) * 3;
const Terrain = ({color, seed, size = 220}) => {
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(size, size, 70, 70); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, hill(p.getX(i), p.getZ(i), seed)); g.computeVertexNormals(); return g; }, [seed, size]);
  return <mesh geometry={geo} material={useMemo(() => toon(color), [color])} />;
};

const box = new THREE.BoxGeometry(1, 1, 1);
const cone = new THREE.ConeGeometry(1, 1, 4);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 10);

const WallScene = ({C}) => {
  const segs = useMemo(() => { const out = []; for (let i = 0; i < 90; i++) { const x = -110 + i * 2.5, z = Math.sin(i * 0.09) * 14 - 10;
    const y = hill(x, z, 1); out.push({x, z, y, a: Math.atan2(Math.cos(i * 0.09) * 14 * 0.09, 2.5)}); } return out; }, []);
  return (<group>
    <Terrain color={C.grass} seed={1} />
    {segs.map((s, i) => <Ink key={i} geo={box} color={C.stone} pos={[s.x, s.y + 1.4, s.z]} rot={[0, -s.a, 0]} scale={[2.7, 2.8, 1.4]} line={0.05} />)}
    {segs.filter((_, i) => i % 18 === 6).map((s, i) => <group key={'m' + i}>
      <Ink geo={box} color={C.stone2} pos={[s.x, s.y + 2.2, s.z + 2.6]} scale={[5, 4.4, 4.4]} />
      <Ink geo={cone} color={C.roof} pos={[s.x, s.y + 5.4, s.z + 2.6]} rot={[0, Math.PI / 4, 0]} scale={[3.8, 2.2, 3.8]} /></group>)}
    {segs.filter((_, i) => i % 9 === 2).map((s, i) => <Ink key={'t' + i} geo={box} color={C.stone2} pos={[s.x, s.y + 3, s.z]} scale={[2.2, 6, 2.2]} />)}
    {Array.from({length: 40}, (_, i) => { const x = (hash(i) - 0.5) * 200, z = (hash(i + 9) - 0.5) * 160 - 30; return Math.abs(z - (-10)) < 8 ? null :
      <Ink key={'tr' + i} geo={cone} color={C.tree} pos={[x, hill(x, z, 1) + 2.6, z]} scale={[1.8, 5, 1.8]} line={0.08} />; })}
  </group>);
};

const FortScene = ({C}) => (<group>
  <Terrain color={C.grass} seed={3} />
  <group position={[0, hill(0, 0, 3) + 0.2, 0]}>
    {[[0, -14, 30, 1.6], [0, 14, 30, 1.6], [-14, 0, 1.6, 30], [14, 0, 1.6, 30]].map(([x, z, w, d], i) => <Ink key={i} geo={box} color={C.stone} pos={[x, 2, z]} scale={[w, 4, d]} />)}
    {[[-14, -14], [14, -14], [-14, 14], [14, 14], [-4, 14], [4, 14]].map(([x, z], i) => <group key={'t' + i}><Ink geo={box} color={C.stone2} pos={[x, 3.2, z]} scale={[3, 6.4, 3]} />
      <Ink geo={cone} color={C.roof} pos={[x, 7.2, z]} rot={[0, Math.PI / 4, 0]} scale={[2.6, 1.8, 2.6]} /></group>)}
    {[-7, -2, 3, 8].map((x, i) => <group key={'b' + i}><Ink geo={box} color={C.plaster} pos={[x, 1.5, -4]} scale={[3.4, 3, 14]} />
      <Ink geo={box} color={C.roof} pos={[x, 3.4, -4]} rot={[0, 0, Math.PI / 4]} scale={[2.6, 2.6, 14.4]} /></group>)}
    <Ink geo={box} color={C.plaster} pos={[0, 2, 7]} scale={[10, 4, 6]} />
    <Ink geo={box} color={C.roof} pos={[0, 4.4, 7]} rot={[Math.PI / 4, 0, 0]} scale={[10.4, 3, 3]} />
  </group>
  {Array.from({length: 30}, (_, i) => { const x = (hash(i * 3) - 0.5) * 200, z = (hash(i * 5) - 0.5) * 200; return Math.hypot(x, z) < 30 ? null :
    <Ink key={'tr' + i} geo={cone} color={C.tree} pos={[x, hill(x, z, 3) + 2.6, z]} scale={[1.8, 5, 1.8]} line={0.08} />; })}
</group>);

const SeaScene = ({C, f, t0}) => {
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(400, 400, 60, 60); g.rotateX(-Math.PI / 2); return g; }, []);
  const ff = f - (f % 2);
  useMemo(() => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, Math.sin(p.getX(i) * 0.15 + ff * 0.08) * 0.5 + Math.cos(p.getZ(i) * 0.2 + ff * 0.06) * 0.5); p.needsUpdate = true; geo.computeVertexNormals(); }, [ff, geo]);
  const bob = Math.sin(ff * 0.07) * 0.5, roll = Math.sin(ff * 0.05) * 0.08;
  return (<group>
    <mesh geometry={geo} material={useMemo(() => toon(C.sea), [C.sea])} />
    <group position={[(ff - (t0 || 0)) * 0.02 - 2, bob, 0]} rotation={[roll, 0.3, 0]}>
      <Ink geo={box} color={C.wood} pos={[0, 1.2, 0]} scale={[14, 2.2, 4]} />
      <Ink geo={box} color={C.wood} pos={[6.5, 2.2, 0]} rot={[0, 0, 0.5]} scale={[3, 1.5, 3.6]} />
      <Ink geo={cyl} color={C.wood} pos={[0, 7, 0]} scale={[0.3, 11, 0.3]} />
      <Ink geo={box} color={C.sail} pos={[0.4, 8, 0]} scale={[0.3, 6.5, 8]} />
      {Array.from({length: 7}, (_, i) => <Ink key={i} geo={box} color={C.oar} pos={[-5 + i * 1.6, 0.4, 2.6]} rot={[0.6, 0, 0]} scale={[0.25, 0.25, 4]} line={0.03} />)}
    </group>
  </group>);
};

const CampScene = ({C}) => (<group>
  <Terrain color={C.grass} seed={5} />
  <group position={[0, hill(0, 0, 5), 0]}>
    {Array.from({length: 6}, (_, r) => Array.from({length: 8}, (_, k) => <Ink key={r + '-' + k} geo={cone} color={C.tent} pos={[-21 + k * 6, 1.6, -16 + r * 6]} rot={[0, Math.PI / 4, 0]} scale={[2.6, 3.2, 2.6]} />))}
    {[[0, -22, 52, 1], [0, 22, 52, 1], [-26, 0, 1, 44], [26, 0, 1, 44]].map(([x, z, w, d], i) => <Ink key={i} geo={box} color={C.wood} pos={[x, 1, z]} scale={[w, 2, d]} />)}
  </group>
</group>);

const RoadScene = ({C}) => (<group>
  <Terrain color={C.grass} seed={7} />
  {Array.from({length: 80}, (_, i) => { const z = 60 - i * 3; return <Ink key={i} geo={box} color={C.stone} pos={[0, hill(0, z, 7) + 0.2, z]} scale={[3.2, 0.4, 3.1]} line={0.03} />; })}
  {Array.from({length: 30}, (_, i) => { const x = (hash(i * 7) - 0.5) * 200, z = (hash(i * 11) - 0.5) * 200; return Math.abs(x) < 8 ? null :
    <Ink key={'tr' + i} geo={cone} color={C.tree} pos={[x, hill(x, z, 7) + 2.6, z]} scale={[1.8, 5, 1.8]} line={0.08} />; })}
</group>);

const SCENES = {wall: WallScene, fort: FortScene, sea: SeaScene, camp: CampScene, road: RoadScene};
export const SCENE3D_NAMES = Object.keys(SCENES);
const PAL = {
  day: {grass: '#7E9A5A', stone: '#B9AE98', stone2: '#A89C84', roof: '#9C4A36', tree: '#4E6E44', plaster: '#E4D8C0', sea: '#5E7E90', wood: '#7A5238', sail: '#E8DCC0', oar: '#5A3E2A', tent: '#B88A5A'},
  cold: {grass: '#6E8466', stone: '#A8A8A0', stone2: '#96968E', roof: '#7E4A3C', tree: '#3E5A44', plaster: '#D8D4C8', sea: '#4E6470', wood: '#6A4A36', sail: '#D8D0C0', oar: '#4A3628', tent: '#9C7A56'},
  dusk: {grass: '#8C7C50', stone: '#C49A7A', stone2: '#B08A6C', roof: '#8A3A2E', tree: '#4A4A38', plaster: '#E0BFA0', sea: '#6A5A6E', wood: '#6A4232', sail: '#E8C8A8', oar: '#4A3020', tent: '#B07A50'},
};

// camera: a slow orbit / dolly over the scene, stepped on twos like the reference's 3D
export const Land3D = ({s, f, t0, dur}) => {
  const C = PAL[s.palette || 'day'], Sc = SCENES[s.scene] || WallScene;
  const ff = f - (f % 2), p = Math.min(1, Math.max(0, (ff - t0) / Math.max(1, dur)));
  const cam = s.camera || {}, [ax, ay, az] = cam.from || [40, 28, 60], [bx, by, bz] = cam.to || [10, 22, 48], [lx, ly, lz] = cam.look || [0, 0, 0];
  const cx = ax + (bx - ax) * p, cy = ay + (by - ay) * p, cz = az + (bz - az) * p;
  return (<ThreeCanvas width={W} height={H} style={{position: 'absolute', inset: 0}} gl={{alpha: true, antialias: true}}
    camera={{position: [cx, cy, cz], fov: cam.fov || 40, near: 0.5, far: 600}} onCreated={({camera}) => camera.lookAt(lx, ly, lz)}>
    <CamLook x={cx} y={cy} z={cz} l={[lx, ly, lz]} />
    <ambientLight intensity={0.55} color="#FFF1DA" /><hemisphereLight args={["#FFF4DE", "#5A4A3A", 0.35]} />
    <directionalLight position={[-60, 90, 40]} intensity={2.4} color={s.palette === 'dusk' ? '#FFC08A' : '#FFF4DE'} />
    <fog attach="fog" args={[s.fog || '#E9D9BE', 60, 260]} />
    <Sc C={C} f={ff} t0={t0} />
  </ThreeCanvas>);
};
// keep the camera aimed every frame (ThreeCanvas reuses the camera between frames)
import {useThree} from '@react-three/fiber';
const CamLook = ({x, y, z, l}) => { const {camera} = useThree(); camera.position.set(x, y, z); camera.lookAt(l[0], l[1], l[2]); camera.updateProjectionMatrix(); return null; };
