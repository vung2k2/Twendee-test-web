import UsersList from "./components/UsersList";
import { UserProvider } from "./context/UserContext";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container mx-auto p-8">
              <UsersList />
            </div>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;
