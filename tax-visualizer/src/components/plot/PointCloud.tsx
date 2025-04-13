import { useState } from "react";
import { Instances, Instance, Html } from "@react-three/drei";

export type MetadataEntry = {
    EITC_Eligible?: string;
    Income_Group?: string;
    AGI?: number;
    Wages?: number;
    Filing_Status?: string;
};

type PointCloudProps = {
    points: [number, number, number][];
    metadata: MetadataEntry[];
};

const colorMap: Record<string, string> = {
    "Low": "#1f77b4",
    "Mid-Low": "#2ca02c",
    "Mid-High": "#ff7f0e",
    "High": "#d62728",
    "Yes": "#9467bd",
    "No": "#8c564b"
};

export default function PointCloud({ points, metadata }: PointCloudProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    if (points.length === 0 || metadata.length === 0) return null;

    return (
        <>
            <Instances limit={10000}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial  />
                {points.map((pos, i) => (
                    <Instance
                        key={i}
                        position={pos}
                        color={colorMap[metadata[i]?.Income_Group || metadata[i]?.EITC_Eligible || "Low"]}
                        onPointerOver={() => setHovered(i)}
                        onPointerOut={() => setHovered(null)}
                    />
                ))}
            </Instances>
            {hovered !== null && (
                <Html position={points[hovered]} distanceFactor={6} style={{ pointerEvents: "none" }}>
                    <div className="bg-white text-black text-[0.25rem] p-1 rounded shadow max-w-[100px]">
                        <div><strong>Income:</strong> {metadata[hovered]?.Income_Group}</div>
                        <div><strong>EITC:</strong> {metadata[hovered]?.EITC_Eligible}</div>
                        <div><strong>Filing:</strong> {metadata[hovered]?.Filing_Status}</div>
                        <div><strong>AGI:</strong> ${metadata[hovered]?.AGI?.toLocaleString()}</div>
                        <div><strong>Wages:</strong> ${metadata[hovered]?.Wages?.toLocaleString()}</div>
                    </div>
                </Html>
            )}
        </>
    );
}
