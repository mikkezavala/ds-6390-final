import {useEffect, useState} from "react"
import * as d3 from "d3";
import {Canvas} from "@react-three/fiber"
import {OrbitControls, Html} from "@react-three/drei"
import {PredictionResponse, Props} from "@/types/common";


export default function ClusterVisualizer({userPoint, cluster}: Props) {
    const clusterColors = d3.schemeAccent;
    const [data, setData] = useState<PredictionResponse[]>([])

    useEffect(() => {
        fetch("/assets/cluster_points.json")
            .then((res) => res.json())
            .then(setData)
    }, [])


    return (
        <Canvas camera={{position: [0, 0, 10], fov: 60}}>
            <ambientLight intensity={1}/>
            <pointLight position={[10, 10, 10]}/>
            <OrbitControls/>

            {data.map((pt, idx) => (
                <mesh
                    key={idx}
                    position={[pt.PC1, pt.PC2, pt.PC3]}
                >
                    <sphereGeometry args={[0.07, 20, 20]}/>
                    <meshStandardMaterial color={clusterColors[pt.cluster]}/>
                </mesh>
            ))}
            <mesh position={userPoint}>
                <sphereGeometry args={[0.25, 16, 16]}/>
                <meshStandardMaterial color="red"/>
                <Html distanceFactor={8}>
                    <div className="bg-primary text-primary-foreground animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-70 w-full origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-4.5 text-md text-nowrap">
                        <span>Cluster {cluster}</span>
                    </div>
                </Html>
            </mesh>
        </Canvas>
    )
}
