import { Activity, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusCardsProps {
    stats: {
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
    } | undefined;
}

const StatusCards = ({ stats }: StatusCardsProps) => {
    const total = (stats?.open || 0) + (stats?.inProgress || 0) + (stats?.resolved || 0) + (stats?.closed || 0);

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 text-sm font-normal bg-background/50">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Total:</span>
                <span className="font-bold">{total}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 text-sm font-normal bg-background/50">
                <Circle className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-muted-foreground font-medium">Open:</span>
                <span className="font-bold">{stats?.open || 0}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 text-sm font-normal bg-background/50">
                <Clock className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-muted-foreground font-medium">In Progress:</span>
                <span className="font-bold">{stats?.inProgress || 0}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 text-sm font-normal bg-background/50">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span className="text-muted-foreground font-medium">Resolved:</span>
                <span className="font-bold">{stats?.resolved || 0}</span>
            </Badge>
        </div>
    );
};

export default StatusCards;
