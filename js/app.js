// Main application logic

// Global variables
let currentItems = [];
let allItemsData = [];

// Retry connection
async function retryConnection() {
    updateConnectionStatus('Retrying connection...', 'warning');
    currentItems = [];
    allItemsData = [];
    debugLog = [];
    
    document.getElementById('loadingState').style.display = 'block';
    await initializeApp();
}

// Load sample data
function loadSampleData() {
    logDebug('User requested sample data');
    currentItems = createSampleData();
    allItemsData = currentItems;
    hideLoading();
    renderItems(currentItems);
}

// Initialize app with enhanced database analysis
async function initializeApp() {
    try {
        logDebug('Starting enhanced app initialization...');
        updateConnectionStatus('🔍 Connecting to MPC database and analyzing structure...', 'warning');
        
        // Clear any existing content that might be interfering
        document.body.style.overflow = 'auto';
        
        // Test basic connectivity first
        const isConnected = await testBasicConnectivity();
        if (!isConnected) {
            logDebug('Basic connectivity failed, using sample data');
            currentItems = createSampleData();
        } else {
            // Try to load real data with comprehensive analysis
            currentItems = await loadRealDatabaseItems();
        }
        
        allItemsData = currentItems;
        
        // Setup search
        document.getElementById('searchInput').addEventListener('input', enhancedSearch);
        
        // Render items
        hideLoading();
        renderItems(currentItems);
        
        logDebug('Enhanced app initialization completed successfully');
        
        // Add a button to re-analyze database
        addDatabaseAnalysisButton();
        
    } catch (error) {
        logDebug('App initialization failed completely', error);
        updateConnectionStatus('❌ Initialization failed. Using sample data.', 'error');
        currentItems = createSampleData();
        allItemsData = currentItems;
        hideLoading();
        renderItems(currentItems);
    }
}

// Setup modal event listeners
function setupModalEventListeners() {
    // Close modal when clicking outside
    document.getElementById('detailModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeDetail();
        }
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', function() {
    setupModalEventListeners();
    initializeApp();
});

// Export functions for onclick handlers
window.retryConnection = retryConnection;
window.loadSampleData = loadSampleData;
window.toggleDebug = toggleDebug;
window.showItemDetail = showItemDetail;
window.showPriceHistory = showPriceHistory;
window.showVendorInfo = showVendorInfo;
window.closeDetail = closeDetail;