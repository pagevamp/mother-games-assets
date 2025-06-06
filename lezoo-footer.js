


window.addEventListener("load", () => {
  triggerPlayTestPopup();
});
document.addEventListener("DOMContentLoaded", () => {
  loadIframeIfNeeded();
  setReferralSession();
  multistepFormChecking();
  disableDefaultFormSubmission();
  disableSurveyFormSubmission();
  addURLParamsOnPlayTestButton();
  setReferralInButtons();
  navActive();
  triggerHadleMobileClass();
  scrollAddClassOnScroll();
  document.body.classList.add('content-loaded');
});

function lezooCioAnalytics(event) {
  let email = event.target.querySelector('[type="email"]').value;
  if(email != undefined) {
    cioanalytics.identify(email,{
      email: email
    });
  }
}

function normalizeURL() {
  try {
    if (typeof URL !== "function") {

      return;
    }

    const currentURL = new URL(window.location.href);

    if (!currentURL.pathname.endsWith("/")) {
      currentURL.pathname += "/";
      window.history.replaceState({}, "", currentURL.toString());
    }
  } catch (error) {
    console.error("Error normalizing the URL:", error);
  }
}

function setReferralInButtons() {
  let referralData = localStorage.getItem("lezoo_referral");
  if (referralData != 'null') {
    let refButtons = document.querySelectorAll('.dynamic_register__js');
    refButtons.forEach((btn)=>{
      let link = btn.getAttribute('href');
      let linkURL = new URL(link);
      linkURL.searchParams.append('referral', referralData)
      btn.setAttribute('href', linkURL);
    })
  }
}

function setReferralSession() {
  //normalizeURL();
  let referralData = localStorage.getItem("lezoo_referral");

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let value = params.referral;

  referralData = value ? value : referralData;

  localStorage.setItem("lezoo_referral", referralData);
  addHiddenValueInReferral();

  appendReferralToHourseQuizURL(referralData);

}

function addHiddenValueInReferral() {
  let referralData = localStorage.getItem("lezoo_referral");


  if (referralData != 'null') {
    let referralForms = document.querySelectorAll("[name='referral']");
    referralForms.forEach(function (referralForm) {
      referralForm.value = referralData;
    });
  }


}

function appendReferralToHourseQuizURL(referralData) {
  if (window.location.pathname === "/house-quiz" && referralData && referralData != 'null') {
    const url = new URL(window.location.href);

    if (!url.searchParams.has("referral")) {
      url.searchParams.set("referral", referralData);
      window.history.replaceState({}, "", url.toString());
    }
  }
}



function scrollAddClassOnScroll() {
  // Function to handle the scroll event
  var body = document.querySelector("body");
  window.onscroll = function () {
    var scroll = window.scrollY || window.pageYOffset; // Get the current scroll position

    // Check if the scroll position is greater than or equal to 500
    if (scroll >= 100) {
      body.classList.add('change-hamburger');
      body.classList.add('show-menu-overlay');
    } else {
      body.classList.remove('change-hamburger');
      body.classList.remove('show-menu-overlay');
    }
  };
}


// Function to check the screen width and add the class
function handleMobileClass() {
  const headerElement = document.querySelector('.lz-header');
  var body = document.querySelector("body");


  // Check if the device width is 768px or less (considered as mobile)
  if (window.innerWidth <= 768) {
    if (headerElement) {
      headerElement.classList.add('remove-un-con-banner');
      body.classList.add('remove-banner');
    }
  } else {
    // If not mobile, remove the class
    if (headerElement) {
      headerElement.classList.remove('remove-un-con-banner');
      body.classList.remove('remove-banner');
    }
  }
}

function triggerHadleMobileClass() {
  // Run the function after 2 seconds
  setTimeout(handleMobileClass, 1500);

  // Add a debounced resize event listener
  window.addEventListener('resize', debounce(handleMobileClass, 200));
}

