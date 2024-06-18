import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function Cone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alpha, setAlpha] = useState<number>(Math.PI/4);
const [beta, setBeta] = useState<number>(0);
const [d, setD] = useState<number>(1);

  // const previousMousePosition = { x: 0, y: 0 };
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  // const cameraRotation = new THREE.Euler(0, 0, 0);
  const [cameraRotation, setCameraRotation] = useState(new THREE.Euler(0, 0, 0));
  const cameraPosition = useState(new THREE.Vector3(0, 0, 0));
  const cameraDistance = 5;
const r=3
  console.log(cameraRotation);
  

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! }); ;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.ConeGeometry(r*Math.sin(alpha),r*Math.cos(alpha),32,32,false,0,2*Math.PI);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cone1 = new THREE.Mesh(geometry, material);
    const cone2 = new THREE.Mesh(geometry, material);
    cone2.rotation.x=Math.PI;
    cone1.position.set(0,-r*Math.cos(alpha)/2,0);
    cone2.position.set(0,r*Math.cos(alpha)/2,0);
    scene.add(cone1);
    scene.add(cone2);

     // Create plane geometry and material
     const planeGeometry = new THREE.PlaneGeometry(7.2,7.2);
     const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide,opacity: 0.2, transparent: true });
     const plane = new THREE.Mesh(planeGeometry, planeMaterial);
     plane.rotation.x=beta
     plane.rotation.y = Math.PI / 4; // Rotate 
     

     scene.add(plane);

    // Add directional light from the right side
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(0.5, 0.5, 1).normalize();
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-0.5, -0.5, 1).normalize();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(directionalLight1, directionalLight2, ambientLight);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
//       console.log("x: " + camera.rotation.x);
//       console.log("y: " + camera.rotation.y);
// console.log("z: " + camera.rotation.z);
// console.log("isEuler: " + camera.rotation.isEuler);


    
      camera.rotation.x += cameraRotation.x;
      camera.rotation.y += cameraRotation.y;

      camera.position.applyEuler(cameraRotation);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // camera.position.x = cameraDistance * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
      // camera.position.y = cameraDistance * Math.sin(cameraRotation.y)
      // camera.position.z = cameraDistance * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
      // camera.lookAt(new THREE.Vector3(0, 0, 0));


      renderer.render(scene, camera);
    };

    animate();

    const handleMouseDown = (event: any) => {
      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('click', handleClick);
    };

    const handleMouseMove = (event: any) => {
      const deltaMove = {
        x: (event.clientX - previousMousePosition.x),
        y: (event.clientY - previousMousePosition.y)
      };

      cameraRotation.x =- deltaMove.y * 0.005;
      cameraRotation.y = -deltaMove.x * 0.005;
      

      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
const handleClick = () => {
  cameraRotation.x = 0;
  cameraRotation.y = 0;
}
    if(canvasRef.current){canvasRef.current.addEventListener('mousedown', handleMouseDown);}
    return () => {
      // Clean up
      renderer.dispose();
      scene.remove(cone1,cone2,plane);
      scene.remove(directionalLight1, directionalLight2);
      if(canvasRef.current){canvasRef.current.removeEventListener('mousedown', handleMouseDown);}
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [alpha,beta]);

  return <>
  <input type="range" min="0" max={Math.PI/2} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} step={0.01} />
  <input type="range" min="0" max={Math.PI/2} value={beta} onChange={(e) => setBeta(Number(e.target.value))} step={0.01} />
  <canvas ref={canvasRef}  /></>
 ;
}

export default Cone;
