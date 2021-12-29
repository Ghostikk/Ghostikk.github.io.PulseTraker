$(document).ready(function () {
  //cлайдер
  $(".slider__pulsTraker").slick({
    dots: false,
    infinite: true,
    speed: 1200,
    adaptiveHeight: true,
    autoplay: false,
    autoplaySpeed: 2500,
    fade: true,
    cssEase: "linear",
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          infinite: true,
          dots: false, // кнопки
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  // переключение табов
  $("ul.section_catalog__tabs").on(
    "click",
    "li:not(.active_catalog__tab)",
    function () {
      $(this)
        .addClass("active_catalog__tab")
        .siblings()
        .removeClass("active_catalog__tab")
        .closest("div.container")
        .find("div.catalog__content")
        .removeClass("catalog__content_active")
        .eq($(this).index())
        .addClass("catalog__content_active");
    }
  );
  // переключение контента в карточках
  function toggleSlide(item) {
    $(item).each(function (i) {
      $(this).on("click", function (e) {
        e.preventDefault();
        $(".catalog-item__content")
          .eq(i)
          .toggleClass("catalog-item__content_active");
        $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active");
      });
    });
  }

  toggleSlide(".catalog-item__link");
  toggleSlide(".catalog-item__back");

  //Modal
  // вызов модального окна по классу data
  $('[data-modal="consultation"]').on("click", function () {
    $(".overlay, #consultation").fadeIn("slow");
  });
  // закрытие модального окна для классов (id)
  $(".modal__close").on("click", function () {
    $(".overlay, #consultation, #order, #thanks").fadeOut("slow");
  });

  // извлекает наименование товара с каждого блока по клику и вставыялет в модальное окно заказа
  $(".button_mini").each(function (i) {
    $(this).on("click", function () {
      $("#order .modal__description").text(
        $(".catalog-item__subtitle").eq(i).text()
      );
      $(".overlay, #order").fadeIn("slow");
    });
  });

  // валидация форм
  function validateForms(form) {
    $(form).validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },
        tel: "required",
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        name: {
          required: "Пожалуйста, введите свое имя",
          minlength: jQuery.validator.format("Введите {0} символа!"),
        },
        tel: "Пожалуйста, введите свой номер телефона",
        email: {
          required: "Пожалуйста, введите свою почту",
          email: "Неправильно введен адрес почты",
        },
      },
    });
  }

  validateForms("#consultation form");
  validateForms("#form_flex form");
  validateForms("#order form");

  $("input[name=tel]").mask("+7 (999) 999-99-99"); // маска для формы в поле ввода телефона

  // отправка формы на сервер
  $("form").submit(function (e) {
    e.preventDefault();

    //условие для валидации, если вал. не прошла, прекращаем выполнение
    if (!$(this).valid()) {
      return;
    }

    $.ajax({
      type: "POST", // отправляем данные
      url: "mailer/smart.php", //куда направляем
      data: $(this).serialize(),
    }).done(function () {
      $(this).find("input").val("");
      $("#consultation, #order").fadeOut();
      $(".overlay, #thanks").fadeIn("slow");
      $("form").trigger("reset");
    });
    return false;
  });
});
