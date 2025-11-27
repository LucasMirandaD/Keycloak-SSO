import {
  BrowserRouter,
  useRoutes
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const Public = () => {
    return useRoutes([
      { path: "/home", element: <Home /> },
      { path: "/", element: <Login /> }
    ]);
  };

  return (
    <BrowserRouter>
      <Public />
    </BrowserRouter>
  );
}

export default App;