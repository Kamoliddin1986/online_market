import http from 'http'
import fs from 'fs'
import url from 'url'



http.createServer((req,res) => {
    let req_name = url.parse(req.url).pathname.split('/')[1]
    let req_id = url.parse(req.url).pathname.split('/')[2]
    let values = url.parse(req.url,true).query
    let filters = Object.keys(values)
    let categories_data = JSON.parse(fs.readFileSync('./data_base/categories.json'))
    let subCategories_data = JSON.parse(fs.readFileSync('./data_base/subCategories.json'))
    let products_data = JSON.parse(fs.readFileSync('./data_base/products.json'))
    

    function categories_by_id (res, id){
        let result = {}
        categories_data.forEach(category => {
            if(category.category_id == id){
              let object = []
              
              subCategories_data.forEach(subCat =>{
                  if(subCat.category_id == id ){
                      object.push(subCat)
                  }
              }) 
              result = {...category,subCategories: object}

              
    }}     
    ) 
    if(res){
        res.writeHead(200,{"Content-Type": "application/json"})            
        return res.end(JSON.stringify(result))
    }else{
      return result
    }

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
                javob = result
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

    function productsByCategoryId(res,id){
        let result = []
                    let jav = categories_by_id(id,0)
                    jav.subCategories.forEach(sub_id => {
                        products_data.forEach(pr => {

                            if(pr.sub_category_id == sub_id.sub_category_id){

                                result.push(pr)
                            }
                            
                        }
                        )
                    })
                    if(res){
                        res.writeHead(200,{"Content-Type": "application/json"})
                        return res.end(JSON.stringify(result))
                    }else{
                        return result
                    }
    }

    function productsBySubCategoryId(res,id){
        let result = []
            products_data.forEach( product => {
                if(product.sub_category_id == id){
                   result.push(product)
                }
            })
            if(res){
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end(JSON.stringify(result))
            }else{
                
                return result
            }
    }

    function productsByModel(res,model){
        let result = []
            products_data.forEach( product => {
                if(product.model == model){
                   result.push(product)
                }
            })
            if(res){
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end(JSON.stringify(result))
            }else{
                return result
            }
    }

    function queryOneFilter(res,filter,value){

        if(filter =='categoryId'){

            return productsByCategoryId(res,value) 

        }else if(filter =='subCategoryId'){

            return productsBySubCategoryId(res,value)

        }else if(filter =='model'){

            return productsByModel(res,value)

        }
    }

    if(req.method == 'GET'){


        if(req_name == 'categories'){

            if(req_id){ 

                categories_by_id(res,req_id)              

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
          
                if(filters.length==1){

                    queryOneFilter(res,filters[0],values[filters[0]])
                    
                }else if(filters.length==2){

                    let first_filter = queryOneFilter(0,filters[0],values[filters[0]])
                    let otvet = []
                    first_filter.forEach(prod => {
                        
                        if(prod[`${filters[1]}`] == values[filters[1]]){

                            otvet.push(prod)
                        }
                    })
                    res.writeHead(200,{"Content-Type": "application/json"})
                    return res.end(JSON.stringify(otvet))


                }
                

            }

            
        }

    }

    if(req.method == 'POST'){
    
        if(req_name == 'categories'){
            req.on('data', chunk =>{
                let new_data = JSON.parse(chunk);
                categories_data.push({
                    category_id: categories_data[categories_data.length-1].category_id +1,
                    category_name: new_data.category_name
                })
                fs.writeFileSync('./data_base/categories.json',JSON.stringify(categories_data, null, 4))
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end('Category was added!!!')
            })
        }

        if(req_name == 'subcategories'){
            req.on('data', chunk =>{
                let new_data = JSON.parse(chunk);
                subCategories_data.push({
                    sub_category_id: subCategories_data[subCategories_data.length-1].sub_category_id +1,
                    category_id: new_data.category_id,
                    sub_category_name: new_data.sub_category_name
                })
                fs.writeFileSync('./data_base/subCategories.json',JSON.stringify(subCategories_data, null, 4))
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end('SubCategory was added!!!')
            })
        }

        if(req_name == 'products'){
            req.on('data', chunk =>{
                let new_data = JSON.parse(chunk);
                products_data.push({
                    product_id: products_data[products_data.length-1].product_id +1,
                    sub_category_id: new_data.sub_category_id,
                    model: new_data.model,
                    product_name: new_data.product_name,
                    color: new_data.color,
                    price: new_data.price
                })
                fs.writeFileSync('./data_base/products.json',JSON.stringify(products_data, null, 4))
                res.writeHead(200,{"Content-Type": "application/json"})
                return res.end('product was added!!!')
            })
        }
    }

}).listen(4444, ()=> {
    console.log("server is running on 4444 port");
})

