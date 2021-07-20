import { maxheight } from 'alignheight';

window.onresize = function() {
    if(window.matchMedia('(min-width: 768px)').matches){
        heightBlock();
    }
    else{
        heightBlockRemove();
    }
};
window.onload = function () {
    if(window.matchMedia('(min-width: 768px)').matches){
        heightBlock();
    }
    document.querySelectorAll('.add-card').forEach(btn => {
        btn.addEventListener('click', event => {
        if(!btn.classList.contains('active')){
            btn.classList.add('active');
            btn.innerHTML = 'В корзине';
            btn.setAttribute('title','Товар в корзине');
        }else{
            btn.classList.remove('active');
            btn.innerHTML = 'В корзину';
            btn.setAttribute('title','в корзину');
        }
        });
    });
    document.querySelectorAll('.favorite__item').forEach(favorite => {
        favorite.addEventListener('click', event => {
            if(!favorite.classList.contains('add')){
                favorite.classList.add('add');
                favorite.setAttribute('title','В избранном');
            }else{
                favorite.classList.remove('add');
                favorite.setAttribute('title','Добавить в избранное');
            }
        });
    });
    document.querySelectorAll('.open-popup__bonuses').forEach(bonuses => {
        bonuses.addEventListener('click', event => {
            document.querySelector('.popup-discount').style.display='flex';
            document.body.style.overflow='hidden';
            document.body.style.paddingRight='15px';
        });
    });
    document.querySelectorAll('.open-popup__warehouse').forEach(bonuses => {
        bonuses.addEventListener('click', event => {
            document.querySelector('.popup-warehouse').style.display='flex';
            document.body.style.overflow='hidden';
            document.body.style.paddingRight='15px';
        });
    });
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', event => {
            popup.style.display='none';
            document.body.style.overflow='auto';
            document.body.style.paddingRight='0';
        });
    });
};



function heightBlock()
{
    maxheight('product__caption .category');
    maxheight('product__caption .title');
    maxheight('product__caption .prd-price');
    maxheight('product__caption .button');
}
function heightBlockRemove() {
    document.querySelectorAll('.product__caption .category').forEach(elem => {
        elem.setAttribute('style',' ');
    });
    document.querySelectorAll('.product__caption .title').forEach(elem => {
        elem.setAttribute('style',' ');
    });
    document.querySelectorAll('.product__caption .prd-price').forEach(elem => {
        elem.setAttribute('style',' ');
    });
    document.querySelectorAll('.product__caption .button').forEach(elem => {
        elem.setAttribute('style',' ');
    });
}