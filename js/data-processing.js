// Data transformation functions

// Process comprehensive data with all joins
function processComprehensiveData(data) {
    return data.map(record => ({
        id: record.id,
        sku: record.items?.sku || 'N/A',
        description: record.items?.description || 'N/A',
        brand: record.items?.brand || 'N/A',
        category: record.items?.category || 'N/A',
        customer: record.customers?.name || 'N/A',
        customer_code: record.customers?.code || 'N/A',
        package: record.items?.package_format || record.items?.package_size || 'N/A',
        units_per_case: record.items?.units_per_case || 1,
        case_weight: record.items?.case_weight_lbs || record.items?.weight_per_unit || 0,
        
        exw_cost: record.exw_cost_case || 0,
        fob_price: record.fob_price_case || 0,
        ddp_price: record.ddp_price_case || 0,
        ddp_net_price: record.ddp_net_price_case || 0,
        ddp_rebate: record.ddp_rebate_case || 0,
        
        sfs_margin_rate: record.sfs_margin_rate_percent || 0,
        quarter: record.price_quarters?.quarter_name || 'N/A',
        
        rawData: {
            ...record,
            vendor: record.vendor_price_history?.[0]?.vendors || null,
            logistics: null // Will be populated separately if needed
        }
    }));
}

// Process basic pricing data
function processBasicPricingData(data, dbAnalysis) {
    return data.map(record => ({
        id: record.id,
        sku: record.items?.sku || 'N/A',
        description: record.items?.description || 'N/A',
        brand: record.items?.brand || 'N/A',
        category: record.items?.category || 'N/A',
        customer: record.customers?.name || 'N/A',
        customer_code: record.customers?.code || 'N/A',
        package: record.items?.package_format || record.items?.package_size || 'N/A',
        units_per_case: record.items?.units_per_case || 1,
        case_weight: record.items?.case_weight_lbs || record.items?.weight_per_unit || 0,
        
        exw_cost: record.exw_cost_case || 0,
        fob_price: record.fob_price_case || 0,
        ddp_price: record.ddp_price_case || 0,
        ddp_net_price: record.ddp_net_price_case || 0,
        ddp_rebate: record.ddp_rebate_case || 0,
        
        sfs_margin_rate: record.sfs_margin_rate_percent || 0,
        quarter: record.price_quarters?.quarter_name || 'N/A',
        
        rawData: record
    }));
}

// Process individual tables with improved mapping
function processIndividualTables(tables) {
    const { pricing, items, customers, quarters, vendors, logistics } = tables;
    
    logDebug(`Processing MPC data: ${pricing?.length || 0} pricing, ${items?.length || 0} items, ${customers?.length || 0} customers, ${quarters?.length || 0} quarters, ${vendors?.length || 0} vendors`);
    
    return (pricing || []).map(record => {
        const item = (items || []).find(i => i.id === record.item_id) || {};
        const customer = (customers || []).find(c => c.id === record.customer_id) || {};
        const quarter = (quarters || []).find(q => q.id === record.quarter_id) || {};
        const customerLogistics = (logistics || []).find(l => l.customer_id === record.customer_id && l.quarter_id === record.quarter_id) || {};
        
        return {
            id: record.id,
            sku: item.sku || record.sku || 'N/A',
            description: item.description || record.description || 'N/A',
            brand: item.brand || record.brand || 'N/A',
            category: item.category || record.category || 'N/A',
            customer: customer.name || record.customer_name || 'N/A',
            customer_code: customer.code || record.customer_code || 'N/A',
            package: item.package_format || item.package_size || record.package_format || 'N/A',
            units_per_case: item.units_per_case || record.units_per_case || 1,
            case_weight: item.case_weight_lbs || item.weight_per_unit || record.case_weight_lbs || 0,
            
            exw_cost: record.exw_cost_case || 0,
            fob_price: record.fob_price_case || 0,
            ddp_price: record.ddp_price_case || 0,
            ddp_net_price: record.ddp_net_price_case || 0,
            ddp_rebate: record.ddp_rebate_case || 0,
            
            sfs_margin_rate: record.sfs_margin_rate_percent || 0,
            quarter: quarter.quarter_name || record.quarter || 'N/A',
            
            rawData: {
                ...record,
                customer_info: customer,
                item_info: item,
                quarter_info: quarter,
                logistics_info: customerLogistics
            }
        };
    });
}

// Create data from items table when pricing data isn't available
function createDataFromItems(items, customers, vendors) {
    return items.map((item, index) => {
        const customer = customers && customers.length > 0 ? customers[index % customers.length] : null;
        const vendor = vendors ? vendors.find(v => v.sku === item.sku || v.item_id === item.id) : null;
        
        return {
            id: item.id,
            sku: item.sku || 'N/A',
            description: item.description || 'N/A',
            brand: item.brand || 'N/A',
            category: item.category || 'N/A',
            customer: customer?.name || 'Unknown Customer',
            customer_code: customer?.code || 'UNK',
            package: item.package_format || 'N/A',
            units_per_case: item.units_per_case || 1,
            case_weight: item.case_weight_lbs || 0,
            
            exw_cost: vendor?.exw_price_case || item.base_cost || 0,
            fob_price: vendor?.fob_price_case || item.fob_price || 0,
            ddp_price: vendor?.ddp_price_case || item.ddp_price || 0,
            ddp_net_price: item.net_price || 0,
            ddp_rebate: item.rebate_amount || 0,
            
            sfs_margin_rate: item.margin_rate || 0,
            quarter: 'Q2 2025',
            
            rawData: {
                ...item,
                vendor: vendor
            }
        };
    });
}

