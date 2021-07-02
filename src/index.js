const form = document.querySelector('form')
const email = document.getElementById('email')
const country = document.getElementById('country')
const zipCode = document.getElementById('zipCode')
const password = document.getElementById('password')
const passwordConfirm = document.getElementById('passwordConfirm')

function validateElement (validator, element) {
  const result = validator()
  if (result.success) {
    ErrorDOM.removeErrorContainsText(result.keyword)
    element.setCustomValidity('')
  } else {
    ErrorDOM.addNewError(result.errorMessage)
    element.setCustomValidity(result.errorMessage)
  }
}

function emailValidator () {
  if (email.validity.typeMismatch || email.validity.valueMissing) {
    return {
      success: false,
      errorMessage: 'The email must be a valid email.',
      keyword: 'email'
    }
  } else {
    return { success: true, keyword: 'email' }
  }
}

function zipCodeValidator () {
  if (
    zipCode.validity.tooShort ||
    zipCode.validity.tooLong ||
    zipCode.validity.valueMissing
  ) {
    return {
      success: false,
      errorMessage: 'Your zip code must have 5 numbers.',
      keyword: 'zip code'
    }
  }

  if (isNaN(zipCode.value)) {
    return {
      success: false,
      errorMessage: 'Your zip code needs to be numbers only.',
      keyword: 'zip code'
    }
  }

  return { success: true, keyword: 'zip code' }
}

function countryValidator () {
  if (country.validity.valueMissing) {
    return {
      success: false,
      errorMessage: 'You need to enter a country',
      keyword: 'country'
    }
  } else {
    return { success: true, keyword: 'country' }
  }
}

function passwordValidator () {
  if (password.validity.valueMissing) {
    return {
      success: false,
      errorMessage: 'You need to enter password',
      keyword: 'password'
    }
  }

  if (password.value.length < 8) {
    return {
      success: false,
      errorMessage: 'You need to enter at least 8 characters in the password',
      keyword: 'password'
    }
  }
  // call password confirm validator to check status
  validateElement(passwordConfirmValidator, passwordConfirm)
  return { success: true, keyword: 'password' }
}

function passwordConfirmValidator () {
  if (passwordConfirm.validity.valueMissing) {
    return {
      success: false,
      errorMessage: 'You need to enter a password confirmation',
      keyword: 'password confirmation'
    }
  }
  if (password.value !== passwordConfirm.value) {
    return {
      success: false,
      errorMessage:
        'You must enter the same password at password confirmation.',
      keyword: 'password confirmation'
    }
  }

  return { success: true, keyword: 'password confirmation' }
}

function createItem (element, validator) {
  return { element, validator }
}

function addValidatorListener (items) {
  items.forEach(item => {
    item.element.addEventListener('input', () =>
      validateElement(item.validator, item.element)
    )
    item.element.addEventListener('focusout', () =>
      validateElement(item.validator, item.element)
    )
  })
}

function addFormValidator (items) {
  form.addEventListener('submit', event => {
    const canSubmit = items.every(item => {
      const result = item.validator()
      return result.success
    })

    if (!canSubmit) {
      event.preventDefault()
      alert('Invalid form.')
    } else {
      alert('Sending...')
      event.preventDefault()
    }
  })
}

const ErrorDOM = (() => {
  const errors = document.getElementById('errors')

  function addNewError (text) {
    if (containsSameError(text)) return
    const error = document.createElement('li')
    error.textContent = text
    errors.appendChild(error)
  }

  function convertErrosListToArray () {
    return [...errors.children]
  }

  function removeErrorContainsText (text) {
    getErrorsByText(text).forEach(element => element.remove())
  }

  function getErrorsByText (text) {
    return convertErrosListToArray().filter(element =>
      element.textContent.toLowerCase().includes(text.toLowerCase())
    )
  }

  function containsSameError (text) {
    return getErrorsByText(text).length > 0
  }

  return { addNewError, removeErrorContainsText, containsSameError }
})()

const itemsToValidate = [
  createItem(email, emailValidator),
  createItem(zipCode, zipCodeValidator),
  createItem(country, countryValidator),
  createItem(password, passwordValidator),
  createItem(passwordConfirm, passwordConfirmValidator)
]

addFormValidator(itemsToValidate)
addValidatorListener(itemsToValidate)
