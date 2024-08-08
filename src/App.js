import LoginPage from "./views/LoginPage";
import PostPageAdd from "./views/AddSong";
import PostDetailsPage from "./views/Details";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import PostPageHome from "./views/HomePage";
import SignUpPage from "./views/SignUp";

function App() {
  const router = createBrowserRouter([
    {path:"/", element:<PostPageHome/>},
    {path:"/login",element:<LoginPage/>},
    {path:"/signup",element:<SignUpPage/>},
    {path:"/add",element:<PostPageAdd/>},
    {path:"/post/:id",element:<PostDetailsPage/>},
  ]);
  return (
  <RouterProvider router={router}/>
  );
}

export default App;
