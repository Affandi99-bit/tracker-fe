import React, { useState, useEffect, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { useToast } from '../components/ToastContext';
import { PrintLayout } from "../components";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const Report = ({ setShowReportGenerator, pro: initialPro, updateData }) => {
  const { showToast } = useToast();
  const [pro, setPro] = useState(initialPro || {});
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, dayIndex: null });
  const printRef = useRef()

  // Budget Overview Component
  const BudgetOverview = ({ days, pro }) => {
    const formatCurrency = (num) => {
      if (!num || isNaN(num)) return "Rp. 0";
      return `Rp. ${parseFloat(num).toLocaleString("id-ID")}`;
    };

    // Calculate expense categories for pie chart
    const calculateExpenseCategories = () => {
      const categories = {
        'Rent': 0,
        'Order List': 0
      };

      // Operational expenses by subcategory
      const operationalCategories = {
        'Food': 0,
        'Transport': 0,
        'Acomodation': 0,
        'Snack': 0,
        'Equipment': 0,
        'Materials': 0,
        'Services': 0,
        'Other': 0
      };

      days.forEach(day => {
        // Rent expenses
        if (day.expense?.rent && Array.isArray(day.expense.rent)) {
          day.expense.rent.forEach(item => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 0);
            if (!isNaN(price) && !isNaN(qty)) {
              categories['Rent'] += (price * qty);
            }
          });
        }

        // Operational expenses by subcategory
        if (day.expense?.operational && Array.isArray(day.expense.operational)) {
          day.expense.operational.forEach(item => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 0);
            if (!isNaN(price) && !isNaN(qty)) {
              const category = item.category || 'Other';
              if (Object.prototype.hasOwnProperty.call(operationalCategories, category)) {
                operationalCategories[category] += (price * qty);
              } else {
                operationalCategories['Other'] += (price * qty);
              }
            }
          });
        }

        // Order list expenses
        if (day.expense?.orderlist && Array.isArray(day.expense.orderlist)) {
          day.expense.orderlist.forEach(item => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 0);
            if (!isNaN(price) && !isNaN(qty)) {
              categories['Order List'] += (price * qty);
            }
          });
        }
      });

      // Combine all categories, filtering out zero values
      const allCategories = {
        ...categories,
        ...operationalCategories
      };

      return Object.entries(allCategories)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));
    };

    const expenseData = calculateExpenseCategories();
    const totalExpenses = days.reduce((acc, day) => acc + (day.totalExpenses || 0), 0);

    // Monochrome color palette
    const COLORS = [
      '#202020', '#404040', '#606060', '#808080', '#a0a0a0',
      '#c0c0c0', '#e0e0e0', '#303030', '#505050', '#707070'
    ];

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0];
        const percentage = totalExpenses > 0 ? ((data.value / totalExpenses) * 100).toFixed(1) : 0;

        return (
          <div className="bg-dark border border-light/50 rounded-lg p-3 text-light shadow-lg">
            <p className="font-semibold text-light mb-1">{data.name}</p>
            <div className="space-y-1">
              <p className="text-light/80 text-sm">
                Amount: {formatCurrency(data.value)}
              </p>
              <p className="text-light/60 text-sm">
                Percentage: {percentage}%
              </p>
              {data.name === 'Food' && (
                <p className="text-light/50 text-xs">Daily meals and beverages</p>
              )}
              {data.name === 'Transport' && (
                <p className="text-light/50 text-xs">Travel and transportation costs</p>
              )}
              {data.name === 'Acomodation' && (
                <p className="text-light/50 text-xs">Lodging and accommodation</p>
              )}
              {data.name === 'Snack' && (
                <p className="text-light/50 text-xs">Refreshments and snacks</p>
              )}
              {data.name === 'Equipment' && (
                <p className="text-light/50 text-xs">Technical equipment and tools</p>
              )}
              {data.name === 'Materials' && (
                <p className="text-light/50 text-xs">Production materials and supplies</p>
              )}
              {data.name === 'Services' && (
                <p className="text-light/50 text-xs">External services and support</p>
              )}
              {data.name === 'Rent' && (
                <p className="text-light/50 text-xs">Equipment and venue rentals</p>
              )}
              {data.name === 'Order List' && (
                <p className="text-light/50 text-xs">Purchased items and orders</p>
              )}
            </div>
          </div>
        );
      }
      return null;
    };

    // If no expense data, show placeholder
    if (expenseData.length === 0) {
      return (
        <section className="glass p-4 m-1 w-full h-full rounded-xl font-body text-sm tracking-wider border border-light/50">
          <div className="flex items-start gap-1 h-full">
            {/* Left Side - Placeholder */}
            <div className="w-1/2 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-light mb-4 tracking-wider">Budget Overview</h2>
              <div className="flex-1 flex items-center justify-center mb-4">
                <div className="text-center text-light/60">
                  <p className="text-lg font-medium mb-2">No expenses yet</p>
                  <p className="text-sm">Add expenses to see budget breakdown</p>
                </div>
              </div>
              {/* Total Expenses - Bottom Right */}
              <div className="text-right">
                <div className="bg-light/10 rounded-xl p-3 border border-light/20">
                  <p className="text-light/80 text-sm font-medium mb-1">Total Project Expenses</p>
                  <p className="text-2xl font-bold text-light">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Project Data & Person in Charge */}
            <div className="w-1/2 h-full flex flex-col justify-between">
              {/* Project Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-light/80 font-medium">Title:</span>
                      <span className="text-light font-semibold">{pro?.title || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light/80 font-medium">Client:</span>
                      <span className="text-light font-semibold">{pro?.client || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light/80 font-medium">PIC Client:</span>
                      <span className="text-light font-semibold">{pro?.pic || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light/80 font-medium">Categories:</span>
                      <span className="text-light font-semibold">
                        {pro?.categories?.join(", ") || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Person in Charge */}
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-light/90 font-medium">Project Manager:</span>
                      <span className="text-light font-semibold">
                        {pro.day && pro.day[0] && Array.isArray(pro.day[0].crew)
                          ? pro.day[0].crew
                            .filter(c => Array.isArray(c.roles) && c.roles.some(r => r.toLowerCase() === "project manager"))
                            .map(c => c.name)
                            .join(", ") || "No Project Manager"
                          : "No Crew"}
                      </span>
                    </div>
                    <div className="">
                      <span className="text-light/90 font-medium">Crew:</span>
                      <span className="text-light/60 font-semibold">
                        {pro.day && pro.day[0] && Array.isArray(pro.day[0].crew) ? (
                          pro.day[0].crew.map((item, index) => (
                            <div className="flex items-center justify-between w-full" key={index}>
                              <p className="w-1/2 font-thin">{item.name}</p>
                              <p className="w-1/2 font-medium text-end">{item.roles.join(", ")}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-light/60">No crew assigned</p>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="glass p-4 m-1 w-full h-full rounded-xl font-body text-sm tracking-wider border border-light/50">
        <div className="flex items-start gap-2 h-full">
          {/* Left Side - Pie Chart */}
          <div className="w-1/2 h-full flex flex-col">
            <h2 className="text-xl font-semibold text-light mb-4 tracking-wider">Budget Overview</h2>
            <div className="flex-1 flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-light text-xs font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Total Expenses - Bottom Right */}
            <div className="text-right">
              <div className="bg-light/10 rounded-xl p-3 border border-light/20">
                <p className="text-light/80 text-sm font-medium mb-1">Total Project Expenses</p>
                <p className="text-2xl font-bold text-light">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>

          </div>

          {/* Right Side - Project Data & Person in Charge */}
          <div className="w-1/2 h-full flex flex-col justify-between">
            {/* Project Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Project Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-light/80 font-medium">Title:</span>
                    <span className="text-light font-semibold">{pro?.title || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light/80 font-medium">Client:</span>
                    <span className="text-light font-semibold">{pro?.client || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light/80 font-medium">PIC Client:</span>
                    <span className="text-light font-semibold">{pro?.pic || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light/80 font-medium">Categories:</span>
                    <span className="text-light font-semibold">
                      {pro?.categories?.join(", ") || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Person in Charge */}
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-light/90 font-medium">Project Manager:</span>
                    <span className="text-light font-semibold">
                      {pro.day && pro.day[0] && Array.isArray(pro.day[0].crew)
                        ? pro.day[0].crew
                          .filter(c => Array.isArray(c.roles) && c.roles.some(r => r.toLowerCase() === "project manager"))
                          .map(c => c.name)
                          .join(", ") || "No Project Manager"
                        : "No Crew"}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-light/90 font-medium">Crew:</span>
                    <span className="text-light/60 font-semibold">
                      {pro.day && pro.day[0] && Array.isArray(pro.day[0].crew) ? (
                        pro.day[0].crew.map((item, index) => (
                          <div className="flex items-center justify-between w-full" key={index}>
                            <p className="w-1/2 font-thin">{item.name}</p>
                            <p className="w-1/2 font-medium text-end">{item.roles.join(", ")}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-light/60">No crew assigned</p>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Export and Save Buttons */}
            <div className="w-full flex items-end justify-between gap-1">
              <button
                type="button"
                onClick={() => handleExportPDF()}
                className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center border-light/50 text-light w-20 h-10 justify-center"
              >
                Export
              </button>
              {/* Save */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center bg-light text-dark w-20 h-10 justify-center"
              >
                {loading ? (
                  <span className="animate-spin">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" className="size-5 animate-spin" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : "Save"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const handleExportPDF = async () => {
    const input = printRef.current;
    if (!input) {
      showToast("Export failed: nothing to export", "error");
      return;
    }
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;
    let heightLeft = pdfHeight;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${pro?.title || "report"}.pdf`);
  };

  useEffect(() => {
    if (initialPro) {
      setPro(initialPro);

      // Determine template from project categories
      const isProductionTemplate = initialPro.categories?.some(cat => ["Produksi", "Dokumentasi"].includes(cat)) || false;

      let projectDays = initialPro.day?.map(day => {
        const dayTemplate = day.template !== undefined ? day.template : isProductionTemplate;

        return {
          ...day,
          id: Date.now() + Math.random(),
          expense: {
            rent: day.expense?.rent || [],
            operational: day.expense?.operational || [],
            orderlist: day.expense?.orderlist || [],
          },
          images: Array.isArray(day.images) ? day.images : [],
          backup: day.backup || [],
          crew: day.crew || [],
          note: day.note || '',
          totalExpenses: day.totalExpenses || 0,
          template: dayTemplate, // Use the determined template
          date: day.date || '',
          dayNumber: day.dayNumber || 1, // Preserve if exists (may be stripped by backend)
          // Infer flags from note if present in DB
          isPreProd: (day.note || '').toLowerCase().includes('pre-production'),
          isPostProd: (day.note || '').toLowerCase().includes('post-production'),
        };
      }) || [];

      // Add pre-production and post-production days if missing (avoid duplicates)
      if (isProductionTemplate) {
        const hasPre = projectDays.some(d => d.isPreProd);
        const hasPost = projectDays.some(d => d.isPostProd);

        if (projectDays.length > 0) {
          if (!hasPre) {
            projectDays = [
              {
                id: Date.now() + Math.random() + 1,
                crew: [],
                expense: { rent: [], operational: [], orderlist: [] },
                images: [],
                note: 'Pre-production day',
                totalExpenses: 0,
                template: true,
                date: '',
                backup: [],
                dayNumber: 0,
                isPreProd: true,
                isPostProd: false,
              },
              ...projectDays,
            ];
          }
          if (!hasPost) {
            projectDays = [
              ...projectDays,
              {
                id: Date.now() + Math.random() + 2,
                crew: [],
                expense: { rent: [], operational: [], orderlist: [] },
                images: [],
                note: 'Post-production day',
                totalExpenses: 0,
                template: true,
                date: '',
                backup: [],
                // dayNumber will be set in ensureDayNumbering
                isPreProd: false,
                isPostProd: true,
              },
            ];
          }
        }
      }

      // Ensure proper day numbering
      const numberedDays = ensureDayNumbering(projectDays);
      setDays(numberedDays);
    }
  }, [initialPro]);

  // Monitor template changes to ensure they are preserved
  useEffect(() => {
    // Check if all days have the same template
    if (days.length > 1) {
      const templates = days.map(d => d.template);
      const uniqueTemplates = [...new Set(templates)];
      if (uniqueTemplates.length > 1) {
        console.warn('Warning: Days have different templates:', templates);
      }
    }

    // Ensure day numbering is always correct
    const numberedDays = ensureDayNumbering(days);
    if (JSON.stringify(numberedDays) !== JSON.stringify(days)) {
      setDays(numberedDays);
    }
  }, [days]);
  const addDay = () => {
    // Get the template from existing days or determine from project categories
    const existingTemplate = days.length > 0 ? days[0].template : pro.categories?.some(cat => ["Produksi", "Dokumentasi"].includes(cat));

    // Find the index of post-production day to insert before it
    const postProdIndex = days.findIndex(day => day.isPostProd);
    const insertIndex = postProdIndex !== -1 ? postProdIndex : days.length;

    // Calculate the correct day number (excluding pre/post production days)
    const productionDays = days.filter(day => !day.isPreProd && !day.isPostProd);
    const newDayNumber = productionDays.length + 1;

    const newDay = {
      id: Date.now() + Math.random(),
      crew: [],
      expense: { rent: [], operational: [], orderlist: [] },
      images: [],
      note: '',
      totalExpenses: 0,
      template: existingTemplate,
      date: '',
      backup: [],
      dayNumber: newDayNumber,
    };

    // Insert the new day before post-production or at the end
    const newDays = [...days];
    newDays.splice(insertIndex, 0, newDay);

    // Ensure proper day numbering for all days
    const numberedDays = ensureDayNumbering(newDays);
    setDays(numberedDays);
  };

  // Function to ensure proper day numbering
  const ensureDayNumbering = (daysArray) => {
    return daysArray.map((day) => {
      if (day.isPreProd) {
        return { ...day, dayNumber: 0 };
      } else if (day.isPostProd) {
        return { ...day, dayNumber: daysArray.filter(d => !d.isPreProd && !d.isPostProd).length + 1 };
      } else {
        // This is a production day, find its position among production days
        const productionDays = daysArray.filter(d => !d.isPreProd && !d.isPostProd);
        const productionIndex = productionDays.indexOf(day);
        return { ...day, dayNumber: productionIndex + 1 };
      }
    });
  };

  // Function to show delete confirmation
  const showDeleteConfirm = (dayIndex) => {
    setDeleteConfirm({ show: true, dayIndex });
  };

  // Function to delete a day
  const handleDeleteDay = () => {
    const dayIndexToDelete = deleteConfirm.dayIndex;

    // Don't allow deletion of pre-production or post-production days
    const dayToDelete = days[dayIndexToDelete];
    if (dayToDelete.isPreProd || dayToDelete.isPostProd) {
      showToast("Cannot delete Pre-Production or Post-Production days", "error");
      setDeleteConfirm({ show: false, dayIndex: null });
      return;
    }

    // Remove the day
    const updatedDays = days.filter((_, index) => index !== dayIndexToDelete);

    // Ensure proper day numbering after deletion
    const numberedDays = ensureDayNumbering(updatedDays);
    setDays(numberedDays);

    // Close confirmation dialog
    setDeleteConfirm({ show: false, dayIndex: null });

    showToast("Day deleted successfully", "success");
  };

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

  // Add images helper (from FileList or array of Files)
  const handleAddImages = (dayIndex, files) => {
    const fileArray = Array.from(files || []);
    if (fileArray.length === 0) return;
    Promise.all(
      fileArray.map((file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
      )
    ).then((base64Images) => {
      setDays((prev) =>
        prev.map((d, idx) => {
          if (idx !== dayIndex) return d;
          const currentImages = Array.isArray(d.images) ? d.images : [];
          return { ...d, images: [...currentImages, ...base64Images] };
        })
      );
    });
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
      // Identify pre/post via flags or notes
      const isPreFn = (d) => d.isPreProd || ((d.note || '').toLowerCase().includes('pre-production'));
      const isPostFn = (d) => d.isPostProd || ((d.note || '').toLowerCase().includes('post-production'));
      // Identify production-only days for totals/numbering; but save all days including pre/post
      const productionDays = days.filter(day => !isPreFn(day) && !isPostFn(day));
      const preDay = days.find(isPreFn) || null;
      const postDay = days.find(isPostFn) || null;
      const productionDaysSorted = [...productionDays].sort((a, b) => {
        const an = typeof a.dayNumber === 'number' ? a.dayNumber : 9999;
        const bn = typeof b.dayNumber === 'number' ? b.dayNumber : 9999;
        return an - bn;
      });
      const orderedDays = [
        ...(preDay ? [{ ...preDay, note: 'Pre-production day' }] : []),
        ...productionDaysSorted,
        ...(postDay ? [{ ...postDay, note: 'Post-production day' }] : []),
      ];

      const updatedPro = {
        ...pro,
        total: productionDays.reduce((acc, day) => acc + (day.totalExpenses || 0), 0),
        day: orderedDays.map((day) => ({
          // Persist all days, including pre/post
          // Ensure expense arrays and allowed fields
          expense: {
            rent: day.expense?.rent || [],
            operational: day.expense?.operational || [],
            orderlist: day.expense?.orderlist || [],
          },
          backup: day.backup || [],
          crew: day.crew || [],
          images: Array.isArray(day.images) ? day.images : [],
          note: day.note || '',
          date: day.date || '',
          template: day.template === undefined ? true : day.template,
          // dayNumber and flags may be stripped by backend strict mode; harmless if present
          dayNumber: day.dayNumber,
          isPreProd: day.isPreProd,
          isPostProd: day.isPostProd,
          totalExpenses: day.totalExpenses || 0,
        })),
      };

      // Update kanban to mark "Berita acara" as done
      if (updatedPro.kanban && Array.isArray(updatedPro.kanban)) {
        updatedPro.kanban = updatedPro.kanban.map(division => {
          if (division.steps) {
            division.steps = division.steps.map(step => {
              if (step.items) {
                step.items = step.items.map(item => {
                  // Check if item title contains "Berita acara" or similar
                  if (item.title && (
                    item.title.toLowerCase().includes('berita acara') ||
                    item.title.toLowerCase().includes('laporan') ||
                    item.title.toLowerCase().includes('report')
                  )) {
                    return { ...item, done: true };
                  }
                  return item;
                });
              }
              return step;
            });
          }
          return division;
        });
      }

      await updateData(updatedPro);
      showToast("Project Report saved successfully", 'success');
      setPro(updatedPro);

      // Recreate days from saved payload to preserve pre/post inputs and images
      const rebuiltDays = (updatedPro.day || []).map((d, idx) => ({
        ...d,
        id: Date.now() + Math.random() + idx,
        expense: {
          rent: d.expense?.rent || [],
          operational: d.expense?.operational || [],
          orderlist: d.expense?.orderlist || [],
        },
        images: Array.isArray(d.images) ? d.images : [],
        backup: d.backup || [],
        crew: d.crew || [],
        note: d.note || '',
        date: d.date || '',
        template: d.template === undefined ? true : d.template,
      }));
      const numberedDays = ensureDayNumbering(rebuiltDays);
      setDays(numberedDays);
    } catch (error) {
      console.error('Save error:', error);
      showToast("Something went wrong! Failed to save report", 'error');
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };
  return (
    <main className="fixed top-0 left-0 z-40 bg-dark w-full h-screen flex flex-col items-start">
      {/* Navbar */}
      <nav className="flex justify-between px-10 font-body text-sm tracking-wider items-center w-full h-10 border-b border-light">
        <button
          type="button"
          className="flex gap-1 items-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
          onClick={() => setShowReportGenerator(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="#e8e8e8" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
          Back
        </button>
        <main className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <p>Start :</p>
            <input
              type="date"
              value={formatDate(pro?.createdAt)}
              onChange={e => handleInputChange('createdAt', e.target.value)}
              className="border border-gray-400 glass rounded-xl px-1 p-px outline-none m-1 font-body text-light text-xs font-thin"
            />
          </div>
          <div className="flex items-center gap-1">
            <p>Deadline :</p>
            <input
              type="date"
              value={formatDate(pro?.deadline)}
              onChange={e => handleInputChange('deadline', e.target.value)}
              className="border border-gray-400 glass rounded-xl px-1 p-px outline-none m-1 font-body text-xs text-light font-thin"
            />
          </div>
        </main>
      </nav>
      <main className="w-full overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between h-screen w-full mb-3">
          {/* Budget Overview */}
          <BudgetOverview days={days} pro={pro} />
        </div>
        {/* Content */}
        <form ref={printRef} onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          {/* Data per Day */}
          {days.map((day, dayIndex) => (
            <main key={`day-${dayIndex}-${day.id}`} className="w-full p-1 flex items-center gap-1 min-h-64">

              {/* Expenses section */}
              <section className="rounded-xl glass p-5 border h-full border-gray-400 flex flex-col gap-1 font-body text-xs font-thin w-full">
                {/* Day Header */}
                <div className="relative w-full flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-light tracking-wider">
                    {day.isPreProd
                      ? 'Pre-Production'
                      : day.isPostProd
                        ? 'Post-Production'
                        : `Day ${day.dayNumber || 'Unknown'}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    {day.date && (
                      <span className="text-sm text-light/80 font-medium">
                        {day.date}
                      </span>
                    )}
                    <section
                      className="absolute right-0 -bottom-40 w-40 h-40 rounded-xl border border-gray-400 glass flex justify-center items-center"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        if (e.dataTransfer?.files?.length) {
                          handleAddImages(dayIndex, e.dataTransfer.files);
                        }
                      }}
                    >
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-light/70">
                        <span className="text-xs">Drag & drop images here</span>
                        <span className="text-[10px]">or click to browse</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          handleAddImages(dayIndex, e.target.files);
                          e.target.value = "";
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </section>
                    {/* Delete Day Button - Only show for production days */}
                    {!day.isPreProd && !day.isPostProd && (
                      <button
                        type="button"
                        onClick={() => showDeleteConfirm(dayIndex)}
                        className="text-light transition-colors duration-200 p-1"
                        title="Delete Day"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>

                </div>
                {day.template ? (
                  <div>
                    {/* Rent */}
                    <p className="font-body text-xs font-thin tracking-widest mt-2">
                      Rent Expenses
                    </p>
                    {day.expense.rent.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                      className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                    >
                      Add
                    </button>
                    {/* Operational */}
                    <p className="font-body text-xs font-thin tracking-widest mt-2">
                      Operational Expenses
                    </p>
                    {day.expense.operational.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          <option className="bg-dark text-light" value="">Categories</option>
                          <option className="bg-dark text-light" value="Acomodation">Acomodation</option>
                          <option className="bg-dark text-light" value="Transport">Transport</option>
                          <option className="bg-dark text-light" value="Food">Food</option>
                          <option className="bg-dark text-light" value="Snack">Snack</option>
                          <option className="bg-dark text-light" value="Other">Other</option>
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
                      className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                    >
                      Add
                    </button>
                    {/* Backup */}
                    <p className="font-body text-xs font-thin tracking-widest mt-2">Backup</p>
                    {day.backup?.map((backupItem, backupIndex) => (
                      <div key={backupIndex} className="flex items-center w-full gap-1">
                        <input
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                      className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div>

                    {/* Design */}
                    <p className="font-body text-xs font-thin tracking-widest mt-2">Order List</p>
                    {(day.expense?.orderlist || []).map((order, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                      className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                    >
                      Add
                    </button>
                    {/*Design Expense */}
                    <p className="font-body text-xs font-thin tracking-widest mt-2">
                      Operational Expenses
                    </p>
                    {day.expense.operational.map((expense, index) => (
                      <div className="flex items-center gap-1" key={index}>
                        <input
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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
                          <option className="bg-dark text-light" value="">Categories</option>
                          <option className="bg-dark text-light" value="Acomodation">Acomodation</option>
                          <option className="bg-dark text-light" value="Transport">Transport</option>
                          <option className="bg-dark text-light" value="Food">Food</option>
                          <option className="bg-dark text-light" value="Snack">Snack</option>
                          <option className="bg-dark text-light" value="Other">Other</option>
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
                      className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                    >
                      Add
                    </button>
                  </div>
                )}
                {/* Crew Management - Commented out for now */}
                {/* <div className="w-full mt-2">
                  <p className="font-body text-xs font-thin tracking-widest mb-2">
                    Crew & Job Descriptions
                  </p>
                  {day.crew?.map((crewMember, crewIndex) => (
                    <div key={crewIndex} className="flex items-center gap-1 mb-2">
                      <input
                        className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                        type="text"
                        placeholder="Name"
                        value={crewMember.name || ''}
                        onChange={(e) => {
                          setDays(prevDays =>
                            prevDays.map((d, idx) => {
                              if (idx === dayIndex) {
                                const updatedCrew = [...(d.crew || [])];
                                updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], name: e.target.value };
                                return { ...d, crew: updatedCrew };
                              }
                              return d;
                            })
                          );
                        }}
                      />
                      <input
                        className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                        type="text"
                        placeholder="Roles (comma separated)"
                        value={crewMember.roles?.join(', ') || ''}
                        onChange={(e) => {
                          const roles = e.target.value.split(',').map(role => role.trim()).filter(role => role);
                          setDays(prevDays =>
                            prevDays.map((d, idx) => {
                              if (idx === dayIndex) {
                                const updatedCrew = [...(d.crew || [])];
                                updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], roles };
                                return { ...d, crew: updatedCrew };
                              }
                              return d;
                            })
                          );
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDays(prevDays =>
                            prevDays.map((d, idx) => {
                              if (idx === dayIndex) {
                                const updatedCrew = [...(d.crew || [])];
                                updatedCrew.splice(crewIndex, 1);
                                return { ...d, crew: updatedCrew };
                              }
                              return d;
                            })
                          );
                        }}
                        className="text-xs w-5 font-body text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setDays(prevDays =>
                        prevDays.map((d, idx) => {
                          if (idx === dayIndex) {
                            const updatedCrew = [...(d.crew || []), { name: '', roles: [] }];
                            return { ...d, crew: updatedCrew };
                          }
                          return d;
                        })
                      );
                    }}
                    className="text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer rounded-xl p-px outline-none font-body text-xs font-thin w-20"
                  >
                    Add Crew
                  </button>
                </div> */}

                <div className="relative w-full mb-2">
                  {Array.isArray(day.images) && day.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {day.images.map((src, pIdx) => (
                        <div key={pIdx} className="relative w-20 h-20 border border-gray-400 rounded-lg overflow-hidden">
                          <img src={src} alt={`photo-${pIdx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-light text-dark rounded-full w-5 h-5 text-xs"
                            title="Remove"
                            onClick={() => {
                              setDays(prev => prev.map((d, idx) => {
                                if (idx !== dayIndex) return d;
                                const next = [...(d.images || [])];
                                next.splice(pIdx, 1);
                                return { ...d, images: next };
                              }));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note & Total */}
                <main className="w-full mt-2">
                  <section className="flex items-center gap-1">
                    <textarea
                      placeholder="Note"
                      value={day.note}
                      onChange={(e) => {
                        setDays(prevDays => prevDays.map((d, idx) =>
                          idx === dayIndex ? { ...d, note: e.target.value } : d
                        ));
                      }}
                      className="h-full w-2/3 glass rounded-xl border border-gray-400 outline-none p-2"
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

            </main>
          ))}
          <button
            type="button"
            className="w-20 m-1 rounded-xl text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center font-body text-xs font-thin"
            onClick={addDay}
          >
            Add Day
          </button>
        </form>
      </main>
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed top-0 left-0 z-50 glass w-full h-full flex items-center justify-center">
          <section className="bg-dark border border-light/50 rounded-lg p-5 text-light flex flex-col justify-center items-center w-xl h-48">
            <p className="text-center font-body mb-4">
              Are you sure you want to delete this day? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-5 w-full">
              <button
                className="w-20 h-10 border border-light text-light rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                onClick={() => setDeleteConfirm({ show: false, dayIndex: null })}
              >
                Cancel
              </button>
              <button
                className="w-20 h-10 bg-light text-dark rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                onClick={handleDeleteDay}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}

      <div style={{ position: "absolute", left: "-9999px", top: 0 }} ref={printRef}>
        <PrintLayout pro={pro} days={days} />
      </div>
    </main>
  );
};

export default Report;
