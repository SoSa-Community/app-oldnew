// patches/EngineIOHeaderWarning.js
const WS = require('engine.io-client/lib/transports/websocket');

var WebSocketImpl = WebSocket; // eslint-disable-line no-undef

WS.prototype.doOpen = function() {
    if (!this.check()) {
        // let probe timeout
        return;
    }

    var uri = this.uri();
    var protocols = this.protocols;
    var opts = {};

    if(!this.isReactNative){
        opts.agent = this.agent;
        opts.perMessageDeflate = this.perMessageDeflate;

        // SSL options for Node.js client
        opts.pfx = this.pfx;
        opts.key = this.key;
        opts.passphrase = this.passphrase;
        opts.cert = this.cert;
        opts.ca = this.ca;
        opts.ciphers = this.ciphers;
        opts.rejectUnauthorized = this.rejectUnauthorized;
    }


    if (this.extraHeaders) {
        opts.headers = this.extraHeaders;
    }
    if (this.localAddress) {
        opts.localAddress = this.localAddress;
    }

    try {
        this.ws =
            this.usingBrowserWebSocket && !this.isReactNative
                ? protocols
                ? new WebSocketImpl(uri, protocols)
                : new WebSocketImpl(uri)
                : new WebSocketImpl(uri, protocols, opts);
    } catch (err) {
        return this.emit('error', err);
    }

    if (this.ws.binaryType === undefined) {
        this.supportsBinary = false;
    }

    if (this.ws.supports && this.ws.supports.binary) {
        this.supportsBinary = true;
        this.ws.binaryType = 'nodebuffer';
    } else {
        this.ws.binaryType = 'arraybuffer';
    }

    this.addEventListeners();
};