// Process complex join data
function processComplexData(data) {
    updateConnectionStatus(`✅ Loaded ${data.length} items with complete supply chain data`);
    
    return data.map(record => ({
        id: record.id,
        sku: record.items?.sku || 'N/A',
        description: record.items?.description || 'N/A',
        brand: record.items?.brand || 'N/A',
        category: record.items?.category || 'N/A',
        customer: record.customers?.name || 'N/A',
        customer_code: record.customers?.code || 'N/A',
        package: record.items?.package_format || 'N/A',
        units_per_case: record.items?.units_per_case || 1,
        case_weight: record.items?.case_weight_lbs || 0,
        
        exw_cost: record.exw_cost_case || 0,
        fob_price: record.fob_price_case || 0,
        ddp_price: record.ddp_price_case || 0,
        ddp_net_price: record.ddp_net_price_case || 0,
        ddp_rebate: record.ddp_rebate_case || 0,
        
        sfs_margin_rate: record.sfs_margin_rate_percent || 0,
        quarter: record.price_quarters?.quarter_name || 'N/A',
        
        rawData: record
    }));
}

// Process individual table data
function processIndividualData(pricing, items, customers, quarters) {
    updateConnectionStatus(`✅ Loaded ${pricing.length} pricing records from individual tables`);
    
    return pricing.map(record => {
        const item = items.find(i => i.id === record.item_id) || {};
        const customer = customers.find(c => c.id === record.customer_id) || {};
        const quarter = quarters.find(q => q.id === record.quarter_id) || {};
        
        return {
            id: record.id,
            sku: item.sku || 'N/A',
            description: item.description || 'N/A',
            brand: item.brand || 'N/A',
            category: item.category || 'N/A',
            customer: customer.name || 'N/A',
            customer_code: customer.code || 'N/A',
            package: item.package_format || 'N/A',
            units_per_case: item.units_per_case || 1,
            case_weight: item.case_weight_lbs || 0,
            
            exw_cost: record.exw_cost_case || 0,
            fob_price: record.fob_price_case || 0,
            ddp_price: record.ddp_price_case || 0,
            ddp_net_price: record.ddp_net_price_case || 0,
            ddp_rebate: record.ddp_rebate_case || 0,
            
            sfs_margin_rate: record.sfs_margin_rate_percent || 0,
            quarter: quarter.quarter_name || 'N/A',
            
            rawData: record
        };
    });
}

// Create sample data for demonstration
function createSampleData() {
    updateConnectionStatus('📊 Using sample Victory Foods data for demonstration');
    
    return [
        {
            id: 'sample-1',
            sku: '440173',
            description: 'Sweet Plantain Slices',
            brand: 'Doria Sofia',
            category: 'Frozen Vegetables',
            customer: 'Victory Foods',
            customer_code: 'VICTORYFO',
            package: '4/36oz',
            units_per_case: 4,
            case_weight: 24,
            
            exw_cost: 15.80,
            fob_price: 23.38,
            ddp_price: 23.89,
            ddp_net_price: 1.01,
            ddp_rebate: 22.88,
            
            sfs_margin_rate: 16.2,
            quarter: 'Q2 2025',
            
            rawData: {
                exw_cost_case: 15.80,
                fob_price_case: 23.38,
                ddp_price_case: 23.89,
                ddp_net_price_case: 1.01,
                ddp_rebate_case: 22.88,
                sfs_margin_rate_percent: 16.2,
                tariff_rate_percent: 10,
                tariff_amount_case: 1.58,
                sales_broker_rate_percent: 3,
                sales_broker_amount_case: 0.72,
                import_broker_per_case: 0.14,
                gross_margin_percent: 21.5,
                gross_margin_amount_case: 5.14
            }
        },
        {
            id: 'sample-2',
            sku: '440174',
            description: 'Bibigo Chicken & Cilantro Mini Wontons',
            brand: 'Bibigo',
            category: 'Frozen Asian',
            customer: 'Victory Foods',
            customer_code: 'VICTORYFO',
            package: '10oz x 4',
            units_per_case: 4,
            case_weight: 20,
            
            exw_cost: 18.50,
            fob_price: 27.20,
            ddp_price: 28.15,
            ddp_net_price: 26.40,
            ddp_rebate: 1.75,
            
            sfs_margin_rate: 18.5,
            quarter: 'Q2 2025',
            
            rawData: {
                exw_cost_case: 18.50,
                fob_price_case: 27.20,
                ddp_price_case: 28.15,
                ddp_net_price_case: 26.40,
                ddp_rebate_case: 1.75,
                sfs_margin_rate_percent: 18.5,
                tariff_rate_percent: 12,
                tariff_amount_case: 2.22,
                sales_broker_rate_percent: 3,
                sales_broker_amount_case: 0.82,
                import_broker_per_case: 0.16,
                gross_margin_percent: 22.8,
                gross_margin_amount_case: 6.40
            }
        }
    ];
}