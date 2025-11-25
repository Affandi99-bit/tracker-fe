import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader, Navbar, CreateModal, Toast, FullscreenButton, Maintenance } from "./components";
import { MainTable, Readonly, Login, SOP, Bonus, Invoice, Quotation, Kanban, Report } from "./pages";
import axios from "axios";
import { usePrivilege } from "./hook";
import { ToastProvider } from './components/micro-components/ToastContext';

const apiUrl = "https://tracker-be-omega.vercel.app/api/report";
// const apiUrl = "http://localhost:5000/api/report"

const ReadonlyWrapper = ({ data }) => {
  const { id } = useParams();
  const found = data.filter(d => d._id === id);
  if (!found.length) return <Loader />
  return <Readonly data={found} />;
};

const KanbanWrapper = ({ data, updateData }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to find in local data (for faster initial load)
        const found = data.find(d => d._id === id);
        if (found && found.day) {
          // If we have full data locally, use it
          setProject(found);
          setLoading(false);
          return;
        }
        // Otherwise fetch full project data from API
        const response = await axios.get(`${apiUrl}/getproject/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        // Fallback to local data if available
        const found = data.find(d => d._id === id);
        if (found) {
          setProject(found);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, data, apiUrl]);

  if (loading) return <Loader />;
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl mb-4">Error loading project</p>
          <p className="text-sm text-light/60">{error}</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <Kanban
      setKanban={() => { }}
      updateData={updateData}
      project={project}
      selectedTypes={project.type}
      onProjectUpdate={() => { }}
    />
  );
};

const ReportWrapper = ({ data, updateData }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to find in local data (for faster initial load)
        const found = data.find(d => d._id === id);
        if (found && found.day) {
          // If we have full data locally, use it
          setProject(found);
          setLoading(false);
          return;
        }
        // Otherwise fetch full project data from API
        const response = await axios.get(`${apiUrl}/getproject/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        // Fallback to local data if available
        const found = data.find(d => d._id === id);
        if (found) {
          setProject(found);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, data]);

  if (loading) return <Loader />;
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl mb-4">Error loading project</p>
          <p className="text-sm text-light/60">{error}</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <Report
      setShowReportGenerator={() => { }}
      pro={project}
      updateData={updateData}
    />
  );
};

const BonusWrapper = ({ data, updateData }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to find in local data (for faster initial load)
        const found = data.find(d => d._id === id);
        if (found && found.day) {
          // If we have full data locally, use it
          setProject(found);
          setLoading(false);
          return;
        }
        // Otherwise fetch full project data from API
        const response = await axios.get(`${apiUrl}/getproject/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        // Fallback to local data if available
        const found = data.find(d => d._id === id);
        if (found) {
          setProject(found);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, data, apiUrl]);

  if (loading) return <Loader />;
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl mb-4">Error loading project</p>
          <p className="text-sm text-light/60">{error}</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <Bonus
      setShowReportGenerator={() => { }}
      pro={project}
      updateData={updateData}
    />
  );
};

const InvoiceWrapper = ({ data, updateData }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to find in local data (for faster initial load)
        const found = data.find(d => d._id === id);
        if (found && found.day) {
          // If we have full data locally, use it
          setProject(found);
          setLoading(false);
          return;
        }
        // Otherwise fetch full project data from API
        const response = await axios.get(`${apiUrl}/getproject/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        // Fallback to local data if available
        const found = data.find(d => d._id === id);
        if (found) {
          setProject(found);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, data, apiUrl]);

  if (loading) return <Loader />;
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl mb-4">Error loading project</p>
          <p className="text-sm text-light/60">{error}</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  return <Invoice pro={project} updateData={updateData} />;
};

