import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import {boxLabels, US_STATE_CODES} from "@/lib/common";

export const CategoricalFields = ({ control }: { control: any }) => {
    const box12Codes = ["None", "D", "DD", "E", "G", "P"]


    const box12Fields = ["box_12a_code", "box_12b_code", "box_12c_code", "box_12d_code"]
    const box15Fields = ["box_15_1_state", "box_15_2_state"]

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {[...box12Fields, ...box15Fields].map((name) => {
                const options = box12Fields.includes(name) ? box12Codes : US_STATE_CODES
                return (
                    <FormField
                        key={name}
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{boxLabels[name] ?? name}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options.map((val) => (
                                            <SelectItem key={val} value={val}>{val}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                )
            })}
        </div>
    )
}
