import { Stack, StackProps } from 'aws-cdk-lib';

import { Bucket } from 'aws-cdk-lib/aws-s3';
import { EventField, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 バケット作成(v2.7.0やv2.8.0だとできなかったのが、v2.20.0でできるようになった)
    const bucket = new Bucket(this, `${this.stackName}-Bucket`, {
      eventBridgeEnabled: true
    })

    // Lambda Function 作成
    const fn = new Function(this, `${this.stackName}-Function`, {
      functionName: `${this.stackName}-Function`,
      code: Code.fromInline( `
        // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
        exports.handler =  async function(event, context) {
          console.log("EVENT: "+ JSON.stringify(event, null, 2))
          return context.logStreamName
        }
      `),
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(3),
    })

    // EventBridge 作成
    const rule = new Rule(this, `${this.stackName}-Rule`, {
      ruleName: `${this.stackName}-Rule`,
      eventPattern: {
        "source": ["aws.s3"],
        "detailType": ["Object Created"],
        "resources": [bucket.bucketArn]
      },
      targets: [new LambdaFunction(fn, {
        event: RuleTargetInput.fromObject({
          time: EventField.time,
          object: {
            key: EventField.fromPath('$.detail.object.key'),
            size: EventField.fromPath('$.detail.object.size')
          }
        })
      })]
    })
  }
}
