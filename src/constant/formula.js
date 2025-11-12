// Tier Constants for Bonus Calculation

// Produksi (Production) Tiers
export const PRODUKSI_TIERS = {
  P0: {
    name: "P0 Micro",
    min: 0,
    max: 15000000,
    minPercent: 20,
    maxPercent: 35,
    weight8Min: 500000,
  },
  P1: {
    name: "P1 Small",
    min: 15000000,
    max: 50000000,
    minPercent: 25,
    maxPercent: 40,
    weight8Min: 1000000,
  },
  P2: {
    name: "P2 Medium",
    min: 50000000,
    max: 100000000,
    minPercent: 25,
    maxPercent: 45,
    weight8Min: 1000000,
  },
  P3: {
    name: "P3 Large",
    min: 100000000,
    max: 200000000,
    minPercent: 30,
    maxPercent: 50,
    weight8Min: 1250000,
  },
  P4: {
    name: "P4 Extra Large",
    min: 200000000,
    max: Infinity,
    minPercent: 35,
    maxPercent: 50,
    weight8Min: 1250000,
  },
};

// Dokumentasi (Documentation) Tiers
export const DOKUMENTASI_TIERS = {
  D0: {
    name: "D0 Micro",
    min: 0,
    max: 10000000,
    minPercent: 20,
    maxPercent: 35,
    weight8Min: 400000,
  },
  D1: {
    name: "D1 Small",
    min: 10000000,
    max: 30000000,
    minPercent: 25,
    maxPercent: 40,
    weight8Min: 700000,
  },
  D2: {
    name: "D2 Medium",
    min: 30000000,
    max: 60000000,
    minPercent: 25,
    maxPercent: 45,
    weight8Min: 700000,
  },
  D3: {
    name: "D3 Large",
    min: 60000000,
    max: 120000000,
    minPercent: 30,
    maxPercent: 50,
    weight8Min: 1000000,
  },
  D4: {
    name: "D4 Extra Large",
    min: 120000000,
    max: Infinity,
    minPercent: 35,
    maxPercent: 50,
    weight8Min: 1000000,
  },
};

// Motion Tiers
export const MOTION_TIERS = {
  M0: {
    name: "M0 Micro",
    min: 0,
    max: 5000000,
    minPercent: 15,
    maxPercent: 30,
    weight8Min: 125000,
  },
  M1: {
    name: "M1 Small",
    min: 5000000,
    max: 15000000,
    minPercent: 20,
    maxPercent: 35,
    weight8Min: 125000,
  },
  M2: {
    name: "M2 Medium",
    min: 15000000,
    max: 30000000,
    minPercent: 25,
    maxPercent: 40,
    weight8Min: 200000,
  },
  M3: {
    name: "M3 Large",
    min: 30000000,
    max: Infinity,
    minPercent: 30,
    maxPercent: 45,
    weight8Min: 200000,
  },
};

// Design Tiers
export const DESIGN_TIERS = {
  G0: {
    name: "G0 Micro",
    min: 0,
    max: 3000000,
    minPercent: 15,
    maxPercent: 30,
    weight8Min: 100000,
  },
  G1: {
    name: "G1 Small",
    min: 3000000,
    max: 10000000,
    minPercent: 20,
    maxPercent: 35,
    weight8Min: 100000,
  },
  G2: {
    name: "G2 Medium",
    min: 10000000,
    max: 20000000,
    minPercent: 25,
    maxPercent: 40,
    weight8Min: 150000,
  },
  G3: {
    name: "G3 Large",
    min: 20000000,
    max: Infinity,
    minPercent: 30,
    maxPercent: 45,
    weight8Min: 150000,
  },
};

// All tiers combined for lookup
export const ALL_TIERS = {
  Produksi: PRODUKSI_TIERS,
  Dokumentasi: DOKUMENTASI_TIERS,
  Motion: MOTION_TIERS,
  Design: DESIGN_TIERS,
};

