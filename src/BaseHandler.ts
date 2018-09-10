import { Context, Callback } from "aws-lambda";

export class BaseHandler {
    protected event: any;
    protected context: Context;
    protected cb: Callback;

    constructor(e: any, ctx: Context, cb: Callback) {
        this.event = e;
        this.context = ctx;
        this.cb = cb;
    }

    respond(title: string, message: string) {
        this.cb(null, {
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": message
                },
                "card": {
                    "content": message,
                    "title": title,
                    "type": "Simple"
                },
                "shouldEndSession": true
            },
            "sessionAttributes": {}
        });
    }

    error(title) {
        this.respond(title, "Sorry, but I cannot handle your request");
    }
}