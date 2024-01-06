import { checkSchema } from "express-validator";

export default checkSchema({
    userName: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "Username should be a string",
        },
    },
    firstName: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "First name should be a string",
        },
    },
    lastName: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "Last name should be a string",
        },
    },
    profilePhoto: {
        optional: { options: { nullable: true } },
        custom: {
            options: (value, { req }) => {
                // Custom validation for image file (you can implement your own logic here)
                if (value) {
                    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "svg"];
                    const fileExtension = value.split(".").pop().toLowerCase();
                    return allowedExtensions.includes(fileExtension);
                }
                return true; // No validation if no file is provided
            },
            errorMessage: "Invalid profile photo format. Allowed formats: jpg, jpeg, png, gif",
        },
    },
    coverPhoto: {
        optional: { options: { nullable: true } },
        custom: {
            options: (value, { req }) => {
                // Custom validation for image file (you can implement your own logic here)
                if (value) {
                    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "svg"];
                    const fileExtension = value.split(".").pop().toLowerCase();
                    return allowedExtensions.includes(fileExtension);
                }
                return true; // No validation if no file is provided
            },
            errorMessage: "Invalid cover photo format. Allowed formats: jpg, jpeg, png, gif",
        },
    },
    bio: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "Bio should be a string",
        },
    },
    location: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "Location should be a string",
        },
    },
    bikeDetails: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "Bike details should be a string",
        },
    },
});
