'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { useFaultStore } from '@/lib/store';
import { villages, telanganaDistricts, getTechnicianByVillage, getVillageById } from '@/lib/data';
import type { FaultUrgency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { GramSahayak } from '@/components/gram-sahayak';
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  Sun,
  Zap,
  Battery,
  Activity,
  AlertTriangle,
  CheckCircle,
  Send,
  X,
  Map,
  Bot
} from 'lucide-react';

const deviceTypes = [
  { value: 'solar_panel', labelKey: 'solarPanel', icon: Sun },
  { value: 'microgrid', labelKey: 'microgrid', icon: Zap },
  { value: 'inverter', labelKey: 'inverter', icon: Activity },
  { value: 'battery', labelKey: 'battery', icon: Battery },
  { value: 'transformer', labelKey: 'transformer', icon: Zap },
];

const urgencyLevels: { value: FaultUrgency; labelKey: string; color: string }[] = [
  { value: 'low', labelKey: 'low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', labelKey: 'medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', labelKey: 'high', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', labelKey: 'critical', color: 'bg-red-100 text-red-800' },
];

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useSettings();
  const { addFault } = useFaultStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Manual location selection
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedMandal, setSelectedMandal] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>(user?.village || '');

  const [formData, setFormData] = useState({
    deviceType: '' as string,
    description: '',
    urgency: 'medium' as FaultUrgency,
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleAiReportComplete = (summary: any) => {
    const summaryText = language === 'te' 
      ? `గ్రామ్-సహాయక్ నుండి సారాంశం:\n\nసమస్య: ${summary.issue}\nరోగనిర్ధారణ: ${summary.technicalObservation}\nతీవ్రత: ${summary.severity}`
      : language === 'hi'
        ? `ग्राम-सहायक से सारांश:\n\nसमस्या: ${summary.issue}\nनिदान: ${summary.technicalObservation}\nगंभीरता: ${summary.severity}`
        : `Summary from Gram-Sahayak:\n\nIssue: ${summary.issue}\nDiagnosis: ${summary.technicalObservation}\nSeverity: ${summary.severity}`;

    setFormData(prev => ({
      ...prev,
      description: summaryText,
      urgency: summary.severity.toLowerCase() === 'high' ? 'high' : 'medium'
    }));

    // Try to match device type
    const deviceMatch = deviceTypes.find(d => 
      summary.machine?.toLowerCase().includes(t(d.labelKey).toLowerCase()) ||
      summary.issue?.toLowerCase().includes(t(d.labelKey).toLowerCase())
    );
    if (deviceMatch) {
      setFormData(prev => ({ ...prev, deviceType: deviceMatch.value }));
    }
  };

  // Get unique mandals for selected district
  const mandalsInDistrict = Array.from(
    new Set(villages.filter((v) => v.district === selectedDistrict).map((v) => v.mandal))
  );

  // Get villages for selected mandal
  const villagesInMandal = villages.filter(
    (v) => v.district === selectedDistrict && v.mandal === selectedMandal
  );

  useEffect(() => {
    // Check for captured image from camera page
    const storedImage = sessionStorage.getItem('capturedImage');
    if (storedImage) {
      setCapturedImage(storedImage);
      sessionStorage.removeItem('capturedImage');
    }
  }, []);

  // Reset dependent selections when parent changes
  useEffect(() => {
    setSelectedMandal('');
    setSelectedVillageId('');
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedVillageId('');
  }, [selectedMandal]);

  // Auto-set location when village is selected
  useEffect(() => {
    if (selectedVillageId) {
      const village = getVillageById(selectedVillageId);
      if (village) {
        setLocation(village.coordinates);
      }
    }
  }, [selectedVillageId]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError('Could not get GPS location. Using village coordinates.');
        const village = getVillageById(selectedVillageId);
        if (village) {
          setLocation(village.coordinates);
        }
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillageId || !formData.deviceType || !formData.description) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const village = getVillageById(selectedVillageId);
    const technician = getTechnicianByVillage(selectedVillageId);

    addFault({
      reporterId: user?.id || '',
      reporterName: user?.name || '',
      reporterPhone: user?.phone || '',
      villageId: selectedVillageId,
      villageName: village?.name || '',
      deviceType: formData.deviceType as 'solar_panel' | 'microgrid' | 'inverter' | 'battery' | 'transformer',
      description: formData.description,
      imageUrl: capturedImage || undefined,
      coordinates: location || village?.coordinates,
      status: 'pending',
      urgency: formData.urgency,
      assignedTechnicianId: technician?.id,
      assignedTechnicianName: technician?.name,
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push('/reporter');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('faultReportedSuccess')}</h2>
          <p className="text-muted-foreground mb-4">{t('technicianNotified')}</p>
          <Spinner className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-8 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('reportNewFault')}</h2>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          onClick={() => setShowAiAssistant(true)}
        >
          <Bot className="h-4 w-4" />
          Gram-Sahayak AI
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {t('faultImage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {capturedImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capturedImage}
                  alt="Fault"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setCapturedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/reporter/camera')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {t('camera')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Gallery
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Manual Location Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Map className="h-4 w-4 text-primary" />
              {t('manualLocationSelection')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* District Selection */}
            <div className="space-y-2">
              <Label>{t('selectDistrict')}</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDistrict')} />
                </SelectTrigger>
                <SelectContent>
                  {telanganaDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mandal Selection */}
            {selectedDistrict && (
              <div className="space-y-2">
                <Label>{t('selectMandal')}</Label>
                <Select value={selectedMandal} onValueChange={setSelectedMandal}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectMandal')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mandalsInDistrict.map((mandal) => (
                      <SelectItem key={mandal} value={mandal}>
                        {mandal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Village Selection */}
            {selectedMandal && (
              <div className="space-y-2">
                <Label>{t('selectVillage')}</Label>
                <Select value={selectedVillageId} onValueChange={setSelectedVillageId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectVillage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {villagesInMandal.map((village) => (
                      <SelectItem key={village.id} value={village.id}>
                        {village.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Type */}
        <div className="space-y-2">
          <Label>{t('deviceType')}</Label>
          <div className="grid grid-cols-2 gap-2">
            {deviceTypes.map((device) => {
              const Icon = device.icon;
              const isSelected = formData.deviceType === device.value;
              return (
                <button
                  key={device.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, deviceType: device.value })}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{t(device.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t('problemDescription')}</Label>
          <Textarea
            id="description"
            placeholder="Describe the fault in detail..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'outline'}
            size="sm"
            onClick={toggleRecording}
            className="mt-1"
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Voice
              </>
            )}
          </Button>
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <Label>{t('urgencyLevel')}</Label>
          <Select
            value={formData.urgency}
            onValueChange={(value: FaultUrgency) => setFormData({ ...formData, urgency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{t(level.labelKey)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* GPS Location */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {location
                    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : t('location')}
                </span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={getLocation}>
                {t('getLocation')}
              </Button>
            </div>
            {locationError && (
              <p className="text-xs text-muted-foreground mt-2">{locationError}</p>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || !formData.deviceType || !formData.description || !selectedVillageId}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              {t('submit')}
            </>
          )}
        </Button>
      </form>

      {/* AI Assistant Modal */}
      {showAiAssistant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
          <GramSahayak 
            onReportComplete={handleAiReportComplete}
            onClose={() => setShowAiAssistant(false)}
          />
        </div>
      )}
    </div>
  );
}
