import {ResponsiveScatterPlot, ScatterPlotDatum} from "@nivo/scatterplot"
import {TaxComponentProps, TaxShape} from "@/types/common";


interface GroupedDatum extends ScatterPlotDatum{
    size: number;
    anomaly: boolean;
    cluster: number;
}

export const BubbleTaxScatter = ({ data }: TaxComponentProps) => {

    const grouped = data.reduce((acc: Record<number, GroupedDatum[]>, row: TaxShape) => {
        const cluster = row.cluster ?? 0
        if (!acc[cluster]) acc[cluster] = []
        acc[cluster].push({
            y: row.box_1_wages,
            x: row.box_2_federal_tax_withheld,
            size: row.box_7_social_security_tips || 1,
            anomaly: row.anomaly_consensus,
            cluster,
        })
        return acc
    }, {})

    const scatterData = Object.entries(grouped).map(([cluster, points]) => ({
        id: `Cluster ${cluster}`,
        data: points,
    }))

    return (
        <ResponsiveScatterPlot
            data={scatterData}
            margin={{ top: 60, right: 120, bottom: 70, left: 90 }}
            blendMode="multiply"
            axisBottom={{
                legend: "Box 1 Wages",
                legendPosition: "middle",
            }}
            axisLeft={{
                legend: "Box 2 Withheld",
                legendPosition: "middle",
            }}
            tooltip={({node}) => (
                <div className="text-sm">
                    <strong>${(node.data.x as number).toFixed(0)} wages</strong><br/>
                    ${(node?.data.y as number).toFixed(0)} withheld<br/>
                    {node.data?.anomaly ? "🔴 Anomaly" : "🟢 Normal"}
                </div>
            )}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 130,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 12,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
}