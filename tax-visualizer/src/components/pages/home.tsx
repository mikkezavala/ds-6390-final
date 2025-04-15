import {useTaxData} from "@/hooks/use-tax-data";
import {BubbleTaxScatter} from "@/components/plot/bubble-scatter";
import {StateAnomalyChart} from "../plot/state-anomaly-chart";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DendrogramTree} from "@/components/plot/dendrogram-tree";


export const Home = () => {
    const taxData = useTaxData()
    if (!taxData || taxData.length === 0) {
        return <Skeleton className="relative w-full h-[75vh] max-h-[80vh]"/>

    }
    return (
        <>
            <div
                className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                <Card className="@container/card">
                    <CardHeader>
                        <CardTitle>🧾 Wages vs Withheld</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full h-[75vh] max-h-[80vh]">
                            <BubbleTaxScatter data={taxData}/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardTitle>🧾 Anomaly in State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full h-[75vh] max-h-[80vh]">
                            <StateAnomalyChart data={taxData}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full">
                <Card className="@container/card">
                    <CardHeader>
                        <CardTitle>🧾 Anomaly in State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full h-[75vh] max-h-[80vh]">
                            <DendrogramTree data={taxData}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