// Maximum bonus percentage cap
export const MAX_BONUS_PERCENTAGE = 50;

// Overtime calculation constant (8 hours/day × 6 working days)
export const OVERTIME_DIVISOR = 48;

// Rounding base (round to nearest 500)
export const ROUNDING_BASE = 500;

/**
 * Determine project tier based on budget and project type
 * @param {number} budget - Project budget
 * @param {string} projectType - Project type (Produksi, Dokumentasi, Motion, Design)
 * @returns {object|null} Tier object or null if not found
 */
export const getProjectTier = (budget, projectType) => {
  const tiers = ALL_TIERS[projectType];
  if (!tiers) return null;

  const budgetNum = parseFloat(budget) || 0;

  for (const tierKey in tiers) {
    const tier = tiers[tierKey];
    if (budgetNum >= tier.min && budgetNum < tier.max) {
      return { ...tier, key: tierKey };
    }
  }

  return null;
};

/**
 * Calculate gross profit
 * @param {number} budget - Project budget
 * @param {number} expenses - Operational expenses
 * @param {number} freelance - Freelance cost
 * @returns {number} Gross profit
 */
export const calculateGrossProfit = (budget, expenses, freelance) => {
  const budgetNum = parseFloat(budget) || 0;
  const expensesNum = parseFloat(expenses) || 0;
  const freelanceNum = parseFloat(freelance) || 0;

  return budgetNum - expensesNum - freelanceNum;
};

/**
 * Calculate net profit
 * @param {number} grossProfit - Gross profit
 * @param {number} totalBonus - Total bonus
 * @returns {number} Net profit
 */
export const calculateNetProfit = (grossProfit, totalBonus) => {
  const grossProfitNum = parseFloat(grossProfit) || 0;
  const totalBonusNum = parseFloat(totalBonus) || 0;

  return grossProfitNum - totalBonusNum;
};

/**
 * Round to nearest 500
 * @param {number} amount - Amount to round
 * @returns {number} Rounded amount
 */
export const roundToNearest500 = (amount) => {
  const amountNum = parseFloat(amount) || 0;
  return Math.round(amountNum / ROUNDING_BASE) * ROUNDING_BASE;
};

/**
 * Calculate overtime bonus per hour
 * @param {number} baseBonus - Crew's base bonus for the job
 * @returns {number} Bonus per hour
 */
export const calculateOvertimePerHour = (baseBonus) => {
  const baseBonusNum = parseFloat(baseBonus) || 0;
  return baseBonusNum / OVERTIME_DIVISOR;
};

/**
 * Calculate overtime bonus
 * @param {number} baseBonus - Crew's base bonus for the job
 * @param {number} overtimeHours - Number of overtime hours
 * @param {string} option - Overtime option: 'libur' or 'uang_penuh'
 * @returns {object} Object with libur (days off) and bonus (cash bonus)
 */
export const calculateOvertime = (
  baseBonus,
  overtimeHours,
  option = "uang_penuh"
) => {
  const baseBonusNum = parseFloat(baseBonus) || 0;
  const hoursNum = parseFloat(overtimeHours) || 0;

  const bonusPerHour = calculateOvertimePerHour(baseBonusNum);

  if (option === "libur") {
    // Every 8 hours = 1 day off, remaining hours paid in cash
    const liburDays = Math.floor(hoursNum / 8);
    const remainingHours = hoursNum % 8;
    const cashBonus = bonusPerHour * remainingHours;

    return {
      libur: liburDays,
      bonus: roundToNearest500(cashBonus),
      totalHours: hoursNum,
      bonusPerHour: roundToNearest500(bonusPerHour),
    };
  } else {
    // Full cash payment
    const cashBonus = bonusPerHour * hoursNum;

    return {
      libur: 0,
      bonus: roundToNearest500(cashBonus),
      totalHours: hoursNum,
      bonusPerHour: roundToNearest500(bonusPerHour),
    };
  }
};

