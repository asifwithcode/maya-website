// Maya from the real Fusion model (public/maya/maya.glb, one mesh per CAD face with Fusion's normals):
// body, head and every accessory are the printed parts, only the screen is drawn live.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type LookId = "plain" | "bunny" | "panda" | "crown" | "sprout" | "headphones" | "backpack";

export type MayaModel = {
  root: THREE.Group;
  head: THREE.Group;
  screenTexture: THREE.CanvasTexture;
  looks: Record<Exclude<LookId, "plain">, THREE.Group>;
  dispose: () => void;
};

type Meta = { neck: [number, number, number]; screen: { center: [number, number, number]; radius: number } };

const PINK = 0xee98ae;

export async function loadMaya(canvas: HTMLCanvasElement, url = "/maya/maya.glb"): Promise<MayaModel> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const meta = gltf.scene.userData as Meta;
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const shell = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf7f5f2,
      roughness: 0.66,
      sheen: 1,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(0xfff0f3),
      clearcoat: 0.05,
    }),
  );
  const pink = track(new THREE.MeshPhysicalMaterial({ color: PINK, roughness: 0.6 }));
  const black = track(new THREE.MeshPhysicalMaterial({ color: 0x131315, roughness: 0.32, clearcoat: 0.7 }));
  const gold = track(new THREE.MeshPhysicalMaterial({ color: 0xe8b42c, roughness: 0.3, metalness: 0.75, clearcoat: 0.5 }));
  const green = track(new THREE.MeshPhysicalMaterial({ color: 0x6baf5b, roughness: 0.5, sheen: 0.5 }));
  const darkPink = track(new THREE.MeshPhysicalMaterial({ color: 0xd65680, roughness: 0.45, clearcoat: 0.3 }));
  // colours come from the Fusion appearances, baked into each node as extras.mat
  const MAT: Record<string, THREE.Material> = { white: shell, pink, black, gold, green, darkpink: darkPink };

  // the head turns about the neck axis; everything on it is shifted so that pivot is its origin
  const root = new THREE.Group();
  const head = new THREE.Group();
  head.position.fromArray(meta.neck);
  root.add(head);
  const onHead = new THREE.Group();
  onHead.position.fromArray(meta.neck).negate();
  head.add(onHead);

  const looks = {
    bunny: new THREE.Group(), panda: new THREE.Group(), crown: new THREE.Group(), sprout: new THREE.Group(),
    headphones: new THREE.Group(), backpack: new THREE.Group(),
  };
  for (const [id, g] of Object.entries(looks)) {
    (id === "backpack" ? root : onHead).add(g);
    g.visible = false;
  }

  for (const node of [...gltf.scene.children]) {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) continue;
    track(mesh.geometry);
    mesh.material = MAT[mesh.userData.mat as string] ?? shell;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const group: string = mesh.userData.group ?? "body";
    if (group === "head") onHead.add(mesh);
    else if (group.startsWith("look:")) looks[group.slice(5) as keyof typeof looks].add(mesh);
    else root.add(mesh);
  }

  // pivot every accessory on its own centre so it can pop in place
  root.updateMatrixWorld(true);
  for (const g of Object.values(looks)) {
    const c = new THREE.Box3().setFromObject(g, true).getCenter(new THREE.Vector3());
    g.parent!.worldToLocal(c);
    g.children.forEach((m) => m.position.sub(c));
    g.position.add(c);
  }

  // live screen behind the bezel
  const screenTexture = track(new THREE.CanvasTexture(canvas));
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = 4;
  const glass = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 1,
    }),
  );
  glass.toneMapped = false;
  const screen = new THREE.Mesh(track(new THREE.CircleGeometry(meta.screen.radius, 96)), glass);
  screen.position.fromArray(meta.screen.center);
  onHead.add(screen);

  return { root, head, screenTexture, looks, dispose: () => disposables.forEach((d) => d.dispose()) };
}
