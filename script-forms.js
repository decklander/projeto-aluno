$(document).ready(function () {
    // Defina as opções para o DatePicker do campo de entrada de calendário
    var calendarioOptions = {
        showOn: "button", // Exibir o calendário apenas quando o botão é clicado
        buttonImage: "https://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
        buttonImageOnly: true,
        buttonText: "Selecionar data",
        dateFormat: "dd/mm/yy",
        minDate: 0, // Impedir seleção de datas anteriores ao dia atual
        maxDate: "+1M", // Limitar seleção até 1 mês à frente da data atual
        beforeShowDay: function (date) {
            return [isDiaUtil(date)]; // Retorna [true] para dias de segunda a sexta-feira
        }
    };

    // Inicialize o DatePicker no campo de entrada de calendário com as opções definidas
    $("#data").datepicker(calendarioOptions);
});

// Função para verificar se um dia é de segunda a sexta-feira
function isDiaUtil(date) {
    var diaSemana = date.getDay(); // 0 (domingo) a 6 (sábado)
    return diaSemana >= 1 && diaSemana <= 5; // 1 a 5 representa segunda a sexta-feira
}

// Função para vincular a hora selecionada ao dia da semana selecionado no calendário
function vincularHora() {
    var dataSelecionada = $("#data").val();
    var horaSelecionada = $("#horas").val();

    // Verifique se tanto a data quanto a hora foram selecionadas
    if (dataSelecionada && horaSelecionada) {
        // Aqui você pode fazer algo com a data e a hora selecionadas, por exemplo, exibir um alerta
        alert("Data selecionada: " + dataSelecionada + ", Hora selecionada: " + horaSelecionada);

        // Remover o horário selecionado da lista de opções
        $("#horas option[value='" + horaSelecionada + "']").remove();

        // Limpar o campo de entrada de lista de horas
        $("#horas").val("");
    } else {
        alert("Selecione uma data e uma hora para vincular!");
    }
}