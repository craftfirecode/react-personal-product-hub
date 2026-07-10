import {useAuth} from "@/features/auth/guards/AuthProvider";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Activity, Zap, Coins, Gamepad2} from "lucide-react";

export default function Dashboard() {
  const { session } = useAuth();

  const stats = [
    { title: "EcoFlow Status", value: "Verbunden", description: "Live Daten aktiv", icon: <Zap className="text-yellow-500" /> },
    { title: "Crypto Markt", value: "Top 4", description: "Letzte 24h", icon: <Coins className="text-blue-500" /> },
    { title: "Gaming", value: "Steam", description: "In Vorbereitung", icon: <Gamepad2 className="text-purple-500" /> },
    { title: "System", value: "Online", description: "API Gateway aktiv", icon: <Activity className="text-green-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Willkommen zurück</h1>
        <p className="text-muted-foreground">Angemeldet als {session?.user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
