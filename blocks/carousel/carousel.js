import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

const {btnNxt, btnPre} = placeholders;
// medatory method
export default function decorate(block){
    
    console.log("placeholders --->", placeholders, btnNxt,btnPre);
    const rows=[...block.children];
    [...block.children].forEach((row,r)=>{
        if(r==0){
            const nextbtn = document.createElement('button');
            nextbtn.classList.add('btn');
            nextbtn.classList.add('btn-next');
            const node = document.createTextNode(btnNxt);
            nextbtn.appendChild(node);
            row.replaceWith(nextbtn);
        }else if(r==rows.length-1){
            const prebtn = document.createElement('button');
            prebtn.classList.add('btn');
            prebtn.classList.add('btn-prev');
            const node = document.createTextNode(btnPre);
            prebtn.append(node);
            row.replaceWith(prebtn);
        }else{
            row.classList.add('slide');
            [...row.children].forEach((col,c)=>{
                if(c==1){
                    col.classList.add("slide-text");
                }
            });
        }
    });


    const slides = document.querySelectorAll(".slide");

    slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${indx * 100}%)`;
    });

    const nextSlide = document.querySelector(".btn-next");
    
    let curSlide = 0;
    let maxSlide = slides.length - 1;

    nextSlide.addEventListener("click", function(){
        if(curSlide == maxSlide){
            curSlide = 0;
        }else {
            curSlide++;
        }

        // move slide by -100%
        slidexs.forEach((slide, indx)=>{
            slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
    });

    const preSlide = document.querySelector(".btn-prev");

    preSlide.addEventListener("click", function(){
        if(curSlide==0){
            curSlide = maxSlide;
        }else {
            curSlide --;
        }

        // move slide by 100%
        slides.forEach((slide, indx)=>{
            slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
    });

}