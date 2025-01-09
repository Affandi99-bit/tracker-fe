import React, { useEffect, useState } from "react";
import Design from "./Design";
import Dokumentasi from "./Dokumentasi";
import Finance from "./Finance";
import Motion from "./Motion";
import BANavbar from "./BANavbar";
import Produksi from "./Produksi";

const Home = ({ setShowReportGenerator, pro }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(() => {
    console.timeLog();
  });

  return (
    <main className="bg-gray-300 absolute z-50 top-0 left-0 w-full">
      {/* Header */}
      <BANavbar
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        setShowReportGenerator={setShowReportGenerator}
      />
      <div className="p-5 ">
        {/* Form Sections */}
        {selectedOption === "Produksi" && <Produksi pro={pro} />}
        {selectedOption === "Dokumentasi" && <Dokumentasi />}
        {selectedOption === "Design" && <Design />}
        {selectedOption === "Motion" && <Motion />}
        {/* Right Section */}
        <Finance />
        {/* Submit Button */}
      </div>
    </main>
  );
};

export default Home;
