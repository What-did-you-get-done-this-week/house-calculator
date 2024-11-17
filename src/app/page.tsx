'use client';

// House Calculator - Last updated: March 2024 - v2.0
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import Script from 'next/script';
import { InfoIcon } from 'lucide-react';

// ... existing imports ...

// Add type declaration for gtag
declare global {
  function gtag(...args: any[]): void;
}

// Add this helper function at the top of your component
const safeGtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// First, declare the updateResult function
const updateResult = (
  months: number,
  currentHousePrice: number,
  downPaymentAmount: number,
  commissionAmount: number,
  propertyTaxAmount: number,
  notaryFee: number,
  appraisalFee: number,
  mortgageBroker: number,
  mortgageAdvisor: number,
  landRegistryFee: number,
  totalNeeded: number,
  calculatedMonthlySavings: number
) => {
  const yearsNeeded = Math.floor(months / 12);
  // ... rest of the function
};

export default function Component() {
const [result, setResult] = useState<{ type: 'error' | 'success'; message: string } | null>(null)
const [annualResults, setAnnualResults] = useState<{ year: number; savings: number; housePrice: number }[]>([])
const [formData, setFormData] = useState({
  targetHousePrice: '',
  currentSavings: '0',
  monthlySavings: '',
  extraPaychecks: '0',
  downPaymentPercentage: '20',
  propertyTax: '5',
  agentCommission: '3',
  isAgentCommissionPercentage: true,
  housePriceIncrease: '5',
  notaryFee: '500',
  appraisalFee: '500',
  mortgageBroker: '0',
  mortgageAdvisor: '0',
  landRegistryFee: '500',
})
const [sliderValue, setSliderValue] = useState<number[]>([0])
const resultRef = useRef<HTMLDivElement>(null)
const [language, setLanguage] = useState<'en' | 'es'>('en')
const [currency, setCurrency] = useState<'$' | '€'>('$')
const [isLoading, setIsLoading] = useState(true);

const getCurrencyFromLocation = async () => {
  try {
    console.log('Starting location fetch...');
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      cache: 'no-store'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }

    const responseText = await response.text(); // First get the raw text
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText); // Then parse it
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Failed to parse JSON: ${parseError.message}`);
    }

    if (!data || !data.country_code) {
      console.error('Invalid data structure:', data);
      throw new Error(`Invalid response data structure: ${JSON.stringify(data)}`);
    }

    const euroCountries = ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];
    
    if (data.country_code === 'ES') {
      return { currency: '€', countryCode: 'ES' };
    }
    
    const currency = euroCountries.includes(data.country_code) ? '€' : '$';
    return { currency, countryCode: data.country_code };
    
  } catch (error) {
    console.error('Detailed error in getCurrencyFromLocation:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Add more detailed timezone fallback logging
    try {
      console.log('Attempting timezone fallback...');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Detected timezone:', timeZone);
      const europeTimezones = ['Europe/Madrid', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome'];
      const currency = europeTimezones.includes(timeZone) ? '€' : '$';
      const countryCode = europeTimezones.includes(timeZone) ? 'ES' : 'US';
      
      return { currency, countryCode };
    } catch (tzError) {
      console.error('Detailed timezone error:', {
        name: tzError.name,
        message: tzError.message,
        stack: tzError.stack
      });
      // Final fallback: Default to Euro
      return { currency: '€', countryCode: 'ES' };
    }
    
    throw error; // Re-throw to be caught by the useEffect
  }
};

useEffect(() => {
  let isMounted = true;

  const initializeLocalization = async () => {
    console.log('Starting initialization...');
    try {
      setIsLoading(true);
      console.log('Loading state set to true');

      const result = await getCurrencyFromLocation();
      console.log('Location detection result:', result);

      if (!isMounted) {
        console.log('Component unmounted, skipping state updates');
        return;
      }

      setCurrency(result.currency as '$' | '€');
      
      const spanishSpeakingCountries = ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ'];
      
      setLanguage(spanishSpeakingCountries.includes(result.countryCode) ? 'es' : 'en');
    } catch (error) {
      console.error('Detailed initialization error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      if (isMounted) {
        console.log('Setting fallback values due to error');
        setCurrency('€');
        setLanguage('es');
      }
    } finally {
      if (isMounted) {
        console.log('Setting loading state to false');
        setIsLoading(false);
      }
    }
  };

  initializeLocalization();

  return () => {
    console.log('Cleanup: marking component as unmounted');
    isMounted = false;
  };
}, []);

const translations = {
  en: {
    title: "House Calculator",
    subtitle: "Calculate when you can buy a house",
    monthlyIncome: "Monthly Income",
    monthlyExpenses: "Monthly Expenses",
    monthlySavings: "Monthly Savings",
    currentSavings: "Current Savings",
    targetHousePrice: "Target House Price",
    calculate: "Calculate",
    year: "Year",
    totalSavings: "Total Savings",
    feedbackButton: "Improvements & Bugs",
    mandatoryFieldsError: "Please fill in the following mandatory fields: ",
    buyHouseIn: "You can buy a house in",
    cannotAfford: "With your current savings rate, you cannot afford this house within 30 years"
  },
  es: {
    title: "Calculadora de Vivienda",
    subtitle: "Calcula cuándo podrás comprar una casa",
    monthlyIncome: "Ingresos Mensuales",
    monthlyExpenses: "Gastos Mensuales",
    monthlySavings: "Ahorros Mensuales",
    currentSavings: "Ahorros Actuales",
    targetHousePrice: "Precio Objetivo de la Vivienda",
    calculate: "Calcular",
    year: "Año",
    totalSavings: "Ahorros totales",
    feedbackButton: "Mejoras y Errores",
    mandatoryFieldsError: "Por favor, rellena los siguientes campos obligatorios: ",
    buyHouseIn: "Podrás comprar una casa en",
    cannotAfford: "Con tu tasa de ahorro actual, no podrás permitirte esta casa en 30 años"
  }
};

const t = translations[language]

const formatNumber = (value: string) => {
  const number = value.replace(/\D/g, '')
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  let formattedValue = value

  if ([
    'targetHousePrice', 
    'currentSavings', 
    'monthlySavings', 
    'extraPaychecks', 
    'agentCommission', 
    'downPaymentPercentage', 
    'propertyTax', 
    'housePriceIncrease',
    'notaryFee', 
    'appraisalFee', 
    'mortgageBroker', 
    'mortgageAdvisor', 
    'landRegistryFee'
  ].includes(name)) {
    formattedValue = formatNumber(value)
  }

  setFormData(prev => ({ ...prev, [name]: formattedValue }))
}

const handleSwitchChange = () => {
  setFormData(prev => ({
    ...prev,
    isAgentCommissionPercentage: !prev.isAgentCommissionPercentage,
    agentCommission: prev.isAgentCommissionPercentage ? '' : '3'
  }))
}

const parseFormattedNumber = (value: string) => {
  return parseFloat(value.replace(/,/g, '')) || 0
}

// Then use it in the useCallback dependency array
const calculateDownPaymentTime = useCallback(() => {
  const missingFields = []
  if (!formData.targetHousePrice) missingFields.push(t.targetHousePrice)
  if (!formData.monthlySavings) missingFields.push(t.monthlySavings)

  if (missingFields.length > 0) {
    setResult({ type: 'error', message: `${t.mandatoryFieldsError}${missingFields.join(", ")}.` })
  } else {
    const currentSavings = parseFormattedNumber(formData.currentSavings)
    const monthlySavings = parseFormattedNumber(formData.monthlySavings)
    const extraPaychecks = parseFormattedNumber(formData.extraPaychecks)
    const initialHousePrice = parseFormattedNumber(formData.targetHousePrice)
    const downPaymentPercentage = parseFloat(formData.downPaymentPercentage) || 0
    const propertyTaxPercentage = parseFloat(formData.propertyTax) || 5
    const housePriceIncrease = parseFloat(formData.housePriceIncrease) || 5
    const agentCommission = parseFormattedNumber(formData.agentCommission)
    const notaryFee = parseFormattedNumber(formData.notaryFee)
    const appraisalFee = parseFormattedNumber(formData.appraisalFee)
    const mortgageBroker = parseFormattedNumber(formData.mortgageBroker)
    const mortgageAdvisor = parseFormattedNumber(formData.mortgageAdvisor)
    const landRegistryFee = parseFormattedNumber(formData.landRegistryFee)

    const monthlyHousePriceIncrease = Math.pow(1 + housePriceIncrease / 100, 1 / 12) - 1

    let months = 0
    let totalSavings = currentSavings
    let currentHousePrice = initialHousePrice
    
    const calculateTotalNeeded = (price: number) => {
      const downPaymentAmount = (price * downPaymentPercentage) / 100
      const commissionAmount = formData.isAgentCommissionPercentage
        ? (price * agentCommission) / 100
        : agentCommission
      const propertyTaxAmount = (price * propertyTaxPercentage) / 100
      
      return downPaymentAmount + commissionAmount + propertyTaxAmount +
             notaryFee + appraisalFee + mortgageBroker +
             mortgageAdvisor + landRegistryFee
    }

    let totalNeeded = calculateTotalNeeded(currentHousePrice)
    const maxMonths = 12 * 100 // Set a maximum of 100 years
    const annualResultsData: { year: number; savings: number; housePrice: number }[] = []

    while (totalSavings < totalNeeded && months < maxMonths) {
      months++
      currentHousePrice *= (1 + monthlyHousePriceIncrease)
      totalSavings += monthlySavings

      if (months % 12 === 0) {
        // Add extra paychecks annually
        totalSavings += extraPaychecks
        
        // Recalculate total needed based on new house price
        totalNeeded = calculateTotalNeeded(currentHousePrice)

        annualResultsData.push({
          year: months / 12,
          savings: totalSavings,
          housePrice: currentHousePrice
        })
      }
    }

    setAnnualResults(annualResultsData)
    setSliderValue([months])

    if (months >= maxMonths) {
      setResult({ type: 'error', message: t.cannotAfford })
      safeGtag('event', 'calculation_impossible', {
        'initial_house_price': initialHousePrice,
        'monthly_savings': monthlySavings
      });
    } else {
      updateResult(months, currentHousePrice, 
        (currentHousePrice * downPaymentPercentage) / 100,
        formData.isAgentCommissionPercentage ? (currentHousePrice * agentCommission) / 100 : agentCommission,
        (currentHousePrice * propertyTaxPercentage) / 100,
        notaryFee, appraisalFee, mortgageBroker, mortgageAdvisor, landRegistryFee,
        calculateTotalNeeded(currentHousePrice),
        monthlySavings
      );
      safeGtag('event', 'calculation_complete', {
        'years_needed': Math.floor(months / 12),
        'months_needed': months % 12,
        'total_savings_needed': totalNeeded,
        'house_price': currentHousePrice
      });
    }
  }
  
  setTimeout(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}, [formData, t])

// If you really need updateResult in the dependency array, make sure it's wrapped in useCallback
const updateResultCallback = useCallback(updateResult, []);

const handleSliderChange = (value: number[]) => {
  setSliderValue(value)
  const newMonths = value[0]
  
  const currentSavings = parseFormattedNumber(formData.currentSavings)
  const extraPaychecks = parseFormattedNumber(formData.extraPaychecks)
  const initialHousePrice = parseFormattedNumber(formData.targetHousePrice)
  const downPaymentPercentage = parseFloat(formData.downPaymentPercentage) || 0
  const propertyTaxPercentage = parseFloat(formData.propertyTax) || 5
  const housePriceIncrease = parseFloat(formData.housePriceIncrease) || 5
  const agentCommission = parseFormattedNumber(formData.agentCommission)
  const notaryFee = parseFormattedNumber(formData.notaryFee)
  const appraisalFee = parseFormattedNumber(formData.appraisalFee)
  const mortgageBroker = parseFormattedNumber(formData.mortgageBroker)
  const mortgageAdvisor = parseFormattedNumber(formData.mortgageAdvisor)
  const landRegistryFee = parseFormattedNumber(formData.landRegistryFee)

  const monthlyHousePriceIncrease = Math.pow(1 + housePriceIncrease / 100, 1/12) - 1

  // Calculate final house price after the selected period
  let currentHousePrice = initialHousePrice
  for (let month = 1; month <= newMonths; month++) {
    currentHousePrice *= (1 + monthlyHousePriceIncrease)
  }

  // Calculate total amount needed at the target date
  const calculateTotalNeeded = (price: number) => {
    const downPaymentAmount = (price * downPaymentPercentage) / 100
    const commissionAmount = formData.isAgentCommissionPercentage
      ? (price * agentCommission) / 100
      : agentCommission
    const propertyTaxAmount = (price * propertyTaxPercentage) / 100
    
    return downPaymentAmount + commissionAmount + propertyTaxAmount +
           notaryFee + appraisalFee + mortgageBroker +
           mortgageAdvisor + landRegistryFee
  }

  const totalNeeded = calculateTotalNeeded(currentHousePrice)

  // Calculate total contribution from extra paychecks
  const totalYears = Math.floor(newMonths / 12)
  const totalExtraPayments = totalYears * extraPaychecks

  // Calculate required monthly savings
  const remainingAmount = totalNeeded - currentSavings - totalExtraPayments
  const requiredMonthlySavings = Math.max(0, remainingAmount / newMonths)

  // Calculate annual results with the new monthly savings
  let months = 0
  let totalSavings = currentSavings
  currentHousePrice = initialHousePrice
  const annualResultsData: { year: number; savings: number; housePrice: number }[] = []

  while (months < newMonths) {
    months++
    currentHousePrice *= (1 + monthlyHousePriceIncrease)
    totalSavings += requiredMonthlySavings

    if (months % 12 === 0) {
      totalSavings += extraPaychecks
      annualResultsData.push({
        year: months / 12,
        savings: totalSavings,
        housePrice: currentHousePrice
      })
    }
  }

  // Add final partial year if needed
  if (months % 12 !== 0) {
    annualResultsData.push({
      year: months / 12,
      savings: totalSavings,
      housePrice: currentHousePrice
    })
  }

  // Update results display
  updateResultCallback(
    newMonths,
    currentHousePrice,
    currentHousePrice * (downPaymentPercentage / 100),
    formData.isAgentCommissionPercentage ? (currentHousePrice * agentCommission / 100) : agentCommission,
    currentHousePrice * propertyTaxPercentage / 100,
    notaryFee,
    appraisalFee,
    mortgageBroker,
    mortgageAdvisor,
    landRegistryFee,
    totalNeeded,
    requiredMonthlySavings // Use the newly calculated monthly savings
  )

  setAnnualResults(annualResultsData)
}

const renderInputField = (field: { id: string; label: string; placeholder: string; description: string; required?: boolean; symbol?: string }) => (
  <div key={field.id} className="space-y-2">
    <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </Label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        {field.symbol || currency}
      </span>
      <Input
        id={field.id}
        name={field.id}
        type="text"
        inputMode="numeric"
        placeholder={`e.g., ${field.placeholder}`}
        value={formData[field.id as keyof typeof formData]}
        onChange={handleInputChange}
        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        onWheel={(e) => e.currentTarget.blur()}
        required={field.required}
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
  </div>
)

// Update the Google Analytics implementation
useEffect(() => {
  const loadGA = () => {
    try {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-SPZZ5T3JZT');
    } catch (error) {
      console.warn('Google Analytics failed to load:', error);
    }
  };

  // Only load GA in production
  if (process.env.NODE_ENV === 'production') {
    loadGA();
  }
}, []);

return (
  <div className="space-y-8 relative min-h-screen pb-4 px-4">
    {process.env.NODE_ENV === 'production' && (
      <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SPZZ5T3JZT"
          strategy="lazyOnload"
          onError={(e) => {
            console.warn('Google Analytics failed to load:', e);
          }}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          onError={(e) => {
            console.warn('Google Analytics config failed to load:', e);
          }}
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SPZZ5T3JZT');
          `}
        </Script>
      </>
    )}
    
    {isLoading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    ) : (
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <div>
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
            <CardDescription className="text-gray-100">{t.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form className="space-y-4">
            {[
              { id: "targetHousePrice", label: t.targetHousePrice, placeholder: "200,000", description: t.targetHousePriceDescription, required: true },
              { id: "monthlySavings", label: t.monthlySavings, placeholder: "1,000", description: t.monthlySavingsDescription, required: true },
              { id: "currentSavings", label: t.currentSavings, placeholder: "10,000", description: t.currentSavingsDescription },
              { id: "extraPaychecks", label: t.extraPaychecks, placeholder: "5,000", description: t.extraPaychecksDescription },
              { id: "downPaymentPercentage", label: t.downPaymentPercentage, placeholder: "20", description: t.downPaymentDescription, symbol: "%" },
            ].map(renderInputField)}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t.advancedTitle}
                </h3>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.advancedInfo}</p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-4">
                {renderInputField({ id: "propertyTax", label: t.propertyTax, placeholder: "5", description: t.propertyTaxDescription, symbol: "%" })}
                <div className="space-y-2">
                  <Label htmlFor="agentCommission" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.agentCommission}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{currency}</span>
                    <Switch
                      id="isAgentCommissionPercentage"
                      checked={formData.isAgentCommissionPercentage}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      {formData.isAgentCommissionPercentage ? '%' : currency}
                    </span>
                    <Input
                      id="agentCommission"
                      name="agentCommission"
                      type="text"
                      inputMode="numeric"
                      placeholder={formData.isAgentCommissionPercentage ? "e.g., 3" : "e.g., 3,000"}
                      value={formData.agentCommission}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.agentCommissionDescription}</p>
                </div>
                {[
                  { id: "housePriceIncrease", label: t.housePriceIncrease, placeholder: "5", description: t.housePriceIncreaseDescription, symbol: "%" },
                  { id: "notaryFee", label: t.notaryFee, placeholder: "500", description: t.notaryFeeDescription },
                  { id: "appraisalFee", label: t.appraisalFee, placeholder: "500", description: t.appraisalFeeDescription },
                  { id: "mortgageBroker", label: t.mortgageBroker, placeholder: "0", description: t.mortgageBrokerDescription },
                  { id: "mortgageAdvisor", label: t.mortgageAdvisor, placeholder: "0", description: t.mortgageAdvisorDescription },
                  { id: "landRegistryFee", label: t.landRegistryFee, placeholder: "500", description: t.landRegistryFeeDescription },
                ].map(renderInputField)}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-6">
          {result && (
            <div ref={resultRef} className="w-full">
              <div className="mt-4 text-center text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {result.message.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              {result.type === 'success' && (
                <>
                  <div className="mt-6">
                    <Label htmlFor="time-to-buy-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.timeToBuySlider}
                    </Label>
                    <Slider
                      id="time-to-buy-slider"
                      min={1}
                      max={120}
                      step={1}
                      value={sliderValue}
                      onValueChange={handleSliderChange}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 {t.months}</span>
                      <span>10 {t.years}</span>
                    </div>
                  </div>
                  <div className="flex justify-center w-full mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-4 rounded-full hover:from-blue-600 hover:to-cyan-600 transition duration-300 ease-in-out transform hover:scale-105">
                          {t.viewAnnualResults}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{t.annualResultsTitle}</DialogTitle>
                        </DialogHeader>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" className="px-6 py-3">{t.year}</th>
                              <th scope="col" className="px-6 py-3">{t.totalSavings}</th>
                              <th scope="col" className="px-6 py-3">{t.housePrice}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {annualResults.map((result, index) => (
                              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{result.year}</td>
                                <td className="px-6 py-4">{currency}{formatNumber(result.savings.toFixed(0))}</td>
                                <td className="px-6 py-4">{currency}{formatNumber(result.housePrice.toFixed(0))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    )}
    <div className="w-full max-w-md mx-auto mt-6">
     <Button 
       onClick={() => window.open(language === 'en' ? 'https://forms.gle/YcaUdGTnje233B4q6' : 'https://forms.gle/vZL4mErQXqED9fiWA', '_blank')}
       className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-2 px-4 rounded-full hover:from-green-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
     >
       {t.feedbackButton}
     </Button>
   </div>
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => {
          safeGtag('event', 'form_submit', {
            'house_price': formData.targetHousePrice,
            'monthly_savings': formData.monthlySavings
          });
          calculateDownPaymentTime();
        }} 
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        {t.calculate}
      </Button>
    </div>
  </div>
)
}