function addURLParamsOnPlayTestButton() {
  const playTestButton = document.querySelector('.playtest__js');
  const playTestCloseButton = document.querySelector('.modal1_close-button');
  const outsideModal = document.querySelector('.modal1_background-overlay');

  if (playTestButton) {
    playTestButton.addEventListener('click', (e) => {
      e.preventDefault();

      const url = new URL(window.location.href);
      url.search = ''; // Clear all existing query parameters
      url.searchParams.append('playtest-survey', ''); // Add the playtest-survey parameter
      const newUrl = url.href.replace('=',''); // Remove "=" from the URL

      window.history.pushState({ path: newUrl }, '', newUrl);
    });
  }

  if (playTestCloseButton) {
    playTestCloseButton.addEventListener('click', (e) => {
      const url = new URL(window.location.href);
      url.searchParams.delete('playtest-survey'); // Remove the playtest-survey parameter

      window.history.pushState({ path: url.toString() }, '', url.toString());
    });
  }

  if (outsideModal) {
    outsideModal.addEventListener('click', (e) => {
      const url = new URL(window.location.href);
      url.searchParams.delete('playtest-survey'); // Remove the playtest-survey parameter

      window.history.pushState({ path: url.toString() }, '', url.toString());
    });
  }
}

function triggerPlayTestPopup() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('playtest-survey')) {
    const playTestPopup = document.querySelector('.playtest__js');
    playTestPopup.click();
  }
}

function disableDefaultFormSubmission() {
  setTimeout(() => {
    Webflow.push(() => {
      $(".emailform").submit((evt) => {
        if (evt.target.classList.contains('invalid')) {
          return false;
        }
        lezooCioAnalytics(evt);

        // Fire GA4 event when email is captured
        let referralData = localStorage.getItem("lezoo_referral");
        ga4EventFiring(referralData !== 'null' ? referralData : null);

        evt.preventDefault();

      });
    });
  }, 100);

}

function disableSurveyFormSubmission() {

  if (document.querySelector('.modal-submit-button')) {
    document.querySelector('.modal-submit-button').addEventListener('click', (el) => {
      validateForm(document.querySelector(".survey-form"));

      if (el.target.closest('form').classList.contains('invalid')) {
        return false;
      } else {
        el.currentTarget.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        document.querySelector('.multiform-wrapper').style.display = 'block';
        document.querySelectorAll('.multiform-wrapper .multiform-item')[0].style.display = 'flex';
      }
    });
  }
  setTimeout(() => {
    Webflow.push(() => {
      $(".survey-form").submit((evt) => {

        if (evt.target.classList.contains('invalid')) {
          return false;
        }
        lezooCioAnalytics(evt);

        // Fire GA4 event when email is captured
        let referralData = localStorage.getItem("lezoo_referral");
        ga4EventFiring(referralData !== 'null' ? referralData : null);

        evt.preventDefault();

      });
    });

    Webflow.push(() => {
      $(".leadspace__form").submit((evt) => {

        if (evt.target.classList.contains('invalid')) {
          return false;
        }
        lezooCioAnalytics(evt);

        const urlParams = new URLSearchParams(window.location.search);

        let referralData = localStorage.getItem("lezoo_referral");

        let email = document.querySelector('.leadspace__form-input').value;
        email = encodeURIComponent(email);
        let dataToAppendInIframe = '&email=' + email;
        if (urlParams.has('email')) {
          dataToAppendInIframe = '';
        }

        let iframeElm = document.querySelector('[data-tf-widget="vlZrgMcj"]').querySelector('iframe');
        let getIframeSrc = iframeElm.getAttribute('src');
        if (referralData != 'null') {
          if (urlParams.has('referral')) {
            dataToAppendInIframe = dataToAppendInIframe;
          } else {
            dataToAppendInIframe = dataToAppendInIframe + '&referral=' + referralData;
          }
        }
        let updatedIrameSrc = iframeElm.setAttribute('src', getIframeSrc + dataToAppendInIframe);
      });
    });
  }, 100);



}


// customer.io form
(function () {
  var t = document.createElement('script'),
  s = document.getElementsByTagName('script')[0];
  t.async = true;
  t.id = 'cio-forms-handler';
  //t.setAttribute('data-site-id', '01hyz9mzvqfdagvze6hdw6gxar');
  t.setAttribute('data-site-id', '049b0e4149ea86c9bf5d');
  t.setAttribute('data-base-url', 'https://customerioforms.com');

  t.src = 'https://customerioforms.com/assets/forms.js';

  s.parentNode.insertBefore(t, s);
})();

// Function for ham burger mobile-navigation-opener
var mobtn = document.querySelector(".mobile-navigation-opener");
var body = document.querySelector("body");
var headNavigation = document.querySelector(".header-navigation");

console.log('footer script loaded',mobtn);

if (mobtn) {
  mobtn.addEventListener("click", () => {
    console.log('testing navigation');
    body.classList.toggle('nav-active');
  })
}

