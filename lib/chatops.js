// Usage:
//
// const deployment = require('./actions/lib/deployment.js')(actionContext)
// let pr_suffix = deployment.getInfoCI().pr_suffix // referenced in inputs.stages
// deployment.newDeployment(JSON.parse(`${{ inputs.stages }}`))
//
// Description:
//
// This class contains methods to assist in the CI/CD workflow of a Single Page Application (SPA)
//
// The getInfoCI() method should be called at the beginning of the CI workflow and will return an object containing
//       information about whether the CI workflow needs to run builds and tests.  This will be the case on a 'push', 
//      'pull_request' with a 'preview' label, or a 'release'
// 
// The newDeployment() method will create a Deployment event containing relevant information needed for the CD process.
//  The CD workflow should be triggered on a 'deployment' event.


class Chatops {
    constructor(actionContext) {
        this.actionContext = actionContext;
    }

    metadata_extraction() {
        // extract the SHA of the commit at the head of the PR
        const prUrl = this.actionContext.context.payload.issue.pull_request.url;
        const prDetails = await github.request(`GET ${prUrl}`);
        let headSha = prDetails.data.head.sha;
        this.actionContext.core.setOutput("pr-sha", headSha);

        // extract the base branch name that's being merged into
        let prBaseRef = prDetails.data.base.ref;
        this.actionContext.core.setOutput("pr-base-ref", prBaseRef);

        // extract the labels attached to this PR
        let prLabels = prDetails.data.labels;
        this.actionContext.core.setOutput("pr-labels", prLabels);

        // prepare to extract the name(s) of the /run or /test suite(s) to be executed
        const commentBody = this.actionContext.context.payload.comment.body;
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

        // logging
        console.log("validRunRequest: " + validRunRequest)
        console.log("recognizedRuns: " + recognizedRuns)
        console.log("unrecognizedRuns: " + unrecognizedRuns)
        console.log("validTestRequest: " + validTestRequest)
        console.log("recognizedTests: " + recognizedTests)
        console.log("unrecognizedTests: " + unrecognizedTests)

        // outputs
        this.actionContext.core.setOutput("valid-run-request", validRunRequest)
        this.actionContext.core.setOutput("recognized-runs", recognizedRuns)
        this.actionContext.core.setOutput("unrecognized-runs", unrecognizedRuns)
        this.actionContext.core.setOutput("valid-test-request", validTestRequest)
        this.actionContext.core.setOutput("recognized-tests", recognizedTests)
        this.actionContext.core.setOutput("unrecognized-tests", unrecognizedTests)
    }


    // function for test forEach loop above, checking valid test names against the string of requested tests
    testCheck(test_name, index) {
      let testCheck = new RegExp( test_name + "(?= |$)")
      if ( unrecognizedTests.match(testCheck) ) { 
        recognizedTests += test_name + " " 
        unrecognizedTests = unrecognizedTests.replace(test_name,"")
      }
    }

    // function for run forEach loop above, checking valid run names against the string of requested runs
    runCheck(run_name, index) {
      let runCheck = new RegExp( run_name + "(?= |$)")
      if ( unrecognizedRuns.match(runCheck) ) { 
        recognizedRuns += run_name + " " 
        unrecognizedRuns = unrecognizedRuns.replace(run_name,"")
      }
    }
}

module.exports = function (actionContext) {
    return new Chatops(actionContext)
}


