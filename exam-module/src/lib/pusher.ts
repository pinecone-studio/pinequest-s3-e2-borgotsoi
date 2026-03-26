/** Legacy helper — prefer triggering via signed HTTP in the resolver (see create-proctor-log). */
export const triggerPusherEvent = async (
  channel: string,
  event: string,
  data: Record<string, unknown>,
) => {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = "ap1";

  const url = `https://api-${cluster}.pusher.com/apps/${appId}/events?auth_key=${key}`;

  const body = JSON.stringify({
    name: event,
    channels: [channel],
    data: JSON.stringify(data),
  });

  return await fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
};
