'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, Send, X, Bot, User, Camera, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface ReportData {
  issue?: string;
  machine?: string;
  location?: string;
  technicalObservation?: string;
  severity?: 'High' | 'Medium' | 'Low';
}

interface GramSahayakProps {
  onReportComplete: (report: any) => void;
  onClose: () => void;
}

export function GramSahayak({ onReportComplete, onClose }: GramSahayakProps) {
  const { t, language } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'A' | 'B' | 'C' | 'D' | 'COMPLETE'>('A');
  const [reportData, setReportData] = useState<ReportData>({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const greeting = language === 'te' 
      ? "నమస్తే! నేను గ్రామ్-సహాయక్. ఈ రోజు మీకు ఏ సమస్య ఉంది?" 
      : language === 'hi' 
        ? "नमस्ते! मैं ग्राम-सहायक हूँ। आज आपको क्या समस्या है?" 
        : "Namaste! I am Gram-Sahayak. Which machine or facility is having a problem today?";
    
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      }
    ]);
    speak(greeting);
  }, [language]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good voice for the language
    const voices = window.speechSynthesis.getVoices();
    if (language === 'te') {
      utterance.lang = 'te-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    processLogic(text);
  };

  const processLogic = async (text: string) => {
    // Artificial delay for "thinking"
    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = "";
    let nextStep = currentStep;

    if (currentStep === 'A') {
      setReportData(prev => ({ ...prev, machine: text }));
      response = language === 'te'
        ? "నేను అర్థం చేసుకున్నాను. ఇది శబ్దం చేస్తోందా లేదా పూర్తిగా ఆగిపోయిందా? ఏవైనా వాసనలు వస్తున్నాయా?"
        : language === 'hi'
          ? "मैं समझ गया। क्या यह शोर कर रहा है या पूरी तरह से बंद हो गया है? क्या कोई गंध आ रही है?"
          : "I understand. Is it making a grinding noise, or is it completely silent? Are there any leaks or smells of burning?";
      nextStep = 'B';
    } else if (currentStep === 'B') {
      setReportData(prev => ({ ...prev, technicalObservation: text, severity: text.toLowerCase().includes('smoke') || text.toLowerCase().includes('fire') ? 'High' : 'Medium' }));
      response = language === 'te'
        ? "దయచేసి దెబ్బతిన్న భాగం యొక్క ఫోటోను తీయండి. ఇది నాకు సమస్యను బాగా అర్థం చేసుకోవడానికి సహాయపడుతుంది. మీరు దాన్ని 'అటాచ్మెంట్' బటన్ ద్వారా అప్లోడ్ చేయవచ్చు."
        : language === 'hi'
          ? "कृपया क्षतिग्रस्त हिस्से की फोटो लें। इससे मुझे समस्या को बेहतर ढंग से समझने में मदद मिलेगी। आप इसे 'अटैचमेंट' बटन का उपयोग करके अपलोड कर सकते हैं।"
          : "Please take a clear photo of the damaged part. I need to see the component to help you better. You can upload it using the 'Attachment' button on the reporter page.";
      nextStep = 'C';
    } else if (currentStep === 'C') {
      response = language === 'te'
        ? "ధన్యవాదాలు. రిపేర్ చేసేటప్పుడు దయచేసి జాగ్రత్తగా ఉండండి. వైర్లను తాకడానికి ముందు మెయిన్ పవర్ స్విచ్ ఆఫ్ చేయండి. టెక్నీషియన్ వస్తున్నారు."
        : language === 'hi'
          ? "धन्यवाद। मरम्मत करते समय कृपया सावधान रहें। तारों को छूने से पहले मुख्य पावर स्विच बंद कर दें। तकनीशियन आ रहा है।"
          : "Thank you. Please be safe while checking. Turn off the main power switch before touching any wires. A technician has been alerted.";
      nextStep = 'D';
    } else if (currentStep === 'D') {
      response = language === 'te'
        ? "మీ రిపోర్ట్ సిద్ధంగా ఉంది. దాన్ని సబ్మిట్ చేయడానికి 'Done' అని చెప్పండి."
        : language === 'hi'
          ? "आपकी रिपोर्ट तैयार है। इसे सबमिट करने के लिए 'Done' कहें।"
          : "Your report is ready. Speak 'Done' to finalize the submission.";
      
      if (text.toLowerCase().includes('done') || text.includes('పూర్తయింది') || text.includes('हो गया')) {
        nextStep = 'COMPLETE';
      }
    }

    if (nextStep === 'COMPLETE') {
      const summary = {
        issue: reportData.machine,
        machine: reportData.machine,
        severity: reportData.severity || 'Medium',
        technicalObservation: reportData.technicalObservation,
        actionTaken: "User provided diagnostic details via Gram-Sahayak"
      };
      
      const finalMsg = language === 'te'
        ? "రిపోర్ట్ విజయవంతంగా రూపొందించబడింది! నేను మీ కోసం ఫారమ్ నింపేసాను."
        : language === 'hi'
          ? "रिपोर्ट सफलतापूर्वक जेनरेट की गई! मैंने आपके लिए फॉर्म भर दिया है।"
          : "Report generated successfully! I have auto-filled the form for you.";
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: finalMsg,
        timestamp: new Date(),
      }]);
      speak(finalMsg);
      onReportComplete(summary);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
      speak(response);
      setCurrentStep(nextStep);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card shadow-xl border-primary/20 flex flex-col h-[500px] overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground py-3 px-4 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Gram-Sahayak AI
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-secondary/30">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'assistant'
                      ? 'bg-card border border-primary/10 rounded-tl-none shadow-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-none shadow-md'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isSpeaking && (
              <div className="flex justify-start">
                <div className="bg-primary/5 rounded-full p-2 animate-pulse">
                  <Volume2 className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t bg-card shrink-0">
        <div className="flex w-full gap-2 items-center">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className={`rounded-full shadow-sm transition-all ${isListening ? 'animate-pulse' : ''}`}
            onClick={startListening}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full bg-secondary/50 border-none rounded-2xl py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder={language === 'te' ? "టైప్ చేయండి..." : language === 'hi' ? "टाइप करें..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
              onClick={() => handleSend()}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Quick Summary Preview */}
      {currentStep === 'COMPLETE' && (
        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-primary/10 rounded-full p-4 mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Report Summary</h3>
          <div className="bg-secondary/50 rounded-xl p-4 w-full text-left space-y-2 text-sm mb-6">
            <p><strong>Issue:</strong> {reportData.machine}</p>
            <p><strong>Severity:</strong> <span className={reportData.severity === 'High' ? 'text-destructive font-bold' : 'text-primary'}>{reportData.severity}</span></p>
            <p><strong>Diagnosis:</strong> {reportData.technicalObservation}</p>
          </div>
          <Button onClick={onClose} className="w-full">
            Great, Thanks!
          </Button>
        </div>
      )}
    </Card>
  );
}
