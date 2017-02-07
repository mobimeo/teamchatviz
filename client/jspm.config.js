SystemJS.config({
  nodeConfig: {
    "paths": {
      "client/": "src/"
    }
  },
  devConfig: {
    "map": {
      "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
      "core-js": "npm:core-js@2.4.0",
      "net": "npm:jspm-nodelibs-net@0.2.0",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.10",
      "systemjs-hot-reloader": "github:capaj/systemjs-hot-reloader@0.6.0",
      "tty": "npm:jspm-nodelibs-tty@0.2.0"
    },
    "packages": {
      "github:capaj/systemjs-hot-reloader@0.6.0": {
        "map": {
          "debug": "npm:debug@2.2.0",
          "socket.io-client": "github:socketio/socket.io-client@1.4.8",
          "weakee": "npm:weakee@1.0.0"
        }
      },
      "npm:babel-helper-builder-react-jsx@6.9.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.9.2",
          "babel-types": "npm:babel-types@6.9.0",
          "esutils": "npm:esutils@2.0.2",
          "lodash": "npm:lodash@4.13.1"
        }
      },
      "npm:babel-plugin-syntax-jsx@6.8.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.9.2"
        }
      },
      "npm:babel-plugin-transform-react-jsx@6.8.0": {
        "map": {
          "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.9.0",
          "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.8.0",
          "babel-runtime": "npm:babel-runtime@6.9.2"
        }
      }
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "client": {
      "main": "client.js",
      "format": "esm",
      "meta": {
        "*.js": {
          "babelOptions": {
            "plugins": [
              "babel-plugin-transform-react-jsx"
            ]
          }
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "babel-types": "npm:babel-types@6.9.0",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "css": "github:systemjs/plugin-css@0.1.23",
    "d3": "npm:d3@3.5.17",
    "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "flexboxgrid": "npm:flexboxgrid@6.3.0",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "https": "github:jspm/nodelibs-https@0.2.0-alpha",
    "immutable": "npm:immutable@3.8.1",
    "lodash": "npm:lodash@4.13.1",
    "module": "npm:jspm-nodelibs-module@0.2.0",
    "moment": "npm:moment@2.13.0",
    "node-emoji": "npm:node-emoji@1.3.1",
    "normalize.css": "github:necolas/normalize.css@4.1.1",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "platform": "npm:platform@1.3.1",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "react": "npm:react@15.1.0",
    "react-addons-shallow-compare": "npm:react-addons-shallow-compare@15.1.0",
    "react-addons-update": "npm:react-addons-update@15.1.0",
    "react-button-group": "npm:react-button-group@1.0.2",
    "react-date-range": "npm:react-date-range@0.2.4",
    "react-dom": "npm:react-dom@15.1.0",
    "react-modal": "npm:react-modal@1.4.0",
    "react-onclickoutside": "npm:react-onclickoutside@5.3.1",
    "react-progress-2": "npm:react-progress-2@4.2.1",
    "react-router": "npm:react-router@2.5.1",
    "react-virtualized": "npm:react-virtualized@7.11.5",
    "react-vis": "npm:react-vis@0.4.2",
    "scss": "github:mobilexag/plugin-sass@0.4.6",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
    "timers": "npm:jspm-nodelibs-timers@0.2.0",
    "twemoji": "npm:twemoji@2.1.0",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "npm:jspm-nodelibs-vm@0.2.0",
    "whatwg-fetch": "npm:whatwg-fetch@1.0.0",
    "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha"
  },
  packages: {
    "npm:asn1.js@4.6.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:autoprefixer@6.3.6": {
      "map": {
        "browserslist": "npm:browserslist@1.3.4",
        "caniuse-db": "npm:caniuse-db@1.0.30000488",
        "normalize-range": "npm:normalize-range@0.1.2",
        "num2fraction": "npm:num2fraction@1.2.2",
        "postcss": "npm:postcss@5.0.21",
        "postcss-value-parser": "npm:postcss-value-parser@3.3.0"
      }
    },
    "npm:babel-messages@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2"
      }
    },
    "npm:babel-runtime@6.9.2": {
      "map": {
        "core-js": "npm:core-js@2.4.0",
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
      }
    },
    "npm:babel-types@6.9.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "babel-traverse": "npm:babel-traverse@6.10.4",
        "esutils": "npm:esutils@2.0.2",
        "lodash": "npm:lodash@4.13.1",
        "to-fast-properties": "npm:to-fast-properties@1.0.2"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "buffer-xor": "npm:buffer-xor@1.0.3",
        "cipher-base": "npm:cipher-base@1.0.2",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "des.js": "npm:des.js@1.0.0",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "elliptic": "npm:elliptic@6.3.1",
        "inherits": "npm:inherits@2.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "pako": "npm:pako@0.2.8",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:chalk@1.1.3": {
      "map": {
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
        "has-ansi": "npm:has-ansi@2.0.0",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "supports-color": "npm:supports-color@2.0.0"
      }
    },
    "npm:cipher-base@1.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "elliptic": "npm:elliptic@6.3.1"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.5"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "inherits": "npm:inherits@2.0.1",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:debug@2.2.0": {
      "map": {
        "ms": "npm:ms@0.7.1"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:fbjs@0.8.3": {
      "map": {
        "core-js": "npm:core-js@1.2.6",
        "immutable": "npm:immutable@3.8.1",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "loose-envify": "npm:loose-envify@1.2.0",
        "object-assign": "npm:object-assign@4.1.0",
        "promise": "npm:promise@7.1.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.10"
      }
    },
    "npm:global@4.3.0": {
      "map": {
        "min-document": "npm:min-document@2.18.0",
        "node-min-document": "npm:min-document@2.18.0",
        "process": "npm:process@0.5.2"
      }
    },
    "npm:has-ansi@2.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:history@2.1.2": {
      "map": {
        "deep-equal": "npm:deep-equal@1.0.1",
        "invariant": "npm:invariant@2.2.1",
        "query-string": "npm:query-string@3.0.3",
        "warning": "npm:warning@2.1.0"
      }
    },
    "npm:invariant@2.2.1": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "node-fetch": "npm:node-fetch@1.5.3",
        "whatwg-fetch": "npm:whatwg-fetch@1.0.0"
      }
    },
    "npm:lodash._baseassign@3.2.0": {
      "map": {
        "lodash._basecopy": "npm:lodash._basecopy@3.0.1",
        "lodash.keys": "npm:lodash.keys@3.1.2"
      }
    },
    "npm:lodash._createassigner@3.1.1": {
      "map": {
        "lodash._bindcallback": "npm:lodash._bindcallback@3.0.1",
        "lodash._isiterateecall": "npm:lodash._isiterateecall@3.0.9",
        "lodash.restparam": "npm:lodash.restparam@3.6.1"
      }
    },
    "npm:lodash.assign@3.2.0": {
      "map": {
        "lodash._baseassign": "npm:lodash._baseassign@3.2.0",
        "lodash._createassigner": "npm:lodash._createassigner@3.1.1",
        "lodash.keys": "npm:lodash.keys@3.1.2"
      }
    },
    "npm:lodash.keys@3.1.2": {
      "map": {
        "lodash._getnative": "npm:lodash._getnative@3.9.1",
        "lodash.isarguments": "npm:lodash.isarguments@3.0.8",
        "lodash.isarray": "npm:lodash.isarray@3.0.4"
      }
    },
    "npm:loose-envify@1.2.0": {
      "map": {
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:min-document@2.18.0": {
      "map": {
        "dom-walk": "npm:dom-walk@0.1.1"
      }
    },
    "npm:node-emoji@1.3.1": {
      "map": {
        "string.prototype.codepointat": "npm:string.prototype.codepointat@0.2.0"
      }
    },
    "npm:node-fetch@1.5.3": {
      "map": {
        "encoding": "npm:encoding@0.1.12",
        "is-stream": "npm:is-stream@1.1.0"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "asn1.js": "npm:asn1.js@4.6.2",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4"
      }
    },
    "npm:pbkdf2@3.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:postcss@5.0.21": {
      "map": {
        "js-base64": "npm:js-base64@2.1.9",
        "source-map": "npm:source-map@0.5.6",
        "supports-color": "npm:supports-color@3.1.2"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.4"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "create-hash": "npm:create-hash@1.1.2",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      }
    },
    "npm:query-string@3.0.3": {
      "map": {
        "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
      }
    },
    "npm:raf@3.2.0": {
      "map": {
        "performance-now": "npm:performance-now@0.2.0"
      }
    },
    "npm:react-button-group@1.0.2": {
      "map": {
        "object-assign": "npm:object-assign@2.1.1",
        "react-button": "npm:react-button@1.2.1",
        "react-clonewithprops": "npm:react-clonewithprops@1.0.1",
        "react-dropdown-button": "npm:react-dropdown-button@1.0.11",
        "react-split-button": "npm:react-split-button@1.0.1",
        "react-style-normalizer": "npm:react-style-normalizer@1.2.8"
      }
    },
    "npm:react-button@1.2.1": {
      "map": {
        "object-assign": "npm:object-assign@2.1.1",
        "react-style-normalizer": "npm:react-style-normalizer@1.2.8"
      }
    },
    "npm:react-date-range@0.2.4": {
      "map": {
        "classnames": "npm:classnames@2.2.5",
        "moment": "npm:moment@2.13.0",
        "react": "npm:react@15.1.0"
      }
    },
    "npm:react-dropdown-button@1.0.11": {
      "map": {
        "has-touch": "npm:has-touch@1.0.1",
        "object-assign": "npm:object-assign@2.1.1",
        "react-button": "npm:react-button@1.2.1",
        "react-clonewithprops": "npm:react-clonewithprops@1.0.1",
        "react-menus": "npm:react-menus@1.1.1"
      }
    },
    "npm:react-event-names@1.0.0": {
      "map": {
        "has-touch": "npm:has-touch@1.0.1"
      }
    },
    "npm:react-menus@1.1.1": {
      "map": {
        "arrow-style": "npm:arrow-style@1.1.1",
        "buffer-function": "npm:buffer-function@1.0.0",
        "has-touch": "npm:has-touch@1.0.1",
        "object-assign": "npm:object-assign@2.1.1",
        "point-in-triangle": "npm:point-in-triangle@1.0.1",
        "react-clonewithprops": "npm:react-clonewithprops@1.0.1",
        "react-event-names": "npm:react-event-names@1.0.0",
        "react-style-normalizer": "npm:react-style-normalizer@1.2.8",
        "region-align": "npm:region-align@2.1.3",
        "select-parent": "npm:select-parent@1.0.1"
      }
    },
    "npm:react-split-button@1.0.1": {
      "map": {
        "object-assign": "npm:object-assign@2.1.1",
        "react-button": "npm:react-button@1.2.1",
        "react-dropdown-button": "npm:react-dropdown-button@1.0.11",
        "react-menus": "npm:react-menus@1.1.1"
      }
    },
    "npm:react@15.1.0": {
      "map": {
        "fbjs": "npm:fbjs@0.8.3",
        "loose-envify": "npm:loose-envify@1.2.0",
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:readable-stream@2.1.4": {
      "map": {
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:region-align@2.1.3": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0",
        "region": "npm:region@2.1.2"
      }
    },
    "npm:region@2.1.2": {
      "map": {
        "hasown": "npm:hasown@1.0.1",
        "newify": "npm:newify@1.1.9",
        "object-assign": "npm:object-assign@2.1.1"
      }
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:stream-http@2.3.0": {
      "map": {
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:strip-ansi@3.0.1": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.0.0"
      }
    },
    "npm:supports-color@3.1.2": {
      "map": {
        "has-flag": "npm:has-flag@1.0.0"
      }
    },
    "npm:timers-browserify@1.4.2": {
      "map": {
        "process": "npm:process@0.11.5"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:warning@2.1.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:babel-traverse@6.10.4": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "babel-types": "npm:babel-types@6.9.0",
        "lodash": "npm:lodash@4.13.1",
        "babel-messages": "npm:babel-messages@6.8.0",
        "babel-code-frame": "npm:babel-code-frame@6.11.0",
        "globals": "npm:globals@8.18.0",
        "debug": "npm:debug@2.2.0",
        "babylon": "npm:babylon@6.8.2",
        "invariant": "npm:invariant@2.2.1"
      }
    },
    "npm:react-router@2.5.1": {
      "map": {
        "history": "npm:history@2.1.2",
        "loose-envify": "npm:loose-envify@1.2.0",
        "warning": "npm:warning@2.1.0",
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
        "invariant": "npm:invariant@2.2.1"
      }
    },
    "npm:react-virtualized@7.11.5": {
      "map": {
        "dom-helpers": "npm:dom-helpers@2.4.0",
        "raf": "npm:raf@3.2.0",
        "classnames": "npm:classnames@2.2.5"
      }
    },
    "npm:babel-code-frame@6.11.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "esutils": "npm:esutils@2.0.2",
        "chalk": "npm:chalk@1.1.3",
        "js-tokens": "npm:js-tokens@2.0.0"
      }
    },
    "npm:babylon@6.8.2": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.9.2"
      }
    },
    "github:mobilexag/plugin-sass@0.4.6": {
      "map": {
        "lodash": "npm:lodash@4.13.1",
        "fs": "npm:jspm-nodelibs-fs@0.2.0",
        "path": "npm:jspm-nodelibs-path@0.2.0",
        "url": "npm:jspm-nodelibs-url@0.2.0",
        "postcss": "npm:postcss@5.0.21",
        "sass.js": "npm:sass.js@0.9.10",
        "autoprefixer": "npm:autoprefixer@6.3.6",
        "reqwest": "github:ded/reqwest@2.0.5"
      }
    },
    "npm:buffer@4.7.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "isarray": "npm:isarray@1.0.0",
        "ieee754": "npm:ieee754@1.1.6"
      }
    },
    "npm:elliptic@6.3.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.4",
        "inherits": "npm:inherits@2.0.1",
        "brorand": "npm:brorand@1.0.5",
        "hash.js": "npm:hash.js@1.0.3"
      }
    },
    "npm:browserslist@1.3.4": {
      "map": {
        "caniuse-db": "npm:caniuse-db@1.0.30000488"
      }
    },
    "npm:react-modal@1.4.0": {
      "map": {
        "exenv": "npm:exenv@1.2.0",
        "element-class": "npm:element-class@0.2.2",
        "lodash.assign": "npm:lodash.assign@3.2.0"
      }
    },
    "npm:react-onclickoutside@5.3.1": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:react-vis@0.4.2": {
      "map": {
        "global": "npm:global@4.3.0",
        "deep-equal": "npm:deep-equal@1.0.1",
        "warning": "npm:warning@2.1.0",
        "d3-color": "npm:d3-color@0.4.2",
        "d3-shape": "npm:d3-shape@0.6.1",
        "d3-scale": "npm:d3-scale@0.7.2",
        "d3-collection": "npm:d3-collection@0.1.2",
        "d3-axis": "npm:d3-axis@0.3.2",
        "d3-array": "npm:d3-array@0.7.1",
        "d3-transition": "npm:d3-transition@0.2.10",
        "d3-selection": "npm:d3-selection@0.7.3",
        "d3-hierarchy": "npm:d3-hierarchy@0.2.4"
      }
    },
    "npm:d3-scale@0.7.2": {
      "map": {
        "d3-color": "npm:d3-color@0.4.2",
        "d3-collection": "npm:d3-collection@0.2.0",
        "d3-format": "npm:d3-format@0.5.1",
        "d3-time-format": "npm:d3-time-format@0.3.2",
        "d3-array": "npm:d3-array@0.7.1",
        "d3-time": "npm:d3-time@0.2.6",
        "d3-interpolate": "npm:d3-interpolate@0.8.3"
      }
    },
    "npm:d3-shape@0.6.1": {
      "map": {
        "d3-path": "npm:d3-path@0.1.5"
      }
    },
    "npm:d3-axis@0.3.2": {
      "map": {
        "d3-scale": "npm:d3-scale@0.7.2",
        "d3-transition": "npm:d3-transition@0.2.10",
        "d3-selection": "npm:d3-selection@0.7.3"
      }
    },
    "npm:d3-time-format@0.3.2": {
      "map": {
        "d3-time": "npm:d3-time@0.2.6"
      }
    },
    "npm:d3-interpolate@0.8.3": {
      "map": {
        "d3-color": "npm:d3-color@0.4.2"
      }
    },
    "npm:d3-transition@0.2.10": {
      "map": {
        "d3-color": "npm:d3-color@0.4.2",
        "d3-interpolate": "npm:d3-interpolate@0.8.3",
        "d3-selection": "npm:d3-selection@0.7.3",
        "d3-timer": "npm:d3-timer@0.4.4",
        "d3-ease": "npm:d3-ease@0.7.0",
        "d3-dispatch": "npm:d3-dispatch@0.4.4"
      }
    },
    "npm:jspm-nodelibs-timers@0.2.0": {
      "map": {
        "timers-browserify": "npm:timers-browserify@1.4.2"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:jspm-nodelibs-url@0.2.0": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.7.0"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "github:jspm/nodelibs-domain@0.2.0-alpha": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.3.0"
      }
    },
    "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "github:jspm/nodelibs-zlib@0.2.0-alpha": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    }
  }
});
