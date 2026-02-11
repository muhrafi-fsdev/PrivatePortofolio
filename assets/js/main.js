/* ============================================
   PORTFOLIO - Main JavaScript
   Muhammad Rafi Priyo
   ============================================ */

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Section visibility for color bar animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('gd-visible');
    });
}, { threshold: 0.05 });
document.querySelectorAll('.about, .projects, .skills, .education, .contact').forEach(el => sectionObserver.observe(el));

// ============================================
// DEMO MODALS
// ============================================
const modalOverlay = document.getElementById('modalOverlay');
let currentModal = null;
let titanChart = null, saviaChart = null, saviaGaugeCharts = {};
let saviaInterval = null, titanInterval = null, academicInterval = null;

function openDemo(project) {
    modalOverlay.classList.add('active');
    const modalId = project + 'Modal';
    currentModal = document.getElementById(modalId);
    currentModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    switch (project) {
        case 'savia': initSaviaDemo(); break;
        case 'titan': initTitanDemo(); break;
        case 'academic': initAcademicDemo(); break;
    }
}

function closeDemo() {
    modalOverlay.classList.remove('active');
    if (currentModal) {
        currentModal.classList.remove('active');
        currentModal = null;
    }
    document.body.style.overflow = '';

    if (titanChart) { titanChart.destroy(); titanChart = null; }
    if (saviaChart) { saviaChart.destroy(); saviaChart = null; }
    Object.values(saviaGaugeCharts).forEach(c => c?.destroy());
    saviaGaugeCharts = {};

    [saviaInterval, titanInterval, academicInterval].forEach(i => i && clearInterval(i));
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDemo(); });

// ============================================
// SAVIA DEMO - Water Monitoring
// ============================================
const saviaData = {
    village: { name: 'Desa Ciwaruga', district: 'Kec. Parongpong', regency: 'Kab. Bandung Barat', province: 'Jawa Barat', population: 8542, households: 2134 },
    realtime: { phPre: 7.2, phPost: 7.5, tdsPre: 420, tdsPost: 125, flowRate: 1.35, level: 68, humidity: 65, lastUpdate: new Date().toLocaleTimeString('id-ID') }
};

