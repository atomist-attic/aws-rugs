import {HandleResponse, MappedParameters, HandleEvent, Execute, Respondable, HandleCommand, Respond, Instruction, Response, HandlerContext , Plan} from '@atomist/rug/operations/Handlers'
import {TreeNode, Match, PathExpression} from '@atomist/rug//tree/PathExpression'
import {EventHandler, ResponseHandler, ParseJson, CommandHandler, Secrets, MappedParameter, Parameter, Tags, Intent} from '@atomist/rug/operations/Decorators'
import {Project} from '@atomist/rug/model/Core'
import {wrap} from './Common'

@CommandHandler("MirrorGithubRepoToS3","Mirror a GitHub repo contents to S3")
@Tags("github", "aws", "s3")
@Intent("mirror github repo s3")
@Secrets("github://user_token?scopes=repo", "secret://team?path=aws/access_key", "secret://team?path=aws/secret_key")
class GithubRepoMirror implements HandleCommand {

  @MappedParameter(MappedParameters.GITHUB_REPOSITORY)
  repo: string

  @MappedParameter(MappedParameters.GITHUB_REPO_OWNER)
  owner: string

  @Parameter({description: "S3 bucket name", pattern: "^.*$"})
  bucket: string

  @Parameter({description: "AWS region", pattern: "^.*$"})
  region: string = "us-east-1"

  @Parameter({description: "Glob pattern to match in GitHub repo", pattern: "^.*$"})
  glob: string = "**/**"

  @MappedParameter("atomist://correlation_id")
  corrid: string

  handle(command: HandlerContext) : Plan {
    let result = new Plan()
    result.add(wrap({instruction:
              {name: "MirrorRepoToS3",
              kind: "execute",
              parameters:
                  {repo: this.repo,
                    owner: this.owner,
                    bucket: this.bucket,
                    region: this.region,
                    glob: this.glob}}}, `Successfully mirrored ${this.owner}/${this.repo} to ${this.bucket} in ${this.region}`,this))
    return result;
  }
}

export let searcher = new GithubRepoMirror();