/*
 * RETIREMENT SUPERCHARGER CALCULATORS
 * Four calculators for Ekantik Capital Advisors V2 page
 * 1. Defined Benefit Accelerator
 * 2. 831(b) Reserve + Tax Efficiency
 * 3. SERP Retention ROI
 * 4. Master 10-Year Dashboard with WOW Multiplier
 */

// ========================================
// DENTIST ICP DEFAULTS (Conservative/Base/Strong)
// ========================================

const DENTIST_DEFAULTS = {
    conservative: {
        sde: 500000,
        taxRate: 32,
        epigReturn: 5,
        exitMultiple: 2.5,
        reinvestEff: 0.6,
        dbContrib: 120000,
        b831Premium: 200000,
        serpFunding: 20000
    },
    base: {
        sde: 500000,
        taxRate: 38,
        epigReturn: 8,
        exitMultiple: 3.5,
        reinvestEff: 0.75,
        dbContrib: 150000,
        b831Premium: 250000,
        serpFunding: 25000
    },
    strong: {
        sde: 500000,
        taxRate: 44,
        epigReturn: 12,
        exitMultiple: 5.0,
        reinvestEff: 0.9,
        dbContrib: 200000,
        b831Premium: 300000,
        serpFunding: 35000
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatCurrency(value, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function formatPercent(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

function formatMultiplier(value, decimals = 1) {
    return `${value.toFixed(decimals)}x`;
}

// Future Value calculation
function calculateFV(pmt, rate, periods) {
    if (rate === 0) return pmt * periods;
    return pmt * (Math.pow(1 + rate, periods) - 1) / rate;
}

// Present Value calculation
function calculatePV(fv, rate, periods) {
    if (rate === 0) return fv / periods;
    return fv / Math.pow(1 + rate, periods);
}

// ========================================
// CALCULATOR #1: DEFINED BENEFIT ACCELERATOR
// ========================================

let dbChart = null;

function calculateDB() {
    // Get inputs
    const age = parseFloat(document.getElementById('db-age').value);
    const income = parseFloat(document.getElementById('db-income').value);
    const target = parseFloat(document.getElementById('db-target').value);
    const taxRate = parseFloat(document.getElementById('db-taxrate').value) / 100;
    const years = parseInt(document.getElementById('db-years').value);
    const returnRate = parseFloat(document.getElementById('db-return').value) / 100;

    // Validate inputs
    if (isNaN(age) || isNaN(income) || isNaN(target) || isNaN(taxRate) || isNaN(years) || isNaN(returnRate)) {
        alert('Please fill in all fields with valid numbers.');
        return;
    }

    // Calculate contribution range (±20% of target)
    const contribLow = target * 0.8;
    const contribHigh = target * 1.2;

    // Calculate tax savings range
    const taxSavingsLow = contribLow * taxRate;
    const taxSavingsHigh = contribHigh * taxRate;

    // Calculate net out-of-pocket range (FIXED: pairwise computation)
    // Low scenario: low contribution - low tax savings
    // High scenario: high contribution - high tax savings
    const netCostLow = contribLow - taxSavingsLow;
    const netCostHigh = contribHigh - taxSavingsHigh;

    // Calculate 10-year accumulation (using mid-point contribution)
    const avgContrib = target;
    const accumulation = calculateFV(avgContrib, returnRate, years);

    // Update outputs
    document.getElementById('db-contribution-range').textContent = 
        `${formatCurrency(contribLow)} - ${formatCurrency(contribHigh)}`;
    
    document.getElementById('db-tax-savings').textContent = 
        `${formatCurrency(taxSavingsLow)} - ${formatCurrency(taxSavingsHigh)}`;
    
    document.getElementById('db-net-cost').textContent = 
        `${formatCurrency(netCostLow)} - ${formatCurrency(netCostHigh)}`;
    
    document.getElementById('db-accumulation').textContent = 
        formatCurrency(accumulation);

    // Generate chart data
    const chartData = {
        labels: [],
        datasets: [{
            label: 'Projected Accumulation',
            data: [],
            borderColor: '#f5a623',
            backgroundColor: 'rgba(245, 166, 35, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    let balance = 0;
    for (let year = 0; year <= years; year++) {
        chartData.labels.push(`Year ${year}`);
        chartData.datasets[0].data.push(balance);
        if (year < years) {
            balance = (balance + avgContrib) * (1 + returnRate);
        }
    }

    // Render chart
    renderChart('db-chart', chartData, 'Defined Benefit Plan: Projected Growth');
}

// ========================================
// CALCULATOR #2: 831(b) RESERVE + TAX EFFICIENCY
// ========================================

let b831Chart = null;

function calculate831b() {
    // Get inputs
    const premium = parseFloat(document.getElementById('b831-premium').value);
    const admin = parseFloat(document.getElementById('b831-admin').value);
    const returnRate = parseFloat(document.getElementById('b831-return').value) / 100;
    const years = parseInt(document.getElementById('b831-years').value);
    const claimsScenario = document.getElementById('b831-claims').value;
    const taxRate = parseFloat(document.getElementById('b831-taxrate').value) / 100;
    const monthlyOverhead = parseFloat(document.getElementById('b831-overhead').value);

    // Validate inputs
    if (isNaN(premium) || isNaN(admin) || isNaN(returnRate) || isNaN(years) || isNaN(taxRate) || isNaN(monthlyOverhead)) {
        alert('Please fill in all fields with valid numbers.');
        return;
    }

    // Calculate claims % based on scenario
    let claimsPercent = 0;
    if (claimsScenario === 'low') claimsPercent = 0.10;
    else if (claimsScenario === 'medium') claimsPercent = 0.25;

    const annualClaims = premium * claimsPercent;

    // Year 1 calculations
    const taxEffect = premium * taxRate; // If deductible
    const netReserve = premium - admin - annualClaims;

    // 10-year reserve pool calculation
    let reservePool = 0;
    for (let year = 1; year <= years; year++) {
        reservePool = (reservePool + netReserve) * (1 + returnRate);
    }

    // Shock resistance calculation (using actual monthly overhead input)
    const monthsCovered = Math.floor(reservePool / monthlyOverhead);

    // Update outputs
    document.getElementById('b831-tax-effect').textContent = formatCurrency(taxEffect);
    document.getElementById('b831-net-reserve').textContent = formatCurrency(netReserve);
    document.getElementById('b831-reserve-pool').textContent = formatCurrency(reservePool);
    
    let shockMessage = '';
    if (monthsCovered >= 12) {
        shockMessage = `Reserve pool covers ~${monthsCovered} months of overhead`;
    } else if (monthsCovered >= 6) {
        shockMessage = `Reserve pool covers ~${monthsCovered} months of overhead`;
    } else {
        shockMessage = `Consider increasing reserves for stronger protection`;
    }
    document.getElementById('b831-shock').textContent = shockMessage;

    // Generate chart data
    const chartData = {
        labels: [],
        datasets: [{
            label: 'Reserve Pool Growth',
            data: [],
            borderColor: '#4a90e2',
            backgroundColor: 'rgba(74, 144, 226, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    let balance = 0;
    for (let year = 0; year <= years; year++) {
        chartData.labels.push(`Year ${year}`);
        chartData.datasets[0].data.push(balance);
        if (year < years) {
            balance = (balance + netReserve) * (1 + returnRate);
        }
    }

    // Render chart
    renderChart('b831-chart', chartData, '831(b) Reserve Pool: Tax-Deferred Growth');
}

// ========================================
// CALCULATOR #3: SERP RETENTION ROI
// ========================================

let serpChart = null;

function calculateSERP() {
    // Get inputs
    const comp = parseFloat(document.getElementById('serp-comp').value);
    const replacement = parseFloat(document.getElementById('serp-replacement').value);
    const profitRisk = parseFloat(document.getElementById('serp-profit-risk').value);
    const funding = parseFloat(document.getElementById('serp-funding').value);
    const vesting = parseInt(document.getElementById('serp-vesting').value);
    const departureReduction = parseFloat(document.getElementById('serp-departure').value) / 100;

    // Update slider display
    document.getElementById('serp-departure-value').textContent = 
        Math.round(departureReduction * 100);

    // Validate inputs
    if (isNaN(comp) || isNaN(replacement) || isNaN(profitRisk) || isNaN(funding) || isNaN(vesting)) {
        alert('Please fill in all fields with valid numbers.');
        return;
    }

    // Calculate cost of loss
    const replacementCost = comp * replacement;
    const costOfLoss = replacementCost + profitRisk;

    // Calculate total SERP investment
    const totalInvestment = funding * vesting;

    // Calculate expected value protected (probability-weighted)
    const valueProtected = costOfLoss * departureReduction;

    // Break-even analysis
    const breakevenMultiple = costOfLoss / totalInvestment;
    let breakevenMessage = '';
    if (breakevenMultiple >= 2) {
        breakevenMessage = `SERP pays for itself if it prevents just 1 departure (${formatMultiplier(breakevenMultiple)} value)`;
    } else if (breakevenMultiple >= 1) {
        breakevenMessage = `SERP breaks even with 1 prevented departure`;
    } else {
        breakevenMessage = `Consider adjusting SERP funding or vesting schedule`;
    }

    // Continuity score
    let continuityScore = '';
    const roi = valueProtected / totalInvestment;
    if (roi >= 2.0) {
        continuityScore = '⭐⭐⭐⭐⭐ Excellent';
    } else if (roi >= 1.5) {
        continuityScore = '⭐⭐⭐⭐ Strong';
    } else if (roi >= 1.0) {
        continuityScore = '⭐⭐⭐ Good';
    } else if (roi >= 0.5) {
        continuityScore = '⭐⭐ Fair';
    } else {
        continuityScore = '⭐ Weak - Reconsider';
    }

    // Update outputs
    document.getElementById('serp-cost-loss').textContent = formatCurrency(costOfLoss);
    document.getElementById('serp-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('serp-value-protected').textContent = formatCurrency(valueProtected);
    document.getElementById('serp-breakeven').textContent = breakevenMessage;
    document.getElementById('serp-continuity').textContent = continuityScore;

    // === LEVERAGE STRATEGY (if enabled) ===
    const leverageEnabled = document.getElementById('serp-leverage-enabled').checked;
    const leverageOutputs = document.getElementById('serp-leverage-outputs');

    if (leverageEnabled) {
        leverageOutputs.style.display = 'block';

        // Get leverage inputs
        const cashValue = parseFloat(document.getElementById('serp-cash-value').value) || 0;
        const loanRate = parseFloat(document.getElementById('serp-loan-rate').value) / 100;
        const epigReturn = parseFloat(document.getElementById('serp-epig-return').value) / 100;
        const leverageYears = parseInt(document.getElementById('serp-leverage-years').value);

        // Leverage calculations
        const annualLoanCost = cashValue * loanRate;
        const fvEPIG = cashValue * Math.pow(1 + epigReturn, leverageYears);
        const totalInterest = annualLoanCost * leverageYears;
        const netGain = fvEPIG - cashValue - totalInterest; // FV - principal - interest
        const spread = (epigReturn - loanRate) * 100;

        // Double benefit summary
        const totalValueCreated = valueProtected + netGain;

        // Update leverage outputs
        document.getElementById('serp-borrowed-capital').textContent = formatCurrency(cashValue);
        document.getElementById('serp-loan-cost').textContent = formatCurrency(annualLoanCost);
        document.getElementById('serp-fv-epig').textContent = formatCurrency(fvEPIG);
        document.getElementById('serp-total-interest').textContent = formatCurrency(totalInterest);
        document.getElementById('serp-net-gain').textContent = formatCurrency(netGain);
        document.getElementById('serp-spread').textContent = formatPercent(spread);

        // Double benefit summary
        document.getElementById('leverage-benefit-1').textContent = formatCurrency(valueProtected);
        document.getElementById('leverage-benefit-2').textContent = formatCurrency(netGain);
        document.getElementById('leverage-total-value').textContent = formatCurrency(totalValueCreated);
    } else {
        leverageOutputs.style.display = 'none';
    }

    // Generate chart data (cumulative value over vesting period)
    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'SERP Cost (Cumulative)',
                data: [],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Value Protected (Cumulative)',
                data: [],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    for (let year = 0; year <= vesting; year++) {
        chartData.labels.push(`Year ${year}`);
        chartData.datasets[0].data.push(funding * year);
        chartData.datasets[1].data.push(valueProtected * (year / vesting)); // Linear vesting assumption
    }

    // Render chart
    renderChart('serp-chart', chartData, 'SERP ROI: Cost vs. Value Protected');
}

// ========================================
// CALCULATOR #4: MASTER DASHBOARD
// ========================================

let masterChart = null;

function calculateMaster() {
    // Get inputs
    const sde = parseFloat(document.getElementById('master-sde').value);
    const taxRate = parseFloat(document.getElementById('master-taxrate').value) / 100;
    const years = parseInt(document.getElementById('master-years').value);
    const epigReturn = parseFloat(document.getElementById('master-epig-return').value) / 100;
    const exitMultiple = parseFloat(document.getElementById('master-exit-multiple').value);
    const reinvestEff = parseFloat(document.getElementById('master-reinvest-eff').value);

    // Strategy toggles
    const dbEnabled = document.getElementById('master-db-enabled').checked;
    const b831Enabled = document.getElementById('master-831b-enabled').checked;
    const serpEnabled = document.getElementById('master-serp-enabled').checked;

    // Strategy amounts
    const dbContrib = dbEnabled ? parseFloat(document.getElementById('master-db-contrib').value) || 0 : 0;
    const b831Premium = b831Enabled ? parseFloat(document.getElementById('master-831b-premium').value) || 0 : 0;
    const serpFunding = serpEnabled ? parseFloat(document.getElementById('master-serp-funding').value) || 0 : 0;

    // Costs
    const ecaFee = parseFloat(document.getElementById('master-eca-fee').value) || 0;
    const setupCosts = parseFloat(document.getElementById('master-setup-costs').value) || 0;
    const thirdPartyCosts = parseFloat(document.getElementById('master-third-party').value) || 0;

    // Validate required inputs
    if (isNaN(sde) || isNaN(taxRate) || isNaN(years)) {
        alert('Please fill in required fields: SDE, Tax Rate, Years.');
        return;
    }

    if (ecaFee === 0) {
        alert('Please enter your ECA Annual Advisory Fee to calculate costs accurately.');
        // Allow calculation to continue with warning
    }

    // === CALCULATIONS ===

    // 1. Year-1 and Total Tax Savings
    const dbTaxSavings = dbContrib * taxRate;
    const b831TaxSavings = b831Premium * taxRate; // Assumes deductible
    const annualTaxSavings = dbTaxSavings + b831TaxSavings;
    const totalTaxSavings = annualTaxSavings * years;

    // 2. Retirement Accumulation (DB + SERP)
    const dbAccumulation = dbEnabled ? calculateFV(dbContrib, epigReturn, years) : 0;
    const serpAccumulation = serpEnabled ? calculateFV(serpFunding, epigReturn, years) : 0;
    const totalRetirement = dbAccumulation + serpAccumulation;

    // 3. 831(b) Reserve Pool
    const b831Admin = 25000; // Typical admin costs
    const b831NetReserve = b831Enabled ? (b831Premium - b831Admin) * 0.9 : 0; // 90% net after claims
    const b831Return = 0.05; // Conservative reserve return
    const totalReserves = b831Enabled ? calculateFV(b831NetReserve, b831Return, years) : 0;

    // 4. SERP Retention ROI (illustrative)
    const serpComp = 150000; // Default key employee comp
    const serpReplacementMultiple = 3;
    const serpProfitRisk = 200000;
    const serpCostOfLoss = (serpComp * serpReplacementMultiple) + serpProfitRisk;
    const serpDepartureReduction = 0.5; // 50% reduction
    const retentionROI = serpEnabled ? serpCostOfLoss * serpDepartureReduction : 0;

    // 5. Exit Uplift Calculation
    // Incremental SDE from reinvestment efficiency
    const incrementalSDE = sde * reinvestEff * 0.1; // 10% of SDE improved via reinvestment
    const exitUplift = incrementalSDE * exitMultiple * years * 0.5; // Illustrative compounding

    // 6. Total Costs
    const annualCosts = ecaFee + thirdPartyCosts;
    const totalCosts = setupCosts + (annualCosts * years);

    // === WOW MULTIPLIER ===
    const fvInvested = totalRetirement; // Already calculated above
    const netValueCreated = fvInvested + totalReserves + exitUplift - totalCosts;
    const multiplier = totalTaxSavings > 0 ? netValueCreated / totalTaxSavings : 0;

    // === UPDATE OUTPUTS ===
    document.getElementById('master-total-tax').textContent = formatCurrency(totalTaxSavings);
    document.getElementById('master-retirement').textContent = formatCurrency(totalRetirement);
    document.getElementById('master-reserves').textContent = formatCurrency(totalReserves);
    document.getElementById('master-retention-roi').textContent = formatCurrency(retentionROI);
    document.getElementById('master-exit-uplift').textContent = formatCurrency(exitUplift);

    // WOW Card Outputs
    document.getElementById('wow-tax-saved').textContent = formatCurrency(totalTaxSavings);
    document.getElementById('wow-costs').textContent = formatCurrency(totalCosts);
    document.getElementById('wow-fv-invested').textContent = formatCurrency(fvInvested);
    document.getElementById('wow-reserves').textContent = formatCurrency(totalReserves);
    document.getElementById('wow-exit').textContent = formatCurrency(exitUplift);
    document.getElementById('wow-net-value').textContent = formatCurrency(netValueCreated);
    document.getElementById('wow-multiplier').textContent = formatMultiplier(multiplier);

    // === GENERATE CHART DATA (Low/Base/High Scenarios) ===
    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'Low Scenario (5% EPIG)',
                data: [],
                borderColor: 'rgba(231, 76, 60, 0.8)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Base Scenario (8% EPIG)',
                data: [],
                borderColor: '#f5a623',
                backgroundColor: 'rgba(245, 166, 35, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3
            },
            {
                label: 'High Scenario (12% EPIG)',
                data: [],
                borderColor: 'rgba(76, 175, 80, 0.8)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: false,
                tension: 0.4
            }
        ]
    };

    const scenarios = [
        { return: 0.05, dataset: 0 },
        { return: epigReturn, dataset: 1 },
        { return: 0.12, dataset: 2 }
    ];

    for (let year = 0; year <= years; year++) {
        chartData.labels.push(`Year ${year}`);
        
        scenarios.forEach((scenario, idx) => {
            let balance = 0;
            // Calculate cumulative value for this year in this scenario
            for (let y = 1; y <= year; y++) {
                const yearlyContrib = dbContrib + serpFunding;
                balance = (balance + yearlyContrib) * (1 + scenario.return);
            }
            // Add reserves (conservative 5% always)
            balance += b831Enabled ? (b831NetReserve * year * 1.05) : 0;
            
            chartData.datasets[idx].data.push(balance);
        });
    }

    // Render chart
    renderChart('master-chart', chartData, '10-Year Wealth Accumulation: Low/Base/High Scenarios', true);
}

// ========================================
// CHART RENDERING
// ========================================

function renderChart(canvasId, data, title, isMultiScenario = false) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#ffffff'
                },
                legend: {
                    display: isMultiScenario,
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b8c1d9'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#b8c1d9',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// ========================================
// PRESET HANDLERS
// ========================================

// Handle preset buttons for individual calculator inputs
document.addEventListener('DOMContentLoaded', function() {
    // Preset buttons for EPIG return, tax rate, etc.
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.dataset.value;
            const input = this.parentElement.nextElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.value = value;
                // Remove active class from siblings
                this.parentElement.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Master Dashboard preset selector
    document.querySelectorAll('.preset-btn-large').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const preset = this.dataset.preset;
            const defaults = DENTIST_DEFAULTS[preset];
            
            // Apply defaults
            document.getElementById('master-sde').value = defaults.sde;
            document.getElementById('master-taxrate').value = defaults.taxRate;
            document.getElementById('master-epig-return').value = defaults.epigReturn;
            document.getElementById('master-exit-multiple').value = defaults.exitMultiple;
            document.getElementById('master-reinvest-eff').value = defaults.reinvestEff;
            document.getElementById('master-db-contrib').value = defaults.dbContrib;
            document.getElementById('master-831b-premium').value = defaults.b831Premium;
            document.getElementById('master-serp-funding').value = defaults.serpFunding;
            
            // Update active state
            this.parentElement.querySelectorAll('.preset-btn-large').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Strategy toggle handlers
    document.getElementById('master-db-enabled').addEventListener('change', function() {
        document.getElementById('master-db-inputs').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('master-831b-enabled').addEventListener('change', function() {
        document.getElementById('master-831b-inputs').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('master-serp-enabled').addEventListener('change', function() {
        document.getElementById('master-serp-inputs').style.display = this.checked ? 'block' : 'none';
    });

    // SERP leverage toggle handler
    document.getElementById('serp-leverage-enabled').addEventListener('change', function() {
        document.getElementById('serp-leverage-inputs').style.display = this.checked ? 'block' : 'none';
    });
});

// ========================================
// WOW FORMULA TOGGLE
// ========================================

function toggleWowFormula() {
    const content = document.getElementById('wow-formula-content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

// ========================================
// FAQ TOGGLE
// ========================================

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// ========================================
// ASSUMPTIONS DRAWER TOGGLE
// ========================================

function toggleAssumptions(drawerId) {
    const drawer = document.getElementById(drawerId);
    const content = drawer.querySelector('.assumptions-content');
    const toggle = drawer.querySelector('.assumptions-toggle');
    
    if (content.classList.contains('open')) {
        content.classList.remove('open');
        toggle.classList.remove('open');
    } else {
        content.classList.add('open');
        toggle.classList.add('open');
    }
}

// ========================================
// FORM SUBMISSION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('founding-member-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted! (In production, this would submit to your backend or Calendly API.)');
            // In production: send form data to backend or redirect to Calendly
        });
    }
});

console.log('Retirement Supercharger Calculators loaded successfully.');