function initSaviaDemo() {
    const c = document.getElementById('saviaContent');
    c.innerHTML = `
    <div class="savia-demo-dashboard">
        <div class="savia-village-card">
            <div class="village-header">
                <div><h3 class="village-name">${saviaData.village.name}</h3><p class="village-subtitle">${saviaData.village.district}, ${saviaData.village.regency}</p></div>
                <span class="village-badge">🌊 Sistem Aktif</span>
            </div>
            <div class="village-details">
                <div class="village-detail-item"><span class="detail-icon">📍</span><div><span class="detail-label">Provinsi</span><span class="detail-value">${saviaData.village.province}</span></div></div>
                <div class="village-detail-item"><span class="detail-icon">👥</span><div><span class="detail-label">Populasi</span><span class="detail-value">${saviaData.village.population.toLocaleString()}</span></div></div>
                <div class="village-detail-item"><span class="detail-icon">🏠</span><div><span class="detail-label">KK</span><span class="detail-value">${saviaData.village.households.toLocaleString()}</span></div></div>
                <div class="village-detail-item"><span class="detail-icon">💧</span><div><span class="detail-label">Kelembaban</span><span class="detail-value" id="saviaHumidity">${saviaData.realtime.humidity}%</span></div></div>
            </div>
        </div>
        <div class="savia-alerts-panel"><div class="alerts-header"><span class="alerts-title">🔔 Status Peringatan</span><span class="alerts-badge success">✓ Normal</span></div><p class="alerts-empty">Tidak ada peringatan aktif.</p></div>
        <div class="savia-stats-grid">
            <div class="savia-stat-card"><div class="stat-header"><span class="stat-title">pH Pre-Filter</span><span class="stat-icon blue">🧪</span></div><div class="stat-body"><canvas id="gaugePHPre" width="80" height="50"></canvas><div class="stat-value-lg" id="saviaPhPre">${saviaData.realtime.phPre}</div><span class="stat-unit">pH</span></div><div class="stat-status normal">Normal</div></div>
            <div class="savia-stat-card"><div class="stat-header"><span class="stat-title">pH Post-Filter</span><span class="stat-icon green">🧪</span></div><div class="stat-body"><canvas id="gaugePHPost" width="80" height="50"></canvas><div class="stat-value-lg" id="saviaPhPost">${saviaData.realtime.phPost}</div><span class="stat-unit">pH</span></div><div class="stat-status normal">Normal</div></div>
            <div class="savia-stat-card"><div class="stat-header"><span class="stat-title">TDS Pre-Filter</span><span class="stat-icon orange">💧</span></div><div class="stat-body"><canvas id="gaugeTDSPre" width="80" height="50"></canvas><div class="stat-value-lg" id="saviaTdsPre">${saviaData.realtime.tdsPre}</div><span class="stat-unit">ppm</span></div><div class="stat-status warning">Sedang</div></div>
            <div class="savia-stat-card"><div class="stat-header"><span class="stat-title">TDS Post-Filter</span><span class="stat-icon green">💧</span></div><div class="stat-body"><canvas id="gaugeTDSPost" width="80" height="50"></canvas><div class="stat-value-lg" id="saviaTdsPost">${saviaData.realtime.tdsPost}</div><span class="stat-unit">ppm</span></div><div class="stat-status normal">Baik</div></div>
            <div class="savia-stat-card wide"><div class="stat-header"><span class="stat-title">Aliran Air</span><span class="stat-icon blue">🌊</span></div><div class="stat-body horizontal"><div class="stat-value-lg" id="saviaFlow">${saviaData.realtime.flowRate}</div><span class="stat-unit">L/dtk</span></div><div class="stat-status normal">Normal</div></div>
            <div class="savia-stat-card wide"><div class="stat-header"><span class="stat-title">Isi Tangki</span><span class="stat-icon blue">🛢️</span></div><div class="stat-body horizontal"><div class="tank-visual"><div class="tank-fill" id="tankFill" style="height:${saviaData.realtime.level}%"></div></div><div><div class="stat-value-lg" id="saviaLevel">${saviaData.realtime.level}</div><span class="stat-unit">%</span></div></div><div class="stat-status normal">Cukup</div></div>
        </div>
        <div class="savia-charts-panel">
            <div class="charts-header"><div class="charts-title-section"><span class="charts-icon">📊</span><div><h4 class="charts-title">Grafik 24 Jam</h4><p class="charts-subtitle">Tren historis</p></div></div><div class="charts-controls"><span class="auto-refresh-badge">🔄 Auto</span><span class="last-update" id="saviaLastUpdate">Update: ${saviaData.realtime.lastUpdate}</span></div></div>
            <div class="chart-container"><canvas id="saviaMainChart" height="200"></canvas></div>
        </div>
        <div class="savia-ai-hint"><span class="ai-icon">🤖</span><div class="ai-hint-content"><strong>SAVIA AI</strong><p>Kunjungi savia.my.id</p></div></div>
    </div>`;
    setTimeout(() => { initSaviaGauges(); initSaviaChart(); startSaviaRealtime(); }, 100);
}

