import {useQuery} from "@tanstack/react-query";
import {apiService} from "@/services/api.ts";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ArrowDown, ArrowUp} from "lucide-react";
import {FadeIn} from "@/components/animation/motion/fadein/FadeIn.tsx";
import type {ICryptoCoin} from "@/types/cryptoCoin.ts";


export default function Crypto() {
    const { data } = useQuery<ICryptoCoin[]>({
        queryKey: ['cryptoCoin24'],
        queryFn: apiService.getCrypto,
    });

    return (
        <div>
            <div
                className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
            >
                {data && data.map((coint, index) => (
                    <FadeIn key={coint.id} index={index}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <img width="25px" src={coint.image} />
                                    <CardTitle>{coint.name}</CardTitle>
                                </div>

                                <div className={`flex items-center gap-1 my-2 ${
                                    coint.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                                }`}>
                                    {coint.price_change_percentage_24h >= 0
                                        ? <ArrowUp size={16} />
                                        : <ArrowDown size={16} />
                                    }
                                    <span>{coint.price_change_percentage_24h.toFixed(2)}%</span>
                                </div>

                                <CardDescription>Rank: {coint.market_cap_rank}</CardDescription>
                                <CardDescription>€ {coint.market_cap.toLocaleString("de-DE")}</CardDescription>
                                <CardAction className="uppercase">{coint.symbol}</CardAction>
                            </CardHeader>
                        </Card>
                    </FadeIn>
                ))}
            </div>

        </div>
    );
}