import { checkSchema } from "express-validator";

export default checkSchema({
    tripTitle: {
        isString: {
            errorMessage: "tripTitle should be a string!",
        },
    },
    tripDescription: {
        isString: {
            errorMessage: "tripDescription should be a string!",
        },
    },
    tripDuration: {
        isString: {
            errorMessage: "tripDuration should be a string!",
        },
    },
    startDateTime: {
        isString: {
            errorMessage: "startDateTime should be a string!",
        },
    },
    endDateTime: {
        isString: {
            errorMessage: "endDateTime should be a string!",
        },
    },
    startPoint: {
        isString: {
            errorMessage: "startPoint should be a string!",
        },
    },
    endingPoint: {
        isString: {
            errorMessage: "endingPoint should be a string!",
        },
    },
    userId: {
        isString: {
            errorMessage: "userId should be a string!",
        },
    },
    destinationImage: {
        custom: {
            options: (value, { req }) => {
                // Custom validation for image file (you can implement your own logic here)
                if (value) {
                    const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
                    const fileExtension = value.split(".").pop().toLowerCase();
                    return allowedExtensions.includes(fileExtension);
                }
                return true; // No validation if no file is provided
            },
            errorMessage: "Invalid profile photo format. Allowed formats: jpg, jpeg, png, gif!",
        },
    },
});
