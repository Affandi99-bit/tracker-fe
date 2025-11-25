import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useToast } from '../components/micro-components/ToastContext';
import { ErrorBoundary, PDFDocument } from "../components";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { pdf } from '@react-pdf/renderer';
import { useRoleProduction, useRoleMotion, useRoleDesign, useRoleDocs, crewImport, useHasPermission } from '../hook';

const ImageZoomModal = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img
          src={src}
          alt="Zoomed"
          className="object-contain max-w-full max-h-[90vh]"
        />
        <button
          className="absolute -top-4 -right-4 bg-light text-dark rounded-full w-8 h-8 text-xl font-bold hover:scale-110 transition-transform"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};
const ReportComponent = ({ pro: initialPro, updateData }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const canAccessReport = useHasPermission("report");
  const [pro, setPro] = useState(initialPro || {});
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, dayIndex: null });
  const [crewDeleteConfirm, setCrewDeleteConfirm] = useState({ show: false, dayIndex: null, crewIndex: null });
  const roleProduction = useRoleProduction();
  const roleMotion = useRoleMotion();
  const roleDesign = useRoleDesign();
  const roleDocs = useRoleDocs();

  // Determine which role list to use based on first checked category (same logic as CreateModal)
  const selectedRoleList = useMemo(() => {
    const firstCategory = pro?.categories?.[0];

    if (!firstCategory) {
      return roleProduction; // Default to Production if no category selected
    }

    switch (firstCategory) {
      case "Produksi":
        return roleProduction;
      case "Dokumentasi":
        return roleDocs;
      case "Motion":
        return roleMotion;
      case "Design":
        return roleDesign;
      default:
        return roleProduction; // Default fallback
    }
  }, [pro?.categories, roleProduction, roleMotion, roleDesign, roleDocs]);

  // Check privilege - if user doesn't have access, show message and close
  useEffect(() => {
    if (!canAccessReport) {
      showToast("You don't have permission to access this feature", "error");
      navigate(-1);
    }
  }, [canAccessReport, showToast, navigate]);

  if (!canAccessReport) {
    return null;
  }
  const baseCrewData = crewImport();
  // Transform crew data from {id, name} to {name, roles: []} format
  const baseCrew = useMemo(() => {
    return baseCrewData.map(c => ({ name: c.name, roles: [] }));
  }, [baseCrewData]);

  // Merge global crew list with any custom crew names found in the project's days (from CreateModal)
  const crewOptions = useMemo(() => {
    const base = Array.isArray(baseCrew) ? baseCrew : [];
    const baseNames = new Set(base.map(c => c?.name).filter(Boolean));
    const customNames = new Set(
      (Array.isArray(days) ? days : [])
        .flatMap(d => Array.isArray(d?.crew) ? d.crew : [])
        .map(c => c?.name)
        .filter(Boolean)
    );
    const allNames = new Set([...baseNames, ...customNames]);
    return Array.from(allNames)
      .map(name => ({ name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [days, baseCrew]);

  // Collect all unique roles/jobdesk from all crew members across all days
  const availableRoles = useMemo(() => {
    const roleSet = new Set();
    (Array.isArray(days) ? days : []).forEach(day => {
      if (Array.isArray(day?.crew)) {
        day.crew.forEach(crewMember => {
          if (Array.isArray(crewMember?.roles)) {
            crewMember.roles.forEach(role => {
              if (role && role.trim()) {
                roleSet.add(role.trim());
              }
            });
          }
        });
      }
    });
    return Array.from(roleSet).sort((a, b) => a.localeCompare(b));
  }, [days]);


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

        // Note: Order list does not contribute to budget chart (no price field in model)
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
    const totalExpenses = days.reduce((acc, day) => {
      // Calculate expenses for each day including pre/post production
      const dayExpenses = calculateTotalExpenses(day);
      return acc + dayExpenses;
    }, 0);

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
              {/* Order List removed from chart */}
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
                  {(() => {
                    const allCrew = (Array.isArray(days) ? days : [])
                      .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
                    // Group crew by name and merge roles across all days
                    const groupedByName = allCrew.reduce((acc, member) => {
                      if (!member || !member.name) return acc;
                      const key = member.name;
                      const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                      if (!acc[key]) acc[key] = new Set();
                      roles.forEach(r => acc[key].add(r));
                      return acc;
                    }, {});
                    const crewListDisplay = Object.entries(groupedByName)
                      .map(([name, roleSet]) => ({ name, roles: Array.from(roleSet) }))
                      .sort((a, b) => a.name.localeCompare(b.name));
                    const pmNames = crewListDisplay
                      .filter(c => (c.roles || []).some(r => (r || '').toLowerCase() === 'project manager'))
                      .map(c => c.name);
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-light/90 font-medium">Project Manager:</span>
                          <span className="text-light font-semibold">
                            {pmNames.length ? pmNames.join(", ") : "No Project Manager"}
                          </span>
                        </div>
                        <div className="">
                          <span className="text-light/90 font-medium">Crew:</span>
                          <span className="text-light/60 font-semibold">
                            {crewListDisplay.length ? (
                              crewListDisplay.map((item, index) => (
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
                    );
                  })()}
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
                {(() => {
                  const allCrew = (Array.isArray(days) ? days : [])
                    .flatMap(d => (Array.isArray(d?.crew) ? d.crew : []));
                  // Group crew by name and merge roles across all days
                  const groupedByName = allCrew.reduce((acc, member) => {
                    if (!member || !member.name) return acc;
                    const key = member.name;
                    const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean) : [];
                    if (!acc[key]) acc[key] = new Set();
                    roles.forEach(r => acc[key].add(r));
                    return acc;
                  }, {});
                  const crewListDisplay = Object.entries(groupedByName)
                    .map(([name, roleSet]) => ({ name, roles: Array.from(roleSet) }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                  const pmNames = crewListDisplay
                    .filter(c => (c.roles || []).some(r => (r || '').toLowerCase() === 'project manager'))
                    .map(c => c.name);
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-light/90 font-medium">Project Manager:</span>
                        <span className="text-light font-semibold">
                          {pmNames.length ? pmNames.join(", ") : "No Project Manager"}
                        </span>
                      </div>
                      <div className="">
                        <span className="text-light/90 font-medium">Crew:</span>
                        <span className="text-light/60 font-semibold">
                          {crewListDisplay.length ? (
                            crewListDisplay.map((item, index) => (
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
                  );
                })()}
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
    try {
      // Generate PDF using react-pdf
      const blob = await pdf(<PDFDocument pro={pro} days={days} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Berita Acara ${pro?.title || "Project"}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("PDF exported successfully", "success");
    } catch (error) {
      console.error("PDF export error:", error);
      showToast("Failed to export PDF", "error");
    }
  };


  //   pdf.save(`Berita Acara ${pro?.title || "Project"}.pdf`);
  //   showToast("PDF exported successfully", "success");
  // } catch (error) {
  //   console.error("PDF export error:", error);
  //   showToast("Failed to export PDF", "error");
  // }
  // Track if we've initialized days to prevent resetting on subsequent initialPro changes
  const [daysInitialized, setDaysInitialized] = useState(false);

  useEffect(() => {
    // Only initialize days once when initialPro is first loaded and days haven't been initialized
    if (initialPro && !daysInitialized && days.length === 0) {
      // Use createdAt as start when available
      setPro({ ...initialPro, start: initialPro.createdAt || initialPro.start });

      // Determine template from project categories (same logic as CreateModal)
      // Production template is true for "Produksi" and "Dokumentasi", false for "Motion" and "Design"
      const firstCategory = initialPro.categories?.[0];
      const isProductionTemplate = firstCategory ? ["Produksi", "Dokumentasi"].includes(firstCategory) : true;

      let projectDays = initialPro.day?.map((day, index) => {
        const dayTemplate = day.template !== undefined ? day.template : isProductionTemplate;

        return {
          ...day,
          id: day.id || `day-${index}-${Date.now()}-${Math.random()}`, // Preserve existing ID or create stable one
          expense: {
            rent: day.expense?.rent || [],
            operational: day.expense?.operational || [],
            orderlist: day.expense?.orderlist || [],
          },
          images: Array.isArray(day.images) ? day.images : [],
          backup: day.backup || [],
          crew: (day.crew || []).map(c => ({
            name: c.name || '',
            roles: Array.isArray(c.roles) ? c.roles : (c.roles ? [c.roles] : []),
            overtime: Array.isArray(c.overtime)
              ? c.overtime
              : (c.overtime && typeof c.overtime === 'object')
                ? [{ job: c.overtime.job || '', date: c.overtime.date || '', hour: c.overtime.hour || 0 }]
                : []
          })),
          note: day.note || '',
          totalExpenses: day.totalExpenses || 0,
          template: dayTemplate,
          date: day.date || '',
          dayNumber: day.dayNumber || (index + 1),
        };
      }) || [];

      // Ensure proper day numbering
      const numberedDays = ensureDayNumbering(projectDays);
      // Assign dates only for missing ones, starting from start/createdAt
      const baseDateStr = (initialPro.createdAt || initialPro.start) || '';
      const withDates = assignSequentialDates(numberedDays, baseDateStr);
      setDays(withDates);
      setDaysInitialized(true);
    }
  }, [initialPro, daysInitialized, days.length]);

  // Monitor template changes to ensure they are preserved
  useEffect(() => {
    // Check if all days have the same template
    if (days.length > 1) {
      const templates = days.map(d => d.template);
      const uniqueTemplates = [...new Set(templates)];
      if (uniqueTemplates.length > 1 && process.env.NODE_ENV === 'development') {
        console.warn('Warning: Days have different templates:', templates);
      }
    }
  }, [days]);

  // Ensure day numbering is always correct - only when days array changes length
  useEffect(() => {
    if (days.length > 0 && daysInitialized) {
      const numberedDays = ensureDayNumbering(days);
      // Only update if there are actual differences in day numbers
      const hasNumberingChanges = numberedDays.some((day, index) =>
        day.dayNumber !== days[index]?.dayNumber
      );

      if (hasNumberingChanges) {
        setDays(numberedDays);
      }
    }
  }, [days.length, daysInitialized]); // Only depend on array length, not the entire array

  // Note: Day 0 crew is a reference only; do not auto-sync other days.

  // Recompute sequential dates when start changes or number of days changes
  useEffect(() => {
    if (!pro?.start || !days.length || !daysInitialized) return;
    setDays(prev => assignSequentialDates(prev, formatDate(pro.start)));
  }, [pro?.start, days.length, daysInitialized]);
  const addDay = () => {
    // Get the template from existing days or determine from project categories (same logic as CreateModal)
    const firstCategory = pro?.categories?.[0];
    const defaultTemplate = firstCategory ? ["Produksi", "Dokumentasi"].includes(firstCategory) : true;
    const existingTemplate = days.length > 0 ? days[0].template : defaultTemplate;

    const newDay = {
      id: `day-new-${Date.now()}-${Math.random()}`, // Stable unique ID
      crew: (days.length > 0 && Array.isArray(days[0]?.crew) ? days[0].crew.map(c => ({
        name: c?.name || '',
        roles: Array.isArray(c?.roles) ? [...c.roles] : [], // Preserve roles when copying
        overtime: Array.isArray(c?.overtime) ? c.overtime.map(ot => ({ ...ot })) : []
      })) : []),
      expense: { rent: [], operational: [], orderlist: [] },
      images: [],
      note: '',
      totalExpenses: 0,
      template: existingTemplate,
      date: '',
      backup: [],
    };
    // Insert the new day BEFORE the final day to keep last as Post-Production
    // If there's only 1 day, insert after it (at index 1) to preserve day[0]
    // If there are multiple days, insert before the last one
    const insertIndex = days.length === 1 ? 1 : Math.max(1, days.length - 1);

    // Deep clone existing days to prevent mutations - preserve all data including IDs
    const clonedDays = days.map(day => ({
      ...day,
      id: day.id || `day-${Date.now()}-${Math.random()}`, // Preserve existing ID
      crew: (day.crew || []).map(member => ({
        ...member,
        name: member.name || '',
        roles: Array.isArray(member.roles) ? [...member.roles] : [],
        overtime: Array.isArray(member.overtime) ? member.overtime.map(ot => ({ ...ot })) : []
      })),
      expense: {
        rent: (day.expense?.rent || []).map(item => ({ ...item })),
        operational: (day.expense?.operational || []).map(item => ({ ...item })),
        orderlist: (day.expense?.orderlist || []).map(item => ({ ...item }))
      },
      images: Array.isArray(day.images) ? [...day.images] : [],
      backup: (day.backup || []).map(item => ({ ...item })),
      note: day.note || '',
      date: day.date || '',
      totalExpenses: day.totalExpenses || 0,
      template: day.template !== undefined ? day.template : existingTemplate,
    }));

    const newDays = [
      ...clonedDays.slice(0, insertIndex),
      newDay,
      ...clonedDays.slice(insertIndex)
    ];

    // Ensure proper day numbering for all days
    const numberedDays = ensureDayNumbering(newDays);
    const withDates = assignSequentialDates(numberedDays, formatDate(pro?.start));
    setDays(withDates);
  };

  // Function to ensure proper day numbering
  const ensureDayNumbering = (daysArray) => {
    return daysArray.map((day, index) => ({ ...day, dayNumber: index + 1 }));
  };

  // Assign sequential dates starting from startDateStr (YYYY-MM-DD) for days with empty date only
  const assignSequentialDates = (daysArray, startDateStr) => {
    if (!startDateStr) return daysArray;
    const startDate = new Date(startDateStr);
    if (isNaN(startDate)) return daysArray;
    return daysArray.map((day, index) => {
      if (day?.date) return day; // keep user edits
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + index);
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      return { ...day, date: `${yyyy}-${mm}-${dd}` };
    });
  };

  // Function to show delete confirmation
  const showDeleteConfirm = (dayIndex) => {
    setDeleteConfirm({ show: true, dayIndex });
  };

  // Function to delete a day
  const handleDeleteDay = () => {
    const dayIndexToDelete = deleteConfirm.dayIndex;

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
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
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
    }).catch((error) => {
      console.error('Error processing images:', error);
      showToast(`Failed to process some images: ${error.message}`, "error");
    });
  };

  // Add expense item
  const handleAddExpense = (dayIndex, type) => {
    setDays(prevDays =>
      prevDays.map((day, idx) => {
        if (idx === dayIndex) {
          let newItem;
          if (type === "operational") {
            newItem = { name: "", price: "", qty: "", category: "", note: "" };
          } else if (type === "rent") {
            newItem = { name: "", price: "", qty: "", note: "" };
          } else if (type === "orderlist") {
            newItem = { name: "", qty: "", crew: { name: "", role: "" }, note: "" };
          } else {
            newItem = { name: "" };
          }
          return {
            ...day,
            expense: {
              ...day.expense,
              [type]: [...day.expense[type], newItem],
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
          const updatedExpenses = day.expense[type].map((expense, i) => {
            if (i !== expenseIndex) return expense;
            // Special handling for nested crew fields in orderlist
            if (type === "orderlist") {
              if (field === "crewName") {
                const nextCrew = { ...(expense.crew || { name: "", role: "" }), name: value };
                return { ...expense, crew: nextCrew };
              }
              if (field === "crewRole") {
                const nextCrew = { ...(expense.crew || { name: "", role: "" }), role: value };
                return { ...expense, crew: nextCrew };
              }
            }
            return { ...expense, [field]: value };
          });
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
        start: pro.start,
        total: days.reduce((acc, day) => acc + (day.totalExpenses || 0), 0),
        day: days.map((day) => ({
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
      // Preserve existing IDs to maintain component identity
      const rebuiltDays = (updatedPro.day || []).map((d, idx) => {
        // Try to find existing day with same index to preserve ID
        const existingDay = days[idx];
        return {
          ...d,
          id: existingDay?.id || `day-${idx}-${Date.now()}-${Math.random()}`, // Preserve existing ID
          expense: {
            rent: d.expense?.rent || [],
            operational: d.expense?.operational || [],
            orderlist: d.expense?.orderlist || [],
          },
          images: Array.isArray(d.images) ? d.images : [],
          backup: d.backup || [],
          crew: (d.crew || []).map(c => ({
            name: c.name || '',
            roles: Array.isArray(c.roles) ? c.roles : (c.roles ? [c.roles] : []),
            overtime: Array.isArray(c.overtime)
              ? c.overtime
              : (c.overtime && typeof c.overtime === 'object')
                ? [{ job: c.overtime.job || '', date: c.overtime.date || '', hour: c.overtime.hour || 0 }]
                : []
          })),
          note: d.note || '',
          date: d.date || '',
          template: d.template === undefined ? true : d.template,
        };
      });
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
    <main className="fixed top-0 left-0 z-40 bg-dark text-light w-full h-screen flex flex-col items-start">
      {/* Navbar */}
      <nav className="flex justify-between px-10 font-body text-sm tracking-wider items-center w-full h-10 border-b border-light">
        <button
          type="button"
          className="flex gap-1 items-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
          onClick={() => navigate(-1)}
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
              value={formatDate(pro?.start)}
              onChange={e => handleInputChange('start', e.target.value)}
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
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full">
          {/* Data per Day */}
          {days.map((day, dayIndex) => (
            <main key={day.id || `day-${dayIndex}`} className="w-full p-1 flex items-center gap-1 min-h-64">

              {/* Expenses section */}
              <section className="rounded-xl glass p-5 border h-full border-gray-400 flex flex-col gap-1 font-body text-xs font-thin w-full">
                {/* Day Header */}
                <div className="relative w-full flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-light tracking-wider">
                    {(() => {
                      const firstCategory = pro?.categories?.[0];
                      const isMotionOrDesign = firstCategory === "Motion" || firstCategory === "Design";

                      if (isMotionOrDesign) {
                        // For Motion/Design projects, just show day numbers
                        return `Day ${day.dayNumber || dayIndex + 1}`;
                      } else {
                        // For Production/Documentation projects, show Pre/Post-Production
                        return dayIndex === 0
                          ? 'Pre-Production'
                          : dayIndex === days.length - 1
                            ? 'Post-Production'
                            : `Day ${dayIndex}`;
                      }
                    })()}
                  </h3>
                  <div className="flex items-center gap-2">
                    <input type="date" value={day.date}
                      onChange={(e) => {
                        setDays(prevDays => prevDays.map((d, idx) =>
                          idx === dayIndex ? { ...d, date: e.target.value } : d
                        ));
                      }} className="text-xs text-light/80 font-medium outline-none" />
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
                    {/* Delete Day Button */}
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
                    {/* Crew Management */}
                    <div className="w-full mt-2">
                      <p className="font-body text-xs font-thin tracking-widest">
                        Crew & Jobdesk
                      </p>
                      {day.crew?.map((crewMember, crewIndex) => (
                        <div key={crewIndex} className="flex items-center gap-1 mb-2">
                          <select
                            value={crewMember.name || ''}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              setDays(prevDays =>
                                prevDays.map((d, idx) => {
                                  if (idx === dayIndex) {
                                    const updatedCrew = [...(d.crew || [])];
                                    const isDuplicate = updatedCrew.some((c, i) => i !== crewIndex && (c?.name || '') === selectedName);
                                    if (isDuplicate) {
                                      showToast("Crew name already selected on this day", "error");
                                      return d;
                                    }
                                    if (crewIndex >= 0 && crewIndex < updatedCrew.length && updatedCrew[crewIndex]) {
                                      updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], name: selectedName };
                                    }
                                    return { ...d, crew: updatedCrew };
                                  }
                                  return d;
                                })
                              );
                            }}
                            className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                          >
                            <option className="bg-dark text-light" value="">Select Crew</option>
                            {(Array.isArray(crewOptions) ? crewOptions : [])
                              .filter((c) => c && c.name)
                              .map((c, i) => (
                                <option key={i} className="bg-dark text-light" value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                          <p className="font-body text-xs font-thin tracking-widest mb-2">as</p>
                          {/* Crew roles - multiple rows with +/- controls */}
                          <div className="flex flex-row gap-1">
                            {(Array.isArray(crewMember.roles) && crewMember.roles.length ? crewMember.roles : ['']).map((roleValue, roleIdx) => (
                              <div key={roleIdx} className="flex items-center gap-1">
                                <select
                                  value={roleValue || ''}
                                  onChange={(e) => {
                                    const selectedRole = e.target.value;
                                    // Enforce single Project Manager across the whole project
                                    if ((selectedRole || '').toLowerCase() === 'project manager') {
                                      const hasPmElsewhere = (Array.isArray(days) ? days : []).some((d, dIdx) =>
                                        Array.isArray(d?.crew) && d.crew.some((m, mIdx) => {
                                          if (!m) return false;
                                          // allow if the same member already has PM
                                          const sameMember = dIdx === dayIndex && mIdx === crewIndex;
                                          const roles = Array.isArray(m.roles) ? m.roles : [];
                                          return roles.some(r => (r || '').toLowerCase() === 'project manager') && !sameMember;
                                        })
                                      );
                                      if (hasPmElsewhere) {
                                        showToast('Project Manager already selected', 'error');
                                        return;
                                      }
                                    }
                                    setDays(prevDays =>
                                      prevDays.map((d, idx) => {
                                        if (idx === dayIndex) {
                                          const updatedCrew = [...(d.crew || [])];
                                          if (crewIndex >= 0 && crewIndex < updatedCrew.length && updatedCrew[crewIndex]) {
                                            const currentRoles = Array.isArray(updatedCrew[crewIndex].roles) ? [...updatedCrew[crewIndex].roles] : [];
                                            currentRoles[roleIdx] = selectedRole;
                                            updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], roles: currentRoles };
                                          }
                                          return { ...d, crew: updatedCrew };
                                        }
                                        return d;
                                      })
                                    );
                                  }}
                                  className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                                >
                                  <option className="bg-dark text-light" value="">Select Jobdesk</option>
                                  {[...selectedRoleList]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(roleOption => (
                                      <option key={roleOption.id} value={roleOption.name} className="text-light bg-dark">
                                        {roleOption.name}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDays(prevDays =>
                                      prevDays.map((d, idx) => {
                                        if (idx === dayIndex) {
                                          const updatedCrew = [...(d.crew || [])];
                                          if (crewIndex >= 0 && crewIndex < updatedCrew.length && updatedCrew[crewIndex]) {
                                            const currentRoles = Array.isArray(updatedCrew[crewIndex].roles) ? [...updatedCrew[crewIndex].roles] : [];
                                            currentRoles.splice(roleIdx, 1);
                                            updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], roles: currentRoles };
                                          }
                                          return { ...d, crew: updatedCrew };
                                        }
                                        return d;
                                      })
                                    );
                                  }}
                                  className="text-xs font-body text-red-400 hover:text-red-300"
                                >
                                  -
                                </button>
                              </div>
                            ))}
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => {
                                  setDays(prevDays =>
                                    prevDays.map((d, idx) => {
                                      if (idx === dayIndex) {
                                        const updatedCrew = [...(d.crew || [])];
                                        const currentRoles = Array.isArray(updatedCrew[crewIndex].roles) ? [...updatedCrew[crewIndex].roles] : [];
                                        currentRoles.push('');
                                        updatedCrew[crewIndex] = { ...updatedCrew[crewIndex], roles: currentRoles };
                                        return { ...d, crew: updatedCrew };
                                      }
                                      return d;
                                    })
                                  );
                                }}
                                className="text-xs w-5 rounded-t-md bg-zinc-800 hover:bg-zinc-900 text-light"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => setCrewDeleteConfirm({ show: true, dayIndex, crewIndex })}
                                className="text-xs w-5 rounded-b-md bg-zinc-800 hover:bg-zinc-900 text-light"
                              >
                                x
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setDays(prevDays =>
                            prevDays.map((d, idx) => {
                              if (idx === dayIndex) {
                                const updatedCrew = [...(d.crew || []), { name: '', roles: [], overtime: [] }];
                                return { ...d, crew: updatedCrew };
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
                    <p className="font-body text-xs font-thin tracking-widest mt-2">Shoplist</p>
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
                        {/* Crew name select */}
                        <select
                          value={order.crew?.name || ""}
                          onChange={(e) =>
                            handleExpenseChange(
                              dayIndex,
                              "orderlist",
                              index,
                              "crewName",
                              e.target.value
                            )
                          }
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                        >
                          <option className="bg-dark text-light" value="">Select Crew</option>
                          {(Array.isArray(crewOptions) ? crewOptions : [])
                            .filter((c) => c && c.name)
                            .map((c, i) => (
                              <option key={i} className="bg-dark text-light" value={c.name}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        {/* Crew roles */}
                        <select
                          value={order.crew?.role || ""}
                          onChange={(e) =>
                            handleExpenseChange(
                              dayIndex,
                              "orderlist",
                              index,
                              "crewRole",
                              e.target.value
                            )
                          }
                          className="border border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
                        >
                          <option className="bg-dark text-light" value="">Select Jobdesk</option>
                          {Array.isArray(selectedRoleList) && selectedRoleList.length > 0 ? (
                            [...selectedRoleList]
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(roleOption => (
                                <option key={roleOption.id} value={roleOption.name} className="text-light bg-dark">
                                  {roleOption.name}
                                </option>
                              ))
                          ) : (
                            <option className="bg-dark text-light" value="" disabled>Loading jobdesk...</option>
                          )}
                        </select>
                        <input
                          className="border w-28 border-gray-400 glass px-1 rounded-xl p-px outline-none m-1 font-body text-xs font-thin"
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

                {/* Images */}
                <div className="relative w-full mb-2">
                  {Array.isArray(day.images) && day.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {day.images.map((src, pIdx) => (
                        <div key={pIdx} className="relative w-20 h-20 border border-gray-400 rounded-lg overflow-hidden">
                          <img
                            src={src}
                            alt={`photo-${pIdx + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(src)}
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-light text-dark rounded-full w-5 h-5 text-xs"
                            title="Remove"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent image zoom when clicking delete
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
                        value={calculateTotalExpenses(day)}
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
            className="w-20 h-12 m-1 rounded-xl text-dark bg-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex items-center justify-center font-body text-xs font-thin"
            onClick={addDay}
          >
            + Add Day
          </button>
          {/* Overtime feature */}
          <section className="glass p-4 m-1 w-full h-full rounded-xl font-body text-sm tracking-wider border border-light/50">
            <p className="pb-4 text-xl font-semibold text-light tracking-wider">Overtime</p>

            {/* Overtime Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-light/50">
                    <th className="text-left py-2 px-3 text-light font-semibold text-sm">Name</th>
                    <th className="text-left py-2 px-3 text-light font-semibold text-sm">Jobdesk</th>
                    <th className="text-left py-2 px-3 text-light font-semibold text-sm">Date</th>
                    <th className="text-left py-2 px-3 text-light font-semibold text-sm">Overtime (hours)</th>
                    <th className="text-left py-2 px-3 text-light font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Collect all unique crew members across all days
                    const crewMap = new Map();

                    days.forEach((day, dayIndex) => {
                      if (!day.crew || day.crew.length === 0) return;

                      day.crew.forEach((crewMember, crewIdx) => {
                        if (!crewMember.name) return;

                        const crewKey = `${crewMember.name}`;
                        if (!crewMap.has(crewKey)) {
                          crewMap.set(crewKey, {
                            name: crewMember.name,
                            roles: new Set(),
                            overtime: [],
                            dayTemplate: day.template
                          });
                        }

                        // Merge roles from all days for this crew member
                        const existingCrew = crewMap.get(crewKey);
                        const memberRoles = Array.isArray(crewMember.roles) ? crewMember.roles : [];
                        memberRoles.forEach(role => {
                          if (role && role.trim()) {
                            existingCrew.roles.add(role.trim());
                          }
                        });

                        // Merge overtime entries from this day with metadata
                        const overtimeEntries = Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0
                          ? crewMember.overtime.map((entry, otIdx) => ({ ...entry, _dayIndex: dayIndex, _crewIndex: crewIdx, _otIndex: otIdx }))
                          : [];

                        existingCrew.overtime.push(...overtimeEntries);
                      });
                    });

                    // Convert role Sets to Arrays for easier use
                    crewMap.forEach((crewMember) => {
                      crewMember.roles = Array.from(crewMember.roles).sort((a, b) => a.localeCompare(b));
                    });

                    // Render rows for each unique crew member
                    // Only show actual overtime entries, not empty defaults
                    return Array.from(crewMap.values()).flatMap((crewMember, crewIdx) => {
                      const overtimeEntries = crewMember.overtime;

                      // If no overtime entries, show an empty row with just an Add button
                      if (overtimeEntries.length === 0) {
                        return (
                          <tr key={`${crewMember.name}-${crewIdx}-empty`} className="border-b border-light/20 hover:bg-light/5 transition-colors">
                            <td className="py-2 px-3 text-light/80 text-xs">
                              {crewMember.name || 'Unnamed'}
                            </td>
                            <td className="py-2 px-3">
                              <select disabled className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs bg-transparent text-light opacity-50">
                                <option>No overtime entries</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input type="date" disabled className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent opacity-50" />
                            </td>
                            <td className="py-2 px-3">
                              <input type="number" disabled className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs w-20 text-light opacity-50" />
                            </td>
                            <td className="py-2 px-3">
                              <button
                                type="button"
                                onClick={() => {
                                  // Find the first day where this crew member appears
                                  setDays(prevDays => {
                                    let found = false;
                                    return prevDays.map((day, dayIdx) => {
                                      if (found) return day; // Already added, skip other days

                                      const memberIndex = (day.crew || []).findIndex(m => m?.name === crewMember.name);
                                      if (memberIndex !== -1) {
                                        found = true; // Mark as found so we only add to first occurrence
                                        const updatedCrew = [...(day.crew || [])];
                                        const member = updatedCrew[memberIndex];
                                        const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                        // Add only one overtime entry
                                        currentOvertime.push({ job: '', date: day.date || '', hour: '' });
                                        updatedCrew[memberIndex] = { ...member, overtime: currentOvertime };
                                        return { ...day, crew: updatedCrew };
                                      }
                                      return day;
                                    });
                                  });
                                }}
                                className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-light cursor-pointer"
                                title="Add overtime entry"
                              >
                                +
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return overtimeEntries.map((overtimeEntry, overtimeIdx) => (
                        <tr key={`${crewMember.name}-${crewIdx}-${overtimeIdx}`} className="border-b border-light/20 hover:bg-light/5 transition-colors">
                          <td className="py-2 px-3 text-light/80 text-xs">
                            {overtimeIdx === 0 ? (crewMember.name || 'Unnamed') : ''}
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={overtimeEntry.job || ''}
                              onChange={(e) => {
                                // Update specific overtime entry using tracked indices
                                const dayIdx = overtimeEntry._dayIndex;
                                const crewIdx = overtimeEntry._crewIndex;
                                const otIdx = overtimeEntry._otIndex;
                                setDays(prevDays =>
                                  prevDays.map((day, idx) => {
                                    if (idx === dayIdx) {
                                      return {
                                        ...day,
                                        crew: (day.crew || []).map((member, mIdx) => {
                                          if (mIdx === crewIdx) {
                                            const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                            // Update the specific overtime entry
                                            currentOvertime[otIdx] = {
                                              ...currentOvertime[otIdx],
                                              job: e.target.value
                                            };
                                            return { ...member, overtime: currentOvertime };
                                          }
                                          return member;
                                        })
                                      };
                                    }
                                    return day;
                                  })
                                );
                              }}
                              className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs bg-transparent text-light"
                            >
                              <option className="bg-dark text-light" value="">Select Jobdesk</option>
                              {crewMember.roles && crewMember.roles.length > 0 ? (
                                crewMember.roles.map((roleName, idx) => (
                                  <option key={idx} value={roleName} className="text-light bg-dark">
                                    {roleName}
                                  </option>
                                ))
                              ) : (
                                <option className="text-light bg-dark" disabled>No jobdesk assigned yet</option>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              value={overtimeEntry.date || ''}
                              onChange={(e) => {
                                // Update specific overtime entry using tracked indices
                                const dayIdx = overtimeEntry._dayIndex;
                                const crewIdx = overtimeEntry._crewIndex;
                                const otIdx = overtimeEntry._otIndex;
                                setDays(prevDays =>
                                  prevDays.map((day, idx) => {
                                    if (idx === dayIdx) {
                                      return {
                                        ...day,
                                        crew: (day.crew || []).map((member, mIdx) => {
                                          if (mIdx === crewIdx) {
                                            const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                            // Update the specific overtime entry
                                            currentOvertime[otIdx] = {
                                              ...currentOvertime[otIdx],
                                              date: e.target.value
                                            };
                                            return { ...member, overtime: currentOvertime };
                                          }
                                          return member;
                                        })
                                      };
                                    }
                                    return day;
                                  })
                                );
                              }}
                              className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs text-light bg-transparent"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              value={overtimeEntry.hour || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Update specific overtime entry using tracked indices
                                const dayIdx = overtimeEntry._dayIndex;
                                const crewIdx = overtimeEntry._crewIndex;
                                const otIdx = overtimeEntry._otIndex;
                                setDays(prevDays =>
                                  prevDays.map((day, idx) => {
                                    if (idx === dayIdx) {
                                      return {
                                        ...day,
                                        crew: (day.crew || []).map((member, mIdx) => {
                                          if (mIdx === crewIdx) {
                                            const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                            // Update the specific overtime entry
                                            currentOvertime[otIdx] = {
                                              job: currentOvertime[otIdx]?.job || '',
                                              date: currentOvertime[otIdx]?.date || '',
                                              hour: value
                                            };
                                            return { ...member, overtime: currentOvertime };
                                          }
                                          return member;
                                        })
                                      };
                                    }
                                    return day;
                                  })
                                );
                              }}
                              className="border border-gray-400 glass px-2 rounded-xl p-1 outline-none font-body text-xs w-20 text-light"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              {/* Add button - only show on first overtime entry of each crew member */}
                              {overtimeIdx === 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Find the first day where this crew member appears and add one entry
                                    setDays(prevDays => {
                                      let found = false;
                                      return prevDays.map((day, dayIdx) => {
                                        if (found) return day; // Already added, skip other days

                                        const memberIndex = (day.crew || []).findIndex(m => m?.name === crewMember.name);
                                        if (memberIndex !== -1) {
                                          found = true; // Mark as found so we only add to first occurrence
                                          const updatedCrew = [...(day.crew || [])];
                                          const member = updatedCrew[memberIndex];
                                          const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                          // Add only one overtime entry
                                          currentOvertime.push({ job: '', date: day.date || '', hour: '' });
                                          updatedCrew[memberIndex] = { ...member, overtime: currentOvertime };
                                          return { ...day, crew: updatedCrew };
                                        }
                                        return day;
                                      });
                                    });
                                  }}
                                  className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-light cursor-pointer"
                                  title="Add overtime entry"
                                >
                                  +
                                </button>
                              )}
                              {/* Delete button - show when there are multiple entries or when hour > 0 */}
                              {(overtimeEntries.length > 1 || (parseFloat(overtimeEntry.hour || '0') > 0) || overtimeEntry.job) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Delete specific overtime entry using tracked indices
                                    const dayIdx = overtimeEntry._dayIndex;
                                    const crewIdx = overtimeEntry._crewIndex;
                                    const otIdx = overtimeEntry._otIndex;
                                    setDays(prevDays =>
                                      prevDays.map((day, idx) => {
                                        if (idx === dayIdx) {
                                          return {
                                            ...day,
                                            crew: (day.crew || []).map((member, mIdx) => {
                                              if (mIdx === crewIdx) {
                                                const currentOvertime = Array.isArray(member.overtime) ? [...member.overtime] : [];
                                                currentOvertime.splice(otIdx, 1);
                                                return { ...member, overtime: currentOvertime };
                                              }
                                              return member;
                                            })
                                          };
                                        }
                                        return day;
                                      })
                                    );
                                  }}
                                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                                  title="Delete overtime entry"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ));
                    });
                  })()}
                </tbody>
              </table>

              {/* Empty state */}
              {days.every(day => !day.crew || day.crew.length === 0) && (
                <div className="text-center py-8 text-light/60">
                  <p className="text-sm">No crew members assigned yet</p>
                </div>
              )}
            </div>
          </section>
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
      {crewDeleteConfirm.show && (
        <div className="fixed top-0 left-0 z-50 glass w-full h-full flex items-center justify-center">
          <section className="bg-dark border border-light/50 rounded-lg p-5 text-light flex flex-col justify-center items-center w-xl h-48">
            <p className="text-center font-body mb-4">
              Are you sure you want to delete this crew? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-5 w-full">
              <button
                className="w-20 h-10 border border-light text-light rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                onClick={() => setCrewDeleteConfirm({ show: false, dayIndex: null, crewIndex: null })}
              >
                Cancel
              </button>
              <button
                className="w-20 h-10 bg-light text-dark rounded-xl hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                onClick={() => {
                  const { dayIndex, crewIndex } = crewDeleteConfirm;
                  setDays(prevDays => prevDays.map((d, idx) => {
                    if (idx === dayIndex) {
                      const updatedCrew = [...(d.crew || [])];
                      updatedCrew.splice(crewIndex, 1);
                      return { ...d, crew: updatedCrew };
                    }
                    return d;
                  }));
                  setCrewDeleteConfirm({ show: false, dayIndex: null, crewIndex: null });
                  showToast("Crew deleted successfully", "success");
                }}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
      {selectedImage && (
        <ImageZoomModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

    </main>
  );
};

const Report = ({ setShowReportGenerator, pro: initialPro, updateData }) => {
  return (
    <ErrorBoundary>
      <ReportComponent
        setShowReportGenerator={setShowReportGenerator}
        pro={initialPro}
        updateData={updateData}
      />
    </ErrorBoundary>
  );
};

export default Report;
