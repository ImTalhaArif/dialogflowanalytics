import type { NextApiRequest, NextApiResponse } from 'next';
import { google, logging_v2 } from 'googleapis';

interface LogEntry {
  timestamp: string;
  textPayload: string;
  severity: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const projectId = 'acali-ldni';
  const authClient = await auth.getClient();
  const logging = new logging_v2.Logging({ auth: authClient as any });

  const request: logging_v2.Params$Resource$Entries$List = {
    resourceNames: [`projects/${projectId}`],
    pageSize: 100, // Adjust this as needed
    filter: 'resource.type="global"', // Adjust filter as needed
  };

  try {
    const response = await logging.entries.list(request);
    const logs: LogEntry[] = response.data.entries?.map((entry: any) => ({
      timestamp: entry.timestamp,
      textPayload: entry.textPayload,
      severity: entry.severity,
    })) || [];

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
}