var popUpButton = document.querySelector(".mobile-popup-opener");

if (popUpButton) {
  popUpButton.addEventListener("click", () => {
    if (body.classList.contains('nav-active')) {
      body.classList.remove('nav-active');
    }
  });
}


var banner = document.querySelector(".banner10_component");

function bannerExists() {
  if (banner) {
    body.classList.add('banner-exists');
    if (window.matchMedia("(max-width: 479px)").matches) {
      headNavigation.style.paddingTop = banner.clientHeight + 'px';
    } else {
      headNavigation.style.paddingTop = null;
    }
  }
}

bannerExists();


function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}

window.addEventListener("resize", debounce(function (e) {
  bannerExists();
}));

//email-validation

const validateEmail = (email) => {
  return email.match(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validateForm = (form) => {
  let isValidForm = true;

  form.querySelectorAll('.email-field').forEach(input => {

    const result = input.parentElement.querySelector('.result');
    const email = input.value.trim();

    if (email === '') {
      result.textContent = 'Email is required.';
      form.classList.add('invalid');
      form.classList.remove('valid');
      isValidForm = false;
    } else if (validateEmail(email)) {
      result.textContent = email + ' is valid.';
    } else {
      result.textContent = email + ' is invalid.';
      form.classList.add('invalid');
      form.classList.remove('valid');
      isValidForm = false;
    }
  });

  if (isValidForm) {
    form.classList.add('valid');
    form.classList.remove('invalid');
  } else {
    form.classList.add('invalid');
    form.classList.remove('valid');
  }

  return isValidForm;
};

document.querySelectorAll('.emailform').forEach(form => {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm(form)) {
      //  form.submit();
    }
  });
});


var inputForm = document.querySelector('.sign-up-form .email-field');

if (inputForm) {
  inputForm.addEventListener("focus", () => {
    document.body.classList.add('input-fucused');
  });

  inputForm.addEventListener("blur", () => {
    document.body.classList.remove('input-fucused');
  });
}

function multistepFormChecking() {
  setTimeout(() => {
    Webflow.push(() => {
      $(".multiform-email").submit((evt) => {
        //add email to this input field
        document.querySelector('[name="Hidden-Email-4"]').value = document.querySelector(
        '.multiform-email [name="What-is-your-email-2"]').value;
      });
    });
    Webflow.push(() => {
      $(".multistep-form-steps-holder").submit((evt) => {
        //Update dashboardURL with useradded email and name
        if(evt.target.classList.contains('multistep-form-steps-holder')) {
          let dashboardURL = document.querySelector('.multistep-form-success a.text-center').getAttribute('href');
          let email = document.querySelector(
          '.multiform-email [name="What-is-your-email-2"]').value;
          let firstName = document.querySelector(
          '#wf-form-Survey-form [name="First-Name-2"]').value;
          let lastName = document.querySelector(
          '#wf-form-Survey-form [name="Last-Name-2"]').value;
          dashboardURL = dashboardURL + '?email=' + email + '&firstname=' + firstName + '&lastname=' + lastName;

          document.querySelector('.multistep-form-success a.text-center').setAttribute('href', dashboardURL);
        }
        //return false;
        //evt.preventDefault();

      });
    });
  }, 100);

}

$(function () {
  var customSelect = $('.custom-select');

  if (customSelect) {
    // Options for custom Select
    jcf.setOptions('Select', {
      wrapNative: false,
      wrapNativeOnMobile: false,
      fakeDropInBody: false,
      maxVisibleItems: 11
    });

    jcf.replace(customSelect);
  }
});



document.addEventListener('DOMContentLoaded', function() {
  // Use a delay to ensure the DOM is fully loaded before adding the class
  setTimeout(function() {
    if (window.location.pathname.includes('/explore/')) {
      // Find the parent menu link for Blog and add the 'w--current' class
      var parentMenuItems = document.querySelectorAll('a[href="/explore"]');
      if (parentMenuItems) {
        parentMenuItems.forEach((parentMenuItem)=>{
          parentMenuItem.classList.add('w--current');
        });
      }
    }
  }, 100); // Adding a slight delay to ensure everything is loaded before adding the class
});

