import React, { useEffect, useState } from "react";
import {
  Navbar,
  Finance,
  Produksi,
  Dokumentasi,
  Design,
  Motion,
} from "./components";

const App = () => {
  const [selectedOption, setSelectedOption] = useState("Produksi");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(()=>{console.timeLog()})

  return (
    <>
      {/* Header */}
      <Navbar
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
      />
      <div className="p-5 w-full bg-gray-300 min-h-screen">
        {/* Form Sections */}
        {selectedOption === "Produksi" && <Produksi />}
        {selectedOption === "Dokumentasi" && <Dokumentasi />}
        {selectedOption === "Design" && <Design />}
        {selectedOption === "Motion" && <Motion />}
        {/* Right Section */}
        <Finance />

        {/* Submit Button */}
      </div>
    </>
  );
};

export default App;
