import { TasksComponent } from "./components/Tasks/TasksComponent"
import { HttpClientProvider } from "./infra/HttpClientContext"

function App() {
  const baseURL = process.env.REACT_APP_API_URL ?? "http://localhost:3000/api/v1"
  return (
    <HttpClientProvider baseURL={baseURL}>
      <TasksComponent />
    </HttpClientProvider>
  )
}
export default App
