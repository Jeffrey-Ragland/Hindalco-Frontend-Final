import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  OrbitControls,
  PresentationControls,
} from "@react-three/drei";
import { Vector3 } from "three";

const Model = ({ lastData, updatedLimitS1, updatedLimitS2 }) => {
  const group = useRef();

  const gltfPath = "./potline.glb"
  
  const {scene} = useGLTF(gltfPath);
  scene.scale.set(2,2,2);
 
  // const { scene } = useGLTF("./utmaps_curve.glb");
  // const { scene } = useGLTF("./utmapsDemokit02.glb");
//   const [cylinder001Color, setCylinder001Color] = useState("white");
//   const [cylinder002Color, setCylinder002Color] = useState("white");
  const [hoveredMesh, setHoveredMesh] = useState(null);

  // console.log("last data", lastData);

  // console.log('last sensor1 data', lastData.Sensor1);

  // console.log("updated limit in 3d file", updatedLimit);

//   useEffect(() => {
//     if (lastData && lastData.Sensor2 !== undefined) {
//       setCylinder001Color(lastData.Sensor2 >= updatedLimitS2 ? "red" : "white");
//     }
//     if (lastData && lastData.Sensor1 !== undefined) {
//       setCylinder002Color(lastData.Sensor1 >= updatedLimitS1 ? "red" : "white");
//     }
//   }, [lastData]);

  useFrame(() => {
    if (group.current) {
    //   group.current.rotation.y += 0.01;
    //   group.current.traverse((child) => {
    //     if (child.isMesh) {
    //       // if (child.name === "Cylinder001") {
    //       //   child.material.color.set(
    //       //     hoveredMesh === "Cylinder001" ? "red" : "white"
    //       //   );
    //       // } else if (child.name === "Cylinder002") {
    //       //   child.material.color.set(
    //       //     hoveredMesh === "Cylinder002" ? "blue" : "white"
    //       //   );
    //       // }
    //       if (child.name === "Cylinder001") {
    //         child.material.color.set(cylinder001Color);
    //       } else if (child.name === "Cylinder002") {
    //         child.material.color.set(cylinder002Color);
    //       }
    //     }
    //   });
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHoveredMesh(e.object.name);
    console.log(`Hovered over: ${e.object.name}`);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredMesh(null);
  };

  return (
    <primitive
      ref={group}
      object={scene}
      // srotation={[Math.PI, 0, 0]}
      // {...props}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
};

const ThreeDModel = (
    // { lastData, updatedLimitS1, updatedLimitS2 }
) => {
  // console.log("data in three d file ", lastData);
  return (
    <Canvas 
        dpr={[1, 2]} 
        camera={{ fov: 15, position: [0, 0, 5], near: 0.1, far: 1000 }}
        
    >
      <ambientLight intensity={0.5} />

      <PresentationControls
        speed={1.5}
        global
        // polar={[-Math.PI / 4, Math.PI / 4]}
      >
        <Stage environment={"warehouse"}>
          <Model
            // lastData={lastData}
            // updatedLimitS1={updatedLimitS1}
            // updatedLimitS2={updatedLimitS2}
          />
        </Stage>
      </PresentationControls>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeDModel;
