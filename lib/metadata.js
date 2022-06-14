class MetadataHandler {
    constructor(actionContext) {
        this.actionContext = actionContext;
    }

    handle() {
        let inputs = this.actionContext.inputs
        let githubClient = this.actionContext.githubClient
        let github = this.actionContext.github
        let core = this.actionContext.core
        let context = this.actionContext.context

        if (context.payload.pull_request) {
            this.handle_pull_request(inputs, githubClient, github, core, context);
        } else if (context.payload.issue) {
            this.handle_chatops(inputs, githubClient, github, core, context);
        }
    }

    handle_pull_request(inputs, githubClient, github, core, context) {
          // extract the SHA of the commit at the head of the PR
          this.actionContext.setOutput("pr-sha", context.payload.pull_request.head.sha);

          // extract the base branch name that's being merged into
          this.actionContext.setOutput("pr-base-ref", context.payload.pull_request.base.ref);

          // extract the labels attached to this PR
          this.actionContext.setOutput("pr-labels", context.payload.pull_request.labels);

          // run all tests by default
          // #const validTests = ['all', 'ping', 'bats', 'terratest', 'readme']
          let testNames = "all"
          //core.setOutput("tests-names", testNames)
          this.actionContext.setOutput("valid-test-request", "true")
          this.actionContext.setOutput("recognized-tests", testNames)
          this.actionContext.setOutput("unrecognized-tests", "")

          // don't execute any of the runs
          this.actionContext.setOutput("valid-run-request", "")
          this.actionContext.setOutput("recognized-runs", "")
          this.actionContext.setOutput("unrecognized-runs", "")
    }

    async handle_chatops(inputs, githubClient, github, core, context) {
          // extract the SHA of the commit at the head of the PR
          const prUrl = context.payload.issue.pull_request.url;
          console.log("prUrl: " + prUrl.replace('https://api.github.com', ''))
          console.log("githubClient: " + githubClient)
          const prDetails = await githubClient.request(`GET ${prUrl.replace('https://api.github.com', '')}`);
          console.log("prDetails: " + prDetails)
          console.log("prDetails.data: " + prDetails.data)
          console.log("prDetails.data.head: " + prDetails.data.head)
          console.log("prDetails.data.head.sha: " + prDetails.data.head.sha)
          this.actionContext.setOutput("pr-sha", prDetails.data.head.sha);

          // extract the base branch name that's being merged into
          this.actionContext.setOutput("pr-base-ref", prDetails.data.base.ref);

          // extract the labels attached to this PR
          this.actionContext.setOutput("pr-labels", prDetails.data.labels);

          // prepare to extract the name(s) of the /run or /test suite(s) to be executed
          const commentBody = context.payload.comment.body;
          console.log("commentBody: " + commentBody)
          // evaluate run regex
          const validRuns = ['all', 'rebuild-readme', 'terraform-fmt']
          const runRegex = /^\/run( .+)\s*$/;
          runMatches = commentBody.match(runRegex);
          // evaluate test regex
          const validTests = ['all', 'ping', 'bats', 'terratest', 'readme']
          const testRegex = /^\/test( .+)\s*$/;
          testMatches = commentBody.match(testRegex);

          // evaluate regex results
          let validRunRequest = ""
          let recognizedRuns = ""
          let unrecognizedRuns = ""
          let validTestRequest = ""
          let recognizedTests = ""
          let unrecognizedTests = ""
          if (testMatches == null) { // this indicates no /test request was found
            if (runMatches == null) { // this indicates that no /run request was found
              validTestRequest = "false"
              validRunRequest = "false"
            } else if (runMatches[1]) { // this indicates that we detected a properly-formatted /run request
              validTestRequest = "false"
              validRunRequest = "true"
              unrecognizedRuns = runMatches[1]
              validRuns.forEach(runCheck)
              unrecognizedRuns = unrecognizedRuns.replace(/\s{2,}/g," ")
              // clean up lists of runs, whether they're empty or not
              if ( !( /\S/.test(recognizedRuns) ) ) {
                recognizedRuns = ""
              } else {
                recognizedRuns = recognizedRuns.replace(/^\s*/,"")
              }
              if ( !( /\S/.test(unrecognizedRuns) ) ) {
                unrecognizedRuns = ""
              } else {
                unrecognizedRuns = unrecognizedRuns.replace(/^\s*/,"")
              }
            }
          } else if (testMatches[1]) { // this indicates that we detected a properly-formatted /test request
            // compare the regex match string against each validTest to determine which tests to run
            // any characters left in the regex match string become unrecognized tests
            validRunRequest = "false"
            validTestRequest = "true"
            unrecognizedTests = testMatches[1]
            validTests.forEach(testCheck)
            unrecognizedTests = unrecognizedTests.replace(/\s{2,}/g," ")
            // clean up lists of tests, whether they're empty or not
            if ( !( /\S/.test(recognizedTests) ) ) {
              recognizedTests = ""
            } else {
              recognizedTests = recognizedTests.replace(/^\s*/,"")
            }
            if ( !( /\S/.test(unrecognizedTests) ) ) {
              unrecognizedTests = ""
            } else {
              unrecognizedTests = unrecognizedTests.replace(/^\s*/,"")
            }
          }

          // function for test forEach loop above, checking valid test names against the string of requested tests
          function testCheck(test_name, index) {
            let testCheck = new RegExp( test_name + "(?= |$)")
            if ( unrecognizedTests.match(testCheck) ) {
              recognizedTests += test_name + " "
              unrecognizedTests = unrecognizedTests.replace(test_name,"")
            }
          }
  
          // function for run forEach loop above, checking valid run names against the string of requested runs
          function runCheck(run_name, index) {
            let runCheck = new RegExp( run_name + "(?= |$)")
            if ( unrecognizedRuns.match(runCheck) ) {
              recognizedRuns += run_name + " "
              unrecognizedRuns = unrecognizedRuns.replace(run_name,"")
            }
          }

          // logging
          console.log("validRunRequest: " + validRunRequest)
          console.log("recognizedRuns: " + recognizedRuns)
          console.log("unrecognizedRuns: " + unrecognizedRuns)
          console.log("validTestRequest: " + validTestRequest)
          console.log("recognizedTests: " + recognizedTests)
          console.log("unrecognizedTests: " + unrecognizedTests)

          // outputs
          this.actionContext.setOutput("valid-run-request", validRunRequest)
          this.actionContext.setOutput("recognized-runs", recognizedRuns)
          this.actionContext.setOutput("unrecognized-runs", unrecognizedRuns)
          this.actionContext.setOutput("valid-test-request", validTestRequest)
          this.actionContext.setOutput("recognized-tests", recognizedTests)
          this.actionContext.setOutput("unrecognized-tests", unrecognizedTests)
    }

}

module.exports = {
    MetadataHandler: function (actionContext) {
        return new MetadataHandler(actionContext)
    }
}
