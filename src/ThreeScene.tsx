import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const cone = useRef<THREE.Mesh<THREE.ConeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const plane = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Initialize Three.js renderer
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.current.domElement);

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Create cone geometry and material
    const coneGeometry = new THREE.ConeGeometry(3, 5, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    cone.current = new THREE.Mesh(coneGeometry, coneMaterial);
    scene.add(cone.current);

    // Create plane geometry and material
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    plane.current = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.current.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
    scene.add(plane.current);

    // Position objects
    cone.current.position.set(0, 0, 0);
    plane.current.position.set(0, -2.5, 0); // Adjust plane position to intersect cone

    // Animation function
    const animate = () => {
      if (renderer.current) {
        renderer.current.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };

    animate();

    // Clean up Three.js objects on component unmount
    return () => {
      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default ThreeScene;