function initSaviaGauges() {
    const gaugeOpts = (val, max, color) => ({ type: 'doughnut', data: { datasets: [{ data: [val, max - val], backgroundColor: [color, 'rgba(255,255,255,0.1)'], borderWidth: 0 }] }, options: { circumference: 180, rotation: 270, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
    ['gaugePHPre', 'gaugePHPost', 'gaugeTDSPre', 'gaugeTDSPost'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
            const configs = [[saviaData.realtime.phPre, 14, '#10B981'], [saviaData.realtime.phPost, 14, '#10B981'], [saviaData.realtime.tdsPre, 1500, '#F59E0B'], [saviaData.realtime.tdsPost, 500, '#10B981']];
            saviaGaugeCharts[id] = new Chart(el, gaugeOpts(...configs[i]));
        }
    });
}

function initSaviaChart() {
    const ctx = document.getElementById('saviaMainChart');
    if (!ctx) return;
    saviaChart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'], datasets: [{ label: 'Aliran (L/dtk)', data: [1.4, 1.3, 1.2, 1.3, 1.4, 1.2, 1.35], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', tension: 0.4, borderWidth: 3, fill: true, pointRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#4B5563' } } }, scales: { y: { ticks: { color: '#6B7280' }, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { ticks: { color: '#6B7280' }, grid: { display: false } } } }
    });
}

function startSaviaRealtime() {
    if (saviaInterval) clearInterval(saviaInterval);
    saviaInterval = setInterval(() => {
        saviaData.realtime = { ...saviaData.realtime, phPre: (7 + Math.random() * 0.4).toFixed(2), phPost: (7.3 + Math.random() * 0.4).toFixed(2), tdsPre: Math.floor(400 + Math.random() * 50), tdsPost: Math.floor(110 + Math.random() * 30), flowRate: (1.2 + Math.random() * 0.3).toFixed(2), level: Math.floor(60 + Math.random() * 15), humidity: Math.floor(60 + Math.random() * 15), lastUpdate: new Date().toLocaleTimeString('id-ID') };
        ['saviaPhPre', 'saviaPhPost', 'saviaTdsPre', 'saviaTdsPost', 'saviaFlow', 'saviaLevel'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = saviaData.realtime[id.replace('savia', '').toLowerCase().replace('phpr', 'phPr').replace('phpo', 'phPo').replace('tdspr', 'tdsPr').replace('tdspo', 'tdsPo').replace('flowrate', 'flowRate')]; });
        const h = document.getElementById('saviaHumidity'); if (h) h.textContent = saviaData.realtime.humidity + '%';
        const u = document.getElementById('saviaLastUpdate'); if (u) u.textContent = 'Update: ' + saviaData.realtime.lastUpdate;
        const t = document.getElementById('tankFill'); if (t) t.style.height = saviaData.realtime.level + '%';
    }, 5000);
}

// ============================================
// TITAN DEMO - Network Operations
// ============================================
const titanData = {
    stats: { starlink: 12, bts: 156, blankspot: 23, total: 191 },
    perf: { uptime: 99.4, latency: 37, throughput: 85 },
    regions: [
        { name: 'DKI Jakarta', province: 'DKI Jakarta', starlink: 3, bts: 45, blankspot: 2 },
        { name: 'Bandung', province: 'Jawa Barat', starlink: 2, bts: 32, blankspot: 5 },
        { name: 'Surabaya', province: 'Jawa Timur', starlink: 2, bts: 28, blankspot: 4 },
        { name: 'Medan', province: 'Sumatera Utara', starlink: 2, bts: 25, blankspot: 6 },
        { name: 'Palembang', province: 'Sumatera Selatan', starlink: 1, bts: 15, blankspot: 3 },
        { name: 'Semarang', province: 'Jawa Tengah', starlink: 2, bts: 11, blankspot: 3 }
    ],
    recs: [
        { type: 'warning', title: 'BTS Overload', desc: 'Node Jakarta Selatan mendekati kapasitas', priority: 'High' },
        { type: 'info', title: 'Maintenance', desc: 'Jadwal maintenance: 15 Jan 2026', priority: 'Medium' },
        { type: 'success', title: 'Optimasi Selesai', desc: 'Upgrade bandwidth berhasil', priority: 'Low' }
    ],
    charts: { daily: { labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], data: [85, 78, 92, 88, 95, 90] }, weekly: { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], data: [88, 92, 85, 90, 87, 75, 82] }, monthly: { labels: ['W1', 'W2', 'W3', 'W4'], data: [89, 91, 88, 90] } }
};

