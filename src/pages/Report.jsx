import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { roleProduction, roleGraphic } from "../constant/constant";
import { useToast } from '../components/ToastContext';

const Report = ({ setShowReportGenerator, pro: initialPro, updateData }) => {
  const { showToast } = useToast();
  const [pro, setPro] = useState(initialPro || {});
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (initialPro) {
      setPro(initialPro);
      setDays(
        initialPro.day?.map(day => ({
          ...day,
          id: Date.now() + Math.random(),
          expense: {
            rent: day.expense?.rent || [],
            operational: day.expense?.operational || [],
            orderlist: day.expense?.orderlist || [],
          },
          backup: day.backup || [],
          crew: day.crew || [],
          note: day.note || '',
          totalExpenses: day.totalExpenses || 0,
          template: day.template || false,
          date: day.date || '',
        })) || []
      );
    }
  }, [initialPro]);

  // Add a new day
  const addDay = () => {
    setDays([
      ...days,
      {
        id: Date.now() + Math.random(),
        crew: [],
        expense: { rent: [], operational: [], orderlist: [] },
        note: '',
        totalExpenses: 0,
        template: false,
        date: '',
        backup: [],
      },
    ]);
  };

  // Calculate total expenses for a day
  const calculateTotalExpenses = (day) => {
    if (!day) return 0;
    const parseNumber = (value) => isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    const rentTotal = day.expense.rent.reduce(
      (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
    );
    const operationalTotal = day.expense.operational.reduce(
      (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
    );
    return rentTotal + operationalTotal;
  };

  // Add expense item
  const handleAddExpense = (dayIndex, type) => {
    setDays(prevDays =>
      prevDays.map((day, idx) => {
        if (idx === dayIndex) {
          const newExpense = {
            name: "",
            price: "",
            qty: "",
            ...(type === "operational" && { category: "" }),
            note: "",
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

  // Change expense item
  const handleExpenseChange = (dayIndex, type, expenseIndex, field, value) => {
    setDays(prevDays =>
      prevDays.map((day, idx) => {
        if (idx === dayIndex) {
          const updatedExpenses = day.expense[type].map((expense, i) =>
            i === expenseIndex ? { ...expense, [field]: value } : expense
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

  // Change project field
  const handleInputChange = (field, value) => {
    setPro(prevPro => ({
      ...prevPro,
      [field]: value,
    }));
  };

  // Save report
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const updatedPro = {
        ...pro,
        total: days.reduce((acc, day) => acc + (day.totalExpenses || 0), 0),
        day: days.map(day => ({
          ...day,
          expense: {
            rent: day.expense.rent,
            operational: day.expense.operational,
            orderlist: day.expense.orderlist,
          },
        })),
      };
      await updateData(updatedPro);
      showToast("Project Report saved successfully", 'success');
      setPro(updatedPro);
      setDays(updatedPro.day.map(day => ({
        ...day,
        id: Date.now() + Math.random(),
        expense: {
          rent: day.expense.rent || [],
          operational: day.expense.operational || [],
          orderlist: day.expense.orderlist || [],
        }
      })));
    } catch (error) {
      console.error('Save error:', error);
      showToast("Something went wrong! Failed to save report", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed top-0 left-0 z-40 bg-dark w-full h-screen flex flex-col items-start">
      {/* Navbar */}
      <nav className="flex justify-between px-10 text-dark font-body text-sm tracking-wider items-center w-full h-10 border-b border-light">
        <button
          type="button"
          className="flex gap-1 items-center text-light"
          onClick={() => setShowReportGenerator(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="#e8e8e8" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
          Back
        </button>
        <p>{pro?.title || ''}</p>
        <main className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <p>Start :</p>
            <input
              type="date"
              value={pro?.start}
              onChange={e => handleInputChange('start', e.target.value)}
              className="border border-gray-400 p-px outline-none m-1 font-body text-light text-xs font-thin"
            />
          </div>
          <div className="flex items-center gap-1">
            <p>Deadline :</p>
            <input
              type="date"
              value={pro?.deadline}
              readOnly
              className="border border-gray-400 p-px outline-none m-1 font-body text-xs text-light font-thin"
            />
          </div>
        </main>
      </nav>
      <main className="flex flex-col items-start justify-between h-screen w-full overflow-y-auto no-scrollbar">
        {/* Aside */}
        <aside className=" h-full font-body font-thin text-sm tracking-wider">
          <div className="flex w-full items-start justify-start">
            {/* Crew section */}
            <section className="p-2 border h-full border-gray-400 flex flex-col gap-1 font-body text-xs font-thin w-1/3">
              <p className="font-body text-xs font-thin tracking-widest pl-4">Crew</p>
              {pro.day[0].crew.map((item, index) => (
                <div className="flex items-center justify-start" key={index}>
                  <p className="w-1/2">{item.name}</p>
                  <p className="w-1/2">:&nbsp;{item.roles.join(", ")}</p>
                </div>
              ))}
            </section>
            <section className="flex flex-col">
              {/* PM*/}
              <div className="mt-2 w-72">
                <label className="font-medium">PM</label>
                <input type="text" value={pro?.day[0].crew || ''} className="border border-gray-400 p-2 w-full mt-1 outline-none" disabled />
              </div>
              {/* Client */}
              <div className="mt-2 w-72">
                <label className="font-medium">Client</label>
                <input type="text" value={pro?.client || ''} className="border border-gray-400 p-2 w-full mt-1 outline-none" disabled />
              </div>
              {/* PIC Client */}
              <div className="mt-2 w-72">
                <label className="font-medium">PIC Client</label>
                <input type="text" value={pro?.pic || ''} className="border border-gray-400 p-2 w-full mt-1 outline-none" disabled />
              </div>
              {/* Total Expenses */}
              <div className="mt-2 w-76">
                <label className="font-medium">Total Expenses</label>
                <NumericFormat
                  displayType="input"
                  thousandSeparator
                  prefix={"Rp. "}
                  value={days.reduce((acc, day) => acc + (day.totalExpenses || 0), 0) || pro?.total}
                  placeholder="Rp. 0"
                  className="border border-gray-400 p-2 w-full mt-1 outline-none"
                  disabled
                />
              </div>
            </section>
            {/* Note */}
            <div className="mt-2 w-76">
              <label className="font-medium">Note</label>
              <textarea placeholder="Note" value={pro?.note || ''} className="border border-gray-400 p-2 w-full mt-1 outline-none min-h-56" />
            </div>
          </div>
          {/* Save Button */}
          <div className="text-right mt-5 flex items-center justify-between">
            <button type="submit" onClick={handleSubmit} className="border flex gap-2 items-center bg-dark text-light px-4 py-2">
              Save {loading ? <span className="animate-spin"><svg width="100%" height="100%" viewBox="0 0 24 24" className="size-5 animate-spin" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z" stroke="#f8f8f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span> : null}
            </button>
          </div>
          <p className="text-dark px-5 pt-3 font-body italic font-thin text-xs">
            *Note: Please save before export
          </p>
        </aside>
        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Data per Day */}
          {days.map((day, dayIndex) => (
            <main key={`day-${dayIndex}-${day.id}`} className="w-full p-1 flex items-center">
              <div className="flex h-full w-full gap-1">

                {/* Expenses section */}
                <section className="relative p-2 border h-full border-gray-400 flex flex-col gap-1 font-body text-xs font-thin w-2/3">
                  <div className="absolute right-1 top-0 flex items-center gap-2">
                    <p className="font-body text-xs font-thin tracking-widest">
                      {day.template
                        ? "Production | Documentation"
                        : "Design |  Motion"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDays(prevDays => prevDays.map((day, idx) =>
                          idx === dayIndex ? { ...day, template: !day.template } : day
                        ));
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
                      onClick={() => {
                        setDays(prevDays => prevDays.filter((_, index) => index !== dayIndex));
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
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {day.template ? (
                    <div>
                      {/* Rent */}
                      <p className="font-body text-xs font-thin tracking-widest">
                        Rent Expenses
                      </p>
                      {day.expense.rent.map((expense, index) => (
                        <div className="flex items-center gap-1" key={index}>
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Item Name"
                            value={expense.name}
                            onChange={(e) => {
                              const updatedExpenses = [...day.expense.rent];
                              updatedExpenses[index].name = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.rent = updatedExpenses;
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
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            placeholder="Prices"
                            value={expense.price || ""}
                            onValueChange={(values) => {
                              const { value } = values;
                              handleExpenseChange(
                                dayIndex,
                                "rent",
                                index,
                                "price",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="number"
                            required
                            placeholder="Qty"
                            value={expense.qty || ""}
                            min="1"
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? ""
                                  : Math.max(1, parseInt(e.target.value) || 1);
                              handleExpenseChange(
                                dayIndex,
                                "rent",
                                index,
                                "qty",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            placeholder="Note"
                            value={expense.note || ""}
                            onChange={(e) => handleExpenseChange(
                              dayIndex,
                              "rent",
                              index,
                              "note",
                              e.target.value
                            )}
                          />
                          <button
                            type="button"
                            className="font-body text-xs font-thin ml-5"
                            onClick={() => {
                              const updatedExpenses = [...day.expense.rent];
                              updatedExpenses.splice(index, 1);
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.rent = updatedExpenses;
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
                          handleAddExpense(dayIndex, "rent");
                        }}
                        className="text-dark bg-light p-px outline-none font-body text-xs font-thin w-20"
                      >
                        Add
                      </button>
                      {/* Operational */}
                      <p className="font-body text-xs font-thin tracking-widest">
                        Operational Expenses
                      </p>
                      {day.expense.operational.map((expense, index) => (
                        <div className="flex items-center gap-1" key={index}>
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Item Name"
                            value={expense.name}
                            onChange={(e) => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses[index].name = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            placeholder="Prices"
                            value={expense.price || ""}
                            allowNegative={false}
                            onValueChange={(values) => {
                              const { value } = values;
                              handleExpenseChange(
                                dayIndex,
                                "operational",
                                index,
                                "price",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="number"
                            placeholder="Qty"
                            required
                            value={expense.qty || ""}
                            min="1"
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? ""
                                  : Math.max(1, parseInt(e.target.value) || 1);
                              handleExpenseChange(
                                dayIndex,
                                "operational",
                                index,
                                "qty",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            placeholder="Note"
                            value={expense.note || ""}
                            onChange={(e) => handleExpenseChange(
                              dayIndex,
                              "operational",
                              index,
                              "note",
                              e.target.value
                            )}
                          />
                          <select
                            value={expense.category}
                            onChange={(e) => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses[index].category = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                            className="font-body text-xs font-thin ml-5"
                            onClick={() => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses.splice(index, 1);
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                          handleAddExpense(dayIndex, "operational")
                        }
                        className="text-dark bg-light p-px outline-none font-body text-xs font-thin w-20"
                      >
                        Add
                      </button>
                      {/* Backup */}
                      <p className="font-medium ">Backup</p>
                      {day.backup?.map((backupItem, backupIndex) => (
                        <div key={backupIndex} className="flex items-center w-full gap-1">
                          <input
                            className="border border-gray-400 p-px outline-none my-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Backup Source"
                            value={backupItem.source || ''}
                            onChange={(e) => {
                              setDays(prevDays =>
                                prevDays.map((d, idx) => {
                                  if (idx === dayIndex) {
                                    const updatedBackup = [...(d.backup || [])];
                                    updatedBackup[backupIndex] = { ...updatedBackup[backupIndex], source: e.target.value };
                                    return { ...d, backup: updatedBackup };
                                  }
                                  return d;
                                })
                              );
                            }}
                          />
                          <p className="font-body text-xs font-thin">to</p>
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Backup Target"
                            value={backupItem.target || ''}
                            onChange={(e) => {
                              setDays(prevDays =>
                                prevDays.map((d, idx) => {
                                  if (idx === dayIndex) {
                                    const updatedBackup = [...(d.backup || [])];
                                    updatedBackup[backupIndex] = { ...updatedBackup[backupIndex], target: e.target.value };
                                    return { ...d, backup: updatedBackup };
                                  }
                                  return d;
                                })
                              );
                            }}
                          />
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                setDays(prevDays =>
                                  prevDays.map((d, idx) => {
                                    if (idx === dayIndex) {
                                      const updatedBackup = [...(d.backup || [])];
                                      updatedBackup.splice(backupIndex, 1);
                                      return { ...d, backup: updatedBackup };
                                    }
                                    return d;
                                  })
                                );
                              }}
                              className="text-xs w-5 font-body"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setDays(prevDays =>
                            prevDays.map((d, idx) => {
                              if (idx === dayIndex) {
                                const updatedBackup = [...(d.backup || []), { source: '', target: '' }];
                                return { ...d, backup: updatedBackup };
                              }
                              return d;
                            })
                          );
                        }}
                        className="text-dark bg-light p-px outline-none font-body text-xs font-thin w-20"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Design */}
                      <p>Order List</p>
                      {(day.expense?.orderlist || []).map((order, index) => (
                        <div className="flex items-center gap-1" key={index}>
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Item Name"
                            value={order.name}
                            onChange={(e) => {
                              const updatedExpenses = [...day.expense.orderlist];
                              updatedExpenses[index].name = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.orderlist = updatedExpenses;
                                return newDays;
                              });
                            }}
                          />

                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="number"
                            placeholder="Qty"
                            required
                            min={1}
                            value={order.qty}
                            onChange={(e) => {
                              handleExpenseChange(
                                dayIndex,
                                "orderlist",
                                index,
                                "qty",
                                e.target.value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            placeholder="Note"
                            value={order.note || ""}
                            onChange={(e) => handleExpenseChange(
                              dayIndex,
                              "orderlist",
                              index,
                              "note",
                              e.target.value
                            )}
                          />
                          <button
                            type="button"
                            className="font-body text-xs font-thin ml-5"
                            onClick={() => {
                              const updatedExpenses = [...day.expense.orderlist];
                              updatedExpenses.splice(index, 1);
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.orderlist = updatedExpenses;
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
                          handleAddExpense(dayIndex, "orderlist");
                        }}
                        className="text-dark bg-light p-px outline-none font-body text-xs font-thin w-20"
                      >
                        Add
                      </button>
                      {/*Design Expense */}
                      <p className="font-body text-xs font-thin tracking-widest">
                        Operational Expenses
                      </p>
                      {day.expense.operational.map((expense, index) => (
                        <div className="flex items-center gap-1" key={index}>
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            required
                            placeholder="Item Name"

                            value={expense.name}
                            onChange={(e) => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses[index].name = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            placeholder="Prices"
                            value={expense.price || ""}
                            allowNegative={false}
                            onValueChange={(values) => {
                              const { value } = values;
                              handleExpenseChange(
                                dayIndex,
                                "operational",
                                index,
                                "price",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="number"
                            placeholder="Qty"
                            required
                            value={expense.qty || ""}
                            min="1"
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? ""
                                  : Math.max(1, parseInt(e.target.value) || 1);
                              handleExpenseChange(
                                dayIndex,
                                "operational",
                                index,
                                "qty",
                                value
                              );
                            }}
                          />
                          <input
                            className="border border-gray-400 p-px outline-none m-1 font-body text-xs font-thin"
                            type="text"
                            placeholder="Note"
                            value={expense.note || ""}
                            onChange={(e) => handleExpenseChange(
                              dayIndex,
                              "operational",
                              index,
                              "note",
                              e.target.value
                            )}
                          />
                          <select
                            value={expense.category}
                            onChange={(e) => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses[index].category = e.target.value;
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                            className="font-body text-xs font-thin ml-5"
                            onClick={() => {
                              const updatedExpenses = [
                                ...day.expense.operational,
                              ];
                              updatedExpenses.splice(index, 1);
                              setDays((prevDays) => {
                                const newDays = [...prevDays];
                                newDays[dayIndex].expense.operational =
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
                          handleAddExpense(dayIndex, "operational")
                        }
                        className="text-dark bg-light p-px outline-none font-body text-xs font-thin w-20"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  {/* Note & Total */}
                  <main className="w-full">
                    <section className="flex items-center gap-1">
                      <textarea
                        placeholder="Note"
                        value={day.note}
                        onChange={(e) => {
                          setDays(prevDays => prevDays.map((d, idx) =>
                            idx === dayIndex ? { ...d, note: e.target.value } : d
                          ));
                        }}
                        className="h-full w-2/3 border border-gray-400 outline-none p-2"
                      />
                      <div className="w-1/3 h-full">
                        <p className="bg-dark text-light font-body text-xs font-thin tracking-widest pl-1">
                          Expenses
                        </p>

                        <NumericFormat
                          displayType="input"
                          readOnly
                          thousandSeparator
                          prefix={"Rp. "}
                          value={
                            day.expense.rent.reduce(
                              (acc, exp) => acc + (exp.price * exp.qty || 0),
                              0
                            ) +
                            day.expense.operational.reduce(
                              (acc, exp) => acc + (exp.price * exp.qty || 0),
                              0
                            )
                          }
                          className="outline-none pt-2 select-none"
                        />
                      </div>
                    </section>
                  </main>
                </section>
              </div>
            </main>
          ))}
          <button
            type="button"
            className="w-20 m-1 text-dark bg-light flex justify-center font-body text-xs font-thin"
            onClick={addDay}
          >
            Add Day
          </button>
        </form>
      </main>
    </main>
  );
};

export default Report;
