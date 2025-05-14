import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FIRST_TIME_KEY = 'hasSeenGuidanceFinSim';

const FirstTimeGuidance: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(FIRST_TIME_KEY);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleOpenChange = (value: string) => {
    const currentlyOpen = value === "item-1";
    setIsOpen(currentlyOpen);
    if(!currentlyOpen && !localStorage.getItem(FIRST_TIME_KEY)) {
        localStorage.setItem(FIRST_TIME_KEY, 'true');
    }
  };

  return (
    <Accordion 
        type="single" 
        collapsible 
        className="w-full bg-white p-1 rounded-lg shadow"
        value={isOpen ? "item-1" : ""}
        onValueChange={handleOpenChange}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:bg-gray-50 rounded-t-lg">
          First Time Guidance
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3 text-gray-700 border-t">
          Welcome to the negotiation simulation! Here's how to get started:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Enter your team's proposed values for each term in the input fields below.</li>
            <li>The 'Factor Score' influences the overall valuation; adjust it using the slider.</li>
            <li>Your EBITDA, Multiple, and Factor Score will dynamically update the 'Valuation'.</li>
            <li>The 'Interest Rate' also affects the displayed pie chart.</li>
            <li>Use the TBD/OK buttons to mark the status of each term (in a real game, Team 2 would do this).</li>
            <li>Click the menu icons on the left for helpful resources.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default FirstTimeGuidance;