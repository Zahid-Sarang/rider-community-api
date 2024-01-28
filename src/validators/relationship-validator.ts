import { checkSchema } from "express-validator";

export default checkSchema({
    followerId: {
        trim: true,
        errorMessage: "followerId is required!",
        notEmpty: true,
    },
    followedId: {
        trim: true,
        errorMessage: "followedId is required!",
        notEmpty: true,
    },
});
