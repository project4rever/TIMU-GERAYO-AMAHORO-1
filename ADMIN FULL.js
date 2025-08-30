// ===============================
//  FAULTS MANAGEMENT SYSTEM (ADMIN)
// ===============================

// Sample fault data
let faultsData = JSON.parse(localStorage.getItem('faultsData')) || [
    { id: 1, name: "Kwiruka", description: "Kwiruka munzira", price: 50000, category: "traffic" },
    { id: 2, name: "Kunwa byangiza", description: "Kunwa byangiza ukoresha imodoka", price: 40000, category: "traffic" },
    { id: 3, name: "Kutagira ibyangombwa", description: "Kutagira ibyangombwa byose", price: 25000, category: "document" },
    { id: 4, name: "Guhagarika itara", description: "Guhagarika itara ry'umuhanda", price: 20000, category: "traffic" },
    { id: 5, name: "Kutambika Seatbelt", description: "Kutambika Seatbelt", price: 15000, category: "vehicle" },
    { id: 6, name: "Gukoresha telefone", description: "Gukoresha telefone ukoresha imodoka", price: 30000, category: "traffic" },
    { id: 7, name: "Kutagira Permi", description: "Kutagira Permi yo kwinjira", price: 35000, category: "document" },
    { id: 8, name: "Amavuta yose", description: "Kutagira amavuta mu modoka", price: 28000, category: "vehicle" }
];

// Initialize localStorage if empty
if (!localStorage.getItem('faultsData')) {
    localStorage.setItem('faultsData', JSON.stringify(faultsData));
}

// DOM Elements
const faultsList = document.getElementById('faultsList');
const notification = document.getElementById('notification');

// Menu Elements
const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('show');
});
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('show');
    }
});

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    renderFaultsAdmin();
    document.getElementById('faultForm').addEventListener('submit', handleFaultSubmit);
    updateFooterInfo();
    setInterval(updateFooterInfo, 1000);
});

// ================== FUNCTIONS ==================

// Render faults in admin list
function renderFaultsAdmin() {
    faultsList.innerHTML = '';
    if (faultsData.length === 0) {
        faultsList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Nta makosa ahari</p></div>';
        return;
    }
    faultsData.forEach(fault => {
        const faultElement = document.createElement('div');
        faultElement.className = 'fault-item-admin';
        faultElement.innerHTML = `
            <div class="fault-info-admin">
                <div class="fault-name">${fault.name}</div>
                <div class="fault-desc">${fault.description}</div>
                <div class="fault-price">${fault.price.toLocaleString('rw-RW')} FRW - ${getCategoryName(fault.category)}</div>
            </div>
            <div class="fault-actions">
                <button class="btn-edit" data-id="${fault.id}"><i class="fas fa-edit"></i> Hindura</button>
                <button class="btn-delete" data-id="${fault.id}"><i class="fas fa-trash"></i> Siba</button>
            </div>
        `;
        faultsList.appendChild(faultElement);
    });

    // Edit & Delete actions
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', e => editFault(parseInt(e.target.closest('.btn-edit').dataset.id)));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', e => deleteFault(parseInt(e.target.closest('.btn-delete').dataset.id)));
    });
}

// Category labels
function getCategoryName(category) {
    switch(category) {
        case 'traffic': return 'Amakosa yo mu nzira';
        case 'document': return 'Ibyangombwa';
        case 'vehicle': return 'Ikinyabiziga';
        default: return category;
    }
}

// Handle Add/Edit Fault
function handleFaultSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseInt(formData.get('price'));
    const category = formData.get('category');
    const faultId = parseInt(formData.get('faultId'));

    if (faultId) {
        const index = faultsData.findIndex(f => f.id === faultId);
        if (index !== -1) faultsData[index] = { id: faultId, name, description, price, category };
    } else {
        const newId = faultsData.length > 0 ? Math.max(...faultsData.map(f => f.id)) + 1 : 1;
        faultsData.push({ id: newId, name, description, price, category });
    }

    localStorage.setItem('faultsData', JSON.stringify(faultsData));
    e.target.reset();
    document.getElementById('faultId').value = '';
    document.getElementById('formTitle').textContent = 'Shyiraho Ikosa Gishya';
    renderFaultsAdmin();
    showNotification(faultId ? "Ikosa ryahinduwe neza!" : "Ikosa ryongewe neza!", "success");
}

// Edit Fault
function editFault(id) {
    const fault = faultsData.find(f => f.id === id);
    if (!fault) return;
    document.getElementById('faultId').value = fault.id;
    document.getElementById('name').value = fault.name;
    document.getElementById('description').value = fault.description;
    document.getElementById('price').value = fault.price;
    document.getElementById('category').value = fault.category;
    document.getElementById('formTitle').textContent = 'Hindura Ikosa';
    document.getElementById('faultForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete Fault
function deleteFault(id) {
    if (!confirm('Urageze gukuraho iki kosa?')) return;
    faultsData = faultsData.filter(f => f.id !== id);
    localStorage.setItem('faultsData', JSON.stringify(faultsData));
    renderFaultsAdmin();
    showNotification("Ikosa ryakurwaho neza!", "success");
}

// Show Notification with Confirm Link
function showNotification(msg, type = "success") {
    notification.innerHTML = `
        <span>${msg}</span>
        <div style="margin-top:10px;">
            <a href="TIMU 5.html" class="menu-item"><i>↩️</i> SUBIRA INYUMA</a>
        </div>
    `;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 5000);
}

// Footer Info Update
function updateFooterInfo() {
    const now = new Date();
    document.getElementById('timeDisplay').textContent = `Saa: ${now.toLocaleTimeString('rw-RW')}`;
    document.getElementById('dateDisplay').textContent = `Itariki: ${now.toLocaleDateString('rw-RW')}`;
    const mockIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    document.getElementById('ipDisplay').textContent = `IP: ${mockIP}`;
}
