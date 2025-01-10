const data = {
    example: { syllables: 3, mainStress: 1, secondaryStress: 2 },
    // Add more words as needed
};

const wordElement = document.getElementById('word');
const syllablesInput = document.getElementById('syllables');
const mainStressInput = document.getElementById('main-stress');
const secondaryStressInput = document.getElementById('secondary-stress');
const feedbackElement = document.getElementById('feedback');
const animationElement = document.getElementById('animation');

let currentWord = 'example'; // This would change dynamically

document.getElementById('submit').addEventListener('click', () => {
    const syllables = parseInt(syllablesInput.value);
    const mainStress = parseInt(mainStressInput.value);
    const secondaryStress = parseInt(secondaryStressInput.value);

    const correctData = data[currentWord];
    let allCorrect = true;

    if (syllables === correctData.syllables) {
        syllablesInput.classList.add('correct');
        syllablesInput.classList.remove('incorrect');
    } else {
        syllablesInput.classList.add('incorrect');
        syllablesInput.classList.remove('correct');
        allCorrect = false;
    }

    if (mainStress === correctData.mainStress) {
        mainStressInput.classList.add('correct');
        mainStressInput.classList.remove('incorrect');
    } else {
        mainStressInput.classList.add('incorrect');
        mainStressInput.classList.remove('correct');
        allCorrect = false;
    }

    if (secondaryStress === correctData.secondaryStress) {
        secondaryStressInput.classList.add('correct');
        secondaryStressInput.classList.remove('incorrect');
    } else {
        secondaryStressInput.classList.add('incorrect');
        secondaryStressInput.classList.remove('correct');
        allCorrect = false;
    }

    if (allCorrect) {
        feedbackElement.textContent = '';
        animationElement.classList.remove('hidden');
    } else {
        feedbackElement.textContent = 'Try again!';
        animationElement.classList.add('hidden');
    }
});
