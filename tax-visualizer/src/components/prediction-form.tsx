import {useForm} from "react-hook-form"
import {useState} from "react"
import {Form} from "@/components/ui/form"
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"

import {IncomeFields} from "@/components/form/income-fields"
import {BooleanFields} from "@/components/form/boolean-fields"
import {StateFields} from "@/components/form/state-fields"
import {CategoricalFields} from "@/components/form/categorical-fields"
import {BadgeDollarSign, Info, MapPin, Settings} from "lucide-react";
import ClusterVisualizer from "@/components/plot/cluster-group";

const defaultValues = {
    box_1_wages: 50000, box_3_social_security_wages: 40000,
    box_4_social_security_tax_withheld: 2000, box_5_medicare_wages: 40000,
    box_6_medicare_wages_tax_withheld: 1000, box_7_social_security_tips: 0,
    box_8_allocated_tips: 0, box_10_dependent_care_benefits: 0,
    box_11_nonqualified_plans: 0, box_13_statutary_employee: false,
    box_13_retirement_plan: true, box_13_third_part_sick_pay: false,
    box_16_1_state_wages: 30000, box_17_1_state_income_tax: 1000,
    box_18_1_local_wages: 0, box_19_1_local_income_tax: 0,
    box_16_2_state_wages: 0, box_17_2_state_income_tax: 0,
    box_18_2_local_wages: 0, box_19_2_local_income_tax: 0,
    box_12a_code: "None", box_12b_code: "None",
    box_12c_code: "None", box_12d_code: "None",
    box_15_1_state: "CA", box_15_2_state: "None"
}

export default function PredictionForm() {
    const form = useForm({defaultValues})
    const [result, setResult] = useState<{ anomaly: boolean; probability: number } | null>(null)

    const onSubmit = async (values: any) => {
        const res = await fetch("http://localhost:8000/predict", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values)
        })
        const data = await res.json()
        setResult(data)
    }

    return (
        <Card className="max-w-6xl mx-auto">
            <CardHeader><CardTitle>🧾 Taxpayer Anomaly Predictor</CardTitle></CardHeader>
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
                                <p className="text-lg">Probability: <strong>{result.probability.toFixed(8)}</strong></p>
                                <p className={`text-xl font-bold ${result.anomaly ? "text-red-500" : "text-green-600"}`}>
                                    {result.anomaly ? "🔴 Anomaly Detected" : "🟢 Normal"}
                                </p>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
            <div className="mb-4">
                {result && (<ClusterVisualizer
                    userPoint={[result.PC1, result.PC2, result.PC3]}
                    cluster={result.cluster}
                />)}

            </div>
        </Card>
    )
}
