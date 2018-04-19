window.onload = function(){
    const list = [['a','a','a'],['b','b','b'],['g','h','i'],['d','d','d']];
    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('change',()=>{
        console.log("change");
        let radio = form.elements['type'].value;
        let select = form.elements['city'].value;
        console.log(typeof select);
        let sch = form.elements['school'];
        console.log("sch=>",sch);
        let stu = document.getElementsByClassName('student')[0];
        let grad = document.getElementsByClassName('graduate')[0];
        switch(radio){
            case 'student':
                grad.style = "display:none";
                stu.style = "display:blcok";
                break;
            case 'graduate':
                grad.style = "display:block";
                stu.style = "display:none";
                break;
            default:
                grad.style = "display:none";
                stu.style = "display:none";
        }
        let frag = document.createDocumentFragment();
        switch(select){
            case '1':
                frag.innerHTML = "";
                sch.innerHTML = "";
                for(let i=0;i<list[select].length;i++){
                    let opt = document.createElement('option');
                    opt.innerText = list[select][i];
                    opt.value = i;
                    frag.appendChild(opt);
                }
                sch.appendChild(frag);
                break;
            case '2':
                frag.innerHTML = "";
                sch.innerHTML = "";
                for(let i=0;i<list[select];i++){
                    let opt = document.createElement('option');
                    opt.innerText = list[select][i];
                    opt.value = i;
                    frag.appendChild(opt);
                }
                console.log("frag=>",frag);
                sch.appendChild(frag);
                break;    
        }
    })
}


