/*
 * Copyright © 2017 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Project } from "@atomist/rug/model/Core";
import {
    CommandHandler,
    Intent,
    MappedParameter,
    Parameter,
    Secrets,
    Tags,
} from "@atomist/rug/operations/Decorators";
import {
    CommandPlan,
    HandleCommand,
    HandlerContext,
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
