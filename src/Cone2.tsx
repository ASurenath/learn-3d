import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";

function Cone2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alpha, setAlpha] = useState<number>(Math.PI / 4);
  const [beta, setBeta] = useState<number>(0);
  const [d, setD] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
   // const previousMousePosition = { x: 0, y: 0 };
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  // const cameraRotation = new THREE.Euler(0, 0, 0);
  // const [cameraRotation, setCameraRotation] = useState<THREE.Euler>(
  //   new THREE.Euler(0, 0, Math.PI / 4)
  // );
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, 1));
  // const cameraPosition = useState(new THREE.Vector3(0, 0, 0));
  const cameraDistance = 8;
  const r = 3;
  console.log(cameraPosition);

  const biConeParametricFunction = function (u: number, v: number, target: THREE.Vector3 ,height:number,radius:number) {
    // Define parameters
    // const height = 2;  // Height of the bi-cone
    // const radius = 1;  // Radius of the bi-cone
    
    // Angle based on v parameter (0 to 2π)
    const angle = v * Math.PI * 2;
    
    // X coordinate based on the angle and u parameter (-1 to 1)
    const x = radius *( u-0.5)*2 * Math.cos(angle);
    
    // Y coordinate based on the angle and u parameter (-1 to 1)
    const z = radius * ( u-0.5)*2  * Math.sin(angle);
    
    // Z coordinate based on u parameter (-1 to 1)
    const y = height * ( u-0.5)*2 ;
    
    // Set the computed coordinates to the target Vector3
    target.set(x, y, z);
};

  // initialisations
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const geometry = new THREE.ConeGeometry(
      r * Math.sin(alpha),
      r * Math.cos(alpha),
      64,
      64,
      false,
      0,
      2 * Math.PI
    );
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 , side:THREE.DoubleSide, opacity: 0.7, transparent: true}); 
    const cone1 = new THREE.Mesh(geometry, material);
    const cone2 = new THREE.Mesh(geometry, material);
    cone2.rotation.x = Math.PI;
    cone1.position.set(0, (-r * Math.cos(alpha)) / 2, 0);
    cone2.position.set(0, (r * Math.cos(alpha)) / 2, 0);
    // scene.add(cone1);
    // scene.add(cone2);

    // Create plane geometry and material
    const planeGeometry = new THREE.PlaneGeometry(7.2, 7.2);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.y = Math.PI / 4; // Rotate
    plane.rotation.x = beta;

    plane.position.set(0, d*Math.sin(beta), d*Math.cos(beta));
    // plane.rotation.z=beta


    scene.add(plane);

    const geometry2= new ParametricGeometry((u:number,v:number,target:THREE.Vector3)=>biConeParametricFunction(u,v,target,r * Math.cos(alpha),
    r * Math.sin(alpha)), 64, 64);
const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cone3 = new THREE.Mesh( geometry2, material );
scene.add( cone3 );

    // Add directional light from the right side
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(0.5, 0.5, 1).normalize();
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-0.5, -0.5, 1).normalize();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(directionalLight1, directionalLight2, ambientLight);

    camera.position.z =cameraPosition.z*cameraDistance;
    camera.position.x=cameraPosition.x*cameraDistance
    camera.position.y=cameraPosition.y*cameraDistance
    // camera.rotation.x=cameraRotation.x
    // camera.rotation.y=cameraRotation.y
    // camera.position.applyEuler(cameraRotation);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);

    // const animate = function () {
    //   requestAnimationFrame(animate);
    //   camera.rotation.x += cameraRotation.x;
    //   camera.rotation.y += cameraRotation.y;
    //   camera.position.applyEuler(cameraRotation);
    //   camera.lookAt(new THREE.Vector3(0, 0, 0));
    //   renderer.render(scene, camera);
    // };

    // animate();




    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      // Clean up
      renderer.dispose();
      scene.remove(cone1, cone2, plane);
      scene.remove(directionalLight1, directionalLight2);
    };
  }, [alpha, beta, cameraPosition,d]);
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleMouseDown = (event: any) => {
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    setIsDragging(true);
  };
  
  const handleMouseMove = (event: any) => {
    if(isDragging){const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    // setCameraRotation((cameraRotation:THREE.Euler):THREE.Euler =>(new THREE.Euler(cameraRotation.x-deltaMove.y * 0.005, cameraRotation.y -deltaMove.x * 0.005, 0)))
    setCameraPosition((cameraPosition:THREE.Vector3):THREE.Vector3 =>(new THREE.Vector3(cameraPosition.x-deltaMove.x * 0.005, cameraPosition.y+deltaMove.y * 0.005, cameraPosition.z).normalize()))
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;}
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleClick = () => {
    // setCameraRotation(new THREE.Euler(0, 0, 0));
  };

  return (
    <>
      <input
        type="range"
        min="0"
        max={Math.PI / 2}
        value={alpha}
        onChange={(e) => setAlpha(Number(e.target.value))}
        step={0.01}
      />
      <input
        type="range"
        min="0"
        max={Math.PI}
        value={beta}
        onChange={(e) => setBeta(Number(e.target.value))}
        step={0.01}
      />
      <input type="range" min={-10} max={10} value={d} onChange={(e) => setD(Number(e.target.value))} step={0.01} />
      <canvas ref={canvasRef} onMouseDown={(e) => handleMouseDown(e)} onMouseMove={(e) => handleMouseMove(e)} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}  />
    </>
  );
}

export default Cone2;
