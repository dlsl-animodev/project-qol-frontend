import AttendanceTable from "@/components/attendees/attendance-table";
import { PageContainer, PageContentHeader } from "@/components/reusables/containers";
import { dummyTableData } from "@/dummy";

interface EventAttendeesPageProps {
    params : Promise<{ eventId: string }>
}
const EventAttendeesPage : React.FC<EventAttendeesPageProps> = async ({
    params,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { eventId } = await params;

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