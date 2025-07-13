import { Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

type Preference = "AM" | "PM" | "AM/PM";

interface PreferenceButtonsProps {
  selectedPreference: Preference;
  onPreferenceChange: (preference: Preference) => void;
}

const PreferenceButtons = ({ selectedPreference, onPreferenceChange }: PreferenceButtonsProps) => {
  return (
    <div className="animate-fade-in my-4 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
      <Button
        variant={selectedPreference === "AM" ? "default" : "outline"}
        className={`flex w-full max-w-64 items-center justify-center sm:w-auto ${
          selectedPreference === "AM" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary"
        }`}
        onClick={() => onPreferenceChange("AM")}
      >
        <Clock className="mr-2 h-4 w-4" />
        Buổi sáng
      </Button>

      <Button
        variant={selectedPreference === "PM" ? "default" : "outline"}
        className={`flex w-full max-w-64 items-center justify-center sm:w-auto ${
          selectedPreference === "PM" ? "bg-primary hover:bg-primary" : "hover:bg-primary"
        }`}
        onClick={() => onPreferenceChange("PM")}
      >
        <Clock className="mr-2 h-4 w-4" />
        Buổi tối
      </Button>

      <Button
        variant={selectedPreference === "AM/PM" ? "default" : "outline"}
        className={`flex w-full max-w-64 items-center justify-center sm:w-auto ${
          selectedPreference === "AM/PM" ? "bg-primary hover:bg-primary" : "hover:bg-primary"
        }`}
        onClick={() => onPreferenceChange("AM/PM")}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Cả ngày
      </Button>
    </div>
  );
};

export default PreferenceButtons;
