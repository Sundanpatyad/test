const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        console.log(savedProduct);
        res.status(201).json(savedProduct); // Assuming you want to send the saved product as the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



exports.fetchAllProducts = async (req, res) => {
    try {
        let condition = {};
        if(!req.query.admin){
            condition.deleted = {$ne : true};
        }

        let query = Product.find(condition);
        let totalProductsQuery = Product.find(condition);

        if (req.query.category) {
            query = query.where('category').equals(req.query.category);
        }

        if (req.query.brand) {
            query = query.where('brand').equals(req.query.brand);
        }

        if (req.query._sort && req.query._order) {
            const sortField = req.query._sort;
            const sortOrder = req.query._order === 'asc' ? 1 : -1;
            query = query.sort({ [sortField]: sortOrder });
        }

        const totalDocs = await Product.countDocuments(totalProductsQuery);
        res.set('X-Total_Count' , totalDocs); // Counting documents without executing the query
        console.log({ totalDocs });

        if (req.query._page && req.query._limit) {
            const pageSize = parseInt(req.query._limit);
            const page = parseInt(req.query._page);
            query = query.skip(pageSize * (page - 1)).limit(pageSize);
        }

        const response = await query.exec();
        res.status(200).json( response );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}



exports.fetchAllProductsById = async (req,res)=>{
    const {id} =req.params;
try{
    const product = await Product.findById(id)
    res.status(200).json(product);

}catch(e){
  res.status(400).json(err);  
}
}


exports.updateProduct = async (req,res)=>{
    const {id} =req.params;
try{
    const product = await Product.findByIdAndUpdate(id , req.body , {new:true})
    res.status(200).json(product);

}catch(e){
  res.status(400).json(err);  
}
}
