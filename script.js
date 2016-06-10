// Global memory variable to store the previously inputted values until = is entered
var memory = '';
// Global variable to store the result of previous 2 operands and an operator 
var leftOperand = '';
// Global variable to hold the continues input of numbers until an operator or = is entered
var rightOperand = '0';
// Global variable to store the current operator 
var operator = '';
// Global variable to count number of digits in Input number, and also to restrict input when limit(12) exceeds 
var digitCount = 0;
// Global variable to monitor output value and sets, if output is infinity or -infinity
var infinite = false;
// Global variable to monitor equal key (or) button pressed or not
var isEqualPressed = false;
// Global variable to monitor dot operator and restrict more than one dot operator 
var dotOperatorPressed = false;
// Global variable that sets to true, if number is continuously pressed as input 
var isNumberAlreadyPressed = false;
// Global variable used to restrict the operator from being entered twice
var isOperatorPressed = false;

/*
 * Onload function, which does the following,
 *  Set the calculator main display as 0
 *  Add keypress event to main textbox to prevent the alphabets and allow only numbers to enter
 *  Add keydown to catch backspace and enter keys to main textbox
 *  Listen to button clicks from html, derive the value and delegate to process
 */
window.onload = function() {
    // Set the calculator main display as 0
    display(rightOperand);
    // Add keypress event to main textbox to prevent the alphabets and allow only numbers to enter
    document.getElementById("mainDisplay").addEventListener("keypress", function(event) {
        event.preventDefault();
        processInput(String.fromCharCode(event.keyCode));
    });
    // Add keydown to catch backspace and enter keys to main textbox
    document.getElementById("mainDisplay").addEventListener("keydown", function(event) {
        handleKeyDown(event);
    });
    // Listen to button clicks from html, derive the value and delegate to process
    var selector = document.querySelectorAll(".buttons");
    for(iLoop = 0; iLoop < selector.length; iLoop++) {
        selector[iLoop].addEventListener("click", function(event) {
            value = event.target.value;
            processInput(value);
        });
    }
};

/*
 * Function to handle keydown event of main textbox and delegate it to process
 * There is no way to catch backspace with keypress event, so keydown is used to catch
 * and delegate the input to process
 */
function handleKeyDown(event) {
  value = "";
  //Set the value as 'Delete' for backspace key press
  if(event.keyCode === 8 || event.keyCode === 46) {
    value = "Del";
    event.preventDefault();
  }
  //Set the value as = to get the answer for enter key press
  if(event.keyCode === 13) {
    value = "=";
    event.preventDefault();
  }
  //Call process if backspace or enter key is pressed
  if(value !== "" && value !== undefined) {
    processInput(value);
  }
}

/*
 * Function to process the given input value, calculates the output and display's the result
 */
function processInput(value) {
    // Checking whether the input is valid or not, if valid it is allowed otherwise it is restricted
    if((isValid(value) || (value === '.' && !dotOperatorPressed)) && !infinite) {
        if(isNumber(value) && digitCount < 12 || value === '.'){
            // If entered value is a number this block gets executed
            digitCount++;
            handleNumberInput(value);
            isNumberAlreadyPressed = true;
            isOperatorPressed = false;
            return rightOperand;
        } else if((isOperator(value) && !isOperatorPressed) || (isOperatorPressed && operator !== value)) {
            // if entered value is an operator this block gets executed
            digitCount = 0;
            handleOperatorInput(value);
            isOperatorPressed = true;
            isNumberAlreadyPressed = false;
            return operator;
        } 
    } else {
        // if functional keys are pressed as input, function gets called
        handleOtherInput(value);
    } 
}
/*
 * Function to handle =,AC,Del,prev,next buttons and delegate the input to process
 * If these buttons gets clicked, respective method gets called
 */
function handleOtherInput(value) {
    switch(value) {
            case '=':
                // if equal key (or)button or enter key is pressed this block gets executed
                leftOperand = calculate(leftOperand, operator, rightOperand);
                clearMemoryDisplay();
                break;
            case 'AC':
                // if AC button is clicked, this block executes 
                clearAllValue();
                break;
            case 'Del':
                // if delete button (or) key is pressed it deletes a digit
                if(!infinite && !isOperatorPressed) {
                    rightOperand = removeValue(rightOperand);
                }
                break;
            case 'Prev':
                alert('This Feature is not implemented');
                break;
            case 'Next':
                alert('This Feature is not implemented');
                break;
        }
}
/*
 * Function to handle number input, both integers and float values
 * This function prevents continuous '0' at the begining
 */
function handleNumberInput(value) {
    // Validate the currentNumber number does not have more than one decimal places
    if(value === '.') {
        dotOperatorPressed = true;
    } else if(!isNumber(value)) {
        return 'INVALID_INPUT_ERROR';
    }
    //if the number entered is a second digit of the value this block executes
    if(isNumberAlreadyPressed) {
        if( rightOperand === '0' && value !== '') {
            // if continuously 0 is entered it is restricted
            rightOperand = value;
        } else {
            // if entered value is second digit this code enters the value
            rightOperand += value;
        }
    } else {
        // if the number entered is a single digit number or first digit of the value this block gets executed
        if(value === '.') {
            // if first value is '.' this code executes
            rightOperand = '0.';
        } else {
            rightOperand = value;
        }
    } 
    // To format the input as comma seperated values
    var formattedNumber = currencyFormat(rightOperand);
    display(formattedNumber);
    return rightOperand;
    
}

/*
 * showOperatorInDisplay() adds leftOperand and operator value to the Memory display 
 */
