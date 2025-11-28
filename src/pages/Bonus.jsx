import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { useToast } from '../components/micro-components/ToastContext';
import { pdf } from '@react-pdf/renderer';
import PDFBonus from '../components/pdf/PDFBonus';
import PDFBonusIndividu from '../components/pdf/PDFBonusIndividu';
import {
    getProjectTier,
    getProjectType,
    calculateGrossProfit,
    calculateNetProfit,
    calculateOvertime,
    formatCurrency as formatCurrencyUtil,
    roundToNearest500,
    getWeight8Minimum,
    MAX_BONUS_PERCENTAGE,
    calculateOptimalBonusPercentage,
    calculateCrewBonuses,
    calculateBonusPool,
    calculateCrewBonus,
} from '../constant/formula';
import { useRoleProduction, useRoleMotion, useRoleDesign, useRoleDocs } from '../hook';

const Bonus = ({ pro: initialPro, updateData }) => {
    const [pro, setPro] = useState(initialPro || {});
    const [bonusPercentage, setBonusPercentage] = useState(pro?.bonusPercentage || pro?.bonus?.bonusPercentage || null);
    const [calculatedBonuses, setCalculatedBonuses] = useState(null);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const roleProduction = useRoleProduction();
    const roleMotion = useRoleMotion();
    const roleDesign = useRoleDesign();
    const roleDocs = useRoleDocs();

    useEffect(() => {
        if (initialPro) {
            setPro(initialPro);
            if (initialPro.bonusPercentage !== undefined || initialPro.bonus?.bonusPercentage !== undefined) {
                setBonusPercentage(initialPro.bonusPercentage || initialPro.bonus?.bonusPercentage);
            }
        }
    }, [initialPro]);

    // Extract days from project
    const days = useMemo(() => {
        return Array.isArray(pro?.day) ? pro.day : [];
    }, [pro?.day]);

    // Calculate total expenses from all days
    const calculateTotalExpenses = (day) => {
        if (!day) return 0;
        const parseNumber = (value) => isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        const rentTotal = (day.expense?.rent || []).reduce(
            (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
        );
        const operationalTotal = (day.expense?.operational || []).reduce(
            (total, expense) => total + parseNumber(expense.price) * (parseInt(expense.qty) || 0), 0
        );
        return rentTotal + operationalTotal;
    };

    const totalExpenses = useMemo(() => {
        return days.reduce((acc, day) => acc + calculateTotalExpenses(day), 0);
    }, [days]);

    // Get project type from categories
    const projectType = useMemo(() => {
        return getProjectType(pro?.categories || []);
    }, [pro?.categories]);

    // Get role weights from hooks based on project type
    const roleWeights = useMemo(() => {
        let roles = [];

        switch (projectType) {
            case 'Produksi':
                roles = roleProduction;
                break;
            case 'Dokumentasi':
                roles = roleDocs;
                break;
            case 'Motion':
                roles = roleMotion;
                break;
            case 'Design':
                roles = roleDesign;
                break;
            default:
                roles = roleProduction;
        }

        const weights = {};
        roles.forEach((role) => {
            if (role.name && role.bobot) {
                weights[role.name] = parseFloat(role.bobot) || 0;
            }
        });

        return weights;
    }, [projectType, roleProduction, roleMotion, roleDesign, roleDocs]);

    // Get project tier
    const projectTier = useMemo(() => {
        const budget = parseFloat(pro?.budget || pro?.bonus?.budget) || 0;
        return getProjectTier(budget, projectType);
    }, [pro?.budget, projectType]);

    // Group crew across all days with overtime data (exclude freelancers)
    const crewWithOvertime = useMemo(() => {
        const freelancerNamesSet = new Set(
            (Array.isArray(pro?.freelancers) ? pro.freelancers : [])
                .map(f => String(f.name).trim().toLowerCase())
                .filter(Boolean)
        );
        const crewMap = new Map();

        days.forEach((day) => {
            if (!day.crew || day.crew.length === 0) return;

            day.crew.forEach((crewMember) => {
                if (!crewMember.name) return;

                // Skip freelancers
                const memberNameKey = String(crewMember.name).trim().toLowerCase();
                if (freelancerNamesSet.has(memberNameKey)) return;

                const crewKey = crewMember.name;
                if (!crewMap.has(crewKey)) {
                    crewMap.set(crewKey, {
                        name: crewMember.name,
                        roles: new Set(),
                        overtime: []
                    });
                }

                const existingCrew = crewMap.get(crewKey);
                // Add roles
                if (Array.isArray(crewMember.roles)) {
                    crewMember.roles.filter(Boolean).forEach(r => existingCrew.roles.add(r));
                }

                // Add overtime entries
                if (Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0) {
                    crewMember.overtime.forEach(ot => {
                        if (ot.job && ot.hour) {
                            existingCrew.overtime.push({
                                job: ot.job,
                                date: ot.date || day.date || '',
                                hour: parseFloat(ot.hour) || 0
                            });
                        }
                    });
                }
            });
        });

        return Array.from(crewMap.values()).map(crew => ({
            name: crew.name,
            roles: Array.from(crew.roles),
            overtime: crew.overtime
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [days, pro?.freelancers]);

    // Calculate total freelancer price
    const totalFreelancerPrice = useMemo(() => {
        const freelancers = Array.isArray(pro?.freelancers) ? pro.freelancers : [];
        return freelancers.reduce((sum, f) => sum + (parseFloat(f.price) || 0), 0);
    }, [pro?.freelancers]);

    // Calculate gross profit
    const grossProfit = useMemo(() => {
        const budget = parseFloat(pro?.budget || pro?.bonus?.budget) || 0;
        const freelance = parseFloat(pro?.freelance || pro?.bonus?.freelance) || 0;
        return calculateGrossProfit(budget, totalExpenses, freelance);
    }, [pro?.budget, pro?.freelance, totalExpenses]);

    // Calculate total weight and weight count
    const { totalWeight, weight8Count } = useMemo(() => {
        let total = 0;
        let weight8Jobs = 0;

        crewWithOvertime.forEach(crew => {
            if (Array.isArray(crew.roles)) {
                crew.roles.forEach(role => {
                    const weight = roleWeights[role] || 0;
                    total += weight;
                    if (weight === 8) weight8Jobs++;
                });
            }
        });

        return { totalWeight: total, weight8Count: weight8Jobs };
    }, [crewWithOvertime, roleWeights]);

    // Calculate optimal bonus percentage and pool
    const bonusCalculation = useMemo(() => {
        if (!projectTier || grossProfit <= 0 || totalWeight <= 0) {
            return {
                finalPercentage: 0,
                bonusPool: 0,
                adjusted: false,
            };
        }

        return calculateOptimalBonusPercentage(
            grossProfit,
            projectTier,
            totalWeight,
            weight8Count,
            bonusPercentage
        );
    }, [grossProfit, projectTier, totalWeight, weight8Count, bonusPercentage]);

    // Calculate crew bonuses
    const crewBonusCalculation = useMemo(() => {
        if (bonusCalculation.bonusPool <= 0 || totalWeight <= 0) {
            return {
                crewBonuses: [],
                totalBonus: 0,
                totalOvertime: 0,
            };
        }

        return calculateCrewBonuses(
            crewWithOvertime,
            bonusCalculation.bonusPool,
            totalWeight,
            roleWeights
        );
    }, [crewWithOvertime, bonusCalculation.bonusPool, totalWeight, roleWeights]);

    // Format currency (using utility function) - define early for use in crucialNotes
    const formatCurrency = formatCurrencyUtil;

    // Calculate net profit
    const netProfit = useMemo(() => {
        const totalBonus = crewBonusCalculation.totalBonus || parseFloat(pro?.totalBonus || pro?.bonus?.totalBonus) || 0;
        const uangLembur = crewBonusCalculation.totalOvertime || parseFloat(pro?.uangLembur || pro?.bonus?.uangLembur) || 0;
        return calculateNetProfit(grossProfit, totalBonus + uangLembur);
    }, [grossProfit, crewBonusCalculation, pro?.totalBonus, pro?.uangLembur]);

    // Generate crucial notes based on calculation
    const crucialNotes = useMemo(() => {
        const notes = [];

        // Critical: Check for negative or zero gross profit first
        if (grossProfit < 0) {
            notes.push({
                type: 'critical',
                message: `🚨 CRITICAL: Gross profit is negative (${formatCurrency(grossProfit)})! Total expenses exceed project budget. This project is operating at a loss. Review budget, expenses, or freelance costs immediately.`
            });
            // Still continue to show other warnings even with negative gross profit
        } else if (grossProfit === 0) {
            notes.push({
                type: 'critical',
                message: `🚨 CRITICAL: Gross profit is zero! Total expenses equal project budget. No profit margin available. Review budget or reduce expenses.`
            });
        }

        if (!projectTier) {
            return notes;
        }

        const finalPercentage = bonusCalculation?.finalPercentage || 0;
        const tierMax = projectTier.maxPercent || 0;
        const tierMin = projectTier.minPercent || 0;

        // Check if bonus percentage was adjusted due to Weight minimum
        if (bonusCalculation?.adjusted) {
            if (finalPercentage >= tierMax) {
                notes.push({
                    type: 'warning',
                    message: `⚠️ Bonus percentage adjusted to ${finalPercentage.toFixed(2)}% (MAX: ${tierMax}%) to meet Weight minimum requirement. This exceeds the recommended range.`
                });
            } else {
                notes.push({
                    type: 'info',
                    message: `ℹ️ Bonus percentage adjusted to ${finalPercentage.toFixed(2)}% to meet Weight minimum requirement (${projectTier.name} tier).`
                });
            }
        }

        // Check if bonus percentage exceeds tier max (without adjustment)
        if (!bonusCalculation?.adjusted && finalPercentage > tierMax) {
            notes.push({
                type: 'warning',
                message: `⚠️ Bonus percentage (${finalPercentage.toFixed(2)}%) exceeds tier maximum (${tierMax}%). Consider reviewing the calculation.`
            });
        }

        // Check if bonus percentage is at maximum
        if (finalPercentage >= MAX_BONUS_PERCENTAGE) {
            notes.push({
                type: 'critical',
                message: `🚨 Bonus percentage reached absolute maximum (${MAX_BONUS_PERCENTAGE}%). This may indicate insufficient gross profit or too many crew members.`
            });
        }

        // Check if total weight is unusually high (more than 50 suggests too many crew)
        if (totalWeight > 50) {
            notes.push({
                type: 'warning',
                message: `⚠️ Total weight (${totalWeight}) is high. This may indicate too many crew members, which could reduce individual bonuses.`
            });
        }

        // Check if Weight minimum couldn't be met even at max percentage
        if (weight8Count > 0 && projectTier.weight8Min) {
            const weight8Bonus = calculateCrewBonus(
                bonusCalculation?.bonusPool || 0,
                8,
                totalWeight
            );
            if (weight8Bonus < projectTier.weight8Min && finalPercentage >= tierMax) {
                notes.push({
                    type: 'critical',
                    message: `🚨 Weight minimum (${formatCurrency(projectTier.weight8Min)}) cannot be met even at maximum percentage. Consider increasing project budget or reducing crew size.`
                });
            }
        }

        // Check if net profit is negative or very low (only if gross profit is positive)
        if (grossProfit > 0) {
            if (netProfit < 0) {
                notes.push({
                    type: 'critical',
                    message: `🚨 Net profit is negative! Total bonus and overtime exceed gross profit. Review budget or reduce bonus percentage.`
                });
            } else if (netProfit < grossProfit * 0.1) {
                notes.push({
                    type: 'warning',
                    message: `⚠️ Net profit is very low (${formatCurrency(netProfit)}). Consider reviewing bonus allocation.`
                });
            }

            // Check if bonus pool is very large relative to gross profit
            const bonusRatio = (bonusCalculation?.bonusPool || 0) / grossProfit;
            if (bonusRatio > 0.5) {
                notes.push({
                    type: 'warning',
                    message: `⚠️ Bonus pool represents ${(bonusRatio * 100).toFixed(1)}% of gross profit. This is unusually high.`
                });
            }
        } else if (grossProfit < 0) {
            // If gross profit is negative, net profit will definitely be negative too
            notes.push({
                type: 'critical',
                message: `🚨 Net profit is negative (${formatCurrency(netProfit)}) due to negative gross profit. Cannot calculate bonuses with current budget and expenses.`
            });
        }

        // SOP Warnings
        const budget = parseFloat(pro?.budget || pro?.bonus?.budget) || 0;
        const freelance = parseFloat(pro?.freelance || pro?.bonus?.freelance) || 0;
        const operationalExpenses = totalExpenses; // Total expenses from all days
        const opFreelanceTotal = operationalExpenses + freelance;

        // SOP Warning 1: Op+Freelance Warning
        if (budget > 0) {
            const opFreelancePercentage = (opFreelanceTotal / budget) * 100;
            // Define maximum percentage based on tier (default: 40% for large projects, 35% for smaller)
            const maxOpFreelancePercentage = projectTier.name.includes('Large') || projectTier.name.includes('Extra Large')
                ? 40
                : projectTier.name.includes('Micro') || projectTier.name.includes('Small')
                    ? 35
                    : 38;

            if (opFreelancePercentage > maxOpFreelancePercentage) {
                notes.push({
                    type: 'warning',
                    message: `⚠️ SOP Warning: Operational + Freelance (${formatCurrency(opFreelanceTotal)}) represents ${opFreelancePercentage.toFixed(1)}% of budget, exceeding recommended maximum of ${maxOpFreelancePercentage}% for ${projectTier.name} tier. Consider reducing expenses or increasing budget.`
                });
            }
        }

        // SOP Warning 2: Crew Size Warning
        const crewCount = crewWithOvertime.length;
        // Define maximum crew size based on tier (default: 20 for large, 15 for medium, 12 for small)
        const maxCrewSize = projectTier.name.includes('Large') || projectTier.name.includes('Extra Large')
            ? 20
            : projectTier.name.includes('Medium')
                ? 15
                : projectTier.name.includes('Micro') || projectTier.name.includes('Small')
                    ? 12
                    : 18;

        if (crewCount > maxCrewSize) {
            notes.push({
                type: 'warning',
                message: `⚠️ SOP Warning: Crew size (${crewCount} members) exceeds recommended maximum of ${maxCrewSize} for ${projectTier.name} tier. This may reduce individual bonuses. Consider optimizing crew allocation.`
            });
        }

        // SOP Warning 3: Bonus Per Person Warning
        const bonusesToCheck = calculatedBonuses || crewBonusCalculation;
        if (bonusesToCheck?.crewBonuses && bonusesToCheck.crewBonuses.length > 0) {
            const minBonusPerPerson = Math.min(
                ...bonusesToCheck.crewBonuses.map(crew => {
                    const baseBonus = crew.totalBonus || 0;
                    const overtimeBonus = crew.totalOvertime || 0;
                    return baseBonus + overtimeBonus;
                })
            );

            const MIN_BONUS_PER_PERSON = 750000;
            if (minBonusPerPerson < MIN_BONUS_PER_PERSON) {
                const affectedCrew = bonusesToCheck.crewBonuses.filter(crew => {
                    const total = (crew.totalBonus || 0) + (crew.totalOvertime || 0);
                    return total < MIN_BONUS_PER_PERSON;
                });

                const recommendation = minBonusPerPerson > 0
                    ? `Recommended: Increase bonus percentage or reduce crew size to ensure minimum ${formatCurrency(MIN_BONUS_PER_PERSON)} per person.`
                    : `Recommended: Review crew allocation and ensure proper bonus distribution.`;

                notes.push({
                    type: 'warning',
                    message: `⚠️ SOP Warning: Lowest bonus per person (${formatCurrency(minBonusPerPerson)}) falls below minimum threshold of ${formatCurrency(MIN_BONUS_PER_PERSON)}. ${affectedCrew.length} crew member(s) affected. ${recommendation}`
                });
            }
        }

        return notes;
    }, [bonusCalculation, projectTier, grossProfit, totalWeight, weight8Count, netProfit, formatCurrency, pro?.budget, pro?.freelance, totalExpenses, crewWithOvertime, calculatedBonuses, crewBonusCalculation]);

    const pmNames = useMemo(() => {
        return crewWithOvertime
            .filter(c => c.roles.some(r => (r || '').toLowerCase() === 'project manager'))
            .map(c => c.name);
    }, [crewWithOvertime]);

    // Save budget, freelance, and calculated bonus data
    const handleSave = async () => {
        try {
            const updatedPro = {
                ...pro,
                bonus: {
                    budget: pro.budget || pro.bonus?.budget || 0,
                    freelance: pro.freelance || pro.bonus?.freelance || 0,
                    bonusPercentage: bonusCalculation.finalPercentage || null,
                    totalBonus: crewBonusCalculation.totalBonus || 0,
                    uangLembur: crewBonusCalculation.totalOvertime || 0,
                },
            };
            await updateData(updatedPro);
            setPro(updatedPro);
            setCalculatedBonuses(crewBonusCalculation);
        } catch (error) {
            console.error('Error saving bonus data:', error);
        }
    };

    // Calculate bonuses button handler
    const handleCalculate = () => {
        setCalculatedBonuses(crewBonusCalculation);
        showToast("Bonus calculated successfully", "success");
    };

    // Export to PDF
    const handleExportPDF = async () => {
        try {
            if (!calculatedBonuses && crewBonusCalculation.totalBonus === 0) {
                showToast("Please calculate bonuses first", "error");
                return;
            }

            const bonusesToExport = calculatedBonuses || crewBonusCalculation;

            // Generate PDF using react-pdf
            const blob = await pdf(
                <PDFBonus
                    pro={pro}
                    crewBonuses={bonusesToExport}
                    bonusCalculation={bonusCalculation}
                    grossProfit={grossProfit}
                    netProfit={netProfit}
                    totalExpenses={totalExpenses}
                    totalFreelancerPrice={totalFreelancerPrice}
                    projectTier={projectTier}
                    crucialNotes={crucialNotes}
                />
            ).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Bonus Calculation ${pro?.title || "Project"}.pdf`;

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

    // Export individual bonus PDF
    const handleExportIndividualPDF = async (crewMember) => {
        try {
            if (!calculatedBonuses && crewBonusCalculation.totalBonus === 0) {
                showToast("Please calculate bonuses first", "error");
                return;
            }

            const bonusesToExport = calculatedBonuses || crewBonusCalculation;
            const crewBonus = bonusesToExport.crewBonuses?.find(cb => cb.name === crewMember.name);

            if (!crewBonus) {
                showToast(`No bonus data found for ${crewMember.name}`, "error");
                return;
            }

            // Generate PDF using react-pdf
            const blob = await pdf(
                <PDFBonusIndividu
                    pro={pro}
                    crewMember={crewMember}
                    crewBonus={crewBonus}
                    bonusCalculation={bonusCalculation}
                    grossProfit={grossProfit}
                    totalExpenses={totalExpenses}
                    projectTier={projectTier}
                />
            ).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Bonus ${crewMember.name} - ${pro?.title || "Project"}.pdf`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast(`PDF exported for ${crewMember.name}`, "success");
        } catch (error) {
            console.error("Individual PDF export error:", error);
            showToast("Failed to export individual PDF", "error");
        }
    };

    return (
        <main className='relative flex items-start justify-center gap-1 min-h-screen p-5 bg-dark text-light font-body overflow-y-scroll'>
            <nav className='absolute left-3 top-3'>
                <button type="button"
                    className="flex gap-1 items-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                    onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="#e8e8e8" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                    </svg>
                    Back
                </button>
            </nav>
            {/* Left */}
            <div className='flex flex-col h-full w-2/3 mt-5'>
                {/* Project Overview */}
                <main className="space-y-1 w-full">
                    {/* Project details */}
                    <section className='py-3 w-full glass rounded-xl border border-light/50 p-3'>
                        <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Project Overview</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Title:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.title || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Client:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.client || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">PIC Client:</span>
                                <span className="text-light text-xs tracking-wider">{pro?.pic || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/80 text-sm">Categories:</span>
                                <span className="text-light text-xs tracking-wider">
                                    {pro?.categories?.join(", ") || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-light/90 text-sm">Project Manager:</span>
                                <span className="text-light text-xs tracking-wider">
                                    {pmNames.length ? pmNames.join(", ") : "No Project Manager"}
                                </span>
                            </div>
                        </div>
                    </section>
                    {/* Budget Section */}
                    <section className='glass rounded-xl border border-light/50 p-3'>
                        <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Budget Information</h3>
                        <div className="flex items-center gap-1">
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Project Budget
                                <NumericFormat
                                    displayType="input"
                                    thousandSeparator
                                    prefix="Rp. "
                                    placeholder="Project Budget"
                                    value={pro?.budget || pro?.bonus?.budget || ''}
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0"
                                    onValueChange={(values) => {
                                        setPro(prev => ({
                                            ...prev,
                                            budget: values.value,
                                            bonus: { ...prev.bonus, budget: values.value }
                                        }));
                                    }}
                                />
                            </label>
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Project Expenses
                                <NumericFormat
                                    displayType="input"
                                    thousandSeparator
                                    prefix="Rp. "
                                    placeholder="Project Expenses"
                                    value={totalExpenses || ''}
                                    readOnly
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0 bg-dark/50"
                                />
                            </label>
                            <label className="font-body text-sm gap-1 tracking-widest flex flex-col w-1/3">
                                Freelance
                                <NumericFormat
                                    displayType="input"
                                    thousandSeparator
                                    prefix="Rp. "
                                    placeholder="Freelance"
                                    value={totalFreelancerPrice || ''}
                                    readOnly
                                    className="glass border text-xs border-light/50 font-light rounded-xl p-2 font-body tracking-widest outline-none mb-1 lg:mb-0 bg-dark/50"
                                />
                            </label>
                        </div>
                    </section>
                    {/* Crew table */}
                    <section className="w-full h-full font-body text-sm tracking-wider glass rounded-xl border border-light/50 p-3">
                        <p className="pb-4 text-xl font-semibold text-light tracking-wider">Crew Details</p>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-light/50">
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Name</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Jobdesk</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Job Overtime</th>
                                        <th className="text-left py-2 px-3 text-light font-semibold text-sm">Total Bonus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {crewWithOvertime.length > 0 ? (
                                        crewWithOvertime.map((crewMember, index) => (
                                            <tr key={`crew-${index}`} className="border-b border-light/10">
                                                <td className="py-2 px-3 text-light/80 text-sm">{crewMember.name}</td>
                                                <td className="py-2 px-3 text-light/80 text-sm">
                                                    {crewMember.roles.length > 0 ? crewMember.roles.join(", ") : "-"}
                                                </td>
                                                <td className="py-2 px-3 text-light/80 text-sm">
                                                    {crewMember.overtime.length > 0 ? (
                                                        crewMember.overtime.map(ot => `${ot.job} (${ot.hour}h)`).join(", ")
                                                    ) : "-"}
                                                </td>
                                                <td className="py-2 px-3 space-y-2">
                                                    {(() => {
                                                        const crewBonus = calculatedBonuses?.crewBonuses?.find(cb => cb.name === crewMember.name);
                                                        const hasBonus = crewBonus && (crewBonus.totalBonus > 0 || crewBonus.totalOvertime > 0);

                                                        if (!hasBonus && crewMember.overtime.length === 0) {
                                                            return <span className="text-light/50 text-xs">No bonus calculated</span>;
                                                        }

                                                        return (
                                                            <div className='min-h-20 flex flex-col glass rounded-xl p-1 border border-light/50'>
                                                                <div className='flex items-center justify-between'>
                                                                    <p className="text-light text-sm">{crewMember.name}</p>
                                                                    <div className="flex items-center gap-3">
                                                                        <p className="text-blue-500 text-xs">
                                                                            {formatCurrency((crewBonus?.totalBonus || 0) + (crewBonus?.totalOvertime || 0))}
                                                                        </p>
                                                                        <button
                                                                            onClick={() => handleExportIndividualPDF(crewMember)}
                                                                            className="p-1 glass rounded-full flex items-center justify-center text-light transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer"
                                                                            title={`Export PDF for ${crewMember.name}`}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {crewBonus?.roleBonuses?.map((rb, rbIdx) => (
                                                                    <p key={rbIdx} className='text-xs text-light/50'>
                                                                        {rb.role} (W{rb.weight}) = {formatCurrency(rb.bonus)}
                                                                    </p>
                                                                ))}
                                                                {crewBonus?.overtimeDetails?.map((ot, otIdx) => (
                                                                    <p key={otIdx} className='text-xs text-light/50'>
                                                                        {ot.job} (+{ot.hours}h) = {formatCurrency(ot.overtimeBonus)}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-light/60">
                                                <p className="text-sm">No crew members assigned yet</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </section>
                </main>
            </div>
            {/* Right */}
            <div className="flex flex-col h-full w-1/3 mt-5">
                {/* Bonus Overview */}
                <section className="glass w-full rounded-xl border border-light/50 p-3">
                    <h3 className="text-lg font-semibold text-light mb-3 tracking-wider">Bonus Calculation</h3>
                    <div className="space-y-2 border-b border-light/50 p-2">
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Budget:</span>
                            <span className="text-light text-xs tracking-wider">{formatCurrency(pro?.budget || pro?.bonus?.budget || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Expenses:</span>
                            <span className="text-light text-xs tracking-wider">{formatCurrency(totalExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Total Freelancers:</span>
                            <span className="text-light text-xs tracking-wider">{formatCurrency(totalFreelancerPrice)}</span>
                        </div>
                    </div>
                    <div className="space-y-2 border-b border-light/50 p-2">
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Gross Profit:</span>
                            <span className="text-green-500 text-xs tracking-wider">
                                {formatCurrency(grossProfit)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Tier:</span>
                            <div className="text-light text-xs tracking-wider flex items-center gap-3">
                                <span className='rounded-xl p-1 border border-light/50'>
                                    {projectTier ? projectTier.name : "N/A"}
                                </span>
                                <NumericFormat
                                    displayType="text"
                                    value={bonusPercentage !== null ? bonusPercentage : (projectTier?.minPercent || 0)}
                                    onValueChange={(values) => {
                                        const val = parseFloat(values.value) || null;
                                        setBonusPercentage(val);
                                    }}
                                    suffix="%"
                                    decimalScale={2}
                                    className="outline-none"
                                />
                                {bonusCalculation.adjusted && (
                                    <span className="text-amber-500 text-xs">(Adjusted)</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-2">
                            <span className="text-light/80 text-sm">Note:</span>
                            {crucialNotes.length > 0 ? (
                                <div className="space-y-2">
                                    {crucialNotes.map((note, idx) => (
                                        <p
                                            key={idx}
                                            className={`text-xs tracking-wider rounded-xl p-3 ${note.type === 'critical'
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                : note.type === 'warning'
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                }`}
                                        >
                                            {note.message}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs tracking-wider rounded-xl border border-green-400/75 text-light p-3">
                                    {pro?.bonusNote || "No critical notes. Calculation is within recommended parameters."}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Floor Minimum:</span>
                            <span className="text-amber-500 text-xs tracking-wider">
                                {formatCurrency(projectTier ? getWeight8Minimum(projectTier) : 0)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Total Overtime:</span>
                            <span className="text-blue-500 text-xs tracking-wider">
                                {formatCurrency(calculatedBonuses?.totalOvertime || crewBonusCalculation.totalOvertime || pro?.uangLembur || pro?.bonus?.uangLembur || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Total Bonus:</span>
                            <span className="text-blue-500 text-xs tracking-wider">
                                {formatCurrency(calculatedBonuses?.totalBonus || crewBonusCalculation.totalBonus || pro?.totalBonus || pro?.bonus?.totalBonus || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-light/80 text-sm">Net Profit:</span>
                            <span className="text-green-500 text-xs tracking-wider">
                                {formatCurrency(netProfit)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-evenly gap-2 pt-3 w-full">
                        <button
                            onClick={handleExportPDF}
                            className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center border-light/50 text-light w-20 h-10 justify-center">
                            Export
                        </button>
                        <button
                            onClick={handleCalculate}
                            className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center border-light/50 bg-green-500 text-light w-24 h-10 justify-center">
                            Calculate
                        </button>
                        <button
                            onClick={handleSave}
                            className="transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer border rounded-xl flex gap-2 items-center text-dark bg-light w-20 h-10 justify-center">
                            Save
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Bonus;
