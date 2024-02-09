import { checkSchema } from "express-validator";

export default checkSchema({
    text: {
        errorMessage: "Last name is required!",
        notEmpty: true,
        trim: true,
    },
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
