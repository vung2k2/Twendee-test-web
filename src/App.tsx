import UsersList from "./components/UsersList";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="container mx-auto p-8">
        <UsersList />
      </div>
    </UserProvider>
  );
};

export default App;
