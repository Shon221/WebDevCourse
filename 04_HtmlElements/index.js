document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1, txt2, btn, lblRes;
let op;

function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.getElementById("txt2");
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");

    btn.addEventListener("click", () => {
        calculate();
    });
    lblRes = document.getElementById("lblRes");

    op = document.getElementById("op");
    txt1.addEventListener("input", () => validateInput(txt1));
    txt2.addEventListener("input", () => validateInput(txt2));



}

function calculate() {
    let num1 = Number(txt1.value);
    let num2 = Number(txt2.value);

    if (isNaN(num1) || isNaN(num2)) {
        lblRes.innerText = "Error";
        print(`❗ Error: one or more values are not numeric`, true);
        return;
    }

    let res = 0;
    let opSymbol = "";

    switch (op.value) {
        case "plus":
            res = num1 + num2;
            opSymbol = "+";
            break;

        case "minus":
            res = num1 - num2;
            opSymbol = "-";
            break;

        case "mul":
            res = num1 * num2;
            opSymbol = "*";
            break;

        case "div":
            if (num2 === 0) {
                lblRes.innerText = "Error";
                print(`❗ Error: division by zero — operation: ${num1} / ${num2}`, true);
                return;
            }
            res = num1 / num2;
            opSymbol = "/";
            break;
    }

    lblRes.innerText = res;

    print(`Operation: ${num1} ${opSymbol} ${num2} = ${res}`, true);
}


const btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => {
    print("btn2 clicked :" + btn2.id + "\n" + btn2.innerText);
});



//btn2.addEventListener("click", func1)
//function func1() {
//    alert("Button 2 clicked - func1");
//}

function print(msg, append) {
    const ta = document.getElementById("output");
    if (!ta) return;

    if (append)
        ta.value += msg + "\n";
    else
        ta.value = msg + "\n";
}



function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) {
        return fn(a, b);
    }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    print(out);
}

function validateInput(inputElement) {
    if (!inputElement.value || isNaN(inputElement.value)) {
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
    } else {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
    }
}
