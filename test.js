
var tests = [
    testProcessInput,
    testHandleNumberInput,
    testHandleOperatorInput,
    testCalculate,
    testRemoveValue,
    testIsInputComplete,
    testCheckOutput,
    testIsValid,
    testExponentialConversation,
    testCurrencyFormat
];

function startTests() {
    
    var resultsList = document.createElement('ul');
    resultsList.id = 'testResults';
    document.getElementsByTagName('body')[0].appendChild(resultsList);
    
    for(iLoop = 0 ;iLoop < tests.length ; iLoop++ ) {
        var result = tests[iLoop].call();
        var li = document.createElement("li");
        li.innerHTML = tests[iLoop].name +' : '+ (result === true ? "PASSED": result.msg);
        li.className = result === true ? 'passed' : 'failed';
        resultsList.appendChild(li);
    }
}

/*
 * pass() if the test passes this gets executed
 */
function pass(msg) {
    console.log(msg);
    return true;
}

/*
 * fail() if the test fails this gets executed
 */
function fail(msg) {
    console.log(msg);
    return {'result': 'FAILED','msg': msg};
}

/*
 * testProcessInput() tests processInput() with some input values and expected output
 */
function testProcessInput() {
    var temp = processInput('1.');
    if(isNaN(temp)) {
        return fail("Expected value is '1.',but obatined value is "+temp);
    }
    
    var temp = processInput('4');
    if(isNaN(temp)) {
        return fail("Expected value is '4',but obatined value is "+temp);
    }
    
    var temp = processInput('+');
    if(isFinite(temp)) {
        return fail("Expected value is '+',but obatined value is "+temp);
    }
    
    var temp = processInput('.');
    if(isNaN(temp)) {
        return fail("Expected value is '0.',but obatined value is "+temp);
    }
    
    var temp = processInput('25');
    if(isNaN(temp)) {
        return fail("Expected value is '25',but obatined value is "+temp);
    }
    clearAllValue();
    return true;
}
/*
 * testHandleNumberInput() tests handleNumberInput() with some input values and expected output
 */
function testHandleNumberInput() {
    var temp = handleNumberInput('1.');
    if(isNaN(temp)) {
        return fail("Expected value is '1.',but obatined value is "+temp);
    }
    
    var temp = handleNumberInput('25');
    if(isNaN(temp)) {
        return fail("Expected value is '25',but obatined value is "+temp);
    }
    
    var temp = handleNumberInput('+');
    if(temp !== 'INVALID_INPUT_ERROR') {
        return fail("Expected value is 'INVALID_INPUT_ERROR',but obatined value is "+temp);
    }
    
    var temp = handleNumberInput('a');
    if(temp !== 'INVALID_INPUT_ERROR') {
        return fail("Expected value is 'INVALID_INPUT_ERROR',but obatined value is "+temp);
    }
    
    var temp = handleNumberInput('.');
    if(isNaN(temp)) {
        return fail("Expected value is '0.',but obatined value is "+temp);
    }
    clearAllValue();
    return true;
}
/*
 * testHandleOperatorInput() tests handleOperatorInput() with some input values and expected output
 */
function testHandleOperatorInput() {
    var temp = handleOperatorInput('+');
    if(isFinite(temp)) {
        return fail("Expected value is '+',but obatined value is "+temp);
    }
    
    var temp = handleOperatorInput('-');
    if(isFinite(temp)) {
        return fail("Expected value is '25',but obatined value is "+temp);
    }
    
    var temp = handleOperatorInput('a');
    if(temp !== 'INVALID_INPUT_ERROR') {
        return fail("Expected value is 'INVALID_INPUT_ERROR',but obatined value is "+temp);
    }
    
    var temp = handleOperatorInput('.');
    if(temp !== 'INVALID_INPUT_ERROR') {
        return fail("Expected value is 'INVALID_INPUT_ERROR',but obatined value is "+temp);
    }
    
    var temp = handleOperatorInput('4');
    if(temp !== 'INVALID_INPUT_ERROR') {
        return fail("Expected value is 'INVALID_INPUT_ERROR',but obatined value is "+temp);
    }
    clearAllValue();
    return true;
}
/*
 * testCalculate() tests calculate() with some input values and expected output
 */
