"use client";

import * as d3 from "d3";
import * as THREE from "three";
import { useEffect, useState, useMemo } from "react";
import { OrbitControls, Html, Instances, Instance } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import {Canvas} from "@react-three/fiber";
import {PredictionResponse} from "@/types/common";


export default function ClusterViewer3D() {
    const [points, setPoints] = useState<THREE.Vector3[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [hovered, setHovered] = useState<number | null>(null);
    const [metadata, setMetadata] = useState<PredictionResponse[]>([]);

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/assets/cluster_points.json");
            const data: PredictionResponse[] = await res.json();
            const colorMap = d3.schemeCategory10;

            setPoints(data.map((d) => new THREE.Vector3(d.PC1, d.PC2, d.PC3)));
            setMetadata(data);
            setColors(
                data.map((d) =>
                    d.anomaly ? "#e11d48" : colorMap[d.cluster % colorMap.length]
                )
            );
        };
        load();
    }, []);

    const instanceData = useMemo(() => {
        return points.map((pos, i) => ({
            position: pos,
            color: colors[i],
            meta: metadata[i],
        }));
    }, [points, colors, metadata]);

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">🚀 3D Cluster Viewer</h2>
            <Card className="w-full">
                <CardContent className="p-2">
                    <div className="h-[80vh] w-full">
                        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <OrbitControls />

                            <Instances limit={10000}>
                                <sphereGeometry args={[0.03, 12, 12]} />
                                <meshStandardMaterial />

                                {instanceData.map((d, i) => (
                                    <Instance
                                        key={i}
                                        position={d.position}
                                        color={d.color}
                                        onPointerOver={() => setHovered(i)}
                                        onPointerOut={() => setHovered(null)}
                                    >
                                        {hovered === i && (
                                            <Html distanceFactor={10} center>
                                                <div className="bg-white p-2 rounded shadow text-xs">
                                                    <p className="font-bold">
                                                        {d.meta.anomaly ? "Anomaly" : "Normal"}
                                                    </p>
                                                    <p>Cluster {d.meta.cluster}</p>
                                                    <p>x: {d.meta.PC1.toFixed(2)}</p>
                                                    <p>y: {d.meta.PC2.toFixed(2)}</p>
                                                    <p>z: {d.meta.PC3.toFixed(2)}</p>
                                                </div>
                                            </Html>
                                        )}
                                    </Instance>
                                ))}
                            </Instances>
                        </Canvas>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
