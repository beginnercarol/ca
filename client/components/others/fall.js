const path='./imgs/';
const files = ['bg1.jpg','bg2.jpg',
                'bg3.jpg','bg4.jpg',
                'bg5.jpg','bg6.jpg',
                'bg7.jpg','bg8.jpg',
                'bg1.jpg','bg3.jpg',
                'bg2.jpg','bg7.jpg',
                'bg6.jpg','bg8.jpg',
                ]
const WIDTH = 260;
let fIndex = 0;
window.onload = function(){
    const lineH = [];
    const root = document.getElementById('root');
    let imgs = root.querySelectorAll('.item');
    let width = document.body.clientWidth || document.documentElement.clientWidth;
    let lastDiv = null;
    for(let i=0;i<3;i++){
        lineH.push(imgs[i].offsetHeight);
    }
    console.log('imgs=>',lineH);
    for(let i=4;i<imgs.length;i++){
        let index = getMin(lineH);
        let left = WIDTH*index;
        let top = lineH[index];
        imgs[i].style.position="absolute";
        imgs[i].style.top = top+'px';
        imgs[i].style.left = left+'px';
        lineH[index] += imgs[i].offsetHeight;
        this.console.log("lineH",lineH);
        lastDiv = imgs[i];
    }
    
    window.onscroll = shouldLoadImg;

    function shouldLoadImg(){
        let cScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let cHeight = document.body.clientHeight || document.documentElement.clientHeight;
        console.log('cScroll,cHeight',cScroll,cHeight);
        let aDivs = document.querySelectorAll('.item');
        let lDivs = aDivs[aDivs.length-1];
        console.log('lDivs=>',lDivs);
        if(lDivs.offsetTop<cHeight+cScroll){
            let index = getMin(lineH);
            let div = document.createElement('div');
            lastDiv = div;
            div.className = 'item';
            div.style.position='absolute';
            let img = document.createElement('img');
            let imgSrc = path+files[fIndex++];
            console.log('src=>',imgSrc);
            img.setAttribute('src',imgSrc);
            img.onload = ()=>{
                div.appendChild(img);
                let top = lineH[index]+'px';
                let left = WIDTH*index+'px';
                div.style.top = top;
                console.log("top",div.style.top);
                div.style.left = left;
                root.appendChild(div);
                console.log("div height=>",div.offsetHeight);
                lineH[index]+= div.offsetHeight;
                console.log("lineH=>",lineH);
            }
        }
    }
    function getMin(arr){
        let index = 0;
        for(let i=0;i<arr.length;i++){
            if(arr[i]<arr[index]){
                index=i;
            }
        }
        return index;
    }

}