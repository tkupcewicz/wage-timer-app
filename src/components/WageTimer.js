import React, { useState, useEffect } from "react";
import { Play, Pause, DollarSign, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "PLN", symbol: "zł" },
];

const WageTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [hourlyWage, setHourlyWage] = useState(0);
  const [earnedMoney, setEarnedMoney] = useState(0);
  const [totalEarned, setTotalEarned] = useState(() => {
    const saved = Cookies.get("totalEarned");
    return saved ? parseFloat(saved) : 0;
  });
  const [currency, setCurrency] = useState(() => {
    const saved = Cookies.get("currency");
    return saved || "USD";
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        const earned = hourlyWage / 3600;
        setEarnedMoney((prevMoney) => {
          const newMoney = prevMoney + earned;
          // Update the tab title
          document.title = `${formatMoney(newMoney)} - Wage Timer`;
          return newMoney;
        });
        setTotalEarned((prevTotal) => {
          const newTotal = prevTotal + earned;
          Cookies.set("totalEarned", newTotal.toString(), { expires: 365 });
          return newTotal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, hourlyWage, currency]);

  useEffect(() => {
    Cookies.set("currency", currency, { expires: 365 });
  }, [currency]);

  // Reset the tab title when the component unmounts or when the timer is reset
  useEffect(() => {
    return () => {
      document.title = "Wage Timer";
    };
  }, []);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setEarnedMoney(0);
    document.title = "Wage Timer";
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

  const formatMoney = (amount) => {
    const symbol = currencies.find((c) => c.code === currency).symbol;
    return `${amount.toFixed(2)} ${symbol}`;
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
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
        <div className="text-4xl font-bold text-center">{formatTime(time)}</div>
        <div className="text-2xl font-semibold text-center text-green-600">
          Session: {formatMoney(earnedMoney)}
        </div>
        <div className="text-xl font-semibold text-center text-blue-600">
          Total Earned: {formatMoney(totalEarned)}
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
