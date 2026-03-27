import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { faculty, institutes } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Star, MessageSquare, Send, Languages, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  showHeader?: boolean;
}

const FeedbackForm = ({ showHeader = true }: FeedbackFormProps) => {
  const { t, language, setLanguage, isTeluguActive } = useLanguage();
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredFaculty = selectedInstitute
    ? faculty.filter((f) => f.instituteId === selectedInstitute)
    : faculty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFaculty || rating === 0) {
      toast.error('Please select a faculty member and provide a rating');
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    toast.success(
      isTeluguActive
        ? 'మీ అభిప్రాయం విజయవంతంగా సమర్పించబడింది!'
        : 'Your feedback has been submitted successfully!'
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center animate-fade-in">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isTeluguActive ? 'ధన్యవాదాలు!' : 'Thank You!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isTeluguActive
                ? 'మీ అభిప్రాయం మాకు చాలా విలువైనది.'
                : 'Your feedback is valuable to us.'}
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedFaculty('');
                setRating(0);
                setComments('');
              }}
            >
              {isTeluguActive ? 'మరొక అభిప్రాయం ఇవ్వండి' : 'Submit Another Feedback'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      {showHeader && (
        <div className="gov-header">
          <div className="accent-bar" />
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div className="gov-seal">
              <div className="gov-seal-icon">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-tight">{t('feedback.title')}</h1>
                <p className="text-xs text-white/80">{t('app.subtitle')}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-white/10 gap-2"
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            >
              <Languages className="h-4 w-4" />
              {language === 'en' ? 'తెలుగు' : 'English'}
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className={cn("max-w-2xl mx-auto p-4", showHeader ? "pt-8" : "")}>
        <Card className="shadow-elevated animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('feedback.title')}</CardTitle>
            <CardDescription>
              {isTeluguActive
                ? 'మీ అనుభవాన్ని పంచుకోండి మరియు మా సేవలను మెరుగుపరచడంలో సహాయపడండి'
                : 'Share your experience and help us improve our services'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institute Selection */}
              <div className="space-y-2">
                <Label>{t('table.institute')}</Label>
                <Select
                  value={selectedInstitute}
                  onValueChange={(value) => {
                    setSelectedInstitute(value);
                    setSelectedFaculty('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isTeluguActive ? 'సంస్థను ఎంచుకోండి' : 'Select Institute'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {isTeluguActive ? inst.nameTE : inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faculty Selection */}
              <div className="space-y-2">
                <Label>{t('feedback.selectFaculty')} *</Label>
                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isTeluguActive ? 'ఫ్యాకల్టీని ఎంచుకోండి' : 'Select Faculty'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFaculty.map((fac) => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {isTeluguActive ? fac.nameTE : fac.name} -{' '}
                        {isTeluguActive ? fac.tradeTE : fac.trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>{t('feedback.rating')} *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-110"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={cn(
                          'h-8 w-8 transition-colors',
                          (hoverRating || rating) >= star
                            ? 'text-accent fill-accent'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating === 1 && (isTeluguActive ? 'చాలా చెడ్డది' : 'Very Poor')}
                      {rating === 2 && (isTeluguActive ? 'చెడ్డది' : 'Poor')}
                      {rating === 3 && (isTeluguActive ? 'సగటు' : 'Average')}
                      {rating === 4 && (isTeluguActive ? 'మంచిది' : 'Good')}
                      {rating === 5 && (isTeluguActive ? 'అద్భుతం' : 'Excellent')}
                    </span>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label>{t('feedback.comments')}</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    isTeluguActive
                      ? 'మీ అభిప్రాయాన్ని ఇక్కడ రాయండి...'
                      : 'Write your feedback here...'
                  }
                  className="min-h-[120px]"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  {t('feedback.anonymous')}
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                {t('feedback.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {isTeluguActive
            ? 'మీ అభిప్రాయం రహస్యంగా ఉంచబడుతుంది'
            : 'Your feedback will be kept confidential'}
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;
