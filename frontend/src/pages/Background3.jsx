import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // PARTICLES
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: "#4f46e5",
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 500;
      mouseY = (event.clientY - window.innerHeight / 2) / 500;
    });

    // ANIMATION LOOP
    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      particles.rotation.x += mouseY * 0.002;
      particles.rotation.y += mouseX * 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}