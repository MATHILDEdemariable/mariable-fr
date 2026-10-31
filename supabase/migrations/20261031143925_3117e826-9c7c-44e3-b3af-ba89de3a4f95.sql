SELECT cron.schedule('pro-trial-reminders-daily', '0 7 * * *', $$
  SELECT net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/pro-trial-reminders',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjM1MTYsImV4cCI6MjA1ODk5OTUxNn0.ij6dWi7LiWNk9mh3SknY1N8-upp9l20R7CZZDeAMEys"}'::jsonb,
    body := '{}'::jsonb
  );
$$);