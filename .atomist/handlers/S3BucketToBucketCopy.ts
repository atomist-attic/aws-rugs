import { Project } from "@atomist/rug/model/Core";
import {
  CommandHandler,
  EventHandler,
  Intent,
  MappedParameter,
  Parameter,
  ParseJson,
  ResponseHandler,
  Secrets,
  Tags,
} from "@atomist/rug/operations/Decorators";
import {
  CommandPlan,
  HandleCommand,
  HandleEvent,
  HandlerContext,
  HandleResponse,
  MappedParameters,
  Response,
} from "@atomist/rug/operations/Handlers";
import { Match, PathExpression, TreeNode } from "@atomist/rug/tree/PathExpression";

import { wrap } from "@atomist/rugs/operations/CommonHandlers";

@CommandHandler("CopyS3BucketToS3Bucket", "Copy an S3 Bucket's contents to another S3 Bucket")
@Tags("github", "aws", "s3")
@Intent("copy s3 bucket to s3 bucket")
@Secrets("secret://team?path=aws/access_key", "secret://team?path=aws/secret_key")
class S3BucketToBucketCopy implements HandleCommand {

  @Parameter({ description: "S3 source bucket name", pattern: "^.*$" })
  public sourceBucket: string;

  @Parameter({ description: "S3 destination bucket name", pattern: "^.*$" })
  public destinationBucket: string;

  @Parameter({ description: "AWS region", pattern: "^.*$" })
  public region: string = "us-east-1";

  @MappedParameter("atomist://correlation_id")
  public corrid: string;

  public handle(command: HandlerContext): CommandPlan {
    const result = new CommandPlan();
    result.add(wrap({
      instruction: {
        name: "CopyS3Bucket",
        kind: "execute",
        parameters: this,
      },
    }, `Successfully copied ${this.sourceBucket} to ${this.destinationBucket} in ${this.region}`, this));
    return result;
  }
}

export const searcher = new S3BucketToBucketCopy();
