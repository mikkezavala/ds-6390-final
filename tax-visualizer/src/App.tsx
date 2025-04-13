import { ThemeProvider } from "@/provider/theme-provider"
import {Home} from "@/components/pages/Home";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Home />
        </ThemeProvider>
    )
}

export default App
