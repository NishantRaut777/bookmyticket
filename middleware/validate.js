export const validate = (schema) => (req, res, next) => {
    try {
        req.validatedData = schema.parse(req.body);
        next();

    } catch (error) {
        // console.log(error);
        return res.status(400).json({ message: error.message })
    }
}