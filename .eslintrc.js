module.exports = {
    extends: [
        "react-app",
        "react-app/jest",
    ],
    rules: {
        "import/no-anonymous-default-export": [
            "error",
            {
                allowArray: true,
                allowArrowFunction: true,
                allowAnonymousClass: true,
                allowAnonymousFunction: true,
                allowCallExpression: true, // The true value here is for backward compatibility
                allowLiteral: true,
                allowObject: true,
            },
        ],
    },
};
