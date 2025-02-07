import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { roleProduction, roleGraphic } from "../constant/constant";

const Report = ({ setShowReportGenerator, pro: initialPro, updateData }) => {
  const [pro, setPro] = useState(initialPro);
  const [template, setTemplate] = useState();
  const [days, setDays] = useState(pro.day.map(day => ({
    id: Date.now(),
    crew: day.crew,
    expense: {
      sewaExpenses: [],
      operationalExpenses: [],
      orderList: [],
    },
    note: '',
    totalExpenses: 0,
  })));

  const addDay = () => {
    setDays([
      ...days,
      {
        id: Date.now(),
        crew: pro.day[days.length % pro.day.length].crew,
        expense: {
          sewaExpenses: [],
          operationalExpenses: [],
          orderList: [],
        },
        note: '',
        totalExpenses: 0,
      },
    ]);
  };

  const calculateTotalExpenses = (day) => {
    if (!day) return 0;
    const parseNumber = (value) =>
      isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    const sewaTotal = day.expense.sewaExpenses.reduce(
      (total, expense) =>
        total + parseNumber(expense.price) * (parseInt(expense.quantity) || 0),
      0
    );

    const operationalTotal = day.expense.operationalExpenses.reduce(
      (total, expense) =>
        total + parseNumber(expense.price) * (parseInt(expense.quantity) || 0),
      0
    );

    return sewaTotal + operationalTotal;
  };

  const handleAddExpense = (dayIndex, type) => {
    setDays((prevDays) =>
      prevDays.map((day, index) => {
        if (index === dayIndex) {
          const newExpense = {
            name: "",
            price: "",
            quantity: "",
            ...(type === "operationalExpenses" && { category: "" }),
          };
          return {
            ...day,
            expense: {
              ...day.expense,
              [type]: [...day.expense[type], newExpense],
            },
          };
        }
        return day;
      })
    );
  };

  const handleExpenseChange = (dayIndex, type, expenseIndex, field, value) => {
    setDays((prevDays) =>
      prevDays.map((day, index) => {
        if (index === dayIndex) {
          const updatedExpenses = day.expense[type].map((expense, idx) =>
            idx === expenseIndex ? { ...expense, [field]: value } : expense
          );
          const updatedExpense = { ...day.expense, [type]: updatedExpenses };
          return {
            ...day,
            expense: updatedExpense,
            totalExpenses: calculateTotalExpenses({ ...day, expense: updatedExpense }),
          };
        }
        return day;
      })
    );
  };

  const handleInputChange = (field, value) => {
    setPro((prevPro) => ({
      ...prevPro,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedPro = {
        ...pro,
        day: days.map(day => ({
          ...day,
          totalExpenses: calculateTotalExpenses(day)
        }))
      };

      await updateData(updatedPro);
      alert("Report saved successfully!");
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save report: ${error.message}`);
    }
  };

  return (
    <main className="fixed top-0 z-40 bg-light w-full h-screen flex flex-col items-start">
      {/* Navbar */}
      <nav className="fixed flex justify-between px-10 text-light sf text-sm tracking-wider items-center top-0 w-[75%] h-10 bg-dark">
        <button
          type="button"
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
        <p>{new Date(pro.deadline).toLocaleDateString("en-GB")}</p>
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
            value={pro.invoice}
            onChange={(e) => handleInputChange('invoice', e.target.value)}
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">DP</label>
          <input
            type="date"
            value={pro.dp}
            onChange={(e) => handleInputChange('dp', e.target.value)}
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>
        <div className="mt-2 px-5">
          <label className="font-medium">Paid Off</label>
          <input
            type="date"
            value={pro.lunas}
            onChange={(e) => handleInputChange('lunas', e.target.value)}
            className="border border-gray-400 p-2 w-full mt-1 outline-none"
          />
        </div>

        <div className="mt-2 px-5">
          <label className="font-medium">Total Expenses</label>

          <NumericFormat
            displayType="input"
            thousandSeparator
            prefix={"Rp. "}
            value={days.reduce((acc, day) => acc + day.totalExpenses, 0)}
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
          <button
            type="button"
            className="border-dashed border border-gray-400 px-4 py-2"
          >
            Export
          </button>
          <button type="submit" onClick={handleSubmit} className="border bg-dark text-light px-4 py-2">
            Save
          </button>
        </div>
        <p className="text-dark px-5 pt-3 sf italic font-thin text-xs">
          *Note: Please save before export
        </p>
      </aside>
      {/* Content */}
      <form onSubmit={handleSubmit} className="w-[75%] flex flex-col gap-5 mt-10 h-screen overflow-y-auto no-scrollbar">
        {/* Data per Day */}
        {days.map((day, dayIndex) => (
          <main key={day.id} className="w-full p-1 flex items-center">
            <div className="flex h-full w-full gap-1">
              {/* Crew section */}
              <section className="p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-1/3">
                <p className="outline-none">{`Day ${dayIndex + 1
                  }`}</p>
                <p className="sf text-xs font-thin tracking-widest pl-4">
                  Crew
                </p>
                {day.crew.map((item, index) => (
                  <div
                    className="flex items-center justify-start gap-2 w-full flex-wrap"
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
                    {(item.roles || []).map((role, roleIndex) => (
                      <div key={roleIndex} className="flex items-center">
                        {template ? (
                          <select
                            name="roleProduction"
                            value={role}
                            onChange={(e) => {
                              const updatedCrew = [...day.crew];
                              updatedCrew[index].roles[roleIndex] =
                                e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].crew = updatedCrew;
                                return newDays;
                              });
                            }}
                            className="w-14"
                          >
                            <option value="">Select</option>
                            {roleProduction.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            name="roleGraphic"
                            value={role}
                            onChange={(e) => {
                              const updatedCrew = [...day.crew];
                              updatedCrew[index].roles[roleIndex] =
                                e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].crew = updatedCrew;
                                return newDays;
                              });
                            }}
                            className="w-14"
                          >
                            <option value="">Select</option>
                            {roleGraphic.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                    <div className="flex flex-col p-0 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedCrew = [...day.crew];
                          if (!updatedCrew[index].roles) {
                            updatedCrew[index].roles = [];
                          }
                          updatedCrew[index].roles.push("");
                          setDays((prevDays) => {
                            const newDays = [...prevDays];
                            newDays[dayIndex].crew = updatedCrew;
                            return newDays;
                          });
                        }}
                        className="text-xs w-5 sf leading-none hover:bg-slate-400"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedCrew = [...day.crew];
                          if (updatedCrew[index].roles?.length > 0) {
                            updatedCrew[index].roles.pop();
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].crew = updatedCrew;
                              return newDays;
                            });
                          }
                        }}
                        className="text-xs w-5 sf leading-none hover:bg-slate-400"
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </section>
              {/* Expenses section */}
              <section className="relative p-2 border h-full border-gray-400 flex flex-col gap-1 sf text-xs font-thin w-2/3">
                <div className="absolute right-1 top-0 flex items-center gap-2">
                  <p className="sf text-xs font-thin tracking-widest">
                    {template
                      ? "Production | Documentation"
                      : "Design |  Motion"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplate(!template);

                      setDays((prevDays) =>
                        prevDays.map((day) => ({
                          ...day,
                          sewaExpenses: [],
                          operationalExpenses: [],
                          orderList: [],
                          totalExpenses: 0,
                        }))
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDays((prevDays) =>
                        prevDays.filter((day) => day.id !== days[dayIndex].id)
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {template ? (
                  <div>
                    {/* Rent */}
                    <p className="sf text-xs font-thin tracking-widest">
                      Rent Expenses
                    </p>
                    {day.expense.sewaExpenses.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="text"
                          required
                          placeholder="Item Name"
                          value={expense.name}
                          onChange={(e) => {
                            const updatedExpenses = [...day.expense.sewaExpenses];
                            updatedExpenses[index].name = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.sewaExpenses = updatedExpenses;
                              return newDays;
                            });
                          }}
                        />
                        <NumericFormat
                          displayType="input"
                          thousandSeparator
                          required
                          allowNegative={false}
                          prefix={"Rp. "}
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          placeholder="Prices"
                          value={expense.price || ""}
                          onValueChange={(values) => {
                            const { value } = values;
                            handleExpenseChange(
                              dayIndex,
                              "sewaExpenses",
                              index,
                              "price",
                              value
                            );
                          }}
                        />
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="number"
                          required
                          placeholder="Qty"
                          value={expense.quantity || ""}
                          min="1"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Math.max(1, parseInt(e.target.value) || 1);
                            handleExpenseChange(
                              dayIndex,
                              "sewaExpenses",
                              index,
                              "quantity",
                              value
                            );
                          }}
                        />
                        <button
                          type="button"
                          className="sf text-xs font-thin ml-5"
                          onClick={() => {
                            const updatedExpenses = [...day.expense.sewaExpenses];
                            updatedExpenses.splice(index, 1);
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.sewaExpenses = updatedExpenses;
                              return newDays;
                            });
                          }}
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handleAddExpense(dayIndex, "sewaExpenses");
                      }}
                      className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
                    >
                      Add
                    </button>
                    {/* Operational */}
                    <p className="sf text-xs font-thin tracking-widest">
                      Operational Expenses
                    </p>
                    {day.expense.operationalExpenses.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="text"
                          required
                          placeholder="Item Name"
                          value={expense.name}
                          onChange={(e) => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses[index].name = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
                                updatedExpenses;
                              return newDays;
                            });
                          }}
                        />
                        <NumericFormat
                          displayType="input"
                          thousandSeparator
                          required
                          prefix={"Rp. "}
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          placeholder="Prices"
                          value={expense.price || ""}
                          allowNegative={false}
                          onValueChange={(values) => {
                            const { value } = values;
                            handleExpenseChange(
                              dayIndex,
                              "operationalExpenses",
                              index,
                              "price",
                              value
                            );
                          }}
                        />
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="number"
                          placeholder="Qty"
                          required
                          value={expense.quantity || ""}
                          min="1"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Math.max(1, parseInt(e.target.value) || 1);
                            handleExpenseChange(
                              dayIndex,
                              "operationalExpenses",
                              index,
                              "quantity",
                              value
                            );
                          }}
                        />
                        <select
                          value={expense.category}
                          onChange={(e) => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses[index].category = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
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
                          type="button"
                          className="sf text-xs font-thin ml-5"
                          onClick={() => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses.splice(index, 1);
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
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
                      type="button"
                      onClick={() =>
                        handleAddExpense(dayIndex, "operationalExpenses")
                      }
                      className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Design */}
                    <p>Order List</p>
                    {day.expense.orderList.map((order, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="text"
                          required
                          placeholder="Item Name"
                          value={order.name}
                          onChange={(e) => {
                            const updatedExpenses = [...day.expense.orderList];
                            updatedExpenses[index].name = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.orderList = updatedExpenses;
                              return newDays;
                            });
                          }}
                        />

                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="number"
                          placeholder="Qty"
                          required
                          min={1}
                          value={order.quantity}
                          onChange={(e) => {
                            handleExpenseChange(
                              dayIndex,
                              "orderList",
                              index,
                              "quantity",
                              e.target.value
                            );
                            const updatedExpenses = [...day.expense.orderList];
                            updatedExpenses[index].quantity = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.orderList = updatedExpenses;
                              return newDays;
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="sf text-xs font-thin ml-5"
                          onClick={() => {
                            const updatedExpenses = [...day.expense.orderList];
                            updatedExpenses.splice(index, 1);
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.orderList = updatedExpenses;
                              return newDays;
                            });
                          }}
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handleAddExpense(dayIndex, "orderList");
                      }}
                      className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
                    >
                      Add
                    </button>
                    {/*Design Expense */}
                    <p className="sf text-xs font-thin tracking-widest">
                      Operational Expenses
                    </p>
                    {day.expense.operationalExpenses.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="text"
                          required
                          placeholder="Item Name"
                          value={expense.name}
                          onChange={(e) => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses[index].name = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
                                updatedExpenses;
                              return newDays;
                            });
                          }}
                        />
                        <NumericFormat
                          displayType="input"
                          thousandSeparator
                          required
                          prefix={"Rp. "}
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          placeholder="Prices"
                          value={expense.price || ""}
                          allowNegative={false}
                          onValueChange={(values) => {
                            const { value } = values;
                            handleExpenseChange(
                              dayIndex,
                              "operationalExpenses",
                              index,
                              "price",
                              value
                            );
                          }}
                        />
                        <input
                          className="border border-gray-400 p-px outline-none m-1 sf text-xs font-thin"
                          type="number"
                          placeholder="Qty"
                          required
                          value={expense.quantity || ""}
                          min="1"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Math.max(1, parseInt(e.target.value) || 1);
                            handleExpenseChange(
                              dayIndex,
                              "operationalExpenses",
                              index,
                              "quantity",
                              value
                            );
                          }}
                        />
                        <select
                          value={expense.category}
                          onChange={(e) => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses[index].category = e.target.value;
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
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
                          type="button"
                          className="sf text-xs font-thin ml-5"
                          onClick={() => {
                            const updatedExpenses = [
                              ...day.expense.operationalExpenses,
                            ];
                            updatedExpenses.splice(index, 1);
                            setDays((prevDays) => {
                              const newDays = [...prevDays];
                              newDays[dayIndex].expense.operationalExpenses =
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
                      type="button"
                      onClick={() =>
                        handleAddExpense(dayIndex, "operationalExpenses")
                      }
                      className="text-light bg-dark p-px outline-none m-1 sf text-xs font-thin w-20"
                    >
                      Add
                    </button>
                  </div>
                )}
                {/* Note & Total */}
                <div className="w-full flex items-center gap-1">
                  <textarea
                    placeholder="Note"
                    value={day.note}
                    className="h-full w-2/3 border border-gray-400 outline-none p-2"
                  />
                  <div className="w-1/3 h-full">
                    <p className="bg-dark text-light sf text-xs font-thin tracking-widest pl-1">
                      Expenses
                    </p>

                    <NumericFormat
                      displayType="input"
                      readOnly
                      thousandSeparator
                      prefix={"Rp. "}
                      value={
                        day.expense.sewaExpenses.reduce(
                          (acc, exp) => acc + (exp.price * exp.quantity || 0),
                          0
                        ) +
                        day.expense.operationalExpenses.reduce(
                          (acc, exp) => acc + (exp.price * exp.quantity || 0),
                          0
                        )
                      }
                      className="outline-none pt-2 select-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          </main>
        ))}
        <button
          type="button"
          className="w-20 m-1 text-light bg-dark flex justify-center sf text-xs font-thin"
          onClick={addDay}
        >
          Add Day
        </button>
      </form>
    </main>
  );
};

export default Report;
