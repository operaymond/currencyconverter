
// to do: /  /  dollar signs for every currency 
//               when swapping between select box and spans more than 2 spans are selected / maybe put currency
//              in an array to track it and then can select or deselect it from there. Maybe if array gets 
//              larger than 2, remove the first 2 items and remove their CSS classes. 


// done:    provided daily rate / fixed checker function / fixed second click of span / added external link / 
//          css mods - bold and font size of selected curr spans/ highlight spans when select box index is selected / 
//          initial data object input from API to avoid error / swap select inputs / enlarge selected currencies / 
//          fixed output - removed from span loop /  added currency tag after result /  fixed api data pull to selectbox
//          rather than button. / only allow 2 spans to be selected at one time / 
//           fixed span problem when selecting spans from the select box more than 2 can be selected

let dataRates;
let curr1;
let curr2;
let currInput;
let tempCurr1;
let tempCurr2;
const fetchBase = 'https://api.exchangeratesapi.io/latest?base=';
const initCurr = "EUR";

//array to capture selected spans
currArray = [];


// function to get all currencies from exchange rates API
async function fetchRate(curr) {
    if (curr === undefined) {
        curr = initCurr;
    }
    const res = await fetch(fetchBase + curr);
    const data = await res.json();
    dataRates = data.rates;
    console.log(dataRates);
    console.log(curr + " --base rate");
}


//query selectors
const button = document.querySelector('#convert');
const reset = document.querySelector('#reset');
const select1 = document.querySelector('#startCurr');
const select2 = document.querySelector('#goalCurr');
const outputSym = document.querySelector('#outputSym');
const input = document.querySelector('input');
const reverse = document.querySelector('#reverse');
const converted = document.querySelector('#converted');
const dailyRate = document.querySelector('#dailyRate');
const allSpans = document.querySelectorAll('span');
const output = document.querySelector('#output');
const boldCurr = document.querySelector('.boldCurr');


// page load functionality
input.focus();
button.disabled = true;
reverse.disabled = true;
converted.textContent = "";


//fetch initial data for EUR
fetchRate(initCurr);


//EVENT LISTENERS BUTTONS AND FORMS

//retrieve first currency and call currency function:
select1.addEventListener('change', function (e) {
    curr1 = select1.value;
    console.log(curr1 + " selected");
    fetchRate(curr1);

    for (let span of allSpans) {
        span1 = span;
        if (span.id === tempCurr1 || span.id === tempCurr2) {
            span1.style.fontWeight = 100;
            span1.style.fontSize = "1em";
        }

        if (span1.id === curr1) {
            span1.style.fontWeight = 400;
            span1.style.fontSize = "1.2em";
            currArray.push(curr1);
            tempCurr1 = curr1;
        }
    }

});


//retrieve second currency and select related span
select2.addEventListener('change', function (e) {
    curr2 = select2.value;
    console.log(curr2 + " selected");

    for (let span of allSpans) {
        span2 = span;
        if (span2 === tempCurr2) {
            span2.style.fontWeight = 100;
            span2.style.fontSize = "1em";
        }

        if (span2.id === curr2) {
            span2.style.fontWeight = 400;
            span2.style.fontSize = "1.2em";

            currArray.push(curr2);
            tempCurr2 = curr2;
        }
    }

});


//retrieve number input from user
input.addEventListener('input', function (e) {
    button.disabled = false;
    reverse.disabled = false;
    currInput = input.value;
});


// reset button
reset.addEventListener('click', function (e) {
    e.preventDefault();
    resetApp();
});


// reverse first and second currency
reverse.addEventListener('click', function (e) {
    e.preventDefault();
    let swap1 = select1.selectedIndex;
    let swap2 = select2.selectedIndex;
    select1.selectedIndex = swap2;
    select2.selectedIndex = swap1;
    curr1 = select1.value;
    curr2 = select2.value;
    fetchRate(curr1);
    console.log('reverse currencies function');
    console.log(select1.value + " = curr1");
    console.log(select2.value + " = curr2")
});


//calculate and return converted currency button
button.addEventListener('click', function (e) {
    e.preventDefault();
    selectChecker();


    for (let span of allSpans) {
        span.style.fontWeight = 100;
        span.style.fontSize = "1em";
    }

    for (const [key, value] of Object.entries(dataRates)) {
        if (key === curr2) {
            converted.textContent = "Converted amount:";
            output.textContent = (currInput * value).toFixed(2);
            outputSym.textContent = `${curr2}`;
            dailyRate.textContent = ` 1 ${curr1} = ${value.toFixed(2)} ${curr2}`;
            console.log("------------");
            console.log(`${curr1} --> ${curr2}: ${(currInput * value).toFixed(2)}`);
        }
    }
});


// click currency span to select in drop down menu 
// highlights base currency and goal currency
let timesClicked = 0;

for (let span of allSpans) {
    span.addEventListener('click', function (e) {
        timesClicked++
        if (timesClicked === 1) {
            curr1 = span.id;
            console.log(curr1 + " span clicked");
            select1.value = curr1;
            fetchRate(curr1);
            span.style.fontWeight = 400;
            span.style.fontSize = "1.2em";
            currArray.push(curr1);

        } else if (timesClicked === 2) {
            curr2 = span.id;
            console.log(curr2 + " span clicked");
            select2.value = curr2;
            span.style.fontWeight = 400;
            span.style.fontSize = "1.2em";
            currArray.push(curr2);

        } else if (timesClicked === 3) {
            curr1 = span.id;
            console.log(curr1 + " span clicked");
            select1.value = curr1;
            fetchRate(curr1);

            currArray.push(curr1);
            //clear previous spans
            for (let span of allSpans) {
                span.style.fontWeight = 100;
                span.style.fontSize = "1em";
            }

            span.style.fontWeight = 400;
            span.style.fontSize = "1.2em";
            timesClicked = 1;
        }

    })
};


// reset functionality
function resetApp() {
    button.disabled = true;
    reverse.disabled = true;
    select1.selectedIndex = "0";
    select2.selectedIndex = "0"
    input.value = "";
    currInput = 0;
    timesClicked = 0;
    curr1 = "";
    curr2 = "";
    swap1 = "";
    swap2 = "";
    dataRates = "";
    output.textContent = "";
    dailyRate.textContent = "";
    converted.textContent = "";
    outputSym.textContent = "";
    fetchRate(initCurr);
    input.placeholder = "Enter number here:";
    input.focus();
    console.log('--reset function completed--');

    //reset span font styles
    for (let span of allSpans) {
        span.style.fontWeight = 100;
        span.style.fontSize = "1em";
    }
};


// select check - 
function selectChecker() {
    if (select1.selectedIndex > "0" && select2.selectedIndex > "0") {
        console.log("Select Checker --OK");
    } else {
        converted.textContent = "Please select a currency";
    }
}


//check if input is empty
//currently not needed -- button disabled
function inputChecker() {
    if (input.value === "") {
        console.log('--- Enter number ----');
        input.placeholder = "Please enter a number";
        input.focus();
    }
}



// const fetchEURRate = async () => {
//     const res = await fetch('https://api.exchangeratesapi.io/latest')
//     const data = await res.json();
//     dataRates = data.rates;
//     console.log(dataRates);
// };

// const fetchUSDRate = async () => {
//     const res = await fetch('https://api.exchangeratesapi.io/latest?base=USD')
//     const data = await res.json();
//     dataRates = data.rates;
//     console.log(dataRates);
// };





