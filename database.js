// Database functions

// Enhanced database fetch function with better error handling
async function fetchFromDatabase(endpoint, options = {}) {
    try {
        logDebug(`Attempting to fetch: ${endpoint}`);
        
        const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
        };
        
        logDebug(`Making request to: ${url}`);
        
        const response = await fetch(url, {
            headers,
            ...options
        });
        
        logDebug(`Response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            logDebug(`Successfully fetched data`, { recordCount: data.length, sample: data[0] });
            return data;
        } else {
            const errorText = await response.text();
            logDebug(`API Error: ${response.status}`, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        logDebug(`Fetch error: ${error.message}`, error);
        throw error;
    }
}

// Test basic connectivity
async function testBasicConnectivity() {
    try {
        updateConnectionStatus('Testing basic connectivity...', 'warning');
        
        // Try a simple query first
        const testData = await fetchFromDatabase('items?select=count');
        logDebug('Basic connectivity test passed', testData);
        return true;
    } catch (error) {
        logDebug('Basic connectivity test failed', error);
        return false;
    }
}

// Database analysis function to check what's available - UPDATED FOR REAL SCHEMA
async function analyzeDatabaseStructure() {
    logDebug('Starting comprehensive database analysis...');
    updateConnectionStatus('🔍 Analyzing MPC database structure...', 'warning');
    
    const tables = DATABASE_TABLES;

    const analysis = {};

    for (const table of tables) {
        try {
            logDebug(`Checking ${table} table...`);
            
            // Get table structure and sample data
            const data = await fetchFromDatabase(`${table}?select=*&limit=3`);
            
            if (data && Array.isArray(data)) {
                analysis[table] = {
                    recordCount: data.length,
                    sampleData: data[0] || null,
                    allFields: data[0] ? Object.keys(data[0]) : [],
                    available: true
                };
                
                logDebug(`✅ ${table}: Found ${data.length} records with fields: ${data[0] ? Object.keys(data[0]).join(', ') : 'none'}`);
                
                // Log sample data for key tables
                if (data[0] && ['items', 'customers', 'vendors', 'pricing_breakdown'].includes(table)) {
                    logDebug(`${table} sample:`, data[0]);
                }
            } else {
                analysis[table] = { available: false, error: 'No data or invalid response' };
                logDebug(`❌ ${table}: No data or invalid response`);
            }
        } catch (error) {
            analysis[table] = { available: false, error: error.message };
            logDebug(`❌ ${table}: Error - ${error.message}`);
        }
    }

    // Log comprehensive analysis
    logDebug('=== MPC DATABASE ANALYSIS COMPLETE ===');
    for (const [table, info] of Object.entries(analysis)) {
        if (info.available) {
            logDebug(`✅ ${table}: ${info.recordCount} records, Fields: ${info.allFields.join(', ')}`);
        } else {
            logDebug(`❌ ${table}: ${info.error}`);
        }
    }

    return analysis;
}

// Enhanced data loading optimized for your schema
async function loadRealDatabaseItems() {
    try {
        updateConnectionStatus('🔍 Loading from MPC database tables...', 'warning');
        
        // First, analyze what's available in the database
        const dbAnalysis = await analyzeDatabaseStructure();
        
        // Strategy 1: Try comprehensive join with all related tables
        if (dbAnalysis.pricing_breakdown?.available && dbAnalysis.items?.available) {
            try {
                logDebug('Strategy 1: Loading comprehensive pricing data with joins...');
                
                const comprehensiveQuery = `pricing_breakdown?select=*,items(*),customers(*),price_quarters(*),vendor_price_history(vendors(*))`;
                const comprehensiveData = await fetchFromDatabase(comprehensiveQuery);
                
                if (comprehensiveData && comprehensiveData.length > 0) {
                    logDebug('✅ Comprehensive join query successful');
                    updateConnectionStatus(`✅ Loaded ${comprehensiveData.length} items with complete supply chain data`);
                    return processComprehensiveData(comprehensiveData);
                }
            } catch (error) {
                logDebug('Comprehensive join failed, trying simpler joins...', error);
            }
        }

        // Strategy 2: Load main pricing data with basic joins
        if (dbAnalysis.pricing_breakdown?.available) {
            try {
                logDebug('Strategy 2: Loading pricing breakdown with basic joins...');
                
                const pricingQuery = `pricing_breakdown?select=*,items(*),customers(*),price_quarters(*)`;
                const pricingData = await fetchFromDatabase(pricingQuery);
                
                if (pricingData && pricingData.length > 0) {
                    logDebug('✅ Basic pricing join successful');
                    updateConnectionStatus(`✅ Loaded ${pricingData.length} pricing records from MPC database`);
                    return processBasicPricingData(pricingData, dbAnalysis);
                }
            } catch (error) {
                logDebug('Basic pricing join failed, trying individual tables...', error);
            }
        }

        // Strategy 3: Load individual tables and join manually
        const loadPromises = [];
        const availableTables = {};
        
        if (dbAnalysis.pricing_breakdown?.available) {
            loadPromises.push(fetchFromDatabase('pricing_breakdown?select=*').then(data => {
                availableTables.pricing = data;
                return data;
            }));
        }
        
        if (dbAnalysis.items?.available) {
            loadPromises.push(fetchFromDatabase('items?select=*').then(data => {
                availableTables.items = data;
                return data;
            }));
        }
        
        if (dbAnalysis.customers?.available) {
            loadPromises.push(fetchFromDatabase('customers?select=*').then(data => {
                availableTables.customers = data;
                return data;
            }));
        }
        
        if (dbAnalysis.vendors?.available) {
            loadPromises.push(fetchFromDatabase('vendors?select=*').then(data => {
                availableTables.vendors = data;
                return data;
            }));
        }
        
        if (dbAnalysis.price_quarters?.available) {
            loadPromises.push(fetchFromDatabase('price_quarters?select=*').then(data => {
                availableTables.quarters = data;
                return data;
            }));
        }

        if (dbAnalysis.container_logistics?.available) {
            loadPromises.push(fetchFromDatabase('container_logistics?select=*').then(data => {
                availableTables.logistics = data;
                return data;
            }));
        }

        await Promise.allSettled(loadPromises);
        
        logDebug('Available tables loaded:', Object.keys(availableTables));

        // Process available data
        if (availableTables.pricing && availableTables.pricing.length > 0) {
            updateConnectionStatus(`✅ Loaded real data from ${Object.keys(availableTables).length} MPC database tables`);
            return processIndividualTables(availableTables);
        }

        // Strategy 4: Check if any individual tables have data we can use
        if (availableTables.items && availableTables.items.length > 0) {
            logDebug('Creating data from items table...');
            updateConnectionStatus(`✅ Loaded ${availableTables.items.length} items from MPC database`);
            return createDataFromItems(availableTables.items, availableTables.customers, availableTables.vendors);
        }

        // Fallback to sample data
        logDebug('No usable data found, using sample data');
        updateConnectionStatus('📊 MPC database connected but no pricing data found. Using sample data.', 'warning');
        return createSampleData();

    } catch (error) {
        logDebug('Complete database loading failed', error);
        updateConnectionStatus('❌ MPC database error. Using sample data.', 'error');
        return createSampleData();
    }
}