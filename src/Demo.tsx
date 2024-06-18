import { Canvas, Camera ,useFrame,MeshProps, MeshStandardMaterialProps} from '@react-three/fiber'
import { useRef, useState } from 'react'


function Demo() {
  const boxRef = useRef<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const boxSpeed: number = 0.01;

  const handleDragging = (e: any, boxRef: any) => {
    if (!isDragging) {
      return
    }
    console.log(e);
    
    let movementX = e.movementX
    let movementY = e.movementY

    boxRef.current.rotation.x += boxSpeed*movementY;
    boxRef.current.rotation.y += boxSpeed*movementX;
  }

  return (
     
      <>
        <mesh 
         position={[0,0, -1]} ref={boxRef} onPointerDown={() => setIsDragging(true)} onPointerUp={() => setIsDragging(false)} onPointerMove={(e) =>handleDragging(e,boxRef)} > 
          {/* <boxGeometry args={[2, 1, 1]}    /> 
          <meshStandardMaterial color='hotpink' /> */}
          <coneGeometry args={[5, 5]}  />
          <meshStandardMaterial color='hotpink' lightMapIntensity={0.5}  />
        </mesh>
        
      </>
  )
}

export default Demo;