import edit_icon from './assets/edit.png';
import delete_icon from './assets/delete.png';
// import back_arrow_icon from './assets/back-arrow.png';
import React, { useState, useEffect, useRef } from 'react';
import './ProjectDetailsPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../../api/ProjectApi';
import { createTodo, updateTodo, deleteTodoById } from '../../api/TodoApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createGist, getMarkdownContent } from '../../api/GistApi';

function ProjectDetailsPage() {
    const [currentProjectTitle,setCurrentProjectTitle] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [todoDescription, setTodoDescription] = useState('');
    const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
    const [showEditTodoPopup, setShowEditTodoPopup] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [projectDetails,setProjectDetails] = useState({});
    const [selectedTodoIndex, setSelectedTodoIndex] = useState(-1);
    const { id } = useParams(); 
    const projectTitleInputRef = useRef(null);
    const todoDescriptionInputRef = useRef(null);
    const navigate = useNavigate();
    const [showExportProjectPopup, setShowExportProjectPopup] = useState(false);
    const [gistHTMLLink,setGistHTMLLink] = useState('');
    const [noTodosMessage, setNoTodosMessage] = useState('');
 

  const handleEditProject = () => {
    setShowEditProjectPopup(true);
  };

  const handleEditTodo = (index) => {
    setSelectedTodoIndex(index);
    setTodoDescription(todos[index].description);
    setShowEditTodoPopup(true);
  };

  const handleUpdateProject = async () => {
    try {
        if(projectTitle!=='') {
            setCurrentProjectTitle(projectTitle);
            projectDetails.title = projectTitle;
            console.log(projectDetails);
            const response =  await updateProject(projectDetails);
            toast.success(response.statusMessage);
            fetchProjectDetails();
            setShowEditProjectPopup(false);
        } else {
            toast.error('Title cannot be empty!')
        }
    } catch(error) {
        console.error('Error updating project title:', error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== '') {
        const todo = {
            description: newTodo,
            project: {
                id: id
            }
        }
        const response = await createTodo(todo);
        toast.success(response.statusMessage)
        fetchProjectDetails();
        setNewTodo('');
    }
  };

  const handleDeleteTodo = async (index) => {
    try {
        const updatedTodos = [...todos];
        const response =  await deleteTodoById(updatedTodos[index].id);
        toast.success(response.statusMessage);
        fetchProjectDetails();
    } catch(error) {
        console.error('Error deleting todo:', error);
    }

  };

  const handleToggleTodo = async (index) => {
    try {
        const updatedTodos = [...todos];
        if(updatedTodos[index].status==='open') {
            updatedTodos[index].status = 'completed';
        } else {
            updatedTodos[index].status = 'open';
        }
        const response =  await updateTodo(updatedTodos[index]);
        toast.success(response.statusMessage);
        fetchProjectDetails();
        setShowEditTodoPopup(false);
    } catch(error) {
        console.error('Error updating todo description:', error);
    }
  };

  const handleUpdateTodoDescription = async () => {
        try {
            if(todoDescription!=='') {
                const updatedTodos = [...todos];
                updatedTodos[selectedTodoIndex].description = todoDescription;
                const response =  await updateTodo(updatedTodos[selectedTodoIndex]);
                toast.success(response.statusMessage);
                fetchProjectDetails();
                setShowEditTodoPopup(false);
            } else {
                toast.error('Description cannot be empty!')
            }
        } catch(error) {
            console.error('Error updating todo description:', error);
        }
  }

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

  const fetchProjectDetails = async () => {
    try {
        const data = await getProjectById(id); 
        setProjectDetails(data);
        setProjectTitle(data.title);
        setCurrentProjectTitle(projectTitle);
        data.todos.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return -1;
            }
            if (a.createdAt > b.createdAt) {
              return 1;
            }
            return 0;
          });
        setTodos(data.todos);
        setNoTodosMessage("Create some Todos for your Project.");
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
  }

  useEffect(() => {
    fetchProjectDetails();
    if (showEditProjectPopup) {
        projectTitleInputRef.current.focus();
      }
    if (showEditTodoPopup) {
        todoDescriptionInputRef.current.focus();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditProjectPopup,showEditTodoPopup]);

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleExportProject = async () => {
    try {
        const response = await createGist(projectDetails);
        setGistHTMLLink(response.html_url)
        setShowExportProjectPopup(true);
        // console.log(response);
    } catch(error) {
        console.error('Error creating Gist:', error);
    }
  }

  const downloadMarkdownFile = async () => {
    try {
        const markdownContent = await getMarkdownContent(projectDetails.id);

        const blob = new Blob([markdownContent], { type: 'text/markdown' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle}.md`; 
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading markdown file:', error);
    }
};


  return (
    <div className='container-project'>
        <div><button className='back-btn' onClick={handleGoBack}>Go back</button></div>
      <div className='header-project'>
        <div className='text-project'>{projectTitle}</div>
        <button className='edit-project-btn' onClick={handleEditProject}>Edit Project</button>
        <button className='export-project-btn' onClick={handleExportProject}>Export Project as Gist</button>
      </div>
      <hr />
      <div className='todos-container'>
        <div className='subheading'>{todos.length > 0 ? `${todos.filter(todo => todo.status==='completed').length}/${todos.length} completed` : ''}</div>
        <div className='add-todo'>
            <input type='text' placeholder='Add new Todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <button title="Add Todo" className="add-todo-btn" onClick={handleAddTodo}>+</button>
        </div>
        { todos.length > 0 ? 
            <div className='todo-list'>
            {todos.map((todo, index) => (
            <div key={index} className='todo-item'>
                <input type='checkbox' checked={todo.status==='completed'} onChange={() => handleToggleTodo(index)} />
                    <div className='todo-description'>{todo.description}<p className="created-date">Created on {formatDate(todo.createdAt)}</p></div>
                <button title="Edit Todo" className='edit-todo-btn' onClick={() => handleEditTodo(index)}><img src={edit_icon} alt=''/></button>
                <button title="Delete Todo" className='delete-todo-btn' onClick={() => handleDeleteTodo(index)}><img src={delete_icon} alt=''/></button>
            </div>
            ))}
        </div>
        :
        (<p className="no-todos-msg">{noTodosMessage}</p>)}
        
      </div>

      {showEditProjectPopup && (
        <div className="popup">
        <div className="popup-content">
          <span className="close-popup-btn" onClick={() => {setShowEditProjectPopup(false); setProjectTitle(currentProjectTitle);}}>&times;</span>
          <h2>Edit Project Title</h2>
          <input ref={projectTitleInputRef} type="text" placeholder="Enter Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
          <div className="popup-buttons">
            <button className="cancel-btn" onClick={() => {setShowEditProjectPopup(false); setProjectTitle(currentProjectTitle);}}>Cancel</button>
            <button className="create-btn" onClick={handleUpdateProject}>Update</button>
          </div>
        </div>
      </div>
      )}

        {showEditTodoPopup && (
            <div className="popup">
            <div className="popup-content">
              <span className="close-popup-btn" onClick={() => {setShowEditTodoPopup(false)}}>&times;</span>
              <h2>Edit Todo Description</h2>
              <input ref={todoDescriptionInputRef} type="text" placeholder="Enter Todo Description" value={todoDescription} onChange={(e) => setTodoDescription(e.target.value)} />
              <div className="popup-buttons">
                <button className="cancel-btn" onClick={() => {setShowEditTodoPopup(false);}}>Cancel</button>
                <button className="create-btn" onClick={handleUpdateTodoDescription}>Update</button>
              </div>
            </div>
          </div>
        )}

        {showExportProjectPopup && (
                <div className="export-popup">
                <div className="export-popup-content">
                    <span className="close-popup-btn" onClick={() => setShowExportProjectPopup(false)}>&times;</span>
                    <h2><a href={gistHTMLLink} target="_blank" rel="noopener noreferrer">Gist HTML Link</a></h2>
                    <div className="export-popup-buttons">
                        <button className="export-cancel-btn" onClick={() => {setShowExportProjectPopup(false);}}>Cancel</button>
                        <button className="export-download-btn" onClick={downloadMarkdownFile}>Download Markdown File</button>
                    </div>
                </div>
                </div>
            )}
    </div>
  );
}

export default ProjectDetailsPage;
