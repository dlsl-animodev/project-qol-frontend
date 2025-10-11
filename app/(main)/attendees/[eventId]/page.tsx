import AttendanceTable from "@/components/attendees/attendance-table";
import { PageContainer, PageContentHeader } from "@/components/reusables/containers";
import { dummyTableData } from "@/dummy";

interface EventAttendeesPageProps {
    params : { eventId: string }
}
const EventAttendeesPage : React.FC<EventAttendeesPageProps> = async ({
    params,
}) => {
    const eventId = (await params).eventId;

    return (
        <PageContainer>  
            <PageContentHeader 
                title={'Temporary Title'}
                description={`View attendees for this event`}
            />
       
            <AttendanceTable data={dummyTableData} />
        </PageContainer>
    )
};

export default EventAttendeesPage;