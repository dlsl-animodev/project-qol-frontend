import { Calendar, Clock, ExternalLink, MapPin, User } from "lucide-react";
import { Description, Subtitle } from "../reusables/texts";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  CardItem,
  CardItemFooter,
  CardItemHeader,
  CardItemMain,
  CardStats,
  CardStatsItem,
} from "../reusables/card-item";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  attendees: number;
  date: string;
  location: string;
  time: string;
}

function EventCard({
  id,
  title,
  description,
  status,
  attendees,
  date,
  location,
  time,
}: EventCardProps) {
  // Convert the stats to mappable array
  const stats = [
    { label: "attendees", value: attendees, icon: User },
    { label: "date", value: date, icon: Calendar },
    { label: "location", value: location, icon: MapPin },
    { label: "time", value: time, icon: Clock },
  ];

  return (
    <CardItem>
      {/* HEADER  */}
      <CardItemHeader className="flex items-start justify-between">
        <span>
          <Subtitle>{title}</Subtitle>
          <Description className="text-accent-foreground opacity-50">
            {description}
          </Description>
        </span>
        <Badge className="bg-secondary text-secondary-foreground">
          {status}
        </Badge>
      </CardItemHeader>
      <CardItemMain>
        <CardStats className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <CardStatsItem key={stat.label}>
              <stat.icon size={17} /> {stat.value} {stat.label}
            </CardStatsItem>
          ))}
        </CardStats>
      </CardItemMain>
      <CardItemFooter>
        <Link href={`/attendees/${id}`}>
          <Button className="w-full">
            View attendees <ExternalLink />
          </Button>
        </Link>
        <Link href={`/scan/${id}`}>
          <Button className="w-full mt-4">
            Scan ID <ExternalLink />
          </Button>
        </Link>
      </CardItemFooter>
    </CardItem>
  );
}

export default EventCard;