const QuotationWrapper = ({ data, updateData }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to find in local data (for faster initial load)
        const found = data.find(d => d._id === id);
        if (found && found.day) {
          // If we have full data locally, use it
          setProject(found);
          setLoading(false);
          return;
        }
        // Otherwise fetch full project data from API
        const response = await axios.get(`${apiUrl}/getproject/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        // Fallback to local data if available
        const found = data.find(d => d._id === id);
        if (found) {
          setProject(found);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, data, apiUrl]);

  if (loading) return <Loader />;
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl mb-4">Error loading project</p>
          <p className="text-sm text-light/60">{error}</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <div className="text-center">
          <p className="text-xl">Project not found</p>
        </div>
      </div>
    );
  }

  return <Quotation pro={project} updateData={updateData} />;
};

const MainApp = () => {
  const [tableData, setTableData] = useState([]);
  const [archivedData, setArchivedData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [isSortedDesc, setIsSortedDesc] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [archivedPage, setArchivedPage] = useState(1);
  const [hasMoreArchived, setHasMoreArchived] = useState(false);
  const [loadingArchived, setLoadingArchived] = useState(false);

  const showToast = (msg) => {
    setMessage(msg);
    setToastVisible(true);
  };
  const privilege = usePrivilege();

  useEffect(() => {
    if (privilege) {
      document.title = `Project Tracker | ${privilege.toUpperCase()}`;
    } else {
      document.title = "Project Tracker | Blackstudio.id";
    }
  }, [privilege]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = Date.now();
      const twoHours = 2 * 60 * 60 * 1000;
      if (currentTime - loginTime < twoHours) {
        setIsLoggedIn(true);
        // Restore privilege if user is still logged in
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        if (username && password) {
          // Privilege should already be in localStorage from Login.jsx
          // This ensures it persists across page refreshes
        }
      } else {
        localStorage.removeItem("loginTime");
        localStorage.removeItem("userPrivilege");
      }
    }
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${apiUrl}/getallprojects`
      );
      setTableData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
      alert("Failed to fetch datas.");
    }
  };

  const fetchArchivedProjects = async (page = 1, append = false) => {
    try {
      setLoadingArchived(true);
      const response = await axios.get(
        `${apiUrl}/getarchivedprojects?page=${page}`
      );
      if (append) {
        setArchivedData(prev => [...prev, ...response.data.projects]);
      } else {
        setArchivedData(response.data.projects);
      }
      setHasMoreArchived(response.data.pagination.hasMore);
      setArchivedPage(page);
      setLoadingArchived(false);
    } catch (error) {
      console.error("Error fetching archived projects:", error);
      setLoadingArchived(false);
      alert("Failed to fetch archived projects.");
    }
  };

  const loadMoreArchived = () => {
    fetchArchivedProjects(archivedPage + 1, true);
  };

  const addNewData = async (newData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/create`,
        newData
      );

      setIsLoading(true);
      setTableData((prev) => [...prev, response.data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding new project:", error);
      alert("Failed to add project.");
    }
  };

  const updateData = async (updatedData) => {
    try {
      await axios.put(
        `${apiUrl}/update/${updatedData._id}`,
        updatedData
      );
      setIsLoading(true);

      // Check current state - archived status is determined by done field
      const currentInOngoing = tableData.find(item => item._id === updatedData._id);
      const currentInArchived = archivedData.find(item => item._id === updatedData._id);
      const isNowArchived = updatedData.done === true;

      // Update the appropriate list
      if (isNowArchived) {
        // Project is now archived (done === true) - remove from ongoing, add to archived if showing
        setTableData((prev) => prev.filter((item) => item._id !== updatedData._id));
        if (showHidden && !currentInArchived) {
          // Add to archived list if we're showing archived
          setArchivedData((prev) => [...prev, updatedData]);
        }
      } else {
        // Project is now ongoing (done !== true) - remove from archived, add to ongoing
        setTableData((prev) => {
          const exists = prev.find(item => item._id === updatedData._id);
          if (exists) {
            return prev.map((item) =>
              item._id === updatedData._id ? { ...item, ...updatedData } : item
            );
          }
          return [...prev, updatedData];
        });
        setArchivedData((prev) => prev.filter((item) => item._id !== updatedData._id));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(
        `${apiUrl}/delete/${id}`
      );
      setIsLoading(true);
      setTableData((prev) => prev.filter((item) => item._id !== id));
      setArchivedData((prev) => prev.filter((item) => item._id !== id));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleFormSubmit = () => {
    fetchProjects();
  };
  const handleArchiveToggle = () => {
    const newValue = !showHidden;
    setShowHidden(newValue);
    if (newValue && archivedData.length === 0) {
      // First time showing archived, fetch first page
      fetchArchivedProjects(1, false);
    }
  };
  const handleSortToggle = () => {
    setIsSortedDesc((prev) => !prev);
  };
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("loginTime", Date.now());
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loginTime");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("userPrivilege");
  };

  return (
    <ToastProvider>
      <div>
        <Routes>
          <Route path="/readonly/:id" element={<ReadonlyWrapper data={tableData} />} />
          <Route path="/bonus/:id" element={<BonusWrapper data={tableData} updateData={updateData} />} />
          <Route path="/invoice/:id" element={<InvoiceWrapper data={tableData} updateData={updateData} />} />
          <Route path="/quotation/:id" element={<QuotationWrapper data={tableData} updateData={updateData} />} />
          <Route path="/kanban/:id" element={<KanbanWrapper data={tableData} updateData={updateData} />} />
          <Route path="/report/:id" element={<ReportWrapper data={tableData} updateData={updateData} />} />
          <Route path="/sop" element={<SOP />} />
          <Route path="/tv" element={
            <main className="bg-dark h-screen overflow-hidden">
              <FullscreenButton />
              <div className="fixed top-0 left-0 right-0 flex items-start justify-between w-full p-4">
                <img src='/PM.webp' alt="logo" className=" object-contain w-48" />
                <img src='/black.webp' alt="logo" className=" object-contain w-56 mr-10" />
              </div>

              <div id="tv-scroll" className="bg-dark h-full overflow-y-scroll">
                <MainTable
                  tableData={tableData}
                  setSortedData={setSortedData}
                  showHidden={[]}
                  searchQuery=""
                  selectedTags={[]}
                  isSortedDesc={true}
                  updateData={() => { }}
                  deleteData={() => { }}
                />
              </div>
            </main>
          }
          />
          {!isLoggedIn ? (
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          ) : (
            <Route
              path="/"
              element={
                isLoading ? <Loader /> : (
                  <div className="bg-dark min-h-screen text-light font-body">
                    <Toast message={message} show={toastVisible} onClose={() => setToastVisible(false)} />
                    <Navbar
                      onSearch={(query) => {
                        setSearchQuery(query);
                      }}
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                      onSort={handleSortToggle}
                      onArchive={handleArchiveToggle}
                      showHidden={showHidden}
                      onLogout={handleLogout}
                      showCreateModal={showCreateModal}
                      setShowCreateModal={setShowCreateModal}
                    />
                    <MainTable
                      tableData={tableData}
                      archivedData={archivedData}
                      searchQuery={searchQuery}
                      selectedTags={selectedTags}
                      isSortedDesc={isSortedDesc}
                      setSortedData={setSortedData}
                      showHidden={showHidden}
                      updateData={updateData}
                      deleteData={deleteData}
                      hasMoreArchived={hasMoreArchived}
                      loadingArchived={loadingArchived}
                      loadMoreArchived={loadMoreArchived}
                    />
                    <CreateModal
                      showModal={showCreateModal}
                      setShowModal={setShowCreateModal}
                      isEditing={!!editingData}
                      initialData={editingData}
                      addNewData={addNewData}
                      updateData={updateData}
                      deleteData={deleteData}
                      showHidden={showHidden}
                      showToast={showToast}
                      onSubmit={handleFormSubmit}
                    />
                  </div>
                )
              }
            />
          )}
        </Routes>
      </div>
    </ToastProvider>
  );
};

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}


// import React from "react";
// import { Maintenance } from "./components";

// const App = () => {
//   return (
//     <Maintenance />
//   )
// }

// export default App