function handleOperatorInput(value) {
    if(!isOperator(value)) {
        return 'INVALID_INPUT_ERROR';
    }
    // If there is any change in operator this block fail to execute
    if(isOperatorPressed === false ) {
        // First number of calculation is entered this block of code gets executed
        if(operator === '') {
            leftOperand = rightOperand;
            pushToMemory(leftOperand);
        } else {
            // if operator is continuously given followed by operand the result gets calculated
            leftOperand = calculate(leftOperand, operator, rightOperand);
            pushToMemory(rightOperand);
        }
    } else {
        // If the previous value is also an operator, replace the last value of the memory as the given operator
        memory = replaceLastOperatorInMemory(memory);
    }
    operator = value;
    // push the value to memory
    pushToMemory(operator);
    isEqualPressed = false;
    dotOperatorPressed = false;
    return operator;
}
/*
 * Function to push the input value to the memory
 */
function pushToMemory(value) {
    memory += value;
    memoryDisplay(memory);
}
/*
 * calculate() calculates the result for the given input
 */
function calculate(leftOperand, operator, rightOperand) {
    if(!isEqualPressed && !infinite) {
        leftOperand = eval(leftOperand + operator + rightOperand);
        // if the output is decimal value this block rounds off value to 4 digits
        if(leftOperand % 1 !== 0) {
            leftOperand = Math.round(leftOperand * 10000) / 10000;
            dotOperatorPressed = true;
        }
        isInputComplete(isNumberAlreadyPressed) ? display(currencyFormat(leftOperand)) : display(leftOperand); 
        isNumberAlreadyPressed = false;
        isOperatorPressed = false;
    }
    // check whether the output is valid or not
    checkOutput(leftOperand);
    // convert the output to exponential form if it exceeds 12 digits
    exponentialConversion(leftOperand);
    return leftOperand;
}

function isInputComplete(value){
    // In Input there is no operand after an operator, the output is set to 0
    if(!value) {
        leftOperand = '0';
        return false;
    } else {
        // if rightOperand is available output is calculated and sent for currency format conversation  
        return true;
    }
}
/*
 * chekOutputIsValid() checks whether the output is Valid or Not
 * If the calculation is not possible with certain numbers, this function returns true and prevents the calculation
 */
function checkOutput(value) {
    // Any number divided by 0, this block gets executed
    if (value === Infinity || value === -Infinity) {
        display('Cannot divide by 0');
        infinite = true;
        return true;
    } else if(isNaN(value) === true) {
        // if 0 is divided by 0, this code executes
        display('Result is undefined');
        infinite = true;
        return true;
    }
    return false;
}

/*
 * Function to convert the output to exponential form if it exceeds 12 digits
 * More than 12 digits is not visible in calculator display so output exceeds 12 digits is coverted to exponential form
 */
function exponentialConversion(value) {
    if(value.toString().length > 12 && value !== Infinity && !infinite) {
        var exponentialNumber = value.toExponential(6);
        var x = exponentialNumber.split('e');
        var x1 = x[0];
        var x2 = x.length > 1 ? 'e' + x[1] : '';
        x1 = Math.round(x1 * 100000) / 100000;
        exponentialNumber = x1 + x2;
        display(exponentialNumber);
        return exponentialNumber;
    }
}

/*
 * formatNumber() formats the input and output into currency formatted values
 * To display the input and output in a readable manner, i.e., indian currency format is used
 * @param {type} num
 * @returns x1 + x2
 */
function currencyFormat(num) {
  nStr = num + '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  var z = 0;
  var len = String(x1).length;
  var num = parseInt((len/2) - 1);

  while (rgx.test(x1)) {
    if(z > 0) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    else {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
      rgx = /(\d+)(\d{2})/;
    }
    z++;
    num--;
    if(num === 0) {
      break;
    }
  }
  return x1 + x2;
}

/*
 * Function to replace the last value of the given string
 * @returns value
 */
function replaceLastOperatorInMemory(value) {
    value = value.substring(0, value.length - 1);
    memoryDisplay(value);
    return value;
}

/*
 * Function to check the given input is valid or not
 * @returns true/false
 */
function isValid(value) {
    return isNumber(value) || isOperator(value);
}

/*
 * Function to check the given value is number or not
 * @returns true/false
 */
function isNumber(value) {
    return isFinite(value);
}

/*
 * Function to check the given value is a operator
 * The operators are, Addition  +, Substraction -, Multiplication *, Division /
 * @returns true/false
 */
function isOperator(value) {
    return (value === '+' || value === '-' || value === '*' || value === '/');
}

/*
 * Function to delete a digit from main Display
 * @param {type} value
 * @returns value
 */
function removeValue(value) {
    value = value.substring(0, value.length - 1);
    if(value === '') {
        display(0);
    } else {
        var formattedNumber = currencyFormat(value);
        display(formattedNumber);
    }
    digitCount--;
    return value;
}

/*
 * Function to display present value and result value
 */
function display(value) {
        var display = document.getElementById("mainDisplay");
        display.value = value;
}

/*
 * Function to display history values
 */
function memoryDisplay(value) {
    var memoryDisplay = document.getElementById("memoryDisplay");
    memoryDisplay.value = value;
}

/*
 * Function to clear inMemoryDisplay value, if equal is clicked and infinite is not set to true
 * It clears the operator
 */
function clearMemoryDisplay() {
    isEqualPressed = true;
    digitCount = 0;
    if(!infinite) {
        memoryDisplay('');
        operator = '';
        memory = '';
        rightOperand = leftOperand;
    }
}

/*
 * Function to reset all the values to default
 */
function clearAllValue() {
    memoryDisplay('');
    display(0);
    memory = '';
    leftOperand = '';
    rightOperand = '0';
    operator = '';
    digitCount = 0;
    infinite = false;
    isNumberAlreadyPressed = false;
    isOperatorPressed = false;
    isEqualPressed = false;
    dotOperatorPressed = false;
}