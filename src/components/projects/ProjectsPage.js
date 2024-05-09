import React, { useState, useEffect, useContext } from 'react';
import './ProjectsPage.css'; // Import CSS file for styling
import { useNavigate, useLocation } from 'react-router-dom';
import { getProjectsByUser,createProject} from '../../api/ProjectApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../App';

const ProjectsPage = () => {
  // Mock projects data (replace with actual data)
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const userData = location.state && location.state.userData;
  const { setUser } = useContext(UserContext);

  // State for controlling the new project popup
  const [showPopup, setShowPopup] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();
  const [noProjectsMessage, setNoProjectsMessage] = useState('')

  // Function to handle creating a new project
  const handleCreateProject = async () => {
    try {
      if(newProjectName==='') {
        toast.error("Project Name cannot be empty!")
      }
      else {
        const newProject = {
          title: newProjectName,
          user: userData
        }
        const response = await createProject(newProject);
        toast.success(response.statusMessage)
        fetchProjects();
        setShowPopup(false);
        setNewProjectName('');
      }
    } catch(error) {
      console.error('Error occurred during project creation:', error);
    }
    
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjectsByUser(userData.id); 
      const formattedProjects = data.map(project => ({
        ...project,
        createdAt: formatDate(project.createdAt)
      }));
      setProjects(formattedProjects);
      setNoProjectsMessage("You have no projects, create one!");
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return `${formattedDate} at ${formattedTime}`;
};

  const openProject = (projectId) => {
    navigate(`/project/${projectId}`);
  }

  const handleSignOut = () => {
    setUser({ loggedIn: false });
  }

  return (
    <div className="container">
      <div className='logout-container'><button className='logout-btn' onClick={handleSignOut}>Log out</button></div>
      <div className="header">
        <div className="text">Your Projects</div>
        {/* <div className="underline"></div> */}
      </div>

      {/* New Project Button */}
      <button className="new-project-btn" onClick={() => setShowPopup(true)}>Create New Project</button>

      {/* Project List */}
      {projects.length > 0 ? 
        <ul className="project-list">
          {projects.map(project => (
            <li key={project.id} className="project-item">
              <div className="project-info">
                <h3 className="project-name">{project.title}</h3>
                <p className="created-date">Created on {project.createdAt}</p>
              </div>
              <button className="view-project-btn" onClick={() => openProject(project.id)}>View Project</button>
            </li>
          ))}
        </ul> :
        <p className="no-projects-msg">{noProjectsMessage}</p>
      }
      

      {/* New Project Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup-btn" onClick={() => setShowPopup(false)}>&times;</span>
            <h2>Create New Project</h2>
            <input type="text" placeholder="Enter Project Title" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={() => {setShowPopup(false); setNewProjectName(''); }}>Cancel</button>
              <button className="create-btn" onClick={handleCreateProject}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
