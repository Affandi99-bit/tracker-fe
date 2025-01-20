import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { roles, expenses } from "../constant/constant";
const Report = ({ setShowReportGenerator, pro }) => {
  const [days, setDays] = useState([
    {
      crew: pro.crew,
      sewaExpenses: [],
      operationalExpenses: [],
      totalExpenses: 0,
    },
  ]);

  const addDay = () => {
    setDays([
      ...days,
      {
        id: Date.now(),
        crew: pro.crew,
        sewaExpenses: [],
        operationalExpenses: [],
        totalExpenses: 0,
      },
    ]);
  };
  const calculateTotalExpenses = (day) => {
    const sewaTotal = day.sewaExpenses.reduce(
      (total, expense) =>
        total + parseFloat(expense.price || 0) * (expense.quantity || 0),
      0
    );
    const operationalTotal = day.operationalExpenses.reduce(
      (total, expense) =>
        total + parseFloat(expense.price || 0) * (expense.quantity || 0),
      0
    );
    return sewaTotal + operationalTotal;
  };
  const handleAddExpense = (dayIndex, type) => {
    setDays((prevDays) => {
      return prevDays.map((day, index) => {
        if (index === dayIndex) {
          const newExpense = {
            name: "",
            price: "",
            quantity: "",
            ...(type === "operationalExpenses" && { category: "" }),
          };
          return {
            ...day,
            [type]: [...day[type], newExpense],
          };
        }
        return day;
      });
    });
  };
  const handleExpenseChange = (dayIndex, type, expenseIndex, field, value) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };
      const expenses = [...day[type]];
      expenses[expenseIndex][field] = value;
      day[type] = expenses;

      day.totalExpenses = calculateTotalExpenses(day);

      newDays[dayIndex] = day;
      return newDays;
    });
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
          <label className="font-medium">Paid Off</label>
          <input
            type="date"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>

        <div className="mt-2 px-5">
          <label className="font-medium">Total Expenses</label>
          <NumericFormat
            displayType="input"
            thousandSeparator
            prefix={"Rp. "}
            // value={}
            placeholder="Rp. 0"
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
            disabled
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Final Link</label>
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
      <div className="w-[75%] flex flex-col gap-5 mt-10 h-screen overflow-y-auto no-scrollbar">
        {/* Data per Day */}
        {days.map((day, dayIndex) => (
          <main key={day.id} className="w-full min-h-48 p-1 flex items-center">
            <div className="flex h-full w-full gap-1">
              {/* Crew section */}
              <section className="p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-1/3">
                <p contentEditable className="outline-none">{`Day ${
                  dayIndex + 1
                }`}</p>
                <p>Crew</p>
                {day.crew.map((item, index) => (
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
                      {roles.map((role) => (
                        <option
                          className="outline-none"
                          key={role.id}
                          value={role.name}
                        >
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </section>
              {/* Expenses section */}
              <section className="relative p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-2/3">
                <button
                  onClick={() =>
                    setDays((prevDays) =>
                      prevDays.filter((day) => day.id !== days[dayIndex].id)
                    )
                  }
                  className="absolute right-1 top-0"
                >
                  x
                </button>
                {/* Rent */}
                <p>Rent Expenses</p>
                {day.sewaExpenses.map((expense, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    <input
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      type="text"
                      placeholder="Item Name"
                      value={expense.name}
                      onChange={(e) => {
                        const updatedExpenses = [...day.sewaExpenses];
                        updatedExpenses[index].name = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].sewaExpenses = updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <NumericFormat
                      displayType="input"
                      thousandSeparator
                      prefix={"Rp. "}
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      placeholder="Prices"
                      value={expense.price}
                      onChange={(e) => {
                        handleExpenseChange(
                          dayIndex,
                          "sewaExpenses",
                          index,
                          "price",
                          e.target.value
                        );
                        const updatedExpenses = [...day.sewaExpenses];
                        updatedExpenses[index].price = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].sewaExpenses = updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <input
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      type="number"
                      placeholder="Qty"
                      value={expense.quantity}
                      onChange={(e) => {
                        handleExpenseChange(
                          dayIndex,
                          "sewaExpenses",
                          index,
                          "quantity",
                          e.target.value
                        );
                        const updatedExpenses = [...day.sewaExpenses];
                        updatedExpenses[index].quantity = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].sewaExpenses = updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <button
                      className="sf text-xs font-thin ml-5"
                      onClick={() => {
                        const updatedExpenses = [...day.sewaExpenses];
                        updatedExpenses.splice(index, 1);
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].sewaExpenses = updatedExpenses;
                          return newDays;
                        });
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    handleAddExpense(dayIndex, "sewaExpenses");
                  }}
                  className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
                >
                  Add
                </button>
                {/* Operational */}
                <p>Operational Expenses</p>
                {day.operationalExpenses.map((expense, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    <input
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      type="text"
                      placeholder="Item Name"
                      value={expense.name}
                      onChange={(e) => {
                        const updatedExpenses = [...day.operationalExpenses];
                        updatedExpenses[index].name = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].operationalExpenses =
                            updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <NumericFormat
                      displayType="input"
                      thousandSeparator
                      prefix={"Rp. "}
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      placeholder="Prices"
                      value={expense.price}
                      onChange={(e) => {
                        const updatedExpenses = [...day.operationalExpenses];
                        updatedExpenses[index].price = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].operationalExpenses =
                            updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <input
                      className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                      type="number"
                      placeholder="Qty"
                      value={expense.quantity}
                      onChange={(e) => {
                        const updatedExpenses = [...day.operationalExpenses];
                        updatedExpenses[index].quantity = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].operationalExpenses =
                            updatedExpenses;
                          return newDays;
                        });
                      }}
                    />
                    <select
                      value={expense.category}
                      onChange={(e) => {
                        const updatedExpenses = [...day.operationalExpenses];
                        updatedExpenses[index].category = e.target.value;
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].operationalExpenses =
                            updatedExpenses;
                          return newDays;
                        });
                      }}
                    >
                      <option value="">Categories</option>
                      <option value="Acomodation">Acomodation</option>
                      <option value="Transport">Transport</option>
                      <option value="Food">Food</option>
                      <option value="Snack">Snack</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      className="sf text-xs font-thin ml-5"
                      onClick={() => {
                        const updatedExpenses = [...day.operationalExpenses];
                        updatedExpenses.splice(index, 1);
                        setDays((prevDays) => {
                          const newDays = [...prevDays];
                          newDays[dayIndex].operationalExpenses =
                            updatedExpenses;
                          return newDays;
                        });
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    handleAddExpense(dayIndex, "operationalExpenses")
                  }
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
                    <NumericFormat
                      displayType="input"
                      thousandSeparator
                      prefix={"Rp. "}
                      value={day.totalExpenses}
                      readOnly
                      className="outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          </main>
        ))}
        <button
          className="w-20 m-1 text-light bg-dark flex justify-center sf text-xs font-thin"
          onClick={addDay}
        >
          Add Day
        </button>
      </div>
    </main>
  );
};

export default Report;
