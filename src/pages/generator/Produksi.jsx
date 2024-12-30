import React, { useState } from "react";

const Produksi = () => {
  const [crew, setCrew] = useState([{ name: "", role: "" }]);
  const [days, setDays] = useState([{ crew: [], expenses: [], backups: [] }]);
  const [expenses, setExpenses] = useState([
    { amount: "", type: "", item: "" },
  ]);
  const [backups, setBackups] = useState([{ from: "", to: "" }]);

  const addCrew = (dayIdx) => setCrew([...crew, { name: "", role: "" }]);
  const addExpense = (dayIdx) =>
    setExpenses([...expenses, { amount: "", type: "", item: "" }]);
  const addBackup = (dayIdx) => setBackups([...backups, { from: "", to: "" }]);
  const addDay = () =>
    setDays([...days, { crew: [], expenses: [], backups: [] }]);

  const deleteDay = (dayIdx) => {
    setDays(days.filter((_, index) => index !== dayIdx));
  };

  return (
    <div className="grid grid-cols-2 gap-5 mt-20">
      {/* Pra Produksi */}
      <section className="bg-gray-100 relative p-5 rounded-lg">
        <h1 className="font-bold  text-xl mb-3">Pra Produksi</h1>
        <h2 className="font-bold">Crew</h2>
        {crew.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded flex-1"
            />
            <span>as</span>
            <select className="border p-2 rounded flex-1">
              <option>Foto</option>
              <option>Video</option>
              <option>Editor</option>
              <option>Drone</option>
              <option>Helper</option>
              <option>FPV</option>
              <option>Freelance</option>
              <option>Lighting</option>
              <option>Directer</option>
              <option>Art Prop</option>
              <option>Sound</option>
              <option>Logistik</option>
              <option>Man Loc</option>
              <option>BTS</option>
              <option>Ass Dir</option>
              <option>Tal Co</option>
              <option>Ass Cam</option>
              <option>DOP</option>
            </select>
            <button
              onClick={() => setCrew(crew.filter((_, index) => index !== idx))}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addCrew()}
        >
          +
        </button>

        <h2 className="font-bold mt-5">Expenses</h2>
        {expenses.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded flex-1"
            />
            <span>for</span>
            <select className="border p-2 rounded flex-1">
              <option>Sewa</option>
              <option>Akomodasi</option>
              <option>Transport</option>
              <option>Makan</option>
              <option>Snack</option>
            </select>
            <input
              type="text"
              placeholder="Item"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={() =>
                setExpenses(expenses.filter((_, index) => index !== idx))
              }
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addExpense(dayIdx)}
        >
          +
        </button>
        {/* Backup */}
        <h2 className="font-bold mt-5">Backup</h2>
        {backups.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="H1"
              className="border p-2 rounded flex-1"
            />
            <span>to</span>
            <input
              type="text"
              placeholder="HDD 1"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={() =>
                setBackups(backups.filter((_, index) => index !== idx))
              }
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addBackup(dayIdx)}
        >
          +
        </button>

        <div className="mt-5">
          <label>Total Expenses</label>
          <input
            type="text"
            placeholder="Rp. 0"
            className="border p-2 rounded w-full mt-1"
            disabled
          />
        </div>

        <div className="mt-5">
          <label>Note</label>
          <textarea
            placeholder="Add notes here"
            className="border p-2 rounded w-full mt-1"
          ></textarea>
        </div>
      </section>
      {/* Produksi */}
      {days.map((day, dayIdx) => (
        <section key={dayIdx} className="bg-gray-100 relative p-5 rounded-lg">
          <div className="w-full flex justify-between px-5 items-center">
            <h1 className="font-bold  text-xl mb-3">Day {dayIdx + 1}</h1>
            <button
              onClick={() => deleteDay(dayIdx)}
              className="text-red-500 font-bold mb-3"
            >
              Delete Day
            </button>
          </div>
          <h2 className="font-bold">Crew</h2>
          {day.crew.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded flex-1"
              />
              <span>as</span>
              <select className="border p-2 rounded flex-1">
                <option>Foto</option>
                <option>Video</option>
                <option>Editor</option>
                <option>Drone</option>
                <option>Helper</option>
                <option>FPV</option>
                <option>Freelance</option>
                <option>Lighting</option>
                <option>Directer</option>
                <option>Art Prop</option>
                <option>Sound</option>
                <option>Logistik</option>
                <option>Man Loc</option>
                <option>BTS</option>
                <option>Ass Dir</option>
                <option>Tal Co</option>
                <option>Ass Cam</option>
                <option>DOP</option>
              </select>
              <button
                onClick={() =>
                  setCrew(crew.filter((_, index) => index !== idx))
                }
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="text-blue-500 font-bold"
            onClick={() => addCrew(dayIdx)}
          >
            +
          </button>

          <h2 className="font-bold mt-5">Expenses</h2>
          {day.expenses.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-3">
              <input
                type="number"
                placeholder="Amount"
                className="border p-2 rounded flex-1"
              />
              <span>for</span>
              <select className="border p-2 rounded flex-1">
                <option>Sewa</option>
                <option>Akomodasi</option>
                <option>Transport</option>
                <option>Makan</option>
                <option>Snack</option>
              </select>
              <input
                type="text"
                placeholder="Item"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={() =>
                  setExpenses(expenses.filter((_, index) => index !== idx))
                }
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="text-blue-500 font-bold"
            onClick={() => addExpense(dayIdx)}
          >
            +
          </button>
          {/* Backup */}
          <h2 className="font-bold mt-5">Backup</h2>
          {day.backups.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="H1"
                className="border p-2 rounded flex-1"
              />
              <span>to</span>
              <input
                type="text"
                placeholder="HDD 1"
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={() =>
                  setBackups(backups.filter((_, index) => index !== idx))
                }
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="text-blue-500 font-bold"
            onClick={() => addBackup(dayIdx)}
          >
            +
          </button>

          <div className="mt-5">
            <label>Total Expenses</label>
            <input
              type="text"
              placeholder="Rp. 0"
              className="border p-2 rounded w-full mt-1"
              disabled
            />
          </div>

          <div className="mt-5">
            <label>Note</label>
            <textarea
              placeholder="Add notes here"
              className="border p-2 rounded w-full mt-1"
            ></textarea>
          </div>
        </section>
      ))}
      <button
        className="text-gray-400 border-gray-400 border-opacity-50 border-dashed border-4 font-bold p-10 rounded-lg"
        onClick={addDay}
      >
        Add Day
      </button>
      {/* Post Produksi */}
      <section className="bg-gray-100 relative p-5 rounded-lg">
        <h1 className="font-bold  text-xl mb-3">Post Produksi</h1>
        <h2 className="font-bold">Crew</h2>
        {crew.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded flex-1"
            />
            <span>as</span>
            <select className="border p-2 rounded flex-1">
              <option>Foto</option>
              <option>Video</option>
              <option>Editor</option>
              <option>Drone</option>
              <option>Helper</option>
              <option>FPV</option>
              <option>Freelance</option>
              <option>Lighting</option>
              <option>Directer</option>
              <option>Art Prop</option>
              <option>Sound</option>
              <option>Logistik</option>
              <option>Man Loc</option>
              <option>BTS</option>
              <option>Ass Dir</option>
              <option>Tal Co</option>
              <option>Ass Cam</option>
              <option>DOP</option>
            </select>
            <button
              onClick={() => setCrew(crew.filter((_, index) => index !== idx))}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addCrew()}
        >
          +
        </button>

        <h2 className="font-bold mt-5">Expenses</h2>
        {expenses.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded flex-1"
            />
            <span>for</span>
            <select className="border p-2 rounded flex-1">
              <option>Sewa</option>
              <option>Akomodasi</option>
              <option>Transport</option>
              <option>Makan</option>
              <option>Snack</option>
            </select>
            <input
              type="text"
              placeholder="Item"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={() =>
                setExpenses(expenses.filter((_, index) => index !== idx))
              }
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addExpense(dayIdx)}
        >
          +
        </button>
        {/* Backup */}
        <h2 className="font-bold mt-5">Backup</h2>
        {backups.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="H1"
              className="border p-2 rounded flex-1"
            />
            <span>to</span>
            <input
              type="text"
              placeholder="HDD 1"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={() =>
                setBackups(backups.filter((_, index) => index !== idx))
              }
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="text-blue-500 font-bold"
          // onClick={() => addBackup(dayIdx)}
        >
          +
        </button>

        <div className="mt-5">
          <label>Total Expenses</label>
          <input
            type="text"
            placeholder="Rp. 0"
            className="border p-2 rounded w-full mt-1"
            disabled
          />
        </div>

        <div className="mt-5">
          <label>Note</label>
          <textarea
            placeholder="Add notes here"
            className="border p-2 rounded w-full mt-1"
          ></textarea>
        </div>
      </section>
    </div>
  );
};

export default Produksi;
