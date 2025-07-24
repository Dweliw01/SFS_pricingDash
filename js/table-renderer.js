// Table rendering functions

// Render items in table
function renderItems(items) {
    const tableContainer = document.getElementById('itemsTable');
    const header = tableContainer.querySelector('.table-header');
    
    // Clear existing rows
    const existingRows = tableContainer.querySelectorAll('.table-row');
    existingRows.forEach(row => row.remove());

    // Clear any previous "no results" message
    const existingNoResults = tableContainer.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }

    if (items.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.cssText = 'text-align: center; padding: 40px; color: #6b7280; grid-column: 1 / -1;';
        noResults.textContent = 'No items found';
        tableContainer.appendChild(noResults);
        return;
    }

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.onclick = () => showItemDetail(item);
        
        const marginClass = getMarginClass(item.sfs_margin_rate);
        const hasRebate = item.ddp_rebate > 0;
        
        row.innerHTML = `
            <div class="sku">${item.sku}</div>
            <div class="description" title="${item.description}">${truncateText(item.description, 25)}</div>
            <div class="brand">
                <div style="font-weight: 600;">${item.brand}</div>
                <div style="font-size: 0.75rem; color: #6b7280;">${item.category}</div>
            </div>
            <div class="customer">${item.customer_code || item.customer}</div>
            <div class="brand">${item.quarter}</div>
            <div class="brand">${item.package}</div>
            <div class="price">$${item.exw_cost.toFixed(2)}</div>
            <div class="price">$${item.fob_price.toFixed(2)}</div>
            <div class="price">$${item.ddp_price.toFixed(2)}</div>
            <div class="price ${hasRebate ? 'margin-good' : ''}">
                $${item.ddp_net_price.toFixed(2)}
                ${hasRebate ? '<div style="font-size: 0.7rem;">rebate</div>' : ''}
            </div>
            <div class="margin ${marginClass}">${item.sfs_margin_rate.toFixed(1)}%</div>
            <div style="display: flex; gap: 5px;">
                <button onclick="event.stopPropagation(); showPriceHistory('${item.sku}')" 
                        style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem;">
                    📈
                </button>
                <button onclick="event.stopPropagation(); showVendorInfo('${item.sku}')" 
                        style="background: #059669; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem;">
                    🏭
                </button>
            </div>
        `;
        
        tableContainer.appendChild(row);
    });
}

// Vendor info modal
function showVendorInfo(sku) {
    alert('🏭 Vendor Information - ' + sku + '\n\nThis would display:\n• Complete vendor contact details\n• Supply chain performance metrics\n• Quality and delivery ratings\n• Alternative supplier options\n• Risk assessment data\n\nData from vendors and vendor_price_history tables would provide comprehensive supplier insights.');
}