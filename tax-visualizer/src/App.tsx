import {Route, Routes} from "react-router-dom";
import {Home} from "@/components/pages/home";
import EmbeddingViewer from "./components/plot/embedding";
import {MainLayout} from "@/components/main-layout";
import {Loader} from "lucide-react";
import {Suspense} from "react";
import ClusterViewer3D from "@/components/plot/cluster-view";


function App() {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/embeddings" element={<EmbeddingViewer/>}/>
                    <Route path="/cluster" element={<ClusterViewer3D/>}/>
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App
