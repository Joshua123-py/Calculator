// Calculator code
const keyboardToggle = document.getElementById("buttons-toggle");

keyboardToggle.addEventListener("change", function () {

    const calculatorButtons =
        document.querySelectorAll("#calculator button");

    calculatorButtons.forEach(function (button) {
        button.disabled = !keyboardToggle.checked;
    });

    document.body.classList.toggle(
        "keyboard-only",
        !keyboardToggle.checked
    );
});
const calculator = document.getElementById('calculator');
function playClick() {
    const sound = new Audio('click.mp3');
    if (!soundEffectsEnabled) return;
    sound.volume = 1.0;
    sound.play();
}
function playBeep() {
    const sound = new Audio('beep.mp3');
    if (!soundEffectsEnabled) return;
    sound.volume = 1.0;
    sound.play();
}
function playSwoosh() {
    const sound = new Audio('swoosh.mp3');
    if (!soundEffectsEnabled) return;
    sound.volume = 1.0;
    sound.play();
}
const display = document.getElementById('display');
function copyToClipboard() {
    let content = document.getElementById("display").value;

    if (content === "Error") {
        Swal.fire({
            icon: error,
            toast: true,
            position: 'top-end',
            title: 'Error',
            text: "Cannot copy 'Error' message.",
            timer: 1500,
            showConfirmButton: false,
        })
        return;
    } 
    else if (content === "") {
        console.log("User attempted to copy nothing! What an idiot.");
        return;
    }

    navigator.clipboard.writeText(content)
        .then(() => {

            Swal.fire({
                icon: 'success',
                toast: true,
                position: 'top-end',
                title: 'Copied!',
                text: 'Copied to clipboard.',
                timer: 1500,
                showConfirmButton: false,

                customClass: {
                    popup: document.body.classList.contains("dark-mode")
                        ? "dark-swal"
                        : "light-swal"
                }
            });

        })
        .catch(err => Swal.fire("Failed to copy: " + err));
}
function appendtoDisplay(value) {
    display.value += value;
    playClick()
}

function clearDisplay() {
    display.value = '';
    playBeep()
}
function swaplayer() {
    const layer1 = document.getElementById("keys-layer-1");
    const layer2 = document.getElementById("keys-layer-2");

    layer1.classList.toggle("inactive");
    layer2.classList.toggle("inactive");
    playSwoosh()
}
function calculate() {
    try {
        let expression = display.value;

        // Mathematical constants
        expression = expression.replaceAll('π', 'Math.PI');
        expression = expression.replaceAll('pi', 'Math.PI');
        expression = expression.replaceAll('e', 'Math.E');

        // Powers
        expression = expression.replaceAll('^', '**');

        // Square root
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');

        // Trigonometry
        expression = expression.replace(
            /sin\(([^)]+)\)/g,
            'Math.sin(($1) * Math.PI / 180)'
        );

        expression = expression.replace(
            /cos\(([^)]+)\)/g,
            'Math.cos(($1) * Math.PI / 180)'
        );

        expression = expression.replace(
            /tan\(([^)]+)\)/g,
            'Math.tan(($1) * Math.PI / 180)'
        );

        // Logarithms
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');

        // Multiplication and Division
        expression = expression.replace(/x/g, '*');
        expression = expression.replace(/÷/g, '/');

        // Calculate
        display.value = eval(expression);
        playBeep()

    } catch (error) {
        display.value = 'Error';
    }
}

function deleteLast() {
    if (display.value.length > 0) {
        if (display.value === 'Error' || display.value === 'Infinity' || display.value === '-Infinity') {
            display.value = '';
        } else {
            display.value = display.value.slice(0, -1);
        }
    }
}
document.addEventListener('keydown', function (event) {

    if (event.key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    else if (event.key === 'Backspace') {
        deleteLast();
    }
    else if (event.key === 'Delete') {
        event.preventDefault();
        clearDisplay();
    }
    else if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        copyToClipboard();
    }
    else if (
        ['+', '-', '*', '/', '^', '(', ')', '.', 'x', '÷']
        .includes(event.key)
    ) {
        event.preventDefault();
        appendtoDisplay(event.key);
    }
    else if (
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        .includes(event.key)
    ) {
        event.preventDefault();
        appendtoDisplay(event.key);
    }

    console.log(`Key pressed: ${event.key}`);
});

// Handle Ctrl key release to swap layers
document.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        event.preventDefault();
        swaplayer();
    }
});

window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    console.log("Showing loading screen...")
    setTimeout(function () {
        loadingScreen.classList.add("fade-out");

        setTimeout(function () {
            loadingScreen.style.display = "none";
        }, 500);
    console.log("Calculator active")
    }, 3000);
});
// SETTINGS

let soundEffectsEnabled = true;


// Open / close settings

function toggleSettings() {
    const settingsPanel = document.getElementById("settings-panel");

    settingsPanel.classList.toggle("open");
}


// THEME COLOUR

const operatorColorPicker = document.getElementById("operator-color");

operatorColorPicker.addEventListener("input", function () {

    const color = operatorColorPicker.value;

    document.documentElement.style.setProperty(
        "--operator-color",
        color
    );

    const hoverColor = changeBrightness(color, 20);
    const shadowColor = changeBrightness(color, -20);

    document.documentElement.style.setProperty(
        "--operator-hover",
        hoverColor
    );

    document.documentElement.style.setProperty(
        "--operator-shadow",
        shadowColor
    );
});


function changeBrightness(hex, amount) {

    let color = hex.replace("#", "");

    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    return "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");
}


// LIGHT / DARK MODE

const themeToggle =
    document.getElementById("theme-toggle");

themeToggle.addEventListener("change", function () {

    document.body.classList.toggle(
        "dark-mode",
        themeToggle.checked
    );

});


// SOUND EFFECTS

const soundToggle =
    document.getElementById("sound-toggle");

soundToggle.addEventListener("change", function () {

    soundEffectsEnabled = soundToggle.checked;

});


// ON-SCREEN BUTTONS

const buttonsToggle =
    document.getElementById("buttons-toggle");

buttonsToggle.addEventListener("change", function () {

    const calculatorButtons =
        document.querySelectorAll("#calculator button");

    calculatorButtons.forEach(function (button) {

        button.disabled = !buttonsToggle.checked;

    });

});
