import {Route, Routes} from "react-router-dom";
import EmbeddingViewer from "./components/plot/embedding";
import {MainLayout} from "@/components/main-layout";
import {Loader} from "lucide-react";
import {Suspense} from "react";
import ClusterViewer3D from "@/components/plot/cluster-view";
import PredictionForm from "./components/pages/prediction-form";
import {Home} from "@/components/pages/home";


function App() {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/prediction" element={<PredictionForm/>}/>
                    <Route path="/embeddings" element={<EmbeddingViewer/>}/>
                    <Route path="/cluster" element={<ClusterViewer3D/>}/>
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App
