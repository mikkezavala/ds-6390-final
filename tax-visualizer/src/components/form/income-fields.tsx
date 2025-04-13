import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {boxLabels} from "@/lib/common";

export const IncomeFields = ({ control }: { control: any }) => {
    const fields = [
        "box_1_wages",
        "box_3_social_security_wages",
        "box_4_social_security_tax_withheld",
        "box_5_medicare_wages",
        "box_6_medicare_wages_tax_withheld",
        "box_7_social_security_tips",
        "box_8_allocated_tips"
    ]

    return (
        <div className="grid md:grid-cols-3 gap-4">
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
