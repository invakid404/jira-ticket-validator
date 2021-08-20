import * as core from '@actions/core';

import { jira } from './jira';

(async (): Promise<void> => {
  const ticket = core.getInput('ticket');
  if (!ticket) {
    core.info('No ticket supplied, exiting.');

    return;
  }

  try {
    const ticketData = await jira.findIssue(ticket);

    core.info(JSON.stringify(ticketData, null, 2));
  } catch (error) {
    core.setFailed(`"${ticket}" is not a valid Jira ticket!`);
  }
})();