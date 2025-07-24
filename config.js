// Configuration & constants
const SUPABASE_URL = 'https://knrzvhxavdyvrbbcgkqf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtucnp2aHhhdmR5dnJiYmNna3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDQzNjgsImV4cCI6MjA2NzgyMDM2OH0.DUuvdCeHSEnbBobnRWQ1rCNLKePwXGkia3Ewt40WnmQ';

// Database table names
const DATABASE_TABLES = [
    'items',
    'customers', 
    'vendors',
    'pricing_breakdown',
    'customer_price_history',
    'vendor_price_history',
    'price_quarters',
    'container_logistics',
    'info_sheet_processing_log'
];

// Configuration object
const CONFIG = {
    MARGIN_THRESHOLDS: {
        GOOD: 18,
        WARNING: 15
    },
    ERROR_HANDLING: {
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },
    UI: {
        MAX_DESCRIPTION_LENGTH: 25,
        DEBUG_LOG_LINES: 20
    }
};