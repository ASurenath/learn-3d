import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function Cube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousMousePosition = { x: 0, y: 0 };
  const cubeRotation = { x: 0, y: 0 };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! }); ;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.ConeGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add directional light from the right side
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(0.5, 0.5, 1).normalize();
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-0.5, -0.5, 1).normalize();
    scene.add(directionalLight1, directionalLight2);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += cubeRotation.x;
      cube.rotation.y += cubeRotation.y;

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseDown = (event: any) => {
      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: any) => {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      cubeRotation.x = deltaMove.y * 0.01;
      cubeRotation.y = deltaMove.x * 0.01;

      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    if(canvasRef.current){canvasRef.current.addEventListener('mousedown', handleMouseDown);}

    return () => {
      // Clean up
      renderer.dispose();
      scene.remove(cube);
      scene.remove(directionalLight1, directionalLight2);
      if(canvasRef.current){canvasRef.current.removeEventListener('mousedown', handleMouseDown);}
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Cube;
