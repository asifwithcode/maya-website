"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { loadMaya, type LookId, type MayaModel } from "./mayaModel";
import { drawEyes, type EyeMood } from "./eyes";

type Props = {
  look: LookId;
  /** 0..1 scroll progress through the hero, written by the page */
  progress?: MutableRefObject<number>;
  className?: string;
};

export default function MayaCanvas({ look, progress, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ setLook: (l: LookId) => void } | null>(null);
  const firstLook = useRef(look);

  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.6;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.36, 6.4);

    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(1.4, 5.2, 3.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2.5;
    key.shadow.camera.right = 2.5;
    key.shadow.camera.top = 2.5;
    key.shadow.camera.bottom = -2.5;
    key.shadow.radius = 6;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffe4ea, 1.1);
    rim.position.set(-3, 2, -3);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xf2e6e0, 0.5));

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.12 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.895;
    ground.receiveShadow = true;
    scene.add(ground);

    const eyeCanvas = document.createElement("canvas");
    eyeCanvas.width = eyeCanvas.height = 512;
    const ctx = eyeCanvas.getContext("2d")!;
    let maya: MayaModel | null = null;
    let disposed = false;
    const stage = new THREE.Group();
    scene.add(stage);

    // ---------- looks
    let current: LookId = "plain";
    let yaw = 0;
    let yawTarget = 0;
    const show = (l: LookId, animate: boolean) => {
      if (!maya) return void (pending = l);
      const m = maya;
      const prev = current === "plain" ? null : maya.looks[current];
      const next = l === "plain" ? null : maya.looks[l];
      current = l;
      yawTarget = l === "backpack" ? Math.PI * 0.82 : 0; // the bag lives on her back
      if (prev && prev !== next) {
        if (animate) gsap.to(prev.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.25, ease: "power2.in", onComplete: () => void (prev.visible = false) });
        else prev.visible = false;
      }
      if (next) {
        next.visible = true;
        if (animate) gsap.fromTo(next.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 0.9, delay: 0.15, ease: "elastic.out(1, 0.55)" });
        else next.scale.setScalar(1);
      }
      if (animate) {
        setMood("happy", 1.3);
        gsap.fromTo(m.root.position, { y: 0 }, { y: 0.16, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" });
      }
    };
    let pending: LookId = firstLook.current;
    api.current = { setLook: (l) => show(l, !reduce) };
    loadMaya(eyeCanvas).then((m) => {
      if (disposed) return m.dispose();
      maya = m;
      stage.add(m.root);
      show(pending, false);
      if (!reduce) gsap.from(m.root.scale, { x: 0.86, y: 0.86, z: 0.86, duration: 1.4, ease: "expo.out" });
    });

    // ---------- eyes and moods
    let mood: EyeMood = "idle";
    let moodUntil = 0;
    const setMood = (m: EyeMood, secs: number) => {
      mood = m;
      moodUntil = performance.now() + secs * 1000;
    };
    let blink = 0;
    let nextBlink = 1.5;
    const saccade = { x: 0, y: 0 };
    let nextSaccade = 2;

    // ---------- pointer: head follows the cursor, a tap makes her happy
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const ray = new THREE.Raycaster();
    let taps = 0;
    let tapReset = 0;
    const onTap = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      if (!maya || !ray.intersectObject(maya.root, true).length) return;
      taps += 1;
      window.clearTimeout(tapReset);
      tapReset = window.setTimeout(() => (taps = 0), 1200);
      setMood(taps >= 3 ? "surprised" : taps === 2 ? "love" : "happy", 1.6);
      gsap.fromTo(maya.root.scale, { x: 1.06, y: 0.93, z: 1.06 }, { x: 1, y: 1, z: 1, duration: 0.8, ease: "elastic.out(1.1, 0.4)" });
    };
    renderer.domElement.addEventListener("pointerdown", onTap);
    renderer.domElement.style.cursor = "pointer";

    // ---------- size
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      // keep Maya the same size on tall phones
      camera.position.z = w / h < 0.8 ? 6.4 / Math.max(0.55, (w / h) * 1.15) : 6.4;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // ---------- loop (only while visible)
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const timer = new THREE.Timer();
    let raf = 0;
    const tick = (ts?: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(ts);
      if (!visible) return;
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      const now = performance.now();
      if (mood !== "idle" && now > moodUntil) mood = "idle";

      // blink + small glances
      nextBlink -= dt;
      if (nextBlink <= 0) {
        blink = 1;
        nextBlink = 2.5 + Math.random() * 3;
      }
      blink = Math.max(0, blink - dt * 7);
      nextSaccade -= dt;
      if (nextSaccade <= 0) {
        saccade.x = (Math.random() - 0.5) * 18;
        saccade.y = (Math.random() - 0.5) * 8;
        nextSaccade = 1.2 + Math.random() * 2.5;
      }
      pointer.lerp(target, reduce ? 1 : 0.06);
      const p = progress?.current ?? 0;

      drawEyes(ctx, mood, t, { x: pointer.x * 14 + saccade.x * 0.5, y: pointer.y * 9 + saccade.y * 0.5 }, mood === "idle" ? Math.sin(Math.min(1, blink) * Math.PI) : 0);
      if (maya) {
        maya.screenTexture.needsUpdate = true;
        maya.head.rotation.y = pointer.x * 0.45;
        maya.head.rotation.x = pointer.y * 0.18;
        maya.head.rotation.z = Math.sin(t * 0.8) * (reduce ? 0 : 0.03);
      }
      yaw += (yawTarget - yaw) * (reduce ? 1 : 0.05);
      stage.rotation.y = -0.18 + pointer.x * 0.12 + yaw + p * Math.PI * 2;
      stage.position.y = 0.22 + (reduce ? 0 : Math.sin(t * 1.4) * 0.025);
      camera.position.y = 0.42 - p * 0.15;
      camera.lookAt(0, 0.45 - p * 0.1, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onTap);
      disposed = true;
      if (maya) {
        gsap.killTweensOf([maya.root.position, maya.root.scale, ...Object.values(maya.looks).map((g) => g.scale)]);
        maya.dispose();
      }
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, [progress]);

  useEffect(() => {
    api.current?.setLook(look);
  }, [look]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
