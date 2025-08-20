

const dropDown = document.querySelector('#dropdown1')



dropDown.addEventListener('change', function(){
 
const proPlan = document.querySelector('.pro-plan')
       const button2 = document.querySelector('.button2')
       const button1 = document.querySelector('.button1')
       const button3 = document.querySelector('.button3')
       const selectedValue = this.value

       if (selectedValue === 'pro-plan'){
      button2.classList.add('display')
           button3.classList.remove('display')
           button1.classList.add('display')
       }else if (selectedValue === 'basic') {
           button2.classList.add('display')
           button3.classList.add('display')
           button1.classList.remove('display')
       }else if(selectedValue === 'exclusive'){
          button2.classList.remove('display')
        button1.classList.add('display')
        button3.classList.add('display')
       }
       
})