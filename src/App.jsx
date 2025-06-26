import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { Loader, Navbar, CreateModal, Toast, Dashboard, } from "./components";
import { MainTable, Readonly, Login } from "./pages";
import axios from "axios";
import { ToastProvider } from './components/ToastContext';

const ReadonlyWrapper = ({ data }) => {
  const { id } = useParams();
  const found = data.filter(d => d._id === id);
  if (!found.length) return <Loader />
  // <div className='flex flex-col items-center justify-center h-screen '>
  //   <div class="absolute top-0 -z-10 h-full w-full bg-white"><div class="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px] animate-bounce"></div></div>
  //   <p className='text-9xl font-bold text-dark'>404</p>
  //   <p className='text-md font-bold text-dark'>Oops, pages not found !!</p>
  // </div>;
  return <Readonly data={found} />;
};

const MainApp = () => {
  const [tableData, setTableData] = useState([]);
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
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const showToast = (msg) => {
    setMessage(msg);
    setToastVisible(true);
  };

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
      } else {
        localStorage.removeItem("loginTime");
      }
    }
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://tracker-be-omega.vercel.app/api/report/getallprojects`
        // tracker-be-omega.vercel.app
      );
      setTableData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
      alert("Failed to fetch datas.");
    }
  };

  const addNewData = async (newData) => {
    try {
      const response = await axios.post(
        "https://tracker-be-omega.vercel.app/api/report/create",
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
        `https://tracker-be-omega.vercel.app/api/report/update/${updatedData._id}`,
        updatedData
      );
      setIsLoading(true);
      setTableData((prev) =>
        prev.map((item) =>
          item._id === updatedData._id ? { ...item, ...updatedData } : item
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(
        `https://tracker-be-omega.vercel.app/api/report/delete/${id}`
      );
      setIsLoading(true);
      setTableData((prev) => prev.filter((item) => item._id !== id));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleFormSubmit = () => {
    fetchProjects();
  };
  const handleArchiveToggle = () => {
    setShowHidden((prev) => !prev);
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
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  return (
    <ToastProvider>
      <div className={theme === "dark" ? "bg-dark text-light min-h-screen" : "bg-light text-dark min-h-screen"}>
        <Routes>
          <Route
            path="/readonly/:id"
            element={<ReadonlyWrapper data={tableData} />}
          />
          {!isLoggedIn ? (
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          ) : (
            <Route
              path="/"
              element={
                <div>
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
                  <Dashboard preview={tableData} />
                  <MainTable
                    tableData={tableData}
                    searchQuery={searchQuery}
                    selectedTags={selectedTags}
                    isSortedDesc={isSortedDesc}
                    setSortedData={setSortedData}
                    showHidden={showHidden}
                    updateData={updateData}
                    deleteData={deleteData}
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
