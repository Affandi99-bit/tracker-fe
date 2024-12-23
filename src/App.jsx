import { useState, useEffect } from "react";
import { Loader, Navbar, CreateModal } from "./components";
import { MainTable } from "./pages";
import axios from "axios";
import Login from "./pages/Login";

const App = () => {
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
  // const [projects, setProjects] = useState([]);

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

  return (
    <>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="bg-dark">
              <button
                onClick={() => setShowCreateModal(!showCreateModal)}
                className="fixed z-20 hover:rotate-90 right-3 bottom-0 md:bottom-3 size-[3rem] flex items-center justify-center bg-dark rounded-md transition ease-in-out hover:scale-105 duration-300 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className={`size-8 transition-all duration-300 ${
                    showCreateModal ? "rotate-45" : "rotate-180"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
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
              />
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
                onSubmit={handleFormSubmit}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;
