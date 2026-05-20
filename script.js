const servicesList = [
    "Meta ads", "SEO", "Website", "Google ads", "Logo", 
    "Posters", "Video editing", "AI video", "Package designing", 
    "Brochure", "Flyer", "UI/UX", "Content creation"
];

const skillsList = [
    "Photoshop", "Illustrator", "InDesign", "CorelDRAW", "Premiere Pro", 
    "After Effects", "Figma", "Canva", "WordPress", "HTML", "CSS", "JS", 
    "React", "Next.js", "Angular", "PHP", "Laravel", "Flutter", 
    "Meta ads", "Google ads", "SEO", "GMP", "AEO/GEO", "AIO"
];

let selectedServices = new Set();
let selectedSkills = new Set();
let currentStep = 1;
const totalSteps = 5;

// Initialize form
document.addEventListener("DOMContentLoaded", () => {
    populateServices();
    populateSkills();
    updateProgress();
});

// Render Services in Step 2
function populateServices() {
    const grid = document.getElementById("servicesGrid");
    servicesList.forEach(service => {
        const chip = document.createElement("div");
        chip.className = "service-chip";
        chip.textContent = service;
        chip.onclick = () => toggleService(chip, service);
        grid.appendChild(chip);
    });
}

function toggleService(element, service) {
    if (selectedServices.has(service)) {
        selectedServices.delete(service);
        element.classList.remove("selected");
    } else {
        selectedServices.add(service);
        element.classList.add("selected");
    }
}

// Render Skills in Step 4
function populateSkills() {
    const grid = document.getElementById("skillsGrid");
    skillsList.forEach(skill => {
        const chip = document.createElement("div");
        chip.className = "service-chip";
        chip.textContent = skill;
        chip.onclick = () => toggleSkill(chip, skill);
        grid.appendChild(chip);
    });
}

function toggleSkill(element, skill) {
    if (selectedSkills.has(skill)) {
        selectedSkills.delete(skill);
        element.classList.remove("selected");
    } else {
        selectedSkills.add(skill);
        element.classList.add("selected");
    }
}

// Navigation Logic
function nextStep(step) {
    if (!validateStep(step)) return;

    if (step === 2) {
        if (selectedServices.size === 0) {
            alert("Please select at least one service.");
            return;
        }
        generatePricingInputs();
    }

    document.getElementById(`step${step}`).classList.remove("active");
    currentStep = step + 1;
    document.getElementById(`step${currentStep}`).classList.add("active");
    updateProgress();
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove("active");
    currentStep = step - 1;
    document.getElementById(`step${currentStep}`).classList.add("active");
    updateProgress();
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById("progress").style.width = `${progress}%`;
}

// Validation
function validateStep(step) {
    const currentTab = document.getElementById(`step${step}`);
    const inputs = currentTab.querySelectorAll("input[required]");
    for (let input of inputs) {
        if (!input.value.trim()) {
            input.focus();
            input.classList.add("error-shake");
            setTimeout(() => input.classList.remove("error-shake"), 500);
            return false;
        }
    }
    return true;
}

// Generate Pricing Inputs dynamically
function generatePricingInputs() {
    const container = document.getElementById("pricingContainer");
    container.innerHTML = ""; // Clear existing

    selectedServices.forEach(service => {
        const itemId = service.replace(/\s+/g, '-').toLowerCase();
        
        const html = `
            <div class="price-item">
                <h3>${service}</h3>
                <div class="price-inputs">
                    <div class="input-group">
                        <input type="number" id="min-${itemId}" required placeholder=" ">
                        <label for="min-${itemId}">Min Amount (₹)</label>
                    </div>
                    <div class="input-group">
                        <input type="number" id="max-${itemId}" required placeholder=" ">
                        <label for="max-${itemId}">Max Amount (₹)</label>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Form Submission
document.getElementById("freelanceForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if (!validateStep(5)) return;
    
    // Show Modal
    const modal = document.getElementById("successModal");
    modal.classList.add("show");
});

// Close Modal
function closeModal() {
    document.getElementById("successModal").classList.remove("show");
}

// WhatsApp Integration
document.getElementById("whatsappBtn").addEventListener("click", () => {
    // Collect Data
    const name = document.getElementById("name").value.trim();
    const place = document.getElementById("place").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    
    const portfolio = document.getElementById("portfolio").value.trim() || "N/A";
    const behance = document.getElementById("behance").value.trim() || "N/A";
    const linkedin = document.getElementById("linkedin").value.trim() || "N/A";
    const instagram = document.getElementById("instagram").value.trim() || "N/A";

    // Collect Pricing
    let servicesText = "";
    selectedServices.forEach(service => {
        const itemId = service.replace(/\s+/g, '-').toLowerCase();
        const min = document.getElementById(`min-${itemId}`).value;
        const max = document.getElementById(`max-${itemId}`).value;
        servicesText += `\n▪️ *${service}*: ₹${min} - ₹${max}`;
    });

    // Format Message
    let skillsText = selectedSkills.size > 0 ? Array.from(selectedSkills).join(", ") : "None";

    const message = `*New Freelancer Registration* 🚀\n
*Personal Details:*
👤 Name: ${name}
📍 Place: ${place}
📱 WhatsApp: ${whatsapp}\n
*Services & Pricing:*${servicesText}\n
*Skills:*
⭐ ${skillsText}\n
*Links:*
🌐 Portfolio: ${portfolio}
🎨 Behance: ${behance}
💼 LinkedIn: ${linkedin}
📸 Instagram: ${instagram}`;

    // Encode and redirect
    const encodedMessage = encodeURIComponent(message);
    const targetNumber = "919400307720";
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
});
