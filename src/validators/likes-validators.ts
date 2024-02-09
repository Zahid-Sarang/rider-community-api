import { checkSchema } from "express-validator";

export default checkSchema({
    userId: {
        trim: true,
        errorMessage: "userId is required!",
        notEmpty: true,
    },
    memoryId: {
        trim: true,
        errorMessage: "memoryId is required!",
        notEmpty: true,
    },
});
