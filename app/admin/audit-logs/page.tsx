import { getAdminAuditLogsAction } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AuditLogsPage() {
  const res = await getAdminAuditLogsAction();
  const logs: any[] = Array.isArray(res.data) ? res.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif">Security Audit & Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete, unalterable log of admin actions, order status mutations, and system events.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-6 border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/20">
                  <td className="p-3 font-mono text-muted-foreground">{formatDate(log.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3 font-semibold">{log.user?.fullName || "System"}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-3">{log.entity} #{log.entityId}</td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
