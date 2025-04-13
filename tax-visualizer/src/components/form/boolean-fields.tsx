import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { boxLabels } from "@/lib/common"

export const BooleanFields = ({ control }: { control: any }) => {
    const fields = [
        "box_13_statutary_employee",
        "box_13_retirement_plan",
        "box_13_third_part_sick_pay"
    ]

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {fields.map((name) => (
                <FormField
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                            <FormLabel>{boxLabels[name] ?? name}</FormLabel>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            ))}
        </div>
    )
}
