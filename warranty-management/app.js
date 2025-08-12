// Warranty Management System JavaScript

class WarrantyManagementSystem {
    constructor() {
        this.data = {
            contracts: [
                {
                    id: "WC001",
                    contractNumber: "HD-BH-2024-001",
                    customer: {
                        name: "Nguyễn Văn An",
                        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
                        phone: "0901234567",
                        email: "nguyenvanan@email.com"
                    },
                    products: [
                        {
                            name: "Laptop Dell Inspiron 15",
                            model: "Dell-INS-15-3000",
                            serial: "DL15-2024-001234"
                        }
                    ],
                    startDate: "2024-01-15",
                    endDate: "2026-01-15",
                    terms: "Bảo hành 24 tháng, miễn phí sửa chữa lỗi phần cứng",
                    status: "active",
                    createdAt: "2024-01-15T09:00:00Z"
                },
                {
                    id: "WC002", 
                    contractNumber: "HD-BH-2024-002",
                    customer: {
                        name: "Trần Thị Bình",
                        address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM", 
                        phone: "0902345678",
                        email: "tranthibinh@email.com"
                    },
                    products: [
                        {
                            name: "iPhone 15 Pro",
                            model: "A3108",
                            serial: "IP15-2024-005678"
                        }
                    ],
                    startDate: "2024-02-20",
                    endDate: "2025-02-20", 
                    terms: "Bảo hành 12 tháng, bảo hành màn hình 6 tháng",
                    status: "active",
                    createdAt: "2024-02-20T14:30:00Z"
                },
                {
                    id: "WC003",
                    contractNumber: "HD-BH-2024-003",
                    customer: {
                        name: "Lê Văn Cường",
                        address: "789 Đường Pasteur, Quận 1, TP.HCM",
                        phone: "0903456789",
                        email: "levancuong@email.com"
                    },
                    products: [
                        {
                            name: "Samsung Galaxy S24",
                            model: "SM-S921B",
                            serial: "SG24-2024-009876"
                        }
                    ],
                    startDate: "2024-03-10",
                    endDate: "2025-03-10",
                    terms: "Bảo hành 12 tháng toàn bộ máy",
                    status: "active",
                    createdAt: "2024-03-10T10:20:00Z"
                }
            ],
            serials: [
                {
                    id: "S001",
                    serialNumber: "DL15-2024-001234",
                    productName: "Laptop Dell Inspiron 15",
                    model: "Dell-INS-15-3000",
                    manufactureDate: "2024-01-10",
                    contractId: "WC001",
                    warrantyRemaining: "18 tháng",
                    status: "active",
                    repairHistory: [
                        {
                            date: "2024-06-15",
                            issue: "Thay pin laptop",
                            solution: "Thay pin mới, test OK",
                            technician: "Nguyễn Văn Tâm"
                        }
                    ]
                },
                {
                    id: "S002", 
                    serialNumber: "IP15-2024-005678",
                    productName: "iPhone 15 Pro",
                    model: "A3108",
                    manufactureDate: "2024-02-15",
                    contractId: "WC002", 
                    warrantyRemaining: "6 tháng",
                    status: "active",
                    repairHistory: []
                },
                {
                    id: "S003",
                    serialNumber: "SG24-2024-009876",
                    productName: "Samsung Galaxy S24",
                    model: "SM-S921B",
                    manufactureDate: "2024-03-05",
                    contractId: "WC003",
                    warrantyRemaining: "9 tháng",
                    status: "active",
                    repairHistory: []
                }
            ],
            warrantyRequests: [
                {
                    id: "WR001",
                    ticketNumber: "YC-BH-2024-001",
                    serialNumber: "DL15-2024-001234",
                    customerName: "Nguyễn Văn An",
                    issue: "Laptop không khởi động được",
                    description: "Laptop bị đen màn hình khi bật nguồn, đã thử reset BIOS nhưng không được",
                    status: "processing", 
                    priority: "high",
                    assignedTo: "Nguyễn Văn Tâm",
                    createdAt: "2024-12-01T10:15:00Z",
                    updatedAt: "2024-12-02T09:30:00Z",
                    timeline: [
                        {
                            date: "2024-12-01T10:15:00Z",
                            status: "received",
                            note: "Tiếp nhận yêu cầu bảo hành"
                        },
                        {
                            date: "2024-12-01T14:00:00Z", 
                            status: "validated",
                            note: "Kiểm tra bảo hành hợp lệ"
                        },
                        {
                            date: "2024-12-02T09:30:00Z",
                            status: "processing", 
                            note: "Đang chẩn đoán lỗi phần cứng"
                        }
                    ]
                },
                {
                    id: "WR002",
                    ticketNumber: "YC-BH-2024-002", 
                    serialNumber: "IP15-2024-005678",
                    customerName: "Trần Thị Bình",
                    issue: "Màn hình bị vỡ góc",
                    description: "Màn hình iPhone bị nứt ở góc trên bên phải, cảm ứng vẫn hoạt động bình thường",
                    status: "completed",
                    priority: "medium", 
                    assignedTo: "Lê Văn Đức",
                    createdAt: "2024-11-20T16:45:00Z",
                    updatedAt: "2024-11-25T11:00:00Z",
                    timeline: [
                        {
                            date: "2024-11-20T16:45:00Z",
                            status: "received", 
                            note: "Tiếp nhận yêu cầu bảo hành"
                        },
                        {
                            date: "2024-11-21T08:00:00Z",
                            status: "validated",
                            note: "Kiểm tra bảo hành hợp lệ"
                        },
                        {
                            date: "2024-11-22T10:00:00Z",
                            status: "processing",
                            note: "Đặt hàng màn hình thay thế"
                        },
                        {
                            date: "2024-11-25T11:00:00Z",
                            status: "completed",
                            note: "Thay màn hình mới hoàn tất, test OK"
                        }
                    ]
                },
                {
                    id: "WR003",
                    ticketNumber: "YC-BH-2024-003",
                    serialNumber: "SG24-2024-009876",
                    customerName: "Lê Văn Cường",
                    issue: "Pin chai nhanh",
                    description: "Điện thoại chỉ dùng được 4-5 tiếng là hết pin, trước đây dùng cả ngày",
                    status: "received",
                    priority: "low",
                    assignedTo: "Trần Văn Minh",
                    createdAt: "2024-12-05T14:20:00Z",
                    updatedAt: "2024-12-05T14:20:00Z",
                    timeline: [
                        {
                            date: "2024-12-05T14:20:00Z",
                            status: "received",
                            note: "Tiếp nhận yêu cầu bảo hành"
                        }
                    ]
                }
            ],
            statistics: {
                totalContracts: 156,
                activeContracts: 142,
                expiredContracts: 14, 
                expiringThisMonth: 8,
                totalSerials: 289,
                pendingRequests: 12,
                processingRequests: 5,
                completedRequests: 127,
                monthlyRevenue: 45600000,
                topFailingProducts: [
                    {"name": "Laptop Dell Inspiron", "failures": 23},
                    {"name": "iPhone 15 Series", "failures": 18},
                    {"name": "Samsung Galaxy S24", "failures": 15}
                ]
            },
            notifications: [
                {
                    id: "N001",
                    type: "warning",
                    title: "Hợp đồng sắp hết hạn",
                    message: "8 hợp đồng bảo hành sẽ hết hạn trong tháng này",
                    date: "2024-12-12T08:00:00Z",
                    read: false
                },
                {
                    id: "N002", 
                    type: "info",
                    title: "Yêu cầu bảo hành mới",
                    message: "Có 3 yêu cầu bảo hành mới cần xử lý",
                    date: "2024-12-12T09:15:00Z",
                    read: false
                }
            ]
        };

        this.currentPage = 'dashboard';
        this.editingContract = null;
        this.editingSerial = null;
        this.charts = {};

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.loadPage('dashboard');
        this.updateNotificationBadge();
        
        // Initialize Feather icons after a short delay
        setTimeout(() => {
            this.initializeFeatherIcons();
        }, 100);
    }

    initializeFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                if (sidebar) sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('expanded');
            });
        }

        // Sidebar navigation - Fixed event listeners
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                    
                    // Update active state
                    document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });

        // Modal handlers
        this.setupModalHandlers();

        // Form handlers
        this.setupFormHandlers();

        // Search and filter handlers
        this.setupSearchHandlers();

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.loadPage('notifications');
                document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('active'));
                const notificationItem = document.querySelector('[data-page="notifications"]');
                if (notificationItem) notificationItem.classList.add('active');
            });
        }

        // Customer portal search
        const portalSearchBtn = document.getElementById('portalSearchBtn');
        if (portalSearchBtn) {
            portalSearchBtn.addEventListener('click', () => this.searchWarranty());
        }

        const portalSerialInput = document.getElementById('portalSerialInput');
        if (portalSerialInput) {
            portalSerialInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWarranty();
                }
            });
        }
    }

    setupModalHandlers() {
        // Contract modal
        const addContractBtn = document.getElementById('addContractBtn');
        const closeContractModal = document.getElementById('closeContractModal');
        const cancelContract = document.getElementById('cancelContract');

        if (addContractBtn) {
            addContractBtn.addEventListener('click', () => this.openContractModal());
        }
        if (closeContractModal) {
            closeContractModal.addEventListener('click', () => this.closeModal('contractModal'));
        }
        if (cancelContract) {
            cancelContract.addEventListener('click', () => this.closeModal('contractModal'));
        }

        // Serial modal
        const addSerialBtn = document.getElementById('addSerialBtn');
        const closeSerialModal = document.getElementById('closeSerialModal');
        const cancelSerial = document.getElementById('cancelSerial');

        if (addSerialBtn) {
            addSerialBtn.addEventListener('click', () => this.openSerialModal());
        }
        if (closeSerialModal) {
            closeSerialModal.addEventListener('click', () => this.closeModal('serialModal'));
        }
        if (cancelSerial) {
            cancelSerial.addEventListener('click', () => this.closeModal('serialModal'));
        }

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__backdrop')) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    setupFormHandlers() {
        const contractForm = document.getElementById('contractForm');
        if (contractForm) {
            contractForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveContract();
            });
        }

        const serialForm = document.getElementById('serialForm');
        if (serialForm) {
            serialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSerial();
            });
        }
    }

    setupSearchHandlers() {
        // Contract search and filter
        const contractSearch = document.getElementById('contractSearch');
        const contractStatusFilter = document.getElementById('contractStatusFilter');
        
        if (contractSearch) {
            contractSearch.addEventListener('input', () => this.filterContracts());
        }
        if (contractStatusFilter) {
            contractStatusFilter.addEventListener('change', () => this.filterContracts());
        }

        // Serial search and filter
        const serialSearch = document.getElementById('serialSearch');
        const serialStatusFilter = document.getElementById('serialStatusFilter');
        
        if (serialSearch) {
            serialSearch.addEventListener('input', () => this.filterSerials());
        }
        if (serialStatusFilter) {
            serialStatusFilter.addEventListener('change', () => this.filterSerials());
        }

        // Request search and filter
        const requestSearch = document.getElementById('requestSearch');
        const requestStatusFilter = document.getElementById('requestStatusFilter');
        
        if (requestSearch) {
            requestSearch.addEventListener('input', () => this.filterRequests());
        }
        if (requestStatusFilter) {
            requestStatusFilter.addEventListener('change', () => this.filterRequests());
        }
    }

    loadPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        
        // Show selected page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = page;
        }

        // Load page-specific content
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'contracts':
                this.loadContracts();
                break;
            case 'serials':
                this.loadSerials();
                break;
            case 'requests':
                this.loadRequests();
                break;
            case 'customer-portal':
                this.loadCustomerPortal();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
        }

        // Re-initialize icons after content load
        setTimeout(() => {
            this.initializeFeatherIcons();
        }, 100);
    }

    loadDashboard() {
        // Update statistics
        const totalContractsEl = document.getElementById('totalContracts');
        const activeContractsEl = document.getElementById('activeContracts');
        const expiringContractsEl = document.getElementById('expiringContracts');
        const pendingRequestsEl = document.getElementById('pendingRequests');

        if (totalContractsEl) totalContractsEl.textContent = this.data.statistics.totalContracts;
        if (activeContractsEl) activeContractsEl.textContent = this.data.statistics.activeContracts;
        if (expiringContractsEl) expiringContractsEl.textContent = this.data.statistics.expiringThisMonth;
        if (pendingRequestsEl) pendingRequestsEl.textContent = this.data.statistics.pendingRequests;

        // Load recent requests table
        this.loadRecentRequestsTable();

        // Load charts with delay
        setTimeout(() => {
            this.loadDashboardCharts();
        }, 200);
    }

    loadRecentRequestsTable() {
        const tbody = document.querySelector('#recentRequestsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.data.warrantyRequests.slice(0, 5).map(request => `
            <tr>
                <td>${request.ticketNumber}</td>
                <td>${request.customerName}</td>
                <td><code>${request.serialNumber}</code></td>
                <td>${this.getStatusBadge(request.status)}</td>
                <td>${this.formatDate(request.createdAt)}</td>
            </tr>
        `).join('');
    }

    loadDashboardCharts() {
        // Request status chart
        const requestCtx = document.getElementById('requestChart');
        if (requestCtx && !this.charts.requestChart) {
            try {
                this.charts.requestChart = new Chart(requestCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành'],
                        datasets: [{
                            data: [
                                this.data.statistics.pendingRequests,
                                this.data.statistics.processingRequests,
                                this.data.statistics.completedRequests
                            ],
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating request chart:', error);
            }
        }

        // Top failing products chart
        const failureCtx = document.getElementById('failureChart');
        if (failureCtx && !this.charts.failureChart) {
            try {
                this.charts.failureChart = new Chart(failureCtx, {
                    type: 'bar',
                    data: {
                        labels: this.data.statistics.topFailingProducts.map(p => p.name),
                        datasets: [{
                            label: 'Số lượng lỗi',
                            data: this.data.statistics.topFailingProducts.map(p => p.failures),
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating failure chart:', error);
            }
        }
    }

    loadContracts() {
        this.populateContractsTable(this.data.contracts);
    }

    populateContractsTable(contracts) {
        const tbody = document.querySelector('#contractsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = contracts.map(contract => `
            <tr>
                <td>${contract.contractNumber}</td>
                <td>${contract.customer.name}</td>
                <td>${this.formatDate(contract.startDate)}</td>
                <td>${this.formatDate(contract.endDate)}</td>
                <td>${this.getStatusBadge(contract.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--icon btn--view" onclick="app.viewContract('${contract.id}')" title="Xem">
                            <i data-feather="eye"></i>
                        </button>
                        <button class="btn btn--icon btn--edit" onclick="app.editContract('${contract.id}')" title="Sửa">
                            <i data-feather="edit"></i>
                        </button>
                        <button class="btn btn--icon btn--delete" onclick="app.deleteContract('${contract.id}')" title="Xóa">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initializeFeatherIcons();
    }

    loadSerials() {
        this.populateContractSelect();
        this.populateSerialsTable(this.data.serials);
    }

    populateContractSelect() {
        const contractSelect = document.getElementById('contractSelect');
        if (!contractSelect) return;

        contractSelect.innerHTML = '<option value="">Chọn hợp đồng</option>' +
            this.data.contracts.map(contract => 
                `<option value="${contract.id}">${contract.contractNumber} - ${contract.customer.name}</option>`
            ).join('');
    }

    populateSerialsTable(serials) {
        const tbody = document.querySelector('#serialsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = serials.map(serial => `
            <tr>
                <td><code>${serial.serialNumber}</code></td>
                <td>${serial.productName}</td>
                <td>${serial.model}</td>
                <td>${serial.warrantyRemaining}</td>
                <td>${this.getStatusBadge(serial.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--icon btn--view" onclick="app.viewSerial('${serial.id}')" title="Xem">
                            <i data-feather="eye"></i>
                        </button>
                        <button class="btn btn--icon btn--edit" onclick="app.editSerial('${serial.id}')" title="Sửa">
                            <i data-feather="edit"></i>
                        </button>
                        <button class="btn btn--icon btn--delete" onclick="app.deleteSerial('${serial.id}')" title="Xóa">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initializeFeatherIcons();
    }

    loadRequests() {
        this.populateRequestsTable(this.data.warrantyRequests);
    }

    populateRequestsTable(requests) {
        const tbody = document.querySelector('#requestsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.ticketNumber}</td>
                <td>${request.customerName}</td>
                <td><code>${request.serialNumber}</code></td>
                <td>${request.issue}</td>
                <td>${this.getPriorityBadge(request.priority)}</td>
                <td>${this.getStatusBadge(request.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--icon btn--view" onclick="app.viewRequest('${request.id}')" title="Xem">
                            <i data-feather="eye"></i>
                        </button>
                        <button class="btn btn--icon btn--edit" onclick="app.editRequest('${request.id}')" title="Sửa">
                            <i data-feather="edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.initializeFeatherIcons();
    }

    loadCustomerPortal() {
        // Reset portal
        const portalInput = document.getElementById('portalSerialInput');
        const portalResult = document.getElementById('portalResult');
        
        if (portalInput) portalInput.value = '';
        if (portalResult) portalResult.classList.add('hidden');
    }

    loadReports() {
        setTimeout(() => {
            this.loadReportCharts();
        }, 200);
    }

    loadReportCharts() {
        // Revenue chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx && !this.charts.revenueChart) {
            try {
                this.charts.revenueChart = new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                        datasets: [{
                            label: 'Doanh thu (triệu đồng)',
                            data: [35, 42, 38, 45, 52, 48, 55, 61, 58, 67, 72, 69],
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating revenue chart:', error);
            }
        }

        // Efficiency chart
        const efficiencyCtx = document.getElementById('efficiencyChart');
        if (efficiencyCtx && !this.charts.efficiencyChart) {
            try {
                this.charts.efficiencyChart = new Chart(efficiencyCtx, {
                    type: 'bar',
                    data: {
                        labels: ['< 1 ngày', '1-3 ngày', '3-7 ngày', '> 7 ngày'],
                        datasets: [{
                            label: 'Số yêu cầu',
                            data: [45, 78, 32, 15],
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating efficiency chart:', error);
            }
        }
    }

    loadNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        if (!notificationsList) return;

        notificationsList.innerHTML = this.data.notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}">
                <div class="notification-item__icon notification-item__icon--${notification.type}">
                    <i data-feather="${notification.type === 'warning' ? 'alert-triangle' : 'info'}"></i>
                </div>
                <div class="notification-item__content">
                    <h4 class="notification-item__title">${notification.title}</h4>
                    <p class="notification-item__message">${notification.message}</p>
                    <div class="notification-item__date">${this.formatDate(notification.date)}</div>
                </div>
            </div>
        `).join('');

        this.initializeFeatherIcons();
    }

    // Modal functions
    openContractModal(contract = null) {
        this.editingContract = contract;
        const modal = document.getElementById('contractModal');
        const title = document.getElementById('contractModalTitle');
        
        if (contract) {
            if (title) title.textContent = 'Chỉnh sửa Hợp đồng';
            this.populateContractForm(contract);
        } else {
            if (title) title.textContent = 'Thêm Hợp đồng Bảo hành';
            this.resetContractForm();
            this.generateContractNumber();
        }

        if (modal) modal.classList.remove('hidden');
    }

    openSerialModal(serial = null) {
        this.editingSerial = serial;
        const modal = document.getElementById('serialModal');
        const title = document.getElementById('serialModalTitle');
        
        if (serial) {
            if (title) title.textContent = 'Chỉnh sửa Serial';
            this.populateSerialForm(serial);
        } else {
            if (title) title.textContent = 'Thêm Serial Sản phẩm';
            this.resetSerialForm();
        }

        if (modal) modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    // Form functions
    generateContractNumber() {
        const year = new Date().getFullYear();
        const number = String(this.data.contracts.length + 1).padStart(3, '0');
        const contractNumberEl = document.getElementById('contractNumber');
        if (contractNumberEl) {
            contractNumberEl.value = `HD-BH-${year}-${number}`;
        }
    }

    resetContractForm() {
        const form = document.getElementById('contractForm');
        if (form) form.reset();
        
        const startDateEl = document.getElementById('startDate');
        if (startDateEl) {
            startDateEl.value = new Date().toISOString().split('T')[0];
        }
    }

    resetSerialForm() {
        const form = document.getElementById('serialForm');
        if (form) form.reset();
    }

    populateContractForm(contract) {
        const fields = [
            ['contractNumber', contract.contractNumber],
            ['customerName', contract.customer.name],
            ['customerAddress', contract.customer.address],
            ['customerPhone', contract.customer.phone],
            ['customerEmail', contract.customer.email],
            ['startDate', contract.startDate],
            ['endDate', contract.endDate],
            ['warrantyTerms', contract.terms]
        ];

        fields.forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    }

    populateSerialForm(serial) {
        const fields = [
            ['serialNumber', serial.serialNumber],
            ['productName', serial.productName],
            ['productModel', serial.model],
            ['manufactureDate', serial.manufactureDate],
            ['contractSelect', serial.contractId]
        ];

        fields.forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    }

    saveContract() {
        const formData = this.getContractFormData();
        
        if (this.editingContract) {
            // Update existing contract
            const index = this.data.contracts.findIndex(c => c.id === this.editingContract.id);
            if (index !== -1) {
                this.data.contracts[index] = { ...this.data.contracts[index], ...formData };
                this.showToast('Cập nhật hợp đồng thành công!', 'success');
            }
        } else {
            // Add new contract
            const newContract = {
                id: `WC${String(this.data.contracts.length + 1).padStart(3, '0')}`,
                ...formData,
                status: 'active',
                createdAt: new Date().toISOString(),
                products: []
            };
            this.data.contracts.push(newContract);
            this.showToast('Thêm hợp đồng thành công!', 'success');
        }

        this.closeModal('contractModal');
        if (this.currentPage === 'contracts') {
            this.loadContracts();
        }
    }

    saveSerial() {
        const formData = this.getSerialFormData();
        
        if (this.editingSerial) {
            // Update existing serial
            const index = this.data.serials.findIndex(s => s.id === this.editingSerial.id);
            if (index !== -1) {
                this.data.serials[index] = { ...this.data.serials[index], ...formData };
                this.showToast('Cập nhật serial thành công!', 'success');
            }
        } else {
            // Add new serial
            const newSerial = {
                id: `S${String(this.data.serials.length + 1).padStart(3, '0')}`,
                ...formData,
                status: 'active',
                warrantyRemaining: '24 tháng',
                repairHistory: []
            };
            this.data.serials.push(newSerial);
            this.showToast('Thêm serial thành công!', 'success');
        }

        this.closeModal('serialModal');
        if (this.currentPage === 'serials') {
            this.loadSerials();
        }
    }

    getContractFormData() {
        const getValue = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        return {
            contractNumber: getValue('contractNumber'),
            customer: {
                name: getValue('customerName'),
                address: getValue('customerAddress'),
                phone: getValue('customerPhone'),
                email: getValue('customerEmail')
            },
            startDate: getValue('startDate'),
            endDate: getValue('endDate'),
            terms: getValue('warrantyTerms')
        };
    }

    getSerialFormData() {
        const getValue = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        return {
            serialNumber: getValue('serialNumber'),
            productName: getValue('productName'),
            model: getValue('productModel'),
            manufactureDate: getValue('manufactureDate'),
            contractId: getValue('contractSelect')
        };
    }

    // CRUD functions
    editContract(id) {
        const contract = this.data.contracts.find(c => c.id === id);
        if (contract) {
            this.openContractModal(contract);
        }
    }

    deleteContract(id) {
        if (confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
            this.data.contracts = this.data.contracts.filter(c => c.id !== id);
            this.showToast('Xóa hợp đồng thành công!', 'success');
            if (this.currentPage === 'contracts') {
                this.loadContracts();
            }
        }
    }

    viewContract(id) {
        const contract = this.data.contracts.find(c => c.id === id);
        if (contract) {
            alert(`Hợp đồng: ${contract.contractNumber}\nKhách hàng: ${contract.customer.name}\nTrạng thái: ${contract.status}`);
        }
    }

    editSerial(id) {
        const serial = this.data.serials.find(s => s.id === id);
        if (serial) {
            this.openSerialModal(serial);
        }
    }

    deleteSerial(id) {
        if (confirm('Bạn có chắc chắn muốn xóa serial này?')) {
            this.data.serials = this.data.serials.filter(s => s.id !== id);
            this.showToast('Xóa serial thành công!', 'success');
            if (this.currentPage === 'serials') {
                this.loadSerials();
            }
        }
    }

    viewSerial(id) {
        const serial = this.data.serials.find(s => s.id === id);
        if (serial) {
            alert(`Serial: ${serial.serialNumber}\nSản phẩm: ${serial.productName}\nTrạng thái: ${serial.status}`);
        }
    }

    viewRequest(id) {
        const request = this.data.warrantyRequests.find(r => r.id === id);
        if (request) {
            alert(`Yêu cầu: ${request.ticketNumber}\nKhách hàng: ${request.customerName}\nVấn đề: ${request.issue}`);
        }
    }

    editRequest(id) {
        const request = this.data.warrantyRequests.find(r => r.id === id);
        if (request) {
            alert(`Chỉnh sửa yêu cầu: ${request.ticketNumber}`);
        }
    }

    // Filter functions
    filterContracts() {
        const searchEl = document.getElementById('contractSearch');
        const statusEl = document.getElementById('contractStatusFilter');
        
        const search = searchEl ? searchEl.value.toLowerCase() : '';
        const status = statusEl ? statusEl.value : '';
        
        const filtered = this.data.contracts.filter(contract => {
            const matchesSearch = contract.contractNumber.toLowerCase().includes(search) ||
                                contract.customer.name.toLowerCase().includes(search);
            const matchesStatus = !status || contract.status === status;
            
            return matchesSearch && matchesStatus;
        });

        this.populateContractsTable(filtered);
    }

    filterSerials() {
        const searchEl = document.getElementById('serialSearch');
        const statusEl = document.getElementById('serialStatusFilter');
        
        const search = searchEl ? searchEl.value.toLowerCase() : '';
        const status = statusEl ? statusEl.value : '';
        
        const filtered = this.data.serials.filter(serial => {
            const matchesSearch = serial.serialNumber.toLowerCase().includes(search) ||
                                serial.productName.toLowerCase().includes(search);
            const matchesStatus = !status || serial.status === status;
            
            return matchesSearch && matchesStatus;
        });

        this.populateSerialsTable(filtered);
    }

    filterRequests() {
        const searchEl = document.getElementById('requestSearch');
        const statusEl = document.getElementById('requestStatusFilter');
        
        const search = searchEl ? searchEl.value.toLowerCase() : '';
        const status = statusEl ? statusEl.value : '';
        
        const filtered = this.data.warrantyRequests.filter(request => {
            const matchesSearch = request.ticketNumber.toLowerCase().includes(search) ||
                                request.customerName.toLowerCase().includes(search) ||
                                request.serialNumber.toLowerCase().includes(search);
            const matchesStatus = !status || request.status === status;
            
            return matchesSearch && matchesStatus;
        });

        this.populateRequestsTable(filtered);
    }

    // Customer portal
    searchWarranty() {
        const serialInput = document.getElementById('portalSerialInput');
        const serialNumber = serialInput ? serialInput.value.trim() : '';
        
        if (!serialNumber) {
            this.showToast('Vui lòng nhập serial number!', 'warning');
            return;
        }

        const serial = this.data.serials.find(s => 
            s.serialNumber.toLowerCase() === serialNumber.toLowerCase()
        );

        const resultDiv = document.getElementById('portalResult');
        const infoDiv = document.getElementById('portalInfo');

        if (serial && resultDiv && infoDiv) {
            const contract = this.data.contracts.find(c => c.id === serial.contractId);
            
            infoDiv.innerHTML = `
                <div class="portal-info__item">
                    <span class="portal-info__label">Serial Number:</span>
                    <span class="portal-info__value">${serial.serialNumber}</span>
                </div>
                <div class="portal-info__item">
                    <span class="portal-info__label">Sản phẩm:</span>
                    <span class="portal-info__value">${serial.productName}</span>
                </div>
                <div class="portal-info__item">
                    <span class="portal-info__label">Model:</span>
                    <span class="portal-info__value">${serial.model}</span>
                </div>
                <div class="portal-info__item">
                    <span class="portal-info__label">Thời gian bảo hành còn lại:</span>
                    <span class="portal-info__value">${serial.warrantyRemaining}</span>
                </div>
                <div class="portal-info__item">
                    <span class="portal-info__label">Trạng thái:</span>
                    <span class="portal-info__value">${this.getStatusBadge(serial.status)}</span>
                </div>
                ${contract ? `
                <div class="portal-info__item">
                    <span class="portal-info__label">Khách hàng:</span>
                    <span class="portal-info__value">${contract.customer.name}</span>
                </div>
                ` : ''}
            `;
            
            resultDiv.classList.remove('hidden');
            this.showToast('Tìm thấy thông tin bảo hành!', 'success');
        } else if (resultDiv && infoDiv) {
            infoDiv.innerHTML = `
                <div class="empty-state">
                    <i data-feather="search" class="empty-state__icon"></i>
                    <h3 class="empty-state__title">Không tìm thấy</h3>
                    <p class="empty-state__message">Serial number này không có trong hệ thống bảo hành.</p>
                </div>
            `;
            
            resultDiv.classList.remove('hidden');
            this.showToast('Không tìm thấy serial number!', 'error');
        }

        this.initializeFeatherIcons();
    }

    // Utility functions
    getStatusBadge(status) {
        const statusMap = {
            active: { text: 'Đang hiệu lực', class: 'status-badge--active' },
            expired: { text: 'Hết hạn', class: 'status-badge--expired' },
            suspended: { text: 'Tạm dừng', class: 'status-badge--warning' },
            received: { text: 'Tiếp nhận', class: 'status-badge--received' },
            validated: { text: 'Đã kiểm tra', class: 'status-badge--processing' },
            processing: { text: 'Đang xử lý', class: 'status-badge--processing' },
            completed: { text: 'Hoàn thành', class: 'status-badge--completed' }
        };

        const statusInfo = statusMap[status] || { text: status, class: '' };
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    getPriorityBadge(priority) {
        const priorityMap = {
            high: { text: 'Cao', class: 'status-badge--high' },
            medium: { text: 'Trung bình', class: 'status-badge--medium' },
            low: { text: 'Thấp', class: 'status-badge--low' }
        };

        const priorityInfo = priorityMap[priority] || { text: priority, class: '' };
        return `<span class="status-badge ${priorityInfo.class}">${priorityInfo.text}</span>`;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationCount');
        const unreadCount = this.data.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        toast.innerHTML = `
            <i data-feather="${icons[type] || 'info'}" class="toast__icon toast__icon--${type}"></i>
            <div class="toast__content">
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close">
                <i data-feather="x"></i>
            </button>
        `;

        container.appendChild(toast);
        this.initializeFeatherIcons();

        // Auto remove
        const timer = setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Manual remove
        const closeBtn = toast.querySelector('.toast__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timer);
                this.removeToast(toast);
            });
        }
    }

    removeToast(toast) {
        toast.style.animation = 'toastSlideIn 0.3s reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }
}

// Initialize app
const app = new WarrantyManagementSystem();

// Make app globally accessible for onclick handlers
window.app = app;