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
            const colorMap = d3.schemePaired;

            setPoints(data.map((d) => new THREE.Vector3(d.PC1, d.PC2, d.PC3)));
            setMetadata(data);
            setColors(
                data.map((d) =>
                    d.anomaly ? "#1de1bd" : colorMap[d.cluster]
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
                        <Canvas camera={{ position: [2, 0, 6], fov: 100 }}>
                            <ambientLight intensity={1} />
                            <pointLight position={[10, 10, 10]} />
                            <OrbitControls />

                            <Instances>
                                <sphereGeometry args={[0.075, 16, 16]} />
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
                                                <div className="bg-primary text-primary-foreground animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-70 w-full origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-4.5 text-md text-nowrap">
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
