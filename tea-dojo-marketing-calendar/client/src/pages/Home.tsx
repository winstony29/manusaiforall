/**
 * Tea Dojo Marketing Calendar 2026
 * Improved UI with clean aesthetics
 * Design: Warm Tech Naturalism - earthy warmth meets clean technology
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Instagram, Facebook, ChevronLeft, ChevronRight, 
  Plus, Pencil, Trash2, Star, X, Clock, Sparkles, Check, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// TikTok Icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Types
type CalendarEvent = {
  id: number;
  month: string;
  date: string;
  event: string;
  type: "Public Holiday" | "Cultural" | "Commercial" | "Custom";
  priority: number;
  campaign: string | null;
  isDefault: number;
};

type WeeklySchedule = {
  id: number;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  isDefault: number;
};

// Completion state type for weekly schedule
type CompletionState = {
  [weekKey: string]: {
    [day: string]: {
      instagram: boolean;
      tiktok: boolean;
      facebook: boolean;
    };
  };
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = [2025, 2026, 2027, 2028];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const orderedDays: WeeklySchedule["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 2026 calendar data
const monthData: Record<number, Record<string, { days: number; startDay: number }>> = {
  2025: {
    January: { days: 31, startDay: 3 },
    February: { days: 28, startDay: 6 },
    March: { days: 31, startDay: 6 },
    April: { days: 30, startDay: 2 },
    May: { days: 31, startDay: 4 },
    June: { days: 30, startDay: 0 },
    July: { days: 31, startDay: 2 },
    August: { days: 31, startDay: 5 },
    September: { days: 30, startDay: 1 },
    October: { days: 31, startDay: 3 },
    November: { days: 30, startDay: 6 },
    December: { days: 31, startDay: 1 },
  },
  2026: {
    January: { days: 31, startDay: 4 },
    February: { days: 28, startDay: 0 },
    March: { days: 31, startDay: 0 },
    April: { days: 30, startDay: 3 },
    May: { days: 31, startDay: 5 },
    June: { days: 30, startDay: 1 },
    July: { days: 31, startDay: 3 },
    August: { days: 31, startDay: 6 },
    September: { days: 30, startDay: 2 },
    October: { days: 31, startDay: 4 },
    November: { days: 30, startDay: 0 },
    December: { days: 31, startDay: 2 },
  },
  2027: {
    January: { days: 31, startDay: 5 },
    February: { days: 28, startDay: 1 },
    March: { days: 31, startDay: 1 },
    April: { days: 30, startDay: 4 },
    May: { days: 31, startDay: 6 },
    June: { days: 30, startDay: 2 },
    July: { days: 31, startDay: 4 },
    August: { days: 31, startDay: 0 },
    September: { days: 30, startDay: 3 },
    October: { days: 31, startDay: 5 },
    November: { days: 30, startDay: 1 },
    December: { days: 31, startDay: 3 },
  },
  2028: {
    January: { days: 31, startDay: 6 },
    February: { days: 29, startDay: 2 },
    March: { days: 31, startDay: 3 },
    April: { days: 30, startDay: 6 },
    May: { days: 31, startDay: 1 },
    June: { days: 30, startDay: 4 },
    July: { days: 31, startDay: 6 },
    August: { days: 31, startDay: 2 },
    September: { days: 30, startDay: 5 },
    October: { days: 31, startDay: 0 },
    November: { days: 30, startDay: 3 },
    December: { days: 31, startDay: 5 },
  },
};

const typeColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Public Holiday": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Cultural": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Commercial": { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  "Custom": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
};

// Parse date string to get day number(s)
function parseDateToDay(dateStr: string): number[] {
  const match = dateStr.match(/^(\d+)(?:-(\d+))?\s/);
  if (match) {
    const start = parseInt(match[1]);
    const end = match[2] ? parseInt(match[2]) : start;
    const days: number[] = [];
    for (let i = start; i <= end; i++) {
      days.push(i);
    }
    return days;
  }
  return [];
}

// Helper to get the date for a given day of week in a specific week
function getDateForDayInWeek(weekStartDate: Date, dayIndex: number): Date {
  const date = new Date(weekStartDate);
  date.setDate(date.getDate() + dayIndex);
  return date;
}

// Helper to format date as "Jan 1"
function formatShortDate(date: Date): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

// Helper to get week key for completion state
function getWeekKey(weekStart: Date): string {
  return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: string } | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Completion state for weekly schedule (stored locally)
  const [completionState, setCompletionState] = useState<CompletionState>({});
  
  // Week navigation - start with first week of January 2026
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return new Date(2025, 11, 29); // Dec 29, 2025 (Monday)
  });

  // Event dialog state
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    month: "",
    date: "",
    event: "",
    type: "Custom" as CalendarEvent["type"],
    priority: 2,
    campaign: "",
  });

  // Schedule dialog state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WeeklySchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    day: "Monday" as WeeklySchedule["day"],
    instagram: "",
    tiktok: "",
    facebook: "",
  });

  // tRPC queries
  const utils = trpc.useUtils();
  const { data: calendarEvents = [] } = trpc.calendar.list.useQuery();
  const { data: weeklySchedules = [] } = trpc.schedule.list.useQuery();

  // Mutations
  const createEvent = trpc.calendar.create.useMutation({
    onSuccess: () => {
      utils.calendar.list.invalidate();
      setShowEventDialog(false);
      resetEventForm();
      toast.success("Event added successfully");
    },
    onError: () => toast.error("Failed to add event"),
  });

  const updateEvent = trpc.calendar.update.useMutation({
    onSuccess: () => {
      utils.calendar.list.invalidate();
      setShowEventDialog(false);
      setEditingEvent(null);
      resetEventForm();
      toast.success("Event updated successfully");
    },
    onError: () => toast.error("Failed to update event"),
  });

  const deleteEvent = trpc.calendar.delete.useMutation({
    onSuccess: () => {
      utils.calendar.list.invalidate();
      toast.success("Event deleted successfully");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const updateSchedule = trpc.schedule.update.useMutation({
    onSuccess: () => {
      utils.schedule.list.invalidate();
      setShowScheduleDialog(false);
      setEditingSchedule(null);
      toast.success("Schedule updated successfully");
    },
    onError: () => toast.error("Failed to update schedule"),
  });

  const currentMonth = months[currentMonthIndex];
  const yearData = monthData[currentYear] || monthData[2026];
  const { days, startDay } = yearData[currentMonth] || { days: 31, startDay: 0 };

  // Get events for current month
  const monthEvents = useMemo(() => {
    return calendarEvents.filter(e => e.month === currentMonth);
  }, [calendarEvents, currentMonth]);

  // Map events to days
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    monthEvents.forEach(event => {
      const days = parseDateToDay(event.date);
      days.forEach(day => {
        if (!map[day]) map[day] = [];
        map[day].push(event as CalendarEvent);
      });
    });
    return map;
  }, [monthEvents]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const grid: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      grid.push(null);
    }
    for (let i = 1; i <= days; i++) {
      grid.push(i);
    }
    // Pad to complete weeks
    while (grid.length % 7 !== 0) {
      grid.push(null);
    }
    return grid;
  }, [startDay, days]);

  // Week dates for week view
  const weekDates = useMemo(() => {
    const dates: { date: Date; dayName: WeeklySchedule["day"]; formatted: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = getDateForDayInWeek(currentWeekStart, i);
      dates.push({
        date,
        dayName: orderedDays[i],
        formatted: formatShortDate(date),
      });
    }
    return dates;
  }, [currentWeekStart]);

  // Get week range string
  const weekRangeString = useMemo(() => {
    const startDate = weekDates[0].date;
    const endDate = weekDates[6].date;
    const startMonth = months[startDate.getMonth()];
    const endMonth = months[endDate.getMonth()];
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
      return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}, ${endDate.getFullYear()}`;
    }
  }, [weekDates]);

  // Navigation
  const goToPrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonthIndex(0);
    setCurrentYear(2026);
    setSelectedDate(null);
    setCurrentWeekStart(new Date(2025, 11, 29));
  };

  const goToPrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  // Toggle completion state
  const toggleCompletion = (day: string, platform: "instagram" | "tiktok" | "facebook") => {
    const weekKey = getWeekKey(currentWeekStart);
    setCompletionState(prev => {
      const weekState = prev[weekKey] || {};
      const dayState = weekState[day] || { instagram: false, tiktok: false, facebook: false };
      return {
        ...prev,
        [weekKey]: {
          ...weekState,
          [day]: {
            ...dayState,
            [platform]: !dayState[platform],
          },
        },
      };
    });
  };

  // Check if a post is completed
  const isCompleted = (day: string, platform: "instagram" | "tiktok" | "facebook"): boolean => {
    const weekKey = getWeekKey(currentWeekStart);
    return completionState[weekKey]?.[day]?.[platform] || false;
  };

  // Form handlers
  const resetEventForm = () => {
    setEventForm({
      month: "",
      date: "",
      event: "",
      type: "Custom",
      priority: 2,
      campaign: "",
    });
  };

  const handleAddEvent = (day?: number, month?: string) => {
    setEditingEvent(null);
    setEventForm({
      month: month || currentMonth,
      date: day ? `${day} ${(month || currentMonth).slice(0, 3)}` : "",
      event: "",
      type: "Custom",
      priority: 2,
      campaign: "",
    });
    setShowEventDialog(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      month: event.month,
      date: event.date,
      event: event.event,
      type: event.type,
      priority: event.priority,
      campaign: event.campaign || "",
    });
    setShowEventDialog(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.month || !eventForm.date || !eventForm.event) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editingEvent) {
      updateEvent.mutate({ id: editingEvent.id, ...eventForm });
    } else {
      createEvent.mutate(eventForm);
    }
  };

  const handleEditSchedule = (schedule: WeeklySchedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      day: schedule.day,
      instagram: schedule.instagram || "",
      tiktok: schedule.tiktok || "",
      facebook: schedule.facebook || "",
    });
    setShowScheduleDialog(true);
  };

  const handleSaveSchedule = () => {
    if (!editingSchedule) return;
    updateSchedule.mutate({ id: editingSchedule.id, ...scheduleForm });
  };

  // Get schedule by day name
  const getScheduleByDay = (day: WeeklySchedule["day"]) => {
    return weeklySchedules.find(s => s.day === day);
  };

  // Select month/year from picker
  const handleSelectMonth = (monthIdx: number, year: number) => {
    setCurrentMonthIndex(monthIdx);
    setCurrentYear(year);
    setShowMonthPicker(false);
    setSelectedDate(null);
  };

  // Selected day details
  const selectedDayEvents = selectedDate ? (eventsByDay[selectedDate.day] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-lg">茶</span>
              </div>
              <div>
                <h1 className="font-bold text-stone-900">Tea Dojo</h1>
                <p className="text-xs text-stone-500">Marketing Calendar</p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "month"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "week"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Week
              </button>
            </div>

            {/* Add Event Button */}
            <Button
              onClick={() => handleAddEvent()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "month" ? (
          /* ==================== MONTH VIEW ==================== */
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Navigation buttons - fixed position on left */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-500" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-stone-500" />
                  </button>
                </div>
                
                {/* Month/Year Picker */}
                <Popover open={showMonthPicker} onOpenChange={setShowMonthPicker}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-3xl font-bold text-stone-900 hover:bg-stone-100 px-3 py-1 rounded-lg transition-colors">
                      <span className="text-emerald-600">{currentMonth}</span>{" "}
                      <span className="text-stone-400 font-normal">{currentYear}</span>
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      {/* Year Selection */}
                      <div>
                        <label className="text-sm font-medium text-stone-600 mb-2 block">Year</label>
                        <div className="flex gap-2 flex-wrap">
                          {years.map(year => (
                            <button
                              key={year}
                              onClick={() => setCurrentYear(year)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                currentYear === year
                                  ? "bg-emerald-600 text-white"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Month Selection */}
                      <div>
                        <label className="text-sm font-medium text-stone-600 mb-2 block">Month</label>
                        <div className="grid grid-cols-3 gap-2">
                          {months.map((month, idx) => (
                            <button
                              key={month}
                              onClick={() => handleSelectMonth(idx, currentYear)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentMonthIndex === idx
                                  ? "bg-emerald-600 text-white"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              {month.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-200/50">
              {/* Week Day Headers */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-stone-50 to-stone-100 border-b border-stone-200">
                {weekDays.map((day, i) => (
                  <div
                    key={day}
                    className={`p-4 text-center text-sm font-semibold ${
                      i === 0 || i === 6 ? "text-stone-400" : "text-stone-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayEvents = day ? eventsByDay[day] || [] : [];
                  const isSelected = selectedDate?.day === day && selectedDate?.month === currentMonth;
                  const isWeekend = index % 7 === 0 || index % 7 === 6;

                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate({ day, month: currentMonth })}
                      className={`min-h-[120px] p-2 border-b border-r border-stone-100 transition-all cursor-pointer ${
                        day ? "hover:bg-stone-50" : "bg-stone-50/30"
                      } ${isSelected ? "bg-emerald-50 ring-2 ring-emerald-500 ring-inset" : ""} ${
                        isWeekend && day ? "bg-stone-50/50" : ""
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isSelected ? "text-emerald-600" : dayEvents.length > 0 ? "text-emerald-600" : "text-stone-400"
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event, i) => {
                              const colors = typeColors[event.type];
                              return (
                                <div
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded-md truncate ${colors.bg} ${colors.text}`}
                                >
                                  {event.event}
                                </div>
                              );
                            })}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-stone-400 pl-2">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              {Object.entries(typeColors).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className="text-stone-600">{type}</span>
                </div>
              ))}
            </div>

            {/* Selected Day Details */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-6 border border-stone-200/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900">
                        {selectedDate.month} {selectedDate.day}, {currentYear}
                      </h3>
                      <p className="text-stone-500">
                        {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""} scheduled
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddEvent(selectedDate.day, selectedDate.month)}
                        className="rounded-full"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Event
                      </Button>
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                      >
                        <X className="w-4 h-4 text-stone-400" />
                      </button>
                    </div>
                  </div>

                  {selectedDayEvents.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedDayEvents.map((event) => {
                        const colors = typeColors[event.type];
                        return (
                          <div
                            key={event.id}
                            className={`p-4 rounded-xl border-2 border-transparent hover:border-stone-200 transition-all group ${colors.bg}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                  <span className={`font-semibold ${colors.text}`}>{event.event}</span>
                                </div>
                                <p className="text-sm text-stone-500 mb-2">{event.date}</p>
                                {event.campaign && (
                                  <p className="text-sm text-stone-600">
                                    <Sparkles className="w-3 h-3 inline mr-1" />
                                    {event.campaign}
                                  </p>
                                )}
                                <div className="flex gap-0.5 mt-2">
                                  {Array(event.priority).fill(0).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-stone-500" />
                                </button>
                                <button
                                  onClick={() => deleteEvent.mutate({ id: event.id })}
                                  className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No events scheduled for this day</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ==================== WEEK VIEW (Table Format with Checkboxes) ==================== */
          <div className="space-y-6">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-stone-900">
                  <span className="text-emerald-600">Weekly</span>{" "}
                  <span className="text-stone-400 font-normal">Posting Schedule</span>
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevWeek}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-500" />
                  </button>
                  <span className="text-sm font-medium text-stone-600 min-w-[200px] text-center">
                    {weekRangeString}
                  </span>
                  <button
                    onClick={goToNextWeek}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-stone-500" />
                  </button>
                </div>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>
            </div>

            <p className="text-stone-500">Click on a post to mark it as completed. Completed posts will appear darker.</p>

            {/* Schedule Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-200/50">
              {/* Table Header */}
              <div className="grid grid-cols-5 bg-gradient-to-r from-stone-50 to-stone-100 border-b border-stone-200">
                <div className="p-4 font-semibold text-stone-700">Day</div>
                <div className="p-4 font-semibold text-stone-700 flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  Instagram
                </div>
                <div className="p-4 font-semibold text-stone-700 flex items-center gap-2">
                  <TikTokIcon className="w-5 h-5 text-stone-800" />
                  TikTok
                </div>
                <div className="p-4 font-semibold text-stone-700 flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Facebook
                </div>
                <div className="p-4 font-semibold text-stone-700 text-center">Actions</div>
              </div>

              {/* Table Rows */}
              {weekDates.map((weekDate) => {
                const schedule = getScheduleByDay(weekDate.dayName);
                const isWeekend = weekDate.dayName === "Saturday" || weekDate.dayName === "Sunday";
                
                return (
                  <div
                    key={weekDate.dayName}
                    className={`grid grid-cols-5 border-b border-stone-100 last:border-b-0 transition-colors hover:bg-stone-50 ${
                      isWeekend ? "bg-stone-50/50" : ""
                    }`}
                  >
                    {/* Day with Date */}
                    <div className="p-4 flex flex-col justify-center">
                      <span className={`font-semibold ${isWeekend ? "text-stone-400" : "text-stone-700"}`}>
                        {weekDate.dayName}
                      </span>
                      <span className="text-sm text-stone-400">{weekDate.formatted}</span>
                    </div>

                    {/* Instagram */}
                    <div className="p-4">
                      {schedule?.instagram ? (
                        <button
                          onClick={() => toggleCompletion(weekDate.dayName, "instagram")}
                          className={`w-full text-left rounded-lg p-3 border transition-all ${
                            isCompleted(weekDate.dayName, "instagram")
                              ? "bg-stone-200 border-stone-300"
                              : "border-stone-200 bg-white hover:border-pink-300 hover:shadow-sm"
                          }`}
                        >
                          <p className={`text-sm whitespace-pre-line ${
                            isCompleted(weekDate.dayName, "instagram")
                              ? "text-stone-400 line-through"
                              : "text-stone-700"
                          }`}>{schedule.instagram}</p>
                        </button>
                      ) : (
                        <button className="w-full text-left rounded-lg p-3 border border-dashed border-stone-200 text-stone-300 text-sm">—</button>
                      )}
                    </div>

                    {/* TikTok */}
                    <div className="p-4">
                      {schedule?.tiktok ? (
                        <button
                          onClick={() => toggleCompletion(weekDate.dayName, "tiktok")}
                          className={`w-full text-left rounded-lg p-3 border transition-all ${
                            isCompleted(weekDate.dayName, "tiktok")
                              ? "bg-stone-200 border-stone-300"
                              : "border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm"
                          }`}
                        >
                          <p className={`text-sm whitespace-pre-line ${
                            isCompleted(weekDate.dayName, "tiktok")
                              ? "text-stone-400 line-through"
                              : "text-stone-700"
                          }`}>{schedule.tiktok}</p>
                        </button>
                      ) : (
                        <button className="w-full text-left rounded-lg p-3 border border-dashed border-stone-200 text-stone-300 text-sm">—</button>
                      )}
                    </div>

                    {/* Facebook */}
                    <div className="p-4">
                      {schedule?.facebook ? (
                        <button
                          onClick={() => toggleCompletion(weekDate.dayName, "facebook")}
                          className={`w-full text-left rounded-lg p-3 border transition-all ${
                            isCompleted(weekDate.dayName, "facebook")
                              ? "bg-stone-200 border-stone-300"
                              : "border-stone-200 bg-white hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          <p className={`text-sm whitespace-pre-line ${
                            isCompleted(weekDate.dayName, "facebook")
                              ? "text-stone-400 line-through"
                              : "text-stone-700"
                          }`}>{schedule.facebook}</p>
                        </button>
                      ) : (
                        <button className="w-full text-left rounded-lg p-3 border border-dashed border-stone-200 text-stone-300 text-sm">—</button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex items-center justify-center">
                      {schedule && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSchedule(schedule as WeeklySchedule)}
                          className="rounded-full hover:bg-stone-100"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Platform Tips */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Instagram</h4>
                    <p className="text-xs text-stone-500">5-7 posts/week + Stories</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>Best times: 10AM, 12PM, 7PM</span>
                  </div>
                  <p>Focus on visual content, lifestyle shots, and product showcases</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center shadow-lg shadow-stone-500/20">
                    <TikTokIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">TikTok</h4>
                    <p className="text-xs text-stone-500">4-5 videos/week</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>Best times: 7-8 PM</span>
                  </div>
                  <p>Focus on trending content, fun videos, and behind-the-scenes</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Facebook</h4>
                    <p className="text-xs text-stone-500">3-4 posts/week</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Best times: 11AM-12PM</span>
                  </div>
                  <p>Focus on community content, events, and family-oriented posts</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update the event details below." : "Add a new event to your marketing calendar."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Select value={eventForm.month} onValueChange={(v) => setEventForm({ ...eventForm, month: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  placeholder="e.g., 15 Mar"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event Name *</Label>
              <Input
                id="event"
                value={eventForm.event}
                onChange={(e) => setEventForm({ ...eventForm, event: e.target.value })}
                placeholder="e.g., Store Anniversary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={eventForm.type} onValueChange={(v: CalendarEvent["type"]) => setEventForm({ ...eventForm, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public Holiday">Public Holiday</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (1-4)</Label>
                <Select value={String(eventForm.priority)} onValueChange={(v) => setEventForm({ ...eventForm, priority: Number(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Low</SelectItem>
                    <SelectItem value="2">2 - Medium</SelectItem>
                    <SelectItem value="3">3 - High</SelectItem>
                    <SelectItem value="4">4 - Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign Name</Label>
              <Input
                id="campaign"
                value={eventForm.campaign}
                onChange={(e) => setEventForm({ ...eventForm, campaign: e.target.value })}
                placeholder="e.g., Anniversary Special"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editingEvent ? "Save Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingSchedule?.day} Schedule
            </DialogTitle>
            <DialogDescription>
              Update the posting schedule for {editingSchedule?.day}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </Label>
              <Textarea
                id="instagram"
                value={scheduleForm.instagram}
                onChange={(e) => setScheduleForm({ ...scheduleForm, instagram: e.target.value })}
                placeholder="e.g., Product Feature&#10;10:00 AM"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <TikTokIcon className="w-4 h-4 text-stone-800" />
                TikTok
              </Label>
              <Textarea
                id="tiktok"
                value={scheduleForm.tiktok}
                onChange={(e) => setScheduleForm({ ...scheduleForm, tiktok: e.target.value })}
                placeholder="e.g., Trending Content&#10;7:00 PM"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </Label>
              <Textarea
                id="facebook"
                value={scheduleForm.facebook}
                onChange={(e) => setScheduleForm({ ...scheduleForm, facebook: e.target.value })}
                placeholder="e.g., Community Post&#10;11:00 AM"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
