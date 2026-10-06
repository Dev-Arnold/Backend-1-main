import Product from "../model/product.js"

// const getAllProducts =async (req,res)=>{
//     try {
//         const {category, minPrice, maxPrice, sort, search, page = 1, limit = 5} = req.query;

//         const filter = {}

//         if(category) filter.category = category;
//         if(maxPrice || minPrice){
//             filter.price = {}
//             if(maxPrice) filter.price.$lte = Number(maxPrice)
//             if(minPrice) filter.price.$gte = Number(minPrice)
//         }

//         if(search){
//             filter.$or = [
//                 {name: {$regex: search, $options: 'i'}},
//                 {category: {$regex: search, $options: 'i'}}
//             ]
//         }


//         let sortBy = sort ? sort.replaceAll(',',' ') : '-createdAt'

//         const products = await Product.find(filter, projection)
//             .sort(sortBy)
//             .skip((page-1) * limit)
//             .limit(Number(limit));

//         // const sortBy = sort ? sort.replaceAll(',', ' ') : '-createdAt';

//         // const products = await Product.find(filter)
//         //     .sort(sortBy)
//         //     .skip((page-1) * limit)
//         //     .limit(Number(limit))


//         res.status(200).json(products)
//     } catch (error) {
//         res.status(500).json({message:"internal server error"})        
//         console.loog(error)
//     }
// }

const getAllProducts =async(req,res)=>{
    try {
        let {page = 1, limit = 5, category, minPrice, maxPrice, search, sort } = req.query

        let skip = page - 1;

        let filter = {}
        if(category) filter.category = category;

        // filter = {
        //     category: fashion
        // }

        if (minPrice || maxPrice) {
            filter.price = {}
            if(minPrice) filter.price.$gte = minPrice;
            if(maxPrice) filter.price.$lte = maxPrice;
        }

        if(search) filter.name = {$regex: search, $options: 'i'}

        // filter = {
        //     category: "fashion",
        //     price: {
        //         gte: 3000,
        //         lte: 20000
        //     }
            // name: {
            //     regex: ank, 
            //     options: i
            // }
        // }

        // console.log(filter)
        // return


        let products = await Product.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort(sort)


        if(products.length == 0) return res.status(404).json({message:"no products available"})

        res.status(200).json(products)
    } catch (error) {
         res.status(500).json({message:"internal server error"})        
        console.log(error)
    }
}

export {
    getAllProducts
}