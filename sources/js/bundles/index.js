window.onload = function () {
    const btn = document.querySelector('.hide_show_block .hide_show');
        btn.addEventListener('click', event => {
            if(!btn.parentNode.classList.contains('open')){
                btn.parentNode.classList.add('open');
                btn.innerHTML = 'Свернуть';
            }else{
                btn.parentNode.classList.remove('open');
                btn.innerHTML = 'Читать далбше';
            }
        });

};