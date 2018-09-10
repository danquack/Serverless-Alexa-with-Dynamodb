# Serverless Alexa with Dynamodb
--------

This sample alexa skill is a facts based skill designed to report metrics out of dynamodb. The idea is that something external would update dynamodb, which would then be read through alexa.

## Prereqs
1. Install nodejs (https://nodejs.org/en/download/)
2. Install the aws cli and set up a profile (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
3. Create a developer alexa account (https://developer.amazon.com/alexa)
4. Read vendor documentation (https://github.com/marcy-terui/serverless-alexa-skills)

## Devtime dependencies
1. A dynamodb table must be created for facts.
    - The table should contain a primary key of "metric"
        i. The keys should be lowercase space separated words
    - The table should have a "total_count" and "response" attributes
2. OATH2 is configured for sls alexa (https://serverless.com/blog/how-to-manage-your-alexa-skills-with-serverless/)
    - Provided in these instruction is creating your skill. Create the skill, and then add the the skill id to environment variables. `sls alexa create --name $ALEXA_SKILL_NAME --locale en-US --type custom`
3. The following environment variables should be baked into your system
    - `ALEXA_SKILL_NAME`
    - `AWS_ACCOUNTID`
    - `AWS_REGION`: default - `us-east-1` (if you modify this, you will also have to update the handler file)
    - `AWS_ALEXA_FACTS_TABLENAME`: default - `Facts`
    - `AMAZON_VENDOR_ID`:  Created in step 2
    - `AMAZON_CLIENT_ID`:  Created in step 2
    - `AMAZON_CLIENT_SECRET`:  Created in step 2
    - `ALEXA_SKILL_ID`: Created in step 2a


## Install instructions
1. Clone the repository
2. Run `npm install`
3. Update serverless.yml manifest publishing information
4. Update serverless.yml with intents and uterrances. (Note: Metric name are regex replaced by capitalized characters. i.e `MyMetricIntent` is 1:1 correlated with `my metric` in the dynamodb table)
5. run `sls deploy` to deploy the function to aws
6. run `sls alexa build`
7. run `sls alexa update`
7. Test your new alexa skill in the alexa console


## Sample Queries
Once you start adding intents, add them below.