document.addEventListener('DOMContentLoaded', function() {
  // Use a delay to ensure the DOM is fully loaded before adding the class
  setTimeout(function() {
    if (window.location.pathname.includes('/realms/')) {
      // Find the parent menu link for Blog and add the 'w--current' class
      var parentMenuItems = document.querySelectorAll('a[href="/the-realms"]');
      if (parentMenuItems) {
        parentMenuItems.forEach((parentMenuItem)=>{
          parentMenuItem.classList.add('w--current');
        });
      }
    }
  }, 100); // Adding a slight delay to ensure everything is loaded before adding the class
});


document.addEventListener('DOMContentLoaded', function() {
  // Use a delay to ensure the DOM is fully loaded before adding the class
  setTimeout(function() {
    if (window.location.pathname.includes('/guides/')) {
      // Find the parent menu link for Blog and add the 'w--current' class
      var parentMenuItems = document.querySelectorAll('a[href="/guides/pan"].lz-nav-link, a[href="/guides/pan"].footer-menu-item, a[href="/guides/pan"].text-color-white-5');
      if (parentMenuItems) {
        parentMenuItems.forEach((parentMenuItem)=>{
          parentMenuItem.classList.add('w--current');
        });
      }
    }
  }, 100); // Adding a slight delay to ensure everything is loaded before adding the class
});

var header = document.querySelector(".firstpaid-header");
if( header ) {
  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) { // Adjust scroll position to trigger color change
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iPhone";
  }
  return "Other";
}

document.addEventListener("DOMContentLoaded", async () => {
  const countryField = document.querySelector("#Country-3");
  countryField.value = "United States";

  const stateField = document.querySelector("#state");
  const cityField = document.querySelector("#city");
  const cityInput = document.querySelector("#CityInput"); // Input for non-US state
  const regionInput = document.querySelector("#RegionInput"); // Input for non-US state

  const deviceType = detectDevice();

  let tomSelectStateInit;
  let tomSelectCityInit;

  const apiHeaders = {
    "X-Parse-Application-Id": "RFzQyxsqUpdY6HSsMrERNuQLMiJfTooiLTv5AarV",
    "X-Parse-REST-API-Key": "qI4JwRc8HR8P0IOv0NztH4KkPEPDjNIajDnChFl4",
  };

  // Helper function to populate the state dropdown
  function populateStateDropdown(dropdown, states) {
    if( ! dropdown ) {
      return;
    }

    dropdown.innerHTML = `<option value="">Select State...</option>`; // Reset options
    states.forEach((state) => {
      if (state.name && state.postalAbreviation) {
        const option = document.createElement("option");
        option.value = state.postalAbreviation;
        option.textContent = state.name;
        dropdown.appendChild(option);
      }
    });

    if( deviceType == 'iPhone' ) {
      // Re-initialize the TomSelect on the dropdown
      tomSelectStateInit = new TomSelect(dropdown, {
        create: false,
        placeholder: "Select State...",
        plugins: ["remove_button"],
        maxItems: 1, // Disable multi-select
        maxOptions: 9000,
      });
    } else {
      tomSelectStateInit = NiceSelect.bind(dropdown, { searchable: false, placeholder: 'Select State...' });
    }

  }

  // Event listener for Country selection
  countryField.addEventListener("change", async () => {
    const selectedCountry = countryField.value;

    if (selectedCountry === "United States") {

      cityField.style.display = "none";
      cityField.required = false;

      cityInput.style.display = "none";
      cityInput.required = false;

      regionInput.style.display = "none";
      regionInput.required = false;

      // Fetch and populate states
      const states = await fetch("https://parseapi.back4app.com/classes/States", {
        headers: apiHeaders,
      }).then((res) => res.json());

      if (states && states.results) {
        populateStateDropdown(stateField, states.results);
        stateField.style.display = "block";
        stateField.required = true;
      }
    } else {
      // If the selected country is not the United States

      cityInput.style.display = "block";
      cityInput.required = true;

      regionInput.style.display = "block";
      regionInput.required = false; // Region is not required.

      stateField.style.display = "none";
      stateField.required = false;
      if (tomSelectStateInit) {
        tomSelectStateInit.destroy();
      }

      cityField.style.display = "none";
      cityField.required = false;
      if (tomSelectCityInit && tomSelectCityInit != null) {
        tomSelectCityInit.destroy();
      }
    }
  });

  // Event listener for State selection
  if( stateField) {
    stateField.addEventListener("change", async () => {
      const selectedStateAbbr = stateField.value;

      // If the state is empty, hide the city dropdown
      if (!selectedStateAbbr) {
        cityField.style.display = "none";
        cityField.required = false;
        if (tomSelectCityInit) {
          tomSelectCityInit.destroy();
        }
        return;
      }

      if (selectedStateAbbr) {
        // Fetch and populate cities using the postal abbreviation
        const cities = await fetch(
        `https://parseapi.back4app.com/classes/${selectedStateAbbr}?limit=9000`,
        { headers: apiHeaders }
        ).then((res) => res.json());

        if (cities && cities.results) {
          populateCityDropdown(cityField, cities.results);
        }
      }
    });
  }

  // Helper function to populate the city dropdown
  function populateCityDropdown(dropdown, cities) {
    if(!dropdown) {
      return; // Ensure dropdown exists before manipulating
    }

    let dropdownNext;
    if( deviceType == 'iPhone' ) {
      dropdownNext = document.querySelector('#city ~ .ts-wrapper');
    } else {
      dropdownNext = document.querySelector('#city ~ .nice-select');
    }


    if (dropdownNext) {
      tomSelectCityInit.destroy();
    }

    dropdown.innerHTML = `<option value="">Select City...</option>`; // Reset options
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.name;
      option.textContent = city.name;
      dropdown.appendChild(option);
    });

    // Re-initialize the TomSelect on the dropdown
    if( deviceType == 'iPhone' ) {
      tomSelectCityInit = new TomSelect(dropdown, {
        create: false,
        placeholder: "Select City...",
        plugins: ["remove_button"],
        maxItems: 1, // Disable multi-select
        maxOptions: 9000, // Adjust the max options displayed in the dropdown
      });
    } else {
      tomSelectCityInit = NiceSelect.bind(dropdown, { searchable: false, placeholder: 'Select City...' });
    }

    cityField.style.display = "block";
    cityField.required = true;

  }
});

