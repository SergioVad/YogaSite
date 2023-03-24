window.addEventListener("DOMContentLoaded", function () {
  "use strict";

  let $tab = document.querySelectorAll(".info-header-tab"),
    $info = document.querySelector(".info-header"),
    $tabContent = document.querySelectorAll(".info-tabcontent");

  function hideTabContent(a) {
    for (let i = a; i < $tabContent.length; i++) {
      $tabContent[i].classList.remove("show");
      $tabContent[i].classList.add("hide");
    }
  }

  hideTabContent(1);

  function showTabContent(b) {
    if ($tabContent[b].classList.contains("hide")) {
      $tabContent[b].classList.remove("hide");
      $tabContent[b].classList.add("show");
    }
  }

  $info.addEventListener("click", function (event) {
    let target = event.target;
    if (target && target.classList.contains("info-header-tab")) {
      for (let i = 0; i < $tab.length; i++) {
        if (target == $tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });

  // Timer

  let deadline = "2023-05-15";

  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()),
      $seconds = Math.floor((t / 1000) % 60),
      $minutes = Math.floor((t / 1000 / 60) % 60),
      $hours = Math.floor((t / 1000 / 60 / 60) % 24),
      $days = Math.floor(t / 1000 / 60 / 60 / 24);

    return {
      total: t,
      days: $days,
      hours: $hours,
      minutes: $minutes,
      seconds: $seconds,
    };
  }

  function setClock(id, endtime) {
    let $timer = document.getElementById(id),
      $days = $timer.querySelector(".days"),
      $hours = $timer.querySelector(".hours"),
      $minutes = $timer.querySelector(".minutes"),
      $seconds = $timer.querySelector(".seconds"),
      $timeInterval = setInterval(updateClock, 1000);

    function updateClock() {
      let t = getTimeRemaining(endtime);

      function zero(a) {
        if (a < 10) {
          return "0" + a;
        } else return a;
      }
      $days.textContent = zero(t.days);
      $hours.textContent = zero(t.hours);
      $minutes.textContent = zero(t.minutes);
      $seconds.textContent = zero(t.seconds);

      if (t.total <= 0) {
        clearInterval($timeInterval);
        $days.textContent = "00";
        $hours.textContent = "00";
        $minutes.textContent = "00";
        $seconds.textContent = "00";
      }
    }
  }

  setClock("timer", deadline);

  //modal

  let $more = document.querySelectorAll(".btn-overflow"),
    $overlay = document.querySelector(".overlay"),
    $close = document.querySelector(".popup-close");

  $more.forEach(function (item) {
    item.addEventListener("click", function () {
      $overlay.style.display = "block";
      item.classList.add("more-splash");
      document.body.style.overflow = "hidden";
    });
  });

  $close.addEventListener("click", function () {
    $overlay.style.display = "none";
    $more.forEach(function (item) {
      item.classList.remove("more-splash");
    });
    document.body.style.overflow = "";
  });

  //Form

  let message = {
    loading: "Загрузка",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так",
  };

  let $form = document.querySelector(".main-form"),
    $input = $form.getElementsByTagName("input"),
    $statusMessage = document.createElement("div");
  $statusMessage.classList.add("status");

  function sendForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.appendChild($statusMessage);
      let $formData = new FormData(form);
      function postData(formData) {
        return new Promise(function (resolve, reject) {
          let request = new XMLHttpRequest();
          request.open("POST", "../server.php");
          request.setRequestHeader(
            "Content-Type",
            "application/json; charst=utf-8"
          );
          let obj = {};
          formData.forEach(function (value, key) {
            obj[key] = value;
          });
          let json = JSON.stringify(obj);
          request.send(json);
          request.onreadystatechange = function () {
            if (request.readyState < 4) {
              resolve();
            } else if (request.readyState == 4 && request.status == 200) {
              resolve();
            } else {
              reject();
            }
          };
        });
      }

      function clearInput() {
        for (let i = 0; i < $input.length; i++) {
          $input[i].value = "";
        }
      }

      postData($formData)
        .then(() => ($statusMessage.innerHTML = message.loading))
        .then(() => ($statusMessage.innerHTML = message.success))
        .catch(() => ($statusMessage.innerHTML = message.failure))
        .then(clearInput);
    });
  }
  sendForm($form);

  //Slider

  let $slideIndex = 1,
    $slides = document.querySelectorAll(".slider-item"),
    $prev = document.querySelector(".prev"),
    $next = document.querySelector(".next"),
    $dotsWrap = document.querySelector(".slider-dots"),
    $dots = document.querySelectorAll(".dot");

  function showSlides(n) {
    if (n > $slides.length) {
      $slideIndex = 1;
    }
    if (n < 1) {
      $slideIndex = $slides.length;
    }
    $slides.forEach((item) => (item.style.display = "none"));
    $dots.forEach((item) => item.classList.remove("dot-active"));
    $slides[$slideIndex - 1].style.display = "block";
    $dots[$slideIndex - 1].classList.add("dot-active");
  }

  showSlides(1);

  $prev.addEventListener("click", function () {
    showSlides(($slideIndex += -1));
  });

  $next.addEventListener("click", function () {
    showSlides(($slideIndex += 1));
  });

  $dotsWrap.addEventListener("click", function (event) {
    for (let i = 1; i < $dots.length + 1; i++) {
      if (
        event.target.classList.contains("dot") &&
        event.target == $dots[i - 1]
      ) {
        showSlides(($slideIndex = i));
      }
    }
  });

  //Calc

  let $persons = document.querySelectorAll(".counter-block-input")[0],
    $restDays = document.querySelectorAll(".counter-block-input")[1],
    $place = document.getElementById("select"),
    $totalValue = document.getElementById("total"),
    personsSum = 0,
    daysSum = 0,
    total = 0;

  $totalValue.innerHTML = "0";

  $persons.addEventListener("change", function () {
    personsSum = +this.value;
    total = (daysSum + personsSum) * 4000;

    if (
      $persons.value == "0" ||
      $persons.value == "" ||
      $restDays.value == "0" ||
      $restDays.value == ""
    ) {
      $totalValue.innerHTML = "0";
    } else $totalValue.innerHTML = total;
  });

  $restDays.addEventListener("change", function () {
    daysSum = +this.value;
    total = (daysSum + personsSum) * 4000;

    if (
      $persons.value == "0" ||
      $persons.value == "" ||
      $restDays.value == "0" ||
      $restDays.value == ""
    ) {
      $totalValue.innerHTML = "0";
    } else $totalValue.innerHTML = total;
  });

  $place.addEventListener("change", function () {
    let a = total;
    $totalValue.innerHTML = a * this.options[this.selectedIndex].value;
  });
});
