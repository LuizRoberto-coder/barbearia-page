lucide.createIcons();

let currentStep = 1;
let selectedService = null;
let selectedBarber = null;
let selectedDate = null;
let selectedTime = null;

const services = {
    'corte-tradicional': { name: 'Corte Tradicional', price: 'R$ 25', duration: '30min' },
    'corte-barba': { name: 'Corte + Barba', price: 'R$ 40', duration: '45min' },
    'barba-completa': { name: 'Barba Completa', price: 'R$ 20', duration: '25min' },
    'corte-premium': { name: 'Corte Premium', price: 'R$ 35', duration: '40min' },
    'sobrancelha': { name: 'Sobrancelha', price: 'R$ 15', duration: '15min' },
    'tratamento': { name: 'Tratamento Capilar', price: 'R$ 30', duration: '35min' }
};

const barbers = {
    'carlos': { name: 'Carlos Silva', specialty: 'Especialista em cortes clássicos' },
    'joao': { name: 'João Santos', specialty: 'Expert em barbas e bigodes' }
};

function generateDates() {
    const dates = [];
    const today = new Date();
    let count = 0;
    let i = 1;
    
    while (count < 14) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        if (date.getDay() !== 0) { 
            dates.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                }),
                fullDate: date.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long'
                })
            });
            count++;
        }
        i++;
    }
    return dates;
}

function populateDateGrid() {
    const dateGrid = document.getElementById('dateGrid');
    const dates = generateDates();
    
    dateGrid.innerHTML = '';
    dates.forEach((date, index) => {
        const button = document.createElement('button');
        button.className = 'date-btn h-16 sm:h-20 flex flex-col transition-all duration-500 hover:scale-105 animate-fade-in-up border border-[#A0A0A0]/30 text-primary-light hover:border-[#C0C0C0] hover:text-[#C0C0C0] bg-primary-black/20 rounded-md items-center justify-center';
        button.dataset.date = date.value;
        button.dataset.fullDate = date.fullDate;
        button.style.animationDelay = `${index * 0.05}s`;
        button.innerHTML = `
            <i data-lucide="calendar" class="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2"></i>
            <span class="text-xs sm:text-sm font-semibold">${date.label}</span>
        `;
        
        button.addEventListener('click', () => selectDate(date.value, date.fullDate, button));
        dateGrid.appendChild(button);
    });
    
    lucide.createIcons();
}

function updateProgressBar() {
    const steps = ['step1', 'step2', 'step3', 'step4'];
    const lines = ['line1', 'line2', 'line3'];
    
    steps.forEach((stepId, index) => {
        const stepElement = document.getElementById(stepId);
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            stepElement.className = 'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-700 shadow-lg bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-primary-light scale-110 animate-glow';
            stepElement.innerHTML = '<i data-lucide="check" class="w-4 h-4 sm:w-6 sm:h-6"></i>';
        } else if (stepNumber === currentStep) {
            stepElement.className = 'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-700 shadow-lg bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-primary-light scale-110 animate-glow';
            stepElement.innerHTML = stepNumber;
        } else {
            stepElement.className = 'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-700 shadow-lg bg-[#A0A0A0] text-primary-light/50';
            stepElement.innerHTML = stepNumber;
        }
    });
    
    lines.forEach((lineId, index) => {
        const lineElement = document.getElementById(lineId);
        if (index + 1 < currentStep) {
            lineElement.className = 'w-10 sm:w-16 h-2 mx-2 sm:mx-3 rounded-full transition-all duration-700 bg-gradient-to-r from-[#C0C0C0] to-[#808080]';
        } else {
            lineElement.className = 'w-10 sm:w-16 h-2 mx-2 sm:mx-3 rounded-full transition-all duration-700 bg-[#A0A0A0]';
        }
    });
    
    lucide.createIcons();
}

