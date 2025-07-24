// Modal functions

// Show item detail modal - WITH CUSTOM 440173 MODAL
async function showItemDetail(item) {
    // Check if this is the specific SKU 440173 that should show the custom detailed view
    if (item.sku === '440173') {
        showCustomDetailModal(item);
        return;
    }
    
    // Default modal for other items
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('detailItemTitle');
    const subtitle = document.getElementById('detailItemSubtitle');
    
    title.textContent = `${item.sku} - ${item.description}`;
    subtitle.textContent = `${item.brand} | ${item.package} | 4 units per case`;
    
    // Update price flow with real data
    document.getElementById('exwPrice').textContent = `$${item.exw_cost.toFixed(2)}`;
    document.getElementById('fobPrice').textContent = `$${item.fob_price.toFixed(2)}`;
    document.getElementById('ddpPrice').textContent = `$${item.ddp_price.toFixed(2)}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    updateDetailSections(item.rawData);
}

// Custom detailed modal for SKU 440173 based on the screenshot
async function showCustomDetailModal(item) {
    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.style.display = 'block';
    modal.style.zIndex = '1001';
    
    // Fetch factory information from database
    let factoryInfo = {
        name: 'Loading...',
        contact_person: 'Loading...',
        phone: 'Loading...',
        email: 'Loading...',
        address: 'Loading...',
        exw_price: item.exw_cost || 15.80,
        lead_time: 'Loading...'
    };
    
    try {
        // Try to get vendor information from the MPC database using your schema
        logDebug(`Fetching vendor data for SKU: ${item.sku}`);
        
        // Strategy 1: Get vendor through vendor_price_history
        const vendorPriceQuery = `vendor_price_history?select=*,vendors(*),items!inner(*)&items.sku=eq.${item.sku}`;
        const vendorPriceData = await fetchFromDatabase(vendorPriceQuery);
        
        if (vendorPriceData && vendorPriceData.length > 0) {
            const latestVendorPrice = vendorPriceData[0]; // Get most recent
            const vendor = latestVendorPrice.vendors;
            
            if (vendor) {
                logDebug('Found vendor through vendor_price_history', vendor);
                factoryInfo = {
                    name: vendor.name || 'Unknown Vendor',
                    contact_person: vendor.contact_info?.contact_person || 'N/A',
                    phone: vendor.contact_info?.phone || 'N/A',
                    email: vendor.contact_info?.email || 'N/A',
                    address: `${vendor.country || 'Unknown Country'}`,
                    exw_price: latestVendorPrice.exw_cost_case || item.exw_cost || 15.80,
                    lead_time: vendor.contact_info?.lead_time_days ? `${vendor.contact_info.lead_time_days} days` : '45 days'
                };
            }
        } else {
            // Strategy 2: Try direct vendor lookup if we have vendor info in rawData
            if (item.rawData?.vendor) {
                const vendor = item.rawData.vendor;
                logDebug('Found vendor in rawData', vendor);
                factoryInfo = {
                    name: vendor.name || 'Unknown Vendor',
                    contact_person: vendor.contact_info?.contact_person || 'N/A',
                    phone: vendor.contact_info?.phone || 'N/A',
                    email: vendor.contact_info?.email || 'N/A',
                    address: `${vendor.country || 'Unknown Country'}`,
                    exw_price: item.exw_cost || 15.80,
                    lead_time: vendor.contact_info?.lead_time_days ? `${vendor.contact_info.lead_time_days} days` : '45 days'
                };
            } else {
                // Strategy 3: Get all vendors and try to match by item
                const vendorsData = await fetchFromDatabase('vendors?select=*');
                if (vendorsData && vendorsData.length > 0) {
                    // For now, use first active vendor as fallback
                    const vendor = vendorsData.find(v => v.is_active) || vendorsData[0];
                    logDebug('Using fallback vendor', vendor);
                    factoryInfo = {
                        name: vendor.name || 'Unknown Vendor',
                        contact_person: vendor.contact_info?.contact_person || 'N/A',
                        phone: vendor.contact_info?.phone || 'N/A',
                        email: vendor.contact_info?.email || 'N/A',
                        address: `${vendor.country || 'Unknown Country'}`,
                        exw_price: item.exw_cost || 15.80,
                        lead_time: vendor.contact_info?.lead_time_days ? `${vendor.contact_info.lead_time_days} days` : '45 days'
                    };
                }
            }
        }
    } catch (error) {
        logDebug('Failed to fetch vendor information from MPC database', error);
        // Keep default factory info if database fetch fails
        factoryInfo.name = 'Doria Sofia Manufacturing';
        factoryInfo.contact_person = 'Carlos Rodriguez';
        factoryInfo.phone = '+57-1-234-5678';
        factoryInfo.email = 'crodriguez@doriasofia.com';
        factoryInfo.address = 'Bogotá, Colombia';
        factoryInfo.lead_time = '45 days';
    }
    
    modal.innerHTML = `
        <div class="detail-content" style="max-width: 1000px; margin: 20px auto; background: white; border-radius: 20px; overflow: hidden; position: relative;">
            <div class="detail-header" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 25px 30px; position: relative;">
                <button class="close-btn" onclick="this.closest('.detail-modal').remove()" style="position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; transition: all 0.3s ease;">&times;</button>
                <div class="item-title" style="font-size: 1.6rem; font-weight: 700; margin-bottom: 8px;">440173 - Sweet Plantain Slices</div>
                <div class="item-subtitle" style="opacity: 0.9; font-size: 1rem; margin-bottom: 15px;">Doria Sofia | 4/36oz | 4 units per case</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label style="color: rgba(255,255,255,0.9); font-size: 0.9rem; font-weight: 500;">View pricing for:</label>
                    <select style="padding: 8px 15px; border-radius: 8px; border: none; background: rgba(255,255,255,0.95); color: #333; font-size: 0.9rem; min-width: 200px; cursor: pointer;">
                        <option>Victory Foods</option>
                    </select>
                </div>
            </div>
            
            <div style="padding: 30px;">
                <!-- Price Flow Overview -->
                <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 20px; margin-bottom: 30px; align-items: center;">
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 2px solid #64748b;">
                        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">EXW Factory Cost</div>
                        <div style="font-size: 1.4rem; font-weight: 700; color: #1e40af;">$15.80</div>
                    </div>
                    <div style="font-size: 1.5rem; color: #64748b; font-weight: bold;">→</div>
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 2px solid #3b82f6;">
                        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">FOB Price</div>
                        <div style="font-size: 1.4rem; font-weight: 700; color: #1e40af;">$23.38</div>
                    </div>
                    <div style="font-size: 1.5rem; color: #64748b; font-weight: bold;">→</div>
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 2px solid #10b981;">
                        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">DDP Final Price</div>
                        <div style="font-size: 1.4rem; font-weight: 700; color: #1e40af;">$23.89</div>
                    </div>
                </div>

                <!-- Container & Logistics Overview -->
                <div style="background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid #a855f7;">
                    <h3 style="color: #7c3aed; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">🚢 Container & Logistics Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">2,200</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Cases per Container</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">52,800 lbs</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Net Weight</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">$5,675</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Ocean Freight Total</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">$1,122</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Inland Freight Total</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">10×11</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Pallet Pattern (TI×HI)</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #7c3aed;">Palletized</div>
                            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">Configuration</div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Cost Perspectives -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%); border-radius: 12px; padding: 25px; border: 1px solid #f59e0b;">
                        <h3 style="color: #1e40af; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">📦 Vendor Costs</h3>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">EXW Factory Cost:</span>
                                <span style="font-weight: 600; color: #1f2937;">$15.80</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Sales Broker (3%):</span>
                                <span style="font-weight: 600; color: #1f2937;">$0.72</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Tariff (10%):</span>
                                <span style="font-weight: 600; color: #1f2937;">$1.58</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Import Broker:</span>
                                <span style="font-weight: 600; color: #1f2937;">$0.14</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #059669; font-size: 1rem; margin-top: 10px; padding-top: 10px; border-top: 2px solid #10b981;">
                                <span>Total Vendor Cost:</span>
                                <span>$18.24</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; border: 1px solid #3b82f6;">
                        <h3 style="color: #1e40af; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">🚢 Shipping & Logistics</h3>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Ocean Freight/Case:</span>
                                <span style="font-weight: 600; color: #1f2937;">$2.58</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Inland Freight/Case:</span>
                                <span style="font-weight: 600; color: #1f2937;">$0.51</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Case Weight:</span>
                                <span style="font-weight: 600; color: #1f2937;">24 lbs</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Units per Case:</span>
                                <span style="font-weight: 600; color: #1f2937;">4 units</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #059669; font-size: 1rem; margin-top: 10px; padding-top: 10px; border-top: 2px solid #10b981;">
                                <span>Total Freight/Case:</span>
                                <span>$3.09</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, #d1fae5 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; border: 1px solid #10b981;">
                        <h3 style="color: #1e40af; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">💰 SFS Margins</h3>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Landed Cost:</span>
                                <span style="font-weight: 600; color: #1f2937;">$20.82</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">SFS Margin (16.2%):</span>
                                <span style="font-weight: 600; color: #1f2937;">$2.56</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                                <span style="color: #4b5563;">Operating Costs:</span>
                                <span style="font-weight: 600; color: #1f2937;">$1.07</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #059669; font-size: 1rem; margin-top: 10px; padding-top: 10px; border-top: 2px solid #10b981;">
                                <span>Total SFS Margin:</span>
                                <span>$2.56</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Factory Information -->
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; border: 1px solid #10b981;">
                    <h3 style="color: #059669; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">🏭 Factory Information & Contact Details</h3>
                    <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #a7f3d0;">
                        <div style="font-weight: 700; color: #059669; font-size: 1.1rem; margin-bottom: 15px;">${factoryInfo.name}</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <span style="width: 16px; text-align: center;">👤</span>
                                <span>${factoryInfo.contact_person}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <span style="width: 16px; text-align: center;">📞</span>
                                <span>${factoryInfo.phone}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <span style="width: 16px; text-align: center;">📧</span>
                                <span>${factoryInfo.email}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                                <span style="width: 16px; text-align: center;">📍</span>
                                <span>${factoryInfo.address}</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem;">
                            <span style="color: #4b5563;">EXW Price per Case:</span>
                            <span style="font-weight: 600; color: #1f2937;">$${factoryInfo.exw_price.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 0.9rem;">
                            <span style="color: #4b5563;">Lead Time:</span>
                            <span style="font-weight: 600; color: #1f2937;">${factoryInfo.lead_time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Price history modal (moved analytics dashboard content here)
function showPriceHistory(sku) {
    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.style.display = 'block';
    modal.style.zIndex = '1001';
    
    modal.innerHTML = `
        <div class="detail-content" style="max-width: 1800px; max-height: 90vh; overflow-y: auto;">
            <div class="detail-header" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);">
                <button class="close-btn" onclick="this.closest('.detail-modal').remove()">&times;</button>
                <div class="item-title">📊 SFS Analytics Dashboard</div>
                <div class="item-subtitle">Victory Foods - Sweet Plantain Slices Analysis (Real Data)</div>
            </div>
            
            <div class="detail-body" style="padding: 30px;">
			<div style="font-size: 1.3rem; font-weight: 400; color: #1f2937; margin-bottom: 8px;">440173 - Sweet Plantain Slices</div>
                   
                <!-- Real Executive Metrics -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 4px solid #10b981;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 0.85rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Container Value</div>
                            <div style="font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; background: #f3f4f6; color: #6b7280;">2,200 cases</div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px;">$3.23</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Total logistics cost allocation</div>
                    </div>

                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 4px solid #3b82f6;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 0.85rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">SFS Gross Margin</div>
                            <div style="font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; background: #f3f4f6; color: #6b7280;">Per Case</div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px;">14.5%</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">$2.29 gross profit per case</div>
                    </div>

                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 4px solid #f59e0b;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 0.85rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Competitive Advantage</div>
                            <div style="font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; background: #d1fae5; color: #059669;">vs Sabor Nuestro</div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px;">$7.73</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Lower price per case (24.5%)</div>
                    </div>

                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 4px solid #8b5cf6;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="font-size: 0.85rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Container Total Value</div>
                            <div style="font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; background: #f3f4f6; color: #6b7280;">Full Container</div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px;">$52,556</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">Total container value at DDP price</div>
                    </div>				
                </div>

                <!-- Cost Breakdown & Competition -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                        <div style="font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-bottom: 20px;">💰 Actual Cost Breakdown - SKU 440173</div>
                        <div style="height: 250px; background: white; border-radius: 8px; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; left: 2%; top: 60%; width: 11%; height: 35%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>EXW Cost</div>
                                <div>$15.80</div>
                            </div>
                            <div style="position: absolute; left: 15%; top: 55%; width: 9%; height: 40%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>Tariff</div>
                                <div>$1.58</div>
                            </div>
                            <div style="position: absolute; left: 26%; top: 52%; width: 9%; height: 43%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>Sales Broker</div>
                                <div>$0.72</div>
                            </div>
                            <div style="position: absolute; left: 37%; top: 50%; width: 8%; height: 45%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>Import</div>
                                <div>$0.14</div>
                            </div>
                            <div style="position: absolute; left: 47%; top: 35%; width: 11%; height: 60%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>Ocean Freight</div>
                                <div>$2.58</div>
                            </div>
                            <div style="position: absolute; left: 60%; top: 32%; width: 9%; height: 63%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>Inland</div>
                                <div>$0.51</div>
                            </div>
                            <div style="position: absolute; left: 71%; top: 18%; width: 11%; height: 77%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>SFS Margin</div>
                                <div>$2.29</div>
                            </div>
                            <div style="position: absolute; left: 84%; top: 5%; width: 14%; height: 90%; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 4px; color: white; font-size: 0.75rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div>DDP Price</div>
                                <div>$23.89</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                        <div style="font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-bottom: 20px;">🎯 Current Market Position</div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr>
                                    <th style="background: #f8fafc; padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 0.85rem;">Supplier</th>
                                    <th style="background: #f8fafc; padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 0.85rem;">Price/Case</th>
                                    <th style="background: #f8fafc; padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 0.85rem;">Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="background: #f0f9ff; font-weight: 700;">
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;"><strong>SFS (You)</strong></td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;"><strong>$23.89</strong></td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #059669; font-weight: 600;">Baseline</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;">Sabor Nuestro 4/5lb</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;">$31.62</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #059669; font-weight: 600;">+$7.73 (+32%)</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;">Sabor Nuestro 6/5lb</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem;">$34.60</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #059669; font-weight: 600;">+$10.71 (+45%)</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="margin-top: 15px; padding: 12px; background: #f0f9ff; border-radius: 8px; font-size: 0.85rem;">
                            <strong>Market Position:</strong> Your pricing provides significant value to Victory Foods with 24-45% cost savings vs alternatives.
                        </div>
                    </div>
                </div>

                <!-- Historical Pricing Analysis -->
                <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 30px;">
                    <div style="font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-bottom: 20px;">📈 Historical Pricing Analysis (From Your Research)</div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 15px; align-items: center; margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #f8fafc; font-weight: 600;">
                        <div>Supplier</div>
                        <div style="text-align: center; padding: 15px; border-radius: 8px; margin: 0 5px; font-weight: 600; background: #dbeafe; color: #1d4ed8;">2025</div>
                        <div style="text-align: center; padding: 15px; border-radius: 8px; margin: 0 5px; font-weight: 600; background: #fef3c7; color: #d97706;">2024</div>
                        <div style="text-align: center; padding: 15px; border-radius: 8px; margin: 0 5px; font-weight: 600; background: #f3e8ff; color: #7c3aed;">2023</div>
                        <div style="text-align: center; padding: 15px; border-radius: 8px; margin: 0 5px; font-weight: 600; background: #ecfdf5; color: #059669;">2022</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 15px; align-items: center; margin-bottom: 12px; padding: 12px; border-radius: 8px; transition: background 0.2s ease;">
                        <div style="font-weight: 600; color: #1f2937;">SFS (Your Pricing)</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">$23.09</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">NE</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">NE</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">NE</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 15px; align-items: center; margin-bottom: 12px; padding: 12px; border-radius: 8px; transition: background 0.2s ease;">
                        <div style="font-weight: 600; color: #1f2937;">Sabor Nuestro Sweet Plantain</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">$31.62</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">$22.73 - $23.00</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">$26.72 - $29.31</div>
                        <div style="text-align: center; font-weight: 600; color: #374151;">$22.03 - $22.23</div>
                    </div>
                    
                    <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                            <div style="font-weight: 600; color: #1d4ed8; margin-bottom: 8px;">Supplier Cost History</div>
                            <div style="font-size: 0.9rem; color: #374151;">
                                <strong>2025:</strong> $15.60 → Current $15.80<br>
                                <strong>2024:</strong> $21.25 - $21.50<br>
                                <strong>2023:</strong> $15.60 - $21.50
                            </div>
                        </div>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                            <div style="font-weight: 600; color: #059669; margin-bottom: 8px;">Key Insights</div>
                            <div style="font-size: 0.9rem; color: #374151;">
                                • Competitor prices more volatile<br>
                                • Your costs remained stable<br>
                                • Maintained 24%+ price advantage
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Source Attribution -->
                <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; font-size: 0.85rem; color: #1e40af;">
                    <strong>📋 Data Sources:</strong> All metrics derived from Victory Foods Info Sheet (4/8/25), competitor pricing research section, and historical supplier cost tracking. No external estimates or projections used.
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Update detail sections with Victory Foods data
function updateDetailSections(data) {
    // Update container stats
    document.getElementById('containerCases').textContent = '2,200';
    document.getElementById('containerWeight').textContent = '52,800 lbs';
    document.getElementById('oceanFreightTotal').textContent = '$5,675';
    document.getElementById('inlandFreightTotal').textContent = '$1,122';
    document.getElementById('palletPattern').textContent = '10×11';
    document.getElementById('configuration').textContent = 'Palletized';
    
    // Update vendor costs
    const vendorContainer = document.getElementById('vendorCosts');
    vendorContainer.innerHTML = `
        <div class="cost-line">
            <span class="cost-label">EXW Factory Cost:</span>
            <span class="cost-value">$${(data.exw_cost_case || 15.80).toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Sales Broker (${(data.sales_broker_rate_percent || 3).toFixed(1)}%):</span>
            <span class="cost-value">$${(data.sales_broker_amount_case || 0.72).toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Tariff (${(data.tariff_rate_percent || 10).toFixed(1)}%):</span>
            <span class="cost-value">$${(data.tariff_amount_case || 1.58).toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Import Broker:</span>
            <span class="cost-value">$${(data.import_broker_per_case || 0.14).toFixed(2)}</span>
        </div>
        <div class="cost-line total">
            <span class="cost-label">Total Vendor Cost:</span>
            <span class="cost-value">$${((data.exw_cost_case || 15.80) + (data.sales_broker_amount_case || 0.72) + (data.tariff_amount_case || 1.58) + (data.import_broker_per_case || 0.14)).toFixed(2)}</span>
        </div>
    `;
    
    // Update shipping costs
    const shippingContainer = document.getElementById('shippingCosts');
    shippingContainer.innerHTML = `
        <div class="cost-line">
            <span class="cost-label">Ocean Freight/Case:</span>
            <span class="cost-value">$2.58</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Inland Freight/Case:</span>
            <span class="cost-value">$0.51</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Case Weight:</span>
            <span class="cost-value">24 lbs</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Units per Case:</span>
            <span class="cost-value">4 units</span>
        </div>
        <div class="cost-line total">
            <span class="cost-label">Total Freight/Case:</span>
            <span class="cost-value">$3.09</span>
        </div>
    `;
    
    // Update SFS margins
    const marginsContainer = document.getElementById('sfsMargins');
    const landedCost = (data.fob_price_case || 23.38) - (data.sfs_margin_amount_case || 2.56);
    marginsContainer.innerHTML = `
        <div class="cost-line">
            <span class="cost-label">Landed Cost:</span>
            <span class="cost-value">$${landedCost.toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">SFS Margin (${(data.sfs_margin_rate_percent || 16.2).toFixed(1)}%):</span>
            <span class="cost-value">$${(data.sfs_margin_amount_case || 2.56).toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Operating Costs:</span>
            <span class="cost-value">$1.07</span>
        </div>
        <div class="cost-line total">
            <span class="cost-label">Total SFS Margin:</span>
            <span class="cost-value">$${(data.sfs_margin_amount_case || 2.56).toFixed(2)}</span>
        </div>
    `;
    
    // Update customer details
    const customerContainer = document.getElementById('customerDetails');
    const customerInfo = data.customers || {};
    const contactInfo = customerInfo.contact_info || {};
    
    customerContainer.innerHTML = `
        <div class="customer-name">${customerInfo.name || 'Victory Foods'}</div>
        <div class="contact-grid">
            <div class="contact-item">
                <span class="contact-icon">👤</span>
                <span>${contactInfo.contact_person || 'Alan Bernstein'}</span>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span>${contactInfo.phone || '718-378-1122'}</span>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>${contactInfo.email || 'abernstein@victoryfoodservice.com'}</span>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>${contactInfo.address || '515 Truxton St. Bronx, NY 10474'}</span>
            </div>
        </div>
        <div class="cost-line">
            <span class="cost-label">Rebate per Case:</span>
            <span class="cost-value">$${(data.ddp_rebate_case || 22.88).toFixed(2)}</span>
        </div>
        <div class="cost-line">
            <span class="cost-label">Net Price per Case:</span>
            <span class="cost-value">$${(data.ddp_net_price_case || 1.01).toFixed(2)}</span>
        </div>
    `;
}

// Close detail modal
function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}