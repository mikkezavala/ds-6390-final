import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {boxLabels} from "@/lib/common";

export const StateFields = ({ control }: { control: any }) => {
    const fields = [
        "box_16_1_state_wages", "box_17_1_state_income_tax",
        "box_18_1_local_wages", "box_19_1_local_income_tax",
        "box_16_2_state_wages", "box_17_2_state_income_tax",
        "box_18_2_local_wages", "box_19_2_local_income_tax"
    ]

    return (
        <div className="grid md:grid-cols-4 gap-4">
            {fields.map((name) => (
                <FormField
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{boxLabels[name] ?? name}</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                    )}
                />
            ))}
        </div>
    )
}
