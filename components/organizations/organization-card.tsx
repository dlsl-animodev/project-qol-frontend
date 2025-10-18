import { ClipboardCheck } from "lucide-react";
import { Description, Subtitle } from "../reusables/texts";
import Link from "next/link";
import { Button } from "../ui/button";
import GenerateCodeButton from "../events/generate-code-button";
import {
    CardItem,
    CardItemFooter,
    CardItemHeader,
    CardItemMain,
    CardStats,
    CardStatsItem,
} from "../reusables/card-item";

interface OrganizationCardProps {
    id: string;
    userId: string;
    name: string;
    description: string;
    pastEvents: number;
    upcomingEvents: number;
}
function OrganizationCard({
    id, name, description, pastEvents, upcomingEvents,
}: OrganizationCardProps) {
    // Convert the stats to mappable array
    const stats = [
        {
            label: "upcoming events",
            value: upcomingEvents,
            icon: ClipboardCheck,
        },
        { label: "past events", value: pastEvents, icon: ClipboardCheck },
    ];

    return (
        <CardItem>
            <CardItemHeader>
                <Subtitle>{name}</Subtitle>
                <Description className="text-accent-foreground opacity-50">
                    {description}
                </Description>
            </CardItemHeader>
            <CardItemMain>
                <CardStats className="flex gap-8 items-center">
                    {stats.map((stat) => (
                        <CardStatsItem
                            key={stat.label}
                            className="text-accent-foreground opacity-70"
                        >
                            <stat.icon size={17} /> {stat.value} {stat.label}{" "}
                        </CardStatsItem>
                    ))}
                </CardStats>
            </CardItemMain>
            <CardItemFooter className="flex flex-col gap-2">
                <Link href={`/events/${id}`}>
                    <Button className="w-full"> View events </Button>
                </Link>
                <GenerateCodeButton />
            </CardItemFooter>
        </CardItem>
    );
}

export default OrganizationCard;
