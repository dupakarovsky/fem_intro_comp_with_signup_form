"use strict";

/// Obs: Added a green checked icon (img.icon-check) simply to indicate the validation was successfull.

/// 9) IIFE (Immediately Invoked Function Expression) is executed after DOM content is loaded an the script runs. All events will now run on the Closure Scope of the IIFE to avoid poluting the Global Scope)
(function () {
   /// 1) Set DOM Variables.
   /// Store the form, all the inputs and both icons (icon-error, icon-check) for each input.
   const form = document.querySelector("form");
   const allInputs = document.querySelectorAll("input");

   /// 1.1) Keeps track of validation in each step
   let validated = false;

   /// 1.2) Store each individual input element in a variable from the allInputs NodeList
   const [firstNameInput, lastNameInput, emailInput, passwordInput] = allInputs;

   /// 1.3) Regular Expression for validating email. Same used by Mozilla Firefox for the input type email
   const emailValidator =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

   /// 1.4) Regular Expression for validating a password of 8 characters long, with lowercase, uppercase, numbers and special characters. At least 03 of those 04 criteria needs to match.
   const passwordValidator =
      /^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])).{7,30}$/gm;

   /// 4) Displays the icon. Can receive either the error or checked icon as argument.  Set's the 'hidden' property to false and set 'trasnform: scale(1)'. Default value is 0
   const displayIcon = ({ icon }) => {
      icon.hidden = false;
      icon.style.setProperty("transform", "scale(1)");
   };

   /// 5) Displays the label with the fail validation message. Removes the '.valid' class wich slides the label down and makes it visible. Turns the outline of the input red.
   const displayLabel = ({ input }) => {
      input.classList.remove("valid");
   };

   /// 3) Validates First and Last Name. Simply checks if the input is not empty.
   /// The function's 'input' parameter can receive either the firstNameInput or lastNameInput as argument
   const validateByInputLength = ({ input }) => {
      /// 3.1) 'label' variable is only used to target the errorIcon as it is the next element sibling from the label. Since icons don't have ID's this' another way of targeting them without overcrowing the main scope with variables. From errorIcon, checkIcon can be targeted;
      const label = input.nextElementSibling;
      const errorIcon = label.nextElementSibling;
      const checkIcon = errorIcon.nextElementSibling;

      /// 3.2) If the input is empty, display the error icon and the label with the fail validation message. If it's not, dispaly the checked icon. If validation passes, the function returns TRUE and proceeds to the next validation.
      let isInputEmpty = input.value.length === 0;
      if (isInputEmpty) {
         displayIcon({ icon: errorIcon });
         displayLabel({ input });
         return false;
      } else {
         displayIcon({ icon: checkIcon });
         return true;
      }
   };

   /// 6) Validates the input by a Regular Expression. Accepts an input (email or password) and one of the regular expressions to test it.
   const validateByRegEx = ({ input, regex }) => {
      const label = input.nextElementSibling;
      const errorIcon = label.nextElementSibling;
      const checkIcon = errorIcon.nextElementSibling;

      /// 6.1) the Match() method return an array of strings if the validation matches. If the array is not empty, the input is valid.
      let isInputValid = Array.isArray(input.value.match(regex));
      if (!isInputValid) {
         displayIcon({ icon: errorIcon });
         displayLabel({ input });
         return false;
      } else {
         displayIcon({ icon: checkIcon });
         return true;
      }
   };

   /// 8) Clear validation icons and messages.
   const resetValidation = ({ input }) => {
      const label = input.nextElementSibling;
      const errorIcon = label.nextElementSibling;
      const checkIcon = errorIcon.nextElementSibling;

      /// 8.1) Removes any icons by removing the in style class and hides the labels adding back the 'valid' class to the input field
      [errorIcon, checkIcon].forEach((icon) => {
         icon.removeAttribute("style");
         icon.hidden = true;
      });
      input.classList.add("valid");
   };

   /// 2) Listen to Submit event on the form.
   form.addEventListener("submit", (e) => {
      /// 2.1) Prevents page from reloading when submitting.
      e.preventDefault();

      /// 2.2) Runs validation function on First Name input. Store it's value (true if passes / false if doesn't)
      validated = validateByInputLength({ input: firstNameInput });

      /// 2.3) If First Name passes validation (validated = true), proceed to validate Last Name using the same function but passing the lastNameInput variable as argument. Updates the 'validated' variable on completion.
      if (validated) validated = validateByInputLength({ input: lastNameInput });

      /// 2.4) If Last Name passes (validated = true), proceed to validate the email input via the 'validateByRegex' function. Updates the 'validted' variable on completion.
      if (validated) validated = validateByRegEx({ input: emailInput, regex: emailValidator });

      /// 2.5) If the email input is valid, then proceed to validate the password. Uses the same function, but antother Regular Expression.
      if (validated) validated = validateByRegEx({ input: passwordInput, regex: passwordValidator });
   });

   /// 7) Add an event listenter for all the input fields. Listen to the input event (any change) on any of the input fields. If there's an event (something was typed on the active input) the validation is reset.
   allInputs.forEach((input) =>
      input.addEventListener("input", (e) => {
         if (e) resetValidation({ input });
      })
   );
})();