/**
 * Get weight 8 minimum for a tier
 * @param {object} tier - Tier object
 * @returns {number} Weight 8 minimum amount
 */
export const getWeight8Minimum = (tier) => {
  if (!tier) return 0;
  return tier.weight8Min || 0;
};

/**
 * Calculate initial bonus pool
 * @param {number} grossProfit - Gross profit
 * @param {number} bonusPercentage - Bonus percentage (0-100)
 * @returns {number} Initial bonus pool
 */
export const calculateBonusPool = (grossProfit, bonusPercentage) => {
  const grossProfitNum = parseFloat(grossProfit) || 0;
  const percentageNum = parseFloat(bonusPercentage) || 0;

  return (grossProfitNum * percentageNum) / 100;
};

/**
 * Calculate crew bonus based on weight
 * @param {number} bonusPool - Total bonus pool
 * @param {number} jobWeight - Job weight
 * @param {number} totalWeight - Total weight of all jobs
 * @returns {number} Crew bonus for this job
 */
export const calculateCrewBonus = (bonusPool, jobWeight, totalWeight) => {
  const bonusPoolNum = parseFloat(bonusPool) || 0;
  const jobWeightNum = parseFloat(jobWeight) || 0;
  const totalWeightNum = parseFloat(totalWeight) || 0;

  if (totalWeightNum === 0) return 0;

  return (bonusPoolNum * jobWeightNum) / totalWeightNum;
};

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const amountNum = parseFloat(amount) || 0;
  return `Rp. ${amountNum.toLocaleString("id-ID")}`;
};

/**
 * Get project type from categories
 * @param {array} categories - Project categories array
 * @returns {string} Project type (Produksi, Dokumentasi, Motion, Design)
 */
export const getProjectType = (categories) => {
  if (!Array.isArray(categories)) return "Produksi";

  if (categories.some((cat) => ["Produksi", "Dokumentasi"].includes(cat))) {
    return categories.includes("Produksi") ? "Produksi" : "Dokumentasi";
  }

  if (categories.some((cat) => ["Motion"].includes(cat))) {
    return "Motion";
  }

  if (categories.some((cat) => ["Design"].includes(cat))) {
    return "Design";
  }

  // Default to Produksi
  return "Produksi";
};

/**
 * Calculate optimal bonus percentage with Weight 8 minimum check
 * @param {number} grossProfit - Gross profit
 * @param {object} tier - Project tier object
 * @param {number} totalWeight - Total weight of all jobs
 * @param {number} weight8Count - Number of Weight 8 jobs
 * @param {number} initialPercentage - Initial bonus percentage (optional)
 * @returns {object} Object with finalPercentage, bonusPool, and adjusted flag
 */
export const calculateOptimalBonusPercentage = (
  grossProfit,
  tier,
  totalWeight,
  weight8Count = 0,
  initialPercentage = null
) => {
  if (!tier || grossProfit <= 0 || totalWeight <= 0) {
    return {
      finalPercentage: 0,
      bonusPool: 0,
      adjusted: false,
    };
  }

  // Use initial percentage or start with minPercent
  let percentage =
    initialPercentage !== null
      ? parseFloat(initialPercentage)
      : tier.minPercent;

  // Ensure percentage is within tier range
  percentage = Math.max(tier.minPercent, Math.min(tier.maxPercent, percentage));

  // Calculate initial bonus pool
  let bonusPool = calculateBonusPool(grossProfit, percentage);

  // Check Weight 8 minimum if we have Weight 8 jobs
  if (weight8Count > 0 && tier.weight8Min) {
    const weight8Bonus = calculateCrewBonus(bonusPool, 8, totalWeight);

    if (weight8Bonus < tier.weight8Min) {
      // Need to increase percentage to meet minimum
      // Calculate required bonus pool: weight8Min * totalWeight / 8
      const requiredBonusPool = (tier.weight8Min * totalWeight) / 8;
      const requiredPercentage = (requiredBonusPool / grossProfit) * 100;

      // Use the higher of required percentage or current, but cap at maxPercent
      percentage = Math.min(
        tier.maxPercent,
        Math.max(percentage, requiredPercentage)
      );
      bonusPool = calculateBonusPool(grossProfit, percentage);
    }
  }

  // Cap at absolute maximum
  percentage = Math.min(MAX_BONUS_PERCENTAGE, percentage);
  bonusPool = calculateBonusPool(grossProfit, percentage);

  return {
    finalPercentage: roundToNearest500(percentage * 100) / 100, // Round to 2 decimals
    bonusPool: roundToNearest500(bonusPool),
    adjusted:
      percentage !==
      (initialPercentage !== null ? initialPercentage : tier.minPercent),
  };
};

