$(document).ready(function () {
  $("form").submit(function (event) {
    // Получаем IP из поля ввода
    var formData = {
      query: $("#ip").val(),
    };
    
    // Endpoint API для определения местоположения по IP в Dadata
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
    
    // API-ключ Dadata
    var token = "3283c6c1e8a1525d49af2871bfe55b9d59f60a37";

    // Очищаем предыдущий результат
    $("#result").html("Загрузка...");

    $.ajax({
      type: "GET",
      url: url + formData.query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token "+ token);
        // Добавляем заголовок для работы с API Dadata
        xhr.setRequestHeader("Accept", "application/json");
      },
      dataType: "json",
      encode: true,
    }).done(function (result) {
      console.log(result);
      
      // Проверяем наличие данных в ответе
      if (result && result.location && result.location.data) {
        // Извлекаем название города из ответа
        var city = result.location.data.city || "Город не определен";
        
        // Выводим название города на страницу
        $("#result").html("<p><strong>Город:</strong> " + city + "</p>");
        
        // Дополнительно можно вывести более подробную информацию
        var country = result.location.data.country || "";
        var region = result.location.data.region_with_type || "";
        
        if (country || region) {
          $("#result").append("<p><strong>Страна:</strong> " + country + "</p>");
          $("#result").append("<p><strong>Регион:</strong> " + region + "</p>");
        }
      } else {
        // Если информация о местоположении не найдена
        $("#result").html("<p>Не удалось определить местоположение для указанного IP</p>");
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Обработка ошибок запроса
      console.error("Ошибка запроса:", textStatus, errorThrown);
      $("#result").html("<p>Ошибка при выполнении запроса. Проверьте консоль браузера для получения дополнительной информации.</p>");
    });

    // Предотвращаем стандартную отправку формы
    event.preventDefault();
  });
});
