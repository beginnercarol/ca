class HelloWorld extends HTMLElement{
    constructor(){
        super();
        var shadow = this.attachShadow({mode:'open'});
        var sp = document.createElement('span');
        var icon = document.createElement('span');
        icon.setAttribute('className','icon');
        sp.setAttribute('className','sp');
        sp.innerText = this.getAttribute('text');
        if(this.getAttribute('text')){
            sp.innerText = this.getAttribute('text');
        }else{
            sp.innerText = 'default';
        }
        shadow.appendChild(sp);
        shadow.appendChild(icon);
    }
    connectedCallback(){
        console.log('connected',this.getAttribute('text'));
        this.updateStyle(this);
    }
    updateStyle(ele){
        console.log('called');
        let shadow = ele.shadowRoot;
        let childNodes = shadow.children;
        console.log('called=>',childNodes);
        for(let i=0;i<childNodes.length;i++){
            childNodes[i].setAttribute('bg','red');
            if(childNodes[i].className=='sp'){
                console.log("sp=>",this.getAttribute('text'));
                sp.innerText = this.getAttribute('text');
            }
        }
    }
}

customElements.define('hello-world',HelloWorld);

let doc = document.createElement('hello-world');
doc.setAttribute('text','hhh');
document.body.appendChild(doc);