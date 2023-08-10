const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

// Define o limite para seleção da data (1 mês a partir de hoje)
const oneMonthFromNow = new Date();
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
const maxDate = oneMonthFromNow.toISOString().split('T')[0];
const minDate = new Date().toISOString().split('T')[0];

// Define os dias da semana que podem ser selecionados (segunda, quinta, sexta-feira e quarta apenas pela manhã)
const allowedDaysOfWeek = [0, 1, 2, 3];

// Função para gerar horários com intervalo de 20 minutos dentro do tempo definido
function generateTimes(startTime, endTime) {
    const times = [];
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const interval = 20; // Intervalo em minutos

    while (currentTime <= end) {
        times.push(currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
        currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return times;
}

// Definir os horários disponíveis para cada dia da semana
const availableTimes = {
    0: generateTimes('17:00', '17:45'),
    1: generateTimes('10:00', '11:00').concat(generateTimes('17:00', '18:45')),
    2: generateTimes('18:00', '19:00'),
    3: generateTimes('08:00', '09:45').concat(generateTimes('19:00', '21:00')),
};

// Array para armazenar os horários já agendados
const bookedTimes = [];

// Adiciona os dias disponíveis no calendário
dateInput.setAttribute('min', minDate);
dateInput.setAttribute('max', maxDate);

// Habilita a seleção dos horários quando uma data é escolhida
dateInput.addEventListener('input', function () {
    const selectedDate = new Date(this.value);
    const dayOfWeek = selectedDate.getDay();

    if (allowedDaysOfWeek.includes(dayOfWeek)) {
        const today = new Date();
        if (selectedDate.toDateString() === today.toDateString()) {
            // A data é o dia atual, verifica se ainda há horários disponíveis
            const hasAvailableTimes = availableTimes[dayOfWeek].length > 0;
            if (hasAvailableTimes) {
                timeInput.disabled = false;
                populateTimeOptions(availableTimes[dayOfWeek], selectedDate);
            } else {
                timeInput.disabled = true;
                timeInput.innerHTML = '';
            }
        } else {
            timeInput.disabled = false;
            populateTimeOptions(availableTimes[dayOfWeek], selectedDate);
        }
    } else {
        timeInput.disabled = true;
        timeInput.innerHTML = '';
    }
});

// Verifica se um horário foi selecionado
timeInput.addEventListener('change', function () {
    // Mantém a seleção na lista de horários
    if (this.value) {
        timeInput.selectedValue = this.value;
    }
});

// Captura o envio do formulário pai
document.getElementById('form').addEventListener('submit', function () {
    const selectedTime = timeInput.selectedValue;

    if (selectedTime) {
        const dayOfWeek = new Date(dateInput.value).getDay();
        bookedTimes.push(selectedTime);
        bookedTimes.sort();

        availableTimes[dayOfWeek] = availableTimes[dayOfWeek].filter(time => time !== selectedTime);
        populateTimeOptions(availableTimes[dayOfWeek]);

        // Limpa a seleção do horário
        timeInput.selectedValue = '';
    }
});

// Função para preencher as opções de horários disponíveis
function populateTimeOptions(times, selectedDate) {
    // Remove horários que já passaram do horário local
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const updatedTimes = times.filter(time => {
        if (selectedDate.toDateString() === now.toDateString()) {
            // Se for o dia atual, verifica o horário atual
            const [hours, minutes] = time.split(':');
            const [currentHours, currentMinutes] = currentTime.split(':');
            return (hours > currentHours) || (hours === currentHours && minutes >= currentMinutes);
        } else {
            return true; // Mantém todos os horários dos dias posteriores
        }
    });

    timeInput.innerHTML = '';

    for (const time of updatedTimes) {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeInput.appendChild(option);
    }
}