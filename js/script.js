// TODO we need to create a function that returns the current time in Object that holds the first and last digits of Hours, Minutes and Seconds.

function generateTimeInfo() {
  const dateObj = new Date();
  const hrs = dateObj.getHours();
  const min = dateObj.getMinutes();
  const sec = dateObj.getSeconds();
  return {
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

    // Let's create the handles for the seconds-last
    const secondsLast = createHandles($(flipClock).find(".seconds-last"));
    const initialTime = generateTimeInfo();
    setInitialValues(secondsLast, initialTime.seconds.lastDigit);

    // TODO Here we need to run the setInterval function
   clock=setInterval(() => {
      const time = generateTimeInfo();
      // TODO -> Now we need to call the flipDigit function
      flipDigit(secondsLast, time.seconds.lastDigit);

      if (time.seconds.lastDigit == 6) {
        clearInterval(clock);
      }
    }, 1000);

  });

  // TODO Create a function to set the initial values
  function setInitialValues(flipHandles, initialValue) {
    // flipHandler is the object that holds the DOM refs for the child elements.
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
    // flipElement is the jQuery selector for the flip element,... I'm trying to pass the seconds-last class -> and create the handles for the child elements
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