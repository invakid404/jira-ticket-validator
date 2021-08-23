import * as core from '@actions/core';
import * as github from '@actions/github';
import { get } from 'lodash';

import { getTicket } from './jira';
import { addLabelByName, removeLabelByName } from './labels';
import { buildFunction } from './utils';

(async (): Promise<void> => {
  const ticket = core.getInput('ticket');
  const fields = core.getInput('fields').split(',');
  const label = core.getInput('label');
  const defaultPredicate = buildFunction(core.getInput('defaultPredicate'));

  const id = github?.context?.payload?.pull_request?.node_id;
  const labels = github?.context?.payload?.pull_request?.labels ?? [];

  if (!ticket) {
    core.info('No ticket supplied, exiting.');

    return;
  }

  const ticketData = await getTicket(ticket);
  if (!ticketData) {
    core.setFailed(`"${ticket}" is not a valid Jira ticket!`);

    return;
  }

  const missingFields = fields
    .map((field) => field.split(':'))
    .map(([fieldPath, fieldFn]) => {
      const fieldValue = get(ticketData, fieldPath);

      const fieldPredicate = fieldFn
        ? buildFunction(fieldFn)
        : defaultPredicate;

      return [fieldPath, fieldPredicate(fieldValue)];
    })
    .filter(([_, value]) => !value);

  if (missingFields.length) {
    if (label && id) {
      await addLabelByName({ id }, label);
    }

    core.setFailed(
      `Fields ${missingFields
        .map(([field]) => `"${field}"`)
        .join(', ')} are invalid!`,
    );

    return;
  }

  const hasBadLabel = labels.some(
    (curr: { name: string }) => curr.name === label,
  );

  if (hasBadLabel && id) {
    await removeLabelByName({ id }, label);
  }
})();
