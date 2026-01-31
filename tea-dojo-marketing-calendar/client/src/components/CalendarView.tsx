import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (month: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: number) => void;
  isLoading: boolean;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// 2026 calendar data
const monthData: Record<string, { days: number; startDay: number }> = {
  January: { days: 31, startDay: 4 }, // Thursday
  February: { days: 28, startDay: 0 }, // Sunday
  March: { days: 31, startDay: 0 }, // Sunday
  April: { days: 30, startDay: 3 }, // Wednesday
  May: { days: 31, startDay: 5 }, // Friday
  June: { days: 30, startDay: 1 }, // Monday
  July: { days: 31, startDay: 3 }, // Wednesday
  August: { days: 31, startDay: 6 }, // Saturday
  September: { days: 30, startDay: 2 }, // Tuesday
  October: { days: 31, startDay: 4 }, // Thursday
  November: { days: 30, startDay: 0 }, // Sunday
  December: { days: 31, startDay: 2 }, // Tuesday
};

const typeColors: Record<string, string> = {
  "Public Holiday": "bg-tea-green text-white",
  "Cultural": "bg-terracotta text-white",
  "Commercial": "bg-gold text-foreground",
  "Custom": "bg-primary text-primary-foreground",
};

const typeDotColors: Record<string, string> = {
  "Public Holiday": "bg-tea-green",
  "Cultural": "bg-terracotta",
  "Commercial": "bg-gold",
  "Custom": "bg-primary",
};

// Parse date string to get day number(s)
function parseDateToDay(dateStr: string): number[] {
  // Handle formats like "1 Jan", "14 Feb", "17-18 Feb", "13-17 Jan"
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

export default function CalendarView({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  isLoading,
}: CalendarViewProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentMonth = months[currentMonthIndex];
  const { days, startDay } = monthData[currentMonth];

  // Get events for current month
  const monthEvents = useMemo(() => {
    return events.filter(e => e.month === currentMonth);
  }, [events, currentMonth]);

  // Map events to days
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    monthEvents.forEach(event => {
      const days = parseDateToDay(event.date);
      days.forEach(day => {
        if (!map[day]) map[day] = [];
        map[day].push(event);
      });
    });
    return map;
  }, [monthEvents]);

  const goToPrevMonth = () => {
    setDirection(-1);
    setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const grid: (number | null)[] = [];
    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      grid.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= days; i++) {
      grid.push(i);
    }
    return grid;
  }, [startDay, days]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevMonth}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h3
              key={currentMonth}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="font-display text-2xl md:text-3xl font-bold text-foreground"
            >
              {currentMonth} 2026
            </motion.h3>
          </AnimatePresence>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Month Indicator Dots */}
      <div className="flex justify-center gap-1.5 mb-6">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => {
              setDirection(index > currentMonthIndex ? 1 : -1);
              setCurrentMonthIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentMonthIndex
                ? "bg-tea-green w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={month}
          />
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentMonth}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = day ? eventsByDay[day] || [] : [];
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={`min-h-[80px] md:min-h-[100px] p-1 rounded-lg border transition-all ${
                    day
                      ? hasEvents
                        ? "bg-card border-tea-green/30 shadow-sm"
                        : "bg-card/50 border-border hover:border-tea-green/20"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <div className="flex items-start justify-between">
                        <span className={`text-sm font-medium ${
                          hasEvents ? "text-tea-green" : "text-muted-foreground"
                        }`}>
                          {day}
                        </span>
                        {hasEvents && (
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${typeDotColors[event.type]}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Events */}
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event, i) => (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onEditEvent(event)}
                                className={`w-full text-left text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate ${typeColors[event.type]} hover:opacity-90 transition-opacity`}
                              >
                                {event.event}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[250px]">
                              <div className="space-y-1">
                                <p className="font-semibold">{event.event}</p>
                                <p className="text-xs text-muted-foreground">{event.date}</p>
                                {event.campaign && (
                                  <p className="text-xs">Campaign: {event.campaign}</p>
                                )}
                                <div className="flex items-center gap-1 pt-1">
                                  <Badge variant="outline" className="text-[10px]">{event.type}</Badge>
                                  <div className="flex gap-0.5">
                                    {Array(event.priority).fill(0).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-1 pt-2 border-t mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditEvent(event);
                                    }}
                                  >
                                    <Pencil className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteEvent(event.id);
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-[10px] text-muted-foreground px-1">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add Event Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => onAddEvent(currentMonth)}
          className="bg-tea-green hover:bg-tea-green/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event to {currentMonth}
        </Button>
      </div>

      {/* Events List for Current Month */}
      {monthEvents.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display font-semibold text-foreground mb-4">
            {currentMonth} Events ({monthEvents.length})
          </h4>
          <div className="space-y-2">
            {monthEvents.map(event => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border group hover:border-tea-green/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${typeDotColors[event.type]}`} />
                  <div>
                    <p className="font-medium text-foreground">{event.event}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{event.type}</Badge>
                  <div className="flex gap-0.5">
                    {Array(event.priority).fill(0).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                    ))}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${typeDotColors[type]}`} />
            <span className="text-sm text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
