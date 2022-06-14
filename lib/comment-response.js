class CommentResponse {
    constructor(actionContext) {
        this.actionContext = actionContext;
    }

    async respond() {
        let inputs = this.actionContext.inputs
        let githubClient = this.actionContext.githubClient
        let github = this.actionContext.github
        let core = this.actionContext.core
        let context = this.actionContext.context

        const rt = inputs.recognized_tests
        const ut = inputs.unrecognized_tests
        const rr = inputs.recognized_runs
        const ur = inputs.unrecognized_runs

        // Determine what mix of (un)recognized tests/runs were requested in the comment and respond accordingly
        // using the emojiResponse and commentBodyAddition variables.
        let emojiResponse;
        let commentBodyAddition = "\n\n";
        if ( (rt !== "" || rr !== "") && (ut === "" && ur === "") ) {
            emojiResponse = "+1";
            commentBodyAddition = commentBodyAddition + "<b>github-action-ci-terraform response:</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "All the requested actions were valid." + "\n";
            commentBodyAddition = commentBodyAddition + "Valid actions: " + "<b>${{ inputs.recognized_tests }} ${{ inputs.recognized_runs }}</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "The valid actions will now be executed.";
            core.debug(`Comment body addition: ${commentBodyAddition}`);
        } else if ( (rt === "" && rr === "") && (ut !== "" || ur !== "") ) {
            emojiResponse = "-1";
            commentBodyAddition = commentBodyAddition + "<b>github-action-ci-terraform response:</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "All requested actions are invalid." + "\n";
            commentBodyAddition = commentBodyAddition + "Invalid actions: " + "<b>${{ inputs.unrecognized_tests }} ${{ inputs.unrecognized_runs }}</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "If you would still like to run these invalid actions, please verify that they are supported via chatops and were spelled correctly. Then, create another request comment.";
            core.debug(`Comment body addition: ${commentBodyAddition}`);
        } else if ( (rt !== "" && ut !== "") ||  (rr !== "" && ur !== "") ) {
            emojiResponse = "confused";
            commentBodyAddition = commentBodyAddition + "<b>github-action-ci-terraform response:</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "There were a mixture of valid and invalid actions requested, as follows." + "\n";
            commentBodyAddition = commentBodyAddition + "Valid actions: " + "<b>${{ inputs.recognized_tests }} ${{ inputs.recognized_runs }}</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "Invalid actions: " + "<b>${{ inputs.unrecognized_tests }} ${{ inputs.unrecognized_runs }}</b>" + "\n";
            commentBodyAddition = commentBodyAddition + "Only the valid actions will be executed." + "\n";
            commentBodyAddition = commentBodyAddition + "If you would still like to run the invalid actions, please verify that they are supported by chatops and were spelled correctly. Then, create another request comment.";
            core.debug(`Comment body addition: ${commentBodyAddition}`);
        let core = this.actionContext.core
        }

        const {owner, repo} = context.issue
        // make emoji response to comment
        await githubClient.rest.reactions.createForIssueComment({
          owner,
          repo,
          comment_id: inputs.comment_id,
          content: emojiResponse,
        });
        // modify original comment
        const { data: comment } = await githubClient.rest.issues.getComment({
          owner: owner,
          repo: repo,
          comment_id: inputs.comment_id,
        });
        let commentBody = comment.body + commentBodyAddition;
        await githubClient.rest.issues.updateComment({
          owner: owner,
          repo: repo,
          comment_id: inputs.comment_id,
          body: commentBodyAddition,
        });
        core.info(`Updated comment id '${inputs.comment_id}'.`);
        //core.setOutput("comment-id", inputs.commentId);
    }
}

module.exports = {
    CommentResponder: function (actionContext) {
        return new CommentResponse(actionContext)
    }
}
