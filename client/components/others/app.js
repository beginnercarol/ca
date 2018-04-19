window.onload = function(){
    function TreeNode(val){
        this.val = val;
        this.left = null;
        this.right = null;
    }
    const tree1 = {
        val:'A',
        left:{
            val:'B',
            left:{
                val:'C',
                left:null,
                right:null,
            },
            right:{
                val:'D',
                left:{
                    val:'E',
                    left:null,
                    right:null,
                },
                right:null,
            }
        },
        right:{
            val:'F',
            left:null,
            right:{
                val:'G',
                left:null,
                right:{
                    val:'H',
                    left:null,
                    right:null
                }
            }
        }
    }
    const tree2 = {
        val:'H',
        left:{
            val:'I',
            left:{
                val:'J',
                left:null,
                right:null,
            },
            right:{
                val:'D',
                left:{
                    val:'E',
                    left:null,
                    right:null,
                },
                right:null,
            }
        },
        right:{
            val:'F',
            left:null,
            right:{
                val:'G',
                left:null,
                right:{
                    val:'H',
                    left:null,
                    right:null
                }
            }
        }
    }

    findDuplicateSubTree(tree1);

    function findDuplicateSubTree(root){
        if(root)return false;
        let arr = [];
        let fi = [];
        preOrder(root,arr);        
        console.log("fi=>",fi);
        function preOrder(root,arr){
            if(root==null){
                arr.push('#');
                return '#';
            }
            let sb = root.val+preOrder(root.left,[])+preOrder(root.right,[]);
            arr.push(root.val);
            preOrder(root.left,arr);
            preOrder(root.right,arr);
            return arr.join("");
        }
        
    }

    //3. Longest Substring Without Repeating Characters
    function LSC(str){
        let arr = str.split("");
        let hashMap = {};
        for(let i=0;i<arr.length;i++){
            hashMap[arr[i]]?
        }
    }



    function preOrder(tree){
        if(tree==null)return null;
        visit(tree);
        preOrder(tree.left);
        preOrder(tree.right);
    }
    function inOrder(tree){
        if(tree==null)return ;
        inOrder(tree.left);
        visit(tree);
        inOrder(tree.right);
    }
    
    function inOrder(tree){
        if(tree==null)return;
        let arr = [];
        arr.push(tree);
        
        if(arr.left==null){
            
        }
    }
    function visit(node){
        console.log(node.val);
    }

    //preOrder(tree);
    function preOrderNon(tree){
        if(tree==null)return;
    }


    //reconstruct
    function reconstruct(preO,inO){
        
    }
}