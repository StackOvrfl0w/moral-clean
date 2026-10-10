# Release workflow

- Preserve changes on a feature branch or `preview`, and test the preview deployment first.
- Never push to `master`, merge into `master`, or deploy/promote new code to production without the user's explicit approval for that release. Earlier general authorization does not override this rule.
- Keep production on the approved master release while preview changes are under review.
- Database records are shared by preview and production unless an isolated database is configured. Do not describe a code rollback as a database rollback.
- Do not commit credentials, environment files, or Vercel authentication state.
