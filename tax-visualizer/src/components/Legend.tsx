// Legend.tsx
import { Badge } from "@/components/ui/badge"

const colorMap = {
    "Low": "#1f77b4",
    "Mid-Low": "#2ca02c",
    "Mid-High": "#ff7f0e",
    "High": "#d62728",
    "Yes": "#9467bd",
    "No": "#8c564b"
};

export default function Legend() {
    return (
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow space-y-2 z-10">
            <h4 className="font-semibold text-sm">Income Group</h4>
            <div className="flex gap-2 flex-wrap">
                <Badge style={{ backgroundColor: colorMap["Low"] }}>Low</Badge>
                <Badge style={{ backgroundColor: colorMap["Mid-Low"] }}>Mid-Low</Badge>
                <Badge style={{ backgroundColor: colorMap["Mid-High"] }}>Mid-High</Badge>
                <Badge style={{ backgroundColor: colorMap["High"] }}>High</Badge>
            </div>
            <h4 className="font-semibold text-sm mt-2">EITC Eligible</h4>
            <div className="flex gap-2">
                <Badge style={{ backgroundColor: colorMap["Yes"] }}>Yes</Badge>
                <Badge style={{ backgroundColor: colorMap["No"] }}>No</Badge>
            </div>
        </div>
    );
}
