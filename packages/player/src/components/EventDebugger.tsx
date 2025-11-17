import { useEffect, useRef, useState } from "react";
import { bus } from "@/core/events";
import { motion } from "motion/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Floating panel that logs every bus event and lets devs emit commands manually.
 * Mount it once in your app (e.g. inside <App />) – it subscribes globally.
 */
export default function EventDebugger() {
  type Direction = "cmd" | "rs";

  interface LogEntry {
    id: number;
    type: string;
    direction: Direction;
    payload: any;
    timestamp: number;
  }

  // ----------------------------- state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const nextId = useRef(1);
  const [evtType, setEvtType] = useState<string>("");
  const [evtPayload, setEvtPayload] = useState<string>("{}");
  const [collapsed, setCollapsed] = useState(false);

  // ----------------------------- logger
  useEffect(() => {
    const handler = (type, payload) => {
      const dir: Direction = type.startsWith("cmd.") ? "cmd" : "rs";
      setLogs((l) => [
        {
          id: nextId.current++,
          type,
          direction: dir,
          payload,
          timestamp: Date.now(),
        },
        ...l,
      ]);
    };

    bus.on("*", handler);

    return () => {
      bus.off("*", handler);
    };
  }, []);

  // ----------------------------- helpers
  const safeJSON = (str: string) => {
    try {
      return str.trim() ? JSON.parse(str) : {};
    } catch (e) {
      alert("Invalid JSON payload");
      throw e;
    }
  };

  const emit = () => {
    if (!evtType.trim()) return;
    const payload = safeJSON(evtPayload);
    bus.emit({ type: evtType.trim(), ...payload } as never);
    setEvtType("");
    setEvtPayload("{}");
  };

  // ----------------------------- UI
  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-4 right-4 z-50 w-96 max-w-full text-xs"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="shadow-2xl rounded-2xl backdrop-blur bg-white/70">
        <CardHeader className="flex items-center justify-between gap-2 p-2 border-b">
          <span className="font-semibold">Event Debugger</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "Expand" : "Collapse"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setLogs([])}>
              Clear
            </Button>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="p-2 grid gap-2">
            {/* manual emitter */}
            <div className="grid gap-1">
              <Input
                placeholder="event type e.g. cmd.counter.reset"
                value={evtType}
                onChange={(e) => setEvtType(e.target.value)}
              />
              <Textarea
                className="min-h-[60px] font-mono"
                value={evtPayload}
                onChange={(e) => setEvtPayload(e.target.value)}
              />
              <Button size="sm" onClick={emit}>
                Emit
              </Button>
            </div>

            {/* event log */}
            <div className="max-h-[280px] overflow-auto space-y-1 pr-1">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-1 border rounded-lg p-1 items-start bg-white/60">
                  <span
                    className={log.direction === "cmd" ? "text-blue-600 font-medium" : "text-green-600 font-medium"}
                  >
                    {log.direction.toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="truncate font-semibold text-slate-700">{log.type}</div>
                    <pre className="whitespace-pre-wrap break-words text-slate-600">{JSON.stringify(log.payload)}</pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
