// Usage:
//
// const actionContext = require('./actions/lib/actioncontext.js')(this, context, core, github, ${{ toJSON(github) }}, ${{ toJSON(inputs) }}, ${{ toJSON(steps) }})
//
// Description:
//
// This class consumes references in github-script and contexts from the GitHub Composite Action in order to allow other
// classes with actionContext as a constructor argument to make use of these references and contexts in their functions.
// This class also provides utility functions for use within Composite Actions.
//
// See: https://github.com/actions/github-script
// See: https://docs.github.com/en/actions/learn-github-actions/context
class ActionContext {
    constructor(caller, context, core, githubClient, github, inputs, steps) {
        this.caller = caller;
        this.context = context;
        this.core = core;
        this.githubClient = githubClient;
        this.github = github;
        this.inputs = inputs;
        this.steps = steps;
    }

    // This function sets a variable locally and as an output of the GitHub action step.
    // Single curly braces `${local_var}` are for localized script variable references
    // while double `${{ github.context }}` braces are for GitHub pre script execution interpolation.
    //
    // The function allows you to build incrementally off other variable and do things like
    //   utils.setOutput(core, "basepath", "./${{ inputs.base_path }}")
    //   utils.setOutput(core, "fullpath", `${basepath}/with/file.name`)
    setOutput(key, value) {
        this.caller[key] = value
        this.core.setOutput(key, value)
    }
}

module.exports = function (caller, context, core, githubClient, github, inputs, steps) {
    return new ActionContext(caller, context, core, githubClient, github, inputs, steps)
}
