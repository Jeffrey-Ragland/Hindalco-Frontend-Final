import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  OrbitControls,
  PresentationControls,
} from "@react-three/drei";

const Model = ({ alertKeys, coordsUpdateFunc, meshNameFunc }) => {
  const group = useRef();

  const gltfPath = "./potline.glb";

  const { scene } = useGLTF(gltfPath);
  scene.scale.set(2, 2, 2);

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

  useEffect(() => {
    // Update the color for each mesh based on `alertKeys`
    const updatedColors = { ...meshColors };
    Object.keys(updatedColors).forEach((key) => {
      updatedColors[key] = alertKeys.includes(key) ? "red" : "blue";
    });
    setMeshColors(updatedColors);
  }, [alertKeys]);

  useFrame(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          // Map each mesh name to its color based on the updated `meshColors` state

          if (meshColorMap[child.name]) {
            child.material.color.set(meshColorMap[child.name]);
          }
        }
      });
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const meshName = e.object.name;

    const meshNameMap = {
      Circle: "T1",
      Circle001: "T2",
      Circle005: "T3",
      Circle004: "T4",
      Circle010: "T5",
      Circle007: "T6",
      Circle002: "T7",
      Circle006: "T8",
      Circle008: "T9",
      Circle009: "T10",
      Circle003: "T11",
      Circle012: "T12",
      Circle014: "T13",
      Circle013: "T14",
      Circle011: "T15",
    };

    // Check if the meshName exists in the map
    if (meshNameMap[meshName]) {
      coordsUpdateFunc([e.clientX, e.clientY]);
      meshNameFunc(meshNameMap[meshName]);
    }

    // if (meshName === "Circle") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T1");
    // } else if (meshName === "Circle001") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T2");
    // } else if (meshName === "Circle005") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T3");
    // } else if (meshName === "Circle004") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T4");
    // } else if (meshName === "Circle010") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T5");
    // } else if (meshName === "Circle007") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T6");
    // } else if (meshName === "Circle002") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T7");
    // } else if (meshName === "Circle006") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T8");
    // } else if (meshName === "Circle008") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T9");
    // } else if (meshName === "Circle009") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T10");
    // } else if (meshName === "Circle003") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T11");
    // } else if (meshName === "Circle012") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T12");
    // } else if (meshName === "Circle014") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T13");
    // } else if (meshName === "Circle013") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T14");
    // } else if (meshName === "Circle011") {
    //   coordsUpdateFunc([e.clientX, e.clientY]);
    //   meshNameFunc("T15");
    // }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    coordsUpdateFunc([0, 0]);
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

const ThreeDModel = ({ alertKeys, coordsUpdateFunc, meshNameFunc }) => {
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
            alertKeys={alertKeys}
            coordsUpdateFunc={coordsUpdateFunc}
            meshNameFunc={meshNameFunc}
          />
        </Stage>
      </PresentationControls>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeDModel;
