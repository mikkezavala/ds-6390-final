import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionForm from "@/components/prediction-form";
import EmbeddingViewer from "@/components/plot/embedding";
import ClusterViewer3D from "@/components/plot/cluster-view";

export const metadata: Metadata = {
    title: "Taxpayer Anomaly Dashboard",
    description: "Explore predictions and insights about taxpayer anomalies"
};

export const Home = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">🧠 Taxpayer Anomaly Dashboard</h1>

            <Tabs defaultValue="predict" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="predict">🔮 Predict</TabsTrigger>
                    <TabsTrigger value="embeddings">🧬 Embeddings</TabsTrigger>
                    <TabsTrigger value="clusters">🧬 Clusters</TabsTrigger>
                </TabsList>

                <TabsContent value="predict">
                    <PredictionForm />
                </TabsContent>

                <TabsContent value="embeddings">
                    <EmbeddingViewer />
                </TabsContent>

                <TabsContent value="clusters">
                    <ClusterViewer3D />
                </TabsContent>
            </Tabs>
        </div>
    );
}
