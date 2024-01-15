import { checkSchema } from "express-validator";

export default checkSchema({
    tripTitle: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "tripTitle should be a string!",
        },
    },
    tripDescription: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "tripDescription should be a string!",
        },
    },
    tripDuration: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "tripDuration should be a string!",
        },
    },
    startDateTime: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "startDateTime should be a string!",
        },
    },
    endDateTime: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "endDateTime should be a string!",
        },
    },
    startPoint: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "startPoint should be a string!",
        },
    },
    endingPoint: {
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "endingPoint should be a string!",
        },
    },

    destinationImage: {
        optional: { options: { nullable: true } },
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
