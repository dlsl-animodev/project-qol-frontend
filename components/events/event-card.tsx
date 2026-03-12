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

const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatEventDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return eventDateFormatter.format(parsedDate);
}

function formatEventTime(date: string, fallbackTime: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackTime;
  }

  return eventTimeFormatter.format(parsedDate);
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
  const formattedDate = formatEventDate(date);
  const formattedTime = formatEventTime(date, time);

  // Convert the stats to mappable array
  const stats = [
    { key: "attendees", content: `${attendees} attendees`, icon: User },
    { key: "date", content: formattedDate, icon: Calendar },
    { key: "location", content: location, icon: MapPin },
    { key: "time", content: formattedTime, icon: Clock },
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
            <CardStatsItem key={stat.key}>
              <stat.icon size={17} /> {stat.content}
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
