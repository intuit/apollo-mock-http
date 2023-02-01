module.exports = {
    transform: {"\\.[jt]sx?$": "babel-jest"},
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};