function updateStepContent() {
    const contents = ['step1Content', 'step2Content', 'step3Content', 'step4Content'];
    const titles = [
        'Escolha seu Serviço',
        'Selecione o Barbeiro',
        'Escolha Data e Horário',
        'Confirme seus Dados'
    ];
    const descriptions = [
        'Etapa 1 de 4 - Selecione o serviço desejado',
        'Etapa 2 de 4 - Escolha seu barbeiro preferido',
        'Etapa 3 de 4 - Defina data e horário',
        'Etapa 4 de 4 - Finalize seu agendamento'
    ];
    
    contents.forEach((contentId, index) => {
        const content = document.getElementById(contentId);
        if (index + 1 === currentStep) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
    
    document.getElementById('stepTitle').textContent = titles[currentStep - 1];
    document.getElementById('stepDescription').textContent = descriptions[currentStep - 1];
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentStep === 1;
    
    let canProceed = false;
    switch (currentStep) {
        case 1:
            canProceed = selectedService !== null;
            break;
        case 2:
            canProceed = selectedBarber !== null;
            break;
        case 3:
            canProceed = selectedDate !== null && selectedTime !== null;
            break;
        case 4:
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            canProceed = name !== '' && phone !== '';
            break;
    }
    
    nextBtn.disabled = !canProceed;
    
    if (currentStep === 4) {
        nextBtn.textContent = 'Confirmar Agendamento';
        nextBtn.className = 'bg-gradient-to-r from-[#C0C0C0] to-[#808080] text-primary-light hover:from-[#808080] hover:to-[#C0C0C0] disabled:opacity-50 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-slow rounded-md';
    } else {
        nextBtn.textContent = 'Próximo';
        nextBtn.className = 'bg-gradient-to-r from-[#C0C0C0] to-[#808080] text-primary-light hover:from-[#808080] hover:to-[#C0C0C0] disabled:opacity-50 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-md';
    }
}

function selectService(serviceId, card) {
    document.querySelectorAll('.service-card').forEach(c => {
        c.className = 'service-card cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up border border-[#A0A0A0]/30 hover:border-[#C0C0C0]/50 bg-primary-black/20 rounded-lg';
    });
    
    card.className = 'service-card cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up border-2 border-[#C0C0C0] bg-[#C0C0C0]/10 shadow-lg shadow-[#C0C0C0]/25 animate-glow rounded-lg';
    
    selectedService = serviceId;
    updateNavButtons();
}

function selectBarber(barberId, card) {
    document.querySelectorAll('.barber-card').forEach(c => {
        c.className = 'barber-card cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up border border-[#A0A0A0]/30 hover:border-[#C0C0C0]/50 bg-primary-black/20 rounded-lg';
    });
    
    card.className = 'barber-card cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up border-2 border-[#C0C0C0] bg-[#C0C0C0]/10 shadow-lg shadow-[#C0C0C0]/25 animate-glow rounded-lg';
    
    selectedBarber = barberId;
    updateNavButtons();
}

function selectDate(dateValue, fullDate, button) {
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.className = 'date-btn h-16 sm:h-20 flex flex-col transition-all duration-500 hover:scale-105 animate-fade-in-up border border-[#A0A0A0]/30 text-primary-light hover:border-[#C0C0C0] hover:text-[#C0C0C0] bg-primary-black/20 rounded-md items-center justify-center';
    });
    
    button.className = 'date-btn h-16 sm:h-20 flex flex-col transition-all duration-500 hover:scale-105 animate-fade-in-up bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-primary-light hover:from-[#808080] hover:to-[#C0C0C0] shadow-lg animate-glow rounded-md items-center justify-center';
    
    selectedDate = { value: dateValue, fullDate: fullDate };
    
    document.getElementById('timeSection').classList.remove('hidden');

    document.getElementById('timeSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    updateNavButtons();
}

function selectTime(timeValue, button) {
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.className = 'time-slot h-14 sm:h-16 transition-all duration-500 hover:scale-105 animate-fade-in-up border border-[#A0A0A0]/30 text-primary-light hover:border-[#C0C0C0] hover:text-[#C0C0C0] bg-primary-black/20 rounded-md flex items-center justify-center text-sm sm:text-base';
    });
    
    button.className = 'time-slot h-14 sm:h-16 transition-all duration-500 hover:scale-105 animate-fade-in-up bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-primary-light hover:from-[#808080] hover:to-[#C0C0C0] shadow-lg animate-glow rounded-md flex items-center justify-center text-sm sm:text-base';
    
    selectedTime = timeValue;
    updateNavButtons();
}

