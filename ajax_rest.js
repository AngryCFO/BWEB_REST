$(document).ready(function() {
  // Токен и URL API Dadata
  const API_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
  const API_TOKEN = "1437ebd34d55ec8ebf3e2274121e4cf060ea80ed";
  
  $("#ipForm").submit(function(event) {
      event.preventDefault();
      
      // Получаем IP из формы
      const ipAddress = $("#ip").val().trim();
      
      // Валидация IP (базовая проверка)
      if (!ipAddress || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipAddress)) {
          $("#result").html('<div class="error">Пожалуйста, введите корректный IP-адрес</div>');
          return;
      }
      
      // Показываем загрузку
      $("#result").html('<div>Определение местоположения...</div>');
      $("#submit").prop("disabled", true);
      
      // Отправляем запрос к API Dadata
      $.ajax({
          type: "GET",
          url: API_URL + ipAddress,
          beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Token " + API_TOKEN);
          },
          dataType: "json"
      })
      .done(function(response) {
          console.log("Ответ от API:", response);
          
          if (response.location && response.location.data) {
              const location = response.location.data;
              let resultHtml = '<div class="info-item"><strong>IP:</strong> ' + ipAddress + '</div>';
              
              if (location.city) {
                  resultHtml += '<div class="info-item"><strong>Город:</strong> ' + location.city + '</div>';
              }
              if (location.region) {
                  resultHtml += '<div class="info-item"><strong>Регион:</strong> ' + location.region + '</div>';
              }
              if (location.country) {
                  resultHtml += '<div class="info-item"><strong>Страна:</strong> ' + location.country + '</div>';
              }
              
              $("#result").html(resultHtml);
          } else {
              $("#result").html('<div class="error">Не удалось определить местоположение для данного IP</div>');
          }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
          console.error("Ошибка запроса:", textStatus, errorThrown);
          $("#result").html('<div class="error">Ошибка при запросе к сервису: ' + textStatus + '</div>');
      })
      .always(function() {
          $("#submit").prop("disabled", false);
      });
  });
});