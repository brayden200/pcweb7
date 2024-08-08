import LoginPage from "./views/LoginPage";
import AddSong from "./views/AddSong";
import SongDetails from "./views/Details";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import HomePage from "./views/HomePage";
import SignUpPage from "./views/SignUp";

function App() {
  const router = createBrowserRouter([
    {path:"/", element:<HomePage/>},
    {path:"/login",element:<LoginPage/>},
    {path:"/signup",element:<SignUpPage/>},
    {path:"/add",element:<AddSong/>},
    {path:"/song/:id",element:<SongDetails/>},
  ]);
  return (
  <RouterProvider router={router}/>
  );
}

export default App;
