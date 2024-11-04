import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  OrbitControls,
  PresentationControls,
} from "@react-three/drei";

const Model = ({ alertKeys }) => {
  //   console.log("alert keys inside model", alertKeys);
  const group = useRef();

  const gltfPath = "./potline.glb";

  const { scene } = useGLTF(gltfPath);
  scene.scale.set(2, 2, 2);

  //   const [hoveredMesh, setHoveredMesh] = useState('');
  const [coords, setCoords] = useState([0, 0]);

  //   console.log('hovered mesh', hoveredMesh);

  const [meshColors, setMeshColors] = useState({
    T1: "white",
    T2: "white",
    T3: "white",
    T4: "white",
    T5: "white",
    T6: "white",
    T7: "white",
    T8: "white",
    T9: "white",
    T10: "white",
    T11: "white",
    T12: "white",
    T13: "white",
    T14: "white",
    T15: "white",
  });

  useEffect(() => {
    // Update the color for each mesh based on `alertKeys`
    const updatedColors = { ...meshColors };
    Object.keys(updatedColors).forEach((key) => {
      updatedColors[key] = alertKeys.includes(key) ? "red" : "white";
    });
    setMeshColors(updatedColors);
  }, [alertKeys]);

  useFrame(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          // Map each mesh name to its color based on the updated `meshColors` state
          const meshColorMap = {
            Circle: meshColors.T1,
            Circle001: meshColors.T2,
            Circle005: meshColors.T3,
            Circle004: meshColors.T4,
            Circle010: meshColors.T5,
            Circle007: meshColors.T6,
            Circle002: meshColors.T7,
            Circle006: meshColors.T8,
            Circle008: meshColors.T9,
            Circle009: meshColors.T10,
            Circle003: meshColors.T11,
            Circle012: meshColors.T12,
            Circle014: meshColors.T13,
            Circle013: meshColors.T14,
            Circle011: meshColors.T15,
          };

          if (meshColorMap[child.name]) {
            child.material.color.set(meshColorMap[child.name]);
          }
        }
      });
    }
  });

  //   const handlePointerOver = (e) => {
  //     e.stopPropagation();
  //     setHoveredMesh(e.object.name);
  //     // console.log(`Hovered over: ${e.object.name}`);
  //   };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const meshName = e.object.name;
    // setHoveredMesh(meshName);

    if (meshName === "Circle") {
      // Get the mouse pointer coordinates
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setCoords([mouseX, mouseY]);
      //   console.log(`Hovered over Circle at mouse coordinates: X: ${mouseX}, Y: ${mouseY}`);
    }
  };

  console.log("coords", coords);

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setCoords([0, 0]);
    // setHoveredMesh(null);
  };

  return (
    <>
      <primitive
        ref={group}
        object={scene}
        // srotation={[Math.PI, 0, 0]}
        // {...props}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </>
  );
};

const ThreeDModel = ({ alertKeys }) => {
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
          <Model alertKeys={alertKeys} />
        </Stage>
      </PresentationControls>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeDModel;
