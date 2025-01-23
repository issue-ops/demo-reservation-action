# IssueOps Demo - Reservation Action

![Check dist/](https://github.com/issue-ops/demo-reservation-action/actions/workflows/check-dist.yml/badge.svg)
![Code Coverage](./badges/coverage.svg)
![CodeQL](https://github.com/issue-ops/demo-reservation-action/actions/workflows/codeql.yml/badge.svg)
![Continuous Integration](https://github.com/issue-ops/demo-reservation-action/actions/workflows/continuous-integration.yml/badge.svg)
![Continuous Delivery](https://github.com/issue-ops/demo-reservation-action/actions/workflows/continuous-delivery.yml/badge.svg)
![Linter](https://github.com/issue-ops/demo-reservation-action/actions/workflows/linter.yml/badge.svg)

Demo action for processing reservation requests for
[Bear Creek Honey Farm](https://issue-ops.github.io/bear-creek-honey-farm/), a
fictional bed and breakfast.

## About

This is an example action that processes reservation requests for a fictional
bed and breakfast. It is used to demonstrate how to build an
[IssueOps](https://issue-ops.github.io/docs/) action.

Depending on the value of the `action` input (described in the following
section), this action will do one of the following:

### `init`

- Moves the issue to the `New Reservations` column in the
  [Bear Creek Honey Farm Reservations](https://github.com/orgs/issue-ops/projects/3)
  project.

### `reserve`

- Checks if there are any conflicting reservations based on the requested dates
  and number of available, matching rooms.
- If there are too many conflicts, a comment is added to the issue and the
  reservation is not confirmed.
- If there are no conflicts, the reservation is confirmed and the issue is moved
  to the `Confirmed Reservations` column in the
  [Bear Creek Honey Farm Reservations](https://github.com/orgs/issue-ops/projects/3)
  project.

### `cancel`

- Adds a comment to the issue indicating that the reservation has been canceled.
- Moves the issue to the `Canceled Reservations` column in the
  [Bear Creek Honey Farm Reservations](https://github.com/orgs/issue-ops/projects/3)
  project.
- Closes the issue.

### `expire`

- Checks for any issues where the reservation end date has passed.
- If the end date has passed, adds a comment to the issue indicating that the
  reservation has expired.
- Moves the issue to the `Expired Reservations` column in the
  [Bear Creek Honey Farm Reservations](https://github.com/orgs/issue-ops/projects/3)
  project.
- Adds a comment confirming the reservation has expired.
- Closes the issue.

## Inputs

| Name                  | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| `action`              | Action to perform (`init`, `reserve`, `cancel`, or `expire`)                    |
| `github_token`        | GitHub token to use for authentication (e.g. `${{ github.token }}`)             |
| `issue_body`          | Issue body as a JSON string (not required when `action` is set to `expire`)     |
| `issue_template_path` | Path to the issue template file (e.g. `.github/ISSUE_TEMPLATE/reservation.yml`) |
| `project_number`      | Number of the project board where reservations are managed                      |
| `workspace`           | Path to the workspace directory (e.g. `${{ github.workspace }}`)                |
