import Category from '../models/Category.js';


export const addCategory = async (req, res, next) => {
    try {
        const {name } = req.body;
        const category = new Category({name});
        await category.save();
        res.status(201).json({
            message: 'Category added successfully',
            category
        });
    } catch (error) {
        next(error);
        
    }
};


export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
        
    }
};

