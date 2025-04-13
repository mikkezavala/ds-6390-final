"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

interface MetadataRow {
    [key: string]: string | number | boolean;
}

export default function EmbeddingViewer() {
    const [points, setPoints] = useState<THREE.Vector3[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [hovered, setHovered] = useState<number | null>(null);
    const [metadata, setMetadata] = useState<MetadataRow[]>([]);
    const [colorField, setColorField] = useState("anomaly_consensus");
    const [labelField, setLabelField] = useState("cluster");
    const [colorOptions, setColorOptions] = useState<string[]>([]);

    // Utility: Color palette for numeric fields
    const getColorScale = (val: number, min: number, max: number): string => {
        const ratio = (val - min) / (max - min || 1);
        const hue = (1 - ratio) * 240; // blue to red
        return `hsl(${hue}, 70%, 75%)`;
    };

    useEffect(() => {
        const fetchData = async () => {
            const [embeddingRes, metadataRes] = await Promise.all([
                fetch("/tax_embeddings.tsv"),
                fetch("/tax_metadata.tsv"),
            ]);

            const embeddingText = await embeddingRes.text();
            const metadataText = await metadataRes.text();

            const pts = embeddingText
                .trim()
                .split("\n")
                .map((line) => {
                    const [x, y, z] = line.trim().split("\t").map(Number);
                    return new THREE.Vector3(x, y, z);
                });

            const [headerLine, ...rows] = metadataText.trim().split("\n");
            const headers = headerLine.split("\t");

            const meta: MetadataRow[] = rows.map((line) => {
                const values = line.split("\t");
                return Object.fromEntries(
                    headers.map((h, i) => {
                        const v = values[i];
                        if (v === "True" || v === "False") return [h, v === "True"];
                        const num = Number(v);
                        return [h, isNaN(num) ? v : num];
                    })
                );
            });

            setMetadata(meta);
            setPoints(pts);

            // Auto-detect boolean/numeric fields for coloring
            const bools = headers.filter((h) => typeof meta[0]?.[h] === "boolean");
            const nums = headers.filter(
                (h) => typeof meta[0]?.[h] === "number" && h !== "box_2_federal_tax_withheld"
            );
            setColorOptions([...bools, ...nums]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!metadata.length) return;

        const example = metadata[0];
        const isBoolean = typeof example[colorField] === "boolean";

        let colorArr: string[] = [];
        if (isBoolean) {
            colorArr = metadata.map((d) =>
                d[colorField] ? "#e11d48" : "#2563eb"
            );
        } else {
            const vals = metadata.map((d) => Number(d[colorField]));
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            colorArr = vals.map((v) => getColorScale(v, min, max));
        }

        setColors(colorArr);
    }, [metadata, colorField]);

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">🧬 Embedding Projector</h2>

            <div className="flex gap-4">
                <div>
                    <Label>Color By</Label>
                    <Select value={colorField} onValueChange={setColorField}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Color field" />
                        </SelectTrigger>
                        <SelectContent>
                            {colorOptions.map((f) => (
                                <SelectItem key={f} value={f}>
                                    {f}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Tooltip Label</Label>
                    <Select value={labelField} onValueChange={setLabelField}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Tooltip field" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(metadata[0] || {}).map((f) => (
                                <SelectItem key={f} value={f}>
                                    {f}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="w-full">
                <CardContent className="p-2">
                    <div className="h-[80vh] w-full">
                        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <OrbitControls />

                            {points.map((pos, idx) => (
                                <mesh
                                    key={idx}
                                    position={pos.toArray()}
                                    onPointerOver={() => setHovered(idx)}
                                    onPointerOut={() => setHovered(null)}
                                >
                                    <sphereGeometry args={[0.03, 12, 12]} />
                                    <meshStandardMaterial color={colors[idx]} />
                                    {hovered === idx && (
                                        <Html distanceFactor={10} center>
                                            <div className="bg-white p-2 rounded shadow text-xs max-w-[200px]">
                                                <p className="font-bold">
                                                    {labelField}: {String(metadata[idx]?.[labelField])}
                                                </p>
                                                <p>Cluster: {metadata[idx]?.["cluster"]}</p>
                                                <p>
                                                    Wages: $
                                                    {metadata[idx]?.["box_1_wages"]?.toLocaleString()}
                                                </p>
                                                <p>
                                                    Withheld: $
                                                    {metadata[idx]?.["box_2_federal_tax_withheld"]?.toLocaleString()}
                                                </p>
                                            </div>
                                        </Html>
                                    )}
                                </mesh>
                            ))}
                        </Canvas>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
