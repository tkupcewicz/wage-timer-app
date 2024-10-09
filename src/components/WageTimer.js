import React, { useState, useEffect } from "react";
import { Play, Pause, DollarSign, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

const WageTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [hourlyWage, setHourlyWage] = useState(0);
  const [earnedMoney, setEarnedMoney] = useState(0);
  const [totalEarned, setTotalEarned] = useState(() => {
    const saved = Cookies.get("totalEarned");
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        const earned = hourlyWage / 3600;
        setEarnedMoney((prevMoney) => prevMoney + earned);
        setTotalEarned((prevTotal) => {
          const newTotal = prevTotal + earned;
          Cookies.set("totalEarned", newTotal.toString(), { expires: 365 });
          return newTotal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, hourlyWage]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setEarnedMoney(0);
  };

  const handleResetTotal = () => {
    setTotalEarned(0);
    Cookies.set("totalEarned", "0", { expires: 365 });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Wage Timer</h1>
        <div className="flex items-center space-x-2">
          <DollarSign className="text-green-500" />
          <Input
            type="number"
            placeholder="Enter hourly wage"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(parseFloat(e.target.value))}
            className="flex-grow"
          />
        </div>
        <div className="text-4xl font-bold text-center">{formatTime(time)}</div>
        <div className="text-2xl font-semibold text-center text-green-600">
          Session: ${earnedMoney.toFixed(2)}
        </div>
        <div className="text-xl font-semibold text-center text-blue-600">
          Total Earned: ${totalEarned.toFixed(2)}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleStartStop}
            className={`flex-grow ${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button
            onClick={handleReset}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <RefreshCw className="mr-2" />
            Reset Session
          </Button>
        </div>
        <Button
          onClick={handleResetTotal}
          className="w-full bg-gray-500 hover:bg-gray-600"
        >
          Reset Total Earned
        </Button>
      </div>
    </div>
  );
};

export default WageTimer;