function initTitanDemo() {
    const c = document.getElementById('titanContent');
    const t = new Date().toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    c.innerHTML = `
    <div class="titan-demo-dashboard">
        <div class="titan-header-bar"><div class="titan-title-section"><span class="titan-logo">🛰️</span><div><h3 class="titan-title">TITAN NOC</h3><p class="titan-subtitle">Network Operations Center</p></div></div><div class="titan-time" id="titanTime">${t}</div></div>
        <div class="titan-stats-grid">
            <div class="titan-stat-card"><div class="stat-icon-titan starlink">🛰️</div><div class="stat-content"><div class="stat-value-titan">${titanData.stats.starlink}</div><div class="stat-label-titan">Starlink</div></div></div>
            <div class="titan-stat-card"><div class="stat-icon-titan bts">📡</div><div class="stat-content"><div class="stat-value-titan">${titanData.stats.bts}</div><div class="stat-label-titan">BTS</div></div></div>
            <div class="titan-stat-card"><div class="stat-icon-titan blankspot">⚠️</div><div class="stat-content"><div class="stat-value-titan">${titanData.stats.blankspot}</div><div class="stat-label-titan">Blankspot</div></div></div>
            <div class="titan-stat-card"><div class="stat-icon-titan total">🌐</div><div class="stat-content"><div class="stat-value-titan">${titanData.stats.total}</div><div class="stat-label-titan">Total</div></div></div>
        </div>
        <div class="titan-main-grid">
            <div class="titan-map-card">
                <div class="map-header"><span class="map-title">🗺️ Peta Infrastruktur</span><select class="map-filter"><option>Semua Pulau</option><option>Jawa</option><option>Sumatera</option></select></div>
                <div class="map-placeholder"><div class="map-visual"><div class="map-indonesia"><div class="map-point" style="top:35%;left:25%">🛰️</div><div class="map-point" style="top:45%;left:22%">📡</div><div class="map-point" style="top:55%;left:42%">🛰️</div><div class="map-point" style="top:58%;left:48%">📡</div><div class="map-point" style="top:56%;left:52%">📡</div><div class="map-point" style="top:60%;left:60%">🛰️</div><div class="map-point" style="top:48%;left:55%">⚠️</div></div></div><div class="map-legend"><span class="legend-item"><span class="legend-dot starlink"></span>Starlink</span><span class="legend-item"><span class="legend-dot bts"></span>BTS</span><span class="legend-item"><span class="legend-dot blankspot"></span>Blankspot</span></div></div>
            </div>
            <div class="titan-perf-card">
                <div class="perf-header"><span class="perf-title">📈 Performa</span><div class="perf-tabs"><button class="perf-tab active" onclick="updateTitanChart(this,'daily')">Hari</button><button class="perf-tab" onclick="updateTitanChart(this,'weekly')">Minggu</button><button class="perf-tab" onclick="updateTitanChart(this,'monthly')">Bulan</button></div></div>
                <div class="perf-chart-container"><canvas id="titanPerfChart" height="180"></canvas></div>
                <div class="perf-metrics"><div class="perf-metric"><span class="perf-metric-value">${titanData.perf.uptime}%</span><span class="perf-metric-label">Uptime</span></div><div class="perf-metric"><span class="perf-metric-value">${titanData.perf.latency}ms</span><span class="perf-metric-label">Latency</span></div><div class="perf-metric"><span class="perf-metric-value">${titanData.perf.throughput}%</span><span class="perf-metric-label">Throughput</span></div></div>
            </div>
        </div>
        <div class="titan-recommendations"><div class="rec-header"><span class="rec-title">💡 Rekomendasi AI</span></div><div class="rec-list">${titanData.recs.map(r => `<div class="rec-item ${r.type}"><span class="rec-icon">${r.type === 'warning' ? '⚠️' : r.type === 'info' ? 'ℹ️' : '✅'}</span><div class="rec-content"><strong>${r.title}</strong><p>${r.desc}</p></div><span class="rec-priority ${r.priority.toLowerCase()}">${r.priority}</span></div>`).join('')}</div></div>
        <div class="titan-table-card"><div class="table-header"><span class="table-title">📋 Data Wilayah</span></div><table class="titan-table"><thead><tr><th>Wilayah</th><th>Provinsi</th><th>🛰️</th><th>📡</th><th>⚠️</th></tr></thead><tbody>${titanData.regions.map(r => `<tr><td><strong>${r.name}</strong></td><td>${r.province}</td><td>${r.starlink}</td><td>${r.bts}</td><td>${r.blankspot}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
    setTimeout(() => { initTitanChart(); startTitanRealtime(); }, 100);
}

