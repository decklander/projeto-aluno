const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

// Define o limite para seleção da data (1 mês a partir de hoje)
const oneMonthFromNow = new Date();
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
const maxDate = oneMonthFromNow.toISOString().split('T')[0];
const minDate = new Date().toISOString().split('T')[0];

// Define os dias da semana que podem ser selecionados (segunda, quinta, sexta-feira e quarta apenas pela manhã)
const allowedDaysOfWeek = [0, 1, 2, 3, 4];

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
    0: generateTimes('20:45', '22:05'),
    1: generateTimes('16:30', '18:30').concat(generateTimes('20:45', '22:05')),
    2: generateTimes('20:45', '22:05'),
    3: generateTimes('16:30', '18:30').concat(generateTimes('20:45', '22:05')),
    4: generateTimes('15:15', '18:35').concat(generateTimes('18:45', '22:05')),
};

// Array para armazenar os horários já agendados
const bookedTimes = [];

dateInput.setAttribute('min', minDate);
dateInput.setAttribute('max', maxDate);

dateInput.addEventListener('input', function () {
    const selectedDate = new Date(this.value);
    const dayOfWeek = selectedDate.getDay();

    if (allowedDaysOfWeek.includes(dayOfWeek)) {
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (isToday) {
            const hasAvailableTimes = availableTimes[dayOfWeek].length > 0;
            timeInput.disabled = !hasAvailableTimes;
            populateTimeOptions(availableTimes[dayOfWeek]);
        } else {
            timeInput.disabled = false;
            populateTimeOptions(availableTimes[dayOfWeek]);
        }
    } else {
        timeInput.disabled = true;
        timeInput.innerHTML = '';
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
function populateTimeOptions(times) {
    timeInput.innerHTML = '';

    for (const time of times) {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeInput.appendChild(option);
    }
}