/**
 * Calculate total bonus and overtime for all crew members
 * @param {array} crewMembers - Array of crew members with roles and overtime
 * @param {number} bonusPool - Total bonus pool
 * @param {number} totalWeight - Total weight of all jobs
 * @param {object} roleWeights - Object mapping role names to weights
 * @returns {object} Object with crewBonuses array and totalBonus, totalOvertime
 */
export const calculateCrewBonuses = (
  crewMembers,
  bonusPool,
  totalWeight,
  roleWeights = {}
) => {
  if (!Array.isArray(crewMembers) || crewMembers.length === 0) {
    return {
      crewBonuses: [],
      totalBonus: 0,
      totalOvertime: 0,
    };
  }

  const crewBonuses = [];
  let totalBonus = 0;
  let totalOvertime = 0;

  crewMembers.forEach((crewMember) => {
    // Calculate bonus for each role this crew member has
    let crewTotalBonus = 0;
    const roleBonuses = [];

    if (Array.isArray(crewMember.roles) && crewMember.roles.length > 0) {
      crewMember.roles.forEach((role) => {
        const roleWeight = roleWeights[role] || 0;
        if (roleWeight > 0) {
          const roleBonus = calculateCrewBonus(
            bonusPool,
            roleWeight,
            totalWeight
          );
          const roundedBonus = roundToNearest500(roleBonus);
          roleBonuses.push({
            role,
            weight: roleWeight,
            bonus: roundedBonus,
          });
          crewTotalBonus += roundedBonus;
        }
      });
    }

    // Calculate overtime bonuses
    let crewOvertimeBonus = 0;
    const overtimeDetails = [];

    if (Array.isArray(crewMember.overtime) && crewMember.overtime.length > 0) {
      crewMember.overtime.forEach((ot) => {
        // Find the base bonus for this job/role
        const jobBonus =
          roleBonuses.find((rb) => rb.role === ot.job)?.bonus || 0;

        // Parse hour value - handle both number and string
        const overtimeHours = parseFloat(ot.hour) || parseFloat(ot.hours) || 0;

        if (jobBonus > 0 && overtimeHours > 0) {
          const overtimeCalc = calculateOvertime(
            jobBonus,
            overtimeHours,
            ot.option || "uang_penuh"
          );
          overtimeDetails.push({
            job: ot.job,
            hours: overtimeHours,
            baseBonus: jobBonus,
            overtimeBonus: overtimeCalc.bonus,
            option: ot.option || "uang_penuh",
          });
          crewOvertimeBonus += overtimeCalc.bonus;
        }
      });
    }

    crewBonuses.push({
      name: crewMember.name,
      roles: crewMember.roles,
      roleBonuses,
      totalBonus: roundToNearest500(crewTotalBonus),
      overtime: crewMember.overtime,
      overtimeDetails,
      totalOvertime: roundToNearest500(crewOvertimeBonus),
    });

    totalBonus += roundToNearest500(crewTotalBonus);
    totalOvertime += roundToNearest500(crewOvertimeBonus);
  });

  return {
    crewBonuses,
    totalBonus: roundToNearest500(totalBonus),
    totalOvertime: roundToNearest500(totalOvertime),
  };
};