function initTitanChart() {
    const ctx = document.getElementById('titanPerfChart');
    if (!ctx) return;
    const d = titanData.charts.daily;
    titanChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: d.labels, datasets: [{ label: 'Performa (%)', data: d.data, backgroundColor: 'rgba(0,212,255,0.7)', borderColor: '#00D4FF', borderWidth: 1, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6B7280' } }, x: { grid: { display: false }, ticks: { color: '#6B7280' } } } }
    });
}

function updateTitanChart(btn, period) {
    document.querySelectorAll('.perf-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (titanChart) {
        const d = titanData.charts[period];
        titanChart.data.labels = d.labels;
        titanChart.data.datasets[0].data = d.data;
        titanChart.update();
    }
}

function startTitanRealtime() {
    if (titanInterval) clearInterval(titanInterval);
    titanInterval = setInterval(() => {
        const el = document.getElementById('titanTime');
        if (el) el.textContent = new Date().toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

// ============================================
// ACADEMIC DEMO
// ============================================
let academicTasks = [
    { id: 1, title: 'Tugas Algoritma & Pemrograman', course: 'IF101', deadline: '2026-01-15', status: 'ongoing', completed: false },
    { id: 2, title: 'Laporan Praktikum Fisika', course: 'FI102', deadline: '2026-01-18', status: 'ongoing', completed: false },
    { id: 3, title: 'Quiz Online Kalkulus II', course: 'MA201', deadline: '2026-01-20', status: 'pending', completed: false },
    { id: 4, title: 'Presentasi Web Dev', course: 'IF305', deadline: '2026-01-12', status: 'completed', completed: true },
    { id: 5, title: 'Essay Bahasa Inggris', course: 'EN101', deadline: '2026-01-22', status: 'ongoing', completed: false },
    { id: 6, title: 'UTS Jaringan Komputer', course: 'IF202', deadline: '2026-01-25', status: 'pending', completed: false }
];
let showAddForm = false, currentTab = 'all';

function initAcademicDemo() {
    const c = document.getElementById('academicContent');
    const total = academicTasks.length, done = academicTasks.filter(t => t.completed).length, pend = academicTasks.filter(t => t.status === 'pending').length, ongoing = academicTasks.filter(t => t.status === 'ongoing').length, rate = total > 0 ? Math.round((done / total) * 100) : 0;
    const t = new Date().toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    c.innerHTML = `
    <div class="academic-demo-dashboard">
        <div class="academic-header-bar"><div class="academic-welcome"><h3>Selamat Datang! 👋</h3><p class="live-time" id="academicTime">${t}</p></div></div>
        <div class="academic-stats-grid">
            <div class="academic-stat-card cyan"><div class="stat-icon-academic">📚</div><div class="stat-info"><div class="stat-value-academic">${total}</div><div class="stat-label-academic">Total</div></div></div>
            <div class="academic-stat-card green"><div class="stat-icon-academic">✅</div><div class="stat-info"><div class="stat-value-academic">${done}</div><div class="stat-label-academic">Selesai</div></div></div>
            <div class="academic-stat-card orange"><div class="stat-icon-academic">🔄</div><div class="stat-info"><div class="stat-value-academic">${ongoing}</div><div class="stat-label-academic">Dikerjakan</div></div></div>
            <div class="academic-stat-card purple"><div class="stat-icon-academic">📊</div><div class="stat-info"><div class="stat-value-academic">${rate}%</div><div class="stat-label-academic">Progress</div></div><div class="progress-ring-mini"><svg viewBox="0 0 36 36"><path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><path class="ring-fill" stroke-dasharray="${rate}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/></svg></div></div>
        </div>
        <div class="academic-main-grid">
            <div class="academic-list-card">
                <div class="list-header"><div class="list-title-section"><h4>📝 Daftar Tugas</h4><p>Kelola tugas & deadline</p></div><button class="add-btn" onclick="toggleAddForm()">+ Tambah</button></div>
                <div id="addTaskForm" class="add-form"><h5>Tambah Tugas Baru</h5><div class="form-row"><div class="form-group"><label>Judul</label><input type="text" id="taskTitleInput" placeholder="Judul tugas..."></div></div><div class="form-row two-col"><div class="form-group"><label>Kode MK</label><input type="text" id="taskCourseInput" placeholder="IF101"></div><div class="form-group"><label>Deadline</label><input type="date" id="taskDeadlineInput"></div></div><div class="form-actions"><button class="btn-cancel" onclick="toggleAddForm()">Batal</button><button class="btn-save" onclick="addNewTask()">Simpan</button></div></div>
                <div class="filter-tabs"><button class="filter-tab active" onclick="filterAcademicTasks(this,'all')">Semua</button><button class="filter-tab" onclick="filterAcademicTasks(this,'ongoing')">Dikerjakan</button><button class="filter-tab" onclick="filterAcademicTasks(this,'pending')">Pending</button><button class="filter-tab" onclick="filterAcademicTasks(this,'completed')">Selesai</button></div>
                <div class="task-list" id="academicTaskList"></div>
            </div>
            <div class="academic-ai-panel">
                <div class="ai-panel-header"><span class="ai-avatar">🤖</span><div><h4>AI Assistant</h4><span class="ai-status">● Online</span></div></div>
                <div class="ai-messages" id="academicAiMessages"><div class="ai-message"><span class="ai-msg-avatar">🤖</span><div class="ai-msg-content"><div class="ai-msg-title">Selamat Datang! 🎓</div><div class="ai-msg-text">Ada yang bisa saya bantu?</div></div></div></div>
                <div class="ai-quick-actions"><button onclick="academicAiAction('tips')">💡 Tips</button><button onclick="academicAiAction('deadline')">⏰ Deadline</button><button onclick="academicAiAction('motivasi')">🎯 Motivasi</button><button onclick="academicAiAction('progress')">📊 Progress</button></div>
                <div class="ai-input-area"><input type="text" id="academicAiInput" placeholder="Tanya apa saja..." onkeypress="if(event.key==='Enter')sendAcademicAiMsg()"><button onclick="sendAcademicAiMsg()">➤</button></div>
            </div>
        </div>
    </div>`;
    renderAcademicTasks(); startAcademicRealtime();
}

function startAcademicRealtime() {
    if (academicInterval) clearInterval(academicInterval);
    academicInterval = setInterval(() => {
        const el = document.getElementById('academicTime');
        if (el) el.textContent = new Date().toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);
}

function toggleAddForm() { showAddForm = !showAddForm; document.getElementById('addTaskForm')?.classList.toggle('active', showAddForm); }

function addNewTask() {
    const ti = document.getElementById('taskTitleInput').value, co = document.getElementById('taskCourseInput').value, de = document.getElementById('taskDeadlineInput').value;
    if (!ti || !co || !de) { alert('Isi semua field!'); return; }
    academicTasks.unshift({ id: Date.now(), title: ti, course: co, deadline: de, status: 'pending', completed: false });
    document.getElementById('taskTitleInput').value = ''; document.getElementById('taskCourseInput').value = ''; document.getElementById('taskDeadlineInput').value = '';
    toggleAddForm(); renderAcademicTasks();
}

function renderAcademicTasks() {
    const list = document.getElementById('academicTaskList');
    if (!list) return;
    let tasks = academicTasks;
    if (currentTab !== 'all') tasks = currentTab === 'completed' ? academicTasks.filter(t => t.completed) : academicTasks.filter(t => t.status === currentTab && !t.completed);
    if (!tasks.length) { list.innerHTML = '<p class="empty-state">Tidak ada tugas.</p>'; return; }
    list.innerHTML = tasks.map(t => `
        <div class="task-item ${t.completed ? 'completed' : ''}">
            <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTaskComplete(${t.id})">${t.completed ? '✓' : ''}</div>
            <div class="task-info"><div class="task-title">${t.title}</div><div class="task-meta"><span class="task-course">${t.course}</span><span class="task-deadline">📅 ${formatDate(t.deadline)}</span></div></div>
            <select class="status-select" onchange="updateTaskStatus(${t.id},this.value)" ${t.completed ? 'disabled' : ''}><option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Pending</option><option value="ongoing" ${t.status === 'ongoing' ? 'selected' : ''}>Dikerjakan</option><option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Selesai</option></select>
        </div>
    `).join('');
}

function toggleTaskComplete(id) { const t = academicTasks.find(x => x.id === id); if (t) { t.completed = !t.completed; if (t.completed) t.status = 'completed'; renderAcademicTasks(); } }
function updateTaskStatus(id, s) { const t = academicTasks.find(x => x.id === id); if (t) { t.status = s; if (s === 'completed') t.completed = true; renderAcademicTasks(); } }
function filterAcademicTasks(btn, tab) { document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentTab = tab; renderAcademicTasks(); }
function formatDate(d) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }

const aiResp = {
    tips: '💡 **Tips Belajar:**\n• Teknik Pomodoro\n• Catatan Cornell\n• Review sebelum tidur',
    deadline: `⏰ **Status:** ${academicTasks.filter(t => t.status === 'pending').length} pending, ${academicTasks.filter(t => t.status === 'ongoing').length} ongoing`,
    motivasi: '🎯 **Motivasi:** "Kesuksesan = persiapan + kerja keras + belajar dari kegagalan"',
    progress: `📊 **Progress:** ${Math.round((academicTasks.filter(t => t.completed).length / academicTasks.length) * 100)}% selesai`
};

function academicAiAction(action) {
    const mc = document.getElementById('academicAiMessages'); if (!mc) return;
    const titles = { tips: '💡 Tips', deadline: '⏰ Deadline', motivasi: '🎯 Motivasi', progress: '📊 Progress' };
    const msg = document.createElement('div'); msg.className = 'ai-message';
    msg.innerHTML = `<span class="ai-msg-avatar">🤖</span><div class="ai-msg-content"><div class="ai-msg-title">${titles[action]}</div><div class="ai-msg-text">${(aiResp[action] || '').replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div></div>`;
    mc.appendChild(msg); mc.scrollTop = mc.scrollHeight;
}

function sendAcademicAiMsg() {
    const inp = document.getElementById('academicAiInput'), txt = inp.value.trim(); if (!txt) return;
    const mc = document.getElementById('academicAiMessages');
    const um = document.createElement('div'); um.className = 'ai-message user';
    um.innerHTML = `<div class="ai-msg-content user"><div class="ai-msg-text">${txt}</div></div><span class="ai-msg-avatar user">👤</span>`;
    mc.appendChild(um); inp.value = '';
    setTimeout(() => {
        const am = document.createElement('div'); am.className = 'ai-message';
        am.innerHTML = `<span class="ai-msg-avatar">🤖</span><div class="ai-msg-content"><div class="ai-msg-text">Gunakan tombol aksi untuk respons spesifik! 😊</div></div>`;
        mc.appendChild(am); mc.scrollTop = mc.scrollHeight;
    }, 800);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) { e.preventDefault(); document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
});

document.addEventListener('DOMContentLoaded', () => console.log('Portfolio loaded!'));
