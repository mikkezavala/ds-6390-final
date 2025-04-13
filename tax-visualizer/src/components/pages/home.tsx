import {Metadata} from "next";
import PredictionForm from "@/components/prediction-form";

export const metadata: Metadata = {
    title: "Taxpayer Anomaly Dashboard",
    description: "Explore predictions and insights about taxpayer anomalies"
};

export const Home = () => {
    return (
        <PredictionForm/>
    );
}
