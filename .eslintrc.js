module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "MemberExpression": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "ignore",
                "asyncArrow": "ignore"
            }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "no-console": "off",
        "no-multiple-empty-lines": [
            "error",
            { "max": 1, "maxBOF": 1 }
        ],
        "no-unreachable": "error",
        "func-call-spacing": [
            "error",
            "never"
        ],
        "no-constant-condition": [
            "error",
            { "checkLoops": false }
        ],
        "space-before-blocks": "error"
    }
};