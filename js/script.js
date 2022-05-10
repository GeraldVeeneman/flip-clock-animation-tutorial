// TODO we need to create a function that returns the remaining time info in Object that holds the first and last digits of Days, Hours, Minutes and Seconds.

function generateTimeInfo() {

  // Calculate remaining time
  const endDateObj = new Date("May 15 2022");  
  const currentdateObj = new Date();
  const remainingObj = new Date(endDateObj - currentdateObj);
  
  
  // Calculate remaining days
  const days = Math.floor(remainingObj / (1000 * 3600 * 24));
  
  const hrs = remainingObj.getHours();
  const min = remainingObj.getMinutes();
  const sec = remainingObj.getSeconds();
  return {
    days: {
      firstDigit: parseInt(days / 10),
      lastDigit: parseInt(days % 10),
    },
    hours: {
      firstDigit: parseInt(hrs / 10),
      lastDigit: parseInt(hrs % 10),
    },
    minutes: {
      firstDigit: parseInt(min / 10),
      lastDigit: parseInt(min % 10),
    },
    seconds: {
      firstDigit: parseInt(sec / 10),
      lastDigit: parseInt(sec % 10),
    },
  };
}

$(document).ready(function () {

  // Assuming more than one flip clock on the page

  $(".flip-clock").each(function (_, flipClock) {

    // Let's create the handles for the last and first digits of the seconds, minutes and hours
    const secondsLast = createHandles($(flipClock).find(".seconds-last"));
    const secondsFirst = createHandles($(flipClock).find(".seconds-first"));
    const minutesLast = createHandles($(flipClock).find(".minutes-last"));
    const minutesFirst = createHandles($(flipClock).find(".minutes-first"));
    const hoursLast = createHandles($(flipClock).find(".hours-last"));
    const hoursFirst = createHandles($(flipClock).find(".hours-first"));
    const daysLast = createHandles($(flipClock).find(".days-last"));
    const daysFirst = createHandles($(flipClock).find(".days-first"));

    const initialTime = generateTimeInfo();
    setInitialValues(secondsLast, initialTime.seconds.lastDigit);
    setInitialValues(secondsFirst, initialTime.seconds.firstDigit);
    setInitialValues(minutesLast, initialTime.minutes.lastDigit);
    setInitialValues(minutesFirst, initialTime.minutes.firstDigit);
    setInitialValues(hoursLast, initialTime.hours.lastDigit);
    setInitialValues(hoursFirst, initialTime.hours.firstDigit);
     setInitialValues(daysLast, initialTime.days.lastDigit);
     setInitialValues(daysFirst, initialTime.days.firstDigit);
    // TODO Here we need to run the setInterval function
   setInterval(() => {
      const time = generateTimeInfo();
      // TODO -> Now we need to call the flipDigit function
      flipDigit(secondsLast, time.seconds.lastDigit);
      flipDigit(secondsFirst, time.seconds.firstDigit);
      flipDigit(minutesLast, time.minutes.lastDigit);
      flipDigit(minutesFirst, time.minutes.firstDigit);
      flipDigit(hoursLast, time.hours.lastDigit);
      flipDigit(hoursFirst, time.hours.firstDigit);
      flipDigit(daysLast, time.days.lastDigit);
      flipDigit(daysFirst, time.days.firstDigit);
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
    if (parseInt(flipHiddenInput.val()) !== digitValue) {
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