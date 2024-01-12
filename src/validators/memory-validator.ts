import { checkSchema } from "express-validator";

export default checkSchema({
    title: {
        trim: true,
        notEmpty: true,
        errorMessage: "Title is required!",
        isString: {
            errorMessage: "Title should be a string",
        },
    },
    description: {
        trim: true,
        notEmpty: true,
        errorMessage: "Description is required!",
        isString: {
            errorMessage: "Description should be a string",
        },
    },
    image: {
        optional: { options: { nullable: true } },
        custom: {
            options: (value, { req }) => {
                // Custom validation for image file (you can implement your own logic here)
                if (value) {
                    const allowedExtensions = ["jpg", "jpeg", "png"];
                    const fileExtension = value.split(".").pop().toLowerCase();
                    return allowedExtensions.includes(fileExtension);
                }
                return true; // No validation if no file is provided
            },
            errorMessage: "Invalid image format. Allowed formats: jpg, jpeg, png, gif",
        },
    },
    userId: {
        trim: true,
        notEmpty: true,
        errorMessage: "Please mention userId!",
        isString: {
            errorMessage: "userId should be a string!",
        },
    },
});
