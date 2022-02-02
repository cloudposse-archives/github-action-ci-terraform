# github-action-terraform-ci

NOTES:
- It is necessary for the step that calls this action in a workflow file to have the `if: always()` condition attached in order to handle manual cancellations properly. If the `if: always()` condition is instead attached to the job as a whole, cancellations won't be reported properly.
- If running on `pull_request` events (in addition to `issue_comment` events, presumably), then attach the following condition the to job that calls this action: `if: ( (github.event_name == 'pull_request') && (github.event.pull_request.head.repo.full_name == github.repository) ) || (github.event_name != 'pull_request')`. This is meant to prevent running the action on pull requests that come from forks.
