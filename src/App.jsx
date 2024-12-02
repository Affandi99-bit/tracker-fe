import { useState, useEffect, Suspense } from "react";
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
  const [refresh, setRefresh] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchProjects();
    console.log("Made with love by Imamaffandi");
  }, [refresh]);
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
      const response = await axios.get(
        "https://tracker-be-five.vercel.app/api/report/getAllProjects"
      );

      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const addNewData = async (newData) => {
    try {
      await axios.post(
        "https://tracker-be-five.vercel.app/api/report/create",
        newData
      );
      await fetchProjects();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };
  const updateData = async (updatedData) => {
    try {
      await axios.put(
        `https://tracker-be-five.vercel.app/api/report/update/${updatedData._id}`,
        updatedData
      );
      await fetchProjects();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  const deleteData = async (id) => {
    try {
      await axios.delete(
        `https://tracker-be-five.vercel.app/api/report/delete/${id}`
      );
      await fetchProjects();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleFormSubmit = () => {
    setRefresh((prev) => !prev);
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
    <Suspense fallback={<Loader />}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Navbar
            setShowCreateModal={setShowCreateModal}
            showCreateModal={showCreateModal}
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
            updateData={updateData}
            deleteData={deleteData}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            isSortedDesc={isSortedDesc}
            setSortedData={setSortedData}
            showHidden={showHidden}
          />
          <CreateModal
            showModal={showCreateModal}
            setShowModal={setShowCreateModal}
            addNewData={addNewData}
            updateData={updateData}
            deleteData={deleteData}
            showHidden={showHidden}
            isEditing={false}
            onSubmit={handleFormSubmit}
          />
        </>
      )}
    </Suspense>
  );
};

export default App;
