import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Moral Clean dashboard</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-white">
          <CardTitle>Web Application analytics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-14rem)] min-h-[28rem] w-full">
            <iframe
              title="PostHog analytics dashboard"
              src="https://us.posthog.com/embedded/OxNIfS1QRvVAbd1QO4aLIdcs00oW1g"
              className="h-full min-h-full w-full border-0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
