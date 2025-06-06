

  const emailInput = document.getElementById('What-is-your-email-2');
  const submitButton = document.querySelector('.modal-submit-button');

  // Function to toggle the submit button state
  function toggleSubmitButton() {
    if (emailInput.value.trim() === '') {
      submitButton.classList.add('disabled');
      submitButton.setAttribute('disabled', 'true');
    } else {
      submitButton.classList.remove('disabled');
      submitButton.removeAttribute('disabled');
    }
  }

  // Initial setup to disable the submit button
  submitButton.classList.add('disabled');
  submitButton.setAttribute('disabled', 'true');

  // Event listener for email input field
  emailInput.addEventListener('input', toggleSubmitButton);

  // Function to toggle visibility of dropdowns based on selected radio button
  function togglePhoneOSFields() {
    const phoneOSContainer = document.querySelector('.have-checkbox-condition');
    const iphoneDropdown = phoneOSContainer.querySelector('.multiform-item-iphone');
    const androidDropdown = phoneOSContainer.querySelector('.multiform-item-android');

    const selectedOS = phoneOSContainer.querySelector('input[name="Phone-OS"]:checked');

    if (selectedOS) {
      const selectedValue = selectedOS.value;
      if (selectedValue === 'iPhone') {
        iphoneDropdown.style.display = 'block';
        androidDropdown.style.display = 'none';
      } else if (selectedValue === 'Android') {
        iphoneDropdown.style.display = 'none';
        androidDropdown.style.display = 'block';
      } else {
        iphoneDropdown.style.display = 'none';
        androidDropdown.style.display = 'none';
      }
    } else {
      iphoneDropdown.style.display = 'none';
      androidDropdown.style.display = 'none';
    }
    updateNextButton(phoneOSContainer);
  }

  function validatePhoneOSFields() {
    const phoneOSContainer = document.querySelector('.have-checkbox-condition');
    const iphoneDropdown = phoneOSContainer.querySelector('.multiform-item-iphone select');
    const androidDropdown = phoneOSContainer.querySelector('.multiform-item-android select');
    const selectedOS = phoneOSContainer.querySelector('input[name="Phone-OS"]:checked');

    if (selectedOS) {
      const selectedValue = selectedOS.value;
      if (selectedValue === 'iPhone') {
        return iphoneDropdown.value.trim() !== '';
      } else if (selectedValue === 'Android') {
        return androidDropdown.value.trim() !== '';
      }
    }
    return true;
  }

  document.querySelectorAll('input[name="Phone-OS"]').forEach(radio => {
    radio.addEventListener('change', () => {
      togglePhoneOSFields();
    });
  });

  function validateForm(container) {
    const requiredFields = container.querySelectorAll('[required]');
    const requiredType = container.dataset.required;
    let allValid = true;
    let anyFieldFilled = false;

    if (requiredType === 'all-fields') {
      requiredFields.forEach(field => {
        if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) {
          allValid = false;
        } else if (field.value.trim() === '') {
          allValid = false;
        }
      });
      return allValid;
    } else if (requiredType === 'one-field') {
      const inputs = container.querySelectorAll('input[type="text"], input[type="checkbox"], input[type="radio"], select');
      inputs.forEach(input => {
        if ((input.type === 'checkbox' || input.type === 'radio') && input.checked) {
          anyFieldFilled = true;
        } else if (input.type === 'text' && input.value.trim() !== '') {
          anyFieldFilled = true;
        } else if (input.tagName === 'SELECT' && input.value !== '') {
          anyFieldFilled = true;
        }
      });
      return anyFieldFilled;
    } else if (requiredType === 'checkboxes') {
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      let checkedCount = 0;

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          checkedCount++;
        }
      });
      return checkedCount >= 1;
    } else {
      return false;
    }
  }

  function updateNextButton(container) {
    const nextButton = container.querySelector('.bg-next-btn-js');
    if (validateForm(container) && validatePhoneOSFields()) {
    	if( nextButton ) {
        nextButton.removeAttribute('disabled');
        nextButton.classList.remove('disabled');
        nextButton.classList.add('active'); // Add 'active' class
      }
    } else {
    	if( nextButton ) {
        nextButton.setAttribute('disabled', 'disabled');
        nextButton.classList.add('disabled');
        nextButton.classList.remove('active'); // Remove 'active' class
      }
    }
  }

  document.querySelectorAll('.bg-next-btn-js').forEach((el) => {
    el.addEventListener('click', (element) => {
      const container = element.currentTarget.closest('.multiform-item');
      if (validateForm(container) && validatePhoneOSFields()) {
        const indexNumber = nextStep(element, 'next');
        const nextStepElement = document.querySelectorAll('.multiform-item')[indexNumber + 1];
        if (nextStepElement) {
          nextStepElement.style.display = 'flex';
        }
      }
    });
  });

  document.querySelectorAll('.bg-back-btn-js').forEach((el, key) => {
    if (key === 0) {
      el.addEventListener('click', () => {
        el.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        document.querySelector('.multiform-email').style.display = 'block';
      });
    }
    el.addEventListener('click', (element) => {
      const indexNumber = nextStep(element, 'prev');
      const previousStepElement = document.querySelectorAll('.multiform-item')[indexNumber - 1];
      if (previousStepElement) {
        previousStepElement.style.display = 'flex';
      }
    });
  });

  function nextStep(element, btnType) {
    const parentElement = element.currentTarget.closest('.multiform-item');
    const allParents = Array.from(document.querySelectorAll('.multiform-item'));
    const index = allParents.indexOf(parentElement);
    parentElement.style.display = 'none';
    return index;
  }

  document.querySelectorAll('input[name="Phone-OS"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const container = radio.closest('.multiform-item');
      const phoneOSContainer = radio.closest('.have-checkbox-condition');
      const iphoneHolder = phoneOSContainer.querySelector('.multiform-item-iphone');
      const androidHolder = phoneOSContainer.querySelector('.multiform-item-android');

      if (radio.checked) {
        const selectedValue = radio.value;
        if (selectedValue === "iPhone") {
          iphoneHolder.style.display = 'block';
          iphoneHolder.querySelector('select').setAttribute('required', 'true');
          androidHolder.style.display = 'none';
          androidHolder.querySelector('select').removeAttribute('required');
        } else if (selectedValue === "Android") {
          androidHolder.style.display = 'block';
          androidHolder.querySelector('select').setAttribute('required', 'true');
          iphoneHolder.style.display = 'none';
          iphoneHolder.querySelector('select').removeAttribute('required');
        }
      }
      updateNextButton(container);
    });
  });

  const earliestGameDevelopmentStage = document.querySelector('#Earliest-Game-Development-Stage');
  const earliestGameDevelopmentStageWrapper = document.querySelector('.earliest-select-container-wrapper');

  const gameTestField = document.querySelector('.multiform-item-game-test');
  NiceSelect.bind(document.querySelector("#Earliest-Game-Development-Stage"));

  if (earliestGameDevelopmentStageWrapper) {
    earliestGameDevelopmentStageWrapper.style.display = 'none'; // Hide the dropdown
  }

  let findSelectGame = setInterval(function() {
    const selectElement = document.querySelector('.nice-select.earliest-game-development-stage');
    if (selectElement) {
        selectElement.style.display = 'none';
        clearInterval(findSelectGame);
    }
}, 100);


  if (gameTestField) {
    gameTestField.style.display = 'none'; // Hide the text input container
  }

