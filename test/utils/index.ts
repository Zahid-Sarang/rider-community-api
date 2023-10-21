export const isJwt = (token: string | null): boolean => {
    if (token === null) {
        return false;
    }
    const part = token.split(".");
    if (part.length !== 3) {
        return false;
    }
    try {
        part.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        return false;
    }
};
