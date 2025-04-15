import {useForm} from "react-hook-form"
import {useState} from "react"
import {Form} from "../ui/form"
import {Card, CardHeader, CardTitle, CardContent} from "../ui/card"
import {Button} from "../ui/button"

import {IncomeFields} from "../form/income-fields"
import {BooleanFields} from "../form/boolean-fields"
import {StateFields} from "../form/state-fields"
import {CategoricalFields} from "../form/categorical-fields"
import {BadgeDollarSign, Info, MapPin, Settings} from "lucide-react";
import ClusterVisualizer from "../plot/cluster-group";
import {defaultValues} from "../../lib/common";
import {Prediction, PredictionResponseProb} from "@/types/common";


export default function PredictionForm() {
    const form = useForm({defaultValues})
    const [result, setResult] = useState<PredictionResponseProb | null>(null)

    const onSubmit = async (values: Prediction) => {
        const res = await fetch("http://localhost:8000/predict", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values)
        })
        const data = await res.json()
        setResult(data)
    }

    return (
        <div
            className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>🧾 Taxpayer Anomaly Predictor</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <BadgeDollarSign className="w-5 h-5"/>
                                    Income & Wages
                                </h3>
                                <IncomeFields control={form.control}/>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <Settings className="w-5 h-5"/>
                                    Box 13 Details
                                </h3>
                                <BooleanFields control={form.control}/>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5"/>
                                    State & Local
                                </h3>
                                <StateFields control={form.control}/>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                    <Info className="w-5 h-5"/>
                                    Retirement
                                </h3>
                                <CategoricalFields control={form.control}/>
                            </div>

                            <Button type="submit">Predict</Button>

                            {result && (
                                <div className="text-center mt-4">
                                    <p className="text-lg">Probability: <strong>{result.probability.toFixed(8)}</strong>
                                    </p>
                                    <p className={`text-xl font-bold ${result.anomaly ? "text-red-500" : "text-green-600"}`}>
                                        {result.anomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}
                                    </p>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>👨‍🔬Cluster Explorer</CardTitle>
                    </CardHeader>
                    <CardContent className="p-1">
                        <div className="h-[80vh] w-full">
                        <ClusterVisualizer
                            userPoint={[result.PC1, result.PC2, result.PC3]}
                            cluster={result.cluster}
                        />
                        </div>
                    </CardContent>
                </Card>)}
        </div>
    )
}
