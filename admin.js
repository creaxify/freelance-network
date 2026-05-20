const scriptURL = "https://script.google.com/macros/s/AKfycbxr1wCVcShypf-P3xbaiVu4_lsl3e0woC0mUfaQCYaf2WUvkUSpvqi1PAStRt0qijZ7/exec";

let allData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchData();

    // Event listeners for filters
    document.getElementById("searchInput").addEventListener("input", filterData);
    document.getElementById("serviceFilter").addEventListener("change", filterData);
    document.getElementById("skillFilter").addEventListener("change", filterData);
});

async function fetchData() {
    const tableBody = document.getElementById("tableBody");
    const loading = document.getElementById("loading");
    const table = document.getElementById("dataTable");

    loading.style.display = "flex";
    table.style.display = "none";

    try {
        const response = await fetch(scriptURL);
        const result = await response.json();
        
        if (result.status === "success") {
            // Sort data newest first
            allData = result.data.reverse();
            populateFilters();
            calculateStats();
            renderTable(allData);
        } else {
            loading.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error loading data: ${result.message}`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        loading.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error loading data. Ensure the Google Script allows GET requests.`;
    }
}

function populateFilters() {
    const serviceFilter = document.getElementById("serviceFilter");
    const skillFilter = document.getElementById("skillFilter");
    
    let uniqueServices = new Set();
    let uniqueSkills = new Set();

    allData.forEach(row => {
        // Find the correct property name for services based on Apps Script output
        // It converts headers to lowercase with underscores
        const srvText = row.services_pricing || row.services___pricing || row["services_&_pricing"] || row["services___pricing"] || "";
        const srvLines = srvText.split('\n');
        srvLines.forEach(line => {
            const parts = line.split(':');
            if(parts.length > 0 && parts[0].trim() !== '') {
                uniqueServices.add(parts[0].replace('▪️', '').replace(/\*/g, '').trim());
            }
        });

        // Parse skills
        const skillsText = row.skills || "";
        const skills = skillsText.split(',').map(s => s.trim()).filter(s => s !== '' && s !== 'None');
        skills.forEach(s => uniqueSkills.add(s));
    });

    // Reset dropdowns
    serviceFilter.innerHTML = '<option value="">All Services</option>';
    skillFilter.innerHTML = '<option value="">All Skills</option>';

    Array.from(uniqueServices).sort().forEach(service => {
        serviceFilter.innerHTML += `<option value="${service}">${service}</option>`;
    });

    Array.from(uniqueSkills).sort().forEach(skill => {
        skillFilter.innerHTML += `<option value="${skill}">${skill}</option>`;
    });
}

function calculateStats() {
    document.getElementById("totalCount").textContent = allData.length;
    
    // Calculate top service and skill
    let serviceCounts = {};
    let skillCounts = {};

    allData.forEach(row => {
        const srvText = row.services_pricing || row.services___pricing || row["services_&_pricing"] || row["services___pricing"] || "";
        const srvLines = srvText.split('\n');
        srvLines.forEach(line => {
            const parts = line.split(':');
            if(parts.length > 0 && parts[0].trim() !== '') {
                const s = parts[0].replace('▪️', '').replace(/\*/g, '').trim();
                serviceCounts[s] = (serviceCounts[s] || 0) + 1;
            }
        });

        const skillsText = row.skills || "";
        const skills = skillsText.split(',').map(s => s.trim()).filter(s => s !== '' && s !== 'None');
        skills.forEach(s => {
            skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
    });

    const topService = Object.keys(serviceCounts).sort((a,b) => serviceCounts[b] - serviceCounts[a])[0];
    const topSkill = Object.keys(skillCounts).sort((a,b) => skillCounts[b] - skillCounts[a])[0];

    document.getElementById("topService").textContent = topService || "-";
    document.getElementById("topSkill").textContent = topSkill || "-";
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    const loading = document.getElementById("loading");
    const table = document.getElementById("dataTable");

    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px;">No freelancers match your filters.</td></tr>`;
    } else {
        data.forEach(row => {
            // Format date safely
            let dateStr = row.timestamp;
            try {
                const d = new Date(row.timestamp);
                if (!isNaN(d.getTime())) {
                    dateStr = d.toLocaleDateString();
                }
            } catch(e) {}
            
            // Format services
            const srvText = row.services_pricing || row.services___pricing || row["services_&_pricing"] || row["services___pricing"] || "";
            const formattedServices = srvText.split('\n').map(line => {
                if(!line.trim()) return '';
                return `<div class="service-item">${line.replace('▪️', '').replace(/\*/g, '').trim()}</div>`;
            }).join('');

            // Format skills
            const skillsText = row.skills || "";
            const formattedSkills = skillsText.split(',').map(s => {
                const sk = s.trim();
                return sk && sk !== 'None' ? `<span class="chip">${sk}</span>` : '';
            }).join('');

            // Format links
            const pt = row.portfolio && row.portfolio !== 'N/A' && row.portfolio !== '' ? `<a href="${row.portfolio.startsWith('http') ? row.portfolio : 'https://'+row.portfolio}" target="_blank" class="link-icon" title="Portfolio"><i class="fa-solid fa-globe"></i></a>` : '';
            const be = row.behance && row.behance !== 'N/A' && row.behance !== '' ? `<a href="${row.behance.startsWith('http') ? row.behance : 'https://'+row.behance}" target="_blank" class="link-icon" title="Behance"><i class="fa-brands fa-behance"></i></a>` : '';
            const li = row.linkedin && row.linkedin !== 'N/A' && row.linkedin !== '' ? `<a href="${row.linkedin.startsWith('http') ? row.linkedin : 'https://'+row.linkedin}" target="_blank" class="link-icon" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : '';
            const ig = row.instagram && row.instagram !== 'N/A' && row.instagram !== '' ? `<a href="${row.instagram.startsWith('http') ? row.instagram : 'https://'+row.instagram}" target="_blank" class="link-icon" title="Instagram"><i class="fa-brands fa-instagram"></i></a>` : '';

            const waNum = row.whatsapp ? String(row.whatsapp).replace(/\D/g,'') : '';
            const waLink = waNum ? `<a href="https://wa.me/${waNum}" target="_blank" class="wa-link"><i class="fa-brands fa-whatsapp"></i> ${row.whatsapp}</a>` : '-';

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${row.name || '-'}</strong></td>
                <td>${row.place || '-'}</td>
                <td>${waLink}</td>
                <td class="td-services">${formattedServices}</td>
                <td class="td-skills">${formattedSkills}</td>
                <td>
                    <div class="links-grid">
                        ${pt} ${be} ${li} ${ig}
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    loading.style.display = "none";
    table.style.display = "table";
}

function filterData() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const serviceFilter = document.getElementById("serviceFilter").value;
    const skillFilter = document.getElementById("skillFilter").value;

    const filtered = allData.filter(row => {
        const namePlace = ((row.name || '') + ' ' + (row.place || '')).toLowerCase();
        const srvText = (row.services_pricing || row.services___pricing || row["services_&_pricing"] || row["services___pricing"] || "");
        const skText = (row.skills || "");

        const matchesSearch = namePlace.includes(searchTerm);
        const matchesService = serviceFilter === "" || srvText.includes(serviceFilter);
        const matchesSkill = skillFilter === "" || skText.includes(skillFilter);

        return matchesSearch && matchesService && matchesSkill;
    });

    renderTable(filtered);
}