function loadIframeIfNeeded() {
  const storedReferralCode = localStorage.getItem("lezoo_referral");
  const url = new URL(window.location.href);
  const referralCode = url.searchParams.get("referral");
  const emailParam = url.searchParams.get("email");

  if (emailParam) {
    return;
  }

  if (referralCode && referralCode !== storedReferralCode) {
    localStorage.setItem("lezoo_referral", referralCode);

    const iframe = document.createElement("iframe");
    iframe.src = `https://account.mothergames.com/check-auth?referral=${encodeURIComponent(referralCode)}`;
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.opacity = "0";
    iframe.style.border = "none";
    iframe.style.position = "absolute";

    const iframeContainer = document.getElementById("iframe-hidden");
    if (iframeContainer) {
      iframeContainer.appendChild(iframe);
    }
  }
}


window.addEventListener("message", function (event) {
  let referralData = localStorage.getItem("lezoo_referral");
  if (event.data?.type === "form-submit") {
    ga4EventFiring(referralData !== 'null' ? referralData : null);
  }
});

function ga4EventFiring(referralCode = null) {
  window.dataLayer = window.dataLayer || [];
  const eventData = { event: 'email_captured' };
  if (referralCode) {
    eventData.referral_code = referralCode;
  }
  window.dataLayer.push(eventData);
}

function ga4FormClickEvent(formClass) {
  window.dataLayer = window.dataLayer || [];
  const eventData = { event: 'form_click', form_class: formClass };
  window.dataLayer.push(eventData);
}

// Keep track of which forms were clicked (avoid duplicate firing)
const formsClicked = new WeakSet();

// List of form class names
const formClasses = [
"leadspace-form",
"playtest-email-form",
"playtest-complete-form",
"referral-form"
];

formClasses.forEach(className => {
  const forms = document.querySelectorAll(`form.${className}`);

  forms.forEach(form => {
    form.addEventListener('click', () => {
      if (formsClicked.has(form)) return;

      formsClicked.add(form);

      ga4FormClickEvent(className);

      const customEvent = new CustomEvent('form-click', {
        detail: { formName: className },
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(customEvent);
    });
  });
});

//  On click hamburger add active class to body
function navActive() {
  console.log('first')
  // Function for ham burger mobile-navigation-opener
  var mobtn = document.querySelector(".lz-mobile-navigation-opener");
  var body = document.querySelector("body");
  if (mobtn) {
    mobtn.addEventListener("click", () => {
      body.classList.toggle('nav-active');
      body.classList.toggle('overflow-hidden');
    })
  }
}
