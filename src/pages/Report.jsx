import React from "react";
const App = (setShowReportGenerator) => {
  const [selectedOption, setSelectedOption] = React.useState("design-motion");
  const [designInputs, setDesignInputs] = React.useState([""]);
  const [documentationInputs, setDocumentationInputs] = React.useState([
    { crews: [], expenses: [] },
  ]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted ${selectedOption} form`);
  };

  const addDesignInput = () => {
    setDesignInputs([...designInputs, ""]);
  };

  const addDocumentationInput = () => {
    setDocumentationInputs([
      ...documentationInputs,
      { crews: [], expenses: [] },
    ]);
  };

  const deleteDesignInput = (index) => {
    const newInputs = designInputs.filter((_, i) => i !== index);
    setDesignInputs(newInputs);
  };

  const deleteDocumentationInput = (index) => {
    const newInputs = documentationInputs.filter((_, i) => i !== index);
    setDocumentationInputs(newInputs);
  };

  const addCrewInput = (index) => {
    const newInputs = [...documentationInputs];
    newInputs[index].crews.push("");
    setDocumentationInputs(newInputs);
  };

  const addExpenseInput = (index) => {
    const newInputs = [...documentationInputs];
    newInputs[index].expenses.push("");
    setDocumentationInputs(newInputs);
  };

  const deleteCrewInput = (docIndex, crewIndex) => {
    const newInputs = [...documentationInputs];
    newInputs[docIndex].crews.splice(crewIndex, 1);
    setDocumentationInputs(newInputs);
  };

  const deleteExpenseInput = (docIndex, expenseIndex) => {
    const newInputs = [...documentationInputs];
    newInputs[docIndex].expenses.splice(expenseIndex, 1);
    setDocumentationInputs(newInputs);
  };

  return (
    <main className="h-screen w-full z-20 bg-light fixed ">
      <section className="h-20 w-full fixed top-0 flex items-center justify-between p-5">
        <div className="flex justify-around items-center">
          <button
            onClick={() => {
              setShowReportGenerator(false);
            }}
          >
            BACK
          </button>
          <p className="text-2xl font-bold">BA Generator</p>
        </div>
        <div className="">
          <select
            className="border rounded p-2"
            onChange={handleChange}
            value={selectedOption}
          >
            <option value="design-motion">Design/Motion</option>
            <option value="documentation-production">
              Documentation/Production
            </option>
          </select>
        </div>
      </section>
      <div className="mt-32 px-10">
        <form onSubmit={handleSubmit} className="flex gap-5 flex-wrap">
          {selectedOption === "design-motion" && (
            <>
              {designInputs.map((input, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Design Input ${index + 1}`}
                    className="border rounded p-2 mx-2 my-1 w-1/2 outline-none"
                    value={input}
                    onChange={(e) => {
                      const newInputs = [...designInputs];
                      newInputs[index] = e.target.value;
                      setDesignInputs(newInputs);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => deleteDesignInput(index)}
                    className="p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDesignInput}
                className="mt-2 rounded flex justify-center p-2 bg-gray-500 bg-opacity-20 w-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </>
          )}
          {selectedOption === "documentation-production" && (
            <>
              {documentationInputs.map((input, index) => (
                <main
                  key={index}
                  className="flex relative w-1/3 border rounded items-center"
                >
                  <div>
                    <p className=" -rotate-90">H-{index}</p>
                    <button
                      type="button"
                      onClick={() => deleteDocumentationInput(index)}
                      className="absolute left-1 top-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="black"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <section className="">
                    <div>
                      <p className="p-2">Crews</p>
                      {input.crews.map((crew, crewIndex) => (
                        <div key={crewIndex} className="flex items-center">
                          <input
                            type="text"
                            placeholder={`Crew ${crewIndex + 1}`}
                            className="border rounded p-2 mr-2"
                            value={crew}
                            onChange={(e) => {
                              const newInputs = [...documentationInputs];
                              newInputs[index].crews[crewIndex] =
                                e.target.value;
                              setDocumentationInputs(newInputs);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => deleteCrewInput(index, crewIndex)}
                            className="p-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addCrewInput(index)}
                        className="p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="black"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />{" "}
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="p-2">Expenses</p>

                      {input.expenses.map((expense, expenseIndex) => (
                        <div key={expenseIndex} className="flex items-center">
                          <input
                            type="text"
                            placeholder={`Expense ${expenseIndex + 1}`}
                            className="border rounded p-2 mr-2"
                            value={expense}
                            onChange={(e) => {
                              const newInputs = [...documentationInputs];
                              newInputs[index].expenses[expenseIndex] =
                                e.target.value;
                              setDocumentationInputs(newInputs);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              deleteExpenseInput(index, expenseIndex)
                            }
                            className="p-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addExpenseInput(index)}
                        className="p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="black"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />{" "}
                        </svg>
                      </button>
                    </div>
                  </section>
                </main>
              ))}
              <button
                type="button"
                onClick={addDocumentationInput}
                className="mt-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </button>
            </>
          )}
          <div className="fixed right-5 top-[4rem] w-80 h-[30rem] border rounded bg-slate-600">
            <label>
              <input
                className="border rounded p-2 m-1"
                type="text"
                placeholder="Backup"
              />
            </label>
            <label>
              <input
                className="border rounded p-2 m-1"
                type="text"
                placeholder="Kirim Invoice"
              />
            </label>
            <label>
              <input
                className="border rounded p-2 m-1"
                type="text"
                placeholder="DP"
              />
            </label>
            <label>
              <input
                className="border rounded p-2 m-1"
                type="text"
                placeholder="Pelunasan"
              />
            </label>
            <label>
              <input
                className="border rounded p-2 m-1"
                type="text"
                placeholder="Bonus"
              />
            </label>
            <p>Total Expense: </p>
          </div>
          <button
            type="submit"
            className="fixed bottom-3 right-3 mt-2 border rounded p-2 bg-gray-800 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};
export default App;
