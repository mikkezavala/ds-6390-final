import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {PredictionResponse, Props} from "@/types/common";


export default function ClusterVisualizer({ userPoint, cluster }: Props) {
    const [data, setData] = useState<PredictionResponse[]>([])

    useEffect(() => {
        fetch("/assets/cluster_points.json")
            .then((res) => res.json())
            .then(setData)
    }, [])

    const clusterColors = [
        "#2563eb", "#e11d48", "#059669", "#f59e0b", "#8b5cf6", "#0ea5e9"
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>🧭 Cluster Explorer</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
                <div className="h-[80vh] w-full">
                    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} />
                        <OrbitControls />

                        {data.map((pt, idx) => (
                            <mesh
                                key={idx}
                                position={[pt.PC1, pt.PC2, pt.PC3]}
                            >
                                <sphereGeometry args={[0.03, 12, 12]} />
                                <meshStandardMaterial color={clusterColors[pt.cluster % clusterColors.length]} />
                            </mesh>
                        ))}

                        {/* User point */}
                        <mesh position={userPoint}>
                            <sphereGeometry args={[0.06, 16, 16]} />
                            <meshStandardMaterial color="black" />
                            <Html distanceFactor={8}>
                                <div className="bg-white p-2 rounded shadow text-xs">
                                    <p className="font-bold">Your Input</p>
                                    <p className="text-muted">Cluster {cluster}</p>
                                </div>
                            </Html>
                        </mesh>
                    </Canvas>
                </div>
            </CardContent>
        </Card>
    )
}
