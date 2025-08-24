const dropDown = document.querySelector('#id_plan_preference');
if (dropDown) {
    dropDown.addEventListener('change', function () {
        const button1 = document.querySelector('.button1');
        const button2 = document.querySelector('.button2');
        const button3 = document.querySelector('.button3');
        const selectedValue = this.value;

        button1.classList.add('hidden');
        button2.classList.add('hidden');
        button3.classList.add('hidden');

        if (selectedValue === 'basic') {
            button1.classList.remove('hidden');
        } else if (selectedValue === 'exclusive') {
            button2.classList.remove('hidden');
        } else if (selectedValue === 'pro') {
            button3.classList.remove('hidden');
        }
    });
}