function testCalculate() {
    var temp = calculate('1','+','3');
    if(temp !== 4) {
        return fail("Expected value is 4,but obatined value is "+temp);
    }
    
    var temp = calculate('1.44','-','.34');
    if(temp !== 1.10) {
        return fail("Expected value is 1.10,but obatined value is "+temp);
    }
    
    var temp = calculate('.2','*','5.2');
    if(temp !== 1.04) {
        return fail("Expected value is 1.04,but obatined value is "+temp);
    }
    
    var temp = calculate('11.4','+','3333333333333333333333');
    if(isNaN(temp)) {
        return fail("Expected value is Number,but obatined value is "+temp);
    }
    
    var temp = calculate('0','/','0');
    if(isFinite(temp)) {
        return fail("Expected value is 'Result is undefined',but obatined value is "+temp);
    }
    clearAllValue();
    return true;
}
/*
 * testRemoveValue() tests removeValue() with some input values and expected output
 */
function testRemoveValue() {
    var temp = removeValue('4321');
    if(temp !== '432') {
        return fail("Expected value is '432',but obatined value is "+temp);
    }
    return true;
}
/*
 * testIsInputComplete() tests isInputComplete() with some input values and expected output
 */
function testIsInputComplete() {
    var isNumberAlreadyPressed = false;
    var temp = isInputComplete(isNumberAlreadyPressed);
    if(temp) {
        return fail("Is the input is complete?"+temp);
    }
    
    var isNumberAlreadyPressed = true;
    var temp = isInputComplete(isNumberAlreadyPressed);
    if(!temp) {
        return fail("Is the input is complete?"+temp);
    }
    return true;
}
/*
 * testCheckOutput() tests checkOutput() with some input values and expected output
 */
function testCheckOutput() {
    var temp = checkOutput(3333);
    if(temp) {
        return fail("Expected output is 'false',but obtained is"+temp);
    }
    
    var temp = checkOutput(Infinity);
    if(!temp) {
        return fail("Expected output is 'Cannot divide by 0',but obtained is"+temp);
    }
    
    var temp = checkOutput(-Infinity);
    if(!temp) {
        return fail("Expected output is 'Cannot divide by 0',but obtained is"+temp);
    }
    
    var temp = checkOutput(NaN);
    if(!temp) {
        return fail("Expected output is 'Result is undefined',but obtained is"+temp);
    }
    clearAllValue();
    return true;
}
/*
 * testIsValid() tests isValid() with some input values and expected output
 */
function testIsValid() {
    var temp = isValid('1');
    if(!temp) {
        return fail("Expected output is true, but obtained is "+ temp);
    }
    
    var temp = isValid('2.45');
    if(!temp) {
        return fail("Expected output is true, but obtained is "+ temp);
    }
    
    var temp = isValid('+');
    if(!temp) {
        return fail("Expected output is true, but obtained is "+ temp);
    }
    
    var temp = isValid('.');
    if(temp) {
        return fail("Expected output is false, but obtained is "+ temp);
    }
    
    var temp = isValid('a');
    if(temp) {
        return fail("Expected output is false, but obtained is "+ temp);
    }
    
    var temp = isValid('1.');
    if(!temp) {
        return fail("Expected output is true, but obtained is "+ temp);
    }
    return true;
}
/*
 * testExponentialConversation() tests exponentialConversion() with some input values and expected output
 */
function testExponentialConversation() {
    var temp = exponentialConversion(47636469723297237872379458);
    if(isNaN(temp)) {
        return fail("Expected output is a Number, but obtained is "+ temp);
    }
    return true;
}
/*
 * testCurrencyFormat() tests currencyFormat() with some input values and expected output
 */
function testCurrencyFormat() {
    var temp = currencyFormat('999');
    if(temp !== '999') {
        return fail("Expected output is a '999', but obtained is "+ temp);
    }
    
    var temp = currencyFormat('11111');
    if(temp !== '11,111') {
        return fail("Expected output is a '11,111', but obtained is "+ temp);
    }
    
    var temp = currencyFormat('1111111');
    if(temp !== '11,11,111') {
        return fail("Expected output is a '11,11,111', but obtained is "+ temp);
    }
    return true;
}