// Handle radio button changes
document.querySelectorAll('input[name="playtested-an-unfinished-game"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const unfinishedGameContainer = radio.closest('.have--radio');
        const earliestGameDevelopmentStage = unfinishedGameContainer.querySelector('#Earliest-Game-Development-Stage'); // Select dropdown
        const gameTestField = unfinishedGameContainer.querySelector('.multiform-item-game-test'); // Text input container

        console.log('Radio changed:', radio.value);

        if (radio.checked) {
            const selectedValue = radio.value;

            if (selectedValue === "Yes") {
                earliestGameDevelopmentStageWrapper.style.display = 'block'; // Show the select dropdown
                earliestGameDevelopmentStage.required = true; // Make it required
    					document.querySelector('.nice-select.earliest-game-development-stage').style.display = 'block';
            } else {
                // Hide and reset the select dropdown and dependent field
                earliestGameDevelopmentStageWrapper.style.display = 'none';
    						document.querySelector('.nice-select.earliest-game-development-stage').style.display = 'none';
                earliestGameDevelopmentStage.value = ""; // Reset select value
                earliestGameDevelopmentStage.required = false;

                gameTestField.style.display = 'none';
                const gameTestInput = gameTestField.querySelector('input');
                gameTestInput.value = ""; // Reset the text input value
                gameTestInput.required = false;
            }
        }

        updateNextButton(unfinishedGameContainer); // Custom function to enable/disable the "Next" button
    });
});

// Handle dropdown changes
document.querySelector('#Earliest-Game-Development-Stage').addEventListener('change', (event) => {
    const alphaQuestionValue = event.target.value;
    const gameTestField = document.querySelector('.multiform-item-game-test');
    const gameTestInput = gameTestField.querySelector('input');

    console.log('Dropdown changed:', alphaQuestionValue);

    if (alphaQuestionValue !== "") {
        gameTestField.style.display = 'block'; // Show the text input field
        gameTestInput.required = true; // Make the text input required
    } else {
        gameTestField.style.display = 'none'; // Hide the text input field
        gameTestInput.value = ""; // Reset the text input value
        gameTestInput.required = false; // Remove required attribute
    }
});


document.querySelectorAll('input[required], textarea, select[required]').forEach(input => {
input.addEventListener('input', () => {
    const container = input.closest('.multiform-item');
    updateNextButton(container);
});
});

document.querySelectorAll('.multiform-item.have--checkbox').forEach(container => {
container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
    updateNextButton(container);
    });
});
});

document.querySelectorAll('.multiform-item.have--radio').forEach(radio => {
radio.addEventListener('change', () => {
    const container = radio.closest('.multiform-item');
    updateNextButton(container);
});
});

document.querySelectorAll('.multiform-item.have--social-media input').forEach(input => {
input.addEventListener('input', () => {
    const container = input.closest('.multiform-item');
    updateNextButton(container);
});
});

document.querySelectorAll('.multiform-item.have--social-media input[type="checkbox"]').forEach(checkbox => {
checkbox.addEventListener('change', () => {
    const container = checkbox.closest('.multiform-item');
    updateNextButton(container);
});
});

document.querySelectorAll('.multiform-item.single-input select').forEach(select => {
select.addEventListener('change', () => {
    const container = select.closest('.multiform-item');
    updateNextButton(container);
});
});

document.querySelectorAll('.multiform-item.agreement input[type="checkbox"]').forEach(checkbox => {
checkbox.addEventListener('change', () => {
    const lastSubmitButton = document.querySelector('.last-submit-button');
    if( checkbox.checked ) {
    lastSubmitButton.classList.remove('disabled');
    lastSubmitButton.classList.add('active');
    } else {
    lastSubmitButton.classList.remove('active');
    lastSubmitButton.classList.add('disabled');
    }
});
});
