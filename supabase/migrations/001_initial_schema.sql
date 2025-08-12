-- Product Warranty Management System - Initial Database Schema
-- Created: 2024

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'customer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    model VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    warranty_months INTEGER DEFAULT 12,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for products
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_model ON products(model);
CREATE INDEX idx_products_category ON products(category);

-- Contracts Table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms_conditions TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for contracts
CREATE INDEX idx_contracts_number ON contracts(contract_number);
CREATE INDEX idx_contracts_customer ON contracts(customer_email);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);

-- Contract Products Junction Table
CREATE TABLE contract_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    notes TEXT
);

-- Create indexes for contract_products
CREATE INDEX idx_contract_products_contract ON contract_products(contract_id);
CREATE INDEX idx_contract_products_product ON contract_products(product_id);

-- Serials Table
CREATE TABLE serials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    contract_id UUID REFERENCES contracts(id),
    manufacture_date DATE,
    purchase_date DATE,
    warranty_status VARCHAR(20) DEFAULT 'active' CHECK (warranty_status IN ('active', 'expired', 'void')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for serials
CREATE INDEX idx_serials_number ON serials(serial_number);
CREATE INDEX idx_serials_product ON serials(product_id);
CREATE INDEX idx_serials_contract ON serials(contract_id);
CREATE INDEX idx_serials_status ON serials(warranty_status);

-- Tickets Table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    serial_id UUID REFERENCES serials(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    issue_description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'pending', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for tickets
CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_serial ON tickets(serial_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);

-- Ticket Comments Table
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ticket_comments
CREATE INDEX idx_ticket_comments_ticket ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_user ON ticket_comments(user_id);

-- Warranty History Table
CREATE TABLE warranty_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_id UUID REFERENCES serials(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('repair', 'replacement', 'inspection', 'claim', 'void')),
    description TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for warranty_history
CREATE INDEX idx_warranty_history_serial ON warranty_history(serial_id);
CREATE INDEX idx_warranty_history_type ON warranty_history(action_type);
CREATE INDEX idx_warranty_history_performed ON warranty_history(performed_by);

-- Insert initial data
-- Default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin'),
('manager@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Warranty Manager', 'manager'),
('employee@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Support Staff', 'employee');

-- Sample products
INSERT INTO products (name, model, category, warranty_months) VALUES 
('Laptop Dell Inspiron', 'DELL-INS-15-3000', 'Electronics', 24),
('Máy giặt Samsung', 'SAM-WM-8KG-2024', 'Home Appliances', 36),
('Điện thoại iPhone', 'APPLE-IP15-PRO', 'Mobile', 12),
('Tivi Sony Bravia', 'SONY-BR-55X80K', 'Electronics', 24),
('Tủ lạnh LG Inverter', 'LG-INV-420L', 'Home Appliances', 24);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE serials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON contracts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON contract_products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all users" ON serials FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON serials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for all users" ON tickets FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON tickets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON ticket_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON warranty_history FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon, authenticated;
GRANT ALL PRIVILEGES ON contracts TO authenticated;
GRANT ALL PRIVILEGES ON products TO authenticated;
GRANT ALL PRIVILEGES ON contract_products TO authenticated;
GRANT SELECT ON serials TO anon;
GRANT ALL PRIVILEGES ON serials TO authenticated;
GRANT SELECT, INSERT ON tickets TO anon;
GRANT ALL PRIVILEGES ON tickets TO authenticated;
GRANT ALL PRIVILEGES ON ticket_comments TO authenticated;
GRANT ALL PRIVILEGES ON warranty_history TO authenticated;