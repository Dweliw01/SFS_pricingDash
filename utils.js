// Utility functions

// Global variables
let debugLog = [];

// Enhanced logging function
function logDebug(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    debugLog.push(logEntry);
    if (data) {
        debugLog.push(JSON.stringify(data, null, 2));
    }
    console.log(logEntry, data);
    updateDebugDisplay();
}

function updateDebugDisplay() {
    const debugContent = document.getElementById('debugContent');
    if (debugContent) {
        debugContent.innerHTML = debugLog.slice(-CONFIG.UI.DEBUG_LOG_LINES).join('<br>');
    }
}

function toggleDebug() {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
}

// Update connection status
function updateConnectionStatus(message, type = 'success') {
    const status = document.getElementById('connectionStatus');
    status.textContent = message;
    status.className = `connection-status ${type === 'success' ? '' : type}`;
    logDebug(`Status update: ${message} (${type})`);
}

function showLoading() {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'block';
    }
}

function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'none';
    }
}

// Text utilities
function truncateText(text, maxLength) {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Margin class calculation
function getMarginClass(margin) {
    if (margin >= CONFIG.MARGIN_THRESHOLDS.GOOD) return 'margin-good';
    if (margin >= CONFIG.MARGIN_THRESHOLDS.WARNING) return 'margin-warning';
    return 'margin-danger';
}

// Currency formatting
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Enhanced search
function enhancedSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredItems = currentItems.filter(item =>
        item.sku.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase().includes(searchTerm) ||
        item.customer.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    renderItems(filteredItems);
}

// Add database analysis button for debugging
function addDatabaseAnalysisButton() {
    const controlsContainer = document.querySelector('.controls');
    if (controlsContainer && !document.getElementById('analyzeDbBtn')) {
        const analyzeBtn = document.createElement('button');
        analyzeBtn.id = 'analyzeDbBtn';
        analyzeBtn.className = 'retry-button';
        analyzeBtn.style.cssText = 'background: #8b5cf6; margin-left: 10px;';
        analyzeBtn.innerHTML = '🔍 Analyze Database';
        analyzeBtn.onclick = async () => {
            toggleDebug(); // Show debug info
            await analyzeDatabaseStructure();
        };
        controlsContainer.appendChild(analyzeBtn);
    }
}