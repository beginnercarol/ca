window.onload = function(){
    //LCS
    (function(){
        function LCS(str1,str2){
         let len1 = str1.length,len2 = str2.length;
         let arr = [];
          for(let i=0;i<=len1;i++){
            arr[i]=[];
            for(let j=0;j<=len2;j++){
               arr[i][j]=0;
            }
          }
          for(let i=1;i<=len1;i++){
            for(let j=1;j<=len2;j++){
              if(str1[i-1]==str2[j-1]){
                arr[i][j]=arr[i-1][j-1]+1;
              }else{
                arr[i][j]=Math.max(arr[i-1][j],arr[i][j-1]);
              }
            }
          }
          console.log(arr);
          return arr;
        }
        let str1 = 'ABCDAB';
        let str2 = 'BDCABA';
        let len1 = str1.length,len2 = str2.length;
        let arr = LCS('ABCDAB','BDCABA');
        let steps = arr[len1][len2];
        console.log("steps=>",steps);
        let path = [];
        let i=len1-1,j=len2-1;
        while(steps){
            if(str1[i]==str2[j]){
                path.unshift(str1[i]);
                console.log(str1[i]);
                steps--;
                i--;
                j--;
            }else{
                if(arr[i][j+1]<arr[i+1][j]){
                    j--;
                }else{
                    i--;
                }
            }
        }
        console.log(path);
       })();
       //duplicate subtree
       (function(){
        const tree = {
            A:{
                B:{
                    C:'C',
                    D:{
                        E:'E'
                    }
                }
            },
            F:{
                G:'G',
                H:{
                    I:"I"
                }
            }

        }
        
            const path = [];
            const obj = {};
            function preOrderTree(node,path){
                if(node==null){
                    path.push('#');
                    return path;
                }
                // visit(node);
                path.push(node);
                preOrderTree(node.left,path);
                preOrderTree(node.right,path);
                obj[node.val]=path.join();
            }
       })();
}