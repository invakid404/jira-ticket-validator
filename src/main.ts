import * as core from '@actions/core';
import { get } from 'lodash';

import { jira } from './jira';

(async (): Promise<void> => {
  const ticket = core.getInput('ticket');
  const fields = core.getInput('fields');

  if (!ticket) {
    core.info('No ticket supplied, exiting.');

    return;
  }

  try {
    const ticketData = await jira.findIssue(ticket);

    if (fields) {
      const missingFields = fields
        .split(',')
        .map((field) => [field, get(ticketData, field)])
        .filter(([_, value]) => value == null);

      if (missingFields.length) {
        missingFields.forEach(([field]) =>
          core.info(`Field "${field}" is missing!`),
        );
      }
    }
  } catch (error) {
    core.setFailed(`"${ticket}" is not a valid Jira ticket!`);
  }
})();
