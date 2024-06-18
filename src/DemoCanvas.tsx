import React from 'react';
import './App.css';
import Demo from './Demo';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls } from '@react-three/drei';
function DemoCanvas() {
    
  return (
    <div>
<Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ width: '100%', height: '50vh' }}>
  <DeviceOrientationControls/>
<ambientLight intensity={0.5}/>
      <spotLight intensity={1.0} position={[10, 15, 10]} angle={0.3}/>

  {/* <pointLight intensity={5} position={[10, 10, 10]} /> Position light from the right side */}


  <Demo/>
</Canvas>

    </div>
  );
}

export default DemoCanvas;