import { BrowserRouter, Routes, Route } from "react-router-dom";
import SheetsPage from "./app/sheets/page";
import SchedulePage from "./app/schedule/page";
import HomePage from "./app/home/page";
import HelpPage from "./app/help/page";
import AssistantPage from "./app/assistant/page";
import ReportsPage from "./app/reports/page";
import AuthTest from "./app/auth-test";
import { Layout } from "./components/layout";

// Simplify the App component to be more similar to the previously working implementation
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="sheets" element={<SheetsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="/auth-test" element={<AuthTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;