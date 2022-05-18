// TODO we need to create a function that returns the remaining time info in Object that holds the first and last digits of Days, Hours, Minutes and Seconds.

function getRemainingTime() {

  // Create date objects and calculate remaining time object
  const endDateObj = new Date("2022-05-17T14:15:00");
  const currentdateObj = new Date();
  const remainingObj = new Date(endDateObj - currentdateObj);
  
  // Calculate total remaining time
  const total = Date.parse(remainingObj);
  
  // Calculate remaining days, hours, minutes and seconds
  const days = Math.floor(total / (1000 * 3600 * 24));
  const hrs = Math.floor((total / (1000 * 60 * 60)) % 24);
  const min = Math.floor((total / (1000 * 60)) % 60);
  const sec = Math.floor((total / 1000) % 60);

  const daysDigits = ("0" + days).slice(-2);
  const hoursDigits = ("0" + hrs).slice(-2);
  const minutesDigits = ("0" + min).slice(-2);
  const secondsDigits = ("0" + sec).slice(-2);
  return {
    total,
    daysDigits,
    hoursDigits,
    minutesDigits,
    secondsDigits
  };
}

$(document).ready(function () {

  // Assuming more than one flip clock on the page

  $(".countdown").each(function (_, flipClock) {
  
    // Let's create the handles for the digits of the seconds, minutes and hours
    const seconds = createHandles($(flipClock).find(".flip.seconds"));
    const minutes = createHandles($(flipClock).find(".flip.minutes"));
    const hours = createHandles($(flipClock).find(".flip.hours"));
    const days = createHandles($(flipClock).find(".flip.days"));

    const initialTime = getRemainingTime();
    setInitialValues(seconds, initialTime.secondsDigits);
    setInitialValues(minutes, initialTime.minutesDigits);
    setInitialValues(hours, initialTime.hoursDigits);
    setInitialValues(days, initialTime.daysDigits);

    // TODO Here we need to run the setInterval function
    const timeInterval = setInterval(() => {
      const t = getRemainingTime();

      // TODO -> Now we need to call the flipDigit function
      flipDigit(seconds, t.secondsDigits);
      flipDigit(minutes, t.minutesDigits);
      flipDigit(hours, t.hoursDigits);
      flipDigit(days, t.daysDigits);

      // Als de overgebleven tijd nul wordt, stop dan de timer
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }, 1000);

  });

  // TODO Create a function to set the initial values
  function setInitialValues(flipHandles, initialValue) {
    // flipHandles is the object that holds the DOM refs for the child elements.
    // Destructuring the handles
    const {
      flipDisplayTop,
      flipDisplayBottom,
      flipperTop,
      flipperBottom,
      flipHiddenInput
    } = flipHandles;

    flipDisplayTop.text(initialValue);
    flipDisplayBottom.text(initialValue);
    flipperTop.text(initialValue);
    flipperBottom.text(initialValue);
    flipHiddenInput.val(initialValue);
  }

  // TODO Create a function that generates handles for the nested children elements
  function createHandles(flipElement) {
    const flipperTop = flipElement.find(".flipper-top");
    const flipperBottom = flipElement.find(".flipper-bottom");
    const flipDisplayTop = flipElement.find(".flip-display-top");
    const flipDisplayBottom = flipElement.find(".flip-display-bottom");
    const flipHiddenInput = flipElement.find("[type='hidden']");

    return {
      flipElement,
      flipDisplayTop,
      flipDisplayBottom,
      flipperTop,
      flipperBottom,
      flipHiddenInput
    }

  }

  // TODO Create a function that performs the flip animation
  function flipDigit(flipHandles, digitValue) {
    const {
      flipElement,
      flipDisplayTop,
      flipDisplayBottom,
      flipperTop,
      flipperBottom,
      flipHiddenInput
    } = flipHandles;
    // Creating two sub functions to set the values for the flipdisplay and flipper
    const setPreviousValue = (value) => {
      flipperTop.text(value);
      flipDisplayBottom.text(value);
    };

    const setAfterValue = (value) => {
      flipperBottom.text(value);
      flipDisplayTop.text(value);
    };

    // We only want the file animation take place when there is a change in the input hidden field
    if (flipHiddenInput.val() !== digitValue) {
      setPreviousValue(flipHiddenInput.val());
      // Set the new value to the input field and trigger a custom event
      flipHiddenInput.val(digitValue).trigger("valueChanged");
    }

    // Using one instead of on -> I want to catch the dispatched event only once
    flipHiddenInput.one("valueChanged", () => {
      setAfterValue(flipHiddenInput.val());
      flipElement.addClass("play");
    });

    // Remove the play class once the animation is completed
    flipperBottom.one("animationend", () => {
      setAfterValue(flipHiddenInput.val());
      setPreviousValue(flipHiddenInput.val());
      flipElement.removeClass("play");
    })
  }
});