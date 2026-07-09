import {useQuery} from "@tanstack/react-query";
import {motion} from "framer-motion";
import {ecoFlowApiService} from "@/services/ecoFlowApi.ts";
import type {IEcoFlowData} from "@/types/ecoFlow.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Activity, Battery, Power, ShieldCheck, Sun, Thermometer} from "lucide-react";
import {FadeIn} from "@/components/animation/motion/fadein/FadeIn.tsx";


export default function EcoFlow() {
    const REFETCH_MS = 2000;

    const { data: ecoFlowData, dataUpdatedAt } = useQuery<IEcoFlowData>({
        queryKey: ['ecoFlowData'],
        queryFn: ecoFlowApiService.getEcoFlowData,
        refetchInterval: REFETCH_MS,
        refetchIntervalInBackground: true
    });

    if (!ecoFlowData) {
        return (
            <div className="flex min-h-[calc(100vh-173px)] items-center justify-center text-muted-foreground font-sans">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" as const }}
                    className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const animationKey = dataUpdatedAt.toString();

    const formatW = (val?: number) => (val !== undefined ? `${val.toFixed(0)} W` : "—");
    const formatV = (val?: number) => (val !== undefined ? `${val.toFixed(1)} V` : "—");
    const formatA = (val?: number) => (val !== undefined ? `${(val / 1000).toFixed(2)} A` : "—");

    return (
        <div className="p-6 space-y-6 font-sans bg-background text-foreground relative">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">🌿 EcoFlow Energiemonitor</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                Live
                            </span>
                        </div>

                        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                key={`sub-${animationKey}`}
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ animation: `progress-run ${REFETCH_MS}ms linear forwards` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout für die Dashboards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. BATTERIE-STATUS */}
                <FadeIn index={0}>
                    <Card className="shadow-sm border-muted/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Batterie-Status</CardTitle>
                            <Battery className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">Ladestand (SoC):</span>
                                <Badge variant="secondary" className="text-lg font-bold text-emerald-500 px-2.5 py-0.5">
                                    {ecoFlowData.soc ?? "—"} %
                                </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Zustand (SoH):</span>
                                <span className="font-semibold">{ecoFlowData.soh ?? "—"} %</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Spannung & Strom:</span>
                                <span className="font-semibold">
                                    {formatV(ecoFlowData.vol ? ecoFlowData.vol / 1000 : undefined)} ({formatA(ecoFlowData.amp)})
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Restlaufzeit:</span>
                                <span className="font-semibold">{ecoFlowData.remainTime ? `${Math.round(ecoFlowData.remainTime / 60)} Min.` : "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Ladezyklen:</span>
                                <span className="font-semibold">{ecoFlowData.cycles ?? "—"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* 2. PHOTOVOLTAIK (PV) */}
                <FadeIn index={1}>
                    <Card className="shadow-sm border-muted/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solarstrom (PV)</CardTitle>
                            <Sun className="h-4 w-4 text-amber-500 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">Gesamtleistung PV:</span>
                                <span className="text-xl font-bold text-amber-500">{formatW(ecoFlowData.powGetPvSum)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
                                <div>PV 1: <span className="font-medium text-foreground">{formatW(ecoFlowData.pinPv1)}</span></div>
                                <div>PV 2: <span className="font-medium text-foreground">{formatW(ecoFlowData.pinPv2)}</span></div>
                                <div>PV 3: <span className="font-medium text-foreground">{formatW(ecoFlowData.pinPv3)}</span></div>
                                <div>PV 4: <span className="font-medium text-foreground">{formatW(ecoFlowData.pinPv4)}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* 3. STROMNETZ & NETZANSCHLUSS */}
                <FadeIn index={2}>
                    <Card className="shadow-sm border-muted/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hausanschluss & Netz</CardTitle>
                            <Power className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bezug vom Netz:</span>
                                <span className="font-bold text-red-500">{formatW(ecoFlowData.powGetSysGrid)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Einspeisung ins Netz:</span>
                                <span className="font-bold text-emerald-500">{formatW(ecoFlowData.gridConnectionPower)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Netzspannung:</span>
                                <span className="font-semibold">{formatV(ecoFlowData.gridConnectionVol)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={ecoFlowData.gridConnectionSta === "PANEL_FEED_GRID" ? "default" : "secondary"}>
                                    {ecoFlowData.gridConnectionSta === "PANEL_FEED_GRID" ? "Einspeisung" : (ecoFlowData.gridConnectionSta ?? "Standby")}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* 4. ENERGIEFLUSS & HAUS-LAST */}
                <FadeIn index={3}>
                    <Card className="shadow-sm border-muted/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last- & Verteilung</CardTitle>
                            <Activity className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Hausverbrauch (Last):</span>
                                <span className="font-bold text-rose-500">{formatW(ecoFlowData.powGetBpCms)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Wechselrichter-Leistung:</span>
                                <span className="font-semibold">{formatW(ecoFlowData.acTotalActivePower)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Wechselrichter-Temp:</span>
                                <span className="font-semibold">{ecoFlowData.invTempNtc ?? "—"} °C</span>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* 5. SYSTEM-TEMPERATUREN & DIAGNOSE */}
                <FadeIn index={4}>
                    <Card className="shadow-sm border-muted/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Temperaturen & Sicherheit</CardTitle>
                            <Thermometer className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Batteriezellen (Max/Min):</span>
                                <span className="font-semibold">{ecoFlowData.maxCellTemp ?? "—"}°C / {ecoFlowData.minCellTemp ?? "—"}°C</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Elektronik (MOSFET):</span>
                                <span className="font-semibold">{ecoFlowData.maxMosTemp ?? "—"} °C</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Zellspannung-Diff:</span>
                                <span className="font-semibold text-cyan-600">{ecoFlowData.maxVolDiff ?? "—"} mV</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t">
                                <span className="text-muted-foreground">Fehlerstatus:</span>
                                <Badge variant={ecoFlowData.allErrCode === 0 ? "outline" : "destructive"} className="flex gap-1 items-center">
                                    <ShieldCheck className="h-3 w-3" />
                                    {ecoFlowData.allErrCode === 0 ? "Kein Fehler" : `Fehler ${ecoFlowData.allErrCode}`}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
