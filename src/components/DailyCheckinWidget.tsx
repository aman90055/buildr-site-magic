import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Gift, CheckCircle2, Loader2 } from "lucide-react";
import { useDailyCheckin } from "@/hooks/useDailyCheckin";

const DAYS = 7;

const DailyCheckinWidget = () => {
  const { loading, claiming, claimedToday, currentStreak, history, claim } = useDailyCheckin();

  const todayStr = new Date().toISOString().slice(0, 10);
  const recentDates = new Set(history.map(h => h.checkin_date));

  // build 7-day window ending today
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (DAYS - 1 - i));
    const iso = d.toISOString().slice(0, 10);
    return { iso, label: d.toLocaleDateString(undefined, { weekday: "short" })[0], done: recentDates.has(iso), isToday: iso === todayStr };
  });

  const nextReward = Math.min(5 + currentStreak, 25) + ((currentStreak + 1) % 7 === 0 ? 10 : 0);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 text-white">
        <CardTitle className="flex items-center justify-between text-white text-base">
          <span className="flex items-center gap-2"><Flame className="w-5 h-5" /> Daily Check-in</span>
          <span className="text-sm font-normal opacity-90">{currentStreak} day streak</span>
        </CardTitle>
      </div>
      <CardContent className="pt-4 space-y-4">
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <>
            <div className="flex justify-between gap-1">
              {days.map(d => (
                <div key={d.iso} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    d.done
                      ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white"
                      : d.isToday
                        ? "border-2 border-orange-500 text-orange-500"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {d.done ? <CheckCircle2 className="w-4 h-4" /> : d.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Next: +{nextReward} credits</span>
              {currentStreak > 0 && currentStreak % 7 !== 0 && (
                <span>🎁 in {7 - (currentStreak % 7)} days</span>
              )}
            </div>

            <Button
              onClick={claim}
              disabled={claimedToday || claiming}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
            >
              {claiming ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Claiming…</>
                : claimedToday ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Claimed today</>
                : <><Gift className="w-4 h-4 mr-2" /> Claim Daily Reward</>}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyCheckinWidget;
