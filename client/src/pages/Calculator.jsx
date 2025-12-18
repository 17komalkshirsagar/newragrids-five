import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, IndianRupee, Clock } from "lucide-react";

export default function Calculator() {
  const [monthlyBill, setMonthlyBill] = useState("");
  const [location, setLocation] = useState("");
  const [systemSize, setSystemSize] = useState("");
  const [results, setResults] = useState(null);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh"
  ];

  const calculateSavings = () => {
    if (!monthlyBill || !location || !systemSize) {
      alert("Please fill in all fields");
      return;
    }

    const bill = parseFloat(monthlyBill);
    const size = parseFloat(systemSize);

    // Simple calculation (in reality, this would be more complex)
    const monthlySavings = Math.round(size * 150 * 0.8); // Approximate savings per kW
    const percentageSavings = Math.min(Math.round((monthlySavings / bill) * 100), 90);
    const systemCost = size * 50000; // Approximate cost per kW
    const paybackYears = Math.round((systemCost / (monthlySavings * 12)) * 10) / 10;

    setResults({
      monthlySavings,
      percentageSavings,
      paybackYears,
      annualSavings: monthlySavings * 12,
      systemCost,
    });
  };

  return (
    <div className="py-20 px-4 w-full">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <CalcIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Savings Calculator</h1>
          <p className="text-lg text-muted-foreground">
            Discover how much you can save by switching to solar energy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyBill">Average Monthly Electricity Bill (₹)</Label>
                  <Input
                    id="monthlyBill"
                    type="number"
                    placeholder="e.g., 5000"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemSize">Solar System Size (kW)</Label>
                  <Input
                    id="systemSize"
                    type="number"
                    placeholder="e.g., 5"
                    value={systemSize}
                    onChange={(e) => setSystemSize(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Typical homes use 3-10 kW systems
                  </p>
                </div>

                <Button onClick={calculateSavings} className="w-full" size="lg">
                  Calculate Savings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                      <CardTitle>Your Potential Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-primary-foreground/10 rounded-lg">
                          <div className="flex items-center">
                            <IndianRupee className="h-6 w-6 mr-2" />
                            <div>
                              <p className="text-sm opacity-90">Monthly Savings</p>
                              <p className="text-2xl font-bold">₹{results.monthlySavings.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold">{results.percentageSavings}%</p>
                            <p className="text-sm opacity-90">Reduction</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-primary-foreground/10 rounded-lg">
                          <div className="flex items-center">
                            <IndianRupee className="h-6 w-6 mr-2" />
                            <div>
                              <p className="text-sm opacity-90">Annual Savings</p>
                              <p className="text-2xl font-bold">₹{results.annualSavings.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-primary-foreground/10 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="h-6 w-6 mr-2" />
                            <div>
                              <p className="text-sm opacity-90">Payback Period</p>
                              <p className="text-2xl font-bold">{results.paybackYears} years</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-primary-foreground/10 rounded-lg">
                          <p className="text-sm opacity-90 mb-1">Estimated System Cost</p>
                          <p className="text-xl font-bold">₹{results.systemCost.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-primary-foreground/20">
                        <p className="text-sm opacity-90 text-center">
                          These are estimates. Contact us for a detailed analysis and personalized quote.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="h-full flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center">
                      <CalcIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Fill in your details to see your potential savings
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
