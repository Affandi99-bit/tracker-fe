import React, { useState } from "react";
import { roles, expenses } from "../constant/constant";
const Report = ({ setShowReportGenerator, pro }) => {
  const [operationalExpenses, setOperationalExpenses] = useState([]);
  const [sewaExpenses, setSewaExpenses] = useState([]);

  const addSewaExpense = () => {
    const newExpense = {
      name: "",
      price: "",
      quantity: "",
      category: "",
    };
    setSewaExpenses([...sewaExpenses, newExpense]);
  };

  const addOperationalExpense = () => {
    const newExpense = {
      name: "",
      price: "",
      quantity: "",
      category: "",
    };
    setOperationalExpenses([...operationalExpenses, newExpense]);
  };
  return (
    <main className="fixed top-0 z-40 bg-light w-full h-screen flex flex-col items-start">
      {/* Navbar */}
      <nav className="fixed flex justify-between px-10 text-light sf text-sm tracking-wider items-center top-0 w-[75%] h-10 bg-dark">
        <button
          className="flex gap-1 items-center"
          onClick={() => {
            setShowReportGenerator(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.5}
            stroke="#e8e8e8"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          Back
        </button>
        <p>{pro.title}</p>
        <p>{pro.deadline}</p>
      </nav>
      {/* Aside */}
      <aside className="absolute top-0 right-0 w-1/4 h-full sf font-thin text-sm tracking-wider">
        <div className="flex w-full items-center px-5 gap-1">
          <div className="mt-2">
            <label className="font-medium">PM</label>
            <input
              type="text"
              value={pro.pm}
              className="border border-gray-400 p-2 w-full mt-1 outline-none"
              readOnly
            />
          </div>
          <div className="mt-2">
            <label className="font-medium">Client</label>
            <input
              type="text"
              value={pro.client}
              className="border border-gray-400 p-2 w-full mt-1 outline-none"
              readOnly
            />
          </div>
          <div className="mt-2">
            <label className="font-medium">PIC Client</label>
            <input
              type="text"
              value={pro.pic}
              className="border border-gray-400 p-2 w-full mt-1 outline-none"
              readOnly
            />
          </div>
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Invoice</label>
          <input
            type="date"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">DP</label>
          <input
            type="date"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Pelunasan</label>
          <input
            type="date"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>

        <div className="mt-2 px-5">
          <label className="font-medium">Jumlah Total Expenses</label>
          <input
            type="text"
            placeholder="Rp. 0"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
            disabled
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Link Final</label>
          <input
            type="url"
            value={pro.final_file}
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
            readOnly
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Note</label>
          <textarea
            placeholder="Note"
            value={pro.note}
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>
        <div className="text-right mt-5 px-5 flex items-center justify-between">
          <button className="border-dashed border border-gray-400 px-4 py-2">
            Export
          </button>
          <button className="border bg-dark text-light px-4 py-2">Save</button>
        </div>
      </aside>
      {/* Content */}
      <div className="w-[75%] flex ">
        <main className="w-full min-h-48 mt-20 ml-1 flex items-center gap-1">
          {/* Crew section */}
          <section className="p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-1/3">
            <p>Crew</p>
            {pro.crew.map((item, index) => {
              return (
                <div
                  className="flex items-center justify-between w-full"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    readOnly
                    className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  />
                  <p>as</p>
                  <select name="roles" id="">
                    {roles.map((role) => {
                      return (
                        <option
                          className="outline-none"
                          key={role.id}
                          value={role.name}
                        >
                          {role.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </section>
          {/* Expenses section */}
          <section className="relative p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-2/3">
            <button className="absolute right-1 top-0">x</button>
            <p>Pengeluaran Sewa</p>
            {sewaExpenses.map((expense, index) => (
              <div className="flex items-center gap-1" key={index}>
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="text"
                  placeholder="Nama Barang"
                  value={expense.name}
                  onChange={(e) => {
                    const updatedExpenses = [...sewaExpenses];
                    updatedExpenses[index].name = e.target.value;
                    setSewaExpenses(updatedExpenses);
                  }}
                />
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="number"
                  placeholder="Harga"
                  value={expense.price}
                  onChange={(e) => {
                    const updatedExpenses = [...sewaExpenses];
                    updatedExpenses[index].price = e.target.value;
                    setSewaExpenses(updatedExpenses);
                  }}
                />
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="number"
                  placeholder="Qty"
                  value={expense.quantity}
                  onChange={(e) => {
                    const updatedExpenses = [...sewaExpenses];
                    updatedExpenses[index].quantity = e.target.value;
                    setSewaExpenses(updatedExpenses);
                  }}
                />
                <button
                  className="sf text-xs font-thin ml-5"
                  onClick={() => {
                    const updatedExpenses = [...sewaExpenses];
                    updatedExpenses.splice(index, 1);
                    setSewaExpenses(updatedExpenses);
                  }}
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={addSewaExpense}
              className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
            >
              Add
            </button>
            <p>Pengeluaran Operasional</p>
            {operationalExpenses.map((expense, index) => (
              <div className="flex items-center gap-1" key={index}>
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="text"
                  placeholder="Nama Barang"
                  value={expense.name}
                  onChange={(e) => {
                    const updatedExpenses = [...operationalExpenses];
                    updatedExpenses[index].name = e.target.value;
                    setOperationalExpenses(updatedExpenses);
                  }}
                />
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="number"
                  placeholder="Harga"
                  value={expense.price}
                  onChange={(e) => {
                    const updatedExpenses = [...operationalExpenses];
                    updatedExpenses[index].price = e.target.value;
                    setOperationalExpenses(updatedExpenses);
                  }}
                />
                <input
                  className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                  type="number"
                  placeholder="Qty"
                  value={expense.quantity}
                  onChange={(e) => {
                    const updatedExpenses = [...operationalExpenses];
                    updatedExpenses[index].quantity = e.target.value;
                    setOperationalExpenses(updatedExpenses);
                  }}
                />
                <select
                  value={expense.category}
                  onChange={(e) => {
                    const updatedExpenses = [...operationalExpenses];
                    updatedExpenses[index].category = e.target.value;
                    setOperationalExpenses(updatedExpenses);
                  }}
                >
                  <option value="">Categories</option>
                  <option value="Akomodasi">Akomodasi</option>
                  <option value="Transport">Transport</option>
                  <option value="Makan">Makan</option>
                  <option value="Snack">Snack</option>
                  <option value="Lain">Lain</option>
                </select>
                <button
                  className="sf text-xs font-thin ml-5"
                  onClick={() => {
                    const updatedExpenses = [...operationalExpenses];
                    updatedExpenses.splice(index, 1);
                    setOperationalExpenses(updatedExpenses);
                  }}
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={addOperationalExpense}
              className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
            >
              Add
            </button>
            <div className="w-full flex items-center gap-1">
              <textarea
                placeholder="Note"
                className="h-full w-2/3 border border-gray-400 outline-none p-2"
              />
              <div className="w-1/3 h-full">
                <p className="bg-dark text-gray-400">Total Expenses</p>
                <p>Rp.0</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <button className="w-20 m-1 text-light bg-dark flex justify-center sf text-xs font-thin">
        Add
      </button>
    </main>
  );
};

export default Report;
