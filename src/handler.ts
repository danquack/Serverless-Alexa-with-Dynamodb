import { Context, Callback } from "aws-lambda";
import { BaseHandler } from "./BaseHandler";
import { DynamoDB, AWSError } from 'aws-sdk';
import { Metric } from "./Metric";

const dynamoDb = new DynamoDB.DocumentClient({ region: "us-east-1" });
class AlexaHandler extends BaseHandler {
  constructor(event: any, ctx: Context, cb: Callback) {
    super(event, ctx, cb);
    if (
      !event.session ||
      !event.session.application ||
      !event.request ||
      !event.request.type
    ) {
      this.error('Invalid Request')
    }
  }

  processRequest() {
    console.log(this.event)
    switch (this.event.request.type ) {
      case 'LaunchRequest': {
        this.processHelp();
        break;
      }
      case 'SessionEndedRequest': {
        this.respond('Goodbye', '', true);
        break;
      }
      case 'IntentRequest': {
        switch (this.event.request.intent.name) {
          case 'Amazon.HelpIntent': {
            this.processHelp();
            break;
          }
          default: {
            this.processMetrics();
            break;
          }
        }
        break;
      }
    }
  }

  private async processHelp() {
    this.respond('Help', 'For a list of available commands please visit the readme for Serverless-Alexa-with-Dynamodb')
  }

  private getDynamoResponse(metric: String): Promise<any> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: String(process.env.ALEXA_METRICS!),
      Key: {
        metric: metric
      }
    };
    return dynamoDb.get(params).promise();
  }

  private async processMetrics() {
    const metricArray: string[] = this.event.request.intent.name.split(/(?=[A-Z])/);
    metricArray.pop();
    const metric = metricArray.join(' ').toLowerCase();
    try {
      console.log(`Alexa requests metric for ${metric}`);
      const results: DynamoDB.GetItemOutput = await this.getDynamoResponse(metricArray.join(' ').toLowerCase());
      if (results.Item) {
        try {
          const metricResult: Metric = results.Item! as any as Metric;
          console.log('Success:', JSON.stringify(metricResult));
          if (metricResult.response) {
            this.respond(metric, metricResult.response.replace(/{total_count}/gi, metricResult.total_count));
          } else {
            console.log(`ERROR: No response defined for ${metric}`);
            this.error('No Response Defined')
          }
        } catch (error) {
          console.log(`ERROR: ${error}`);
          this.error('Processing Metric');
        }
      } else {
        this.respond('No Results', `no data exists for ${metric}`)
      }

    } catch (error) {
      console.log(`ERROR: ${error}`);
      this.error('Database Capture')
    }
  }
}

export const alexa = (e: any, ctx: Context, cb: Callback) => {
  new AlexaHandler(e, ctx, cb).processRequest();
};