const form = document.forms[0];

let elements = document.querySelectorAll("[data-val='true']");

elements.forEach(element => {
    element.addEventListener("change", onChangeHandler);
});

form.addEventListener("submit", onSubmitHandler);

function onChangeHandler(e) {
    const element = e.target;
    if (element.tagName == "INPUT") {
        validateElement(element);
    }
}

function onSubmitHandler(e) {
    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        let valid = validateElement(element);
        if (!valid) {
            e.preventDefault();
        }
    }
}

function validateElement(element) {
    for (const key in validators) {
        if (Object.hasOwnProperty.call(validators, key) && typeof validators[key] == "object") {

            if (element.dataset[key]) {
                const validator = validators[key];
                if (!validator.isValid(element))
                    return false;
            }
        }
    }

    return true;
}

let validators = {};

validators.validate = function (element, message, predicate) {
    let errorLabel = document.querySelector("#" + element.dataset.errorLabel);
    errorLabel.innerHTML = message;
    errorLabel.style.display = "none";
    element.classList.remove("valid");
    element.classList.remove("invalid");

    if (typeof predicate == "function" && predicate()) {
        element.classList.add("valid");
        return true;
    }
    else {
        element.classList.add("invalid");
        errorLabel.style.display = "block";
        return false;
    }
};

validators.required = {
    isValid: function (element) {
        let message = element.dataset.required;
        return validators.validate(element, message, () => element.value.length > 0);
    }
};

validators.pattern = {
    isValid: function (element) {
        let message = "Введенное значение не соответствует шаблону";
        let regex = new RegExp(element.dataset.pattern);
        return validators.validate(element, message, () => regex.test(element.value));
    }
};

validators.confirm = {
    isValid: function (element) {
        let message = "Значения не совпадают";
        let confirmInput = document.querySelector("#" + element.dataset.confirm);
        return validators.validate(element, message, () => element.value == confirmInput.value);
    }
};