import * as core from '@actions/core';
import JiraApi from 'jira-client';

const host = core.getInput('host', { required: true });
const username = core.getInput('username');
const password = core.getInput('password');

export const jira = new JiraApi({
  protocol: 'https',
  apiVersion: '2',
  strictSSL: true,
  host,
  username,
  password,
});

export const getTicket = async (
  ticket: string,
): Promise<JiraApi.JsonResponse | undefined> => {
  try {
    return await jira.findIssue(ticket);
  } catch (error) {
    return;
  }
};
