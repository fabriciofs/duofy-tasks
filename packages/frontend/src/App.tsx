import { TasksComponent } from "./components/Tasks"
import { HttpClientProvider } from "./infra/HttpClientContext"

function App() {
  const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"
  return (
    <HttpClientProvider baseURL={baseURL}>
      <TasksComponent />
    </HttpClientProvider>
  )
}
export default App