function updateSummary() {
    if (selectedService) {
        document.getElementById('summaryService').textContent = services[selectedService].name;
        document.getElementById('summaryPrice').textContent = services[selectedService].price;
        document.getElementById('summaryDuration').textContent = services[selectedService].duration;
    }
    
    if (selectedBarber) {
        document.getElementById('summaryBarber').textContent = barbers[selectedBarber].name;
    }
    
    if (selectedDate) {
        document.getElementById('summaryDate').textContent = selectedDate.fullDate;
    }
    
    if (selectedTime) {
        document.getElementById('summaryTime').textContent = selectedTime;
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('opacity-100');
    
     setTimeout(() => {
        const summaryElement = document.querySelector('.bg-gradient-to-br.from-\\[#C0C0C0\\]');
        if (summaryElement) {
            summaryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

function handleSubmit() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    if (!name || !phone) {
        showToast('❌ Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = 'Enviando...';
    
    const service = services[selectedService];
    const barber = barbers[selectedBarber];
    
    const message = `🎉 *NOVO AGENDAMENTO - BarberShop Elite*
👤 *Cliente:* ${name}
📱 *Telefone:* ${phone}
✂️ *Serviço:* ${service.name}
💰 *Valor:* ${service.price}
👨‍💼 *Barbeiro:* ${barber.name}
📅 *Data:* ${selectedDate.fullDate}
⏰ *Horário:* ${selectedTime}
${notes ? `📝 *Observações:* ${notes}` : ''}
📍 *Endereço:* Rua das Flores, 123 - Centro, São Paulo - SP
_Agendamento realizado pelo site!_
_Por favor, confirme a disponibilidade._`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5582996148084?text=${encodedMessage}`;
    
    // Show success message
    showToast(`🎉 ${name}, redirecionando para WhatsApp...`);
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Reset button
        nextBtn.disabled = false;
        nextBtn.textContent = 'Confirmar Agendamento';
        
        // Show completion message
        setTimeout(() => {
            showToast('✅ Agendamento enviado! Aguarde confirmação via WhatsApp.');
        }, 1000);
        
    }, 1500);
}

// Setup event listeners after DOM is loaded
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateProgressBar();
            updateStepContent();
            updateNavButtons();
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentStep < 4) {
            currentStep++;
            updateProgressBar();
            updateStepContent();
            updateNavButtons();
            
            if (currentStep === 3) {
                populateDateGrid();
            } else if (currentStep === 4) {
                updateSummary();
            }
        } else {
            handleSubmit();
        }
    });
    
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.service;
            selectService(serviceId, card);
        });
    });
    
    document.querySelectorAll('.barber-card').forEach(card => {
        card.addEventListener('click', () => {
            const barberId = card.dataset.barber;
            selectBarber(barberId, card);
        });
    });
    
    document.querySelectorAll('.time-slot').forEach(button => {
        button.addEventListener('click', () => {
            const timeValue = button.dataset.time;
            selectTime(timeValue, button);
        });
    });
    
    document.getElementById('name').addEventListener('input', updateNavButtons);
    document.getElementById('phone').addEventListener('input', updateNavButtons);
    
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = value;
        
        if (value.length >= 11) {
            formatted = value.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
            formatted = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            formatted = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        
        e.target.value = formatted;
    });
}

function initializeApp() {
    // Adiciona margem inferior ao conteúdo principal
    document.querySelector('.container').classList.add('main-content');
    
    populateDateGrid();
    updateProgressBar();
    updateStepContent();
    updateNavButtons();
    setupEventListeners();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeApp, 1);
} else {
    document.addEventListener('DOMContentLoaded', initializeApp);
}

