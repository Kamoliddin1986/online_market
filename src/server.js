import http from 'http'
import fs from 'fs'
import url from 'url'



http.createServer((req,res) => {
    if(req.method == 'GET'){
        let req_name = url.parse(req.url).pathname.split('/')[1]
        let req_id = url.parse(req.url).pathname.split('/')[2]
        let values = url.parse(req.url,true).query
        let filters = Object.keys(values)
        let categories_data = JSON.parse(fs.readFileSync('./data_base/categories.json'))
        let subCategories_data = JSON.parse(fs.readFileSync('./data_base/subCategories.json'))
        let products_data = JSON.parse(fs.readFileSync('./data_base/products.json'))
        
            // console.log(values[filters[1]]);


        function categories_by_id (res,id){
            let result
            categories_data.forEach(category => {
                if(category.category_id == id){
                  let object = {
                      "sub": []
                  }
                  subCategories_data.forEach(subCat =>{
                      if(subCat.category_id == id ){
                          object.sub.push(subCat)
                      }
                  }) 
                  result = {...category,subCategories: object["sub"]}
                  res.writeHead(200,{"Content-Type": "application/json"})            
                  return res.end(JSON.stringify(result))
        }}) 

        }        
        
        function allCategories (res){
            let result=[]
                let object = {"sub": []}
                categories_data.forEach(category => {                    
                      object['sub'] =[]

                      subCategories_data.forEach(subCat =>{
                          if(subCat.category_id == category.category_id ){
                              object['sub'].push(subCat)
                          }
                      })
                      result.push({...category,subCategories: object.sub})
                      
                    })
                    res.writeHead(200,{"Content-Type": "application/json"})
                    return res.end(JSON.stringify(result))
        }        

        function subCategoriesById (res,id){
            let result
                subCategories_data.forEach(subCategory => {
                  if(subCategory.sub_category_id == id){
                    let object = {
                        "prod": []
                    }
                    products_data.forEach(product =>{
                        if(product.sub_category_id == id ){
                            object['prod'].push(product)
                        }
                    })
                    res.writeHead(200,{"Content-Type": "application/json"})
                    result = {
                        subCategoryId: subCategory.sub_category_id,
                        subCategoryName: subCategory.sub_category_name,
                        products: object["prod"]
                    }
                }
            })  
            return res.end(JSON.stringify(result))
        }

        function allSubCategories (res){
            let result=[]
                let object = {"prod": []}
                subCategories_data.forEach(subCategory => {                    
                      object['prod'] =[]

                      products_data.forEach(product =>{
                          if(product.sub_category_id == subCategory.sub_category_id ){
                              object['prod'].push(product)
                          }
                      })
                      result.push({
                        subCategoryId: subCategory.sub_category_id,
                        subCategoryName: subCategory.sub_category_name,
                        products: object["prod"]})
                      
                    })
                    res.writeHead(200,{"Content-Type": "application/json"})
                    return res.end(JSON.stringify(result))
        }

        function productById(res,id){
            let result
                products_data.forEach( product => {
                    if(product.product_id == id){
                       result = product 
                    }
                })
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end(JSON.stringify(result))
        }
        if(req_name == 'categories'){

            if(req_id){ 

                let jav = categories_by_id(res,req_id)              

            }else{

                allCategories(res)
            }
        }


        if(req_name == 'subCategories'){
            if(req_id){
                subCategoriesById(res,req_id)          

            }else{

                allSubCategories(res)
                
            }
        }

        if(req_name == 'products'){
            if(req_id){
                productById(res,req_id)
            }else{
          
                let result
                // products_data.forEach( product => {
                //     if(filters[0] == ){
                //        result = product 
                //     }
                // })
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end(JSON.stringify(result))
                

            }

            
        }

    }

}).listen(4444, ()=> {
    console.log("server is running on 4444 port");
})

