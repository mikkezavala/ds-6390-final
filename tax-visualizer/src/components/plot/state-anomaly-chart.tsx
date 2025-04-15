import {ResponsiveChord} from "@nivo/chord"

import {useEffect, useState} from "react"
import {TaxComponentProps} from "@/types/common";


export const StateAnomalyChart = ({data}: TaxComponentProps) => {
    const [matrix, setMatrix] = useState<number[][]>([])
    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        const stateCounts: Record<string, { anomaly: number; notAnomaly: number }> = {}
        data.forEach((row) => {
            const state = row.box_15_1_state || "Unknown"
            const isAnomaly = row.anomaly_consensus

            if (!stateCounts[state]) {
                stateCounts[state] = {anomaly: 0, notAnomaly: 0}
            }

            if (isAnomaly) {
                stateCounts[state].anomaly += 1
            } else {
                stateCounts[state].notAnomaly += 1
            }
        })

        const states = Object.keys(stateCounts)
        const labels = [...states, "Anomaly", "Not Anomaly"]
        const labelIndex = Object.fromEntries(labels.map((label, i) => [label, i]))

        const size = labels.length
        const matrix = Array.from({length: size}, () => Array(size).fill(0))

        states.forEach((state) => {
            const {anomaly, notAnomaly} = stateCounts[state]
            const s = labelIndex[state]
            const a = labelIndex["Anomaly"]
            const n = labelIndex["Not Anomaly"]

            matrix[s][a] = anomaly
            matrix[a][s] = anomaly

            matrix[s][n] = notAnomaly
            matrix[n][s] = notAnomaly
        })

        setLabels(labels)
        setMatrix(matrix)


    }, [data])

    return (
        <div className="w-full h-[700px]">
            <ResponsiveChord
                data={matrix}
                keys={labels}
                margin={{top: 90, right: 90, bottom: 90, left: 90}}
                padAngle={0.03}
                innerRadiusRatio={0.9}
                arcOpacity={1}
                arcBorderWidth={1}
                ribbonOpacity={0.7}
                ribbonBorderWidth={1}
                enableLabel={true}
                labelRotation={-90}
                labelOffset={12}
                labelTextColor={{from: "color", modifiers: [["darker", 1.4]]}}
                colors={{scheme: "paired"}}
                arcTooltip={({ arc: { label, value} }) => (
                    <div className="bg-white text-sm shadow px-3 py-2 rounded border border-gray-200">
                        <strong>{label}</strong>: {value} records
                    </div>
                )}
            />
        </div>
    )
}