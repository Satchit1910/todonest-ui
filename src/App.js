import { createContext, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import LoginPage from './components/login/LoginPage';
import ProjectsPage from './components/projects/ProjectsPage';
import ProjectDetailsPage from './components/projectDetails/ProjectDetailsPage';
import ProtectedRoutes from "./ProtectedRoutes";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState({ loggedIn: false });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
        </Route>
      </Routes>
    </UserContext.Provider>
    // <ProjectDetailsPage/>
  )
};

export default App;
